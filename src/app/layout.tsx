import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Providers from '@/store/Providers';

export const metadata: Metadata = {
  title: 'Orders & Products',
  description: 'dZENcode test assignment — Orders & Products inventory SPA',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
