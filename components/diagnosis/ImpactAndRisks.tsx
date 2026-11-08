import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { DiagnosisProposal } from './types';
import { getImpactPotential, getProposalTemplate, getReducedRisks, getRoiNarrative, getSuccessIndicators } from './proposalInsights';

interface ImpactAndRisksProps {
  proposal: DiagnosisProposal;
}

const ImpactAndRisks: React.FC<ImpactAndRisksProps> = ({ proposal }) => {
  const impacts = getImpactPotential(proposal);
  const risks = getReducedRisks(proposal);
  const indicators = getSuccessIndicators(proposal);
  const template = getProposalTemplate(proposal);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.055] p-5 lg:col-span-7">
        <div className="mb-4 flex items-center gap-2 text-cyan-100">
          <TrendingUp size={17} />
          <p className="text-[11px] uppercase tracking-[0.16em]">{template.impactsTitle}</p>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-200">{getRoiNarrative(proposal)}</p>
        <div className="space-y-3">
          {impacts.slice(0, 5).map((item) => (
            <p key={item} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-200">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-violet-300/20 bg-violet-300/[0.055] p-5 lg:col-span-5">
        <div className="mb-4 flex items-center gap-2 text-violet-100">
          <ShieldCheck size={17} />
          <p className="text-[11px] uppercase tracking-[0.16em]">{template.evolutionTitle}</p>
        </div>
        <div className="space-y-3">
          {risks.slice(0, 6).map((item) => (
            <p key={item} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-200">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-12">
        <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-500">Indicadores de sucesso sugeridos</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {indicators.slice(0, 5).map((item) => (
            <p key={item} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-300">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactAndRisks;
