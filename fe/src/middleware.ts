import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("rental_token")?.value;

  // Jika mencoba akses /admin tanpa token, redirect langsung ke /login
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah punya token dan membuka /login, alihkan langsung ke /admin
  if (request.nextUrl.pathname === "/login") {
    if (token) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
