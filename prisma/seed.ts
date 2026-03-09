import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log("Clearing existing data...")
  await prisma.restockHistory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log("Seeding users...")
  const hashedPassword = await bcrypt.hash("password123", 10)

  const usersData = [
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Smith", email: "bob@example.com" },
    { name: "Charlie Brown", email: "charlie@example.com" },
    { name: "Diana Prince", email: "diana@example.com" },
    { name: "Ethan Hunt", email: "ethan@example.com" },
    { name: "Fiona Green", email: "fiona@example.com" },
    { name: "George Miller", email: "george@example.com" },
    { name: "Hannah Lee", email: "hannah@example.com" },
    { name: "Ivan Torres", email: "ivan@example.com" },
    { name: "Julia Chen", email: "julia@example.com" },
  ]

  const users = []
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, password: hashedPassword, role: "USER" },
    })
    users.push(user)
  }
  console.log(`  Created ${users.length} users (password: password123)`)

  console.log("Seeding categories...")
  const categoryNames = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books", "Toys", "Beauty", "Food & Beverages"]
  const categories = []
  for (const name of categoryNames) {
    const cat = await prisma.category.create({ data: { name } })
    categories.push(cat)
  }
  console.log(`  Created ${categories.length} categories`)

  console.log("Seeding products...")
  const productsData: { name: string; description: string; price: number; stock: number; catIndex: number }[] = [
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99, stock: 150, catIndex: 0 },
    { name: "Mechanical Keyboard", description: "RGB mechanical keyboard", price: 89.99, stock: 80, catIndex: 0 },
    { name: "USB-C Hub", description: "7-in-1 USB-C hub", price: 45.00, stock: 120, catIndex: 0 },
    { name: "Monitor Stand", description: "Adjustable monitor stand", price: 35.00, stock: 60, catIndex: 0 },
    { name: "Webcam HD", description: "1080p HD webcam", price: 55.00, stock: 90, catIndex: 0 },
    { name: "Bluetooth Speaker", description: "Portable bluetooth speaker", price: 40.00, stock: 5, catIndex: 0 },
    { name: "Cotton T-Shirt", description: "100% cotton crew neck", price: 19.99, stock: 200, catIndex: 1 },
    { name: "Denim Jeans", description: "Slim fit denim jeans", price: 49.99, stock: 100, catIndex: 1 },
    { name: "Running Shoes", description: "Lightweight running shoes", price: 79.99, stock: 70, catIndex: 1 },
    { name: "Winter Jacket", description: "Insulated winter jacket", price: 120.00, stock: 40, catIndex: 1 },
    { name: "Leather Belt", description: "Genuine leather belt", price: 25.00, stock: 8, catIndex: 1 },
    { name: "Coffee Maker", description: "Drip coffee maker 12-cup", price: 65.00, stock: 55, catIndex: 2 },
    { name: "Blender", description: "High-speed blender", price: 50.00, stock: 45, catIndex: 2 },
    { name: "Toaster", description: "4-slice toaster", price: 30.00, stock: 75, catIndex: 2 },
    { name: "Cookware Set", description: "Non-stick 10-piece set", price: 99.99, stock: 30, catIndex: 2 },
    { name: "Vacuum Cleaner", description: "Bagless upright vacuum", price: 149.99, stock: 3, catIndex: 2 },
    { name: "Yoga Mat", description: "Non-slip yoga mat", price: 25.00, stock: 130, catIndex: 3 },
    { name: "Dumbbells Set", description: "Adjustable dumbbells 5-25lb", price: 110.00, stock: 35, catIndex: 3 },
    { name: "Tennis Racket", description: "Carbon fiber tennis racket", price: 75.00, stock: 50, catIndex: 3 },
    { name: "Basketball", description: "Official size basketball", price: 30.00, stock: 90, catIndex: 3 },
    { name: "Resistance Bands", description: "Set of 5 resistance bands", price: 18.00, stock: 7, catIndex: 3 },
    { name: "JavaScript Guide", description: "Complete JS reference", price: 42.00, stock: 60, catIndex: 4 },
    { name: "Python Cookbook", description: "Advanced Python recipes", price: 38.00, stock: 45, catIndex: 4 },
    { name: "Design Patterns", description: "GoF design patterns", price: 50.00, stock: 25, catIndex: 4 },
    { name: "Data Structures", description: "Algorithms & data structures", price: 55.00, stock: 30, catIndex: 4 },
    { name: "Building Blocks", description: "500-piece building set", price: 35.00, stock: 80, catIndex: 5 },
    { name: "Board Game", description: "Strategy board game", price: 28.00, stock: 65, catIndex: 5 },
    { name: "RC Car", description: "Remote control car", price: 45.00, stock: 40, catIndex: 5 },
    { name: "Puzzle 1000pc", description: "1000-piece jigsaw puzzle", price: 15.00, stock: 110, catIndex: 5 },
    { name: "Face Cream", description: "Moisturizing face cream", price: 22.00, stock: 95, catIndex: 6 },
    { name: "Shampoo", description: "Organic shampoo 500ml", price: 12.00, stock: 150, catIndex: 6 },
    { name: "Sunscreen SPF50", description: "Broad spectrum sunscreen", price: 18.00, stock: 4, catIndex: 6 },
    { name: "Organic Coffee", description: "Fair trade coffee beans 1kg", price: 16.00, stock: 200, catIndex: 7 },
    { name: "Protein Bars", description: "Box of 12 protein bars", price: 24.00, stock: 120, catIndex: 7 },
    { name: "Green Tea", description: "Japanese green tea 100 bags", price: 10.00, stock: 180, catIndex: 7 },
  ]

  const products = []
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: categories[p.catIndex].id,
      },
    })
    products.push(product)
  }
  console.log(`  Created ${products.length} products`)

  console.log("Seeding orders (spread across 2025-2026)...")
  const orderStart = new Date(2025, 0, 1)
  const orderEnd = new Date(2026, 2, 10)
  let orderCount = 0

  for (let i = 0; i < 300; i++) {
    const user = pick(users)
    const numItems = randInt(1, 4)
    const chosenProducts = new Set<number>()
    const items: { productId: number; quantity: number; price: number }[] = []

    for (let j = 0; j < numItems; j++) {
      const product = pick(products)
      if (chosenProducts.has(product.id)) continue
      chosenProducts.add(product.id)
      const qty = randInt(1, 5)
      items.push({ productId: product.id, quantity: qty, price: product.price })
    }

    if (items.length === 0) continue

    const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const createdAt = randomDate(orderStart, orderEnd)

    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: Math.round(totalAmount * 100) / 100,
        createdAt,
        items: { create: items },
      },
    })
    orderCount++
  }
  console.log(`  Created ${orderCount} orders`)

  console.log("Seeding restock history...")
  let restockCount = 0
  for (const product of products) {
    const numRestocks = randInt(1, 3)
    for (let i = 0; i < numRestocks; i++) {
      await prisma.restockHistory.create({
        data: {
          productId: product.id,
          quantity: randInt(10, 100),
          createdAt: randomDate(orderStart, orderEnd),
        },
      })
      restockCount++
    }
  }
  console.log(`  Created ${restockCount} restock records`)

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
