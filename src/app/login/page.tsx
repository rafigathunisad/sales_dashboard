"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (!res?.error) {
      const session = await fetch("/api/auth/session").then((r) => r.json())

      if (session.user.role === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}