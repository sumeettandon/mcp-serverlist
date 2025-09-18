import { TimeseriesDataPoint, AggregatedData } from '@/lib/types'
import { TimeScale } from '@/lib/chart-utils'
import staticData from '@/lib/data/static-data.json'

export function readTimeseriesData(scale: TimeScale): TimeseriesDataPoint[] {
  return staticData[scale] || []
}

export function getLatestStats(): TimeseriesDataPoint {
  const hourlyData = readTimeseriesData('hourly')
  return hourlyData[hourlyData.length - 1] || {
    timestamp: new Date().toISOString(),
    total: 0,
    local: 0,
    remote: 0,
    both: 0
  }
}

export function getAllTimeseriesData(): AggregatedData {
  return {
    hourly: readTimeseriesData('hourly'),
    daily: readTimeseriesData('daily'),
    weekly: readTimeseriesData('weekly'),
    monthly: readTimeseriesData('monthly')
  }
}