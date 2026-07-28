import type { Metadata } from 'next';
import { fetchProductsList } from '@/lib/products-data';
import ProductsView from './ProductsView';
import type { Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Products — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const locale = lang as Locale;
  const initialProducts = await fetchProductsList();

  return <ProductsView initialProducts={initialProducts} lang={locale} />;
}
