import { existsSync } from 'node:fs';
import path from 'node:path';

export type BannerPage = 'home' | 'catalogo' | 'sobre' | 'contato';

export const bannerConfig: Record<BannerPage, { desktop: string; mobile: string }> = {
  home: { desktop: '/banners/home-desktop.webp', mobile: '/banners/home-mobile.webp' },
  catalogo: { desktop: '/banners/catalogo-desktop.webp', mobile: '/banners/catalogo-mobile.webp' },
  sobre: { desktop: '/banners/sobre-desktop.webp', mobile: '/banners/sobre-mobile.webp' },
  contato: { desktop: '/banners/contato-desktop.webp', mobile: '/banners/contato-mobile.webp' },
};

export function availableBanner(page: BannerPage) {
  const banner = bannerConfig[page];
  const exists = (src: string) => existsSync(path.join(process.cwd(), 'public', src.slice(1)));
  return { desktop: exists(banner.desktop) ? banner.desktop : null, mobile: exists(banner.mobile) ? banner.mobile : null };
}
