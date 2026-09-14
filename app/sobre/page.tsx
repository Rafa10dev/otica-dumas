import Link from 'next/link';
import {
  ArrowRight,
  Check,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

const services = [
  {
    title: 'Lentes prontas e surfaçadas',
    description:
      'Soluções para diferentes necessidades visuais e rotinas.',
  },
  {
    title: 'Multifocais',
    description:
      'Alternativas para diferentes distâncias com praticidade.',
  },
  {
    title: 'Lentes solares',
    description:
      'Proteção e estilo para aproveitar seus momentos ao ar livre.',
  },
  {
    title: 'Armações',
    description:
      'Modelos para diferentes perfis, estilos e preferências.',
  },
];

export default function SobrePage() {
  return (
    <main className="inner-page">
      <section className="inner-hero">
        <div className="container inner-hero-grid">
          <div>
            <span className="section-kicker">
              Ótica Dumas
            </span>

            <h1>
              Valorizando
              <br />
              sua visão ✨
            </h1>

            <p>
              Cuidar da visão também envolve conforto,
              estilo, atendimento e confiança.
            </p>
          </div>

          <div className="inner-highlight">
            <Sparkles size={24} />

            <strong>
              Atendimento próximo,
              soluções especializadas
              e estilo para você.
            </strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section about-page-section">
          <div>
            <span className="section-kicker">
              O que oferecemos
            </span>

            <h2>
              Soluções para diferentes
              momentos da sua vida.
            </h2>

            <p>
              A Ótica Dumas trabalha com uma variedade
              de produtos e serviços pensados para
              oferecer praticidade, conforto e estilo.
            </p>

            <div className="feature-list">
              {[
                'Atendimento próximo e personalizado',
                'Armações para diferentes estilos',
                'Lentes para diferentes necessidades',
                'Ajustes e reparos especializados',
              ].map((item) => (
                <div key={item}>
                  <div className="feature-icon">
                    <Check size={17} />
                  </div>

                  <div>
                    <strong>{item}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-service-grid">
            {services.map((service) => (
              <div
                key={service.title}
                className="about-service-card"
              >
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="section-kicker light">
              Vamos conversar?
            </span>

            <h2>
              Tem alguma dúvida?
            </h2>

            <p>
              Converse diretamente com a equipe da
              Ótica Dumas pelo WhatsApp.
            </p>
          </div>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="light-button"
          >
            <MessageCircle size={19} />
            Falar pelo WhatsApp
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
