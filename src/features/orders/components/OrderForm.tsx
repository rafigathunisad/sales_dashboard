"use client"

import { useEffect, useState } from "react"

export default function OrderForm() {

  const [products, setProducts] = useState<any[]>([])
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {

    const res = await fetch("/api/products")
    const data = await res.json()

    setProducts(data)
  }

  async function placeOrder() {

    if (!productId) {
      setMessage("Please select a product")
      return
    }

    const body = {
      userId: "ADD_USER_ID_FROM_DB",
      items: [
        {
          productId: Number(productId),
          quantity: quantity
        }
      ]
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    console.log(data)

    setMessage("Order created successfully")

    setProductId("")
    setQuantity(1)
  }

  return (

    <div className="bg-white p-6 rounded shadow max-w-md">

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Select Product
        </label>

        <select
          className="w-full border border-gray-300 rounded p-2"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Choose product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - ₹{p.price}
            </option>
          ))}

        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Quantity
        </label>

        <input
          type="number"
          min="1"
          className="w-full border border-gray-300 rounded p-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <button
        onClick={placeOrder}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Place Order
      </button>

      {message && (
        <p className="mt-3 text-green-600 text-sm">
          {message}
        </p>
      )}

    </div>
  )
}