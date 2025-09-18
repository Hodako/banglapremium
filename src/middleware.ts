
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login?callbackUrl=' + pathname, req.url));
    }
    // The role is checked on the session object which is populated by the jwt callback
    if (req.auth?.user && (req.auth.user as any).role !== 'admin') {
      return Response.redirect(new URL('/unauthorized', req.url));
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
