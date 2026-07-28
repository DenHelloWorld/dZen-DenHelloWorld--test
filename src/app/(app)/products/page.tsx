import type { Metadata } from 'next';
import { fetchProductsList } from '@/lib/products-data';
import ProductsView from './ProductsView';

export const metadata: Metadata = {
  title: 'Products — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage(): Promise<React.JSX.Element> {
  const initialProducts = await fetchProductsList();

  return <ProductsView initialProducts={initialProducts} />;
}
