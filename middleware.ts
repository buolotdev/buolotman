import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Check if request is targeting the admin subdomain
  const isAdminSubdomain = hostname.startsWith("admin.") || hostname.startsWith("admin-");

  if (isAdminSubdomain) {
    const pathname = url.pathname;

    // Ignore Next.js internals, static files, and APIs
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      pathname.includes(".") // e.g. favicon.ico, images, fonts
    ) {
      return NextResponse.next();
    }

    // Root on admin subdomain maps directly to Admin Dashboard
    if (pathname === "/" || pathname === "") {
      url.pathname = "/dashboard/admin";
      return NextResponse.rewrite(url);
    }

    // Admin direct routes mapping (e.g. admin.boulotman.com/users -> /dashboard/admin/users)
    const adminRoutes = [
      "users",
      "tasks",
      "verification",
      "payments",
      "disputes",
      "messages",
      "reviews",
      "support",
      "content",
      "settings",
    ];

    const firstSegment = pathname.split("/")[1];

    if (adminRoutes.includes(firstSegment)) {
      url.pathname = `/dashboard/admin${pathname}`;
      return NextResponse.rewrite(url);
    }

    // If accessing /dashboard/admin directly on admin subdomain, let it pass
    if (pathname.startsWith("/dashboard/admin")) {
      return NextResponse.next();
    }

    // Allow login / signup on admin subdomain if needed
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
