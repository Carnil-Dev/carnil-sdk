import { z } from 'zod';

// ============================================================================
// Core Entity Types
// ============================================================================

export const CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  deleted: z.boolean().optional(),
  // Provider-specific fields
  provider: z.string(),
  providerId: z.string(),
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.enum(['card', 'bank_account', 'upi', 'wallet', 'netbanking', 'emi']),
  brand: z.string().optional(), // visa, mastercard, etc.
  last4: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  isDefault: z.boolean().default(false),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string(),
});

export const PaymentIntentSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum([
    'requires_payment_method',
    'requires_confirmation',
    'requires_action',
    'processing',
    'requires_capture',
    'canceled',
    'succeeded',
    'failed',
  ]),
  clientSecret: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional(),
  receiptEmail: z.string().optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string(),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: z.enum([
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused',
  ]),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean().default(false),
  canceledAt: z.date().optional(),
  trialStart: z.date().optional(),
  trialEnd: z.date().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string(),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  amount: z.number(),
  currency: z.string(),
  amountPaid: z.number().default(0),
  amountDue: z.number(),
  subtotal: z.number(),
  tax: z.number().default(0),
  total: z.number(),
  description: z.string().optional(),
  hostedInvoiceUrl: z.string().optional(),
  invoicePdf: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  dueDate: z.date().optional(),
  paidAt: z.date().optional(),
  provider: z.string(),
  providerId: z.string(),
});

export const RefundSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'succeeded', 'failed', 'canceled']),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string(),
});

export const DisputeSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum([
    'warning_needs_response',
    'warning_under_review',
    'warning_closed',
    'needs_response',
    'under_review',
    'charge_refunded',
    'won',
    'lost',
  ]),
  reason: z.enum([
    'credit_not_processed',
    'duplicate',
    'fraudulent',
    'general',
    'incorrect_account_details',
    'insufficient_funds',
    'product_not_received',
    'product_unacceptable',
    'subscription_canceled',
    'unrecognized',
  ]),
  evidence: z.record(z.any()).optional(),
  metadata: z.record(z.string()).optional(),
  created: z.date(),
  updated: z.date(),
  provider: z.string(),
  providerId: z.string(),
});

// ============================================================================
// Request/Response Types
// ============================================================================

export const CreateCustomerRequestSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const UpdateCustomerRequestSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const CreatePaymentIntentRequestSchema = z.object({
  customerId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional(),
  receiptEmail: z.string().email().optional(),
  captureMethod: z.enum(['automatic', 'manual']).default('automatic'),
});

export const CreateSubscriptionRequestSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  trialPeriodDays: z.number().optional(),
  metadata: z.record(z.string()).optional(),
  paymentMethodId: z.string().optional(),
});

export const CreateInvoiceRequestSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  dueDate: z.date().optional(),
});

export const CreateRefundRequestSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

// ============================================================================
// List/Query Types
// ============================================================================

export const ListRequestSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  startingAfter: z.string().optional(),
  endingBefore: z.string().optional(),
  created: z
    .object({
      gte: z.date().optional(),
      lte: z.date().optional(),
    })
    .optional(),
});

export const CustomerListRequestSchema = ListRequestSchema.extend({
  email: z.string().optional(),
});

export const PaymentIntentListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  status: z.string().optional(),
});

export const SubscriptionListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  status: z.string().optional(),
});

export const InvoiceListRequestSchema = ListRequestSchema.extend({
  customerId: z.string().optional(),
  subscriptionId: z.string().optional(),
  status: z.string().optional(),
});

// ============================================================================
// Webhook Types
// ============================================================================

export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  created: z.date(),
  provider: z.string(),
  livemode: z.boolean(),
});

// ============================================================================
// Analytics & Usage Types
// ============================================================================

export const UsageMetricsSchema = z.object({
  customerId: z.string(),
  featureId: z.string(),
  usage: z.number(),
  limit: z.number().optional(),
  period: z.enum(['day', 'week', 'month', 'year']),
  startDate: z.date(),
  endDate: z.date(),
  metadata: z.record(z.string()).optional(),
});

export const AIUsageMetricsSchema = z.object({
  customerId: z.string(),
  modelId: z.string(),
  tokens: z.number(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  cost: z.number(),
  timestamp: z.date(),
  metadata: z.record(z.string()).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type Customer = z.infer<typeof CustomerSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type Refund = z.infer<typeof RefundSchema>;
export type Dispute = z.infer<typeof DisputeSchema>;

export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>;
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>;
export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequestSchema>;
export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequestSchema>;
export type CreateInvoiceRequest = z.infer<typeof CreateInvoiceRequestSchema>;
export type CreateRefundRequest = z.infer<typeof CreateRefundRequestSchema>;

// ============================================================================
// Parameter Types for Provider Interfaces
// ============================================================================

// Customer parameter types
export type CreateCustomerParams = CreateCustomerRequest;
export type UpdateCustomerParams = UpdateCustomerRequest;
export type RetrieveCustomerParams = { id: string };
export type ListCustomersParams = CustomerListRequest;

// Payment Method parameter types
export type CreatePaymentMethodParams = {
  customerId: string;
  type: 'card' | 'bank_account' | 'upi' | 'wallet' | 'netbanking' | 'emi';
  token?: string;
  metadata?: Record<string, any>;
};
export type UpdatePaymentMethodParams = {
  metadata?: Record<string, any>;
};
export type RetrievePaymentMethodParams = { id: string };
export type ListPaymentMethodsParams = { customerId: string };

// Product parameter types
export type Product = {
  id: string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  created: Date;
  updated: Date;
  provider: string;
  providerId: string;
};
export type CreateProductParams = {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
};
export type UpdateProductParams = {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
};
export type RetrieveProductParams = { id: string };
export type ListProductsParams = { limit?: number; startingAfter?: string };

// Price parameter types
export type Price = {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  metadata?: Record<string, any>;
  created: Date;
  updated: Date;
  provider: string;
  providerId: string;
};
export type CreatePriceParams = {
  productId: string;
  amount: number;
  currency: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  metadata?: Record<string, any>;
};
export type UpdatePriceParams = {
  metadata?: Record<string, any>;
};
export type RetrievePriceParams = { id: string };
export type ListPricesParams = { productId?: string; limit?: number; startingAfter?: string };

// Subscription parameter types
export type CreateSubscriptionParams = CreateSubscriptionRequest;
export type UpdateSubscriptionParams = Partial<CreateSubscriptionRequest>;
export type RetrieveSubscriptionParams = { id: string };
export type ListSubscriptionsParams = SubscriptionListRequest;

// Invoice parameter types
export type CreateInvoiceParams = CreateInvoiceRequest;
export type UpdateInvoiceParams = Partial<CreateInvoiceRequest>;
export type RetrieveInvoiceParams = { id: string };
export type ListInvoicesParams = InvoiceListRequest;

// Refund parameter types
export type CreateRefundParams = CreateRefundRequest;
export type RetrieveRefundParams = { id: string };
export type ListRefundsParams = { paymentId?: string; limit?: number; startingAfter?: string };

// Dispute parameter types
export type RetrieveDisputeParams = { id: string };
export type ListDisputesParams = { limit?: number; startingAfter?: string };

// Payment Intent parameter types
export type CreatePaymentIntentParams = CreatePaymentIntentRequest;
export type UpdatePaymentIntentParams = Partial<CreatePaymentIntentRequest>;
export type RetrievePaymentIntentParams = { id: string };
export type ListPaymentIntentsParams = PaymentIntentListRequest;

export type ListRequest = z.infer<typeof ListRequestSchema>;
export type CustomerListRequest = z.infer<typeof CustomerListRequestSchema>;
export type PaymentIntentListRequest = z.infer<typeof PaymentIntentListRequestSchema>;
export type SubscriptionListRequest = z.infer<typeof SubscriptionListRequestSchema>;
export type InvoiceListRequest = z.infer<typeof InvoiceListRequestSchema>;

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
export type UsageMetrics = z.infer<typeof UsageMetricsSchema>;
export type AIUsageMetrics = z.infer<typeof AIUsageMetricsSchema>;

// ============================================================================
// Provider Configuration Types
// ============================================================================

export interface ProviderConfig {
  provider: string;
  apiKey: string;
  webhookSecret?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface CarnilConfig {
  provider: ProviderConfig;
  debug?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  userAgent?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ListResponse<T> {
  data: T[];
  hasMore: boolean;
  totalCount?: number;
  nextCursor?: string;
  prevCursor?: string;
}

export interface CarnilResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}
