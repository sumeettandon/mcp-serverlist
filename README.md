# MCP Server Analytics

A real-time analytics dashboard for Model Context Protocol (MCP) servers. This application provides visualization and insights into the distribution and trends of MCP servers across the network.

## Features

- 📊 Real-time server statistics and trends
- 📈 Interactive time series charts with Recharts
- 🌓 Dark mode support with next-themes
- ⚡️ Built with Next.js 14 for optimal performance
- 🎨 Modern UI components with shadcn/ui
- 📱 Responsive design for all devices
- ♿️ WCAG 2.1 AA compliant accessibility
- 🔄 Hourly data updates via GitHub Actions

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Data Collection**: TypeScript, Node.js
- **CI/CD**: GitHub Actions
- **Performance Monitoring**: Lighthouse CI
- **Accessibility Testing**: axe-core

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sumeettandon/mcp-serverlist.git
   cd mcp-serverlist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate mock data (for development):
   ```bash
   npm run generate-mock-data
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## Available Scripts

- \`npm run dev\`: Start the development server
- \`npm run build\`: Build the application for production
- \`npm start\`: Start the production server
- \`npm run lint\`: Run ESLint
- \`npm run collect\`: Collect server data
- \`npm run aggregate\`: Aggregate collected data
- \`npm test\`: Run all tests (Lighthouse CI and axe)
- \`npm run test:lighthouse\`: Run Lighthouse CI tests
- \`npm run test:axe\`: Run accessibility tests

## Data Collection

The application collects server data hourly using GitHub Actions. The data is stored in CSV format with the following structure:

- \`lib/data/hourly/\`: Hourly server statistics
- \`lib/data/daily/\`: Daily aggregated statistics
- \`lib/data/weekly/\`: Weekly aggregated statistics
- \`lib/data/monthly/\`: Monthly aggregated statistics

### Data Format

Each CSV file contains the following columns:
- \`timestamp\`: ISO 8601 timestamp
- \`total\`: Total number of servers
- \`local\`: Number of local servers
- \`remote\`: Number of remote servers
- \`both\`: Number of hybrid servers (both local and remote)

## Testing

The project includes automated testing for performance and accessibility:

### Performance Testing
- Uses Lighthouse CI to measure Web Vitals
- Enforces minimum scores for performance, accessibility, best practices, and SEO
- Runs on every pull request and push to main

### Accessibility Testing
- Uses axe-core to check WCAG 2.1 AA compliance
- Tests run automatically in CI/CD pipeline
- Local testing available via \`npm run test:axe\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) for the server registry API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library