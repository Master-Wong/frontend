import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { SecurityFooter } from './components/layout/SecurityFooter';
import { ProgressStepper } from './components/stepper/ProgressStepper';
import { DonationSummary } from './components/summary/DonationSummary';
import { AmountStep } from './components/steps/AmountStep';
import { DetailsStep } from './components/steps/DetailsStep';
import { PaymentStep } from './components/steps/PaymentStep';
import { ConfirmationStep } from './components/steps/ConfirmationStep';
import { useDonationWizard } from './hooks/useDonationWizard';

// Root donation wizard layout and step routing.
function App() {
  const {
    step,
    form,
    errors,
    isSubmitting,
    isPolling,
    paymentError,
    receipt,
    receiptError,
    updateForm,
    goToStep,
    goBack,
    submitPayment,
    useAnotherPaymentMethod,
    retryPayment,
    resetWizard,
  } = useDonationWizard();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="max-w-[1060px] mx-auto px-4 pb-12">
        <Hero />

        <section className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          <ProgressStepper currentStep={step} />

          <div className={`grid grid-cols-1 ${step === 4 ? 'block' : 'md:grid-cols-[1fr_300px]'}`}>
            <div className={`p-5 sm:p-7 md:px-8 ${step === 4 ? 'max-w-xl mx-auto' : ''}`}>
              {step === 1 && (
                <AmountStep
                  step={step}
                  form={form}
                  errors={errors}
                  onChange={updateForm}
                  onContinue={() => goToStep(2)}
                />
              )}
              {step === 2 && (
                <DetailsStep
                  step={step}
                  form={form}
                  errors={errors}
                  onChange={updateForm}
                  onBack={goBack}
                  onContinue={() => goToStep(3)}
                />
              )}
              {step === 3 && (
                <PaymentStep
                  step={step}
                  form={form}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  isPolling={isPolling}
                  paymentError={paymentError}
                  onChange={updateForm}
                  onBack={goBack}
                  onSubmit={submitPayment}
                  onUseAnotherMethod={useAnotherPaymentMethod}
                  onTryAgain={retryPayment}
                />
              )}
              {step === 4 && (
                <ConfirmationStep
                  step={step}
                  receipt={receipt}
                  receiptError={receiptError}
                  onReset={resetWizard}
                />
              )}
            </div>

            {step < 4 && (
              <DonationSummary form={form} step={step} />
            )}
          </div>

          {step < 4 && <SecurityFooter />}
        </section>
      </main>
    </div>
  );
}

export default App;
