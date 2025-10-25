// Basic usage example for Carnil SDK
const { Carnil } = require('@carnil/sdk');

// Initialize Carnil with Stripe
const carnil = new Carnil({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});

async function main() {
  try {
    // Create a customer
    console.log('Creating customer...');
    const customer = await carnil.createCustomer({
      email: 'customer@example.com',
      name: 'John Doe',
    });
    console.log('Customer created:', customer.data);

    // Create a payment intent
    console.log('Creating payment intent...');
    const paymentIntent = await carnil.createPaymentIntent({
      customerId: customer.data.id,
      amount: 2000, // $20.00
      currency: 'usd',
      description: 'Test payment',
    });
    console.log('Payment intent created:', paymentIntent.data);

    // Get payment intent details
    console.log('Getting payment intent...');
    const retrievedPaymentIntent = await carnil.getPaymentIntent(paymentIntent.data.id);
    console.log('Payment intent retrieved:', retrievedPaymentIntent.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  main();
}

module.exports = { main };
