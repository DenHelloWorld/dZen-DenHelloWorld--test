import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const products = await prisma.products.findMany({
    where: type ? { type } : undefined,
    orderBy: { created_at: 'desc' },
    include: { prices: true, orders: { select: { title: true } } },
  });

  const result = products.map((product) => ({
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

  return NextResponse.json(result);
}
