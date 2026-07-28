'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { t, type Locale } from '@/lib/i18n';
import type { ProductTypeStat } from './chart-data';
import styles from './Products.module.scss';

const BAR_COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

interface ProductsChartProps {
  data: ProductTypeStat[];
  metric: 'count' | 'price';
  lang: Locale;
}

export default function ProductsChart({
  data,
  metric,
  lang,
}: ProductsChartProps): React.JSX.Element {
  const dataKey = metric === 'count' ? 'count' : 'avgPriceUsd';
  const valueLabel = t(
    metric === 'count' ? 'products.chart.metric_count' : 'products.chart.metric_price',
    lang,
  );

  return (
    <div className={styles['products__chart-container']}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="type" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => (metric === 'price' ? `$${value}` : `${value}`)}
          />
          <Tooltip
            formatter={(value) => [
              metric === 'price' ? `$${Number(value).toFixed(2)}` : value,
              valueLabel,
            ]}
          />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.type} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
