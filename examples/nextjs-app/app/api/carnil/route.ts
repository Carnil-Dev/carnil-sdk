import { createCarnilHandler } from '@carnil/sdk/next';

const handler = createCarnilHandler({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  identify: async req => {
    // In a real app, you'd extract the user ID from your auth system
    // For this example, we'll use a mock user ID
    const userId = req.headers.get('x-user-id') || 'demo-user-123';
    return {
      customerId: userId,
      customerData: {
        name: 'Demo User',
        email: 'demo@example.com',
      },
    };
  },
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
  },
});

export { handler as POST };
