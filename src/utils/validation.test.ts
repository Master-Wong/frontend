import { initialFormState } from '../hooks/useDonationWizard';
import { validateStep } from './validation';

function futureExpiry(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

describe('validateStep', () => {
  it('requires a positive amount on step 1', () => {
    expect(validateStep(1, { ...initialFormState, amount: 0 })).toContain(
      'Please select or enter a valid donation amount.',
    );
  });

  it('requires donor details on step 2', () => {
    const errors = validateStep(2, initialFormState);

    expect(errors).toContain('First name is required.');
    expect(errors).toContain('Last name is required.');
    expect(errors).toContain('Email is required.');
  });

  it('validates M-Pesa phone on step 3', () => {
    const errors = validateStep(3, {
      ...initialFormState,
      paymentMethod: 'mpesa',
      phoneNumber: 'invalid',
    });

    expect(errors).toContain('Phone number format is invalid.');
  });

  it('validates card fields on step 3', () => {
    const errors = validateStep(3, {
      ...initialFormState,
      paymentMethod: 'card',
      cardNumber: '4111111111111111',
      nameOnCard: 'Jane Doe',
      expiry: futureExpiry(),
      cvc: '123',
    });

    expect(errors).toHaveLength(0);
  });
});
