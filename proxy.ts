import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'otica_dumas_session';

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

async function validateSession(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      SESSION_COOKIE,
    )?.value;

  if (!token) {
    return false;
  }

  const secret = getAuthSecret();

  if (!secret) {
    console.error(
      'AUTH_SECRET não configurado.',
    );

    return false;
  }

  try {
    const { payload } =
      await jwtVerify(
        token,
        secret,
        {
          algorithms: ['HS256'],
        },
      );

    return (
      Boolean(payload.sub) &&
      payload.role === 'ADMIN' &&
      typeof payload.email === 'string'
    );
  } catch {
    return false;
  }
}

export async function proxy(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  /*
   * Login sempre é público.
   */
  if (pathname === '/login' || pathname === '/admin/login') {
    return NextResponse.next();
  }

  /*
   * Somente /admin e /admin/*
   * entram na proteção.
   */
  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const authenticated =
    await validateSession(request);

  if (!authenticated) {
    const loginUrl =
      new URL(
        '/login',
        request.url,
      );

    loginUrl.searchParams.set(
      'next',
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
