"use client"

import { useEffect, useState } from "react"

type Row = {
  name: string
  category: string
  quantity: number
  revenue: number
}

export default function TopLeastTables() {
  const [category, setCategory] = useState<"products" | "categories">("products")
  const [sortBy, setSortBy] = useState<"quantity" | "revenue">("quantity")
  const [top10, setTop10] = useState<Row[]>([])
  const [least10, setLeast10] = useState<Row[]>([])

  useEffect(() => {
    const qs = new URLSearchParams({ category, sortBy })
    fetch(`/api/reports/top-least?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        setTop10(data.top10 || [])
        setLeast10(data.least10 || [])
      })
  }, [category, sortBy])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "products" | "categories")}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="products">Products</option>
          <option value="categories">Categories</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "quantity" | "revenue")}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="quantity">Quantity</option>
          <option value="revenue">Revenue</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">Top 10 Sold</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  {category === "products" && (
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  )}
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top10.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="p-3 text-sm font-medium">{row.name}</td>
                    {category === "products" && (
                      <td className="p-3 text-sm">{row.category}</td>
                    )}
                    <td className="p-3 text-sm">{row.quantity}</td>
                    <td className="p-3 text-sm">${row.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {top10.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-sm text-gray-400 text-center">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">Least 10 Sold</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  {category === "products" && (
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  )}
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {least10.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="p-3 text-sm font-medium">{row.name}</td>
                    {category === "products" && (
                      <td className="p-3 text-sm">{row.category}</td>
                    )}
                    <td className="p-3 text-sm">{row.quantity}</td>
                    <td className="p-3 text-sm">${row.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {least10.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-sm text-gray-400 text-center">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
