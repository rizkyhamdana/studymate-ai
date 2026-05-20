"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

interface TopicMasteryChartProps {
  data: {
    topic: string
    mastery: number
  }[]
}

export default function TopicMasteryChart({ data }: TopicMasteryChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis type="number" stroke="#4e4e52" fontSize={11} domain={[0, 100]} tickLine={false} />
        <YAxis type="category" dataKey="topic" stroke="#4e4e52" fontSize={11} tickLine={false} width={100} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#19191d",
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#ededef",
            fontSize: "12px"
          }}
        />
        <Bar dataKey="mastery" radius={[0, 6, 6, 0]} barSize={14}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.mastery >= 75 ? "#d4a044" : "#60a5fa"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
