"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function PortfolioChart() {
  const data = [
    { month: "Jan", value: 108000 },
    { month: "Feb", value: 112000 },
    { month: "Mar", value: 109000 },
    { month: "Apr", value: 115000 },
    { month: "May", value: 118000 },
    { month: "Jun", value: 122000 },
    { month: "Jul", value: 119000 },
    { month: "Aug", value: 124850 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#1e40af"
          strokeWidth={3}
          dot={{ fill: "#1e40af", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
