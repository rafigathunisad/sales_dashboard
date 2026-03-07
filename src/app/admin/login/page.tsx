"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Invalid admin credentials")
            setIsLoading(false)
        } else {
            const session = await fetch("/api/auth/session").then(r => r.json())
            if (session?.user?.role === "ADMIN") {
                router.push("/admin/dashboard")
            } else {
                setError("Access denied. This login is for admins only.")
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-4">
            <div className="w-full max-w-sm bg-white border-t-4 border-red-600 shadow-sm rounded-lg p-6">

                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-xl font-bold text-red-600">Admin Login</h1>
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                        User Login
                    </Link>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Identifier
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full mt-4 py-2 px-4 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Authorizing..." : "Authorize Access"}
                    </button>
                </form>
            </div>
        </div>
    )
}
