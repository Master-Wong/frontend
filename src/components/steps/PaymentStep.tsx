import type { DonationFormState } from '../../types/donation';
import { getPaymentFailureMessage } from '../../utils/format';
import { CreditCardIcon, ErrorCircleIcon, PhoneIcon } from '../icons/Icons';

interface PaymentStepProps {
  form: DonationFormState;
  errors: string[];
  isSubmitting: boolean;
  isPolling: boolean;
  paymentError: string | null;
  onChange: (updates: Partial<DonationFormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  onUseAnotherMethod: () => void;
  onTryAgain: () => void;
}

// Render payment method selection, loading, and failure overlays.
export function PaymentStep({
  form,
  errors,
  isSubmitting,
  isPolling,
  paymentError,
  onChange,
  onBack,
  onSubmit,
  onUseAnotherMethod,
  onTryAgain,
}: PaymentStepProps) {
  const showFailureOverlay = Boolean(paymentError) && !isSubmitting && !isPolling;

  const paymentOptionClass = (selected: boolean) =>
    `flex flex-col items-center gap-2 py-[1.125rem] px-3 text-sm font-semibold font-sans border-[1.5px] rounded-xl cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
      selected
        ? 'border-green-500 bg-green-50 text-green-700 [&_.payment-icon]:text-green-600'
        : 'border-gray-200 bg-white text-gray-700 [&_.payment-icon]:text-gray-500'
    }`;

  return (
    <section className="relative">
      <h2 className="m-0 mb-1.5 text-lg font-bold text-gray-900">Payment Method</h2>
      <p className="m-0 mb-6 text-sm text-gray-500">Choose how you&apos;d like to complete your donation.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          className={paymentOptionClass(form.paymentMethod === 'mpesa')}
          onClick={() => onChange({ paymentMethod: 'mpesa' })}
          disabled={isSubmitting || isPolling}
        >
          <span className="payment-icon inline-flex [&_svg]:w-6 [&_svg]:h-6" aria-hidden="true">
            <PhoneIcon />
          </span>
          M-Pesa
        </button>
        <button
          type="button"
          className={paymentOptionClass(form.paymentMethod === 'card')}
          onClick={() => onChange({ paymentMethod: 'card' })}
          disabled={isSubmitting || isPolling}
        >
          <span className="payment-icon inline-flex [&_svg]:w-6 [&_svg]:h-6" aria-hidden="true">
            <CreditCardIcon />
          </span>
          Credit/Debit Card
        </button>
      </div>

      {form.paymentMethod === 'mpesa' && (
        <div className="mb-4">
          <p className="m-0 mb-4 text-[0.8125rem] text-gray-500 leading-relaxed">
            You will receive an STK push prompt on your phone. Enter your M-Pesa PIN to
            authorize the transaction.
          </p>
          <div className="field-group mb-4">
            <label htmlFor="phoneNumber">M-Pesa Phone Number</label>
            <input
              id="phoneNumber"
              className="input-field"
              value={form.phoneNumber}
              onChange={(event) => onChange({ phoneNumber: event.target.value })}
              placeholder="e.g. 0700 000 000 or 2547..."
              disabled={isSubmitting || isPolling}
            />
          </div>
        </div>
      )}

      {form.paymentMethod === 'card' && (
        <div className="mb-4">
          <div className="field-group mb-4">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              className="input-field"
              value={form.cardNumber}
              onChange={(event) => onChange({ cardNumber: event.target.value })}
              placeholder="0000 0000 0000 0000"
              disabled={isSubmitting || isPolling}
            />
          </div>
          <div className="field-group mb-4">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
              className="input-field"
              value={form.nameOnCard}
              onChange={(event) => onChange({ nameOnCard: event.target.value })}
              placeholder="Jane Doe"
              disabled={isSubmitting || isPolling}
            />
          </div>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[480px]:gap-4">
            <div className="field-group mb-4">
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                className="input-field"
                value={form.expiry}
                onChange={(event) => onChange({ expiry: event.target.value })}
                placeholder="MM/YY"
                disabled={isSubmitting || isPolling}
              />
            </div>
            <div className="field-group mb-4">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                className="input-field"
                value={form.cvc}
                onChange={(event) => onChange({ cvc: event.target.value })}
                placeholder="123"
                disabled={isSubmitting || isPolling}
              />
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <div className="flex gap-3 mt-6">
        <button type="button" className="btn-secondary min-w-24 shrink-0" onClick={onBack} disabled={isSubmitting || isPolling}>
          Back
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={onSubmit}
          disabled={isSubmitting || isPolling}
        >
          {isSubmitting
            ? 'Processing...'
            : form.paymentMethod === 'mpesa'
              ? 'Pay via M-Pesa'
              : 'Pay Now'}
        </button>
      </div>

      {(isSubmitting || isPolling) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 bg-white/95 rounded-lg">
          <div className="spinner" aria-hidden="true" />
          <h3 className="mt-4 mb-2 text-lg text-gray-900">
            {form.paymentMethod === 'mpesa'
              ? isPolling
                ? 'Waiting for confirmation on your phone…'
                : 'Check your phone'
              : 'Processing payment'}
          </h3>
          <p className="m-0 text-sm text-gray-500 max-w-80">
            {form.paymentMethod === 'mpesa'
              ? isPolling
                ? 'Enter your M-Pesa PIN to complete the donation. This may take a few seconds.'
                : 'An M-Pesa prompt has been sent to your phone. Enter your PIN to complete the donation.'
              : 'Please wait while we process your card payment.'}
          </p>
        </div>
      )}

      {showFailureOverlay && (
        <div className="absolute inset-0 z-[11] flex items-center justify-center p-6 sm:p-8 bg-white/92 rounded-lg" role="alertdialog" aria-labelledby="payment-failure-title">
          <div className="flex flex-col items-center text-center max-w-[22rem]">
            <span className="inline-flex text-red-600 mb-4 [&_svg]:w-12 [&_svg]:h-12" aria-hidden="true">
              <ErrorCircleIcon />
            </span>
            <h3 id="payment-failure-title" className="m-0 mb-2.5 text-lg font-bold text-gray-900">Payment unsuccessful</h3>
            <p className="m-0 mb-6 text-sm leading-relaxed text-gray-500">{getPaymentFailureMessage(form.paymentMethod)}</p>
            <div className="flex gap-3 w-full">
              <button type="button" className="btn-secondary flex-1 min-w-0 px-4 py-3 text-sm" onClick={onUseAnotherMethod}>
                Use another method
              </button>
              <button type="button" className="btn-primary flex-1 min-w-0 px-4 py-3 text-sm" onClick={onTryAgain}>
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
