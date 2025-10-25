import React from 'react';
import { CarnilProvider } from '@carnil/react';
import { useCustomer, usePayment } from '@carnil/react';
import './App.css';

function PaymentForm() {
  const { customer, createCustomer, loading: customerLoading } = useCustomer();
  const { createPaymentIntent, loading: paymentLoading } = usePayment();

  const handlePayment = async () => {
    try {
      // Create customer if doesn't exist
      if (!customer) {
        await createCustomer({
          email: 'customer@example.com',
          name: 'John Doe',
        });
      }

      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        customerId: customer?.id,
        amount: 2000, // $20.00
        currency: 'usd',
        description: 'Test payment',
      });

      console.log('Payment intent created:', paymentIntent);
      alert('Payment intent created successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
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
        disabled={customerLoading || paymentLoading}
        className="pay-button"
      >
        {customerLoading || paymentLoading ? 'Processing...' : 'Pay $20.00'}
      </button>
    </div>
  );
}

function App() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.REACT_APP_STRIPE_SECRET_KEY!,
        webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET!,
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
