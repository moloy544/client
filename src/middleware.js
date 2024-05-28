import { cookies as cookie } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {

  const path = req.nextUrl.pathname;

  const cookies = cookie();

  // getting admin cookie
  const adminCookie = cookies.get('admin');

  // if admin not have admin cookie means admin is not logged
  if (!adminCookie && path === "/admin") {
    // redirect to admin login page
    return NextResponse.redirect(new URL('/admin/login', req.url))
  } else {
    return NextResponse.next();
  }

};

export const config = {
  matcher: '/admin/:path*',
}