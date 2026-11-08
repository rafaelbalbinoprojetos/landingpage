import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cpu, Radar } from 'lucide-react';

const pipelineSteps = [
  'Interpretando briefing operacional...',
  'Identificando gargalos críticos...',
  'Estruturando arquitetura da solução...',
  'Gerando visual conceitual...',
  'Refinando interface premium...',
  'Criando preview executivo...',
  'Preparando imagem para PDF...',
  'Calculando esforço e investimento...',
  'Montando documento estratégico...'
] as const;

const LoadingPipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, pipelineSteps.length - 1));
    }, 640);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-cyan-300/20 bg-[#07111f]/90 p-5">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.05)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40" />

        <div className="relative mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Epic Core Engine
            </p>
            <h3 className="font-display text-2xl text-white md:text-3xl">Sistema de inteligência operacional em execução</h3>
          </div>
          <div className="hidden h-14 w-14 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 sm:flex">
            <Radar className="animate-spin text-cyan-200 [animation-duration:2.8s]" size={25} />
          </div>
        </div>

        <div className="relative grid gap-3 md:grid-cols-2">
          {pipelineSteps.map((step, index) => {
            const active = activeStep === index;
            const complete = index < activeStep;
            const progress = complete ? '100%' : active ? '72%' : '18%';

            return (
              <div
                key={step}
                className={`relative overflow-hidden rounded-md border px-4 py-4 transition-all duration-500 ${
                  active
                    ? 'border-cyan-300/60 bg-cyan-300/12'
                    : complete
                      ? 'border-blue-300/30 bg-blue-300/8'
                      : 'border-white/10 bg-white/[0.035]'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                      complete ? 'border-emerald-300/40 bg-emerald-300/12 text-emerald-200' : active ? 'border-cyan-300/50 bg-cyan-300/12 text-cyan-100' : 'border-white/10 bg-white/[0.04] text-slate-500'
                    }`}>
                      {complete ? <CheckCircle2 size={16} /> : <Cpu size={15} className={active ? 'animate-pulse' : ''} />}
                    </span>
                    <p className={active ? 'text-sm text-white' : 'text-sm text-slate-300'}>{step}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {complete ? 'concluído' : active ? 'processando' : 'fila'}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 transition-all duration-700"
                    style={{ width: progress }}
                  />
                </div>
                {active ? (
                  <div className="absolute inset-y-0 left-0 w-1/2 animate-[scanLine_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                ) : null}
              </div>
            );
          })}
        </div>
        <style>
          {`
            @keyframes scanLine {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(240%); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoadingPipeline;
