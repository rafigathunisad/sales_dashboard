import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const { productId, quantity } = await req.json()

  const result = await prisma.$transaction(async (tx) => {

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity
        }
      }
    })

    await tx.restockHistory.create({
      data: {
        productId,
        quantity
      }
    })

    return updatedProduct
  })

  return NextResponse.json(result)
}