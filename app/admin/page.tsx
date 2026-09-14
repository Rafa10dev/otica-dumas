import Link from 'next/link';
import {
  ArrowUpRight,
  Box,
  Eye,
  Image as ImageIcon,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { productImage } from '@/lib/catalog';
import { AdminSidebar } from '@/components/admin-sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const dbProducts = await prisma.product.findMany({ include: { category: true, images: { orderBy: { position: 'asc' } } }, orderBy: { createdAt: 'desc' } });
  const products = dbProducts.map((product) => ({ ...product, image: productImage(product), category: product.category.name }));
  const active = products.length;

  const featured =
    products.filter((product) => product.featured).length;

  return (
    <section className="admin-page">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="admin-content">
          <div className="admin-topbar">
            <div>
              <span className="section-kicker">
                Painel administrativo
              </span>

              <h1>
                Olá, administrador.
              </h1>

              <p>
                Gerencie o catálogo da
                Ótica Dumas.
              </p>
            </div>

            <Link
              href="/admin/produtos"
              className="primary-button"
            >
              <Plus size={18} />
              Novo produto
            </Link>
          </div>

          <div className="admin-stats">
            <div className="admin-stat">
              <span>
                Produtos cadastrados
              </span>

                <strong>{products.filter((product) => product.active).length}</strong>

              <Box size={20} />
            </div>

            <div className="admin-stat">
              <span>
                Em destaque
              </span>

              <strong>{featured}</strong>

              <Eye size={20} />
            </div>

            <div className="admin-stat">
                <span>Imagens cadastradas</span>

              <strong>{products.reduce((total, product) => total + product.images.length, 0)}</strong>

              <ImageIcon size={20} />
            </div>

            <div className="admin-stat">
                <span>Categorias</span>

              <strong>{new Set(products.map((product) => product.category)).size}</strong>

              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="admin-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Produtos recentes
                </h2>

                <p>
                  Últimos produtos adicionados ao catálogo.
                </p>
              </div>

              <Link
                href="/admin/produtos"
                className="text-link"
              >
                Gerenciar produtos
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="admin-table">
              {products
                .slice(0, 5)
                .map((product) => (
                  <div
                    className="admin-row"
                    key={product.slug}
                  >
                    <div className="admin-product">
                      <img
                        src={product.image}
                        alt=""
                      />

                      <div>
                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.brand} •{' '}
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <span className="status-pill">
                      Ativo
                    </span>

                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
