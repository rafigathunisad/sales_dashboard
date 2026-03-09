"use client"

import { useSession } from "next-auth/react"
import UserPage from "@/features/dashboard/user_page"
import { UserNavBar } from "@/components/DashboardNavBar"

export default function UserDashboard() {
    const { data: session, status } = useSession()

    const userId = (session?.user as any)?.id || ""

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <UserNavBar />

            {/* Top Action Bar */}
            <div className="w-full bg-white border-b border-gray-100 px-6 lg:px-8 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                        {status === "loading" ? "Loading..." : `Welcome, ${session?.user?.name || "User"}`}
                    </span>
                </div>
            </div>

            <main className="flex-1 w-full">
                <UserPage userId={userId} />
            </main>
        </div>
    )
}
