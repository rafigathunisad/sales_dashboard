"use client"

import { useSession, signOut } from "next-auth/react"
import UserPage from "@/features/dashboard/user_page"
import DashboardNavBar from "@/components/DashboardNavBar"

export default function UserDashboard() {
    const { data: session, status } = useSession()

    const userId = (session?.user as any)?.id || ""

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
            {/* Navigation Bar */}
            <DashboardNavBar />

            {/* Top Action Bar */}
            <div className="w-full bg-white border-b border-gray-100 px-6 lg:px-8 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                        {status === "loading" ? "Loading..." : `Welcome, ${session?.user?.name || "User"}`}
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>

            <main className="flex-1 w-full">
                <UserPage userId={userId} />
            </main>
        </div>
    )
}
