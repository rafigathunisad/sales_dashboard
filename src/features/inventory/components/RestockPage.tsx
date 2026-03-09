"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNavBar } from "@/components/DashboardNavBar"

export default function RestockPage(){

  const [categories,setCategories] = useState([])
  const [products,setProducts] = useState([])

  const [categoryId,setCategoryId] = useState("")
  const [productId,setProductId] = useState("")
  const [quantity,setQuantity] = useState("")

  const router = useRouter()

  useEffect(()=>{

    fetch("/api/categories")
      .then(res=>res.json())
      .then(data=>setCategories(data))

  },[])

  useEffect(()=>{

    setProductId("")
    setProducts([])

    if(categoryId){

      fetch(`/api/products?categoryId=${Number(categoryId)}`)
        .then(res=>res.json())
        .then(data=>setProducts(data))

    }

  },[categoryId])

  async function handleRestock(){

    await fetch("/api/inventory/restock",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        productId:Number(productId),
        quantity:Number(quantity)
      })
    })

    alert("Stock Updated")
  }

  return(

    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      <AdminNavBar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Restock Product
          </h1>

          <button
            onClick={()=>router.push("/inventory")}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            &larr; Back to Inventory
          </button>

        </div>

        {/* Form Panel */}

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">

          {/* Category */}

          <div className="flex flex-col">

            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Select Category
            </label>

            <select
              value={categoryId}
              onChange={(e)=>setCategoryId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >

              <option value="">Select Category</option>

              {categories.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>

          </div>


          {/* Product */}

          <div className="flex flex-col">

            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Select Product
            </label>

            <select
              value={productId}
              onChange={(e)=>setProductId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >

              <option value="">Select Product</option>

              {products.map((p:any)=>(
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}

            </select>

          </div>


          {/* Quantity */}

          <div className="flex flex-col">

            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />

          </div>


          {/* Buttons */}

          <div className="flex gap-4 pt-2">

            <button
              onClick={handleRestock}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Restock
            </button>

            <button
              onClick={()=>router.push("/inventory")}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>

          </div>

        </div>

      </main>

    </div>
  )
}