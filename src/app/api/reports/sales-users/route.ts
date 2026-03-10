import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const sortBy = searchParams.get("sortBy") || "revenue"
  const limit = parseInt(searchParams.get("limit") || "5")

  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        orders: {
          include: { items: true },
        },
      },
    })

    const result = users.map((u) => ({
      id: u.id,
      name: u.name || u.email,
      ordersProcessed: u.orders.length,
      revenueGenerated: u.orders.reduce((s, o) => s + o.totalAmount, 0),
    }))

    if (sortBy === "orders") {
      result.sort((a, b) => b.ordersProcessed - a.ordersProcessed)
    } else {
      result.sort((a, b) => b.revenueGenerated - a.revenueGenerated)
    }

    const limited = search ? result : result.slice(0, limit)

    return NextResponse.json(limited)
  } catch {
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
