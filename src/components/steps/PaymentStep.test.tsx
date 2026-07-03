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
  it('shows the failure overlay with M-Pesa message', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={{ ...initialFormState, paymentMethod: 'mpesa' }}
        errors={[]}
        paymentError="Payment failed"
      />,
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Payment unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(/M-Pesa request was cancelled/)).toBeInTheDocument();
  });

  it('shows card-specific failure message when paying by card', () => {
    render(
      <PaymentStep
        {...baseProps}
        form={{ ...initialFormState, paymentMethod: 'card' }}
        errors={[]}
        paymentError="Payment failed"
      />,
    );

    expect(screen.getByText(/card was declined/)).toBeInTheDocument();
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
