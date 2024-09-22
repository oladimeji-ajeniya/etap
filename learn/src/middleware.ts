import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token');

  const protectedPaths = ['/dashboard', '/subject', '/topic'];

  // Check if the request is for a protected path
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !token) {
    // Redirect to login page if token is not present
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/subject/:path*', '/topic/:path*'],
};
