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
          providerName="stripe"
          config={{
            apiKey: process.env.STRIPE_SECRET_KEY!,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
          }}
        >
          {children}
        </CarnilProvider>
      </body>
    </html>
  );
}
