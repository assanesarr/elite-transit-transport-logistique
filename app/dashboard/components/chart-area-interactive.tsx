"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useFinanceStore } from "@/store/financeStore"

export const description = "An interactive area chart"

// const chartData = [
//   { date: "2024-04-01", encaissement: 222, decaissement: 150 },
//   { date: "2024-04-02", encaissement: 97, decaissement: 180 },
//   { date: "2024-04-03", encaissement: 167, decaissement: 120 },
//   { date: "2024-04-04", encaissement: 242, decaissement: 260 },
//   { date: "2024-04-05", encaissement: 373, decaissement: 290 },
//   { date: "2024-04-06", encaissement: 301, decaissement: 340 },
//   { date: "2024-04-07", encaissement: 245, decaissement: 180 },
//   { date: "2024-04-08", encaissement: 409, decaissement: 320 },
//   { date: "2024-04-09", encaissement: 59, decaissement: 110 },
//   { date: "2024-04-10", encaissement: 261, decaissement: 190 },
//   { date: "2024-04-11", encaissement: 327, decaissement: 350 },
//   { date: "2024-04-12", encaissement: 292, decaissement: 210 },
//   { date: "2024-04-13", encaissement: 342, decaissement: 380 },
//   { date: "2024-04-14", encaissement: 137, decaissement: 220 },
//   { date: "2024-04-15", encaissement: 120, decaissement: 170 },
//   { date: "2024-04-16", encaissement: 138, decaissement: 190 },
//   { date: "2024-04-17", encaissement: 446, decaissement: 360 },
//   { date: "2024-04-18", encaissement: 364, decaissement: 410 },
//   { date: "2024-04-19", encaissement: 243, decaissement: 180 },
//   { date: "2024-04-20", encaissement: 89, decaissement: 150 },
//   { date: "2024-04-21", encaissement: 137, decaissement: 200 },
//   { date: "2024-04-22", encaissement: 224, decaissement: 170 },
//   { date: "2024-04-23", encaissement: 138, decaissement: 230 },
//   { date: "2024-04-24", encaissement: 387, decaissement: 290 },
//   { date: "2024-04-25", encaissement: 215, decaissement: 250 },
//   { date: "2024-04-26", encaissement: 75, decaissement: 130 },
//   { date: "2024-04-27", encaissement: 383, decaissement: 420 },
//   { date: "2024-04-28", encaissement: 122, decaissement: 180 },
//   { date: "2024-04-29", encaissement: 315, decaissement: 240 },
//   { date: "2024-04-30", encaissement: 454, decaissement: 380 },
//   { date: "2024-05-01", encaissement: 165, decaissement: 220 },
//   { date: "2024-05-02", encaissement: 293, decaissement: 310 },
//   { date: "2024-05-03", encaissement: 247, decaissement: 190 },
//   { date: "2024-05-04", encaissement: 385, decaissement: 420 },
//   { date: "2024-05-05", encaissement: 481, decaissement: 390 },
//   { date: "2024-05-06", encaissement: 498, decaissement: 520 },
//   { date: "2024-05-07", encaissement: 388, decaissement: 300 },
//   { date: "2024-05-08", encaissement: 149, decaissement: 210 },
//   { date: "2024-05-09", encaissement: 227, decaissement: 180 },
//   { date: "2024-05-10", encaissement: 293, decaissement: 330 },
//   { date: "2024-05-11", encaissement: 335, decaissement: 270 },
//   { date: "2024-05-12", encaissement: 197, decaissement: 240 },
//   { date: "2024-05-13", encaissement: 197, decaissement: 160 },
//   { date: "2024-05-14", encaissement: 448, decaissement: 490 },
//   { date: "2024-05-15", encaissement: 473, decaissement: 380 },
//   { date: "2024-05-16", encaissement: 338, decaissement: 400 },
//   { date: "2024-05-17", encaissement: 499, decaissement: 420 },
//   { date: "2024-05-18", encaissement: 315, decaissement: 350 },
//   { date: "2024-05-19", encaissement: 235, decaissement: 180 },
//   { date: "2024-05-20", encaissement: 177, decaissement: 230 },
//   { date: "2024-05-21", encaissement: 82, decaissement: 140 },
//   { date: "2024-05-22", encaissement: 81, decaissement: 120 },
//   { date: "2024-05-23", encaissement: 252, decaissement: 290 },
//   { date: "2024-05-24", encaissement: 294, decaissement: 220 },
//   { date: "2024-05-25", encaissement: 201, decaissement: 250 },
//   { date: "2024-05-26", encaissement: 213, decaissement: 170 },
//   { date: "2024-05-27", encaissement: 420, decaissement: 460 },
//   { date: "2024-05-28", encaissement: 233, decaissement: 190 },
//   { date: "2024-05-29", encaissement: 78, decaissement: 130 },
//   { date: "2024-05-30", encaissement: 340, decaissement: 280 },
//   { date: "2024-05-31", encaissement: 178, decaissement: 230 },
//   { date: "2024-06-01", encaissement: 178, decaissement: 200 },
//   { date: "2024-06-02", encaissement: 470, decaissement: 410 },
//   { date: "2024-06-03", encaissement: 103, decaissement: 160 },
//   { date: "2024-06-04", encaissement: 439, decaissement: 380 },
//   { date: "2024-06-05", encaissement: 88, decaissement: 140 },
//   { date: "2024-06-06", encaissement: 294, decaissement: 250 },
//   { date: "2024-06-07", encaissement: 323, decaissement: 370 },
//   { date: "2024-06-08", encaissement: 385, decaissement: 320 },
//   { date: "2024-06-09", encaissement: 438, decaissement: 480 },
//   { date: "2024-06-10", encaissement: 155, decaissement: 200 },
//   { date: "2024-06-11", encaissement: 92, decaissement: 150 },
//   { date: "2024-06-12", encaissement: 492, decaissement: 420 },
//   { date: "2024-06-13", encaissement: 81, decaissement: 130 },
//   { date: "2024-06-14", encaissement: 426, decaissement: 380 },
//   { date: "2024-06-15", encaissement: 307, decaissement: 350 },
//   { date: "2024-06-16", encaissement: 371, decaissement: 310 },
//   { date: "2024-06-17", encaissement: 475, decaissement: 520 },
//   { date: "2024-06-18", encaissement: 107, decaissement: 170 },
//   { date: "2024-06-19", encaissement: 341, decaissement: 290 },
//   { date: "2024-06-20", encaissement: 408, decaissement: 450 },
//   { date: "2024-06-21", encaissement: 169, decaissement: 210 },
//   { date: "2024-06-22", encaissement: 317, decaissement: 270 },
//   { date: "2024-06-23", encaissement: 480, decaissement: 530 },
//   { date: "2024-06-24", encaissement: 132, decaissement: 180 },
//   { date: "2024-06-25", encaissement: 141, decaissement: 190 },
//   { date: "2024-06-26", encaissement: 434, decaissement: 380 },
//   { date: "2024-06-27", encaissement: 448, decaissement: 490 },
//   { date: "2024-06-28", encaissement: 149, decaissement: 200 },
//   { date: "2024-06-29", encaissement: 103, decaissement: 160 },
//   { date: "2024-06-30", encaissement: 446, decaissement: 400 },
// ]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  encaissement: {
    label: "Encaissement",
    color: "var(--primary)",
  },
  decaissement: {
    label: "Decaissement",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const mouvement = useFinanceStore(state => state.mouvements);

  const chartData = mouvement.map(m => ({
        encaissement: m.type === 'encaissement' ? m.montant : 0,
        decaissement: m.type === 'decaissement' ? m.montant : 0,
        date: new Date(m.createdAt).toLocaleDateString('en-US'),
    }));

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Mouvements</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total des 3 derniers mois
          </span>
          <span className="@[540px]/card:hidden">3 derniers mois</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillencaissement" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-encaissement)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-encaissement)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="filldecaissement" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-decaissement)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-decaissement)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="decaissement"
              type="natural"
              fill="url(#filldecaissement)"
              stroke="var(--color-decaissement)"
              stackId="a"
            />
            <Area
              dataKey="encaissement"
              type="natural"
              fill="url(#fillencaissement)"
              stroke="var(--color-encaissement)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}