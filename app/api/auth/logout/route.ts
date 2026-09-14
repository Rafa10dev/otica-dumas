import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Erro ao sair:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Não foi possível encerrar a sessão.',
      },
      { status: 500 },
    );
  }
}