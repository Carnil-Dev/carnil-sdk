import { createCarnilWebhookHandler } from '@carnil/next';
import '@carnil/stripe'; // Import to register the provider

const webhookHandler = createCarnilWebhookHandler({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  identify: async req => {
    // Extract customer ID from headers or body
    const customerId = req.headers.get('x-customer-id') || 'demo-customer';
    return { customerId };
  },
});

export { webhookHandler as POST };
