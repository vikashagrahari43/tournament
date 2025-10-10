import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/dashboard/manageTournament',
  '/admin/dashboard/payments',
  '/admin/dashboard/roomId',
  '/admin/dashboard/team',
  '/admin/dashboard/tournament',
  '/admin/dashboard/wallet',
];
const userRoutes = [
  '/dashboard',
  '/dashboard/leaderboard',
  '/dashboard/myTournaments',
  '/dashboard/payments',
  '/dashboard/profile',
  '/dashboard/support',
  '/dashboard/team',
  '/dashboard/tournament',
];

function isProtectedRoute(path: string, routes: string[]) {
  return routes.some(route => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token using next-auth/jwt
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Admin routes protection
  if (isProtectedRoute(pathname, adminRoutes)) {
    if (!token || token.id !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // User routes protection
  if (isProtectedRoute(pathname, userRoutes)) {
    if (!token || token.id === 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};