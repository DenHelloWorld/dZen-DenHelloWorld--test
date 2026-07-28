'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WarehouseLocation } from '@/lib/warehouses-data';
import type { Locale } from '@/lib/i18n';

/**
 * react-leaflet's default marker icon points at relative image paths that
 * break once bundled — repointing them at the CDN copies is the standard
 * workaround (see react-leaflet's own troubleshooting docs).
 */
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WarehouseMapProps {
  warehouse: WarehouseLocation;
  lang: Locale;
}

export default function WarehouseMap({ warehouse, lang }: WarehouseMapProps): React.JSX.Element {
  return (
    <MapContainer
      key={warehouse.id}
      center={[warehouse.lat, warehouse.lng]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[warehouse.lat, warehouse.lng]}>
        <Popup>
          {warehouse.name[lang]}
          <br />
          {warehouse.address[lang]}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
