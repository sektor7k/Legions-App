import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicPaths = ['/landingpage', '/login', '/register', '/verifyemail', '/forgotpassword'];
  const restrictedPaths = ['/u','/']; // /u altında başlayan tüm yolları kontrol edeceğiz

  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (restrictedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/landingpage',
    '/login',
    '/register',
    '/verifyemail',
    '/forgotpassword',
    '/u/:path*', // /u altında başlayan tüm yolları kontrol edeceğiz
  ],
};