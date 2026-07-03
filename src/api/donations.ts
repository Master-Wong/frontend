import type {
  ApiErrorResponse,
  DonationReceipt,
  DonationRequest,
  DonationSubmitResponse,
  PollOptions,
} from '../types/donation';
import { API_BASE } from '../config/apiBase';

export class DonationApiError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    // Wrap API error responses with HTTP status and validation details.
    super(message);
    this.status = status;
    this.details = details;
  }
}

function sleep(ms: number): Promise<void> {
  // Delay between donation status poll attempts.
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function parseError(response: Response): Promise<DonationApiError> {
  // Parse API error payload into a typed exception.
  const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;
  return new DonationApiError(
    response.status,
    data.message ?? data.error ?? 'Request failed',
    data.details,
  );
}

export async function submitDonation(
  payload: DonationRequest,
  idempotencyKey: string,
): Promise<DonationSubmitResponse> {
  // POST donation with idempotency key header.
  const response = await fetch(`${API_BASE}/api/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const data = (await response.json()) as Omit<DonationSubmitResponse, 'httpStatus'>;
  return { ...data, httpStatus: response.status };
}

export async function fetchDonation(transactionId: string): Promise<DonationReceipt> {
  // GET current donation status by transaction id.
  const response = await fetch(
    `${API_BASE}/api/donations/${encodeURIComponent(transactionId)}`,
  );

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<DonationReceipt>;
}

export async function pollDonationStatus(
  transactionId: string,
  options: PollOptions = {},
): Promise<DonationReceipt> {
  // Poll GET until donation completes, fails, or times out.
  const intervalMs = options.intervalMs ?? 2000;
  const maxAttempts = options.maxAttempts ?? 60;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const donation = await fetchDonation(transactionId);

    if (donation.status === 'completed') {
      return donation;
    }

    if (donation.status === 'failed') {
      throw new DonationApiError(
        402,
        donation.failureMessage ?? 'Payment failed. Please try again.',
      );
    }

    await sleep(intervalMs);
  }

  throw new DonationApiError(
    408,
    'Payment confirmation timed out. Please check your phone and try again.',
  );
}
