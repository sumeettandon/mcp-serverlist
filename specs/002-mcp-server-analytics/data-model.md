# Data Model: MCP Server Analytics Dashboard

## Overview
The data model is designed to support static generation of server analytics with efficient client-side filtering and visualization.

## Core Data Structures

### 1. Server Entry
Represents a snapshot of server counts at a specific point in time.

```typescript
interface ServerEntry {
  // ISO 8601 timestamp
  timestamp: string;
  
  // Server counts
  counts: {
    total: number;     // All servers
    local: number;     // Servers with packages or no remotes
    remote: number;    // Servers with remotes
    both: number;      // Servers with both packages and remotes
  };
  
  // Optional metadata
  meta?: {
    dataQuality: 'complete' | 'partial' | 'estimated';
    sourceBatch: string;  // GitHub Action run ID
  };
}
```

### 2. Time Series Collection
Organizes server entries by granularity for efficient access.

```typescript
interface TimeSeriesCollection {
  // Different time granularities
  hourly: ServerEntry[];    // Last 48 hours
  daily: ServerEntry[];     // Last 90 days
  weekly: ServerEntry[];    // Last 52 weeks
  monthly: ServerEntry[];   // Last 24 months
  yearly: ServerEntry[];    // All available years
  
  // Metadata
  meta: {
    lastUpdated: string;    // ISO 8601 timestamp
    dataVersion: string;    // Schema version
    coverage: {            // Data availability
      start: string;
      end: string;
    };
  };
}
```

### 3. Chart Configuration
Defines how time series data should be visualized.

```typescript
interface ChartConfig {
  // View settings
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  serverType: 'all' | 'local' | 'remote' | 'both';
  
  // Display options
  theme: {
    colors: {
      line: string;
      area: string;
      grid: string;
      text: string;
    };
    accessibility: {
      colorBlindSafe: boolean;
      highContrast: boolean;
    };
  };
  
  // Chart behavior
  interaction: {
    tooltipFormat: string;    // date-fns format string
    aggregation: 'sum' | 'avg' | 'max' | 'min';
  };
}
```

## Storage Format

### CSV Structure
Data is stored in separate CSV files by granularity for efficient loading.

```csv
timestamp,total,local,remote,both,quality,batch
2025-09-18T00:00:00Z,1000,600,350,50,complete,action_123
2025-09-18T01:00:00Z,1002,601,351,50,complete,action_124
```

File organization:
```
data/
├── hourly/
│   ├── 2025-09.csv
│   └── 2025-08.csv
├── daily/
│   ├── 2025-Q3.csv
│   └── 2025-Q2.csv
├── weekly/
│   └── 2025.csv
├── monthly/
│   └── all.csv
└── yearly/
    └── all.csv
```

## Data Flow

### 1. Collection (GitHub Actions)
```typescript
interface DataCollector {
  fetchServers(cursor?: string): Promise<ServerResponse>;
  classifyServers(servers: Server[]): ServerCounts;
  appendToTimeSeries(counts: ServerCounts): void;
}
```

### 2. Aggregation (Build Time)
```typescript
interface DataAggregator {
  loadRawData(): Promise<ServerEntry[]>;
  generateGranularities(): TimeSeriesCollection;
  validateData(): ValidationResult;
  exportToStatic(): void;
}
```

### 3. Client Access (Runtime)
```typescript
interface DataAccess {
  loadGranularity(g: string): Promise<ServerEntry[]>;
  filterByType(type: string): ServerEntry[];
  getDateRange(): DateRange;
}
```

## Validation Rules

### 1. Data Integrity
- Timestamps must be valid ISO 8601
- Counts must be non-negative integers
- Total count must equal sum of types
- No gaps in time series larger than:
  - Hourly: 2 hours
  - Daily: 2 days
  - Weekly: 1 week
  - Monthly: 1 month

### 2. Quality Checks
```typescript
interface QualityCheck {
  // Check for unexpected changes
  validateDeltas(entries: ServerEntry[]): boolean;
  
  // Verify data completeness
  checkTimeSeriesContinuity(): boolean;
  
  // Ensure counts make sense
  validateCountRelationships(): boolean;
}
```

## Migration Strategy

### Version 1.0
- Initial implementation with basic counts
- CSV storage format
- Simple aggregation

### Future Considerations
1. Add server categories/tags
2. Include geographic distribution
3. Track version distributions
4. Add custom time ranges

## Security Considerations

1. **Data Validation**
   - Sanitize all inputs
   - Validate CSV format
   - Check numeric bounds

2. **Build Process**
   - Verify GitHub Action integrity
   - Validate data before deployment
   - Monitor for anomalies

3. **Client Side**
   - Prevent XSS in chart tooltips
   - Validate JSON imports
   - Handle missing data gracefully