import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { getPublicProducts, productImage } from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';

export const dynamic = 'force-dynamic';

const catalogBanner = {
  desktop: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.28.18%20%281%29.jpeg',
  mobile: '/images/banners/WhatsApp%20Image%202026-09-14%20at%2014.28.18.jpeg',
  alt: 'Óculos de sol: estilo e proteção sob o sol.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    busca?: string;
  }>;
}) {
  const params = await searchParams;

  const dbProducts = await getPublicProducts();
  const categories = [{ name: 'Todos', slug: 'todos' }, ...Array.from(new Map(dbProducts.map((product) => [product.category.slug, { name: product.category.name, slug: product.category.slug }])).values())];
  const products = dbProducts.map((product) => ({ ...product, brand: product.brand || 'Ótica Dumas', description: product.description || 'Consulte detalhes e disponibilidade com nossa equipe.', image: productImage(product), category: product.category.name, categorySlug: product.category.slug }));
  const filtered = products.filter((product) => {
    const matchesCategory =
      !params.categoria ||
      params.categoria === 'todos' ||
      product.categorySlug === params.categoria;

    const term = (params.busca || '')
      .trim()
      .toLowerCase();

    const matchesSearch =
      !term ||
      `${product.name} ${product.brand} ${product.category}`
        .toLowerCase()
        .includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="catalog-page section">
      <div className="container">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          Voltar para o início
        </Link>

        <div className="catalog-heading">
          <span className="section-kicker">
            Coleção
          </span>

          <h1>Catálogo Ótica Dumas</h1>

          <p>
            Escolha seus favoritos e fale com a nossa
            equipe para consultar disponibilidade,
            disponibilidade e detalhes.
          </p>
        </div>

        <div className="catalog-banner">
          <picture>
            <source media="(max-width: 767px)" srcSet={catalogBanner.mobile} />
            <img src={catalogBanner.desktop} alt={catalogBanner.alt} />
          </picture>
        </div>

        <form
          className="catalog-toolbar"
          action="/catalogo"
        >
          <div className="search-field">
            <Search size={18} />

            <input
              name="busca"
              defaultValue={params.busca || ''}
              placeholder="Buscar marca ou modelo..."
              aria-label="Buscar produtos"
            />
          </div>

          <div className="category-tabs">
            {categories.map((category) => {
              const isActive =
                params.categoria === category.slug ||
                (!params.categoria &&
                  category.slug === 'todos');

              return (
                <Link
                  key={category.slug}
                  href={`/catalogo?categoria=${category.slug}`}
                  className={`category-tab ${
                    isActive ? 'active' : ''
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </form>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Nenhum produto encontrado</h3>

            <p>
              Tente outra busca ou volte para
              todas as categorias.
            </p>

            <Link
              href="/catalogo"
              className="primary-button"
            >
              Ver todos os produtos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
