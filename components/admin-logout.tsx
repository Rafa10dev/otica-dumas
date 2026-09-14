'use client';

import { LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminLogout() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch(
        '/api/auth/logout',
        {
          method: 'POST',
        },
      );
    } catch (error) {
      console.error(
        'Erro ao fazer logout:',
        error,
      );
    } finally {
      router.replace('/login');
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className="admin-logout"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2
          size={16}
          className="spin"
        />
      ) : (
        <LogOut size={16} />
      )}

      {loading
        ? 'Saindo...'
        : 'Sair'}
    </button>
  );
}
