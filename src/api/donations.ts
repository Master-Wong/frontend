import type {
  ApiErrorResponse,
  DonationReceipt,
  DonationRequest,
  DonationSubmitResponse,
} from '../types/donation';

export class DonationApiError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseError(response: Response): Promise<DonationApiError> {
  const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;
  return new DonationApiError(
    response.status,
    data.message ?? data.error ?? 'Request failed',
    data.details,
  );
}

export async function submitDonation(
  payload: DonationRequest,
): Promise<DonationSubmitResponse> {
  const response = await fetch('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<DonationSubmitResponse>;
}

export async function fetchDonation(transactionId: string): Promise<DonationReceipt> {
  const response = await fetch(`/api/donations/${encodeURIComponent(transactionId)}`);

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<DonationReceipt>;
}
