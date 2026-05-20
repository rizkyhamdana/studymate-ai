"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

interface QuizScoreChartProps {
  data: {
    index: string
    score: number
  }[]
}

export default function QuizScoreChart({ data }: QuizScoreChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="index" stroke="#4e4e52" fontSize={11} tickLine={false} />
        <YAxis stroke="#4e4e52" fontSize={11} domain={[0, 100]} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111113",
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#ededef",
            fontSize: "13px",
          }}
          itemStyle={{ color: "#d4a044" }}
          labelStyle={{ color: "#85858a", fontSize: "11px" }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#d4a044"
          strokeWidth={2}
          dot={{ fill: "#d4a044", strokeWidth: 0, r: 3.5 }}
          activeDot={{ fill: "#e0b25c", strokeWidth: 0, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
