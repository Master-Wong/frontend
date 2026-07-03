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

// Render four-step donation progress indicator.
export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <nav className="px-4 sm:px-8 pt-6 pb-5 border-b border-gray-200" aria-label="Donation progress">
      <ol className="flex justify-between list-none m-0 p-0">
        {steps.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;
          const segmentCompleted = currentStep > step.id;

          return (
            <li
              key={step.id}
              className={`flex-1 flex flex-col items-center relative min-w-0 ${active ? 'text-green-700' : ''}`}
            >
              {index < steps.length - 1 && (
                <span
                  className={`absolute top-4 left-[calc(50%+1.125rem)] w-[calc(100%-2.25rem)] h-0.5 z-0 ${segmentCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                  aria-hidden="true"
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[0.8125rem] font-semibold border-2 [&_svg]:w-3.5 [&_svg]:h-3.5 ${
                  completed || active
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {completed ? <CheckIcon /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs text-center whitespace-nowrap max-[520px]:text-[0.625rem] ${
                  active ? 'text-green-700 font-semibold' : completed ? 'text-gray-800 font-semibold' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
