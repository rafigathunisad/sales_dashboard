"use client"

import { useEffect, useState } from "react"

export default function RestockPage(){

  const [categories,setCategories] = useState([])
  const [products,setProducts] = useState([])

  const [categoryId,setCategoryId] = useState("")
  const [productId,setProductId] = useState("")
  const [quantity,setQuantity] = useState("")

  useEffect(()=>{

    fetch("/api/categories")
      .then(res=>res.json())
      .then(data=>setCategories(data))

  },[])

useEffect(()=>{

  if(categoryId){

    setProducts([])

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

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-black mb-6">
          Restock Product
        </h1>

        <div className="space-y-5">

          <div>
            <label className="block text-black font-semibold mb-2">
              Select Category
            </label>

            <select
              value={categoryId}
              onChange={(e)=>setCategoryId(e.target.value)}
              className="w-full border rounded p-2 text-black"
            >

              <option value="">Select Category</option>

              {categories.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>
          </div>


          <div>
            <label className="block text-black font-semibold mb-2">
              Select Product
            </label>

            <select
              value={productId}
              onChange={(e)=>setProductId(e.target.value)}
              className="w-full border rounded p-2 text-black"
            >

              <option value="">Select Product</option>

              {products.map((p:any)=>(
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}

            </select>
          </div>


          <div>
            <label className="block text-black font-semibold mb-2">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              className="w-full border rounded p-2 text-black"
            />
          </div>


          <button
            onClick={handleRestock}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Restock
          </button>

        </div>

      </div>

    </div>

  )

}