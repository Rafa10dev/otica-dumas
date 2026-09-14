import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

function getImageUrl(
  product: {
    images: {
      url: string;
      primary: boolean;
      position: number;
    }[];
  },
) {
  return (
    product.images.find(
      (image) => image.primary,
    )?.url ||
    product.images[0]?.url ||
    null
  );
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error: 'Produto não encontrado.',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      ...product,
      imageUrl: getImageUrl(product),
    });
  } catch (error) {
    console.error(
      'Erro ao buscar produto:',
      error,
    );

    return NextResponse.json(
      {
        error: 'Não foi possível buscar o produto.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
    const { id } = await context.params;

    const body = await request.json();

    const {
      name,
      brand,
      description,
      categoryId,
      active,
      featured,
      imageUrl,
    } = body;

    const existing =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: 'Produto não encontrado.',
        },
        {
          status: 404,
        },
      );
    }

    if (categoryId) {
      const category =
        await prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        });

      if (!category) {
        return NextResponse.json(
          {
            error:
              'Categoria não encontrada.',
          },
          {
            status: 404,
          },
        );
      }
    }

    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          name:
            typeof name === 'string'
              ? name.trim()
              : existing.name,

          brand:
            typeof brand === 'string'
              ? brand.trim() || null
              : existing.brand,

          description:
            typeof description === 'string'
              ? description.trim() || null
              : existing.description,

          categoryId:
            categoryId || existing.categoryId,

          active:
            active !== undefined
              ? Boolean(active)
              : existing.active,

          featured:
            featured !== undefined
              ? Boolean(featured)
              : existing.featured,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });

    if (imageUrl !== undefined) {
      const firstImage =
        existing.images[0];

      if (!imageUrl) {
        if (firstImage) {
          await prisma.productImage.delete({
            where: {
              id: firstImage.id,
            },
          });
        }
      } else if (firstImage) {
        await prisma.productImage.update({
          where: {
            id: firstImage.id,
          },

          data: {
            url: imageUrl,
          },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: imageUrl,
            alt:
              typeof name === 'string'
                ? name.trim()
                : existing.name,
            primary: true,
            position: 0,
          },
        });
      }
    }

    const updated =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      'Erro ao atualizar produto:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Não foi possível atualizar o produto.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
    const { id } = await context.params;

    const existing =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: 'Produto não encontrado.',
        },
        {
          status: 404,
        },
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Erro ao excluir produto:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Não foi possível excluir o produto.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const { id } = await context.params;
  const body = await request.json();
  if (typeof body.url !== 'string' || !body.url.startsWith('http')) return NextResponse.json({ error: 'Imagem inválida.' }, { status: 400 });
  const count = await prisma.productImage.count({ where: { productId: id } });
  const image = await prisma.productImage.create({ data: { productId: id, url: body.url, publicId: body.publicId || null, alt: body.alt || null, position: count, primary: count === 0 } });
  return NextResponse.json(image, { status: 201 });
}
