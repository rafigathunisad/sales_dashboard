"use client"

import { useEffect, useState } from "react"

export default function OrderHistory({ refresh }: { refresh: number }) {

const [orders, setOrders] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
fetchOrders()
}, [refresh])

async function fetchOrders() {


const res = await fetch("/api/orders")
const data = await res.json()

setOrders(data)
setLoading(false)


}

if (loading) {
return <p>Loading orders...</p>
}

return (


<div className="bg-white p-6 rounded shadow">

  <h3 className="text-lg font-bold mb-4">
    Order History
  </h3>

  {orders.length === 0 ? (
    <p className="text-gray-500">No orders yet</p>
  ) : (

    <div className="space-y-3">

      {orders.map(order => (

        <div key={order.id} className="border p-3 rounded">

          <p className="font-semibold">
            Order #{order.id}
          </p>

          <p className="text-sm text-gray-600">
            Total: ₹{order.totalAmount}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>

        </div>

      ))}

    </div>

  )}

</div>

)
}
