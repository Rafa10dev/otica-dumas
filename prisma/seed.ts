import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const categories = [
  { name: 'Óculos de Grau', slug: 'oculos-de-grau' },
  { name: 'Óculos de Sol', slug: 'oculos-de-sol' },
  { name: 'Lentes', slug: 'lentes' },
  { name: 'Acessórios', slug: 'acessorios' },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: { name: category.name }, create: category });
  }
  const name = process.env.ADMIN_NAME?.trim() || 'Administrador Ótica Dumas';
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD precisam estar definidos no .env.');
  await prisma.user.upsert({ where: { email }, update: { name, active: true, role: 'ADMIN_PRINCIPAL' }, create: { name, email, passwordHash: await bcrypt.hash(password, 12), role: 'ADMIN_PRINCIPAL', active: true } });
  console.log('Seed executado com sucesso.');
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
