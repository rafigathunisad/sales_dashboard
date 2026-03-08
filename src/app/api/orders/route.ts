import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

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

    let total = 0

    for (const item of items) {
      total += item.price * item.quantity
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(order)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    )
  }

}

export async function GET() {

  try {

    const orders = await prisma.order.findMany({
      include: {
        items: true
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