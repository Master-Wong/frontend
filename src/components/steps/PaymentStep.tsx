import type { DonationFormState } from '../../types/donation';
import { CreditCardIcon, PhoneIcon } from '../icons/Icons';

interface PaymentStepProps {
  form: DonationFormState;
  errors: string[];
  isSubmitting: boolean;
  paymentError: string | null;
  onChange: (updates: Partial<DonationFormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function PaymentStep({
  form,
  errors,
  isSubmitting,
  paymentError,
  onChange,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  return (
    <section className="step-panel payment-step">
      <h2>Payment Method</h2>
      <p className="step-subtitle">Choose how you&apos;d like to complete your donation.</p>

      <div className="payment-toggle">
        <button
          type="button"
          className={`payment-option ${form.paymentMethod === 'mpesa' ? 'selected' : ''}`}
          onClick={() => onChange({ paymentMethod: 'mpesa' })}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        >
          <span className="payment-option-icon" aria-hidden="true">
            <CreditCardIcon />
          </span>
          Credit/Debit Card
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <div className="field">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
              value={form.nameOnCard}
              onChange={(event) => onChange({ nameOnCard: event.target.value })}
              placeholder="Jane Doe"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <div className="field">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                value={form.cvc}
                onChange={(event) => onChange({ cvc: event.target.value })}
                placeholder="123"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {(errors.length > 0 || paymentError) && (
        <div className="error-banner">
          {paymentError && <p>{paymentError}</p>}
          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Processing...'
            : form.paymentMethod === 'mpesa'
              ? 'Pay via M-Pesa'
              : 'Pay Now'}
        </button>
      </div>

      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner" aria-hidden="true" />
          <h3>{form.paymentMethod === 'mpesa' ? 'Check your phone' : 'Processing payment'}</h3>
          <p>
            {form.paymentMethod === 'mpesa'
              ? 'An M-Pesa prompt has been sent to your phone. Enter your PIN to complete the donation.'
              : 'Please wait while we process your card payment.'}
          </p>
        </div>
      )}
    </section>
  );
}
