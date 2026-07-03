import {
  formatAmount,
  formatExpiryInput,
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

  it('formats expiry input with a slash after the month', () => {
    expect(formatExpiryInput('1')).toBe('1');
    expect(formatExpiryInput('12')).toBe('12');
    expect(formatExpiryInput('122')).toBe('12/2');
    expect(formatExpiryInput('1227')).toBe('12/27');
    expect(formatExpiryInput('12/27')).toBe('12/27');
    expect(formatExpiryInput('12/271')).toBe('12/27');
  });
});
