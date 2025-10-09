import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect all dashboard routes except login/register
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !token &&
    !request.nextUrl.pathname.startsWith('/dashboard/login') &&
    !request.nextUrl.pathname.startsWith('/dashboard/register')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

// Optionally, specify matcher for only dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};