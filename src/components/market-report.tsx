import React, { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Award,
  Calendar,
  DollarSign,
  Hammer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

// Shadcn UI Components

const TractorPerformanceReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  // Mock data for different time periods
  const performanceData = {
    '30': {
      totalAuctions: 12,
      sold: 10,
      avgPrice: 18750,
      highestPrice: 24500,
      lowestPrice: 14200,
      avgBids: 8.5,
      sellThroughRate: 83.3,
      priceChange: 5.2,
      trendData: [
        { date: 'Week 1', avgPrice: 17200, count: 3 },
        { date: 'Week 2', avgPrice: 18800, count: 2 },
        { date: 'Week 3', avgPrice: 19500, count: 4 },
        { date: 'Week 4', avgPrice: 19300, count: 3 },
      ],
    },
    '60': {
      totalAuctions: 26,
      sold: 21,
      avgPrice: 18200,
      highestPrice: 25100,
      lowestPrice: 13500,
      avgBids: 8.2,
      sellThroughRate: 80.8,
      priceChange: 3.8,
      trendData: [
        { date: 'Week 1', avgPrice: 16500, count: 3 },
        { date: 'Week 2', avgPrice: 17000, count: 3 },
        { date: 'Week 3', avgPrice: 17600, count: 3 },
        { date: 'Week 4', avgPrice: 18100, count: 4 },
        { date: 'Week 5', avgPrice: 18900, count: 3 },
        { date: 'Week 6', avgPrice: 19200, count: 4 },
        { date: 'Week 7', avgPrice: 19000, count: 3 },
        { date: 'Week 8', avgPrice: 18600, count: 3 },
      ],
    },
    '90': {
      totalAuctions: 38,
      sold: 30,
      avgPrice: 17850,
      highestPrice: 25100,
      lowestPrice: 12800,
      avgBids: 7.9,
      sellThroughRate: 78.9,
      priceChange: 2.1,
      trendData: [
        { date: 'Week 1', avgPrice: 16200, count: 3 },
        { date: 'Week 2', avgPrice: 16800, count: 3 },
        { date: 'Week 3', avgPrice: 17200, count: 3 },
        { date: 'Week 4', avgPrice: 17600, count: 3 },
        { date: 'Week 5', avgPrice: 18000, count: 3 },
        { date: 'Week 6', avgPrice: 18500, count: 4 },
        { date: 'Week 7', avgPrice: 19000, count: 4 },
        { date: 'Week 8', avgPrice: 18800, count: 3 },
        { date: 'Week 9', avgPrice: 18400, count: 3 },
        { date: 'Week 10', avgPrice: 18200, count: 3 },
        { date: 'Week 11', avgPrice: 18600, count: 3 },
        { date: 'Week 12', avgPrice: 19000, count: 3 },
      ],
    },
    '365': {
      totalAuctions: 142,
      sold: 108,
      avgPrice: 17420,
      highestPrice: 26300,
      lowestPrice: 11200,
      avgBids: 7.6,
      sellThroughRate: 76.1,
      priceChange: -1.4,
      trendData: [
        { date: 'W1', avgPrice: 18500, count: 3 },
        { date: 'W2', avgPrice: 18700, count: 3 },
        { date: 'W3', avgPrice: 18900, count: 3 },
        { date: 'W4', avgPrice: 18600, count: 2 },
        { date: 'W5', avgPrice: 18400, count: 3 },
        { date: 'W6', avgPrice: 18200, count: 3 },
        { date: 'W7', avgPrice: 18000, count: 2 },
        { date: 'W8', avgPrice: 17800, count: 3 },
        { date: 'W9', avgPrice: 17600, count: 2 },
        { date: 'W10', avgPrice: 17400, count: 3 },
        { date: 'W11', avgPrice: 17200, count: 3 },
        { date: 'W12', avgPrice: 17000, count: 2 },
        { date: 'W13', avgPrice: 16900, count: 3 },
        { date: 'W14', avgPrice: 17100, count: 3 },
        { date: 'W15', avgPrice: 17300, count: 2 },
        { date: 'W16', avgPrice: 17500, count: 3 },
        { date: 'W17', avgPrice: 17400, count: 2 },
        { date: 'W18', avgPrice: 17200, count: 3 },
        { date: 'W19', avgPrice: 17000, count: 3 },
        { date: 'W20', avgPrice: 16800, count: 2 },
        { date: 'W21', avgPrice: 16600, count: 3 },
        { date: 'W22', avgPrice: 16500, count: 2 },
        { date: 'W23', avgPrice: 16700, count: 3 },
        { date: 'W24', avgPrice: 16900, count: 3 },
        { date: 'W25', avgPrice: 17000, count: 2 },
        { date: 'W26', avgPrice: 16800, count: 3 },
        { date: 'W27', avgPrice: 16600, count: 2 },
        { date: 'W28', avgPrice: 16400, count: 3 },
        { date: 'W29', avgPrice: 16500, count: 3 },
        { date: 'W30', avgPrice: 16700, count: 2 },
        { date: 'W31', avgPrice: 16900, count: 3 },
        { date: 'W32', avgPrice: 17100, count: 3 },
        { date: 'W33', avgPrice: 17000, count: 2 },
        { date: 'W34', avgPrice: 16800, count: 3 },
        { date: 'W35', avgPrice: 16700, count: 2 },
        { date: 'W36', avgPrice: 16900, count: 3 },
        { date: 'W37', avgPrice: 17100, count: 3 },
        { date: 'W38', avgPrice: 17200, count: 2 },
        { date: 'W39', avgPrice: 17400, count: 3 },
        { date: 'W40', avgPrice: 17600, count: 3 },
        { date: 'W41', avgPrice: 17500, count: 2 },
        { date: 'W42', avgPrice: 17300, count: 3 },
        { date: 'W43', avgPrice: 17200, count: 3 },
        { date: 'W44', avgPrice: 17400, count: 2 },
        { date: 'W45', avgPrice: 17600, count: 3 },
        { date: 'W46', avgPrice: 17500, count: 2 },
        { date: 'W47', avgPrice: 17300, count: 3 },
        { date: 'W48', avgPrice: 17200, count: 3 },
        { date: 'W49', avgPrice: 17400, count: 2 },
        { date: 'W50', avgPrice: 17500, count: 3 },
        { date: 'W51', avgPrice: 17300, count: 3 },
        { date: 'W52', avgPrice: 17200, count: 2 },
      ],
    },
  }

  const conditionData = [
    { name: 'Excellent', value: 15, avgPrice: 21500 },
    { name: 'Good', value: 45, avgPrice: 18200 },
    { name: 'Fair', value: 30, avgPrice: 15800 },
    { name: 'Poor', value: 10, avgPrice: 12500 },
  ]

  const makeData = [
    { make: 'John Deere', count: 42, avgPrice: 19200 },
    { make: 'Kubota', count: 38, avgPrice: 18500 },
    { make: 'Mahindra', count: 24, avgPrice: 16800 },
    { make: 'New Holland', count: 22, avgPrice: 17900 },
    { make: 'Case IH', count: 16, avgPrice: 18100 },
  ]

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

  const currentData =
    performanceData[selectedPeriod as keyof typeof performanceData]

  const StatCard = ({
    label,
    value,
    subValue,
    trend,
    trendUp,
  }: {
    label: string
    value: string | number
    subValue?: string
    trend?: number
    trendUp?: boolean
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {trend !== undefined && (
          <Badge
            variant={trendUp ? 'default' : 'destructive'}
            className="gap-1"
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="bg-sidebar p-4">
      <div className="space-y-4">
        {/* Hero Image */}
        <div className="w-full bg-black flex items-center justify-start">
          <img
            src={`${import.meta.env.BASE_URL}email-header.jpg`}
            alt="BigIron Auctions Market Report"
            className="max-h-[80px] h-auto"
            style={{ maxHeight: '80px' }}
          />
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold leading-none tracking-tight">
                50HP Tractor Auction Performance Report
              </h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive market analysis for similar equipment on BigIron
                auctions
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                Report Generated
              </div>
              <p className="text-sm font-semibold">December 23, 2025</p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center">
          <Tabs
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-full max-w-2xl"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="30" className="cursor-pointer">
                Last 30 Days
              </TabsTrigger>
              <TabsTrigger value="60" className="cursor-pointer">
                Last 60 Days
              </TabsTrigger>
              <TabsTrigger value="90" className="cursor-pointer">
                Last 90 Days
              </TabsTrigger>
              <TabsTrigger value="365" className="cursor-pointer">
                Last 365 Days
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Average Sale Price"
            value={`$${currentData.avgPrice.toLocaleString()}`}
            subValue={`Range: $${currentData.lowestPrice.toLocaleString()} - $${currentData.highestPrice.toLocaleString()}`}
            trend={currentData.priceChange}
            trendUp={currentData.priceChange > 0}
          />
          <StatCard
            label="Total Auctions"
            value={currentData.totalAuctions}
            subValue={`${currentData.sold} sold (${currentData.sellThroughRate}% sell-through)`}
          />
          <StatCard
            label="Average Bids per Auction"
            value={currentData.avgBids.toFixed(1)}
            subValue="Active bidding competition"
          />
          <StatCard
            label="Sell-Through Rate"
            value={`${currentData.sellThroughRate}%`}
            subValue={`${currentData.sold} of ${currentData.totalAuctions} auctions`}
          />
        </div>

        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trend Analysis</CardTitle>
            <CardDescription>
              Average sale prices over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData.trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  domain={[
                    (dataMin: number) => Math.floor(dataMin * 0.95),
                    (dataMax: number) => Math.ceil(dataMax * 1.1),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Average Price"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  connectNulls
                />
                {/* Highest Point Marker */}
                <ReferenceDot
                  x={
                    currentData.trendData.reduce((max, point) =>
                      point.avgPrice > max.avgPrice ? point : max,
                    ).date
                  }
                  y={Math.max(...currentData.trendData.map((d) => d.avgPrice))}
                  r={6}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: `High: $${Math.max(...currentData.trendData.map((d) => d.avgPrice)).toLocaleString()}`,
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                />
                {/* Lowest Point Marker */}
                <ReferenceDot
                  x={
                    currentData.trendData.reduce((min, point) =>
                      point.avgPrice < min.avgPrice ? point : min,
                    ).date
                  }
                  y={Math.min(...currentData.trendData.map((d) => d.avgPrice))}
                  r={6}
                  fill="#ef4444"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: `Low: $${Math.min(...currentData.trendData.map((d) => d.avgPrice)).toLocaleString()}`,
                    position: 'bottom',
                    fill: '#ef4444',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Condition Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Condition</CardTitle>
              <CardDescription>
                Sales distribution across equipment conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie
                      data={conditionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {conditionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {conditionData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        ${item.avgPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Make Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Make</CardTitle>
              <CardDescription>
                Auction volume across manufacturers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={makeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="make"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value, name) => [
                      name === 'avgPrice'
                        ? `$${value.toLocaleString()}`
                        : value,
                      name === 'avgPrice' ? 'Avg Price' : 'Count',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Auction Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card className="border-primary/70 bg-primary/30">
          <CardHeader>
            <CardTitle>Market Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 rounded-lg border-primary/70 border bg-background/50 p-4">
                <h3 className="font-semibold">🎯 Optimal Timing</h3>
                <p className="text-sm text-muted-foreground">
                  Prices have been{' '}
                  {currentData.priceChange > 0 ? 'trending upward' : 'stable'}{' '}
                  over the last {selectedPeriod} days, with{' '}
                  {currentData.sellThroughRate}% sell-through rate indicating
                  strong market demand.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border-primary/70 border bg-background/50 p-4">
                <h3 className="font-semibold">💰 Price Positioning</h3>
                <p className="text-sm text-muted-foreground">
                  Similar equipment averaged $
                  {currentData.avgPrice.toLocaleString()} with{' '}
                  {currentData.avgBids.toFixed(1)} bids per auction, suggesting
                  healthy buyer competition.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border-primary/70 border bg-background/50 p-4">
                <h3 className="font-semibold">📊 Market Strength</h3>
                <p className="text-sm text-muted-foreground">
                  {currentData.sold} of {currentData.totalAuctions} similar
                  tractors sold successfully, demonstrating a robust market for
                  50HP equipment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            Data sourced from BigIron auction records • Analysis period: Last{' '}
            {selectedPeriod} days
          </p>
        </div>
      </div>
    </div>
  )
}

export default TractorPerformanceReport
