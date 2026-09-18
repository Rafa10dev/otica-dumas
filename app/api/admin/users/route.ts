import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requireAdminPrincipal } from '@/lib/auth';

const PRINCIPAL_ROLE = 'ADMIN_PRINCIPAL';
const ADMIN_ROLE = 'ADMIN';
const LAST_PRINCIPAL_ERROR = 'Não é possível remover ou desativar o último administrador principal.';

async function authError(response: Response) {
  return NextResponse.json(
    { error: await response.text() },
    { status: response.status },
  );
}

async function hasOnlyOneActivePrincipal() {
  return (await prisma.user.count({
    where: { role: PRINCIPAL_ROLE, active: true },
  })) <= 1;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return authError(auth.response);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminPrincipal();
  if (auth.response) return authError(auth.response);

  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role === undefined ? ADMIN_ROLE : body.role;

  if (!name || !email || password.length < 8 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: 'Informe nome, e-mail válido e senha com ao menos 8 caracteres.' },
      { status: 400 },
    );
  }

  if (role !== ADMIN_ROLE && role !== PRINCIPAL_ROLE) {
    return NextResponse.json(
      { error: 'Nível de administrador inválido.' },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role,
      },
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Já existe um administrador com esse e-mail.' },
      { status: 409 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminPrincipal();
  if (auth.response) return authError(auth.response);

  const body = await request.json();
  if (typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Administrador inválido.' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: body.id } });
  if (!target) {
    return NextResponse.json({ error: 'Administrador não encontrado.' }, { status: 404 });
  }

  const changingRole = body.role !== undefined;
  const changingStatus = typeof body.active === 'boolean';
  if (target.id === auth.session.id && (changingRole || changingStatus)) {
    return NextResponse.json(
      { error: body.active === false ? 'Você não pode desativar a própria conta.' : 'Você não pode alterar a própria conta por esta interface.' },
      { status: 400 },
    );
  }

  if (changingRole && body.role !== ADMIN_ROLE && body.role !== PRINCIPAL_ROLE) {
    return NextResponse.json({ error: 'Nível de administrador inválido.' }, { status: 400 });
  }

  const removesActivePrincipal =
    target.role === PRINCIPAL_ROLE &&
    target.active &&
    (body.active === false || body.role === ADMIN_ROLE);

  if (removesActivePrincipal && await hasOnlyOneActivePrincipal()) {
    return NextResponse.json({ error: LAST_PRINCIPAL_ERROR }, { status: 400 });
  }

  const data: {
    name?: string;
    email?: string;
    active?: boolean;
    role?: string;
    passwordHash?: string;
  } = {};

  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
  if (typeof body.email === 'string' && body.email.trim()) data.email = body.email.trim().toLowerCase();
  if (typeof body.active === 'boolean') data.active = body.active;
  if (changingRole) data.role = body.role;
  if (typeof body.password === 'string' && body.password) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: 'A senha deve ter ao menos 8 caracteres.' }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(body.password, 12);
  }

  try {
    return NextResponse.json(await prisma.user.update({
      where: { id: target.id },
      data,
      select: { id: true, name: true, email: true, role: true, active: true },
    }));
  } catch {
    return NextResponse.json({ error: 'Não foi possível atualizar o administrador.' }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminPrincipal();
  if (auth.response) return authError(auth.response);

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Administrador inválido.' }, { status: 400 });
  if (id === auth.session.id) {
    return NextResponse.json({ error: 'Não é possível excluir a própria conta.' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: 'Administrador não encontrado.' }, { status: 404 });

  if (target.role === PRINCIPAL_ROLE && target.active && await hasOnlyOneActivePrincipal()) {
    return NextResponse.json({ error: LAST_PRINCIPAL_ERROR }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: target.id } });
  return NextResponse.json({ success: true });
}
