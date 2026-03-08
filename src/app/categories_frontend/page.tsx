"use client";

import { useEffect, useState } from "react";

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 mb-8 bg-white p-4 shadow rounded-lg"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}