import { NextResponse, NextRequest } from 'next/server'
import { auth } from './auth';

export async function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl;
   // 🔥 Ignorer fichiers statiques et routes système
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }
  // const token = request.cookies.get("authjs.session-token")
  const user = (await auth())?.user;

   // 🔥 1. Si user connecté et sur /login → redirect dashboard
  //  console.log(token?.value)
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔐 2. Si pas connecté → redirect login
  if (!user && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If the user is authenticated, continue as normal
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  
  // const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard/settings")
  // if (isAdminRoute && user?.role !== "admin") {
  //   return NextResponse.redirect(new URL("/dashboard/unauthorized", request.url))
  // }

  // Redirect to login page if not authenticated
  // return NextResponse.redirect(new URL('/login', request.url))

  return NextResponse.next()
}

export const config = {
   matcher: ["/:path*"], 
}