'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const banners = [
  {
    desktop: '/images/banners/home-banner-01-desktop.jpeg',
    mobile: '/images/banners/home-banner-01-mobile.jpeg',
    alt: 'Ótica Dumas: uma infinidade de produtos que valorizam a sua beleza.',
  },
  {
    desktop: '/images/banners/home-banner-02-desktop.jpeg',
    mobile: '/images/banners/home-banner-02-mobile.jpeg',
    alt: 'Óculos infantis com conforto, qualidade e proteção.',
  },
  {
    desktop: '/images/banners/home-banner-03-desktop.jpeg',
    mobile: '/images/banners/home-banner-03-mobile.jpeg',
    alt: 'Óculos escuros com desconto na Ótica Dumas.',
  },
] as const;

export function StoreGallery() {
  const [current, setCurrent] = useState(0);
  const previous = () => setCurrent((value) => value === 0 ? banners.length - 1 : value - 1);
  const next = () => setCurrent((value) => value === banners.length - 1 ? 0 : value + 1);

  useEffect(() => {
    const interval = window.setInterval(next, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const banner = banners[current];

  return (
    <div className="store-gallery" aria-label="Banners em destaque">
      <div className="store-gallery-image">
        <picture key={banner.desktop}>
          <source media="(max-width: 767px)" srcSet={banner.mobile} />
          <img
            src={banner.desktop}
            alt={banner.alt}
            className="store-gallery-banner"
            loading={current === 0 ? 'eager' : 'lazy'}
          />
        </picture>

        <button type="button" className="gallery-control gallery-prev" onClick={previous} aria-label="Banner anterior">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className="gallery-control gallery-next" onClick={next} aria-label="Próximo banner">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="store-gallery-dots" aria-label="Selecionar banner">
        {banners.map((item, index) => (
          <button
            key={item.desktop}
            type="button"
            onClick={() => setCurrent(index)}
            className={index === current ? 'gallery-dot active' : 'gallery-dot'}
            aria-label={`Ir para o banner ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
