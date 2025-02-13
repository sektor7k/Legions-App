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
  const adminPaths = ['/admin']; // /admin altı rota


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

  // 3) /admin/edittournament/... => admin veya o turnuvanın moderatörü
  //    Bu, /admin/edittournament/:id veya /admin/edittournament/:id/bracket vs. her şeyi kapsar.
  if (pathname.startsWith('/admin/edittournament/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // pathname örnekleri:
    // "/admin/edittournament/66de3cd1c307d172e943d460"
    // "/admin/edittournament/66de3cd1c307d172e943d460/bracket"
    // vs.

    // Segmentleri alalım:
    const segments = pathname.split('/').filter(Boolean);
    // segments => ["admin", "edittournament", "66de3cd1c307d172e943d460", "bracket" vs]
    // turnuva ID = segments[2]
    const tournamentId = segments[2];

    if (!tournamentId) {
      // ID yoksa not-authorized'a atabiliriz veya 404 gibi
      return NextResponse.redirect(new URL('/not-authorized', req.url));
    }

    // checkAccess API'sine istek
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/tournament/checkAccess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token.id,     // token içinde userId veya sub
          userRole: token.role,
          tournamentId
        }),
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/not-authorized', req.url));
      }

      const data = await response.json();
      if (!data.hasAccess) {
        return NextResponse.redirect(new URL('/not-authorized', req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/not-authorized', req.url));
    }
  }

  // 4) Geri kalan /admin/... path'leri => sadece global admin
  else if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/not-authorized', req.url));
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
    '/admin/:path*',
    'bet',
    '/blocked',
  ],
};
