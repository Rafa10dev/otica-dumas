import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircle,
  Quote,
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

const storyHighlights = [
  {
    icon: CalendarDays,
    value: '18/04/2019',
    label: 'Fundação da Ótica Dumas',
  },
  {
    icon: CalendarDays,
    value: 'Outubro de 2024',
    label: 'Assinatura do contrato do ponto comercial atual',
  },
  {
    icon: Clock3,
    value: '40 minutos',
    label: 'Tempo informado para montagem de óculos de visão simples',
  },
];

export default function SobrePage() {
  return (
    <main className="inner-page about-story-page">
      <section className="inner-hero about-story-hero">
        <div className="container inner-hero-grid about-story-hero-grid">
          <div>
            <span className="section-kicker">Ótica Dumas</span>

            <h1>Sobre nós</h1>

            <p>
              A Ótica Dumas foi fundada em 18/04/2019, com o intuito de
              transformar a maneira de comprar óculos em Pederneiras.
            </p>
          </div>

          <div className="inner-highlight about-story-quote">
            <Quote size={24} aria-hidden="true" />

            <span>Nosso slogan até então</span>

            <strong>
              “Do conforto de sua casa, para o conforto de sua visão.”
            </strong>
          </div>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container about-story-layout">
          <article className="about-story-content">
            <div className="about-story-block">
              <span className="section-kicker">O começo da nossa história</span>

              <h2>A fase da home ótica</h2>

              <p>
                Com um sistema de trabalho diferenciado, instauramos a home
                ótica, que era a oportunidade de comprar seus óculos sem sair
                de casa.
              </p>

              <p>
                Passamos por anos desafiadores, mas nenhum capaz de nos fazer
                parar ou pensar em desistir.
              </p>
            </div>

            <div className="about-story-block">
              <span className="section-kicker">Um novo espaço</span>

              <h2>Da home ótica à loja física</h2>

              <p>
                Com a visão empreendedora bem definida, nossa missão agora não
                era só ir até nossos clientes, mas ter um lugar onde eles
                pudessem ir e ser recebidos com todo o amor e carinho que nós
                estávamos recebendo ao longo desses quase cinco anos e meio.
              </p>

              <p>
                E então, em outubro de 2024, assinamos nosso contrato de
                locação do ponto comercial onde estamos localizados atualmente.
              </p>
            </div>

            <div className="about-story-block">
              <span className="section-kicker">Mais agilidade na montagem</span>

              <h2>A montagem própria dos óculos</h2>

              <p>
                Com investimento focado em entregar o melhor pelo menor preço,
                conseguimos comprar máquinas e equipamentos que nos permitem a
                montagem na própria ótica, entregando, assim, óculos de visão
                simples a partir de 40 minutos. Essa é a evolução do modo de
                espera por seus óculos.
              </p>
            </div>

            <div className="about-story-block">
              <span className="section-kicker">A Ótica Dumas hoje</span>

              <h2>Um lugar para receber quem nos recebeu</h2>

              <p>
                A Ótica Dumas hoje tem um lugar para receber aqueles que nos
                receberam por esses anos e outras pessoas que sequer conheciam
                nosso trabalho. Mudamos o jeito de comprar óculos e, mais que
                isso, mudamos a forma de ver a vida.
              </p>

              <p>
                Hoje, a Ótica Dumas, em sua loja física, caminha para a
                comemoração dos dois anos, mas nossa história vai muito além
                disso.
              </p>
            </div>
          </article>

          <aside className="about-story-highlights" aria-label="Momentos importantes">
            <p className="about-story-highlights-title">Momentos importantes</p>

            {storyHighlights.map(({ icon: Icon, value, label }) => (
              <div className="about-story-highlight" key={value}>
                <div className="about-story-highlight-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>

                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="cta-section about-story-cta">
        <div className="container cta-inner">
          <div>
            <span className="section-kicker light">Ótica Dumas</span>

            <h2>Venha nos conhecer.</h2>

            <p>Venha nos conhecer e tomar um delicioso cappuccino.</p>
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
