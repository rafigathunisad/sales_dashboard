import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const view = searchParams.get("view") || "yearly"
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString())
  const week = parseInt(searchParams.get("week") || "1")
  const metric = searchParams.get("metric") || "quantity"

  try {
    if (view === "yearly") {
      const start = new Date(year, 0, 1)
      const end = new Date(year + 1, 0, 1)

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: start, lt: end } },
        include: { items: true },
      })

      const months = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(year, i).toLocaleString("default", { month: "short" }),
        value: 0,
      }))

      for (const order of orders) {
        const m = order.createdAt.getMonth()
        if (metric === "revenue") {
          months[m].value += order.totalAmount
        } else {
          months[m].value += order.items.reduce((s, it) => s + it.quantity, 0)
        }
      }

      return NextResponse.json(months)
    }

    if (view === "monthly") {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 1)

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: start, lt: end } },
        include: { items: true },
      })

      const daysInMonth = new Date(year, month, 0).getDate()
      const totalWeeks = Math.ceil(daysInMonth / 7)

      const weeks = Array.from({ length: totalWeeks }, (_, i) => ({
        label: `Week ${i + 1}`,
        value: 0,
      }))

      for (const order of orders) {
        const day = order.createdAt.getDate()
        const w = Math.min(Math.floor((day - 1) / 7), totalWeeks - 1)
        if (metric === "revenue") {
          weeks[w].value += order.totalAmount
        } else {
          weeks[w].value += order.items.reduce((s, it) => s + it.quantity, 0)
        }
      }

      return NextResponse.json(weeks)
    }

    if (view === "weekly") {
      const firstDay = (week - 1) * 7 + 1
      const start = new Date(year, month - 1, firstDay)
      const daysInMonth = new Date(year, month, 0).getDate()
      const lastDay = Math.min(firstDay + 6, daysInMonth)
      const end = new Date(year, month - 1, lastDay, 23, 59, 59, 999)

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { items: true },
      })

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const days: { label: string; value: number }[] = []
      for (let d = firstDay; d <= lastDay; d++) {
        const date = new Date(year, month - 1, d)
        days.push({ label: dayNames[date.getDay()], value: 0 })
      }

      for (const order of orders) {
        const d = order.createdAt.getDate() - firstDay
        if (d >= 0 && d < days.length) {
          if (metric === "revenue") {
            days[d].value += order.totalAmount
          } else {
            days[d].value += order.items.reduce((s, it) => s + it.quantity, 0)
          }
        }
      }

      return NextResponse.json(days)
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 })
  }
}
