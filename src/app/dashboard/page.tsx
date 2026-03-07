"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function UserDashboard() {
    const { data: session, status } = useSession()

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
            <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
                <div className="text-xl font-bold">User Dashboard</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 font-medium">
                        {status === "loading" ? "Loading..." : session?.user?.name || "User"}
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Welcome Back</h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-600 mb-6">
                        This is your main dashboard workspace.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded border border-gray-200 border-dashed bg-gray-50 flex items-center justify-center text-gray-500 min-h-[150px]">
                            Widget Space
                        </div>
                        <div className="p-4 rounded border border-gray-200 border-dashed bg-gray-50 flex items-center justify-center text-gray-500 min-h-[150px]">
                            Widget Space
                        </div>
                        <div className="p-4 rounded border border-gray-200 border-dashed bg-gray-50 flex items-center justify-center text-gray-500 min-h-[150px]">
                            Widget Space
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
