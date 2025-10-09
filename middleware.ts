import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isLoginOrRegister =
    request.nextUrl.pathname.startsWith('/dashboard/login') ||
    request.nextUrl.pathname.startsWith('/dashboard/register') ||
    request.nextUrl.pathname.startsWith('/admin/login') ||
    request.nextUrl.pathname.startsWith('/admin/register');

  if ((isDashboard || isAdmin) && !token && !isLoginOrRegister) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path((?!login|register).*)',
    '/admin/:path((?!login|register).*)',
  ],
};