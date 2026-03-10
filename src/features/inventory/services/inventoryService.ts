import { prisma } from "@/lib/prisma"

export async function restockProduct(productId:number, quantity:number){

  const product = await prisma.product.update({
    where:{ id:productId },
    data:{
      stock:{ increment: quantity }
    }
  })

  await prisma.restockHistory.create({
    data:{
      productId,
      quantity
    }
  })

  return product
}