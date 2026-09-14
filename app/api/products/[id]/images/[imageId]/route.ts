import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

async function deleteCloudinary(publicId: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME, key = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return;
  const timestamp = Math.floor(Date.now() / 1000); const signature = crypto.createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${secret}`).digest('hex');
  await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, { method: 'POST', body: new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: key, signature }) });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; imageId: string }> }) {
  const auth = await requireAdmin(); if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const { id, imageId } = await context.params; const image = await prisma.productImage.findFirst({ where: { id: imageId, productId: id } });
  if (!image) return NextResponse.json({ error: 'Imagem não encontrada.' }, { status: 404 });
  await prisma.productImage.delete({ where: { id: imageId } }); if (image.publicId) await deleteCloudinary(image.publicId); return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string; imageId: string }> }) {
  const auth = await requireAdmin(); if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const { id, imageId } = await context.params; const body = await request.json();
  if (body.primary !== true) return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
  await prisma.productImage.updateMany({ where: { productId: id }, data: { primary: false } }); const image = await prisma.productImage.update({ where: { id: imageId }, data: { primary: true } }); return NextResponse.json(image);
}
