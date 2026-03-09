"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

    <div className="h-screen bg-[#5f745f] p-8 flex items-center justify-center">

      <div className="w-full max-w-3xl bg-[#e7efe7] shadow-md rounded-xl border border-[#c9d6c9] p-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-[#1f2a1f]">
            Restock Product
          </h1>

          <button
            onClick={()=>router.push("/inventory")}
            className="bg-[#2f3e2f] text-[#e7efe7] px-4 py-2 rounded-md hover:bg-[#1f2a1f]"
          >
            Back to Inventory
          </button>

        </div>

        {/* Form Panel */}

        <div className="bg-[#d8e4d8] border border-[#c4d3c4] rounded-lg p-6 space-y-6">

          {/* Category */}

          <div className="flex flex-col">

            <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
              Select Category
            </label>

            <select
              value={categoryId}
              onChange={(e)=>setCategoryId(e.target.value)}
              className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 bg-[#e7efe7]"
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

            <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
              Select Product
            </label>

            <select
              value={productId}
              onChange={(e)=>setProductId(e.target.value)}
              className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 bg-[#e7efe7]"
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

            <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 bg-[#e7efe7]"
            />

          </div>


          {/* Buttons */}

          <div className="flex gap-4 pt-2">

            <button
              onClick={handleRestock}
              className="flex-1 bg-[#2f3e2f] text-[#e7efe7] py-2 rounded-md hover:bg-[#1f2a1f]"
            >
              Submit Restock
            </button>

            <button
              onClick={()=>router.push("/inventory")}
              className="flex-1 border border-[#2f3e2f] text-[#2f3e2f] py-2 rounded-md hover:bg-[#cfe0cf]"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}