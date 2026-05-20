"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

interface ScoreTimelineChartProps {
  data: {
    index: string
    score: number
    avg: number
  }[]
}

export default function ScoreTimelineChart({ data }: ScoreTimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="index" stroke="#4e4e52" fontSize={11} tickLine={false} />
        <YAxis stroke="#4e4e52" fontSize={11} domain={[0, 100]} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#19191d",
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#ededef",
            fontSize: "12px"
          }}
        />
        <Legend verticalAlign="top" height={32} iconSize={8} wrapperStyle={{ fontSize: 11, color: "#85858a" }} />
        <Line
          name="Score"
          type="monotone"
          dataKey="score"
          stroke="#d4a044"
          strokeWidth={2}
          dot={{ fill: "#d4a044", strokeWidth: 0, r: 3 }}
        />
        <Line
          name="Average"
          type="monotone"
          dataKey="avg"
          stroke="#333"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
