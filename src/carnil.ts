import type {
  Customer,
  PaymentMethod,
  PaymentIntent,
  Subscription,
  Invoice,
  Refund,
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
} from './types';

import type { CarnilProvider, ProviderRegistry } from './providers/base';

import { CarnilError, handleError } from './errors';

// ============================================================================
// Provider Registry Implementation
// ============================================================================

class DefaultProviderRegistry implements ProviderRegistry {
  private providers = new Map<string, any>();

  register(name: string, factory: any): void {
    this.providers.set(name, factory);
  }

  get(name: string): any {
    return this.providers.get(name);
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }

  unregister(name: string): boolean {
    return this.providers.delete(name);
  }

  create(name: string, config: any): CarnilProvider {
    const factory = this.providers.get(name);
    if (!factory) {
      throw new CarnilError(`Provider '${name}' not found`, 'PROVIDER_NOT_FOUND');
    }

    // Support both factory objects with a create method and direct class constructors
    if (typeof factory === 'function') {
      // It's a class constructor
      return new factory(config);
    } else if (factory && typeof factory.create === 'function') {
      // It's a factory object with a create method
      return factory.create(config);
    } else {
      throw new CarnilError(
        `Invalid provider factory for '${name}'. Expected a class constructor or an object with a create method.`,
        'INVALID_PROVIDER_FACTORY'
      );
    }
  }
}

// ============================================================================
// Main Carnil Class
// ============================================================================

export class Carnil {
  private provider: CarnilProvider;
  private config: CarnilConfig;
  private static registry: ProviderRegistry = new DefaultProviderRegistry();

  constructor(config: CarnilConfig) {
    this.config = config;
    this.provider = Carnil.registry.create(config.provider.provider, config.provider);
  }

  // ========================================================================
  // Static Methods
  // ========================================================================

  static registerProvider(name: string, factory: any): void {
    Carnil.registry.register(name, factory);
  }

  static getRegisteredProviders(): string[] {
    return Carnil.registry.list();
  }

  static createProvider(name: string, config: any): CarnilProvider {
    return Carnil.registry.create(name, config);
  }

  // ========================================================================
  // Provider Access
  // ========================================================================

  getProvider(): CarnilProvider {
    return this.provider;
  }

  getConfig(): CarnilConfig {
    return this.config;
  }

  // ========================================================================
  // Health Check
  // ========================================================================

  async healthCheck(): Promise<boolean> {
    try {
      return await this.provider.healthCheck();
    } catch (error) {
      if (this.config.debug) {
        // Log error (in production, use proper logging)
        if (typeof console !== 'undefined') {
          console.error('Health check failed:', error);
        }
      }
      return false;
    }
  }

  // ========================================================================
  // Customer Operations
  // ========================================================================

  async createCustomer(request: CreateCustomerRequest): Promise<CarnilResponse<Customer>> {
    try {
      const customer = await this.provider.createCustomer(request);
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async getCustomer(id: string): Promise<CarnilResponse<Customer>> {
    try {
      const customer = await this.provider.retrieveCustomer({ id });
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async updateCustomer(
    id: string,
    request: UpdateCustomerRequest
  ): Promise<CarnilResponse<Customer>> {
    try {
      const customer = await this.provider.updateCustomer(id, request);
      return { data: customer, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async deleteCustomer(id: string): Promise<CarnilResponse<void>> {
    try {
      await this.provider.deleteCustomer(id);
      return { data: undefined, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: undefined, success: false, error: carnilError.message };
    }
  }

  async listCustomers(
    request?: CustomerListRequest
  ): Promise<CarnilResponse<ListResponse<Customer>>> {
    try {
      const customers = await this.provider.listCustomers(request);
      // Ensure the response is wrapped in ListResponse format
      const listResponse: ListResponse<Customer> = Array.isArray(customers)
        ? { data: customers, hasMore: false }
        : customers;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Payment Method Operations
  // ========================================================================

  async listPaymentMethods(customerId: string): Promise<CarnilResponse<PaymentMethod[]>> {
    try {
      const paymentMethods = await this.provider.listPaymentMethods({ customerId });
      return { data: paymentMethods, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }

  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<CarnilResponse<PaymentMethod>> {
    try {
      const paymentMethod = await this.provider.attachPaymentMethod(customerId, paymentMethodId);
      return { data: paymentMethod, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<CarnilResponse<void>> {
    try {
      await this.provider.detachPaymentMethod(paymentMethodId);
      return { data: undefined, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: undefined, success: false, error: carnilError.message };
    }
  }

  async setDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<CarnilResponse<PaymentMethod>> {
    try {
      const paymentMethod = await this.provider.setDefaultPaymentMethod(
        customerId,
        paymentMethodId
      );
      return { data: paymentMethod, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Payment Intent Operations
  // ========================================================================

  async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.createPaymentIntent(request);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async getPaymentIntent(id: string): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.getPaymentIntent(id);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async updatePaymentIntent(
    id: string,
    updates: Partial<CreatePaymentIntentRequest>
  ): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.updatePaymentIntent(id, updates);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async cancelPaymentIntent(id: string): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.cancelPaymentIntent(id);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async confirmPaymentIntent(
    id: string,
    paymentMethodId?: string
  ): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.confirmPaymentIntent(id, paymentMethodId);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async capturePaymentIntent(id: string, amount?: number): Promise<CarnilResponse<PaymentIntent>> {
    try {
      const paymentIntent = await this.provider.capturePaymentIntent(id, amount);
      return { data: paymentIntent, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async listPaymentIntents(
    request?: PaymentIntentListRequest
  ): Promise<CarnilResponse<ListResponse<PaymentIntent>>> {
    try {
      const paymentIntents = await this.provider.listPaymentIntents(request);
      // Ensure the response is wrapped in ListResponse format
      const listResponse: ListResponse<PaymentIntent> = Array.isArray(paymentIntents)
        ? { data: paymentIntents, hasMore: false }
        : paymentIntents;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Subscription Operations
  // ========================================================================

  async createSubscription(
    request: CreateSubscriptionRequest
  ): Promise<CarnilResponse<Subscription>> {
    try {
      const subscription = await this.provider.createSubscription(request);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async getSubscription(id: string): Promise<CarnilResponse<Subscription>> {
    try {
      const subscription = await this.provider.getSubscription(id);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async updateSubscription(
    id: string,
    updates: Partial<CreateSubscriptionRequest>
  ): Promise<CarnilResponse<Subscription>> {
    try {
      const subscription = await this.provider.updateSubscription(id, updates);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async cancelSubscription(id: string): Promise<CarnilResponse<Subscription>> {
    try {
      const subscription = await this.provider.cancelSubscription(id);
      return { data: subscription, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async listSubscriptions(
    request?: SubscriptionListRequest
  ): Promise<CarnilResponse<ListResponse<Subscription>>> {
    try {
      const subscriptions = await this.provider.listSubscriptions(request);
      // Ensure the response is wrapped in ListResponse format
      const listResponse: ListResponse<Subscription> = Array.isArray(subscriptions)
        ? { data: subscriptions, hasMore: false }
        : subscriptions;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Invoice Operations
  // ========================================================================

  async createInvoice(request: CreateInvoiceRequest): Promise<CarnilResponse<Invoice>> {
    try {
      const invoice = await this.provider.createInvoice(request);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async getInvoice(id: string): Promise<CarnilResponse<Invoice>> {
    try {
      const invoice = await this.provider.getInvoice(id);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async updateInvoice(
    id: string,
    updates: Partial<CreateInvoiceRequest>
  ): Promise<CarnilResponse<Invoice>> {
    try {
      const invoice = await this.provider.updateInvoice(id, updates);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async finalizeInvoice(id: string): Promise<CarnilResponse<Invoice>> {
    try {
      const invoice = await this.provider.finalizeInvoice(id);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async payInvoice(id: string, paymentMethodId?: string): Promise<CarnilResponse<Invoice>> {
    try {
      const invoice = await this.provider.payInvoice(id, paymentMethodId);
      return { data: invoice, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async listInvoices(request?: InvoiceListRequest): Promise<CarnilResponse<ListResponse<Invoice>>> {
    try {
      const invoices = await this.provider.listInvoices(request);
      // Ensure the response is wrapped in ListResponse format
      const listResponse: ListResponse<Invoice> = Array.isArray(invoices)
        ? { data: invoices, hasMore: false }
        : invoices;
      return { data: listResponse, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Refund Operations
  // ========================================================================

  async createRefund(request: CreateRefundRequest): Promise<CarnilResponse<Refund>> {
    try {
      const refund = await this.provider.createRefund(request);
      return { data: refund, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async getRefund(id: string): Promise<CarnilResponse<Refund>> {
    try {
      const refund = await this.provider.getRefund(id);
      return { data: refund, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: null as any, success: false, error: carnilError.message };
    }
  }

  async listRefunds(paymentId?: string): Promise<CarnilResponse<Refund[]>> {
    try {
      const refunds = await this.provider.listRefunds({ paymentId });
      return { data: refunds, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }

  // ========================================================================
  // Webhook Operations
  // ========================================================================

  async verifyWebhook(payload: string, signature: string, secret: string): Promise<boolean> {
    try {
      return await this.provider.verifyWebhook(payload, signature, secret);
    } catch (error) {
      if (this.config.debug) {
        // Log error (in production, use proper logging)
        if (typeof console !== 'undefined') {
          console.error('Webhook verification failed:', error);
        }
      }
      return false;
    }
  }

  async parseWebhook(payload: string, signature: string, secret: string): Promise<WebhookEvent> {
    try {
      return await this.provider.parseWebhook(payload, signature, secret);
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      throw carnilError;
    }
  }

  // ========================================================================
  // Analytics Operations
  // ========================================================================

  async trackUsage(metrics: UsageMetrics): Promise<CarnilResponse<void>> {
    try {
      await this.provider.trackUsage(metrics);
      return { data: undefined, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: undefined, success: false, error: carnilError.message };
    }
  }

  async trackAIUsage(metrics: AIUsageMetrics): Promise<CarnilResponse<void>> {
    try {
      await this.provider.trackAIUsage(metrics);
      return { data: undefined, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: undefined, success: false, error: carnilError.message };
    }
  }

  async getUsageMetrics(
    customerId: string,
    featureId: string,
    period: string
  ): Promise<CarnilResponse<UsageMetrics[]>> {
    try {
      const metrics = await this.provider.getUsageMetrics(customerId, featureId, period);
      return { data: metrics, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }

  async getAIUsageMetrics(
    customerId: string,
    modelId?: string,
    period?: string
  ): Promise<CarnilResponse<AIUsageMetrics[]>> {
    try {
      const metrics = await this.provider.getAIUsageMetrics(customerId, modelId, period);
      return { data: metrics, success: true };
    } catch (error) {
      const carnilError = handleError(error, this.provider.name);
      return { data: [], success: false, error: carnilError.message };
    }
  }
}
