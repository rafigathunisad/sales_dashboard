"use client"

import OrderForm from "@/features/orders/components/OrderForm"

export default function OrdersPage() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sales Dashboard</h1>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">Create Order</h2>

        <OrderForm />

      </main>

    </div>
  )
}