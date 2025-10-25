// ============================================================================
// Carnil Payments SDK - Unified Package
// ============================================================================

// Core exports
export { Carnil } from './carnil';
export * from './types';
export * from './providers/base';
export * from './errors';

// Provider exports
export { StripeProvider, createStripeProvider } from './stripe';
export { RazorpayProvider, createRazorpayProvider } from './razorpay';

// Framework integrations
export { CarnilProvider, useCarnilContext, useCarnil, useCustomer, useCustomerList } from './react';
export { createCarnilHandler } from './next';

// Adapters
export {
  createCarnilExpressHandler,
  createCarnilExpressWebhookHandler,
  setupCarnilExpress,
} from './adapters';

// Analytics
export { CustomerDashboard } from './analytics';

// Pricing Editor
export { PricingEditor } from './pricing-editor';

// Webhooks
export { EventBus } from './webhooks';

// Compliance
export { AuditLogger } from './compliance';

// Globalization
export { CurrencyManager } from './globalization';

// ============================================================================
// Re-exports for convenience
// ============================================================================

// Main exports
export { Carnil as default } from './carnil';

// Type exports
export type {
  Customer,
  PaymentMethod,
  PaymentIntent,
  Subscription,
  Invoice,
  Refund,
  Dispute,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreatePaymentIntentRequest,
  CreateSubscriptionRequest,
  CreateInvoiceRequest,
  CreateRefundRequest,
  CustomerListRequest,
  PaymentIntentListRequest,
  SubscriptionListRequest,
  InvoiceListRequest,
  ListResponse,
  WebhookEvent,
  UsageMetrics,
  AIUsageMetrics,
  CarnilConfig,
  CarnilResponse,
  ProviderConfig,
} from './types';

export type {
  CustomerProvider,
  PaymentProvider,
  SubscriptionProvider,
  InvoiceProvider,
  RefundProvider,
  DisputeProvider,
  AnalyticsProvider,
  ProviderRegistry,
} from './providers/base';

// Error exports
export {
  CarnilError,
  CarnilValidationError,
  CarnilAuthenticationError,
  CarnilPermissionError,
  CarnilNotFoundError,
  CarnilRateLimitError,
  CarnilServerError,
  CarnilNetworkError,
  CarnilTimeoutError,
  CarnilWebhookError,
  CarnilProviderError,
  createProviderError,
  createValidationError,
  createNotFoundError,
  createRateLimitError,
  handleError,
  isCarnilError,
  isCarnilValidationError,
  isCarnilAuthenticationError,
  isCarnilPermissionError,
  isCarnilNotFoundError,
  isCarnilRateLimitError,
  isCarnilServerError,
  isCarnilNetworkError,
  isCarnilTimeoutError,
  isCarnilWebhookError,
  isCarnilProviderError,
} from './errors';
