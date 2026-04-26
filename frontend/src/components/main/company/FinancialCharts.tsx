'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyFinancials } from '@/types'

function fmt(n: number) {
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(1)}兆`
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}千億`
  return `${n.toFixed(0)}億`
}

interface SparklineCardProps {
  title: string
  latestLabel: string
  data: { year: number; value: number }[]
  color: string
}

function SparklineCard({ title, latestLabel, data, color }: SparklineCardProps) {
  return (
    <Card
      className="border"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-medium" style={{ color: 'var(--vsc-text-muted)' }}>
          {title}
        </CardTitle>
        <p className="text-lg font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
          {latestLabel}
        </p>
      </CardHeader>
      <CardContent className="px-1 pb-3">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={data} margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fill: '#858585', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #3e3e42',
                borderRadius: 4,
                fontSize: 11,
                color: '#d4d4d4',
              }}
              formatter={(v) => [typeof v === 'number' ? fmt(v) : '—', '']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${color.replace('#', '')})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface FinancialChartsProps {
  financials: CompanyFinancials
  companyColor: string
}

export function FinancialCharts({ financials, companyColor }: FinancialChartsProps) {
  const revenueData = financials.years
    .filter((y) => y.revenue !== null)
    .map((y) => ({ year: y.year, value: y.revenue as number }))
  const profitData = financials.years
    .filter((y) => y.net_profit !== null)
    .map((y) => ({ year: y.year, value: y.net_profit as number }))
  const latest = financials.years[financials.years.length - 1]

  return (
    <div className="grid grid-cols-2 gap-3">
      {revenueData.length > 0 && (
        <SparklineCard
          title="売上高推移"
          latestLabel={`${latest.year}年: ${latest.revenue !== null ? fmt(latest.revenue) + '円' : '—'}`}
          data={revenueData}
          color={companyColor}
        />
      )}
      {profitData.length > 0 && (
        <SparklineCard
          title="純利益推移"
          latestLabel={`${latest.year}年: ${latest.net_profit !== null ? fmt(latest.net_profit) + '円' : '—'}`}
          data={profitData}
          color="#0078d4"
        />
      )}
    </div>
  )
}
