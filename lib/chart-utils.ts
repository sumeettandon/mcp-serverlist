export type TimeScale = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface ChartFilter {
  id: keyof FilterState;
  label: string;
  color: string;
}

export interface FilterState {
  total: boolean;
  local: boolean;
  remote: boolean;
  both: boolean;
}

export const CHART_FILTERS: ChartFilter[] = [
  { id: 'total', label: 'Total', color: 'hsl(var(--primary))' },
  { id: 'local', label: 'Local', color: 'hsl(var(--success))' },
  { id: 'remote', label: 'Remote', color: 'hsl(var(--warning))' },
  { id: 'both', label: 'Hybrid', color: 'hsl(var(--info))' }
];

export function formatTimeScale(scale: TimeScale): string {
  switch (scale) {
    case 'hourly':
      return 'Last 24 Hours';
    case 'daily':
      return 'Last 30 Days';
    case 'weekly':
      return 'Last 12 Weeks';
    case 'monthly':
      return 'Last 12 Months';
  }
}

export function formatDate(timestamp: string, scale: TimeScale): string {
  const date = new Date(timestamp);
  
  switch (scale) {
    case 'monthly':
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    case 'weekly':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    case 'daily':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    default:
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
}