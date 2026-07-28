import { NextResponse } from 'next/server';
import { fetchOrdersList } from '@/lib/orders-data';

export async function GET(): Promise<NextResponse> {
  const result = await fetchOrdersList();
  return NextResponse.json(result);
}
