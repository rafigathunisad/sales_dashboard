"use client"

import { AdminNavBar } from "@/components/DashboardNavBar"
import SalesGraphs from "@/features/reports/components/SalesGraphs"
import TopLeastTables from "@/features/reports/components/TopLeastTables"
import SalesUsersTable from "@/features/reports/components/SalesUsersTable"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <AdminNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-10">
        <h1 className="text-2xl font-bold">Reports</h1>

        <section>
          <h2 className="text-lg font-semibold mb-4">Products Sold</h2>
          <SalesGraphs metric="quantity" />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Revenue</h2>
          <SalesGraphs metric="revenue" />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Top & Least Sold</h2>
          <TopLeastTables />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Sales User Performance</h2>
          <SalesUsersTable />
        </section>
      </main>
    </div>
  )
}
