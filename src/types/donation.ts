export type PaymentMethod = 'mpesa' | 'card';
export type DonationStatus = 'pending' | 'completed' | 'failed';
export type WizardStep = 1 | 2 | 3 | 4;

export interface DonationFormState {
  amount: number | null;
  customAmount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  isAnonymous: boolean;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvc: string;
}

export interface DonationRequest {
  name: string;
  email: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
  phoneNumber?: string;
  cardNumber?: string;
  nameOnCard?: string;
  expiry?: string;
  cvc?: string;
}

export interface DonationSubmitResponse {
  transactionId: string;
  status: DonationStatus;
  message: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
  httpStatus: number;
}

export interface DonationReceipt {
  transactionId: string;
  status: DonationStatus;
  donorName?: string;
  email?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string;
  message?: string;
  failureMessage?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string[];
  message?: string;
}

export interface PollOptions {
  intervalMs?: number;
  maxAttempts?: number;
}
