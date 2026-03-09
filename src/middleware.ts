import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// routes anyone can visit without a session
const publicPaths = ["/", "/admin/login"]

// routes only ADMIN can access
const adminPaths = [
    "/admin/dashboard",
    "/Product_frontend",
    "/categories_frontend",
    "/inventory",
]

// routes only USER can access
const userPaths = ["/dashboard"]

function matchesAny(pathname: string, paths: string[]) {
    return paths.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    )
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    console.log("middleware hit:", pathname)

    // let public pages and static assets through
    if (
        matchesAny(pathname, publicPaths) ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next()
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // no token → redirect to login
    if (!token) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = "/"
        return NextResponse.redirect(loginUrl)
    }

    const role = (token.role as string) || ""

    // ---------- API routes ----------
    if (pathname.startsWith("/api/")) {
        // any authenticated user can read
        if (req.method === "GET") return NextResponse.next()

        // only admin can write (POST/PUT/DELETE)
        if (role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }
        return NextResponse.next()
    }

    // ---------- Page routes ----------
    if (matchesAny(pathname, adminPaths)) {
        if (role !== "ADMIN") {
            const url = req.nextUrl.clone()
            url.pathname = "/"
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    if (matchesAny(pathname, userPaths)) {
        if (role !== "USER" && role !== "ADMIN") {
            const url = req.nextUrl.clone()
            url.pathname = "/"
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    // any other route: authenticated users only (checked above)
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/:path*",
    ],
}

