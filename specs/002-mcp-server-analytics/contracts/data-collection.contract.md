# Data Collection Script Contract

## Environment Variables
```typescript
interface Env {
  NODE_ENV: 'development' | 'production';
  MOCK_DATA_TREND?: 'up' | 'down' | 'stable';
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
}
```

## Input
- Registry API endpoint: `https://registry.modelcontextprotocol.io/v0/servers`
- Pagination via `cursor` query parameter
- Response format:
  ```typescript
  interface ApiResponse {
    servers: Server[];
    metadata: {
      next_cursor: string | null;
      count: number;
    };
  }
  ```

## Output
- CSV files in `src/lib/data/{granularity}/*.csv`
- Format: `timestamp,total,local,remote,both,quality,batch`
- One file per time period (month for hourly, quarter for daily, etc.)

## Processing
1. Fetch all pages from API
2. Classify servers (local/remote/both)
3. Generate time series data
4. Validate data integrity
5. Write to appropriate CSV files

## Error Handling
1. Network errors: retry with exponential backoff
2. Malformed data: log error, skip record
3. File system errors: fail workflow
4. Validation failures: fail workflow

## Rate Limiting
- Respect API rate limits
- Use exponential backoff for retries
- Maximum 3 retries per request

## Validation Rules
1. Data completeness
   - No missing required fields
   - Valid timestamps
   - Non-negative counts
2. Data consistency
   - Total = Local + Remote - Both
   - No duplicate timestamps
   - No future timestamps
3. File structure
   - Valid CSV format
   - Required columns present
   - UTF-8 encoding