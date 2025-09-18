import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeScale, formatTimeScale } from "@/lib/chart-utils"

interface TimeScaleTabsProps {
  value: TimeScale
  onValueChange: (value: TimeScale) => void
}

export function TimeScaleTabs({ value, onValueChange }: TimeScaleTabsProps) {
  const scales: TimeScale[] = ['hourly', 'daily', 'weekly', 'monthly']

  return (
    <div className="flex items-center space-x-4">
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList>
          {scales.map((scale) => (
            <TabsTrigger key={scale} value={scale}>
              {formatTimeScale(scale)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}