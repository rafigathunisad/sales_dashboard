"use client";

import { useEffect, useState } from "react";
import { AdminNavBar } from "@/components/DashboardNavBar";

interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }

    setName("");
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <AdminNavBar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Category Management</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 mb-8 bg-white p-4 shadow-sm rounded-lg border border-gray-200"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm">{cat.id}</td>
                  <td className="p-3 text-sm font-medium">{cat.name}</td>
                  <td className="p-3 flex gap-2">


                    <button
                      onClick={() => handleDelete(cat.id)}
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