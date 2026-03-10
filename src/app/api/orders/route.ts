import { NextResponse } from "next/server"
import { createOrder } from "@/features/orders/services/orderService"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { userId, items } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      )
    }

    const order = await createOrder(userId, items)

    return NextResponse.json(order)

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

}


export async function GET() {

  try {

    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(orders)

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }

}