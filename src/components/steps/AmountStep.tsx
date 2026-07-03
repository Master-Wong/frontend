import type { DonationFormState } from '../../types/donation';
import { PRESET_AMOUNTS } from '../../hooks/useDonationWizard';
import { useStepFocus } from '../../hooks/useStepFocus';
import { formatAmount } from '../../utils/format';
import { ValidationErrors } from '../ui/ValidationErrors';

interface AmountStepProps {
  step: number;
  form: DonationFormState;
  errors: string[];
  onChange: (updates: Partial<DonationFormState>) => void;
  onContinue: () => void;
}

// Collect donation amount via presets or custom input.
export function AmountStep({ step, form, errors, onChange, onContinue }: AmountStepProps) {
  const headingRef = useStepFocus(step);

  return (
    <section>
      <h2 ref={headingRef} tabIndex={-1} className="m-0 mb-1.5 text-lg font-bold text-gray-900 outline-none">
        Choose your donation amount
      </h2>
      <p className="m-0 mb-6 text-sm text-gray-500">Your contribution helps us continue our mission.</p>

      <label className="field-label">Amount</label>
      <div className="grid grid-cols-2 min-[520px]:grid-cols-4 gap-2.5 mb-5">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`py-3.5 px-2 text-sm font-semibold font-sans border-[1.5px] rounded-lg cursor-pointer transition-all ${
              form.amount === amount && !form.customAmount
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-green-500'
            }`}
            onClick={() => onChange({ amount, customAmount: '' })}
          >
            {formatAmount(amount)}
          </button>
        ))}
      </div>

      <label className="field-label" htmlFor="customAmount">Or enter a custom amount</label>
      <input
        id="customAmount"
        className="input-field"
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

      <ValidationErrors errors={errors} />

      <button type="button" className="btn-primary w-full mt-2" onClick={onContinue}>
        Continue
      </button>
    </section>
  );
}
