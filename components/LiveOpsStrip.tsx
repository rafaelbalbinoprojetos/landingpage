import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

const pipelineSteps = [
  'Entrada de cliente',
  'Qualificação automática',
  'Proposta gerada',
  'Financeiro integrado'
] as const;

const dataAreas = ['Vendas', 'Operação', 'Financeiro'] as const;

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const LiveOpsStrip: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const countersStartedRef = useRef(false);
  const rafRef = useRef(0);
  const laneDotsRef = useRef<Array<HTMLDivElement | null>>([]);

  const [hasEntered, setHasEntered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [latencyCount, setLatencyCount] = useState(300);
  const [activityPhase, setActivityPhase] = useState(0);

  const barWidths = useMemo(() => {
    const phases = [
      ['78%', '54%', '88%'],
      ['84%', '62%', '91%'],
      ['80%', '58%', '86%'],
      ['88%', '66%', '93%']
    ];

    return phases[activityPhase % phases.length];
  }, [activityPhase]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setHasEntered(true);
          }
        });
      },
      { threshold: 0.28, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % pipelineSteps.length);
    }, 1100);

    return () => window.clearInterval(intervalId);
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const intervalId = window.setInterval(() => {
      setActivityPhase((current) => current + 1);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered || countersStartedRef.current) return;
    countersStartedRef.current = true;

    const durationMs = 1600;
    const startTime = performance.now();

    const animateCounters = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = easeOutCubic(progress);

      setJobsCount(Math.round(1284 * eased));
      setLatencyCount(Math.round(300 - (300 - 148) * eased));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const animateDots = () => {
      const now = performance.now();
      laneDotsRef.current.forEach((dot, index) => {
        if (!dot) return;
        const duration = 2200 + index * 350;
        const progress = ((now % duration) / duration) * 100;
        dot.style.left = `${progress}%`;
        dot.style.opacity = progress < 6 || progress > 94 ? '0.35' : '1';
      });
      rafRef.current = requestAnimationFrame(animateDots);
    };

    rafRef.current = requestAnimationFrame(animateDots);

    return () => cancelAnimationFrame(rafRef.current);
  }, [hasEntered]);

  return (
    <section ref={sectionRef} className="pb-12 md:pb-14">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
          <Reveal className="xl:col-span-4" delayMs={40}>
            <div className="glass relative overflow-hidden rounded-[1.75rem] border-white/10 p-5 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_42%)]" />
              <div className="relative">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                  Operação fluindo automaticamente
                </p>
                <p className="mb-5 max-w-sm text-sm leading-relaxed text-slate-400">
                  Cada etapa recebe contexto, dispara regras e empurra a operação para a próxima decisão.
                </p>

                <div className="hidden md:flex items-center gap-2">
                  {pipelineSteps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isCompleted = index < activeStep;

                    return (
                      <React.Fragment key={step}>
                        <div
                          className={`relative min-w-0 flex-1 rounded-2xl border px-3 py-3 transition-all duration-500 ${
                            isActive
                              ? 'border-cyan-300/50 bg-cyan-300/12 shadow-[0_0_26px_rgba(34,211,238,0.18)]'
                              : isCompleted
                                ? 'border-blue-300/25 bg-blue-300/8'
                                : 'border-white/10 bg-white/[0.03]'
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                                isActive
                                  ? 'bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]'
                                  : isCompleted
                                    ? 'bg-blue-300'
                                    : 'bg-slate-600'
                              } ${isActive ? 'animate-pulse' : ''}`}
                            />
                            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                              Etapa {index + 1}
                            </span>
                          </div>
                          <p className="text-sm leading-snug text-slate-200">{step}</p>
                        </div>

                        {index < pipelineSteps.length - 1 ? (
                          <div className="relative h-px flex-1 max-w-8 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 transition-all duration-700 ${
                                index < activeStep ? 'w-full opacity-100' : 'w-0 opacity-0'
                              }`}
                            />
                            <div
                              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.95)] transition-all duration-700"
                              style={{ left: index < activeStep ? 'calc(100% - 0.5rem)' : '-0.25rem' }}
                            />
                          </div>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="space-y-3 md:hidden">
                  {pipelineSteps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isCompleted = index < activeStep;

                    return (
                      <div key={step} className="relative">
                        <div
                          className={`rounded-2xl border px-4 py-3.5 transition-all duration-500 ${
                            isActive
                              ? 'border-cyan-300/50 bg-cyan-300/12 shadow-[0_0_22px_rgba(34,211,238,0.16)]'
                              : isCompleted
                                ? 'border-blue-300/25 bg-blue-300/8'
                                : 'border-white/10 bg-white/[0.03]'
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                isActive ? 'bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)] animate-pulse' : isCompleted ? 'bg-blue-300' : 'bg-slate-600'
                              }`}
                            />
                            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Etapa {index + 1}</span>
                          </div>
                          <p className="text-sm text-slate-200">{step}</p>
                        </div>
                        {index < pipelineSteps.length - 1 ? (
                          <div className="mx-auto h-4 w-px bg-gradient-to-b from-cyan-300/60 to-white/10" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="xl:col-span-4" delayMs={100}>
            <div className="glass relative overflow-hidden rounded-[1.75rem] border-white/10 p-5 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.12),transparent_42%)]" />
              <div className="relative">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                  Informações conectadas em tempo real
                </p>
                <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
                  Vendas, operação e financeiro trocam sinais continuamente sem depender de consolidação manual.
                </p>

                <div className="space-y-4">
                  {dataAreas.map((area, index) => (
                    <div key={area} className="relative rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-cyan-200">
                            <Sparkles size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100">{area}</p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                              {index === 0 ? 'Origem' : index === 1 ? 'Orquestração' : 'Conciliação'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-300">
                          Online
                        </span>
                      </div>

                      {index < dataAreas.length - 1 ? (
                        <div className="relative mx-auto mt-3 h-6 w-[2px] overflow-visible bg-gradient-to-b from-cyan-300/35 via-blue-300/25 to-violet-300/20 md:hidden">
                          <div
                            ref={(node) => {
                              laneDotsRef.current[index] = node;
                            }}
                            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.95)]"
                            style={{ top: '0%' }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="pointer-events-none relative mt-6 hidden md:block">
                  {[0, 1, 2].map((lane) => (
                    <div key={lane} className="relative mb-3 h-[2px] overflow-hidden rounded-full bg-white/10 last:mb-0">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          lane === 0
                            ? 'w-[88%] bg-gradient-to-r from-cyan-300/0 via-cyan-300/85 to-blue-300/0'
                            : lane === 1
                              ? 'w-[72%] bg-gradient-to-r from-blue-300/0 via-blue-300/85 to-violet-300/0'
                              : 'w-[91%] bg-gradient-to-r from-cyan-300/0 via-violet-300/80 to-violet-300/0'
                        }`}
                      />
                      <div
                        ref={(node) => {
                          laneDotsRef.current[lane] = node;
                        }}
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.95)]"
                        style={{ left: '0%' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-2 xl:col-span-4" delayMs={160}>
            <div className="glass relative overflow-hidden rounded-[1.75rem] border-white/10 p-5 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.12),transparent_48%)]" />
              <div className="relative">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                  Sua operação funcionando como um sistema
                </p>
                <p className="mb-5 max-w-sm text-sm leading-relaxed text-slate-400">
                  O engine central processa eventos, reduz latência de resposta e mantém a operação ativa em ciclo contínuo.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Process jobs</p>
                    <p className="mt-2 font-display text-3xl text-white">{jobsCount.toLocaleString('pt-BR')}</p>
                    <p className="mt-2 text-xs text-emerald-300">Fila processada com rastreabilidade</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Latency</p>
                    <p className="mt-2 font-display text-3xl text-white">{latencyCount}ms</p>
                    <p className="mt-2 text-xs text-cyan-300">Resposta operacional sob controle</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Atividade do engine</p>
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                      Sistema ativo
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {barWidths.map((width, index) => (
                      <div key={`${width}-${index}`} className="h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                            index === 0
                              ? 'bg-gradient-to-r from-cyan-300 to-cyan-400'
                              : index === 1
                                ? 'bg-gradient-to-r from-blue-300 to-blue-400'
                                : 'bg-gradient-to-r from-violet-300 to-violet-400'
                          }`}
                          style={{ width }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 size={14} className="text-cyan-300" />
                    Eventos, status e transições monitorados em tempo real.
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-300">
                  Sua empresa operando com previsibilidade, velocidade e controle.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default LiveOpsStrip;
