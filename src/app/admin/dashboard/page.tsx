"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createUser, getUsers, deleteUser } from "./actions"

export default function AdminDashboard() {
    const [modalOpen, setModalOpen] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)

    async function loadUsers() {
        setLoadingUsers(true)
        const res = await getUsers()
        if (res.success && res.users) setUsers(res.users)
        setLoadingUsers(false)
    }

    useEffect(() => { loadUsers() }, [])

    async function handleDelete(id: string) {
        if (!confirm("Delete this user?")) return
        const res = await deleteUser(id)
        if (res.success) loadUsers()
        else alert(res.error || "Could not delete user")
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setStatus(null)

        const res = await createUser(name, email, password)

        if (res.success) {
            setStatus({ ok: true, msg: "User created!" })
            setName("")
            setEmail("")
            setPassword("")
            loadUsers()
            setTimeout(() => { setModalOpen(false); setStatus(null) }, 1500)
        } else {
            setStatus({ ok: false, msg: res.error || "Something went wrong" })
        }

        setSaving(false)
    }


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
            <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
                <div className="text-xl font-bold">Admin Dashboard</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-green-600 font-semibold">Online</span>
                    <Link
                        href="/admin/login"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Logout
                    </Link>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow-sm"
                    >
                        + Create User
                    </button>
                </div>

                <div className="bg-white rounded shadow p-4">
                    {loadingUsers ? (
                        <p className="text-gray-500">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="text-gray-500">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 font-semibold text-gray-700">Name</th>
                                        <th className="py-2 px-4 font-semibold text-gray-700">Email</th>
                                        <th className="py-2 px-4 font-semibold text-gray-700 w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3 px-4">{user.name || "N/A"}</td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
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
                    )}
                </div>
            </main>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white w-full max-w-md rounded shadow-lg">
                        <div className="flex justify-between items-center border-b p-4">
                            <h2 className="text-lg font-bold">Create New User</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-4 space-y-4">
                            {status && (
                                <div className={`p-3 text-sm rounded border ${status.ok
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                    }`}>
                                    {status.msg}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || !name || !email || !password}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
