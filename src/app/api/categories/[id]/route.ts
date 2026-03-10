import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.category.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}