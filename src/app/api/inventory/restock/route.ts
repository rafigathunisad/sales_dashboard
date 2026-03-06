import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const { productId, quantity } = await req.json()

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: {
        increment: quantity
      }
    }
  })

  return NextResponse.json(updatedProduct)
}