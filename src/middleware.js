import { cookies as cookie } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const cookies = cookie();

  // Publisher login cookie
  const publisherCookie = cookies.get('moviesbazar_publisher');

  // DMCA admin login cookie
  const dmcaAdminCookie = cookies.get('dmca_admin_token');

  // 🔒 Protect publisher routes
  if (path.startsWith("/publisher")) {
    // If not logged in and not on login page
    if (!publisherCookie && path !== "/publisher/login") {
      return NextResponse.redirect(new URL('/publisher/login', req.url));
    }
    // If logged in and tries to access login page again
    if (publisherCookie && path === "/publisher/login") {
      return NextResponse.redirect(new URL('/publisher', req.url));
    }
  }
  return NextResponse.next();
}

// ✅ Apply to both paths
export const config = {
  matcher: ['/publisher/:path*'],
};
