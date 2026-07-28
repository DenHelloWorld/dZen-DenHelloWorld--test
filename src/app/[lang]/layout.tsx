import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Providers from '@/store/Providers';

export const metadata: Metadata = {
  title: 'Orders & Products',
  description: 'dZENcode test assignment — Orders & Products inventory SPA',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
