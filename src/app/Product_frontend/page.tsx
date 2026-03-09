"use client";

import { useEffect, useState } from "react";
import { AdminNavBar } from "@/components/DashboardNavBar";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      }),
    });

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });

    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <AdminNavBar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-6 shadow-sm rounded-lg border border-gray-200 mb-8"
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded col-span-2 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-2 transition-colors"
          >
            Add Product
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm">{prod.id}</td>
                  <td className="p-3 text-sm font-medium">{prod.name}</td>
                  <td className="p-3 text-sm">${prod.price}</td>
                  <td className="p-3 text-sm">{prod.stock}</td>
                  <td className="p-3 text-sm">{prod.category?.name}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}