import React, { useEffect, useState } from 'react';
import { operationFlow } from '../landingContent';
import Reveal from './Reveal';
import SectionIntro from './SectionIntro';

interface LiveSystemFlowSectionProps {
  scrollToId: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => void;
}

const LiveSystemFlowSection: React.FC<LiveSystemFlowSectionProps> = ({ scrollToId }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % operationFlow.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="operacao-sistema" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal className="mb-12">
          <SectionIntro
            eyebrow="Demonstração estrutural"
            title="Veja sua operação funcionando como um sistema."
            description="CRM, planilhas, financeiro, vendas e operação deixam de funcionar como ilhas. O Epic Core Engine conecta eventos, dados e decisões em tempo real."
            titleClassName="max-w-5xl mb-6"
            descriptionClassName="max-w-4xl"
          />
        </Reveal>

        <div className="grid 2xl:grid-cols-12 gap-6 items-start">
          <Reveal className="2xl:col-span-8" delayMs={50}>
            <div className="glass rounded-[2rem] p-5 md:p-7 border-white/10 overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-cyan-200 text-xs uppercase tracking-[0.16em] mb-2">Fluxo operacional vivo</p>
                  <p className="text-slate-300 text-sm md:text-base">
                    Cada etapa recebe contexto, executa regra e atualiza o próximo estado da operação.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  Orquestração ativa
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {operationFlow.map((step, index) => {
                  const isActive = index === activeStep;
                  const isPast = index < activeStep;

                  return (
                    <div key={step.title} className="relative min-w-0">
                      <div
                        className={`h-full min-w-0 rounded-2xl border p-4 md:p-5 transition-all duration-500 ${
                          isActive
                            ? 'border-cyan-300/60 bg-cyan-300/12 shadow-[0_0_32px_rgba(56,189,248,0.22)]'
                            : isPast
                              ? 'border-blue-300/30 bg-blue-300/8'
                              : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold ${
                              isActive
                                ? 'border-cyan-300/50 bg-cyan-300/15 text-cyan-100'
                                : isPast
                                  ? 'border-blue-300/40 bg-blue-300/10 text-blue-100'
                                  : 'border-white/10 bg-white/[0.04] text-slate-300'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`max-w-[6.5rem] text-right text-[9px] leading-tight uppercase tracking-[0.14em] sm:text-[10px] ${
                              isActive ? 'text-cyan-200' : isPast ? 'text-blue-200' : 'text-slate-500'
                            }`}
                          >
                            {isActive ? 'Em execução' : isPast ? 'Concluído' : 'Aguardando'}
                          </span>
                        </div>
                        <h3 className="mb-2 break-words font-display text-lg text-white md:text-xl">{step.title}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-slate-300">{step.detail}</p>
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-1">Sinal operacional</p>
                          <p className="break-words text-sm text-slate-200">{step.signal}</p>
                        </div>
                      </div>
                      {index < operationFlow.length - 1 ? (
                        <div className="absolute left-1/2 top-full h-4 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/50 to-white/10" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal className="2xl:col-span-4" delayMs={110}>
            <div className="glass rounded-[2rem] p-6 md:p-7 border-white/10 h-full">
              <p className="text-cyan-200 text-xs uppercase tracking-[0.18em] mb-4">Camada de decisão</p>
              <h3 className="font-display text-2xl md:text-3xl text-white leading-tight mb-4">
                O cérebro operacional que faz sua empresa funcionar como um sistema único.
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Conecta sistemas, sincroniza eventos, padroniza processos e transforma dados dispersos em decisões
                rastreáveis.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  'Entrada de lead atualiza qualificação e agenda de atendimento.',
                  'Mudança de status aciona execução, cobrança e financeiro sem retrabalho.',
                  'Indicadores são alimentados no mesmo fluxo em vez de depender de consolidação manual.'
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => scrollToId(e, '#contato')}
                className="w-full rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-cyan-200"
              >
                Simular minha operação
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default LiveSystemFlowSection;
