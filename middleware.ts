import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Always allow auth pages
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Protect all API routes except auth routes
  if (pathname.startsWith('/api/')) {
    // Allow all NextAuth routes (includes /api/auth/*)
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    // Require authentication for all other API routes
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect all other pages (require authentication)
  // This includes: /, /notice, /notice/*, etc.
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
