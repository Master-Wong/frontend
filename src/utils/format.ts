import type { PaymentMethod } from '../types/donation';

export function formatAmount(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

export function formatPaymentMethod(method: PaymentMethod): string {
  return method === 'mpesa' ? 'M-Pesa' : 'Credit Card';
}

export function formatReceiptDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDonorDisplayName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}
