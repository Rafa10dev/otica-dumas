import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const { id } = await context.params; const body = await request.json(); const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ error: 'Informe o nome da categoria.' }, { status: 400 });
  const slug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  try { return NextResponse.json(await prisma.category.update({ where: { id }, data: { name, slug } })); } catch { return NextResponse.json({ error: 'Não foi possível atualizar a categoria.' }, { status: 409 }); }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const { id } = await context.params; const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!category) return NextResponse.json({ error: 'Categoria não encontrada.' }, { status: 404 });
  if (category._count.products > 0) return NextResponse.json({ error: 'Não é possível remover uma categoria com produtos vinculados.' }, { status: 409 });
  await prisma.category.delete({ where: { id } }); return NextResponse.json({ success: true });
}
