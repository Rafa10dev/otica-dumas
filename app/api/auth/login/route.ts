import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body.email === 'string'
        ? body.email
            .trim()
            .toLowerCase()
        : '';

    const password =
      typeof body.password ===
      'string'
        ? body.password
        : '';

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            'Informe o e-mail e a senha.',
        },
        {
          status: 400,
        },
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            'E-mail ou senha inválidos.',
        },
        {
          status: 401,
        },
      );
    }

    if (user.role !== 'ADMIN' && user.role !== 'ADMIN_PRINCIPAL') {
      return NextResponse.json(
        {
          error:
            'Este usuário não possui acesso administrativo.',
        },
        {
          status: 403,
        },
      );
    }

    if (!user.active) {
      return NextResponse.json({ error: 'Esta conta está desativada.' }, { status: 403 });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          error:
            'E-mail ou senha inválidos.',
        },
        {
          status: 401,
        },
      );
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  } catch (error) {
    console.error(
      '[AUTH LOGIN]',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Erro interno ao realizar login. Verifique o terminal do projeto.',
      },
      {
        status: 500,
      },
    );
  }
}
