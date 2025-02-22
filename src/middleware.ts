// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicPaths = [
    '/login',
    '/register',
    '/verifyemail',
    '/forgotpassword',
  ];
  const restrictedPaths = ['/u', '/', '/t'];



  const { pathname } = req.nextUrl;

  // 0) Eğer kullanıcı blokluysa, /blocked sayfasına yönlendir.
  if (token && token.status === 'blocked' && pathname !== '/blocked') {
    return NextResponse.redirect(new URL('/blocked', req.url));
  }

  // 1) Public path
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 2) Restricted path
  if (restrictedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    
  }


  return NextResponse.next();
}

// Matcher
export const config = {
  matcher: [
    '/',
    '/tournament',
    '/login',
    '/register',
    '/verifyemail',
    '/forgotpassword',
    '/u/:path*',
    '/t/:path*',
    '/bet',
    '/blocked',
  ],
};
