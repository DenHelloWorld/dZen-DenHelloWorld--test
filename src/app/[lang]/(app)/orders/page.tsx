import type { Metadata } from 'next';
import { fetchOrdersList } from '@/lib/orders-data';
import OrdersView from './OrdersView';
import type { Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Orders — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const locale = lang as Locale;
  const initialOrders = await fetchOrdersList();

  return <OrdersView initialOrders={initialOrders} lang={locale} />;
}
