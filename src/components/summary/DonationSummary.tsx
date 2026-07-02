import type { DonationFormState, WizardStep } from '../../types/donation';
import { formatAmount, formatPaymentMethod, getDonorDisplayName } from '../../utils/format';
import { ShieldIcon } from '../icons/Icons';

interface DonationSummaryProps {
  form: DonationFormState;
  step: WizardStep;
}

export function DonationSummary({ form, step }: DonationSummaryProps) {
  const donorName = getDonorDisplayName(form.firstName, form.lastName);
  const showDonor = step >= 2 && donorName.length > 0;
  const showMethod = step >= 3;

  return (
    <aside className="donation-summary">
      <div className="donation-summary-inner">
        <h2>Donation Summary</h2>
        <dl>
          <div className="summary-row">
            <dt>Amount</dt>
            <dd>{form.amount ? formatAmount(form.amount) : '—'}</dd>
          </div>
          {showDonor && (
            <div className="summary-row">
              <dt>Donor</dt>
              <dd>{form.isAnonymous ? 'Anonymous' : donorName}</dd>
            </div>
          )}
          {showMethod && (
            <div className="summary-row">
              <dt>Method</dt>
              <dd>{formatPaymentMethod(form.paymentMethod)}</dd>
            </div>
          )}
        </dl>
        <p className="summary-note">
          <span className="summary-note-icon" aria-hidden="true">
            <ShieldIcon />
          </span>
          Your donation is secure and encrypted. We do not store your full payment details.
        </p>
      </div>
    </aside>
  );
}
