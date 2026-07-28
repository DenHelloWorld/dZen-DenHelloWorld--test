import { prisma } from '@/lib/prisma';
import type { Locale } from '@/lib/i18n';

export interface WarehouseLocation {
  id: number;
  name: Record<Locale, string>;
  address: Record<Locale, string>;
  lat: number;
  lng: number;
}

export async function fetchWarehousesList(): Promise<WarehouseLocation[]> {
  const warehouses = await prisma.warehouses.findMany({ orderBy: { id: 'asc' } });

  return warehouses.map((warehouse) => ({
    id: warehouse.id,
    name: { ru: warehouse.name_ru, en: warehouse.name_en },
    address: { ru: warehouse.address_ru, en: warehouse.address_en },
    lat: warehouse.lat,
    lng: warehouse.lng,
  }));
}
