import React, { useState } from 'react';
import { coreCapabilities, networkResults, networkSources } from '../landingContent';
import Reveal from './Reveal';
import WorkflowTimeline from './WorkflowTimeline';

// O diagrama desktop tem proporção 2:1, igual ao viewBox, para as linhas coincidirem com os botões.
const rowY = (index: number) => 50 + index * 100;
const sourcePath = (index: number) => `M260 ${rowY(index)} C330 ${rowY(index)} 330 250 400 250`;
const resultPath = (index: number) => `M600 250 C670 250 670 ${rowY(index)} 740 ${rowY(index)}`;

const nodeClass = (active: boolean, selected: boolean) =>
  `min-h-[44px] w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium leading-tight transition-all duration-200 ${
    selected
      ? 'border-ion bg-ion text-night'
      : active
        ? 'border-ion/70 bg-ion/10 text-snow'
        : 'border-white/15 bg-night-3 text-fog hover:border-white/40 hover:text-snow'
  }`;

const IntegrationNetwork: React.FC = () => {
  const [selected, setSelected] = useState<string>('crm');

  const source = networkSources.find((item) => item.id === selected);
  const result = networkResults.find((item) => item.id === selected);
  const activeResults: readonly string[] = source ? source.results : [selected];
  const activeSources = source
    ? [selected]
    : networkSources.filter((item) => (item.results as readonly string[]).includes(selected)).map((item) => item.id);
  const note = source?.note ?? result?.note;

  return (
    <section id="sistema" className="eb-section eb-tech-grid relative scroll-mt-16 overflow-hidden bg-night text-snow">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-night-2 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[28%] h-[30rem] w-[50rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(34,211,238,0.13),transparent)]" />

      <div className="shell relative">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eb-kicker mb-4 text-ion">Como funciona</p>
            <h2 className="eb-title">
              ERP registra. CRM vende. <span className="eb-grad">Falta o que liga os dois.</span>
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-fog lg:col-span-4 lg:col-start-9 lg:self-end">
            Em vez de trocar tudo o que já funciona, construímos a camada que conecta suas ferramentas e executa as
            regras do seu negócio.
          </p>
        </Reveal>

        <Reveal delayMs={80} className="mt-12">
          <p className="mb-5 text-sm text-fog">Selecione uma fonte ou um resultado para ver o caminho da informação.</p>

          <div className="relative grid gap-6 lg:aspect-[2/1] lg:grid-cols-[26%_48%_26%] lg:gap-0">
            <svg viewBox="0 0 1000 500" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" fill="none" aria-hidden="true">
              {networkSources.map((item, index) => {
                const on = activeSources.includes(item.id);
                return (
                  <g key={item.id}>
                    <path d={sourcePath(index)} stroke={on ? '#22D3EE' : '#FFFFFF'} strokeOpacity={on ? 0.9 : 0.14} strokeWidth={on ? 2 : 1} className="transition-all duration-300" />
                    {on ? <path d={sourcePath(index)} pathLength={100} stroke="#F5F7FB" strokeWidth="3" strokeLinecap="round" className="eb-pulse" /> : null}
                  </g>
                );
              })}
              {networkResults.map((item, index) => {
                const on = activeResults.includes(item.id);
                return (
                  <g key={item.id}>
                    <path d={resultPath(index)} stroke={on ? '#8B5CF6' : '#FFFFFF'} strokeOpacity={on ? 1 : 0.14} strokeWidth={on ? 2 : 1} className="transition-all duration-300" />
                    {on ? <path d={resultPath(index)} pathLength={100} stroke="#F5F7FB" strokeWidth="3" strokeLinecap="round" className="eb-pulse" /> : null}
                  </g>
                );
              })}
            </svg>

            <div>
              <h3 className="eb-kicker mb-3 text-fog lg:sr-only">Fontes</h3>
              <ul className="grid grid-cols-2 gap-2 lg:h-full lg:grid-cols-1 lg:grid-rows-5 lg:gap-0">
                {networkSources.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <button type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={nodeClass(activeSources.includes(item.id), selected === item.id)}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full rounded-2xl border border-ion/50 bg-night-3/95 p-5 shadow-[0_0_70px_-20px_rgba(34,211,238,0.8)] lg:w-[41.6%] lg:p-3 xl:p-4">
                <p className="eb-kicker text-ion">Núcleo</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight lg:text-base xl:text-lg">EpicByte Intelligence Layer</h3>
                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs leading-snug text-fog lg:grid-cols-1">
                  {coreCapabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="eb-kicker mb-3 text-fog lg:sr-only">Resultados</h3>
              <ul className="grid grid-cols-2 gap-2 lg:h-full lg:grid-cols-1 lg:grid-rows-5 lg:gap-0">
                {networkResults.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <button type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={nodeClass(activeResults.includes(item.id), selected === item.id)}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 min-h-[3.5rem] max-w-3xl border-l-2 border-ion pl-4 text-lg leading-snug text-snow" aria-live="polite">
            {note}
          </p>
        </Reveal>

        <Reveal delayMs={80} className="mt-16">
          <WorkflowTimeline />
        </Reveal>
      </div>
    </section>
  );
};

export default IntegrationNetwork;
