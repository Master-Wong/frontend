import type { DonationReceipt } from '../../types/donation';
import { formatAmount, formatPaymentMethod, formatReceiptDate } from '../../utils/format';
import { CheckIcon, HeartIcon } from '../icons/Icons';

interface ConfirmationStepProps {
  receipt: DonationReceipt | null;
  receiptError: string | null;
  onReset: () => void;
}

// Show donation receipt or error after payment completes.
export function ConfirmationStep({ receipt, receiptError, onReset }: ConfirmationStepProps) {
  if (receiptError) {
    return (
      <section className="step-panel confirmation-step">
        <div className="error-banner">
          <p>{receiptError}</p>
        </div>
        <button type="button" className="btn btn-secondary btn-block" onClick={onReset}>
          Make another donation
        </button>
      </section>
    );
  }

  if (!receipt) {
    return (
      <section className="step-panel confirmation-step">
        <div className="loading-overlay inline-loading">
          <div className="spinner" aria-hidden="true" />
          <p>Loading your receipt...</p>
        </div>
      </section>
    );
  }

  const thankYouName = receipt.isAnonymous
    ? 'there'
    : (receipt.donorName?.split(' ')[0] ?? 'there');

  return (
    <section className="step-panel confirmation-step">
      <div className="thank-you">
        <div className="thank-you-icon" aria-hidden="true">
          <HeartIcon />
        </div>
        <h2>Thank you, {thankYouName}!</h2>
        <p>
          Your generous contribution of{' '}
          <strong>{formatAmount(receipt.amount)}</strong> will make a real difference.
        </p>
      </div>

      <article className="receipt-card">
        <header>
          <span aria-hidden="true"><CheckIcon /></span>
          <h3>Donation Receipt</h3>
        </header>
        <dl>
          <div className="receipt-row">
            <dt>Transaction Ref</dt>
            <dd>{receipt.transactionId}</dd>
          </div>
          <div className="receipt-row">
            <dt>Date</dt>
            <dd>{formatReceiptDate(receipt.createdAt)}</dd>
          </div>
          <div className="receipt-row">
            <dt>Donor Name</dt>
            <dd>{receipt.donorName ?? 'Anonymous'}</dd>
          </div>
          <div className="receipt-row">
            <dt>Payment Method</dt>
            <dd>{formatPaymentMethod(receipt.paymentMethod)}</dd>
          </div>
          <div className="receipt-row total">
            <dt>Total Amount</dt>
            <dd>{formatAmount(receipt.amount)}</dd>
          </div>
        </dl>
      </article>

      <button type="button" className="btn btn-secondary btn-block" onClick={onReset}>
        Make another donation
      </button>
    </section>
  );
}
