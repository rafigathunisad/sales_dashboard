"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function InventoryPage() {

  const [products,setProducts] = useState([])
  const [sortField,setSortField] = useState("id")
  const [sortOrder,setSortOrder] = useState("asc")

  const router = useRouter()

  useEffect(()=>{

    fetch("/api/inventory")
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a,b)=> a.id - b.id)
        setProducts(sorted)
      })

  },[])

  const handleSort = (field:string) => {

    let order = "asc"

    if(sortField === field && sortOrder === "asc"){
      order = "desc"
    }

    setSortField(field)
    setSortOrder(order)

    const sorted = [...products].sort((a:any,b:any)=>{

      let aValue = field === "category" ? a.category.name : a[field]
      let bValue = field === "category" ? b.category.name : b[field]

      if(aValue < bValue) return order === "asc" ? -1 : 1
      if(aValue > bValue) return order === "asc" ? 1 : -1
      return 0

    })

    setProducts(sorted)
  }

  const sortIcon = (field:string) => {
    if(sortField !== field) return "⇅"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-black">
            Inventory Management
          </h1>

          <button
            onClick={() => router.push("/inventory/restock")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Restock Product
          </button>

        </div>

        <table className="w-full border-collapse">

          <thead className="bg-gray-200 text-black font-semibold">

            <tr>

              <th
                className="p-3 cursor-pointer"
                onClick={()=>handleSort("id")}
              >
                P_Id {sortIcon("id")}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={()=>handleSort("name")}
              >
                Product {sortIcon("name")}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={()=>handleSort("category")}
              >
                Category {sortIcon("category")}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={()=>handleSort("price")}
              >
                Price {sortIcon("price")}
              </th>

              <th
                className="p-3 cursor-pointer"
                onClick={()=>handleSort("stock")}
              >
                Stock {sortIcon("stock")}
              </th>

              <th className="p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((p:any)=>(
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 text-black"
              >

                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category.name}</td>
                <td className="p-3 font-medium">${p.price}</td>
                <td className="p-3">{p.stock}</td>

                <td className="p-3">

                  {p.stock < 10
                    ? (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                        Low Stock
                      </span>
                    )
                    : (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                        In Stock
                      </span>
                    )
                  }

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}