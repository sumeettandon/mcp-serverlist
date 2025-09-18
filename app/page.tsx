'use client'

import { useState } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { StatsCard } from '@/components/stats-card'
import { TimeScaleTabs } from '@/components/time-scale-tabs'
import { getAllTimeseriesData, getLatestStats } from '@/lib/data-utils'
import { TimeScale } from '@/lib/chart-utils'

// This data is fetched at build time and embedded in the page
const allData = getAllTimeseriesData()
const latestStats = getLatestStats()

export default function Home() {
  const [timeScale, setTimeScale] = useState<TimeScale>('hourly')

  return (
    <main className="container space-y-8 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">MCP Server Analytics</h1>
        <p className="text-muted-foreground">
          Real-time analytics for Model Context Protocol servers. Data is updated hourly.
        </p>
      </div>
      
      <StatsCard data={latestStats} />
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Server Trends</h2>
          <TimeScaleTabs value={timeScale} onValueChange={setTimeScale} />
        </div>
        
        <ChartCard
          title="Server Distribution Over Time"
          data={allData[timeScale]}
          timeScale={timeScale}
        />
      </div>
    </main>
  )
}