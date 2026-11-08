import React from 'react';
import { ArrowRight } from 'lucide-react';

const capabilities = ['Sistemas sob medida', 'Automação de processos', 'Integrações', 'IA aplicada'];

const HeroContent: React.FC = () => (
  <div className="relative z-10 flex flex-col justify-center pt-10 md:pt-12 lg:py-6">
    <p className="hero-enter label text-hero-cyan" style={{ animationDelay: '0ms' }}>
      Software sob medida • Automação • IA
    </p>

    <h1
      className="hero-enter headline mt-6 text-[2.5rem] text-hero-white min-[390px]:text-[2.75rem] sm:text-6xl lg:text-[3.5rem] xl:text-[4.25rem]"
      style={{ animationDelay: '60ms' }}
    >
      Sistemas sob medida para empresas que <span className="hero-highlight">cresceram mais do que suas planilhas.</span>
    </h1>

    <p
      className="hero-enter mt-7 max-w-xl text-lg leading-relaxed text-hero-muted"
      style={{ animationDelay: '160ms' }}
    >
      A EpicByte desenvolve sistemas inteligentes, automações e soluções com IA que conectam processos, dados e decisões
      em uma operação mais eficiente.
    </p>

    <div className="hero-enter mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '240ms' }}>
      <a href="#briefing" className="hero-cta-primary group">
        Descobrir minha operação
        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
      </a>
      <a href="#projetos" className="hero-cta-secondary">
        Ver projetos
      </a>
    </div>

    <p className="hero-enter mt-4 text-sm text-hero-muted" style={{ animationDelay: '300ms' }}>
      Briefing guiado por IA em aproximadamente 7 minutos.
    </p>

    <ul
      className="hero-enter label mt-10 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-hero-muted xl:grid-cols-4"
      style={{ animationDelay: '360ms' }}
    >
      {capabilities.map((capability) => (
        <li key={capability}>{capability}</li>
      ))}
    </ul>
  </div>
);

export default HeroContent;
