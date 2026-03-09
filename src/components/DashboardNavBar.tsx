"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  ShoppingBag,
  PackagePlus,
  LogOut,
} from "lucide-react"

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

function NavBar({
  brand,
  brandColor,
  accentColor,
  links,
  logoutUrl,
}: {
  brand: string
  brandColor: string
  accentColor: string
  links: NavItem[]
  logoutUrl: string
}) {
  const pathname = usePathname() || ""

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-6">
            <span className={`text-xl font-bold tracking-tight ${brandColor}`}>
              {brand}
            </span>

            <div className="hidden sm:flex items-center gap-1">
              {links.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.path || pathname.startsWith(item.path + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? `${accentColor} bg-gray-100`
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => signOut({ callbackUrl: logoutUrl })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden border-t border-gray-200 py-2 space-y-1 px-2">
        {links.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/")
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? `${accentColor} bg-gray-100`
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

const adminLinks: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Restock", path: "/inventory/restock", icon: PackagePlus },
  { name: "Products", path: "/Product_frontend", icon: ShoppingBag },
  { name: "Categories", path: "/categories_frontend", icon: Tag },
]

export function AdminNavBar() {
  return (
    <NavBar
      brand="SalesPro Admin"
      brandColor="text-red-600"
      accentColor="text-gray-900"
      links={adminLinks}
      logoutUrl="/admin/login"
    />
  )
}

const userLinks: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
]

export function UserNavBar() {
  return (
    <NavBar
      brand="SalesPro"
      brandColor="text-blue-600"
      accentColor="text-gray-900"
      links={userLinks}
      logoutUrl="/"
    />
  )
}

export default function DashboardNavBar() {
  return <UserNavBar />
}
