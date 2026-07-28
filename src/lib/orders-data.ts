import { prisma } from '@/lib/prisma';
import { sumTotalsByCurrency } from '@/lib/order-currency';
import type { OrderListItem } from '@/store/api';

export async function fetchOrdersList(): Promise<OrderListItem[]> {
  const orders = await prisma.orders.findMany({
    orderBy: { created_at: 'desc' },
    include: { products: { include: { prices: true } } },
  });

  return orders.map((order) => ({
    id: order.id,
    title: order.title,
    productsCount: order.products.length,
    createdAt: order.created_at.toISOString(),
    totals: sumTotalsByCurrency(order.products),
  }));
}
