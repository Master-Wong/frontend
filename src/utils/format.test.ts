import {
  formatAmount,
  formatPaymentMethod,
  formatReceiptDate,
  getDonorDisplayName,
  getPaymentFailureMessage,
} from './format';

describe('format utils', () => {
  it('formats amounts with KSh prefix', () => {
    expect(formatAmount(1000)).toBe('KSh 1,000');
  });

  it('formats payment method labels', () => {
    expect(formatPaymentMethod('mpesa')).toBe('M-Pesa');
    expect(formatPaymentMethod('card')).toBe('Card');
  });

  it('formats receipt dates in en-GB locale', () => {
    expect(formatReceiptDate('2026-01-15T10:00:00.000Z')).toMatch(/15 January 2026/);
  });

  it('builds donor display names from first and last name', () => {
    expect(getDonorDisplayName('Jane', 'Doe')).toBe('Jane Doe');
    expect(getDonorDisplayName('  Jane ', ' ')).toBe('Jane');
  });

  it('returns method-specific payment failure messages', () => {
    expect(getPaymentFailureMessage('mpesa')).toContain('M-Pesa');
    expect(getPaymentFailureMessage('card')).toContain('card was declined');
  });
});
