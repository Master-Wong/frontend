import {
  DonationApiError,
  fetchDonation,
  pollDonationStatus,
  submitDonation,
} from './donations';

describe('donations api', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('submits a donation with an idempotency key', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        transactionId: 'CARD-123',
        status: 'completed',
        message: 'Donation received successfully.',
        amount: 1000,
        paymentMethod: 'card',
        isAnonymous: false,
      }),
    }) as jest.Mock;

    const result = await submitDonation(
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        amount: 1000,
        paymentMethod: 'card',
        isAnonymous: false,
      },
      'test-idempotency-key',
    );

    expect(result.httpStatus).toBe(201);
    expect(result.transactionId).toBe('CARD-123');
    expect(fetch).toHaveBeenCalledWith(
      '/api/donations',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Idempotency-Key': 'test-idempotency-key' }),
      }),
    );
  });

  it('throws DonationApiError on failed responses', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 402,
      json: async () => ({ message: 'Payment failed' }),
    }) as jest.Mock;

    await expect(
      submitDonation(
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          amount: 1001,
          paymentMethod: 'card',
          isAnonymous: false,
        },
        'key',
      ),
    ).rejects.toBeInstanceOf(DonationApiError);
  });

  it('polls until a donation completes', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'pending', transactionId: 'MPESA-1' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'completed',
          transactionId: 'MPESA-1',
          amount: 1000,
        }),
      }) as jest.Mock;

    const receipt = await pollDonationStatus('MPESA-1', { intervalMs: 1, maxAttempts: 5 });

    expect(receipt.status).toBe('completed');
  });

  it('throws when polling detects a failed donation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'failed',
        failureMessage: 'M-Pesa STK push was declined',
      }),
    }) as jest.Mock;

    await expect(
      pollDonationStatus('MPESA-2', { intervalMs: 1, maxAttempts: 2 }),
    ).rejects.toMatchObject({ status: 402 });
  });

  it('fetches a donation receipt by transaction id', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ transactionId: 'CARD-99', status: 'completed' }),
    }) as jest.Mock;

    const receipt = await fetchDonation('CARD-99');

    expect(receipt.transactionId).toBe('CARD-99');
    expect(fetch).toHaveBeenCalledWith('/api/donations/CARD-99');
  });
});
