import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  return NextResponse.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { name: 'asc' } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!name || !email || password.length < 8 || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Informe nome, e-mail válido e senha com ao menos 8 caracteres.' }, { status: 400 });
  try { const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12), role: 'ADMIN' }, select: { id: true, name: true, email: true, role: true, active: true } }); return NextResponse.json(user, { status: 201 }); }
  catch { return NextResponse.json({ error: 'Já existe um administrador com esse e-mail.' }, { status: 409 }); }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const body = await request.json();
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Administrador inválido.' }, { status: 400 });
  if (body.id === auth.session?.id && body.active === false) return NextResponse.json({ error: 'Você não pode desativar a própria conta.' }, { status: 400 });
  if (body.active === false && await prisma.user.count({ where: { active: true } }) <= 1) return NextResponse.json({ error: 'Pelo menos um administrador ativo deve permanecer.' }, { status: 400 });
  const data: { name?: string; email?: string; active?: boolean; passwordHash?: string } = {};
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
  if (typeof body.email === 'string' && body.email.trim()) data.email = body.email.trim().toLowerCase();
  if (typeof body.active === 'boolean') data.active = body.active;
  if (typeof body.password === 'string' && body.password) { if (body.password.length < 8) return NextResponse.json({ error: 'A senha deve ter ao menos 8 caracteres.' }, { status: 400 }); data.passwordHash = await bcrypt.hash(body.password, 12); }
  try { return NextResponse.json(await prisma.user.update({ where: { id: body.id }, data, select: { id: true, name: true, email: true, role: true, active: true } })); } catch { return NextResponse.json({ error: 'Não foi possível atualizar o administrador.' }, { status: 409 }); }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const id = new URL(request.url).searchParams.get('id');
  if (!id || id === auth.session?.id) return NextResponse.json({ error: 'Não é possível excluir a própria conta.' }, { status: 400 });
  if (await prisma.user.count({ where: { active: true } }) <= 1) return NextResponse.json({ error: 'Pelo menos um administrador ativo deve permanecer.' }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
