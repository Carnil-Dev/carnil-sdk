import {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  RetrieveCustomerParams,
  ListCustomersParams,
  PaymentMethod,
  CreatePaymentMethodParams,
  UpdatePaymentMethodParams,
  RetrievePaymentMethodParams,
  ListPaymentMethodsParams,
  Product,
  CreateProductParams,
  UpdateProductParams,
  RetrieveProductParams,
  ListProductsParams,
  Price,
  CreatePriceParams,
  UpdatePriceParams,
  RetrievePriceParams,
  ListPricesParams,
  Subscription,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  RetrieveSubscriptionParams,
  ListSubscriptionsParams,
  Invoice,
  CreateInvoiceParams,
  UpdateInvoiceParams,
  RetrieveInvoiceParams,
  ListInvoicesParams,
  Refund,
  CreateRefundParams,
  RetrieveRefundParams,
  ListRefundsParams,
  Dispute,
  RetrieveDisputeParams,
  ListDisputesParams,
  PaymentIntent,
  CreatePaymentIntentParams,
  UpdatePaymentIntentParams,
  RetrievePaymentIntentParams,
  ListPaymentIntentsParams,
  WebhookEvent,
  UsageMetrics,
  AIUsageMetrics,
} from '../types';

// ============================================================================
// Base Provider Interface
// ============================================================================

export interface BaseProvider {
  name: string;
  init(config: Record<string, any>): Promise<void>;
}

// ============================================================================
// Customer Provider Interface
// ============================================================================

export interface CustomerProvider {
  createCustomer(params: CreateCustomerParams): Promise<Customer>;
  retrieveCustomer(params: RetrieveCustomerParams): Promise<Customer>;
  updateCustomer(id: string, params: UpdateCustomerParams): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  listCustomers(params?: ListCustomersParams): Promise<Customer[]>;
}

// ============================================================================
// Payment Method Provider Interface
// ============================================================================

export interface PaymentMethodProvider {
  createPaymentMethod(params: CreatePaymentMethodParams): Promise<PaymentMethod>;
  retrievePaymentMethod(params: RetrievePaymentMethodParams): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, params: UpdatePaymentMethodParams): Promise<PaymentMethod>;
  deletePaymentMethod(id: string): Promise<void>;
  listPaymentMethods(params?: ListPaymentMethodsParams): Promise<PaymentMethod[]>;
}

// ============================================================================
// Product Provider Interface
// ============================================================================

export interface ProductProvider {
  createProduct(params: CreateProductParams): Promise<Product>;
  retrieveProduct(params: RetrieveProductParams): Promise<Product>;
  updateProduct(id: string, params: UpdateProductParams): Promise<Product>;
  listProducts(params?: ListProductsParams): Promise<Product[]>;
}

// ============================================================================
// Price Provider Interface
// ============================================================================

export interface PriceProvider {
  createPrice(params: CreatePriceParams): Promise<Price>;
  retrievePrice(params: RetrievePriceParams): Promise<Price>;
  updatePrice(id: string, params: UpdatePriceParams): Promise<Price>;
  listPrices(params?: ListPricesParams): Promise<Price[]>;
}

// ============================================================================
// Subscription Provider Interface
// ============================================================================

export interface SubscriptionProvider {
  createSubscription(params: CreateSubscriptionParams): Promise<Subscription>;
  retrieveSubscription(params: RetrieveSubscriptionParams): Promise<Subscription>;
  updateSubscription(id: string, params: UpdateSubscriptionParams): Promise<Subscription>;
  cancelSubscription(id: string): Promise<Subscription>;
  listSubscriptions(params?: ListSubscriptionsParams): Promise<Subscription[]>;
}

// ============================================================================
// Invoice Provider Interface
// ============================================================================

export interface InvoiceProvider {
  retrieveInvoice(params: RetrieveInvoiceParams): Promise<Invoice>;
  listInvoices(params?: ListInvoicesParams): Promise<Invoice[]>;
}

// ============================================================================
// Refund Provider Interface
// ============================================================================

export interface RefundProvider {
  createRefund(params: CreateRefundParams): Promise<Refund>;
  retrieveRefund(params: RetrieveRefundParams): Promise<Refund>;
  listRefunds(params?: ListRefundsParams): Promise<Refund[]>;
}

// ============================================================================
// Dispute Provider Interface
// ============================================================================

export interface DisputeProvider {
  retrieveDispute(params: RetrieveDisputeParams): Promise<Dispute>;
  listDisputes(params?: ListDisputesParams): Promise<Dispute[]>;
}

// ============================================================================
// Payment Intent Provider Interface
// ============================================================================

export interface PaymentIntentProvider {
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;
  retrievePaymentIntent(params: RetrievePaymentIntentParams): Promise<PaymentIntent>;
  updatePaymentIntent(id: string, params: UpdatePaymentIntentParams): Promise<PaymentIntent>;
  listPaymentIntents(params?: ListPaymentIntentsParams): Promise<PaymentIntent[]>;
}

// ============================================================================
// Payment Provider Interface (alias for PaymentIntentProvider)
// ============================================================================

export interface PaymentProvider extends PaymentIntentProvider {
  // Alias for PaymentIntentProvider for backward compatibility
}

// ============================================================================
// Analytics Provider Interface
// ============================================================================

export interface AnalyticsProvider {
  trackEvent(event: string, properties?: Record<string, any>): Promise<void>;
  trackPageView(page: string, properties?: Record<string, any>): Promise<void>;
  trackUser(userId: string, properties?: Record<string, any>): Promise<void>;
  getMetrics(timeRange: { start: Date; end: Date }): Promise<any>;
}

// ============================================================================
// Provider Registry Interface
// ============================================================================

export interface ProviderRegistry {
  register(name: string, provider: any): void;
  get(name: string): any;
  list(): string[];
  unregister(name: string): boolean;
  create(name: string, config: any): CarnilProvider;
}

// ============================================================================
// Additional Provider Methods
// ============================================================================

export interface HealthCheckProvider {
  healthCheck(): Promise<boolean>;
}

export interface PaymentMethodOperationsProvider {
  attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod>;
  detachPaymentMethod(paymentMethodId: string): Promise<void>;
  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod>;
}

export interface PaymentIntentOperationsProvider {
  getPaymentIntent(id: string): Promise<PaymentIntent>;
  cancelPaymentIntent(id: string): Promise<PaymentIntent>;
  confirmPaymentIntent(id: string, paymentMethodId?: string): Promise<PaymentIntent>;
  capturePaymentIntent(id: string, amount?: number): Promise<PaymentIntent>;
}

export interface SubscriptionOperationsProvider {
  getSubscription(id: string): Promise<Subscription>;
}

export interface InvoiceOperationsProvider {
  createInvoice(params: CreateInvoiceParams): Promise<Invoice>;
  getInvoice(id: string): Promise<Invoice>;
  updateInvoice(id: string, params: UpdateInvoiceParams): Promise<Invoice>;
  finalizeInvoice(id: string): Promise<Invoice>;
  payInvoice(id: string, paymentMethodId?: string): Promise<Invoice>;
}

export interface RefundOperationsProvider {
  getRefund(id: string): Promise<Refund>;
}

export interface WebhookProvider {
  verifyWebhook(payload: string, signature: string, secret: string): Promise<boolean>;
  parseWebhook(payload: string, signature: string, secret: string): Promise<WebhookEvent>;
}

export interface AnalyticsOperationsProvider {
  trackUsage(metrics: UsageMetrics): Promise<void>;
  trackAIUsage(metrics: AIUsageMetrics): Promise<void>;
  getUsageMetrics(customerId: string, featureId: string, period: string): Promise<UsageMetrics[]>;
  getAIUsageMetrics(
    customerId: string,
    modelId?: string,
    period?: string
  ): Promise<AIUsageMetrics[]>;
}

// ============================================================================
// Complete Provider Interface
// ============================================================================

export interface CarnilProvider
  extends BaseProvider,
    CustomerProvider,
    PaymentMethodProvider,
    ProductProvider,
    PriceProvider,
    SubscriptionProvider,
    InvoiceProvider,
    RefundProvider,
    DisputeProvider,
    PaymentIntentProvider,
    HealthCheckProvider,
    PaymentMethodOperationsProvider,
    PaymentIntentOperationsProvider,
    SubscriptionOperationsProvider,
    InvoiceOperationsProvider,
    RefundOperationsProvider,
    WebhookProvider,
    AnalyticsOperationsProvider {
  // All methods are inherited from the individual provider interfaces
}
