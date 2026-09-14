import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { requireAdmin } from '@/lib/auth';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return NextResponse.json({ error: await auth.response.text() }, { status: auth.response.status });
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return NextResponse.json({ error: 'O armazenamento de imagens não está configurado.' }, { status: 503 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || !allowed.has(file.type) || file.size > maxBytes) return NextResponse.json({ error: 'Envie JPG, PNG ou WEBP de até 5 MB.' }, { status: 400 });
  const timestamp = Math.floor(Date.now() / 1000);
  const productId = typeof form.get('productId') === 'string' ? String(form.get('productId')) : 'pending';
  const publicId = `otica-dumas/products/${productId}/${crypto.randomUUID()}`;
  const signature = crypto.createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${secret}`).digest('hex');
  const body = new FormData();
  body.append('file', file);
  body.append('api_key', key); body.append('timestamp', String(timestamp)); body.append('public_id', publicId); body.append('signature', signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
  if (!response.ok) return NextResponse.json({ error: 'Não foi possível enviar a imagem.' }, { status: 502 });
  const result = await response.json();
  return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}
