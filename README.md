# Carnil SDK

A unified payments SDK for Stripe, Razorpay, and other payment providers with React, Next.js, and framework integrations.

## Installation

```bash
npm install @carnil/sdk
# or
yarn add @carnil/sdk
# or
pnpm add @carnil/sdk
```

## Quick Start

### Basic Usage

```typescript
import { Carnil } from '@carnil/sdk';

const carnil = new Carnil({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});

// Create a customer
const customer = await carnil.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe',
});

// Create a payment intent
const paymentIntent = await carnil.createPaymentIntent({
  customerId: customer.data.id,
  amount: 2000, // $20.00
  currency: 'usd',
  description: 'Test payment',
});
```

### React Integration

```typescript
import { CarnilProvider, useCustomer } from '@carnil/sdk/react';

function App() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.REACT_APP_STRIPE_SECRET_KEY,
        webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET,
      }}
    >
      <PaymentForm />
    </CarnilProvider>
  );
}

function PaymentForm() {
  const { customer, createCustomer } = useCustomer();

  const handlePayment = async () => {
    if (!customer) {
      await createCustomer({
        email: 'customer@example.com',
        name: 'John Doe',
      });
    }
    // ... rest of payment logic
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

### Next.js Integration

```typescript
// app/api/carnil/route.ts
import { createCarnilHandler } from '@carnil/sdk/next';

const handler = createCarnilHandler({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  identify: async req => {
    const userId = req.headers.get('x-user-id') || 'demo-user-123';
    return {
      customerId: userId,
      customerData: {
        name: 'Demo User',
        email: 'demo@example.com',
      },
    };
  },
});

export { handler as POST };
```

## Module Exports

The SDK is organized into modules that can be imported individually:

### Core Module

```typescript
import { Carnil, CarnilError } from '@carnil/sdk';
// or
import { Carnil, CarnilError } from '@carnil/sdk/core';
```

### Provider Modules

```typescript
import { StripeProvider } from '@carnil/sdk/stripe';
import { RazorpayProvider } from '@carnil/sdk/razorpay';
```

### Framework Integrations

```typescript
import { CarnilProvider, useCustomer } from '@carnil/sdk/react';
import { createCarnilHandler } from '@carnil/sdk/next';
```

### Additional Modules

```typescript
// Analytics
import { CustomerDashboard } from '@carnil/sdk/analytics';

// Compliance
import { AuditLogger } from '@carnil/sdk/compliance';

// Globalization
import { CurrencyManager } from '@carnil/sdk/globalization';

// Pricing Editor
import { PricingEditor } from '@carnil/sdk/pricing-editor';

// Webhooks
import { EventBus } from '@carnil/sdk/webhooks';

// Adapters
import { expressAdapter } from '@carnil/sdk/adapters';
```

## Supported Providers

- **Stripe** - Full support for all Stripe features
- **Razorpay** - Complete Razorpay integration
- **Custom Providers** - Extend the base provider class

## Features

- 🚀 **Unified API** - Single interface for all payment providers
- ⚛️ **React Integration** - Hooks and components for React apps
- 🔄 **Next.js Support** - API routes and server components
- 📊 **Analytics** - Built-in analytics and reporting
- 🔒 **Compliance** - GDPR, audit logging, and data protection
- 🌍 **Globalization** - Multi-currency and localization support
- 🎨 **Pricing Editor** - Visual pricing management
- 🔗 **Webhooks** - Event handling and workflow automation
- 🛠️ **Adapters** - Express, Hono, and other framework adapters

## Examples

Check out the `examples/` directory for complete examples:

- **Basic Usage** - Simple Node.js example
- **React Example** - React app with hooks
- **Next.js App** - Full Next.js application
- **SaaS Dashboard** - Complete dashboard with all features

## Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Tutorials](./docs/TUTORIALS.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📧 Email: hello@carnil.dev
- 🐛 Issues: [GitHub Issues](https://github.com/Carnil-Dev/carnil-sdk/issues)
- 📖 Docs: [carnil.dev](https://carnil.dev)
