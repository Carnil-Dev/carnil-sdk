# Carnil Payments SDK - Tutorials

## 🚀 Getting Started

### Tutorial 1: Your First Payment

Learn how to create your first payment with Carnil in under 5 minutes.

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/stripe'; // Auto-registers Stripe provider

// Initialize Carnil
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
const payment = await carnil.createPaymentIntent({
  amount: 2000, // $20.00
  currency: 'usd',
  customer: customer.id,
});

console.log('Payment created:', payment.id);
```

### Tutorial 2: React Integration

Build a payment form with React hooks.

```tsx
import { CarnilProvider } from '@carnil/react';
import { useCustomer, usePayment } from '@carnil/react';

function PaymentForm() {
  const { customer, createCustomer } = useCustomer();
  const { createPaymentIntent, confirmPayment } = usePayment();
  
  const handlePayment = async (amount: number) => {
    // Create customer if needed
    if (!customer) {
      await createCustomer({
        email: 'customer@example.com',
        name: 'John Doe',
      });
    }
    
    // Create and confirm payment
    const payment = await createPaymentIntent({
      amount,
      currency: 'usd',
      customer: customer?.id,
    });
    
    const confirmed = await confirmPayment(payment.id);
    console.log('Payment confirmed:', confirmed);
  };
  
  return (
    <button onClick={() => handlePayment(2000)}>
      Pay $20.00
    </button>
  );
}

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
```

### Tutorial 3: Next.js API Routes

Create API routes for payment processing.

```typescript
// app/api/payments/route.ts
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

## 💳 Payment Methods

### Tutorial 4: Multiple Payment Methods

Support various payment methods across different regions.

```typescript
import { Carnil } from '@carnil/core';
import '@carnil/globalization';

const carnil = new Carnil('stripe', {
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

// Get available payment methods for a region
const paymentMethods = await carnil.getLocalizedPaymentMethods('US', 'USD');

// Create payment with preferred method
const payment = await carnil.createPaymentIntent({
  amount: 2000,
  currency: 'usd',
  paymentMethod: {
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123',
    },
  },
});
```

### Tutorial 5: Subscription Management

Handle recurring payments and subscriptions.

```typescript
// Create a subscription
const subscription = await carnil.createSubscription({
  customer: customer.id,
  priceId: 'price_123',
  paymentMethod: paymentMethod.id,
});

// Update subscription
const updated = await carnil.updateSubscription(subscription.id, {
  priceId: 'price_456', // Change plan
});

// Cancel subscription
await carnil.cancelSubscription(subscription.id);
```

## 🌍 Global Payments

### Tutorial 6: Multi-Currency Support

Handle payments in different currencies with automatic conversion.

```typescript
import { globalGlobalizationManager } from '@carnil/globalization';

// Convert currency
const conversion = await globalGlobalizationManager.convertCurrency(
  100, // $100 USD
  'USD',
  'EUR'
);

console.log(`$100 USD = €${conversion.convertedAmount.toFixed(2)} EUR`);

// Create payment in local currency
const payment = await carnil.createPaymentIntent({
  amount: conversion.convertedAmount,
  currency: 'eur',
  customer: customer.id,
});
```

### Tutorial 7: Tax Calculation

Automatically calculate taxes for different jurisdictions.

```typescript
import { globalTaxManager } from '@carnil/compliance';

// Calculate tax for a customer
const taxCalculation = await globalTaxManager.calculateTax(
  1000, // $10.00
  'us-ca', // California jurisdiction
  customer.id
);

console.log(`Subtotal: $${taxCalculation.subtotal}`);
console.log(`Tax: $${taxCalculation.total - taxCalculation.subtotal}`);
console.log(`Total: $${taxCalculation.total}`);
```

## 📊 Analytics & Monitoring

### Tutorial 8: Usage Analytics

Track and analyze payment usage with built-in analytics.

```typescript
import { CarnilAnalytics } from '@carnil/analytics';

const analytics = new CarnilAnalytics(usageTracker);

// Track usage
await analytics.trackUsage('customer-123', 'api-calls', 100);

// Track AI usage
await analytics.trackAIUsage('customer-123', 'gpt-4', 1500, 0.03);

// Get analytics report
const report = await analytics.getCustomerReport('customer-123', 'month');

console.log('Total usage:', report.summary.totalUsage);
console.log('Total cost:', report.summary.totalCost);
```

### Tutorial 9: Real-time Dashboards

Create real-time analytics dashboards with React.

```tsx
import { CustomerDashboard, AIUsageDashboard } from '@carnil/analytics';

function AnalyticsPage() {
  const { analytics, loading, error } = useAnalytics('customer-123');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <CustomerDashboard
        customerId="customer-123"
        data={analytics}
      />
      <AIUsageDashboard
        customerId="customer-123"
        data={analytics.aiUsage}
      />
    </div>
  );
}
```

## 🎨 No-Code Pricing

### Tutorial 10: Visual Pricing Editor

Create and manage pricing plans with the visual editor.

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

### Tutorial 11: A/B Testing Pricing

Test different pricing strategies with built-in A/B testing.

```typescript
// Create A/B test
const abTest = await carnil.createABTest({
  name: 'Pricing Test',
  planA: 'plan_basic',
  planB: 'plan_premium',
  trafficSplit: 0.5, // 50/50 split
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
});

// Get test results
const results = await carnil.getABTestResults(abTest.id);
console.log('Plan A conversions:', results.planAConversions);
console.log('Plan B conversions:', results.planBConversions);
```

## 🔒 Compliance & Security

### Tutorial 12: GDPR Compliance

Implement GDPR compliance features for European customers.

```typescript
import { globalGDPRManager } from '@carnil/compliance';

// Create data subject
const dataSubject = await globalGDPRManager.createDataSubject({
  email: 'customer@example.com',
  name: 'John Doe',
});

// Record consent
await globalGDPRManager.recordConsent(
  dataSubject.id,
  'marketing',
  true,
  'explicit'
);

// Request data erasure
const erasureRequest = await globalGDPRManager.requestDataErasure(
  dataSubject.id,
  'Customer requested data deletion',
  'customer@example.com'
);

// Process erasure request
await globalGDPRManager.processDataErasure(
  erasureRequest.id,
  'admin@example.com',
  {
    dataCategories: ['personal', 'payment'],
    systemsAffected: ['database', 'analytics'],
    backupRetention: false,
  }
);
```

### Tutorial 13: Audit Logging

Implement comprehensive audit logging for compliance.

```typescript
import { globalAuditLogger } from '@carnil/compliance';

// Log user actions
await globalAuditLogger.logUserAction(
  'user-123',
  'payment_created',
  'Created payment for $20.00',
  { paymentId: 'pay_123', amount: 2000 }
);

// Log data access
await globalAuditLogger.logDataAccess(
  'user-123',
  'customer',
  'cus_123',
  'view',
  { ipAddress: '192.168.1.1' }
);

// Generate compliance report
const report = await globalAuditLogger.generateComplianceReport(
  'gdpr',
  { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
  'admin@example.com'
);
```

## 🔗 Webhooks & Integrations

### Tutorial 14: Webhook Management

Set up and manage webhooks for payment events.

```typescript
import { globalEventBus } from '@carnil/webhooks';

// Create webhook subscription
const subscription = await globalEventBus.createSubscription({
  name: 'Payment Webhooks',
  url: 'https://your-app.com/webhooks/payments',
  events: ['payment.succeeded', 'payment.failed'],
  secret: 'your-webhook-secret',
  retryPolicy: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
});

// Emit events
await globalEventBus.emitEvent({
  type: 'payment.succeeded',
  data: { paymentId: 'pay_123', amount: 2000 },
  source: 'stripe',
});
```

### Tutorial 15: Zapier Integration

Connect Carnil with Zapier for automation.

```typescript
// Create Zapier webhook
const zapierSubscription = await globalEventBus.createSubscription({
  name: 'Zapier Integration',
  url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
  events: ['payment.succeeded'],
  headers: {
    'Authorization': 'Bearer your-zapier-token',
  },
});
```

## 🧪 Testing

### Tutorial 16: Testing Payments

Write comprehensive tests for payment functionality.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Carnil } from '@carnil/core';

describe('Payment Integration', () => {
  let carnil: Carnil;
  
  beforeEach(() => {
    carnil = new Carnil('stripe', {
      apiKey: 'sk_test_...',
      webhookSecret: 'whsec_...',
    });
  });
  
  it('should create and confirm payment', async () => {
    const customer = await carnil.createCustomer({
      email: 'test@example.com',
      name: 'Test Customer',
    });
    
    const payment = await carnil.createPaymentIntent({
      amount: 2000,
      currency: 'usd',
      customer: customer.id,
    });
    
    expect(payment.id).toBeDefined();
    expect(payment.amount).toBe(2000);
    expect(payment.currency).toBe('usd');
  });
});
```

### Tutorial 17: Mock Testing

Use mocks for testing without hitting real payment providers.

```typescript
import { MockProvider } from '@carnil/core/testing';

const mockProvider = new MockProvider();
Carnil.registerProvider('mock', MockProvider);

const carnil = new Carnil('mock', {});
// Now you can test without real API calls
```

## 🚀 Advanced Features

### Tutorial 18: Custom Providers

Create your own payment provider implementation.

```typescript
import { CarnilProvider } from '@carnil/core';

export class CustomProvider implements CarnilProvider {
  public name = 'custom';
  
  async init(config: Record<string, any>): Promise<void> {
    // Initialize your custom provider
  }
  
  async createCustomer(params: CreateCustomerParams): Promise<Customer> {
    // Implement customer creation
    return {
      id: 'cus_custom_123',
      email: params.email,
      name: params.name,
      created: new Date().toISOString(),
    };
  }
  
  // Implement all other required methods...
}

// Register your provider
Carnil.registerProvider('custom', CustomProvider);
```

### Tutorial 19: Plugin System

Extend Carnil with custom plugins.

```typescript
import { CarnilPlugin } from '@carnil/core';

class AnalyticsPlugin implements CarnilPlugin {
  name = 'analytics';
  
  install(carnil: Carnil) {
    // Add analytics tracking to all payments
    const originalCreatePayment = carnil.createPaymentIntent;
    
    carnil.createPaymentIntent = async (params) => {
      const result = await originalCreatePayment.call(carnil, params);
      
      // Track payment creation
      await this.trackEvent('payment.created', {
        paymentId: result.id,
        amount: result.amount,
        currency: result.currency,
      });
      
      return result;
    };
  }
  
  private async trackEvent(event: string, data: any) {
    // Send to your analytics service
  }
}

// Use the plugin
carnil.use(new AnalyticsPlugin());
```

## 📱 Mobile Integration

### Tutorial 20: React Native

Use Carnil in React Native applications.

```typescript
import { CarnilProvider } from '@carnil/react-native';

function App() {
  return (
    <CarnilProvider
      providerName="stripe"
      config={{
        apiKey: process.env.STRIPE_SECRET_KEY!,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
      }}
    >
      <PaymentScreen />
    </CarnilProvider>
  );
}
```

## 🎯 Best Practices

### Security Best Practices

```typescript
// ✅ Good: Validate input data
const payment = await carnil.createPaymentIntent({
  amount: Math.max(0, amount), // Ensure non-negative
  currency: currency.toLowerCase(), // Normalize currency
  customer: customer.id,
});

// ✅ Good: Handle errors gracefully
try {
  const result = await carnil.createPaymentIntent(params);
  return result;
} catch (error) {
  if (error instanceof CarnilValidationError) {
    // Handle validation errors
    return { error: 'Invalid payment data' };
  }
  throw error;
}
```

### Performance Optimization

```typescript
// ✅ Good: Use caching for frequently accessed data
const cachedCustomer = await cache.get(`customer:${customerId}`);
if (cachedCustomer) {
  return cachedCustomer;
}

const customer = await carnil.retrieveCustomer({ id: customerId });
await cache.set(`customer:${customerId}`, customer, 3600); // 1 hour
return customer;
```

## 🆘 Troubleshooting

### Common Issues

1. **Webhook verification failed**
   ```typescript
   // Check your webhook secret
   const isValid = await carnil.verifyWebhook(payload, signature, secret);
   ```

2. **Provider not found**
   ```typescript
   // Make sure to import the provider
   import '@carnil/stripe';
   ```

3. **Type errors**
   ```typescript
   // Ensure proper typing
   const payment: PaymentIntent = await carnil.createPaymentIntent(params);
   ```

## 📚 Additional Resources

- **API Reference**: [https://docs.carnil.com/api](https://docs.carnil.com/api)
- **Examples Repository**: [https://github.com/carnil/carnil-examples](https://github.com/carnil/carnil-examples)
- **Community Forum**: [https://discuss.carnil.com](https://discuss.carnil.com)
- **Video Tutorials**: [https://youtube.com/carnil](https://youtube.com/carnil)

---

**Happy coding! 🚀**
