import fs from 'fs';
import path from 'path';
import { TimeseriesDataPoint } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

function generateTimestamps(count: number, interval: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now);
    date.setHours(date.getHours() - (count - i - 1) * interval);
    return date.toISOString();
  });
}

function generateMockData(count: number, interval: number): TimeseriesDataPoint[] {
  const timestamps = generateTimestamps(count, interval);
  let total = Math.floor(Math.random() * 20) + 80; // 80-100 range
  let local = Math.floor(Math.random() * 30) + 30; // 30-60 range
  let remote = Math.floor(Math.random() * 20) + 20; // 20-40 range
  let both = Math.floor(Math.random() * 10) + 10; // 10-20 range

  return timestamps.map(timestamp => {
    // Add small random variations
    total += Math.floor(Math.random() * 5) - 2; // -2 to +2
    local += Math.floor(Math.random() * 3) - 1; // -1 to +1
    remote += Math.floor(Math.random() * 3) - 1; // -1 to +1
    both += Math.floor(Math.random() * 3) - 1; // -1 to +1

    return {
      timestamp,
      total: Math.max(total, Math.max(local + remote - both, 0)),
      local: Math.max(local, 0),
      remote: Math.max(remote, 0),
      both: Math.max(both, 0)
    };
  });
}

async function generateMockDatasets() {
  // Ensure data directory exists
  fs.mkdirSync(path.join(DATA_DIR, 'hourly'), { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, 'daily'), { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, 'weekly'), { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, 'monthly'), { recursive: true });

  // Generate hourly data for the last 24 hours
  const hourlyData = generateMockData(24, 1);
  const hourlyFile = path.join(DATA_DIR, 'hourly', '2025-09.csv');
  
  // Generate daily data for the last 30 days
  const dailyData = generateMockData(30, 24);
  const dailyFile = path.join(DATA_DIR, 'daily', '2025-09.csv');
  
  // Generate weekly data for the last 12 weeks
  const weeklyData = generateMockData(12, 24 * 7);
  const weeklyFile = path.join(DATA_DIR, 'weekly', '2025-09.csv');
  
  // Generate monthly data for the last 12 months
  const monthlyData = generateMockData(12, 24 * 30);
  const monthlyFile = path.join(DATA_DIR, 'monthly', '2025-09.csv');

  // Write the data
  const header = 'timestamp,total,local,remote,both\n';
  const writeData = (data: TimeseriesDataPoint[]) => 
    data.map(p => `${p.timestamp},${p.total},${p.local},${p.remote},${p.both}`).join('\n');

  fs.writeFileSync(hourlyFile, header + writeData(hourlyData));
  fs.writeFileSync(dailyFile, header + writeData(dailyData));
  fs.writeFileSync(weeklyFile, header + writeData(weeklyData));
  fs.writeFileSync(monthlyFile, header + writeData(monthlyData));

  console.log('Mock data generated successfully!');
}

generateMockDatasets().catch(console.error);