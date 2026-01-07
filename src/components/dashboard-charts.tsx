'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface DashboardChartsProps {
  data: {
    date: string
    views: number
  }[]
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <Card className="col-span-4 bg-muted/10">
      <CardHeader>
        <CardTitle>最近 30 天访问趋势</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-xl">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-foreground">{label}</span>
                            <span className="text-sm text-blue-500 font-bold">
                              访问量: {payload[0].value}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              暂无访问数据
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
