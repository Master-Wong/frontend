import './App.css';
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

function App() {
  const {
    step,
    form,
    errors,
    isSubmitting,
    paymentError,
    receipt,
    receiptError,
    updateForm,
    goToStep,
    goBack,
    submitPayment,
    resetWizard,
  } = useDonationWizard();

  return (
    <div className="app">
      <Header />

      <main className="page-content">
        <Hero />

        <section className="donation-card">
          <ProgressStepper currentStep={step} />

          <div className={`donation-content ${step === 4 ? 'confirmation-layout' : ''}`}>
            <div className="form-column">
              {step === 1 && (
                <AmountStep
                  form={form}
                  errors={errors}
                  onChange={updateForm}
                  onContinue={() => goToStep(2)}
                />
              )}
              {step === 2 && (
                <DetailsStep
                  form={form}
                  errors={errors}
                  onChange={updateForm}
                  onBack={goBack}
                  onContinue={() => goToStep(3)}
                />
              )}
              {step === 3 && (
                <PaymentStep
                  form={form}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  paymentError={paymentError}
                  onChange={updateForm}
                  onBack={goBack}
                  onSubmit={submitPayment}
                />
              )}
              {step === 4 && (
                <ConfirmationStep
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
