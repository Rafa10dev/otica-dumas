import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { getPublicProducts, productImage } from '@/lib/catalog';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = (await getPublicProducts()).find((item) => item.slug === slug);
  const product = dbProduct ? { ...dbProduct, brand: dbProduct.brand || 'Ótica Dumas', description: dbProduct.description || 'Consulte detalhes e disponibilidade com nossa equipe.', image: productImage(dbProduct), category: dbProduct.category.name } : null;

  if (!product) {
    notFound();
  }

  return (
    <section className="section product-detail-page">
      <div className="container">
        <Link
          href="/catalogo"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Voltar para o catálogo
        </Link>

        <div className="detail-grid">
          <div className="detail-image">
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
            />
          </div>

          <div className="detail-copy">
            <span className="section-kicker">
              {product.category}
            </span>

            <div className="eyebrow">
              {product.brand}
            </div>

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <div className="detail-note">
              <ShieldCheck size={19} />

              <span>
                Consulte disponibilidade, opções e condições diretamente com a equipe.
              </span>
            </div>

            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button wide"
            >
              <MessageCircle size={20} />
              Tenho interesse neste produto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
