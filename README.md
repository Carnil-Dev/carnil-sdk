# Carnil Payments SDK

A comprehensive, multi-provider payments SDK that abstracts payment gateways behind a unified API. Built with TypeScript, supporting Stripe, Razorpay, and more.

## 🚀 Features

- **Multi-Provider Support**: Unified API for Stripe, Razorpay, and other payment gateways
- **Framework Agnostic**: Works with Next.js, Express, Hono, and more
- **React Integration**: Hooks and components for seamless frontend integration
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Analytics & Usage Tracking**: Built-in analytics for AI/LLM usage and payment metrics
- **No-Code Pricing Editor**: Visual pricing plan designer with A/B testing
- **Advanced Features**: Webhooks, caching, error handling, and more

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@carnil/core` | Core SDK with provider abstraction | `0.1.0` |
| `@carnil/stripe` | Stripe provider implementation | `0.1.0` |
| `@carnil/razorpay` | Razorpay provider implementation | `0.1.0` |
| `@carnil/react` | React hooks and components | `0.1.0` |
| `@carnil/next` | Next.js App Router integration | `0.1.0` |
| `@carnil/adapters` | Framework adapters (Express, Hono) | `0.1.0` |
| `@carnil/analytics` | AI & usage analytics | `0.1.0` |
| `@carnil/pricing-editor` | No-code pricing editor | `0.1.0` |

## 🛠 Installation

```bash
# Install the core package
npm install @carnil/core

# Install provider packages
npm install @carnil/stripe @carnil/razorpay

# Install React integration
npm install @carnil/react

# Install framework adapters
npm install @carnil/next @carnil/adapters

# Install advanced features
npm install @carnil/analytics @carnil/pricing-editor
```

## 🚀 Quick Start

### 1. Basic Setup

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/stripe'; // Auto-registers Stripe provider

// Initialize with Stripe
const carnil = new Carnil('stripe', {
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});

// Create a customer
const customer = await carnil.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe',
});

// Create a payment intent
const paymentIntent = await carnil.createPaymentIntent({
  amount: 2000, // $20.00
  currency: 'usd',
  customer: customer.id,
});
```

### 2. React Integration

```tsx
import { CarnilProvider } from '@carnil/react';
import { useCustomer, usePayment } from '@carnil/react';

function App() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.STRIPE_SECRET_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      }}
    >
      <PaymentForm />
    </CarnilProvider>
  );
}

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
      amount: 2000,
      currency: 'usd',
      customer: customer?.id,
    });

    // Handle payment confirmation
  };

  return (
    <button onClick={handlePayment}>
      Pay $20.00
    </button>
  );
}
```

### 3. Next.js App Router

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
    // Extract user ID from your auth system
    const userId = req.headers.get('x-user-id');
    return { customerId: userId };
  },
});

export { handler as POST };
```

### 4. Express Integration

```typescript
import express from 'express';
import { expressCarnilHandler } from '@carnil/adapters';

const app = express();

app.use('/api/carnil', expressCarnilHandler({
  providerName: 'stripe',
  config: {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  identify: async (req) => {
    // Extract user ID from your auth system
    const userId = req.headers['x-user-id'];
    return { customerId: userId };
  },
}));
```

## 🔧 Advanced Features

### Analytics & Usage Tracking

```typescript
import { CarnilAnalytics } from '@carnil/analytics';

const analytics = new CarnilAnalytics(usageTracker);

// Track usage
await analytics.trackUsage('customer-123', 'api-calls', 100);

// Track AI usage
await analytics.trackAIUsage('customer-123', 'gpt-4', 1500, 0.03);

// Get analytics
const report = await analytics.getCustomerReport('customer-123', 'month');
```

### No-Code Pricing Editor

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

## 🌍 Multi-Provider Support

### Stripe

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/stripe';

const carnil = new Carnil('stripe', {
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});
```

### Razorpay

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/razorpay';

const carnil = new Carnil('razorpay', {
  keyId: process.env.RAZORPAY_KEY_ID!,
  keySecret: process.env.RAZORPAY_KEY_SECRET!,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
});
```

## 📊 Analytics Dashboard

```tsx
import { CustomerDashboard, AIUsageDashboard } from '@carnil/analytics';

function AnalyticsPage() {
  return (
    <div>
      <CustomerDashboard
        customerId="customer-123"
        data={analyticsData}
      />
      <AIUsageDashboard
        customerId="customer-123"
        data={aiAnalyticsData}
      />
    </div>
  );
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test -- --testPathPattern=packages/core

# Run tests with coverage
npm test -- --coverage
```

## 📚 Documentation

- [API Reference](./docs/api-reference.md)
- [Provider Guide](./docs/providers.md)
- [React Integration](./docs/react-integration.md)
- [Analytics Guide](./docs/analytics.md)
- [Pricing Editor](./docs/pricing-editor.md)
- [Migration Guide](./docs/migration.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/carnil/carnil-sdk.git
cd carnil-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development server
pnpm dev
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🆘 Support

- [GitHub Issues](https://github.com/carnil/carnil-sdk/issues)
- [Discord Community](https://discord.gg/carnil)
- [Documentation](https://docs.carnil.com)

## 🗺 Roadmap

- [ ] Additional payment providers (PayPal, Adyen, Paystack)
- [ ] Advanced webhook management
- [ ] Migration tools for existing billing systems
- [ ] Plugin system for custom features
- [ ] CLI tools for development
- [ ] Integration marketplace

---

Built with ❤️ by the Carnil team