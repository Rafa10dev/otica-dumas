import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

type Product = { slug: string; name: string; image: string; brand: string; category: string; description: string; featured?: boolean };

export function ProductCard({ product }: { product: Product }) {
  const productUrl = `/catalogo/${product.slug}`;
  return <article className="product-card">
    <Link href={productUrl} className="product-image-wrap" aria-label={`Ver detalhes de ${product.name}`}>
      <img src={product.image} alt={`${product.brand} ${product.name}`} className="product-image" />
      {product.featured && <span className="product-badge">Destaque</span>}
    </Link>
    <div className="product-body">
      <div className="eyebrow">{product.brand}</div>
      <Link href={productUrl} className="product-name">{product.name}</Link>
      <p>{product.description}</p>
      <div className="product-footer">
          <span className="product-contact-label">Consulte disponibilidade</span>
        <div className="product-actions">
          <a href={getWhatsAppLink(product)} target="_blank" rel="noopener noreferrer" className="mini-action whatsapp-action" title="Consultar pelo WhatsApp" aria-label={`Consultar ${product.name} pelo WhatsApp`}><MessageCircle size={17} /></a>
          <Link href={productUrl} className="mini-action" title="Ver produto" aria-label={`Ver ${product.name}`}><ArrowUpRight size={17} /></Link>
        </div>
      </div>
    </div>
  </article>;
}
