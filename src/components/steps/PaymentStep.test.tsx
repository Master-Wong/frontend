import { fireEvent, render, screen } from '@testing-library/react';
import { PaymentStep } from './PaymentStep';
import { initialFormState } from '../../hooks/useDonationWizard';

describe('PaymentStep', () => {
  it('shows the failure overlay with M-Pesa message', () => {
    render(
      <PaymentStep
        form={{ ...initialFormState, paymentMethod: 'mpesa' }}
        errors={[]}
        isSubmitting={false}
        isPolling={false}
        paymentError="Payment failed"
        onChange={jest.fn()}
        onBack={jest.fn()}
        onSubmit={jest.fn()}
        onUseAnotherMethod={jest.fn()}
        onTryAgain={jest.fn()}
      />,
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Payment unsuccessful')).toBeInTheDocument();
    expect(screen.getByText(/M-Pesa request was cancelled/)).toBeInTheDocument();
  });

  it('shows card-specific failure message when paying by card', () => {
    render(
      <PaymentStep
        form={{ ...initialFormState, paymentMethod: 'card' }}
        errors={[]}
        isSubmitting={false}
        isPolling={false}
        paymentError="Payment failed"
        onChange={jest.fn()}
        onBack={jest.fn()}
        onSubmit={jest.fn()}
        onUseAnotherMethod={jest.fn()}
        onTryAgain={jest.fn()}
      />,
    );

    expect(screen.getByText(/card was declined/)).toBeInTheDocument();
  });

  it('calls retry and switch-method handlers from overlay buttons', () => {
    const onTryAgain = jest.fn();
    const onUseAnotherMethod = jest.fn();

    render(
      <PaymentStep
        form={initialFormState}
        errors={[]}
        isSubmitting={false}
        isPolling={false}
        paymentError="Payment failed"
        onChange={jest.fn()}
        onBack={jest.fn()}
        onSubmit={jest.fn()}
        onUseAnotherMethod={onUseAnotherMethod}
        onTryAgain={onTryAgain}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use another method' }));

    expect(onTryAgain).toHaveBeenCalledTimes(1);
    expect(onUseAnotherMethod).toHaveBeenCalledTimes(1);
  });
});
