import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/dashboard", "/admin"];

// Auth-only pages that a logged-in user shouldn't see again
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const userInfo = request.cookies.get("user_info")?.value;

  // Parse user info to check role
  let userRole: string | null = null;
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      userRole = parsed.role || null;
    } catch {
      // ignore parse errors
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // No token + trying to access a protected page -> redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in + trying to access login/register -> send to appropriate page
  if (isAuthRoute && token) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};