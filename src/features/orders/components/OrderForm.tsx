"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function OrderForm({onOrderCreated}:any) {

  const { data: session } = useSession()

  const [products, setProducts] = useState<any[]>([])
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<any[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  function addToCart() {

    if (!productId) {
      alert("Please select a product")
      return
    }

    const product = products.find(p => p.id === Number(productId))
    if (!product) return

    const item = {
      productId: product.id,
      name: product.name,
      quantity: quantity,
      price: product.price
    }

    setCart([...cart, item])

    setProductId("")
    setQuantity(1)
  }

  function removeItem(index: number) {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
  }

  async function placeOrder() {

    const userId = (session?.user as any)?.id

    if (!userId) {
      alert("User not logged in")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    const body = {
      userId: userId,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
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
    setCart([])
    if (onOrderCreated) {
      onOrderCreated()
    }
  }

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  return (

    <div className="bg-white p-6 rounded shadow max-w-xl">

      <h3 className="text-lg font-bold mb-4">Add Product</h3>

      <div className="flex gap-3 mb-4">

        <select
          className="border p-2 rounded flex-1"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Select product</option>

          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - ₹{p.price}
            </option>
          ))}

        </select>

        <input
          type="number"
          min="1"
          className="border p-2 rounded w-24"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={addToCart}
          className="bg-green-600 text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      <h3 className="text-lg font-bold mb-2">Cart</h3>

      {cart.length === 0 ? (
        <p className="text-gray-500">No items added</p>
      ) : (

        <table className="w-full mb-4 border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-center">Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {cart.map((item, index) => (

              <tr key={index} className="border-t">

                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-center">₹{item.price}</td>

                <td className="p-2 text-right">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {cart.length > 0 && (
        <div className="flex justify-between mb-4 font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      )}

      <button
        onClick={placeOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>

      {message && (
        <p className="mt-3 text-green-600">{message}</p>
      )}

    </div>
  )
}