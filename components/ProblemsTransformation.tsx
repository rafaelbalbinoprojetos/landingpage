import React, { useState } from 'react';
import { AlertTriangle, Database, Link2Off } from 'lucide-react';
import { symptoms } from '../landingContent';
import Reveal from './Reveal';

// Posições em % do palco. As linhas usam o mesmo sistema de coordenadas.
const fragments = [
  { label: 'planilha_final_v3', x: 4, y: 8, tilt: -3, warn: 'Versão divergente' },
  { label: 'WhatsApp', x: 62, y: 5, tilt: 2, warn: 'Quem aprovou?' },
  { label: 'CRM', x: 38, y: 40, tilt: -1 },
  { label: 'Financeiro', x: 72, y: 50, tilt: 3, warn: 'Sem histórico' },
  { label: 'Relatório (cópia)', x: 5, y: 56, tilt: 2, warn: 'Dado duplicado' },
  { label: 'E-mail', x: 42, y: 80, tilt: -2 }
];

const brokenLines = [
  'M20 18 L33 42',
  'M68 16 L54 40',
  'M58 50 L70 56',
  'M38 52 L26 62',
  'M50 56 L49 78',
  'M80 66 L60 84'
];

const modules = [
  { label: 'Vendas', x: 17, y: 14 },
  { label: 'Operação', x: 83, y: 14 },
  { label: 'Financeiro', x: 17, y: 50 },
  { label: 'Automações', x: 83, y: 50 },
  { label: 'Indicadores', x: 17, y: 86 },
  { label: 'Histórico', x: 83, y: 86 }
];

// As linhas partem do centro de cada módulo e terminam no núcleo; os elementos opacos as cobrem.
const connectedLines = modules.map(({ x, y }) => `M${x} ${y} C${(x + 50) / 2} ${y} ${(x + 50) / 2} 50 50 50`);

const FragmentedState: React.FC = () => (
  <div
    role="img"
    aria-label="Operação fragmentada: planilhas, mensagens, CRM e financeiro sem conexão, com dados duplicados e sem histórico."
    className="relative h-[24rem] md:h-full"
  >
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      {brokenLines.map((d) => (
        <path key={d} d={d} stroke="#A8B6CB" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="4 7" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
    {fragments.map((item) => (
      <div
        key={item.label}
        className="absolute max-w-[46%]"
        style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `rotate(${item.tilt}deg)` }}
      >
        <div className="eb-chip md:px-4 md:py-3 md:text-base">{item.label}</div>
        {item.warn ? (
          <p className="mt-1 flex items-center gap-1 text-[0.6875rem] leading-tight text-amber-300 md:mt-2 md:text-sm">
            <AlertTriangle size={11} className="shrink-0" aria-hidden="true" />
            {item.warn}
          </p>
        ) : null}
      </div>
    ))}
  </div>
);

const ConnectedState: React.FC = () => (
  <div
    role="img"
    aria-label="Operação conectada: uma base única ligada a vendas, operação, financeiro, automações, indicadores e histórico."
    className="relative h-[24rem] md:h-full"
  >
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      {connectedLines.map((d) => (
        <path key={d} d={d} stroke="#22D3EE" strokeOpacity="0.7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
    {modules.map((item) => (
      <div key={item.label} className="absolute w-[30%] -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
        <div className="eb-chip border-ion/40 text-center md:py-3 md:text-base">{item.label}</div>
      </div>
    ))}
    <div className="absolute left-1/2 top-1/2 flex aspect-square w-[24%] min-w-[5.25rem] max-w-[9rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-ion/60 bg-night-3 p-2 text-center shadow-[0_0_50px_-8px_rgba(34,211,238,0.7)]">
      <Database size={18} className="mb-1 text-ion" aria-hidden="true" />
      <span className="text-xs font-semibold leading-tight text-snow">Base única</span>
    </div>
  </div>
);

const options = [
  { id: 'fragmentada', label: 'Operação fragmentada' },
  { id: 'conectada', label: 'Operação conectada' }
] as const;

const ProblemsTransformation: React.FC = () => {
  const [state, setState] = useState<'fragmentada' | 'conectada'>('fragmentada');
  const isConnected = state === 'conectada';

  return (
    <section className="eb-section relative overflow-hidden bg-mist text-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ion to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ion/10 to-transparent" />

      <div className="shell relative">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eb-kicker mb-4 text-ion-deep">Do caos à clareza</p>
            <h2 className="eb-title">
              Toda empresa em crescimento <span className="eb-grad-light">chega neste ponto.</span>
            </h2>
          </div>
          <div className="hidden lg:col-span-5 md:flex lg:justify-end">
            <div className="inline-flex rounded-xl border border-night/15 bg-white p-1" role="group" aria-label="Comparar estados da operação">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={state === option.id}
                  onClick={() => setState(option.id)}
                  className={`min-h-[44px] rounded-lg px-4 text-sm font-semibold transition-colors duration-200 ${
                    state === option.id ? 'bg-night text-snow' : 'text-graphite hover:text-night'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80} className="mt-10">
          {/* No celular os dois estados ficam empilhados; a partir do tablet alternam no mesmo palco. */}
          <div className="grid gap-4 md:h-[27rem] md:grid-cols-1 md:gap-0 md:[grid-template-areas:'stage']">
            <div
              className={`eb-state eb-tech-grid overflow-hidden rounded-2xl bg-night p-4 md:p-6 md:[grid-area:stage] ${
                isConnected ? 'md:pointer-events-none md:scale-[0.99] md:opacity-0' : 'md:opacity-100'
              }`}
              aria-hidden={undefined}
            >
              <p className="eb-kicker flex items-center gap-2 text-amber-300 md:hidden">
                <Link2Off size={14} aria-hidden="true" /> Estado 01: fragmentada
              </p>
              <FragmentedState />
            </div>
            <div
              className={`eb-state eb-tech-grid overflow-hidden rounded-2xl bg-night p-4 md:p-6 md:[grid-area:stage] ${
                isConnected ? 'md:opacity-100' : 'md:pointer-events-none md:scale-[0.99] md:opacity-0'
              }`}
            >
              <p className="eb-kicker flex items-center gap-2 text-ion md:hidden">
                <Database size={14} aria-hidden="true" /> Estado 02: conectada
              </p>
              <ConnectedState />
            </div>
          </div>
          <p className="mt-3 text-sm text-graphite" aria-live="polite">
            <span className="hidden md:inline">
              {isConnected
                ? 'Com a base única, cada área consulta e atualiza a mesma informação.'
                : 'Sem conexão, cada área mantém a própria versão da informação.'}
            </span>
          </p>
        </Reveal>

        <Reveal delayMs={80} className="mt-12">
          <div className="hidden grid-cols-2 gap-8 pb-3 md:grid">
            <p className="eb-kicker text-graphite">O que acontece</p>
            <p className="eb-kicker text-graphite">O que custa</p>
          </div>
          <ul className="border-t border-night">
            {symptoms.map((item) => (
              <li key={item.symptom} className="grid gap-2 border-b border-night/15 py-5 md:grid-cols-2 md:gap-8">
                <p className="text-xl font-medium leading-snug">{item.symptom}</p>
                <p className="text-lg leading-snug text-graphite">{item.effect}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default ProblemsTransformation;
