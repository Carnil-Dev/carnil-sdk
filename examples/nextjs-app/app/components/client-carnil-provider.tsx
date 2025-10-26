'use client';

import { CarnilProvider } from '@carnil/react';
import '@carnil/stripe'; // Import to register the provider

export default function ClientCarnilProvider({ children }: { children: React.ReactNode }) {
  return (
    <CarnilProvider
      config={{
        provider: {
          provider: 'stripe', // or 'razorpay'
          apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!,
          webhookSecret: process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!,
        },
        debug: true,
      }}
    >
      {children}
    </CarnilProvider>
  );
}
