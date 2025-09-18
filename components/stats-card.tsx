import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeseriesDataPoint } from '@/lib/types'

interface StatsCardProps {
  data: TimeseriesDataPoint
}

export function StatsCard({ data }: StatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Local Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.local}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remote Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.remote}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hybrid Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.both}</div>
        </CardContent>
      </Card>
    </div>
  )
}