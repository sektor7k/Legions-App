import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicPaths = ['/landingpage', '/login', '/register', '/verifyemail', '/forgotpassword'];
  const restrictedPaths = ['/u','/','/t']; // /u altında başlayan tüm yolları kontrol edeceğiz
  const adminPaths = ['/admin'];
  const enterUsernamePath = '/enter-username';


  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (restrictedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (!token.username && pathname !== enterUsernamePath) {
      return NextResponse.redirect(new URL('/enter-username', req.url));
    }
  }

  // Admin kontrolü yapılması gereken yollar
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // Eğer token yoksa veya token'daki kullanıcı admin değilse yönlendir
    if (!token || !token.isAdmin) {
      return NextResponse.redirect(new URL('/not-authorized', req.url));
    }
  }

  if (pathname === enterUsernamePath && token?.username) {
    return NextResponse.redirect(new URL('/', req.url)); // Ana sayfaya veya istediğiniz sayfaya yönlendirin
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/tournament',
    '/landingpage',
    '/login',
    '/register',
    '/verifyemail',
    '/forgotpassword',
    '/u/:path*',
    '/t/:path*',
    '/admin/:path*',
    '/enter-username',
  ],
};