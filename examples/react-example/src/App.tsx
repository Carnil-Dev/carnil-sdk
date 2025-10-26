import React from 'react';
import { CarnilProvider, useCustomer, useCarnil } from '@carnil/react';
import '@carnil/stripe'; // Import to register the provider
import './App.css';

function PaymentForm() {
  const { customer, createCustomer, isLoading: customerLoading } = useCustomer();
  const carnil = useCarnil();
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setIsPaymentLoading(true);

      // Create customer if doesn't exist
      if (!customer) {
        await createCustomer({
          email: 'customer@example.com',
          name: 'John Doe',
        });
      }

      // Create payment intent using carnil instance
      const paymentIntent = await carnil.createPaymentIntent({
        customerId: customer?.id,
        amount: 2000, // $20.00
        currency: 'usd',
        description: 'Test payment',
      });

      console.log('Payment intent created:', paymentIntent);
      alert('Payment intent created successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error as Error).message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Payment Form</h2>
      {customer && (
        <div className="customer-info">
          <p>
            Customer: {customer.name} ({customer.email})
          </p>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={customerLoading || isPaymentLoading}
        className="pay-button"
      >
        {customerLoading || isPaymentLoading ? 'Processing...' : 'Pay $20.00'}
      </button>
    </div>
  );
}

function App() {
  return (
    <CarnilProvider
      config={{
        provider: {
          provider: 'stripe', // or 'razorpay'
          apiKey: process.env.REACT_APP_STRIPE_SECRET_KEY!,
          webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET!,
        },
        debug: true,
      }}
    >
      <div className="App">
        <header className="App-header">
          <h1>Carnil SDK React Example</h1>
          <PaymentForm />
        </header>
      </div>
    </CarnilProvider>
  );
}

export default App;
