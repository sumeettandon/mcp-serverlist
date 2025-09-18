import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesChart } from './TimeSeriesChart';
import { TimeseriesDataPoint } from '@/lib/types';
import { TimeScale, CHART_FILTERS, FilterState } from '@/lib/chart-utils';

interface ChartCardProps {
  title: string;
  data: TimeseriesDataPoint[];
  timeScale: TimeScale;
}

export function ChartCard({
  title,
  data,
  timeScale
}: ChartCardProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    total: true,
    local: true,
    remote: true,
    both: true
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-4">
            {CHART_FILTERS.map(({ id, label, color }) => (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters[id]}
                  onChange={(e) => setFilters({ ...filters, [id]: e.target.checked })}
                  className="accent-primary"
                  style={{ accentColor: color }}
                />
                {label}
              </label>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimeSeriesChart
          data={data}
          filters={filters}
          timeScale={timeScale}
        />
      </CardContent>
    </Card>
  );
}