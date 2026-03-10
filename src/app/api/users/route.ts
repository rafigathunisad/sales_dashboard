import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ message: "Use admin dashboard to manage users." }, { status: 405 })
}