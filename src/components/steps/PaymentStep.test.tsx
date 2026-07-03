import { fireEvent, render, screen, within } from '@testing-library/react';
import { PaymentStep } from './PaymentStep';
import { initialFormState } from '../../hooks/useDonationWizard';

const baseProps = {
  step: 3,
  isSubmitting: false,
  isPolling: false,
  onChange: jest.fn(),
  onBack: jest.fn(),
  onSubmit: jest.fn(),
  onUseAnotherMethod: jest.fn(),
  onTryAgain: jest.fn(),
};

describe('PaymentStep', () => {
  const simulatedFailureMessage =
    'The request was cancelled to simulate a failed payment response.';

  it('shows the API failure message in the overlay when paymentError is set', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={{ ...initialFormState, paymentMethod: 'mpesa' }}
        errors={[]}
        paymentError={simulatedFailureMessage}
      />,
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Payment unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(simulatedFailureMessage)).toBeInTheDocument();
  });

  it('shows a generic paymentError in the overlay when provided', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={{ ...initialFormState, paymentMethod: 'mpesa' }}
        errors={[]}
        paymentError="Payment failed. Please try again."
      />,
    );

    expect(screen.getByText('Payment failed. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText(/M-Pesa request was cancelled/)).not.toBeInTheDocument();
  });

  it('calls retry and switch-method handlers from overlay buttons', () => {
    const onTryAgain = jest.fn();
    const onUseAnotherMethod = jest.fn();

    render(
      <PaymentStep
        {...baseProps}
        form={initialFormState}
        errors={[]}
        paymentError="Payment failed"
        onUseAnotherMethod={onUseAnotherMethod}
        onTryAgain={onTryAgain}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use another method' }));

    expect(onTryAgain).toHaveBeenCalledTimes(1);
    expect(onUseAnotherMethod).toHaveBeenCalledTimes(1);
  });

  it('renders validation errors with alert semantics', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={initialFormState}
        errors={['M-Pesa phone number is required.']}
        paymentError={null}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('M-Pesa phone number is required.');
  });

  it('exposes aria-pressed on payment method buttons', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={{ ...initialFormState, paymentMethod: 'mpesa' }}
        errors={[]}
        paymentError={null}
      />,
    );

    const radiogroup = screen.getByRole('radiogroup');

    expect(within(radiogroup).getByRole('button', { name: 'M-Pesa' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(radiogroup).getByRole('button', { name: 'Credit/Debit Card' })).toHaveAttribute('aria-pressed', 'false');
  });
});
