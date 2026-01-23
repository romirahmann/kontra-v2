import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session_token")?.value;

  // 🔓 PUBLIC
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 🔐 PROTECT ADMIN
  if (!token && pathname.startsWith("/admin")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(url);
  }

  // // ✅ SUDAH LOGIN TAPI KE LOGIN
  // if (token && pathname === "/login") {
  //   return NextResponse.redirect(new URL("/admin", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
