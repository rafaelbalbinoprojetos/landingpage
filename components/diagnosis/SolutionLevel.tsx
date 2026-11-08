import React from 'react';
import { DiagnosisProposal } from './types';

interface SolutionLevelProps {
  proposal: DiagnosisProposal;
}

const SolutionLevel: React.FC<SolutionLevelProps> = ({ proposal }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
    <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Nível de solução recomendado</p>
    <h4 className="font-display text-3xl text-white">{proposal.solutionLevel.recommended}</h4>
    <p className="mt-3 text-sm leading-relaxed text-slate-300">{proposal.solutionLevel.rationale}</p>
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {proposal.solutionLevel.options.map((option) => {
        const active = option.label === proposal.solutionLevel.recommended;
        return (
          <div
            key={option.label}
            className={`rounded-md border p-4 ${
              active
                ? 'border-cyan-300/40 bg-cyan-300/10'
                : 'border-white/10 bg-black/20'
            }`}
          >
            <p className={active ? 'text-sm font-semibold text-cyan-100' : 'text-sm font-semibold text-slate-200'}>
              {option.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{option.description}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default SolutionLevel;
