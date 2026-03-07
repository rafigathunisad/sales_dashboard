import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("categoryId")

  const products = await prisma.product.findMany({
    where: {
      categoryId: Number(categoryId)
    }
  })

  return NextResponse.json(products)

}