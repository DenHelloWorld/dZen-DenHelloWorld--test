import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseProductId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: idParam } = await params;
  const id = parseProductId(idParam);

  if (id === null) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const existing = await prisma.products.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  await prisma.products.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
