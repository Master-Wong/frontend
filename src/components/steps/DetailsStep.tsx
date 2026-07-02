import type { DonationFormState } from '../../types/donation';

interface DetailsStepProps {
  form: DonationFormState;
  errors: string[];
  onChange: (updates: Partial<DonationFormState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

// Collect donor contact details and anonymity preference.
export function DetailsStep({
  form,
  errors,
  onChange,
  onBack,
  onContinue,
}: DetailsStepProps) {
  return (
    <section className="step-panel">
      <h2>Your Details</h2>
      <p className="step-subtitle">We&apos;ll use this to send your receipt.</p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            value={form.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            placeholder="Jane"
          />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            value={form.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => onChange({ email: event.target.value })}
          placeholder="jane.doe@example.com"
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number (Optional)</label>
        <input
          id="phone"
          value={form.phone}
          onChange={(event) => onChange({ phone: event.target.value, phoneNumber: event.target.value })}
          placeholder="+254 700 000000"
        />
        <p className="field-hint">Required if you plan to pay via M-Pesa.</p>
      </div>

      <div className="field">
        <label htmlFor="message">Leave a message (Optional)</label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(event) => onChange({ message: event.target.value })}
          placeholder="I'm donating because..."
        />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.isAnonymous}
          onChange={(event) => onChange({ isAnonymous: event.target.checked })}
        />
        <span>Make my donation anonymous</span>
      </label>

      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Continue to Payment
        </button>
      </div>
    </section>
  );
}
