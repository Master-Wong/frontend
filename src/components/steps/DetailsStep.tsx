import type { DonationFormState } from '../../types/donation';
import { useStepFocus } from '../../hooks/useStepFocus';
import { ValidationErrors } from '../ui/ValidationErrors';

interface DetailsStepProps {
  step: number;
  form: DonationFormState;
  errors: string[];
  onChange: (updates: Partial<DonationFormState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

// Collect donor contact details and anonymity preference.
export function DetailsStep({
  step,
  form,
  errors,
  onChange,
  onBack,
  onContinue,
}: DetailsStepProps) {
  const headingRef = useStepFocus(step);

  return (
    <section>
      <h2 ref={headingRef} tabIndex={-1} className="m-0 mb-1.5 text-lg font-bold text-gray-900 outline-none">
        Your Details
      </h2>
      <p className="m-0 mb-6 text-sm text-gray-500">We&apos;ll use this to send your receipt.</p>

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[480px]:gap-4">
        <div className="field-group mb-4">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            className="input-field"
            value={form.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            placeholder="Jane"
          />
        </div>
        <div className="field-group mb-4">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            className="input-field"
            value={form.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="field-group mb-4">
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          className="input-field"
          type="email"
          value={form.email}
          onChange={(event) => onChange({ email: event.target.value })}
          placeholder="jane.doe@example.com"
        />
      </div>

      <div className="field-group mb-4">
        <label htmlFor="phone">Phone Number (Optional)</label>
        <input
          id="phone"
          className="input-field"
          value={form.phone}
          onChange={(event) => onChange({ phone: event.target.value, phoneNumber: event.target.value })}
          placeholder="+254 700 000000"
        />
        <p className="mt-1.5 mb-0 text-xs text-gray-400">Required if you plan to pay via M-Pesa.</p>
      </div>

      <div className="field-group mb-4">
        <label htmlFor="message">Leave a message (Optional)</label>
        <textarea
          id="message"
          className="textarea-field"
          rows={4}
          value={form.message}
          onChange={(event) => onChange({ message: event.target.value })}
          placeholder="I'm donating because..."
        />
      </div>

      <label className="flex items-center gap-2.5 mb-6 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 shrink-0 accent-green-500"
          checked={form.isAnonymous}
          onChange={(event) => onChange({ isAnonymous: event.target.checked })}
        />
        <span>Make my donation anonymous</span>
      </label>

      <ValidationErrors errors={errors} />

      <div className="flex gap-3 mt-6">
        <button type="button" className="btn-secondary min-w-24 shrink-0" onClick={onBack}>Back</button>
        <button type="button" className="btn-primary flex-1" onClick={onContinue}>
          Continue to Payment
        </button>
      </div>
    </section>
  );
}
