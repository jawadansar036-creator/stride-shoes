import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the admin login page
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // Check for the admin session cookie
  const sessionCookie = request.cookies.get('stride_admin_session')?.value;

  // If no session cookie is present, redirect immediately to /admin/login
  if (!sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
