import type { DonationFormState } from '../../types/donation';
import { PRESET_AMOUNTS } from '../../hooks/useDonationWizard';
import { formatAmount } from '../../utils/format';

interface AmountStepProps {
  form: DonationFormState;
  errors: string[];
  onChange: (updates: Partial<DonationFormState>) => void;
  onContinue: () => void;
}

export function AmountStep({ form, errors, onChange, onContinue }: AmountStepProps) {
  return (
    <section className="step-panel">
      <h2>Choose your donation amount</h2>
      <p className="step-subtitle">Your contribution helps us continue our mission.</p>

      <label className="field-label">Amount</label>
      <div className="amount-grid">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`amount-btn ${form.amount === amount && !form.customAmount ? 'selected' : ''}`}
            onClick={() => onChange({ amount, customAmount: '' })}
          >
            {formatAmount(amount)}
          </button>
        ))}
      </div>

      <label className="field-label" htmlFor="customAmount">Or enter a custom amount</label>
      <input
        id="customAmount"
        type="number"
        min="1"
        placeholder="Other amount"
        value={form.customAmount}
        onChange={(event) => {
          const value = event.target.value;
          onChange({
            customAmount: value,
            amount: value ? Number(value) : null,
          });
        }}
      />

      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <button type="button" className="btn btn-primary btn-block" onClick={onContinue}>
        Continue
      </button>
    </section>
  );
}
