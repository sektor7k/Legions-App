import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const publicPaths = ['/login', '/register', '/verifyemail', '/forgotpassword'];

  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - publicPaths
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|verifyemail|forgotpassword).*)',
  ],
};
