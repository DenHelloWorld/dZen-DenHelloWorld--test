import type { Metadata } from 'next';
import { fetchWarehousesList } from '@/lib/warehouses-data';
import WarehousesView from './WarehousesView';
import type { Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Warehouses — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function WarehousesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const warehouses = await fetchWarehousesList();

  return <WarehousesView warehouses={warehouses} lang={lang as Locale} />;
}
