import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import ScrollScrubVideo from './ScrollScrubVideo';
import SectionIntro from './SectionIntro';

interface EcosystemSectionProps {
  mediaVersion: string;
}

const systems: Array<{
  id: string;
  name: string;
  title: string;
  subtitle: string;
  cta: string;
  metrics: string[];
  stat: string;
  videoSrc?: string;
  href?: string;
}> = [
  {
    id: 'korden',
    name: 'KORDEN',
    title: 'Sistema financeiro integrado à operação empresarial.',
    subtitle: 'Prova de arquitetura para transformar dados financeiros em leitura operacional contínua.',
    cta: 'Conhecer Korden',
    metrics: ['Receitas sincronizadas', 'Previsão de caixa', 'Evolução patrimonial'],
    stat: '+28% de organização financeira'
  },
  {
    id: 'meushape',
    name: 'MEUSHAPE',
    title: 'Plataforma de decisão automatizada baseada em dados.',
    subtitle: 'Motor de acompanhamento com regras, indicadores e evolução operacional em tempo real.',
    cta: 'Conhecer MeuShape',
    metrics: ['Registro de treino', 'Meta nutricional', 'Gráfico de evolução'],
    stat: '+34% de consistência em rotina',
    videoSrc: '/media/meushape.mp4',
    href: 'https://meushape-five.vercel.app/'
  },
  {
    id: 'essencia',
    name: 'ESSÊNCIA DOS LIVROS',
    title: 'Ecossistema de conteúdo estruturado para múltiplos formatos.',
    subtitle: 'Arquitetura de distribuição entre leitura, áudio e jornada interativa com a mesma base operacional.',
    cta: 'Explorar biblioteca',
    metrics: ['Leitura no tablet', 'Modo audiobook', 'Resumo visual animado'],
    stat: '+52% de consumo de conteúdo',
    videoSrc: '/media/essencia.mp4'
  },
  {
    id: 'quality-lens',
    name: 'QUALITY LENS',
    title: 'Camada operacional para qualidade industrial.',
    subtitle: 'Rastreabilidade, medição e decisão técnica unificadas dentro de um mesmo fluxo operacional.',
    cta: 'Ver solução industrial',
    metrics: ['Controle metrológico', 'Análise de tolerância', 'Rastreabilidade de inspeção'],
    stat: '-41% de não conformidades'
  }
];

const EcosystemSection: React.FC<EcosystemSectionProps> = ({ mediaVersion }) => {
  return (
    <section id="tecnologia" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <SectionIntro
            eyebrow="Provas de arquitetura EpicByte"
            title="Projetos reais que demonstram a capacidade de estruturar operações digitais com profundidade."
            description="Cada solução abaixo comprova uma competência central: conectar dados, regras e decisões em produtos que operam como sistema."
            titleClassName="max-w-5xl mb-6"
            descriptionClassName="max-w-4xl mb-12"
          />
        </Reveal>

        <div className="space-y-8">
          {systems.map((system, index) => (
            <Reveal key={system.id} delayMs={40 + index * 60}>
              <article
                className={`glass rounded-[2rem] border-white/10 ${system.videoSrc ? 'overflow-hidden p-0' : 'p-6 md:p-8 lg:p-10'}`}
              >
                <div className={`grid xl:grid-cols-12 ${system.videoSrc ? 'gap-0 items-stretch' : 'gap-8 items-center'}`}>
                  <div className={`xl:col-span-6 ${index % 2 === 1 ? 'xl:order-2' : ''} ${system.videoSrc ? 'p-6 md:p-8 lg:p-10' : ''}`}>
                    <p className="text-cyan-200 text-xs uppercase tracking-[0.18em] mb-4">{system.name}</p>
                    <h3 className="font-display text-2xl md:text-4xl text-white leading-tight mb-4">{system.title}</h3>
                    <p className="text-slate-300 md:text-lg leading-relaxed mb-6">{system.subtitle}</p>
                    <div className="space-y-2 mb-6">
                      {system.metrics.map((metric) => (
                        <div key={metric} className="rounded-lg bg-white/5 px-3 py-2 text-slate-200 text-sm flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-cyan-300" /> {metric}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-cyan-300/20 via-blue-400/15 to-violet-400/20 border border-white/10 px-4 py-3 mb-6">
                      <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-1">Indicador de impacto</p>
                      <p className="font-display text-white text-xl">{system.stat}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (system.href) {
                          window.open(system.href, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="w-full sm:w-auto bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-[0.14em] hover:bg-cyan-300 transition-colors"
                    >
                      {system.cta}
                    </button>
                  </div>

                  <div className={`xl:col-span-6 ${index % 2 === 1 ? 'xl:order-1' : ''}`}>
                    {system.videoSrc ? (
                      <ScrollScrubVideo src={`${system.videoSrc}?v=${mediaVersion}`} className="h-72 md:h-96 xl:h-full xl:min-h-[28rem] w-full" />
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-slate-400 text-xs uppercase tracking-[0.14em]">Cena operacional</p>
                          <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Ativo
                          </span>
                        </div>
                        <div className="space-y-2 mb-5">
                          {system.metrics.map((metric) => (
                            <div key={metric} className="rounded-lg bg-white/5 px-3 py-2 text-slate-200 text-sm flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-cyan-300" /> {metric}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-cyan-300/20 via-blue-400/15 to-violet-400/20 border border-white/10 px-4 py-3">
                          <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-1">Indicador de impacto</p>
                          <p className="font-display text-white text-xl">{system.stat}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
