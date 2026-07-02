export type PaymentMethod = 'mpesa' | 'card';
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
  status: string;
  message: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
}

export interface DonationReceipt {
  transactionId: string;
  status: string;
  donorName: string;
  email: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isAnonymous: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string[];
  message?: string;
}
