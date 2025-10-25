import {
  Customer, CreateCustomerParams, UpdateCustomerParams, RetrieveCustomerParams, ListCustomersParams,
  PaymentMethod, CreatePaymentMethodParams, UpdatePaymentMethodParams, RetrievePaymentMethodParams, ListPaymentMethodsParams,
  Product, CreateProductParams, UpdateProductParams, RetrieveProductParams, ListProductsParams,
  Price, CreatePriceParams, UpdatePriceParams, RetrievePriceParams, ListPricesParams,
  Subscription, CreateSubscriptionParams, UpdateSubscriptionParams, RetrieveSubscriptionParams, ListSubscriptionsParams,
  Invoice, RetrieveInvoiceParams, ListInvoicesParams,
  Refund, CreateRefundParams, RetrieveRefundParams, ListRefundsParams,
  Dispute, RetrieveDisputeParams, ListDisputesParams,
  PaymentIntent, CreatePaymentIntentParams, UpdatePaymentIntentParams, RetrievePaymentIntentParams, ListPaymentIntentsParams,
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
// Complete Provider Interface
// ============================================================================

export interface CarnilProvider extends 
  BaseProvider,
  CustomerProvider,
  PaymentMethodProvider,
  ProductProvider,
  PriceProvider,
  SubscriptionProvider,
  InvoiceProvider,
  RefundProvider,
  DisputeProvider,
  PaymentIntentProvider {
  // All methods are inherited from the individual provider interfaces
}