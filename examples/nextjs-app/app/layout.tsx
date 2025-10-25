import { CarnilProvider } from '@carnil/react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CarnilProvider
          config={{
            provider: {
              provider: 'stripe', // or 'razorpay'
              apiKey: process.env.STRIPE_SECRET_KEY!,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            },
            debug: true,
          }}
        >
          {children}
        </CarnilProvider>
      </body>
    </html>
  );
}
