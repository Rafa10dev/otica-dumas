'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const banners = [
  {
    desktop: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.29.23%20%281%29.jpeg',
    mobile: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.29.23.jpeg',
    alt: 'Ótica Dumas: uma infinidade de produtos que valorizam a sua beleza.',
  },
  {
    desktop: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.28.44%20%281%29.jpeg',
    mobile: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.28.44.jpeg',
    alt: 'Óculos infantis com conforto, qualidade e proteção.',
  },
  {
    desktop: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.29.04%20%281%29.jpeg',
    mobile: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.29.04.jpeg',
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
