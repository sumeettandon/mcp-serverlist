export interface ServerEntry {
  id: string;
  name: string;
  description?: string;
  packages?: Array<{
    name: string;
    version: string;
  }>;
  remotes?: Array<{
    name: string;
    uri: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ServerResponse {
  servers: ServerEntry[];
  metadata: {
    next_cursor?: string;
  };
}

export interface TimeseriesDataPoint {
  timestamp: string;
  total: number;
  local: number;
  remote: number;
  both: number;
}

export interface AggregatedData {
  hourly: TimeseriesDataPoint[];
  daily: TimeseriesDataPoint[];
  weekly: TimeseriesDataPoint[];
  monthly: TimeseriesDataPoint[];
}