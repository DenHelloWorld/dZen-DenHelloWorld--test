import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sumTotalsByCurrency } from '@/lib/order-currency';
import { Prisma } from '@/generated/prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseOrderId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: idParam } = await params;
  const id = parseOrderId(idParam);

  if (id === null) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  const order = await prisma.orders.findUnique({
    where: { id },
    include: { products: { include: { prices: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    title: order.title,
    description: order.description,
    createdAt: order.created_at.toISOString(),
    totals: sumTotalsByCurrency(order.products),
    products: order.products.map((product) => ({
      id: product.id,
      title: product.title,
      type: product.type,
      serialNumber: product.serial_number,
      isNew: product.is_new,
      photo: product.photo,
      specification: product.specification,
      guaranteeStart: product.guarantee_start?.toISOString() ?? null,
      guaranteeEnd: product.guarantee_end?.toISOString() ?? null,
      prices: product.prices.map((price) => ({
        symbol: price.symbol,
        value: price.value.toNumber(),
        isDefault: price.is_default,
      })),
    })),
  });
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: idParam } = await params;
  const id = parseOrderId(idParam);

  if (id === null) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    await prisma.orders.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    throw error;
  }

  return NextResponse.json({ success: true });
}
