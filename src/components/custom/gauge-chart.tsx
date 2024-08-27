"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
  progress: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  empty: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


interface RadialChartProps{
  progress: {
    completed: number, 
    remaining: number,
  },
}


export function RadialChart({progress}: RadialChartProps) {

  return (
    <ChartContainer
    config={chartConfig}
    className="mx-auto aspect-square w-full max-w-[250px]"
  >
    <RadialBarChart
      data={[progress]}
      endAngle={180}
      innerRadius={110}
      outerRadius={160}
    >
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
      />
      <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 32}
                    className="fill-foreground text-2xl font-bold"
                  >
                    {progress.completed}%
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 12}
                    className="fill-muted-foreground"
                  >
                    Percentage
                  </tspan>
                </text>
              )
            }
          }}
        />
      </PolarRadiusAxis>
      <RadialBar
        dataKey="remaining"
        fill="#F6F6F6"
        stackId="a"
        cornerRadius={0}
        className="stroke-transparent stroke-2"
      />
      <RadialBar
        dataKey="completed"
        stackId="a"
        cornerRadius={0}
        fill="#37AD4A"
        className="stroke-transparent stroke-2"
      />
      
    </RadialBarChart>
  </ChartContainer>
  )
}
