import type { Metadata } from 'next';
import { fetchOrdersList } from '@/lib/orders-data';
import OrdersView from './OrdersView';

export const metadata: Metadata = {
  title: 'Orders — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage(): Promise<React.JSX.Element> {
  const initialOrders = await fetchOrdersList();

  return <OrdersView initialOrders={initialOrders} />;
}
