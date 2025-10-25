'use client';

import { useCustomer } from '@carnil/react';
import { useState } from 'react';

export default function Home() {
  const { customer, createCustomer, updateCustomer, isLoading, error } = useCustomer();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleCreateCustomer = async () => {
    if (!email || !name) return;
    
    await createCustomer({
      email,
      name,
    });
  };

  const handleUpdateCustomer = async () => {
    if (!customer?.id) return;
    
    await updateCustomer(customer.id, {
      name: name || customer.name,
      email: email || customer.email,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carnil Payments SDK Example</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
          
          {customer ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Current Customer:</h3>
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
                <p>ID: {customer.id}</p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="New name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="New email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleUpdateCustomer}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Update Customer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Customer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Customer email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleCreateCustomer}
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Create Customer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Intent Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payment Intent Demo</h2>
          <p className="text-gray-600 mb-4">
            This would demonstrate creating payment intents, but requires a customer first.
          </p>
          {customer && (
            <div className="space-y-2">
              <button className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
                Create Payment Intent ($20.00)
              </button>
              <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600">
                Create Subscription ($10/month)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Provider Info */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Provider Information</h2>
        <p className="text-gray-600">
          This example is configured to use Stripe. You can switch to Razorpay by changing the provider in the layout.tsx file.
        </p>
        <div className="mt-4">
          <code className="bg-gray-200 p-2 rounded text-sm">
            Provider: Stripe (Test Mode)
          </code>
        </div>
      </div>
    </div>
  );
}
