import { useCallback, useState } from 'react';
import { DonationApiError, fetchDonation, submitDonation } from '../api/donations';
import type {
  DonationFormState,
  DonationReceipt,
  DonationRequest,
  WizardStep,
} from '../types/donation';
import { getDonorDisplayName } from '../utils/format';
import { validateStep } from '../utils/validation';

export const PRESET_AMOUNTS = [500, 1000, 2000, 3000];

export const initialFormState: DonationFormState = {
  amount: 1000,
  customAmount: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  isAnonymous: false,
  paymentMethod: 'mpesa',
  phoneNumber: '',
  cardNumber: '',
  nameOnCard: '',
  expiry: '',
  cvc: '',
};

function buildRequest(form: DonationFormState): DonationRequest {
  const payload: DonationRequest = {
    name: getDonorDisplayName(form.firstName, form.lastName),
    email: form.email.trim(),
    amount: form.amount ?? 0,
    paymentMethod: form.paymentMethod,
    isAnonymous: form.isAnonymous,
  };

  if (form.paymentMethod === 'mpesa') {
    payload.phoneNumber = (form.phoneNumber.trim() || form.phone.trim());
  }

  if (form.paymentMethod === 'card') {
    payload.cardNumber = form.cardNumber.replace(/\s/g, '');
    payload.nameOnCard = form.nameOnCard.trim();
    payload.expiry = form.expiry.trim();
    payload.cvc = form.cvc.trim();
  }

  return payload;
}

export function useDonationWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<DonationFormState>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const updateForm = useCallback((updates: Partial<DonationFormState>) => {
    setForm((current) => ({ ...current, ...updates }));
    setErrors([]);
    setPaymentError(null);
  }, []);

  const goToStep = useCallback((nextStep: WizardStep) => {
    const stepErrors = validateStep(step, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);
    setStep(nextStep);
  }, [form, step]);

  const goBack = useCallback(() => {
    setErrors([]);
    setPaymentError(null);
    setStep((current) => Math.max(1, current - 1) as WizardStep);
  }, []);

  const submitPayment = useCallback(async () => {
    const stepErrors = validateStep(3, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);
    setErrors([]);

    try {
      const result = await submitDonation(buildRequest(form));
      setStep(4);

      try {
        const receiptData = await fetchDonation(result.transactionId);
        setReceipt(receiptData);
        setReceiptError(null);
      } catch {
        setReceiptError('Donation succeeded but receipt details could not be loaded.');
      }
    } catch (error) {
      if (error instanceof DonationApiError) {
        if (error.status === 402) {
          setPaymentError(error.message);
        } else if (error.details?.length) {
          setErrors(error.details);
        } else {
          setPaymentError(error.message);
        }
      } else {
        setPaymentError('Unable to process your donation. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const resetWizard = useCallback(() => {
    setStep(1);
    setForm(initialFormState);
    setErrors([]);
    setIsSubmitting(false);
    setPaymentError(null);
    setReceipt(null);
    setReceiptError(null);
  }, []);

  return {
    step,
    form,
    errors,
    isSubmitting,
    paymentError,
    receipt,
    receiptError,
    updateForm,
    goToStep,
    goBack,
    submitPayment,
    resetWizard,
  };
}
