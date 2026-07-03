import type { DonationFormState, WizardStep } from '../../types/donation';
import { formatAmount, formatPaymentMethod, getDonorDisplayName } from '../../utils/format';
import { ShieldIcon } from '../icons/Icons';

interface DonationSummaryProps {
  form: DonationFormState;
  step: WizardStep;
}

// Display live donation summary in the wizard sidebar.
export function DonationSummary({ form, step }: DonationSummaryProps) {
  const donorName = getDonorDisplayName(form.firstName, form.lastName);
  const showDonor = step >= 2 && donorName.length > 0;
  const showMethod = step >= 3;

  return (
    <aside className="px-5 sm:px-7 md:pr-8 md:pl-0 pb-7 md:pb-7 md:pt-7 max-md:border-t max-md:border-gray-200">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="m-0 mb-4 text-[0.9375rem] font-bold text-gray-900">Donation Summary</h2>
        <dl className="m-0">
          <div className="flex justify-between items-baseline py-2 text-sm">
            <dt className="text-gray-500">Amount</dt>
            <dd className="m-0 font-bold text-gray-900">{form.amount ? formatAmount(form.amount) : '—'}</dd>
          </div>
          {showDonor && (
            <div className="flex justify-between items-baseline py-2 text-sm border-t border-gray-200">
              <dt className="text-gray-500">Donor</dt>
              <dd className="m-0 font-bold text-gray-900">{form.isAnonymous ? 'Anonymous' : donorName}</dd>
            </div>
          )}
          {showMethod && (
            <div className="flex justify-between items-baseline py-2 text-sm border-t border-gray-200">
              <dt className="text-gray-500">Method</dt>
              <dd className="m-0 font-bold text-gray-900">{formatPaymentMethod(form.paymentMethod)}</dd>
            </div>
          )}
        </dl>
        <p className="flex items-start gap-2 mt-4 p-3 bg-green-50 rounded-lg text-[0.6875rem] text-green-700 leading-normal m-0">
          <span className="inline-flex shrink-0 text-green-600 mt-0.5 [&_svg]:w-3.5 [&_svg]:h-3.5" aria-hidden="true">
            <ShieldIcon />
          </span>
          Your donation is secure and encrypted. We do not store your full payment details.
        </p>
      </div>
    </aside>
  );
}
