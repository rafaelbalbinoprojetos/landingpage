import React, { useState } from 'react';
import { operationFlow } from '../landingContent';

const WorkflowTimeline: React.FC = () => {
  const [active, setActive] = useState(0);
  const lastIndex = operationFlow.length - 1;

  return (
    <div>
      <h3 className="eb-subtitle">Exemplo: o caminho de um cliente, do contato à cobrança.</h3>

      <ol className="relative mt-8 grid gap-1 lg:grid-cols-6 lg:gap-0">
        <div className="pointer-events-none absolute left-[1.0625rem] top-4 bottom-4 w-px bg-white/15 lg:hidden" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-[8.33%] top-[1.0625rem] hidden h-px bg-white/15 lg:block" aria-hidden="true">
          <div
            className="h-full origin-left bg-gradient-to-r from-ion to-iris transition-transform duration-300"
            style={{ transform: `scaleX(${active / lastIndex})` }}
          />
        </div>

        {operationFlow.map((step, index) => {
          const isActive = index === active;
          const isDone = index <= active;
          return (
            <li key={step.title} className="relative">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(index)}
                className="flex min-h-[44px] w-full gap-4 rounded-lg p-0 text-left lg:flex-col lg:items-center lg:gap-3 lg:text-center"
              >
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-200 ${
                    isDone ? 'border-ion bg-ion text-night' : 'border-white/25 bg-night-3 text-fog'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="pb-3 lg:pb-0">
                  <span className={`block text-lg font-semibold ${isActive ? 'text-ion' : 'text-snow'}`}>{step.title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-fog">{step.detail}</span>
                </span>
              </button>
              {isActive ? (
                <p className="mb-4 ml-[3.25rem] text-base leading-snug text-snow lg:hidden">{step.explanation}</p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-8 hidden min-h-[3.5rem] rounded-xl border border-white/10 bg-night-3 px-5 py-4 text-lg leading-snug text-snow lg:block" aria-live="polite">
        {operationFlow[active].explanation}
      </p>
    </div>
  );
};

export default WorkflowTimeline;
