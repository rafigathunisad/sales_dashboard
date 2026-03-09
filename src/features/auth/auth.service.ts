import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("User not found")

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error("Invalid password")

  return user
}
