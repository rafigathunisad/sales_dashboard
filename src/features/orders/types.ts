export type OrderItem = {
  productId: number
  quantity: number
  price: number
}

export type Order = {
  id: number
  userId: number
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}