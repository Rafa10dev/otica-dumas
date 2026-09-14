import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { availableBanner, type BannerPage } from '@/lib/banners';

type Props = { page: BannerPage; eyebrow: string; title: string; description?: string; cta?: { label: string; href: string } };

export function PageHero({ page, eyebrow, title, description, cta }: Props) {
  const banner = availableBanner(page);
  const image = banner.desktop || banner.mobile;
  return <section className={`page-hero ${image ? 'has-banner' : 'is-placeholder'}`}>
    {image && <picture className="page-hero-media"><source media="(max-width: 700px)" srcSet={banner.mobile || image} /><img src={image} alt="" /></picture>}
    <div className="page-hero-overlay" />
    <div className="container page-hero-content">
      <span className="section-kicker">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {cta && <Link href={cta.href} className="primary-button">{cta.label}<ArrowRight size={17} /></Link>}
    </div>
  </section>;
}
