import { createCarnilWebhookHandler } from '@carnil/next';

const webhookHandler = createCarnilWebhookHandler({
  provider: {
    provider: 'stripe',
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
});

export { webhookHandler as POST };
