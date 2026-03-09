import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { validateUser } from "@/features/auth/auth.service"

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials")

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", email: credentials.email, name: "Admin", role: "ADMIN" }
        }

        const user = await validateUser(credentials.email, credentials.password)
        return { id: user.id, email: user.email, name: user.name, role: "USER" }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.name = (user as any).name
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role
        session.user.name = (token as any).name
        ;(session.user as any).id = (token as any).id
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }