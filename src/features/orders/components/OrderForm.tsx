"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function OrderForm({onOrderCreated}: any) {

  const { data: session } = useSession()

  const [products, setProducts] = useState<any[]>([])
  const [productId, setProductId] = useState("")
  const [selectedPrice, setSelectedPrice] = useState(0)

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

  function handleProductChange(id: string) {

    setProductId(id)

    const product = products.find(p => p.id === Number(id))
    if (product) {
      setSelectedPrice(product.price)
    } else {
      setSelectedPrice(0)
    }
  }


  function addToCart() {

  if (!productId) {
    alert("Please select a product")
    return
  }

  const product = products.find(p => p.id === Number(productId))
  if (!product) return

  const existingIndex = cart.findIndex(
    item => item.productId === product.id
  )

  if (existingIndex !== -1) {

    const updatedCart = [...cart]

    updatedCart[existingIndex].quantity =
      updatedCart[existingIndex].quantity + quantity

    setCart(updatedCart)

  } else {

    const item = {
      productId: product.id,
      name: product.name,
      quantity: quantity,
      price: product.price
    }

    setCart([...cart, item])
  }

  setProductId("")
  setSelectedPrice(0)
  setQuantity(1)
}
  function removeItem(index: number) {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
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

    try {
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

      if (!res.ok) {
        setMessage(`Error: ${data.error || "Failed to create order"}`)
        return
      }

      setMessage("Order created successfully")
      setCart([])

      if (onOrderCreated) {
        onOrderCreated()
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
      console.error("Order placement error:", error)
    }
  }

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  return (

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

      <h3 className="text-lg font-bold mb-4">Add Product</h3>

      <div className="grid grid-cols-4 gap-3 mb-4">

        <select
          className="border border-gray-300 p-2 rounded-md col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={productId}
          onChange={(e) => handleProductChange(e.target.value)}
        >
          <option value="">Select product</option>

          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}

        </select>

        <input
          type="number"
          min="1"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={addToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Add
        </button>

      </div>

      {/* Price Display */}

      {selectedPrice > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          Price: ₹{selectedPrice}
        </p>
      )}

      <h3 className="text-lg font-bold mb-2">Cart</h3>

      {cart.length === 0 ? (
        <p className="text-gray-500">No items added</p>
      ) : (

        <table className="w-full mb-4 border border-gray-200 rounded-md overflow-hidden">

          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-center">Price</th>
              <th className="p-2 text-center">Item Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {cart.map((item, index) => (

              <tr key={index} className="border-t">

                <td className="p-2">{item.name}</td>

                <td className="p-2 text-center">
                  {item.quantity}
                </td>

                <td className="p-2 text-center">
                  ₹{item.price}
                </td>

                <td className="p-2 text-center">
                  ₹{item.price * item.quantity}
                </td>

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
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
      >
        Place Order
      </button>

      {message && (
        <p className={`mt-3 font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}

    </div>
  )
}