import { NextResponse } from 'next/server';
import { fetchProductsList } from '@/lib/products-data';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? undefined;

  const result = await fetchProductsList(type);

  return NextResponse.json(result);
}
