'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  AdminProductForm,
} from '@/components/admin-product-form';
import { AdminSidebar } from '@/components/admin-sidebar';

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  active: boolean;
  featured: boolean;
  categoryId: string;

  category: {
    id: string;
    name: string;
  };

  images: {
    id: string;
    url: string;
    alt: string | null;
    primary: boolean;
    position: number;
  }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    setError('');

    try {
      const response =
        await fetch('/api/products', {
          cache: 'no-store',
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Não foi possível carregar os produtos.',
        );
      }

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar produtos.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openNewProduct() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditProduct(
    product: Product,
  ) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function toggleProduct(
    product: Product,
  ) {
    try {
      const response =
        await fetch(
          `/api/products/${product.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              active: !product.active,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Não foi possível atualizar o produto.',
        );
      }

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao atualizar produto.',
      );
    }
  }

  async function deleteProduct(
    product: Product,
  ) {
    const confirmed =
      window.confirm(
        `Tem certeza que deseja excluir "${product.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/products/${product.id}`,
          {
            method: 'DELETE',
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Não foi possível excluir o produto.',
        );
      }

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao excluir produto.',
      );
    }
  }

  const filteredProducts =
    useMemo(() => {
      const term =
        search.trim().toLowerCase();

      if (!term) {
        return products;
      }

      return products.filter(
        (product) =>
          `${product.name} ${
            product.brand || ''
          } ${product.category.name}`
            .toLowerCase()
            .includes(term),
      );
    }, [products, search]);

  return (
    <section className="admin-page">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="admin-content">
          <div className="admin-topbar">
            <div>
              <Link
                href="/admin"
                className="back-link"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>

              <h1>
                Produtos
              </h1>

              <p>
                Cadastre e gerencie os
                produtos do catálogo.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={openNewProduct}
            >
              <Plus size={18} />
              Adicionar produto
            </button>
          </div>

          {error && (
            <div className="admin-form-error admin-global-error">
              {error}
            </div>
          )}

          <div className="admin-toolbar">
            <div className="search-field">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Buscar produto, marca ou categoria..."
              />
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadProducts}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? 'spin'
                    : ''
                }
              />

              Atualizar
            </button>
          </div>

          <div className="admin-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Catálogo
                </h2>

                <p>
                  {loading
                    ? 'Carregando produtos...'
                    : `${filteredProducts.length} produto(s) encontrado(s).`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="admin-loading">
                <RefreshCw
                  size={22}
                  className="spin"
                />

                <span>
                  Carregando produtos...
                </span>
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="admin-empty">
                <h3>
                  Nenhum produto encontrado
                </h3>

                <p>
                  Adicione o primeiro produto
                  ao catálogo.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={openNewProduct}
                >
                  <Plus size={17} />
                  Adicionar produto
                </button>
              </div>
            ) : (
              <div className="admin-table">
                {filteredProducts.map(
                  (product) => {
                    const image =
                      product.images.find(
                        (item) =>
                          item.primary,
                      ) ||
                      product.images[0];

                    return (
                      <div
                        className="admin-row product-admin-row"
                        key={product.id}
                      >
                        <div className="admin-product">
                          {image ? (
                            <img
                              src={image.url}
                              alt={
                                image.alt ||
                                product.name
                              }
                            />
                          ) : (
                            <div className="admin-product-placeholder">
                              <span>SEM</span>
                              <small>
                                FOTO
                              </small>
                            </div>
                          )}

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.brand ||
                                'Sem marca'}{' '}
                              •{' '}
                              {product
                                .category
                                .name}
                            </span>
                          </div>
                        </div>

                        <span
                          className={
                            product.active
                              ? 'status-pill'
                              : 'status-pill inactive'
                          }
                        >
                          {product.active
                            ? 'Ativo'
                            : 'Inativo'}
                        </span>

                        <span className="product-featured-label">
                          {product.featured
                            ? 'Destaque'
                            : 'Normal'}
                        </span>

                        <span className="product-contact-label">Sem valor público</span>

                        <div className="row-actions">
                          <button
                            type="button"
                            className="mini-action"
                            title={
                              product.active
                                ? 'Desativar produto'
                                : 'Ativar produto'
                            }
                            onClick={() =>
                              toggleProduct(
                                product,
                              )
                            }
                          >
                            <span
                              className={
                                product.active
                                  ? 'toggle-on'
                                  : 'toggle-off'
                              }
                            >
                              ●
                            </span>
                          </button>

                          <button
                            type="button"
                            className="mini-action"
                            title="Editar produto"
                            onClick={() =>
                              openEditProduct(
                                product,
                              )
                            }
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            type="button"
                            className="mini-action danger-action"
                            title="Excluir produto"
                            onClick={() =>
                              deleteProduct(
                                product,
                              )
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <AdminProductForm
          product={editingProduct}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={async () => {
            setModalOpen(false);
            setEditingProduct(null);
            await loadProducts();
          }}
        />
      )}
    </section>
  );
}
