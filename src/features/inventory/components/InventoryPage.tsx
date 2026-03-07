"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function InventoryPage() {

  const [products,setProducts] = useState([])
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

    <div className="h-screen bg-[#5f745f] p-8 flex items-center justify-center">

      <div className="w-full max-w-7xl bg-[#e7efe7] shadow-md rounded-xl border border-[#c9d6c9] p-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold text-[#1f2a1f]">
            Inventory Management
          </h1>

          <button
            onClick={() => router.push("/inventory/restock")}
            className="bg-[#2f3e2f] text-[#e7efe7] px-4 py-2 rounded-md hover:bg-[#1f2a1f] transition"
          >
            Restock Product
          </button>

        </div>

        {/* Low Stock Alert */}

        {lowStockProducts.length > 0 && (

          <div className="mb-4 bg-[#f3c6c6] border border-[#e3a8a8] rounded-lg px-4 py-3 flex justify-between items-center">

            <span className="text-[#7a1f1f] font-semibold">
              ⚠ {lowStockProducts.length} Low Stock Products
            </span>

            <button
              onClick={()=>setShowLowStockModal(true)}
              className="bg-[#2f3e2f] text-[#e7efe7] px-3 py-1 rounded-md text-sm hover:bg-[#1f2a1f]"
            >
              View Details
            </button>

          </div>

        )}

        {/* Filters */}

        <div className="bg-[#d8e4d8] border border-[#c4d3c4] rounded-lg p-4 mb-4">

          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
                Search Product
              </label>

              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 w-64 bg-[#e7efe7]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(e)=>setCategoryFilter(e.target.value)}
                className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 w-44 bg-[#e7efe7]"
              >
                <option value="">All Categories</option>
                {categories.map((cat:any)=>(
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
                Min Price
              </label>

              <input
                type="number"
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 w-32 bg-[#e7efe7]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[#2f3e2f] mb-1">
                Max Price
              </label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                className="border border-[#9fb29f] text-[#1f2a1f] rounded-md px-3 py-2 w-32 bg-[#e7efe7]"
              />
            </div>

          </div>

        </div>

        {/* Table */}

        <div className="border border-[#c4d3c4] rounded-lg overflow-hidden shadow-sm">

          <div className="max-h-64 overflow-y-auto">

            <table className="w-full border-collapse">

              <thead className="bg-[#b9cbb9] text-[#1f2a1f] text-sm uppercase tracking-wide sticky top-0">

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

              <tbody>

                {paginatedProducts.map((p:any)=>(

                  <tr
                    key={p.id}
                    className="border-b border-[#c4d3c4] hover:bg-[#d8e4d8] text-[#1f2a1f]"
                  >

                    <td className="px-4 py-3 text-center">{p.id}</td>
                    <td className="px-4 py-3 text-center">{p.name}</td>
                    <td className="px-4 py-3 text-center">{p.category.name}</td>
                    <td className="px-4 py-3 text-center">${p.price}</td>
                    <td className="px-4 py-3 text-center">{p.stock}</td>

                    <td className="px-4 py-3 text-center">

                      {p.stock < 10
                        ? (
                          <span className="bg-[#f3c6c6] text-[#7a1f1f] px-3 py-1 rounded-full text-xs font-semibold">
                            Low Stock
                          </span>
                        )
                        : (
                          <span className="bg-[#cfe8cf] text-[#1e5f1e] px-3 py-1 rounded-full text-xs font-semibold">
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

        <div className="flex justify-center items-center gap-3 mt-3">

          <button
            onClick={()=>setPage(page-1)}
            disabled={page===1}
            className="bg-[#2f3e2f] text-[#e7efe7] px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-[#1f2a1f] font-semibold">
            Page {page}
          </span>

          <button
            onClick={()=>setPage(page+1)}
            disabled={page * rowsPerPage >= filteredProducts.length}
            className="bg-[#2f3e2f] text-[#e7efe7] px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

      {/* Modal */}

      {showLowStockModal && (

        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#e7efe7] border border-[#c4d3c4] w-[600px] rounded-xl shadow-xl p-6">

            <div className="flex justify-between mb-4">

              <h2 className="text-lg font-semibold text-[#1f2a1f]">
                Low Stock Products
              </h2>

              <button
                onClick={()=>setShowLowStockModal(false)}
                className="text-[#1f2a1f] font-bold"
              >
                ✕
              </button>

            </div>

            <table className="w-full text-sm">

              <thead className="bg-[#b9cbb9] text-[#1f2a1f]">

                <tr>
                  <th className="py-2 text-center">Product</th>
                  <th className="py-2 text-center">Category</th>
                  <th className="py-2 text-center">Stock</th>
                </tr>

              </thead>

              <tbody>

                {lowStockProducts.map((p:any)=>(

                  <tr
                    key={p.id}
                    className="border-b border-[#c4d3c4] hover:bg-[#d8e4d8]"
                  >

                    <td className="py-2 text-center text-[#1f2a1f] font-medium">{p.name}</td>
                    <td className="py-2 text-center text-[#1f2a1f]">{p.category.name}</td>
                    <td className="py-2 text-center font-semibold text-[#7a1f1f] bg-[#f3c6c6] rounded-md">
                      {p.stock}
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