import type { DonationReceipt } from '../../types/donation';
import { useStepFocus } from '../../hooks/useStepFocus';
import { formatAmount, formatPaymentMethod, formatReceiptDate } from '../../utils/format';
import { CheckIcon, HeartIcon } from '../icons/Icons';

interface ConfirmationStepProps {
  step: number;
  receipt: DonationReceipt | null;
  receiptError: string | null;
  onReset: () => void;
}

// Show donation receipt or error after payment completes.
export function ConfirmationStep({ step, receipt, receiptError, onReset }: ConfirmationStepProps) {
  const headingRef = useStepFocus(step);

  if (receiptError) {
    return (
      <section className="text-center">
        <div className="p-3.5 px-4 bg-red-50 border border-red-300/30 rounded-lg mb-4" role="alert">
          <p className="m-0 text-sm text-red-600">{receiptError}</p>
        </div>
        <button type="button" className="btn-secondary w-full mt-2" onClick={onReset}>
          Make another donation
        </button>
      </section>
    );
  }

  if (!receipt) {
    return (
      <section className="text-center">
        <div className="flex flex-col items-center justify-center text-center min-h-48">
          <div className="spinner" aria-hidden="true" />
          <p className="mt-4 text-sm text-gray-500">Loading your receipt...</p>
        </div>
      </section>
    );
  }

  const thankYouName = receipt.isAnonymous
    ? 'there'
    : (receipt.donorName?.split(' ')[0] ?? 'there');

  return (
    <section className="text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-3 [&_svg]:w-6 [&_svg]:h-6" aria-hidden="true">
          <HeartIcon />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="m-0 mb-2 text-[1.375rem] font-bold text-gray-900 outline-none">
          Thank you, {thankYouName}!
        </h2>
        <p className="m-0 text-[0.9375rem] text-gray-500 leading-relaxed">
          Your generous contribution of{' '}
          <strong className="text-gray-800">{formatAmount(receipt.amount)}</strong> will make a real difference.
        </p>
      </div>

      <article className="border border-gray-200 rounded-xl overflow-hidden mb-5 text-left">
        <header className="flex items-center gap-2 px-4 py-3.5 bg-green-50 border-b border-green-100">
          <span className="inline-flex items-center justify-center w-[1.375rem] h-[1.375rem] bg-green-500 text-white rounded-full [&_svg]:w-3 [&_svg]:h-3" aria-hidden="true">
            <CheckIcon />
          </span>
          <h3 className="m-0 text-sm font-bold text-green-700">Donation Receipt</h3>
        </header>
        <dl className="m-0 py-1">
          <div className="flex justify-between items-baseline px-4 py-2.5 text-sm">
            <dt className="text-gray-500">Transaction Ref</dt>
            <dd className="m-0 font-semibold text-gray-900 text-right">{receipt.transactionId}</dd>
          </div>
          <div className="flex justify-between items-baseline px-4 py-2.5 text-sm">
            <dt className="text-gray-500">Date</dt>
            <dd className="m-0 font-semibold text-gray-900 text-right">{formatReceiptDate(receipt.createdAt)}</dd>
          </div>
          <div className="flex justify-between items-baseline px-4 py-2.5 text-sm">
            <dt className="text-gray-500">Donor Name</dt>
            <dd className="m-0 font-semibold text-gray-900 text-right">{receipt.donorName ?? 'Anonymous'}</dd>
          </div>
          <div className="flex justify-between items-baseline px-4 py-2.5 text-sm">
            <dt className="text-gray-500">Payment Method</dt>
            <dd className="m-0 font-semibold text-gray-900 text-right">{formatPaymentMethod(receipt.paymentMethod)}</dd>
          </div>
          <div className="flex justify-between items-baseline px-4 py-3.5 mt-1 text-base border-t border-gray-200">
            <dt className="text-gray-500">Total Amount</dt>
            <dd className="m-0 font-bold text-green-700 text-right">{formatAmount(receipt.amount)}</dd>
          </div>
        </dl>
      </article>

      <button type="button" className="btn-secondary w-full mt-2" onClick={onReset}>
        Make another donation
      </button>
    </section>
  );
}
