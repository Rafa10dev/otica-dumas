'use client';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const photos = [
  { src: '/images/foto-1.jpeg', alt: 'Interior da Ótica Dumas' },
  { src: '/images/foto-2.jpeg', alt: 'Ambiente da Ótica Dumas' },
  { src: '/images/foto-11.jpeg', alt: 'Detalhes da Ótica Dumas' },
  { src: '/images/foto-9.jpeg', alt: 'Produtos da Ótica Dumas' },
];

export function StoreGallery() {
  const [current, setCurrent] = useState(0);
  const previous = () => setCurrent(value => value === 0 ? photos.length - 1 : value - 1);
  const next = () => setCurrent(value => value === photos.length - 1 ? 0 : value + 1);
  useEffect(() => { const interval = window.setInterval(next, 5000); return () => window.clearInterval(interval); }, []);
  return <div className="store-gallery"><div className="store-gallery-image"><Image src={photos[current].src} alt={photos[current].alt} fill sizes="(max-width: 900px) 100vw, 1100px" priority={current === 0} /><button type="button" className="gallery-control gallery-prev" onClick={previous} aria-label="Foto anterior"><ChevronLeft size={21} /></button><button type="button" className="gallery-control gallery-next" onClick={next} aria-label="Próxima foto"><ChevronRight size={21} /></button></div><div className="store-gallery-dots">{photos.map((photo, index) => <button key={photo.src} type="button" onClick={() => setCurrent(index)} className={index === current ? 'gallery-dot active' : 'gallery-dot'} aria-label={`Ir para foto ${index + 1}`} />)}</div></div>;
}
