'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  BarChart3,
  Shield,
  Globe,
  Zap
} from 'lucide-react';
import { useCustomer, usePayment, useSubscription } from '@carnil/react';
import { CustomerDashboard, AIUsageDashboard } from '@carnil/analytics';
import { ComplianceDashboard } from '@carnil/compliance';
import { PricingEditor } from '@carnil/pricing-editor';
import { useAnalytics } from '@carnil/analytics';

export default function SaaSDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { customer, createCustomer, updateCustomer } = useCustomer();
  const { createPaymentIntent, confirmPayment } = usePayment();
  const { createSubscription, cancelSubscription } = useSubscription();
  const { analytics, loading: analyticsLoading } = useAnalytics(customer?.id || '');

  const handlePayment = async (amount: number) => {
    if (!customer) {
      await createCustomer({
        email: 'demo@example.com',
        name: 'Demo User',
      });
    }

    const payment = await createPaymentIntent({
      amount,
      currency: 'usd',
      customer: customer?.id,
    });

    const confirmed = await confirmPayment(payment.id);
    console.log('Payment confirmed:', confirmed);
  };

  const handleSubscription = async () => {
    if (!customer) return;

    const subscription = await createSubscription({
      customer: customer.id,
      priceId: 'price_monthly_10',
      paymentMethod: 'pm_card_visa',
    });

    console.log('Subscription created:', subscription);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'webhooks', label: 'Webhooks', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Carnil SaaS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {customer ? `Welcome, ${customer.name}` : 'Not logged in'}
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">$12,345</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                    <p className="text-2xl font-semibold text-gray-900">456</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Growth Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">+12.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handlePayment(2000)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Test Payment</p>
                  <p className="text-xs text-gray-500">$20.00</p>
                </button>

                <button
                  onClick={handleSubscription}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Create Subscription</p>
                  <p className="text-xs text-gray-500">Monthly plan</p>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">View Analytics</p>
                  <p className="text-xs text-gray-500">Usage metrics</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Visa ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading analytics...</div>
              </div>
            ) : (
              <>
                <CustomerDashboard
                  customerId={customer?.id || 'demo-customer'}
                  data={analytics}
                />
                <AIUsageDashboard
                  customerId={customer?.id || 'demo-customer'}
                  data={analytics?.aiUsage}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <PricingEditor
              initialPlan={{
                id: 'demo-plan',
                name: 'Demo Pricing Plan',
                description: 'A sample pricing plan',
                tiers: [
                  {
                    id: 'basic',
                    name: 'Basic',
                    price: 10,
                    currency: 'USD',
                    interval: 'month',
                    features: ['10 API calls', 'Basic support'],
                    isActive: true,
                    sortOrder: 0,
                  },
                  {
                    id: 'pro',
                    name: 'Pro',
                    price: 29,
                    currency: 'USD',
                    interval: 'month',
                    features: ['100 API calls', 'Priority support', 'Analytics'],
                    isActive: true,
                    sortOrder: 1,
                  },
                ],
                currency: 'USD',
                isActive: true,
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onPlanChange={(plan) => console.log('Plan changed:', plan)}
              onSave={async (plan) => console.log('Saving plan:', plan)}
              onPublish={async (plan) => console.log('Publishing plan:', plan)}
              currency="USD"
              supportedCurrencies={['USD', 'EUR', 'GBP']}
              features={['API Calls', 'Storage', 'Support', 'Analytics']}
            />
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <ComplianceDashboard />
          </div>
        )}

        {activeTab === 'global' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">Supported Currencies</h3>
                  <div className="space-y-2">
                    {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map(currency => (
                      <div key={currency} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">{currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">Tax Jurisdictions</h3>
                  <div className="space-y-2">
                    {['US', 'EU', 'UK', 'IN', 'CA', 'AU'].map(country => (
                      <div key={country} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Subscriptions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Payment Events</p>
                    <p className="text-sm text-gray-500">https://your-app.com/webhooks/payments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
