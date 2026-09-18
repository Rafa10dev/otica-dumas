import {
  ArrowRight,
  MapPin,
  MessageCircle,
} from 'lucide-react';

import {
  FacebookIcon,
  InstagramIcon,
  ThreadsIcon,
} from '@/components/social-icons';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { socialLinks } from '@/lib/social-links';

export default function ContatoPage() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container">
          <span className="section-kicker">
            Entre em contato
          </span>

          <h1>
            Estamos prontos
            <br />
            para atender você.
          </h1>

          <p>
            Quer saber mais sobre um produto, tirar
            uma dúvida ou conversar com nossa equipe?
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card contact-highlight">
            <div className="contact-icon red">
              <MessageCircle size={22} />
            </div>

            <span className="contact-label">
              Atendimento
            </span>

            <h2>
              Fale diretamente
              pelo WhatsApp.
            </h2>

            <p>
              Consulte modelos, disponibilidade
              e tire suas dúvidas com a equipe da
              Ótica Dumas.
            </p>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              Abrir WhatsApp
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon blue">
              <MapPin size={22} />
            </div>

            <span className="contact-label">
              Nossa loja
            </span>

            <h2>
              Venha nos visitar.
            </h2>

            <p>
              R. 9 de Julho, S159
              <br />
              Centro — Pederneiras/SP
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=-22.3546696,-48.7764071"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              Ver no Google Maps
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                Redes sociais
              </span>

              <h2>
                Acompanhe a Ótica Dumas.
              </h2>
            </div>
          </div>

          <div className="contact-social-grid">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-card"
              aria-label="Instagram da Ótica Dumas"
            >
              <InstagramIcon size={24} />

              <div>
                <strong>Instagram</strong>
                <span>@otica.dumas</span>
              </div>

              <ArrowRight size={17} />
            </a>

            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-card"
              aria-label="Facebook da Ótica Dumas"
            >
              <FacebookIcon size={24} />

              <div>
                <strong>Facebook</strong>
                <span>Ótica Dumas</span>
              </div>

              <ArrowRight size={17} />
            </a>

            <a
              href={socialLinks.threads}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-card"
              aria-label="Threads da Ótica Dumas"
            >
              <ThreadsIcon size={24} />

              <div>
                <strong>Threads</strong>
                <span>@otica.dumas</span>
              </div>

              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
