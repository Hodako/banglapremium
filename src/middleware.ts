import NextAuth from 'next-auth';
import { authOptions } from './lib/auth';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login?callbackUrl=' + pathname, req.url));
    }
    if (req.auth?.user?.role !== 'admin') {
      return Response.redirect(new URL('/unauthorized', req.url)); // Or show a 'not authorized' page
    }
    return;
  }

  // Protect account and checkout routes
  if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login?callbackUrl=' + pathname, req.url));
    }
    return;
  }
});

export const config = {
  // We are using the middleware for all routes to handle auth state,
  // but we are only protecting specific routes in the logic above.
  // The matcher is simplified to avoid complex regex and let the logic handle it.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
