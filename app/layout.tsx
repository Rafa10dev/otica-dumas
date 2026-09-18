import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { socialLinks } from '@/lib/social-links';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, ThreadsIcon, WhatsAppIcon } from '@/components/social-icons';
import { ThemeProvider } from '@/components/theme-provider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Ótica Dumas | Pederneiras - SP',
  icons: {
    icon: '/images/logodumassemfundo.png',
  },
  description:
    'Ótica Dumas em Pederneiras - SP. Armações, lentes, multifocais, lentes solares, ajustes e reparos especializados.',
  openGraph: {
    title: 'Ótica Dumas | Pederneiras - SP',
    description:
      'Valorizando sua visão.',
    type: 'website',
    url: 'https://www.instagram.com/otica.dumas/',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('otica-dumas-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()` }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteHeader />

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-top">
                <Link
                  href="/login"
                  className="footer-logo-link"
                  aria-label="Acessar área administrativa"
                >
                  <div className="footer-logo">
                    <img
                      src="/images/otica-dumas-logo.jpg"
                      alt="Ótica Dumas"
                    />
                  </div>
                </Link>

                <div>
                  <strong>ÓTICA DUMAS</strong>
                  <span>Pederneiras • SP</span>
                </div>
              </div>

              <p>
                Valorizando sua visão.
              </p>

              <p>
                Lentes prontas e surfaçadas, multifocais,
                solares, armações, ajustes e reparos
                especializados.
              </p>
            </div>

            <div className="footer-column">
              <h3>Navegação</h3>

              <Link href="/">Início</Link>
              <Link href="/catalogo">Catálogo</Link>
              <Link href="/sobre">Sobre</Link>
              <Link href="/contato">Contato</Link>
            </div>

            <div className="footer-column">
              <h3>Redes sociais</h3>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram da Ótica Dumas"
              >
                <InstagramIcon size={17} />
                Instagram
              </a>

              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Facebook da Ótica Dumas"
              >
                <FacebookIcon size={17} />
                Facebook
              </a>

              <a
                href={socialLinks.threads}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Threads da Ótica Dumas"
              >
                <ThreadsIcon size={17} />
                Threads
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp da Ótica Dumas"
              >
                <WhatsAppIcon size={17} />
                WhatsApp
              </a>
            </div>

            <div className="footer-column">
              <h3>Visite nossa loja</h3>

              <p>
                R. 9 de Julho, S159
                <br />
                Centro — Pederneiras/SP
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=-22.3546696,-48.7764071"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-link"
              >
                Ver localização →
              </a>
            </div>
          </div>

          <div className="container footer-bottom">
            <span>
              © {new Date().getFullYear()} Ótica Dumas.
              Todos os direitos reservados.
            </span>

            <span>
              Pederneiras • São Paulo
            </span>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
