"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import OrderForm from "@/features/orders/components/OrderForm"
import OrderHistory from "@/features/orders/components/OrderHistory"
import { UserNavBar } from "@/components/DashboardNavBar"

export default function OrdersPage() {
  const [refresh, setRefresh] = useState(0)
  const { data: session } = useSession()

  function refreshOrders() {
    setRefresh(prev => prev + 1)
  } 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <UserNavBar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">Create Order</h2>

        <OrderForm onOrderCreated={refreshOrders} />

        <OrderHistory refresh={refresh} />

      </main>

    </div>
  )
}