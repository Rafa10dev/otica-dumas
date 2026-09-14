import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const categories =
      await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    return NextResponse.json(
      categories,
    );
  } catch (error) {
    console.error(
      'Erro ao buscar categorias:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Não foi possível buscar as categorias.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!name || !slug) return NextResponse.json({ error: 'Informe o nome da categoria.' }, { status: 400 });
  try { return NextResponse.json(await prisma.category.create({ data: { name, slug } }), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Já existe uma categoria com esse nome.' }, { status: 409 }); }
}
