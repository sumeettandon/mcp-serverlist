import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TimeseriesDataPoint } from '@/lib/types';
import { TimeScale, formatDate, CHART_FILTERS, FilterState } from '@/lib/chart-utils';

interface TimeSeriesChartProps {
  data: TimeseriesDataPoint[];
  height?: number;
  filters: FilterState;
  timeScale: TimeScale;
}

export function TimeSeriesChart({
  data,
  height = 400,
  filters,
  timeScale
}: TimeSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => formatDate(value, timeScale)}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)'
          }}
          labelFormatter={(value) => formatDate(value as string, timeScale)}
        />
        <Legend />
        {CHART_FILTERS.map(({ id, label, color }) => 
          filters[id] && (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={`${label} Servers`}
            />
          )
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}