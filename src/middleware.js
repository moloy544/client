import { cookies as cookie } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const cookies = cookie();

  // getting the admin cookie
  const adminCookie = cookies.get('moviesbazar_publisher');

  // If the admin is not logged in (no cookie) and tries to access a protected route
  if (!adminCookie && path.startsWith("/publisher") && path !== "/publisher/login") {
    // redirect to admin login page
    return NextResponse.redirect(new URL('/publisher/login', req.url));
  }

  // If the admin is logged in and tries to access the login page, redirect to publisher
  if (adminCookie && path === "/publisher/login") {
    return NextResponse.redirect(new URL('/publisher', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/publisher/:path*',  // Match all publisher routes, including deeper paths
};
