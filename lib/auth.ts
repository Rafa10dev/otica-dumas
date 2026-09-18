import { cookies } from 'next/headers';
import {
  jwtVerify,
  SignJWT,
} from 'jose';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE =
  'otica_dumas_session';

export type AdminRole = 'ADMIN' | 'ADMIN_PRINCIPAL';

export function isAdminRole(role: string): role is AdminRole {
  return role === 'ADMIN' || role === 'ADMIN_PRINCIPAL';
}

function getSecret() {
  const secret =
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      'AUTH_SECRET não foi configurado.',
    );
  }

  return new TextEncoder().encode(
    secret,
  );
}

export async function createSession(
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  },
) {
  const token =
    await new SignJWT({
      name: user.name,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getSecret());

  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        'production',
      sameSite: 'lax',
      path: '/',
      maxAge:
        60 * 60 * 24 * 7,
    },
  );
}

export async function getSession() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE,
    )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } =
      await jwtVerify(
        token,
        getSecret(),
        {
          algorithms: ['HS256'],
        },
      );

    if (
      !payload.sub ||
      typeof payload.email !==
        'string' ||
      typeof payload.role !==
        'string'
    ) {
      return null;
    }

    return {
      id: payload.sub,
      name:
        typeof payload.name ===
        'string'
          ? payload.name
          : '',
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore =
    await cookies();

  cookieStore.delete(
    SESSION_COOKIE,
  );
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return { session: null, response: new Response('Não autenticado.', { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !user.active) {
    await destroySession();
    return { session: null, response: new Response('Acesso negado.', { status: 403 }) };
  }
  if (!isAdminRole(user.role)) return { session: null, response: new Response('Permissão insuficiente.', { status: 403 }) };
  return { session: user, response: null };
}

export async function requireAdminPrincipal() {
  const auth = await requireAdmin();
  if (auth.response) return auth;
  if (auth.session.role !== 'ADMIN_PRINCIPAL') {
    return {
      session: null,
      response: new Response('Apenas o administrador principal pode realizar esta ação.', { status: 403 }),
    };
  }
  return auth;
}
