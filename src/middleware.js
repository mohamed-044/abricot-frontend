import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return new TextEncoder().encode(secret)
}

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')

  let isValidToken = false

  if (token) {
    try {
      await jwtVerify(token, getJwtSecret())
      isValidToken = true
    } catch {
      isValidToken = false
    }
  }

  if (!isValidToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isValidToken && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)).*)'],
}