import type { DonationFormState, WizardStep } from '../types/donation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const CVC_REGEX = /^\d{3,4}$/;

function isValidExpiry(expiry: string): boolean {
  const match = EXPIRY_REGEX.exec(expiry.trim());
  if (!match) return false;

  const month = Number.parseInt(match[1], 10);
  const year = 2000 + Number.parseInt(match[2], 10);
  const expiryEnd = new Date(year, month, 0, 23, 59, 59, 999);
  return expiryEnd >= new Date();
}

function isValidPhone(phone: string): boolean {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    digits = `254${digits.slice(1)}`;
  } else if (digits.length === 9 && digits.startsWith('7')) {
    digits = `254${digits}`;
  }
  return /^2547\d{8}$/.test(digits);
}

export function validateStep(step: WizardStep, form: DonationFormState): string[] {
  const errors: string[] = [];

  if (step === 1) {
    if (!form.amount || form.amount <= 0) {
      errors.push('Please select or enter a valid donation amount.');
    }
  }

  if (step === 2) {
    if (!form.firstName.trim()) errors.push('First name is required.');
    if (!form.lastName.trim()) errors.push('Last name is required.');
    if (!form.email.trim()) {
      errors.push('Email is required.');
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.push('Email format is invalid.');
    }
  }

  if (step === 3) {
    if (form.paymentMethod === 'mpesa') {
      const phone = form.phoneNumber.trim() || form.phone.trim();
      if (!phone) {
        errors.push('M-Pesa phone number is required.');
      } else if (!isValidPhone(phone)) {
        errors.push('Phone number format is invalid.');
      }
    }

    if (form.paymentMethod === 'card') {
      const digits = form.cardNumber.replace(/\s/g, '');
      if (!digits) errors.push('Card number is required.');
      else if (!/^\d{13,19}$/.test(digits)) errors.push('Card number must be 13 to 19 digits.');
      if (!form.nameOnCard.trim() || form.nameOnCard.trim().length < 2) {
        errors.push('Name on card is required.');
      }
      if (!form.expiry.trim() || !isValidExpiry(form.expiry)) {
        errors.push('Expiry must be a valid MM/YY date that is not in the past.');
      }
      if (!form.cvc.trim() || !CVC_REGEX.test(form.cvc.trim())) {
        errors.push('CVC must be 3 or 4 digits.');
      }
    }
  }

  return errors;
}
