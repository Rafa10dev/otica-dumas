'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { AdminLogout } from '@/components/admin-logout';

const navigation = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Produtos', href: '/admin/produtos' },
  { label: 'Categorias', href: '/admin/categorias' },
  { label: 'Administradores', href: '/admin/administradores' },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/" className="brand admin-brand">
        <div className="brand-logo">
          <img
            src="/images/otica-dumas-logo.jpg"
            alt="Ótica Dumas"
            className="brand-logo-image"
          />
        </div>

        <div>
          <strong>ÓTICA DUMAS</strong>
          <span>Administração</span>
        </div>
      </Link>

      <nav aria-label="Navegação administrativa">
        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'active' : undefined}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        <Link href="/catalogo" target="_blank" rel="noreferrer">
          Ver site
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </nav>

      <AdminLogout />
    </aside>
  );
}
