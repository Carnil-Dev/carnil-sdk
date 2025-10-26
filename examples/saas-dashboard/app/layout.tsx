import ClientCarnilProvider from './components/client-carnil-provider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientCarnilProvider>{children}</ClientCarnilProvider>
      </body>
    </html>
  );
}
