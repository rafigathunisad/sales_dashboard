import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(params.id) },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted" });
}