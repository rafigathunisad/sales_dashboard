"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNavBar } from "@/components/DashboardNavBar"

export default function InventoryPage() {

  const [products,setProducts] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [categoryFilter,setCategoryFilter] = useState("")
  const [minPrice,setMinPrice] = useState("")
  const [maxPrice,setMaxPrice] = useState("")
  const [showLowStockModal,setShowLowStockModal] = useState(false)

  const [page,setPage] = useState(1)
  const rowsPerPage = 10

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

  const lowStockProducts = products.filter((p:any)=>p.stock < 10)

  const categories = [...new Set(products.map((p:any)=>p.category.name))]

  const filteredProducts = products
    .filter((p:any)=>p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p:any)=> categoryFilter ? p.category.name === categoryFilter : true)
    .filter((p:any)=> minPrice ? p.price >= Number(minPrice) : true)
    .filter((p:any)=> maxPrice ? p.price <= Number(maxPrice) : true)

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      <AdminNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Inventory Management
          </h1>

          <button
            onClick={() => router.push("/inventory/restock")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Restock Product
          </button>

        </div>

        {/* Low Stock Alert */}

        {lowStockProducts.length > 0 && (

          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex justify-between items-center">

            <span className="text-red-700 font-semibold text-sm">
              {lowStockProducts.length} Low Stock Products
            </span>

            <button
              onClick={()=>setShowLowStockModal(true)}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              View Details
            </button>

          </div>

        )}

        {/* Filters */}

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">

          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Search Product
              </label>

              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(e)=>setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-44 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat:any)=>(
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Min Price
              </label>

              <input
                type="number"
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Max Price
              </label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>

        {/* Table */}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">

          <div className="max-h-[28rem] overflow-y-auto">

            <table className="w-full border-collapse">

              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase sticky top-0">

                <tr>

                  <th onClick={()=>handleSort("id")} className="px-4 py-3 text-center cursor-pointer">
                    P_Id {sortIcon("id")}
                  </th>

                  <th onClick={()=>handleSort("name")} className="px-4 py-3 text-center cursor-pointer">
                    Product {sortIcon("name")}
                  </th>

                  <th onClick={()=>handleSort("category")} className="px-4 py-3 text-center cursor-pointer">
                    Category {sortIcon("category")}
                  </th>

                  <th onClick={()=>handleSort("price")} className="px-4 py-3 text-center cursor-pointer">
                    Price {sortIcon("price")}
                  </th>

                  <th onClick={()=>handleSort("stock")} className="px-4 py-3 text-center cursor-pointer">
                    Stock {sortIcon("stock")}
                  </th>

                  <th className="px-4 py-3 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {paginatedProducts.map((p:any)=>(

                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    <td className="px-4 py-3 text-center text-sm">{p.id}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-center text-sm">{p.category.name}</td>
                    <td className="px-4 py-3 text-center text-sm">${p.price}</td>
                    <td className="px-4 py-3 text-center text-sm">{p.stock}</td>

                    <td className="px-4 py-3 text-center">

                      {p.stock < 10
                        ? (
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Low Stock
                          </span>
                        )
                        : (
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
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

        {/* Pagination */}

        <div className="flex justify-center items-center gap-3 mt-4">

          <button
            onClick={()=>setPage(page-1)}
            disabled={page===1}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {page}
          </span>

          <button
            onClick={()=>setPage(page+1)}
            disabled={page * rowsPerPage >= filteredProducts.length}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Next
          </button>

        </div>

      </main>

      {/* Modal */}

      {showLowStockModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white border border-gray-200 w-[600px] rounded-xl shadow-lg p-6">

            <div className="flex justify-between mb-4">

              <h2 className="text-lg font-semibold">
                Low Stock Products
              </h2>

              <button
                onClick={()=>setShowLowStockModal(false)}
                className="text-gray-500 hover:text-gray-900 font-bold"
              >
                ✕
              </button>

            </div>

            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-200">

                <tr>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {lowStockProducts.map((p:any)=>(

                  <tr
                    key={p.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="py-2 px-3 font-medium">{p.name}</td>
                    <td className="py-2 px-3">{p.category.name}</td>
                    <td className="py-2 px-3">
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {p.stock}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  )
}