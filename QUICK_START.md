# Carnil SDK Quick Start Guide

Get up and running with the Carnil Payments SDK in minutes.

## 🚀 Installation

```bash
# Install core package
npm install @carnil/core

# Install provider (choose one or more)
npm install @carnil/stripe
npm install @carnil/razorpay

# Install framework integration (optional)
npm install @carnil/react
npm install @carnil/next
```

## 📝 Basic Usage

### 1. Initialize the SDK

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/stripe'; // Auto-registers Stripe provider

const carnil = new Carnil({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
});
```

### 2. Create a Customer

```typescript
const customer = await carnil.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe',
});

console.log('Customer created:', customer.data);
```

### 3. Create a Payment Intent

```typescript
const paymentIntent = await carnil.createPaymentIntent({
  customerId: customer.data.id,
  amount: 2000, // $20.00 in cents
  currency: 'usd',
  description: 'Test payment',
});

console.log('Payment intent created:', paymentIntent.data);
```

## ⚛️ React Integration

### 1. Setup Provider

```tsx
import { CarnilProvider } from '@carnil/react';

function App() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.REACT_APP_STRIPE_SECRET_KEY!,
        webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET!,
      }}
    >
      <YourApp />
    </CarnilProvider>
  );
}
```

### 2. Use Hooks

```tsx
import { useCustomer, usePayment } from '@carnil/react';

function PaymentForm() {
  const { customer, createCustomer } = useCustomer();
  const { createPaymentIntent } = usePayment();

  const handlePayment = async () => {
    if (!customer) {
      await createCustomer({
        email: 'customer@example.com',
        name: 'John Doe',
      });
    }

    const paymentIntent = await createPaymentIntent({
      customerId: customer?.id,
      amount: 2000,
      currency: 'usd',
    });

    console.log('Payment intent:', paymentIntent);
  };

  return (
    <button onClick={handlePayment}>
      Pay $20.00
    </button>
  );
}
```

## 🔧 Next.js Integration

### 1. API Route

```typescript
// app/api/carnil/route.ts
import { createCarnilHandler } from '@carnil/next';

const handler = createCarnilHandler({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  identify: async (req) => {
    const userId = req.headers.get('x-user-id');
    return { customerId: userId };
  },
});

export { handler as POST };
```

### 2. Frontend Usage

```tsx
// app/page.tsx
import { CarnilProvider } from '@carnil/react';

export default function HomePage() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      }}
    >
      <PaymentForm />
    </CarnilProvider>
  );
}
```

## 🌍 Multi-Provider Support

### Stripe

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/stripe';

const carnil = new Carnil({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
});
```

### Razorpay

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/razorpay';

const carnil = new Carnil({
  provider: {
    provider: 'razorpay',
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
  },
});
```

## 📊 Analytics & Usage Tracking

```typescript
import { CarnilAnalytics } from '@carnil/analytics';

const analytics = new CarnilAnalytics();

// Track usage
await analytics.trackUsage({
  customerId: 'customer-123',
  featureId: 'api-calls',
  usage: 100,
  period: 'month',
  startDate: new Date(),
  endDate: new Date(),
});

// Track AI usage
await analytics.trackAIUsage({
  customerId: 'customer-123',
  modelId: 'gpt-4',
  tokens: 1500,
  inputTokens: 1000,
  outputTokens: 500,
  cost: 0.03,
  timestamp: new Date(),
});
```

## 🎨 No-Code Pricing Editor

```tsx
import { PricingEditor } from '@carnil/pricing-editor';

function PricingPage() {
  return (
    <PricingEditor
      initialPlan={pricingPlan}
      onPlanChange={(plan) => console.log('Plan changed:', plan)}
      onSave={async (plan) => {
        await savePricingPlan(plan);
      }}
      onPublish={async (plan) => {
        await publishPricingPlan(plan);
      }}
      currency="USD"
      supportedCurrencies={['USD', 'EUR', 'GBP']}
      features={['API Calls', 'Storage', 'Support']}
    />
  );
}
```

## 🔧 Environment Variables

Create a `.env` file with your provider credentials:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# React/Next.js (for client-side)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific package tests
npm test -- --testPathPattern=packages/core
```

## 📚 Next Steps

1. **Explore Examples**: Check out the `examples/` directory
2. **Read Documentation**: Visit the full documentation
3. **Join Community**: Get help on Discord
4. **Contribute**: Submit issues and pull requests

## 🆘 Need Help?

- [Documentation](https://docs.carnil.com)
- [GitHub Issues](https://github.com/carnil/carnil-sdk/issues)
- [Discord Community](https://discord.gg/carnil)

---

Happy coding! 🚀
