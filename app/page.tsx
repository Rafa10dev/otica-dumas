import Link from 'next/link';
import {
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/social-icons';
import { getPublicProducts, productImage } from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { socialLinks } from '@/lib/social-links';
import { StoreGallery } from '@/components/store-gallery';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbProducts = await getPublicProducts();
  const products = dbProducts.map((product) => ({ ...product, brand: product.brand || 'Ótica Dumas', description: product.description || 'Consulte detalhes e disponibilidade com nossa equipe.', image: productImage(product), category: product.category.name, categorySlug: product.category.slug }));
  const featured = products
    .filter((product) => product.featured)
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-glow glow-blue" />
        <div className="hero-glow glow-red" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">
              <Sparkles size={15} />
              Valorizando sua visão
            </span>

            <h1>
              Seu estilo.
              <br />
              Sua visão.
              <br />
              <span>Do seu jeito.</span>
            </h1>

            <p>
              Encontre armações, lentes e soluções para
              cuidar da sua visão com conforto, qualidade
              e estilo na Ótica Dumas.
            </p>

            <div className="hero-actions">
              <Link
                href="/catalogo"
                className="primary-button"
              >
                Explorar catálogo
                <ArrowRight size={18} />
              </Link>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button"
              >
                <MessageCircle size={18} />
                Falar pelo WhatsApp
              </a>
            </div>

            <div className="hero-trust">
              <span>
                <Check size={16} />
                Atendimento próximo
              </span>

              <span>
                <Check size={16} />
                Armações e lentes
              </span>

              <span>
                <Check size={16} />
                Compra pelo WhatsApp
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="/images/foto-4.jpeg"
                alt="Óculos em destaque da Ótica Dumas"
              />

              <div className="hero-image-overlay">
                <div>
                  <span>ÓTICA DUMAS</span>

                  <strong>
                    Encontre uma armação
                    que combine com você.
                  </strong>

                  <p>
                    Conheça nosso catálogo e converse
                    diretamente com a equipe.
                  </p>
                </div>
              </div>
            </div>

            <div className="floating-card top-card">
              <div className="floating-icon blue">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>Atendimento próximo</strong>
                <span>Feito para você</span>
              </div>
            </div>

            <div className="floating-card bottom-card">
              <div className="floating-icon red">
                <MapPin size={19} />
              </div>

              <div>
                <strong>Pederneiras • SP</strong>
                <span>Visite nossa loja</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                Seleção Ótica Dumas
              </span>

              <h2>Modelos em destaque</h2>

              <p className="section-heading-description">
                Alguns modelos que preparamos
                para você conhecer.
              </p>
            </div>

            <Link
              href="/catalogo"
              className="text-link"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <StoreGallery />
        </div>
      </section>

      <section className="section category-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                Encontre o que procura
              </span>

              <h2>
                Tudo para cuidar
                <br />
                da sua visão.
              </h2>
            </div>

            <Link
              href="/catalogo"
              className="text-link"
            >
              Ver catálogo completo
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            <Link
              href="/catalogo?categoria=oculos-de-grau"
              className="category-card"
            >
              <div className="category-icon">
                👓
              </div>

              <div>
                <h3>Óculos de Grau</h3>
                <p>
                  Armações para diferentes estilos,
                  formatos e necessidades.
                </p>
              </div>

              <span>Conhecer →</span>
            </Link>

            <Link
              href="/catalogo?categoria=oculos-de-sol"
              className="category-card"
            >
              <div className="category-icon red">
                🕶️
              </div>

              <div>
                <h3>Óculos de Sol</h3>
                <p>
                  Proteção e estilo para todos
                  os momentos.
                </p>
              </div>

              <span>Conhecer →</span>
            </Link>

            <Link
              href="/catalogo"
              className="category-card"
            >
              <div className="category-icon">
                ✨
              </div>

              <div>
                <h3>Lentes</h3>
                <p>
                  Opções para diferentes necessidades
                  e conforto visual.
                </p>
              </div>

              <span>Conhecer →</span>
            </Link>

            <Link
              href="/contato"
              className="category-card"
            >
              <div className="category-icon red">
                🔧
              </div>

              <div>
                <h3>Ajustes e Reparos</h3>
                <p>
                  Cuidados especializados para
                  seus óculos.
                </p>
              </div>

              <span>Conhecer →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section soft" id="sobre">
        <div className="container split-section">
          <div className="about-visual">
            <div className="about-image-card">
              <img
                src="/images/foto-12.jpeg"
                alt="Modelo de óculos da Ótica Dumas"
              />

              <div className="about-image-tag">
                <Sparkles size={15} />
                Estilo + cuidado
              </div>
            </div>
          </div>

          <div>
            <span className="section-kicker">
              Sobre a Ótica Dumas
            </span>

            <h2>
              Um atendimento que vai
              além de escolher uma armação.
            </h2>

            <p>
              A Ótica Dumas oferece soluções para
              diferentes necessidades visuais, unindo
              produtos, atendimento próximo e serviços
              especializados.
            </p>

            <div className="feature-list">
              <div>
                <div className="feature-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>Confiança</strong>
                  <span>
                    Informações claras e atendimento
                    próximo.
                  </span>
                </div>
              </div>

              <div>
                <div className="feature-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <strong>Estilo</strong>
                  <span>
                    Modelos selecionados para
                    diferentes perfis.
                  </span>
                </div>
              </div>

              <div>
                <div className="feature-icon">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <strong>Facilidade</strong>
                  <span>
                    Escolha seu modelo e converse
                    diretamente com a equipe.
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/sobre"
              className="primary-button about-button"
            >
              Conhecer a Ótica Dumas
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="social-section">
        <div className="container social-inner">
          <div>
            <span className="section-kicker">
              Acompanhe a Ótica Dumas
            </span>

            <h2>
              Veja nossas novidades
              <br />
              nas redes sociais.
            </h2>

            <p>
              Acompanhe novos modelos, novidades
              e conteúdos da Ótica Dumas.
            </p>
          </div>

          <div className="social-links-grid">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-card"
            >
              <InstagramIcon size={22} />
              <div>
                <strong>Instagram</strong>
                <span>@otica.dumas</span>
              </div>
              <ArrowRight size={16} />
            </a>

            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-card"
            >
              <MessageCircle size={22} />
              <div>
                <strong>WhatsApp</strong>
                <span>Fale conosco</span>
              </div>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="cta-section" id="contato">
        <div className="container cta-inner">
          <div>
            <span className="section-kicker light">
              Encontrou seu favorito?
            </span>

            <h2>
              Vamos conversar.
            </h2>

            <p>
              Envie o produto que você gostou e nossa
              equipe continua o atendimento diretamente
              com você pelo WhatsApp.
            </p>
          </div>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="light-button"
          >
            <MessageCircle size={19} />
            Falar com a Ótica Dumas
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}
