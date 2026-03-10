import { OrderItemInput } from "../types"

export function calculateTotal(items: OrderItemInput[], products: any[]) {

  let total = 0

  for (const item of items) {

    const product = products.find((p: any) => p.id === item.productId)

    if (product) {
      total += product.price * item.quantity
    }

  }

  return total
}