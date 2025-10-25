// ============================================================================
// Core Carnil Payments SDK
// ============================================================================

// Main Carnil class
export { Carnil } from './carnil';

// Types and interfaces
export * from './types';

// Provider interfaces
export * from './providers/base';

// Error classes and utilities
export * from './errors';

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
  CarnilProvider,
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
