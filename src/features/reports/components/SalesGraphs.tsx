"use client"

import { useEffect, useState, useCallback } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

type DataPoint = { label: string; value: number }

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function formatValue(v: unknown, metric: string): string {
  const n = Number(v) || 0
  return metric === "revenue" ? `$${n.toFixed(2)}` : String(n)
}

export default function SalesGraphs({ metric }: { metric: "quantity" | "revenue" }) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [week, setWeek] = useState(1)

  const [yearlyData, setYearlyData] = useState<DataPoint[]>([])
  const [monthlyData, setMonthlyData] = useState<DataPoint[]>([])
  const [weeklyData, setWeeklyData] = useState<DataPoint[]>([])

  const [totalWeeks, setTotalWeeks] = useState(5)

  const fetchData = useCallback(
    async (view: string, params: Record<string, string | number>) => {
      const qs = new URLSearchParams(
        Object.entries({ view, metric, ...params }).map(([k, v]) => [k, String(v)])
      )
      const res = await fetch(`/api/reports/sales-graph?${qs}`)
      return res.json()
    },
    [metric]
  )

  useEffect(() => {
    fetchData("yearly", { year }).then(setYearlyData)
  }, [year, fetchData])

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const weeks = Math.ceil(daysInMonth / 7)
    setTotalWeeks(weeks)
    setWeek(1)
    fetchData("monthly", { year, month }).then(setMonthlyData)
  }, [year, month, fetchData])

  useEffect(() => {
    fetchData("weekly", { year, month, week }).then(setWeeklyData)
  }, [year, month, week, fetchData])

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
  const lineColor = metric === "revenue" ? "#10b981" : "#3b82f6"
  const valueLabel = metric === "revenue" ? "Revenue ($)" : "Products Sold"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Yearly</h3>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatValue(v, metric), valueLabel]} />
              <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Monthly ({year})</h3>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatValue(v, metric), valueLabel]} />
              <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Weekly ({MONTHS[month - 1]} {year})
            </h3>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              {Array.from({ length: totalWeeks }, (_, i) => (
                <option key={i} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatValue(v, metric), valueLabel]} />
              <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
