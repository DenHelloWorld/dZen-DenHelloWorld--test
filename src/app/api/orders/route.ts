import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sumTotalsByCurrency } from '@/lib/order-currency';

export async function GET(): Promise<NextResponse> {
  const orders = await prisma.orders.findMany({
    orderBy: { created_at: 'desc' },
    include: { products: { include: { prices: true } } },
  });

  const result = orders.map((order) => ({
    id: order.id,
    title: order.title,
    productsCount: order.products.length,
    createdAt: order.created_at.toISOString(),
    totals: sumTotalsByCurrency(order.products),
  }));

  return NextResponse.json(result);
}
