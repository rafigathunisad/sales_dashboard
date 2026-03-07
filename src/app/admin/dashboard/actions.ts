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
