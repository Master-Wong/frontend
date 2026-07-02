import type { WizardStep } from '../../types/donation';
import { CheckIcon } from '../icons/Icons';

const steps = [
  { id: 1, label: 'Amount' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
] as const;

interface ProgressStepperProps {
  currentStep: WizardStep;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <nav className="stepper" aria-label="Donation progress">
      <ol className="stepper-list">
        {steps.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;
          const segmentCompleted = currentStep > step.id;

          return (
            <li
              key={step.id}
              className={`stepper-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}
            >
              {index < steps.length - 1 && (
                <span
                  className={`stepper-segment ${segmentCompleted ? 'completed' : ''}`}
                  aria-hidden="true"
                />
              )}
              <div className={`stepper-circle ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}>
                {completed ? <CheckIcon /> : step.id}
              </div>
              <span className={`stepper-label ${active || completed ? 'highlight' : ''}`}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
