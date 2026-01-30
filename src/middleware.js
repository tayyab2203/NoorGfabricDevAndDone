import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const adminRoles = ["ADMIN", "MANAGER"];

export default auth((req) => {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin")) {
    if (!req.auth?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path || "/admin");
      return NextResponse.redirect(loginUrl);
    }
    if (!adminRoles.includes(req.auth.user.role)) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", "/admin");
      loginUrl.searchParams.set("error", "Forbidden");
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
