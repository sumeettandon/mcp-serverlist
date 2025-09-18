# Research: MCP Server Analytics Dashboard

## Build-time Data Aggregation

### GitHub Actions Design
- **Decision**: Use GitHub Actions for hourly data collection with CSV output
- **Rationale**: 
  - Keeps with static-first approach
  - CSV is efficient for time-series data
  - Easy to version control and validate
- **Implementation Details**:
  ```yaml
  name: Aggregate MCP Server Data
  on:
    schedule:
      - cron: '0 * * * *'  # Hourly
  ```

### Data Collection Strategy
- **Pagination Handling**:
  ```typescript
  async function fetchAllServers() {
    let cursor = null;
    const allServers = [];
    
    do {
      const url = cursor 
        ? `https://registry.modelcontextprotocol.io/v0/servers?cursor=${cursor}`
        : 'https://registry.modelcontextprotocol.io/v0/servers';
      
      const response = await fetch(url);
      const data = await response.json();
      
      allServers.push(...data.servers);
      cursor = data.metadata.next_cursor;
    } while (cursor);
    
    return allServers;
  }
  ```

### Server Classification
- **Logic**:
  ```typescript
  function classifyServer(server) {
    const hasRemotes = !!server.remotes?.length;
    const hasPackages = !!server.packages?.length;
    
    return {
      isLocal: !hasRemotes || hasPackages,
      isRemote: hasRemotes,
      isBoth: hasRemotes && hasPackages
    };
  }
  ```

## Static Chart Generation

### Chart Library Selection
- **Decision**: Use Recharts
- **Rationale**:
  - Tree-shakeable (reduces bundle size)
  - Built on D3 (reliable)
  - Strong TypeScript support
  - Good accessibility

### Performance Optimization
1. **Data Structure**:
   ```typescript
   interface TimeSeriesPoint {
     timestamp: string;
     counts: {
       total: number;
       local: number;
       remote: number;
       both: number;
     };
   }
   ```

2. **Granularity Processing**:
   ```typescript
   interface GranularityConfig {
     format: string;  // date-fns format
     aggregation: 'hour' | 'day' | 'week' | 'month' | 'year';
   }
   ```

3. **Bundle Optimization**:
   - Import only needed Recharts components
   - Defer loading of inactive granularity data
   - Use dynamic imports for chart components

## Development Tooling

### Local Development
1. **Mock Data Generation**:
   ```typescript
   interface MockDataConfig {
     startDate: Date;
     endDate: Date;
     granularity: string;
     trend: 'up' | 'down' | 'stable';
   }
   ```

2. **Build Validation**:
   - CSV schema validation
   - Data completeness checks
   - Chart component snapshot tests

### Performance Monitoring
1. **Metrics**:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Cumulative Layout Shift (CLS)

2. **Tools**:
   - Lighthouse CI
   - Next.js Analytics
   - Web Vitals tracking

## Decision Log

1. **CSV vs JSON Storage**
   - **Choice**: CSV
   - **Reason**: Better compression, easier to process line-by-line, simpler to validate

2. **Chart Granularity Implementation**
   - **Choice**: Pre-aggregate at build time
   - **Reason**: Reduces client-side computation, ensures consistent performance

3. **Development Data**
   - **Choice**: Synthetic data generator
   - **Reason**: Enables offline development, consistent test data

## Next Steps

1. Implementation priorities:
   - Set up GitHub Actions workflow first
   - Create data aggregation script
   - Implement chart components with mock data
   - Add filters and granularity controls
   - Optimize build and deploy pipeline

2. Risk mitigation:
   - Monitor bundle size during development
   - Set up automated performance testing
   - Implement fallbacks for missing data
   - Add error boundaries for chart components

## Technical Specifications

### Data Collection Script
```typescript
interface ServerStats {
  timestamp: string;
  counts: {
    total: number;
    local: number;
    remote: number;
    both: number;
  };
}

interface AggregationConfig {
  outputPath: string;
  historyDays: number;
  granularities: string[];
}
```

### Chart Component API
```typescript
interface ChartProps {
  data: TimeSeriesPoint[];
  granularity: string;
  filter: string;
  theme: 'dark' | 'light';
  accessibility: {
    ariaLabel: string;
    role: string;
  };
}
```

This research provides the foundation for implementing the MCP Server Analytics Dashboard while adhering to the static-first constitution and performance requirements.