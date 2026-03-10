"use server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function createUser(name: string, email: string, pass: string) {
    try {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return { success: false, error: "A user with this email already exists." }
        }

        const hashed = await bcrypt.hash(pass, 10)
        await prisma.user.create({
            data: { name, email, password: hashed, role: "USER" }
        })

        return { success: true }
    } catch {
        return { success: false, error: "Failed to create user." }
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            where: { role: "USER" },
            select: { id: true, name: true, email: true, createdAt: true }
        });
        return { success: true, users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users." };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete user." };
    }
}

export async function getDashboardStats() {
    try {
        const now = new Date()

        // Start of today (midnight)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // Start of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        // Daily sales (orders placed today)
        const dailyOrders = await prisma.order.findMany({
            where: { createdAt: { gte: startOfToday } }
        })
        const dailySalesCount = dailyOrders.length
        const dailySalesRevenue = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0)

        // Monthly sales (orders placed this month)
        const monthlyOrders = await prisma.order.findMany({
            where: { createdAt: { gte: startOfMonth } }
        })
        const monthlySalesCount = monthlyOrders.length
        const monthlySalesRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0)

        // Total revenue (all orders ever)
        const allOrders = await prisma.order.findMany()
        const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0)

        // Best selling product (by total quantity sold across all order items)
        const bestSellingRaw = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 1,
        })
        let bestSellingProduct = { name: "N/A", totalSold: 0 }
        if (bestSellingRaw.length > 0) {
            const product = await prisma.product.findUnique({ where: { id: bestSellingRaw[0].productId } })
            bestSellingProduct = {
                name: product?.name || "N/A",
                totalSold: bestSellingRaw[0]._sum.quantity || 0,
            }
        }

        // Low selling product (by total quantity sold — least)
        const lowSellingRaw = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'asc' } },
            take: 1,
        })
        let lowSellingProduct = { name: "N/A", totalSold: 0 }
        if (lowSellingRaw.length > 0) {
            const product = await prisma.product.findUnique({ where: { id: lowSellingRaw[0].productId } })
            lowSellingProduct = {
                name: product?.name || "N/A",
                totalSold: lowSellingRaw[0]._sum.quantity || 0,
            }
        }

        return {
            success: true,
            stats: {
                dailySalesCount,
                dailySalesRevenue,
                monthlySalesCount,
                monthlySalesRevenue,
                totalRevenue,
                bestSellingProduct,
                lowSellingProduct,
            }
        }
    } catch (error) {
        return { success: false, stats: null }
    }
}
