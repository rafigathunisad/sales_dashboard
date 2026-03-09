"use client"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import OrderForm from "@/features/orders/components/OrderForm"
import OrderHistory from "@/features/orders/components/OrderHistory"
import DashboardNavBar from "@/components/DashboardNavBar"

export default function OrdersPage() {
  const [refresh, setRefresh] = useState(0)
  const { data: session } = useSession()

  function refreshOrders() {
    setRefresh(prev => prev + 1)
  } 

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
      {/* Navigation Bar */}
      <DashboardNavBar />

      {/* Top Action Bar */}
      <div className="w-full bg-white border-b border-gray-100 px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-sm text-gray-600 font-medium">Orders</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">Create Order</h2>

        <OrderForm onOrderCreated={refreshOrders} />

        <OrderHistory refresh={refresh} />

      </main>

    </div>
  )
}