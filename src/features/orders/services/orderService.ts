import { prisma } from "@/lib/prisma"
import { calculateTotal } from "../utils/calculateTotal"
import { OrderItemInput } from "../types"
import { Prisma } from "@prisma/client"

type ProductType = Awaited<ReturnType<typeof prisma.product.findMany>>[number]

export async function createOrder(userId: string, items: OrderItemInput[]) {

  const productIds = items.map(item => item.productId)

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    }
  })

  for (const item of items) {

    const product = products.find((p: ProductType) => p.id === item.productId)

    if (!product) {
      throw new Error("Product not found")
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for product ${product.name}`)
    }

  }

  const total = calculateTotal(items, products)

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount: total
      }
    })

    for (const item of items) {

      const product = products.find((p: ProductType) => p.id === item.productId)!

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        }
      })

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })

    }

    return newOrder
  })

  return order
}