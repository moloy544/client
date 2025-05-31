import { cookies as cookie } from "next/headers";
import { NextResponse } from "next/server";

const blockHosts = [
  "visitsydenham.uk",
  "www.visitsydenham.uk"
];

export async function middleware(req) {
  const hostname = req.nextUrl.hostname;

  // Block if hostname is in blockHosts array
  if (blockHosts.includes(hostname)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  const path = req.nextUrl.pathname;
  const cookies = cookie();

  // Publisher login cookie
  const publisherCookie = cookies.get('moviesbazar_publisher');

  // DMCA admin login cookie
  const dmcaAdminCookie = cookies.get('dmca_admin_token');

  // 🔒 Protect publisher routes
  if (path.startsWith("/publisher")) {
    if (!publisherCookie && path !== "/publisher/login") {
      return NextResponse.redirect(new URL('/publisher/login', req.url));
    }
    if (publisherCookie && path === "/publisher/login") {
      return NextResponse.redirect(new URL('/publisher', req.url));
    }
  }

  // 🔒 Protect DMCA admin routes
  if (path.startsWith("/dmca-admin")) {
    if (!dmcaAdminCookie && path !== "/dmca-admin/login") {
      return NextResponse.redirect(new URL('/dmca-admin/login', req.url));
    }
    if (dmcaAdminCookie && path === "/dmca-admin/login") {
      return NextResponse.redirect(new URL('/dmca-admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/publisher/:path*', '/dmca-admin/:path*', '/:path*'], // Apply middleware globally
};
