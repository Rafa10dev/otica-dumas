import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
    const { searchParams } =
      new URL(request.url);

    const categoryId =
      searchParams.get('categoryId');

    const products =
      await prisma.product.findMany({
        where: categoryId
          ? { categoryId }
          : undefined,

        include: {
          category: true,

          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return NextResponse.json(products);
  } catch (error) {
    console.error(
      'Erro ao buscar produtos:',
      error,
    );

    return NextResponse.json(
      {
        error: 'Não foi possível buscar os produtos.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
    const body = await request.json();

    const {
      name,
      brand,
      description,
      categoryId,
      active = true,
      featured = false,
      imageUrl,
      images,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        {
          error:
            'Nome e categoria são obrigatórios.',
        },
        {
          status: 400,
        },
      );
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          error: 'Categoria não encontrada.',
        },
        {
          status: 404,
        },
      );
    }

    const baseSlug = slugify(name);

    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.product.findUnique({
        where: {
          slug,
        },
      })
    ) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const product =
      await prisma.product.create({
        data: {
          name: name.trim(),
          slug,
          brand: brand?.trim() || null,
          description:
            description?.trim() || null,
          active: Boolean(active),
          featured: Boolean(featured),
          categoryId,

          images: Array.isArray(images) && images.length
            ? {
                create: images.map((image: { url: string; publicId?: string; alt?: string }, index: number) => ({ url: image.url, publicId: image.publicId || null, alt: image.alt || name.trim(), position: index, primary: index === 0 })),
              }
            : imageUrl ? { create: { url: imageUrl, alt: name.trim(), position: 0, primary: true } } : undefined,
        },

        include: {
          category: true,
          images: true,
        },
      });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error(
      'Erro ao criar produto:',
      error,
    );

    return NextResponse.json(
      {
        error: 'Não foi possível criar o produto.',
      },
      {
        status: 500,
      },
    );
  }
}
