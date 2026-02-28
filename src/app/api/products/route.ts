import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json(product);
}