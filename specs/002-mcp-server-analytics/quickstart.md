# Quickstart Guide: MCP Server Analytics Dashboard

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (recommended for dependencies)
- Git

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sumeettandon/mcp-serverlist.git
   cd mcp-serverlist
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```

## Development

1. **Generate development data**
   ```bash
   pnpm run generate-mock-data
   ```
   This creates sample time series data for local development.

2. **Start development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Data Collection

### Local Testing

1. **Run data collection script**
   ```bash
   pnpm run collect-data
   ```
   This will fetch current MCP server data and generate CSV files.

2. **Validate data**
   ```bash
   pnpm run validate-data
   ```
   Checks data integrity and structure.

### GitHub Actions

The production data is collected hourly via GitHub Actions. To test the workflow:

1. **Manually trigger workflow**
   ```bash
   gh workflow run aggregate-data.yml
   ```

2. **View results**
   ```bash
   gh run list --workflow=aggregate-data.yml
   ```

## Building

1. **Production build**
   ```bash
   pnpm build
   ```
   This generates static files in the `out` directory.

2. **Preview build**
   ```bash
   pnpm start
   ```
   Serves the built files locally.

## Testing

1. **Run unit tests**
   ```bash
   pnpm test
   ```

2. **Run E2E tests**
   ```bash
   pnpm test:e2e
   ```

3. **Check performance**
   ```bash
   pnpm test:perf
   ```
   Runs Lighthouse CI checks.

## Deployment

The site is automatically deployed via GitHub Actions when pushing to main.

For manual deployment:

1. **Build the site**
   ```bash
   pnpm build
   ```

2. **Deploy to staging**
   ```bash
   pnpm deploy:staging
   ```

3. **Deploy to production**
   ```bash
   pnpm deploy:prod
   ```

## Development Tips

### Working with Data

- Mock data is refreshed on every development server start
- Use `pnpm run update-mock-data` to generate new sample data
- Set `MOCK_DATA_TREND=up|down|stable` to simulate trends

### UI Development

- Components are in `src/components`
- Use ShadcnUI components from `src/components/ui`
- Dark theme styles in `src/styles/themes`

### Performance

- Run `pnpm analyze` to view bundle size analysis
- Keep chart components lazy-loaded
- Use `next/dynamic` for heavy components

### Testing

- Place tests next to components (`*.test.tsx`)
- Use MSW for mocking API responses
- Run `pnpm test:watch` during development

## Common Issues

### Build Errors

1. **Missing data files**
   ```bash
   pnpm run generate-mock-data
   ```

2. **Type errors**
   ```bash
   pnpm run type-check
   ```

### Development Server

1. **Port conflicts**
   - Change port in `next.config.js`
   - Or use `pnpm dev -p 3001`

2. **Stale data**
   ```bash
   pnpm clean
   pnpm dev
   ```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ShadcnUI Components](https://ui.shadcn.com)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [MCP Registry API Docs](https://registry.modelcontextprotocol.io/docs)

## Contributing

1. Create a feature branch
2. Make changes
3. Run all tests
4. Submit PR with:
   - Description of changes
   - Performance impact
   - Screenshots of changes
   - Test results