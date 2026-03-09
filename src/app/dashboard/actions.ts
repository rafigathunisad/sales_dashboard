"use server"
import { prisma } from "@/lib/prisma"

export async function getUserDashboardStats(userId: string) {
    try {
        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        // User's daily orders
        const dailyOrders = await prisma.order.findMany({
            where: { userId, createdAt: { gte: startOfToday } }
        })
        const dailySalesCount = dailyOrders.length
        const dailySalesRevenue = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0)

        // User's monthly orders
        const monthlyOrders = await prisma.order.findMany({
            where: { userId, createdAt: { gte: startOfMonth } }
        })
        const monthlySalesCount = monthlyOrders.length
        const monthlySalesRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0)

        // User's recent orders (last 10)
        const recentOrders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        // Total orders for user
        const totalOrders = await prisma.order.count({ where: { userId } })
        const totalSpent = await prisma.order.findMany({ where: { userId } })
        const totalSpentAmount = totalSpent.reduce((sum, o) => sum + o.totalAmount, 0)

        // Low stock products (stock < 10)
        const lowStockProducts = await prisma.product.findMany({
            where: { stock: { lt: 10 } },
            include: { category: true },
            orderBy: { stock: 'asc' },
        })

        return {
            success: true,
            stats: {
                dailySalesCount,
                dailySalesRevenue,
                monthlySalesCount,
                monthlySalesRevenue,
                totalOrders,
                totalSpentAmount,
                recentOrders: recentOrders.map(o => ({
                    id: o.id,
                    totalAmount: o.totalAmount,
                    createdAt: o.createdAt.toISOString(),
                    itemCount: o.items.length,
                    items: o.items.map(i => ({
                        productName: i.product.name,
                        quantity: i.quantity,
                        price: i.price,
                    }))
                })),
                lowStockProducts: lowStockProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    stock: p.stock,
                    category: p.category.name,
                })),
            }
        }
    } catch (error) {
        return { success: false, stats: null }
    }
}
