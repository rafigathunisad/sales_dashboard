import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;
    const orderId = Number(id)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )

  }

}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;
    const orderId = Number(id)

    await prisma.order.delete({
      where: { id: orderId }
    })

    return NextResponse.json({
      message: "Order deleted successfully"
    })

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    )

  }

}