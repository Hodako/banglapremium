import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Protect the /admin routes
  if (pathname.startsWith('/admin')) {
    // @ts-ignore
    if (!token || token.role !== 'admin') {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  // Protect account pages
  if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
    if (!token) {
        const url = new URL('/login', req.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }
  }


  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout'],
}
