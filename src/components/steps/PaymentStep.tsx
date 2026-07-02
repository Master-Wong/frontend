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

  return (
    <section className="step-panel payment-step">
      <h2>Payment Method</h2>
      <p className="step-subtitle">Choose how you&apos;d like to complete your donation.</p>

      <div className="payment-toggle">
        <button
          type="button"
          className={`payment-option ${form.paymentMethod === 'mpesa' ? 'selected' : ''}`}
          onClick={() => onChange({ paymentMethod: 'mpesa' })}
          disabled={isSubmitting || isPolling}
        >
          <span className="payment-option-icon" aria-hidden="true">
            <PhoneIcon />
          </span>
          M-Pesa
        </button>
        <button
          type="button"
          className={`payment-option ${form.paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => onChange({ paymentMethod: 'card' })}
          disabled={isSubmitting || isPolling}
        >
          <span className="payment-option-icon" aria-hidden="true">
            <CreditCardIcon />
          </span>
          Card
        </button>
      </div>

      {form.paymentMethod === 'mpesa' && (
        <div className="payment-fields">
          <p className="mpesa-info">
            You will receive an STK push prompt on your phone. Enter your M-Pesa PIN to
            authorize the transaction.
          </p>
          <div className="field">
            <label htmlFor="phoneNumber">M-Pesa Phone Number</label>
            <input
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={(event) => onChange({ phoneNumber: event.target.value })}
              placeholder="e.g. 0700 000 000 or 2547..."
              disabled={isSubmitting || isPolling}
            />
          </div>
        </div>
      )}

      {form.paymentMethod === 'card' && (
        <div className="payment-fields">
          <div className="field">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              value={form.cardNumber}
              onChange={(event) => onChange({ cardNumber: event.target.value })}
              placeholder="0000 0000 0000 0000"
              disabled={isSubmitting || isPolling}
            />
          </div>
          <div className="field">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
              value={form.nameOnCard}
              onChange={(event) => onChange({ nameOnCard: event.target.value })}
              placeholder="Jane Doe"
              disabled={isSubmitting || isPolling}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                value={form.expiry}
                onChange={(event) => onChange({ expiry: event.target.value })}
                placeholder="MM/YY"
                disabled={isSubmitting || isPolling}
              />
            </div>
            <div className="field">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
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

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isSubmitting || isPolling}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
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
        <div className="loading-overlay">
          <div className="spinner" aria-hidden="true" />
          <h3>
            {form.paymentMethod === 'mpesa'
              ? isPolling
                ? 'Waiting for confirmation on your phone…'
                : 'Check your phone'
              : 'Processing payment'}
          </h3>
          <p>
            {form.paymentMethod === 'mpesa'
              ? isPolling
                ? 'Enter your M-Pesa PIN to complete the donation. This may take a few seconds.'
                : 'An M-Pesa prompt has been sent to your phone. Enter your PIN to complete the donation.'
              : 'Please wait while we process your card payment.'}
          </p>
        </div>
      )}

      {showFailureOverlay && (
        <div className="payment-failure-overlay" role="alertdialog" aria-labelledby="payment-failure-title">
          <div className="payment-failure-content">
            <span className="payment-failure-icon" aria-hidden="true">
              <ErrorCircleIcon />
            </span>
            <h3 id="payment-failure-title">Payment unsuccessful</h3>
            <p>{getPaymentFailureMessage(form.paymentMethod)}</p>
            <div className="payment-failure-actions">
              <button type="button" className="btn btn-secondary" onClick={onUseAnotherMethod}>
                Use another method
              </button>
              <button type="button" className="btn btn-primary" onClick={onTryAgain}>
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
