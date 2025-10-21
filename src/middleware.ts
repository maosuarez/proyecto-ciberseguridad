export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/cart", "/checkout/:path*", "/orders", "/admin/:path*"],
}
