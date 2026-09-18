import { NextResponse } from 'next/server';
import { getSession, isAdminRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !user.active || !isAdminRole(user.role)) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({
    authenticated: true,
    user: { ...session, role: user.role },
  });
}
