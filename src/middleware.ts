// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const currentPath = request.nextUrl.pathname;

  // If visiting login or root
  if (currentPath === "/login" || currentPath === "/") {
    if (token) {
      try {
        const userInfo = jwtDecode<DecodedToken>(token);

        // Check token validity
        if (userInfo.exp && userInfo.exp * 1000 >= Date.now()) {
          if (userInfo.role?.toUpperCase() === 'ADMIN' || userInfo.role?.toUpperCase() === 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        }
      } catch {
        // Invalid token, allow to access login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect /dashboard/admin routes
  if (currentPath.startsWith("/dashboard/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const userInfo = jwtDecode<DecodedToken>(token);

      // Token expired → redirect login
      if (userInfo.exp && userInfo.exp * 1000 < Date.now()) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (userInfo.role?.toUpperCase() !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};


{/*
  import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const currentPath = request.nextUrl.pathname;

  // Allow access to public routes (/, /login)
  if (currentPath === '/' || currentPath === '/login') {
    if (token) {
      try {
        const userInfo = jwtDecode<DecodedToken>(token);

        // Check token validity
        if (userInfo.exp && userInfo.exp * 1000 >= Date.now()) {
          if (userInfo.role?.toUpperCase() === 'ADMIN' || userInfo.role?.toUpperCase() === 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        }
      } catch {
        // Invalid token, allow access to login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (currentPath.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userInfo = jwtDecode<DecodedToken>(token);

      // Token expired → redirect to login
      if (userInfo.exp && userInfo.exp * 1000 < Date.now()) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const role = userInfo.role?.toUpperCase();

      // Restrict /dashboard/categories and /dashboard/materials to ADMIN and SUPER_ADMIN
      if (
        currentPath.startsWith('/dashboard/categories') ||
        currentPath.startsWith('/dashboard/materials')
      ) {
        if (!role || !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      // Restrict /dashboard/admin to ADMIN only
      else if (currentPath.startsWith('/dashboard/admin')) {
        if (!role || role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
  */}