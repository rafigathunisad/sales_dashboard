import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("categoryId")

  const products = await prisma.product.findMany({
    where: categoryId
      ? { categoryId: Number(categoryId) }
      : {},
    include: {
      category: true
    }
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {

  const { name, description, price, stock, categoryId } = await req.json()

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      categoryId
    }
  })

  return NextResponse.json(product)
}