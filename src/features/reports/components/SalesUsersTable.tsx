"use client"

import { useEffect, useState } from "react"

type SalesUser = {
  id: string
  name: string
  ordersProcessed: number
  revenueGenerated: number
}

export default function SalesUsersTable() {
  const [users, setUsers] = useState<SalesUser[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"revenue" | "orders">("revenue")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const qs = new URLSearchParams({ sortBy, limit: "5" })
    if (debouncedSearch) qs.set("search", debouncedSearch)
    fetch(`/api/reports/sales-users?${qs}`)
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
  }, [sortBy, debouncedSearch])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-700 mr-auto">Sales Users</h3>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "revenue" | "orders")}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="revenue">Sort by Revenue</option>
          <option value="orders">Sort by Orders</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders Processed</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue Generated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u, i) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm text-gray-500">{i + 1}</td>
                <td className="p-3 text-sm font-medium">{u.name}</td>
                <td className="p-3 text-sm">{u.ordersProcessed}</td>
                <td className="p-3 text-sm">${u.revenueGenerated.toFixed(2)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-sm text-gray-400 text-center">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
