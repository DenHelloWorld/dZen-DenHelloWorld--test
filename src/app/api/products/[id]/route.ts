import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

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

  try {
    await prisma.products.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    throw error;
  }

  return NextResponse.json({ success: true });
}
