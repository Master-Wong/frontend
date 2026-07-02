import { useCallback, useRef, useState } from 'react';
import {
  DonationApiError,
  fetchDonation,
  pollDonationStatus,
  submitDonation,
} from '../api/donations';
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
  // Map wizard form state to API donation payload.
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
  // Manage donation wizard state, validation, and payment submission.
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<DonationFormState>(initialFormState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const getIdempotencyKey = useCallback(() => {
    // Reuse one key per payment attempt for safe retries.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }
    return idempotencyKeyRef.current;
  }, []);

  const updateForm = useCallback((updates: Partial<DonationFormState>) => {
    // Merge form updates and clear prior errors.
    setForm((current) => ({ ...current, ...updates }));
    setErrors([]);
    setPaymentError(null);
  }, []);

  const goToStep = useCallback((nextStep: WizardStep) => {
    // Validate current step before advancing.
    const stepErrors = validateStep(step, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);
    setStep(nextStep);
  }, [form, step]);

  const goBack = useCallback(() => {
    // Move to previous step and clear payment errors.
    setErrors([]);
    setPaymentError(null);
    setStep((current) => Math.max(1, current - 1) as WizardStep);
  }, []);

  const submitPayment = useCallback(async () => {
    // Submit payment and poll M-Pesa or fetch card receipt.
    const stepErrors = validateStep(3, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setIsPolling(false);
    setPaymentError(null);
    setErrors([]);

    try {
      const idempotencyKey = getIdempotencyKey();
      const result = await submitDonation(buildRequest(form), idempotencyKey);

      if (result.httpStatus === 202 || result.status === 'pending') {
        setIsPolling(true);
        const receiptData = await pollDonationStatus(result.transactionId);
        setReceipt(receiptData);
        setReceiptError(null);
        setStep(4);
        return;
      }

      const receiptData = await fetchDonation(result.transactionId);
      setReceipt(receiptData);
      setReceiptError(null);
      setStep(4);
    } catch (error) {
      if (error instanceof DonationApiError) {
        if (error.status === 402 || error.status === 408) {
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
      setIsPolling(false);
    }
  }, [form, getIdempotencyKey]);

  const useAnotherPaymentMethod = useCallback(() => {
    // Switch payment method and start a fresh idempotency key.
    idempotencyKeyRef.current = null;
    setPaymentError(null);
    setForm((current) => ({
      ...current,
      paymentMethod: current.paymentMethod === 'mpesa' ? 'card' : 'mpesa',
    }));
  }, []);

  const retryPayment = useCallback(() => {
    // Clear failure state and resubmit the same attempt.
    setPaymentError(null);
    void submitPayment();
  }, [submitPayment]);

  const resetWizard = useCallback(() => {
    // Reset all wizard state for a new donation.
    idempotencyKeyRef.current = null;
    setStep(1);
    setForm(initialFormState);
    setErrors([]);
    setIsSubmitting(false);
    setIsPolling(false);
    setPaymentError(null);
    setReceipt(null);
    setReceiptError(null);
  }, []);

  return {
    step,
    form,
    errors,
    isSubmitting,
    isPolling,
    paymentError,
    receipt,
    receiptError,
    updateForm,
    goToStep,
    goBack,
    submitPayment,
    useAnotherPaymentMethod,
    retryPayment,
    resetWizard,
  };
}
