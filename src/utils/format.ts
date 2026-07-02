import type { PaymentMethod } from '../types/donation';

export function formatAmount(amount: number): string {
  // Format numeric amount as localized KSh string.
  return `KSh ${amount.toLocaleString()}`;
}

export function formatPaymentMethod(method: PaymentMethod): string {
  // Map payment method code to display label.
  return method === 'mpesa' ? 'M-Pesa' : 'Card';
}

export function formatReceiptDate(isoDate: string): string {
  // Format ISO timestamp for receipt display.
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDonorDisplayName(firstName: string, lastName: string): string {
  // Combine trimmed first and last names for API payload.
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

export function getPaymentFailureMessage(method: PaymentMethod): string {
  // Return user-facing failure copy for the selected payment method.
  if (method === 'mpesa') {
    return 'The M-Pesa request was cancelled or timed out, or there were insufficient funds. No money was deducted.';
  }

  return 'Your card was declined or the payment could not be processed. No money was deducted.';
}
