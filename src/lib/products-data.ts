import { prisma } from '@/lib/prisma';
import type { ProductListItem } from '@/store/api';

export async function fetchProductsList(type?: string): Promise<ProductListItem[]> {
  const products = await prisma.products.findMany({
    where: type ? { type } : undefined,
    orderBy: { created_at: 'desc' },
    include: { prices: true, orders: { select: { title: true } } },
  });

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    type: product.type,
    serialNumber: product.serial_number,
    isNew: product.is_new,
    photo: product.photo,
    specification: product.specification,
    guaranteeStart: product.guarantee_start?.toISOString() ?? null,
    guaranteeEnd: product.guarantee_end?.toISOString() ?? null,
    orderTitle: product.orders.title,
    prices: product.prices.map((price) => ({
      symbol: price.symbol,
      value: price.value.toNumber(),
      isDefault: price.is_default,
    })),
  }));
}
