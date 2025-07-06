import { clerkMiddleware } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { rootDomain } from "./lib/utils"

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url
  const host = request.headers.get("host") || ""
  const hostname = host.split(":")[0]

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/)
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1]
    }
    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0]
      return subdomain !== "www" ? subdomain : null
    }
    return null
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0]

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---")
    return parts.length > 0 ? parts[0] : null
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null
}

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl
  const subdomain = extractSubdomain(request)

  // Skip rewriting for API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/s/") || // Prevent infinite rewrites
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  if (subdomain) {
    console.log(`Rewriting ${pathname} to /s/${subdomain}${pathname}`)
    return NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
