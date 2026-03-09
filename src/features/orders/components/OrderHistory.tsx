"use client"

import { useEffect, useState } from "react"

export default function OrderHistory({ refresh }: { refresh: number }) {

const [orders, setOrders] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [openOrder, setOpenOrder] = useState<number | null>(null)

useEffect(() => {
fetchOrders()
}, [refresh])

async function fetchOrders() {


const res = await fetch("/api/orders")
const data = await res.json()

setOrders(data)
setLoading(false)


}

function toggleOrder(id: number) {
if (openOrder === id) {
setOpenOrder(null)
} else {
setOpenOrder(id)
}
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

        <div
          key={order.id}
          className="border rounded p-3"
        >

          <div
            className="flex justify-between cursor-pointer"
            onClick={() => toggleOrder(order.id)}
          >

            <div>

              <p className="font-semibold">
                Order #{order.id}
              </p>

              <p className="text-sm text-gray-600">
                Total: ₹{order.totalAmount}
              </p>

            </div>

            <span className="text-sm text-gray-500">
              {openOrder === order.id ? "▲" : "▼"}
            </span>

          </div>

          {openOrder === order.id && (

            <div className="mt-3 border-t pt-2">

              {order.items.map((item: any, index: number) => (

                <div
                  key={index}
                  className="flex justify-between text-sm"
                >

                  <span>Product #{item.productId}</span>

                  <span>
                    Qty: {item.quantity} | ₹{item.price}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      ))}

    </div>

  )}

</div>


)
}
