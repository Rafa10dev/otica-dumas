import { prisma } from '@/lib/prisma';

export async function getPublicProducts() {
  return prisma.product.findMany({ where: { active: true }, include: { category: true, images: { orderBy: { position: 'asc' } } }, orderBy: { createdAt: 'desc' } });
}

export function productImage(product: { images: { url: string; primary: boolean }[] }) {
  return product.images.find((image) => image.primary)?.url || product.images[0]?.url || '/images/product-1.svg';
}
