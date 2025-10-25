# Contributing to Carnil Payments SDK

Thank you for your interest in contributing to Carnil! We welcome contributions from the community and are grateful for your help in making Carnil better.

## 🎯 How to Contribute

### 🐛 Bug Reports

If you find a bug, please create an issue with:

1. **Clear description** of the bug
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Node.js version, etc.)
5. **Code samples** if applicable

### ✨ Feature Requests

For new features, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and benefits
3. **Provide examples** of how it would work
4. **Consider the impact** on existing APIs

### 🔧 Pull Requests

We welcome pull requests! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Write tests** for new functionality
3. **Update documentation** as needed
4. **Follow our coding standards** (see below)
5. **Submit a PR** with a clear description

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/your-username/carnil-sdk.git
cd carnil-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development server
pnpm dev
```

### Project Structure

```
carnil-sdk/
├── packages/
│   ├── core/              # Core SDK
│   ├── stripe/            # Stripe provider
│   ├── razorpay/          # Razorpay provider
│   ├── react/             # React integration
│   ├── next/              # Next.js adapter
│   ├── adapters/          # Framework adapters
│   ├── analytics/         # Analytics package
│   ├── compliance/        # Compliance tools
│   ├── globalization/     # Multi-currency support
│   ├── pricing-editor/    # No-code pricing editor
│   └── webhooks/          # Webhook system
├── examples/              # Example applications
├── docs/                  # Documentation
└── tests/                 # Integration tests
```

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Clear interfaces
interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

// ✅ Good: Proper error handling
try {
  const result = await provider.createPaymentIntent(params);
  return result;
} catch (error) {
  throw new CarnilError('Payment creation failed', 'payment_error', error);
}

// ❌ Bad: Any types
function processPayment(data: any): any {
  return data;
}
```

### Code Style

We use ESLint and Prettier for consistent code style:

```bash
# Check code style
pnpm lint

# Fix code style issues
pnpm lint:fix

# Format code
pnpm format
```

### Testing Requirements

All new code must include tests:

```typescript
// ✅ Good: Comprehensive tests
describe('PaymentIntent', () => {
  it('should create a payment intent', async () => {
    const result = await carnil.createPaymentIntent({
      amount: 2000,
      currency: 'usd',
    });
    
    expect(result).toHaveProperty('id');
    expect(result.amount).toBe(2000);
    expect(result.currency).toBe('usd');
  });
  
  it('should handle validation errors', async () => {
    await expect(
      carnil.createPaymentIntent({ amount: -100 })
    ).rejects.toThrow(CarnilValidationError);
  });
});
```

## 🏗️ Architecture Guidelines

### Provider Implementation

When implementing a new payment provider:

```typescript
// ✅ Good: Follow the interface contract
export class NewProvider implements CarnilProvider {
  public name = 'new-provider';
  
  async init(config: Record<string, any>): Promise<void> {
    // Initialize provider
  }
  
  async createCustomer(params: CreateCustomerParams): Promise<Customer> {
    // Implement according to interface
  }
  
  // ... implement all required methods
}
```

### Error Handling

```typescript
// ✅ Good: Consistent error handling
export class ProviderError extends CarnilError {
  constructor(
    message: string,
    provider: string,
    originalError?: Error
  ) {
    super(message, 'provider_error', provider);
    this.provider = provider;
    this.originalError = originalError;
  }
}
```

### Documentation

All public APIs must be documented:

```typescript
/**
 * Creates a new payment intent
 * @param params - Payment intent parameters
 * @returns Promise resolving to PaymentIntent
 * @throws {CarnilValidationError} When parameters are invalid
 * @throws {CarnilProviderError} When provider request fails
 * @example
 * ```typescript
 * const payment = await carnil.createPaymentIntent({
 *   amount: 2000,
 *   currency: 'usd',
 *   customer: 'cus_123'
 * });
 * ```
 */
async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Test individual functions and classes
describe('Carnil', () => {
  it('should register providers', () => {
    Carnil.registerProvider('test', MockProvider);
    expect(() => new Carnil('test', {})).not.toThrow();
  });
});
```

### Integration Tests

```typescript
// Test provider integrations
describe('Stripe Integration', () => {
  it('should create customers', async () => {
    const provider = new StripeProvider({ apiKey: 'test_key' });
    const customer = await provider.createCustomer({
      email: 'test@example.com',
      name: 'Test Customer',
    });
    
    expect(customer.email).toBe('test@example.com');
  });
});
```

### E2E Tests

```typescript
// Test complete workflows
describe('Payment Flow', () => {
  it('should complete payment from start to finish', async () => {
    // Create customer
    const customer = await carnil.createCustomer({
      email: 'test@example.com',
    });
    
    // Create payment intent
    const payment = await carnil.createPaymentIntent({
      amount: 2000,
      currency: 'usd',
      customer: customer.id,
    });
    
    // Confirm payment
    const confirmed = await carnil.confirmPayment(payment.id);
    
    expect(confirmed.status).toBe('succeeded');
  });
});
```

## 📚 Documentation Standards

### README Files

Each package should have a comprehensive README:

```markdown
# @carnil/stripe

Stripe provider for Carnil Payments SDK.

## Installation

```bash
npm install @carnil/stripe
```

## Usage

```typescript
import { StripeProvider } from '@carnil/stripe';

const provider = new StripeProvider({
  apiKey: 'sk_test_...',
});
```

## API Reference

### StripeProvider

#### constructor(config)

Creates a new Stripe provider instance.

**Parameters:**
- `config.apiKey` (string): Stripe API key
- `config.webhookSecret` (string): Webhook secret for verification

#### createCustomer(params)

Creates a new customer in Stripe.

**Parameters:**
- `params.email` (string): Customer email
- `params.name` (string): Customer name

**Returns:** Promise<Customer>
```

### Code Comments

```typescript
/**
 * Processes webhook events from payment providers
 * 
 * This method handles the complete webhook lifecycle:
 * 1. Verifies the webhook signature
 * 2. Parses the event payload
 * 3. Routes to appropriate handler
 * 4. Returns standardized response
 * 
 * @param payload - Raw webhook payload
 * @param signature - Webhook signature for verification
 * @param secret - Secret key for signature verification
 * @returns Promise resolving to processed webhook event
 * 
 * @example
 * ```typescript
 * const event = await carnil.processWebhook(
 *   request.body,
 *   request.headers['stripe-signature'],
 *   process.env.STRIPE_WEBHOOK_SECRET
 * );
 * ```
 */
async processWebhook(payload: string, signature: string, secret: string): Promise<WebhookEvent> {
  // Implementation
}
```

## 🎁 Bounty Program

We offer bounties for significant contributions:

### 🏆 High-Value Bounties ($500+)

- **New Payment Provider**: Complete implementation of a major payment provider (PayPal, Square, etc.)
- **Advanced Analytics**: Machine learning-powered payment insights
- **Mobile SDK**: React Native or Flutter integration
- **Enterprise Features**: Advanced compliance and security features

### 💰 Medium Bounties ($100-500)

- **Framework Adapters**: New framework integrations (Fastify, Koa, etc.)
- **Testing Tools**: Advanced testing utilities and mocks
- **Documentation**: Comprehensive guides and tutorials
- **Performance**: Optimization and caching improvements

### 🎯 Small Bounties ($25-100)

- **Bug Fixes**: Critical bug fixes and security patches
- **Documentation**: API documentation improvements
- **Examples**: New example applications
- **Testing**: Test coverage improvements

### How to Claim Bounties

1. **Check the bounty board**: [https://github.com/carnil/carnil-sdk/issues?q=is:issue+is:open+label:bounty](https://github.com/carnil/carnil-sdk/issues?q=is:issue+is:open+label:bounty)
2. **Comment on the issue** to claim the bounty
3. **Submit your PR** following our guidelines
4. **Get reviewed and merged**
5. **Receive your bounty** via GitHub Sponsors or PayPal

## 🏅 Recognition

### Contributors Hall of Fame

We recognize our top contributors:

- **🏆 Core Contributors**: Major architectural contributions
- **🔧 Provider Experts**: Payment provider specialists
- **📚 Documentation Heroes**: Documentation and tutorial creators
- **🧪 Testing Champions**: Test coverage and quality improvements
- **🎨 UI/UX Wizards**: Design and user experience improvements

### Contributor Benefits

- **Early access** to new features
- **Direct communication** with maintainers
- **Recognition** in our documentation
- **Swag and merchandise** for top contributors
- **Conference speaking opportunities**

## 📞 Getting Help

### Community Support

- **GitHub Discussions**: [https://github.com/carnil/carnil-sdk/discussions](https://github.com/carnil/carnil-sdk/discussions)
- **Discord**: [https://discord.gg/carnil](https://discord.gg/carnil)
- **Stack Overflow**: Tag questions with `carnil-payments`

### Maintainer Contact

- **Email**: maintainers@carnil.com
- **Twitter**: [@CarnilPayments](https://twitter.com/CarnilPayments)
- **LinkedIn**: [Carnil Team](https://linkedin.com/company/carnil)

## 📋 Checklist for Contributors

Before submitting a PR, ensure:

- [ ] Code follows our style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Commit messages are clear
- [ ] PR description explains the changes
- [ ] All CI checks are passing

## 🎉 Thank You!

Thank you for contributing to Carnil! Your efforts help make payments easier for developers worldwide. We appreciate every contribution, no matter how small.

---

**Happy coding! 🚀**
