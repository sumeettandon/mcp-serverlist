import fs from 'fs';
import path from 'path';
import { TimeseriesDataPoint } from './types';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

function readHourlyData(month: string): TimeseriesDataPoint[] {
  const filepath = path.join(DATA_DIR, 'hourly', `${month}.csv`);
  if (!fs.existsSync(filepath)) {
    return [];
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n').slice(1); // Skip header

  return lines.map(line => {
    const [timestamp, total, local, remote, both] = line.split(',');
    return {
      timestamp,
      total: parseInt(total),
      local: parseInt(local),
      remote: parseInt(remote),
      both: parseInt(both)
    };
  });
}

function groupBy(data: TimeseriesDataPoint[], keyFn: (point: TimeseriesDataPoint) => string): Map<string, TimeseriesDataPoint[]> {
  const map = new Map<string, TimeseriesDataPoint[]>();
  
  for (const point of data) {
    const key = keyFn(point);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(point);
  }
  
  return map;
}

function averagePoints(points: TimeseriesDataPoint[]): TimeseriesDataPoint {
  const len = points.length;
  const sums = points.reduce((acc, point) => ({
    total: acc.total + point.total,
    local: acc.local + point.local,
    remote: acc.remote + point.remote,
    both: acc.both + point.both
  }), { total: 0, local: 0, remote: 0, both: 0 });
  
  return {
    timestamp: points[Math.floor(len / 2)].timestamp, // Use middle timestamp
    total: Math.round(sums.total / len),
    local: Math.round(sums.local / len),
    remote: Math.round(sums.remote / len),
    both: Math.round(sums.both / len)
  };
}

function aggregateDaily(hourlyData: TimeseriesDataPoint[]): TimeseriesDataPoint[] {
  const byDay = groupBy(hourlyData, p => p.timestamp.slice(0, 10));
  return Array.from(byDay.values()).map(averagePoints);
}

function aggregateWeekly(hourlyData: TimeseriesDataPoint[]): TimeseriesDataPoint[] {
  const byWeek = groupBy(hourlyData, p => {
    const date = new Date(p.timestamp);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().slice(0, 10);
  });
  return Array.from(byWeek.values()).map(averagePoints);
}

function aggregateMonthly(hourlyData: TimeseriesDataPoint[]): TimeseriesDataPoint[] {
  const byMonth = groupBy(hourlyData, p => p.timestamp.slice(0, 7));
  return Array.from(byMonth.values()).map(averagePoints);
}

function writeData(data: TimeseriesDataPoint[], period: string, filename: string) {
  const dir = path.join(DATA_DIR, period);
  fs.mkdirSync(dir, { recursive: true });
  
  const content = 'timestamp,total,local,remote,both\n' + 
    data.map(p => `${p.timestamp},${p.total},${p.local},${p.remote},${p.both}`).join('\n');
  
  fs.writeFileSync(path.join(dir, filename), content);
}

async function aggregateData() {
  // Get list of hourly data files
  const hourlyDir = path.join(DATA_DIR, 'hourly');
  if (!fs.existsSync(hourlyDir)) {
    console.log('No hourly data to aggregate');
    return;
  }

  const files = fs.readdirSync(hourlyDir).filter(f => f.endsWith('.csv'));

  // Process each month's data
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const month = file.replace('.csv', '');
    const hourlyData = readHourlyData(month);

    // Generate aggregations
    const dailyData = aggregateDaily(hourlyData);
    const weeklyData = aggregateWeekly(hourlyData);
    const monthlyData = aggregateMonthly(hourlyData);

    // Write aggregated data
    writeData(dailyData, 'daily', file);
    writeData(weeklyData, 'weekly', file);
    writeData(monthlyData, 'monthly', file);
  }
}

// Run aggregation
aggregateData().catch(error => {
  console.error('Error aggregating data:', error);
  process.exit(1);
});