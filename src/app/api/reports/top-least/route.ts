import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "products"
  const sortBy = searchParams.get("sortBy") || "quantity"

  try {
    const items = await prisma.orderItem.findMany({
      include: {
        product: { include: { category: true } },
      },
    })

    const map = new Map<number, { name: string; category: string; quantity: number; revenue: number }>()

    for (const item of items) {
      const key = item.productId
      const existing = map.get(key)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        map.set(key, {
          name: category === "categories" ? item.product.category.name : item.product.name,
          category: item.product.category.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        })
      }
    }

    let aggregated = Array.from(map.values())

    if (category === "categories") {
      const catMap = new Map<string, { name: string; category: string; quantity: number; revenue: number }>()
      for (const item of aggregated) {
        const existing = catMap.get(item.category)
        if (existing) {
          existing.quantity += item.quantity
          existing.revenue += item.revenue
        } else {
          catMap.set(item.category, { ...item, name: item.category })
        }
      }
      aggregated = Array.from(catMap.values())
    }

    const sortField = sortBy === "revenue" ? "revenue" : "quantity"

    const top10 = [...aggregated].sort((a, b) => b[sortField] - a[sortField]).slice(0, 10)
    const least10 = [...aggregated].sort((a, b) => a[sortField] - b[sortField]).slice(0, 10)

    return NextResponse.json({ top10, least10 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch top/least data" }, { status: 500 })
  }
}
