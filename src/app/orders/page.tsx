"use client"
import { useState } from "react"
import OrderForm from "@/features/orders/components/OrderForm"
import OrderHistory from "@/features/orders/components/OrderHistory"

export default function OrdersPage() {
  const [refresh, setRefresh] = useState(0)
  function refreshOrders() {
    setRefresh(prev => prev + 1)
  } 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sales Dashboard</h1>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">Create Order</h2>

        <OrderForm onOrderCreated={refreshOrders} />

        <OrderHistory refresh={refresh} />

      </main>

    </div>
  )
}