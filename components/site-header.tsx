'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { WhatsAppIcon } from './social-icons';
import { getWhatsAppLink } from '@/lib/whatsapp';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] =
    useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-accent" />

      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Ótica Dumas - página inicial"
          onClick={closeMenu}
        >
          <div className="brand-logo">
            <Image
              src="/images/otica-dumas-logo.jpg"
              alt="Logo da Ótica Dumas"
              width={58}
              height={58}
              priority
              className="brand-logo-image"
            />
          </div>

          <div className="brand-text">
            <strong>ÓTICA DUMAS</strong>
            <span>Pederneiras • SP</span>
          </div>
        </Link>

        <nav
          className={`main-nav ${
            menuOpen ? 'mobile-open' : ''
          }`}
          aria-label="Navegação principal"
        >
          <Link href="/" onClick={closeMenu} className={pathname === '/' ? 'active' : undefined} aria-current={pathname === '/' ? 'page' : undefined}>
            Início
          </Link>

          <Link
            href="/catalogo"
            onClick={closeMenu}
            className={pathname.startsWith('/catalogo') ? 'active' : undefined}
            aria-current={pathname.startsWith('/catalogo') ? 'page' : undefined}
          >
            Catálogo
          </Link>

          <Link href="/sobre" onClick={closeMenu} className={pathname.startsWith('/sobre') ? 'active' : undefined} aria-current={pathname.startsWith('/sobre') ? 'page' : undefined}>
            Sobre
          </Link>

          <Link
            href="/contato"
            onClick={closeMenu}
            className={pathname.startsWith('/contato') ? 'active' : undefined}
            aria-current={pathname.startsWith('/contato') ? 'page' : undefined}
          >
            Contato
          </Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          <a
            className="whatsapp-button compact desktop-whatsapp"
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label={
              menuOpen
                ? 'Fechar menu'
                : 'Abrir menu'
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
