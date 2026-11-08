import React from 'react';
import { DiagnosisProposal } from './types';

interface EvolutionSectionProps {
  proposal: DiagnosisProposal;
}

const EvolutionSection: React.FC<EvolutionSectionProps> = ({ proposal }) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-500">Evolução estratégica possível</p>
      <div className="grid gap-3 md:grid-cols-2">
        {proposal.evolutionOpportunities.map((item) => (
          <p key={item} className="rounded-md bg-white/[0.035] px-4 py-3 text-sm leading-relaxed text-slate-300">
            {item}
          </p>
        ))}
      </div>
    </div>

    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-100">Solução ideal para evolução</p>
      <h4 className="font-display text-2xl text-white">{proposal.idealSolution.title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{proposal.idealSolution.note}</p>
      <p className="mt-3 text-sm leading-relaxed text-cyan-100">
        O projeto pode começar simples e evoluir por etapas, preservando investimento inicial e criando base para escala.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {proposal.idealSolution.steps.map((step) => (
          <p key={step} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-300">
            {step}
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default EvolutionSection;
