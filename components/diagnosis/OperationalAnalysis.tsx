import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { DiagnosisProposal } from './types';
import { getProposalTemplate } from './proposalInsights';

interface OperationalAnalysisProps {
  proposal: DiagnosisProposal;
}

const OperationalAnalysis: React.FC<OperationalAnalysisProps> = ({ proposal }) => {
  const template = getProposalTemplate(proposal);

  return (
  <div className="grid gap-4 lg:grid-cols-12">
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-6">
      <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-cyan-100">{template.analysisTitle}</p>
      <p className="text-base leading-relaxed text-slate-100">{proposal.initialDiagnosis}</p>
    </div>

    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-6">
      <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-cyan-100">Visão estratégica da solução</p>
      <p className="text-base leading-relaxed text-slate-100">{proposal.strategicVision}</p>
    </div>

    <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.055] p-5 lg:col-span-6">
      <div className="mb-4 flex items-center gap-2 text-amber-100">
        <AlertTriangle size={17} />
        <p className="text-[11px] uppercase tracking-[0.16em]">{template.bottlenecksTitle}</p>
      </div>
      <div className="space-y-3">
        {proposal.operationalBottlenecks.map((item) => (
          <p key={item} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-200">
            {item}
          </p>
        ))}
      </div>
    </div>

    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.055] p-5 lg:col-span-6">
      <div className="mb-4 flex items-center gap-2 text-cyan-100">
        <TrendingUp size={17} />
        <p className="text-[11px] uppercase tracking-[0.16em]">{template.impactsTitle}</p>
      </div>
      <div className="space-y-3">
        {proposal.expectedOperationalImpacts.map((item) => (
          <p key={item} className="rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-200">
            {item}
          </p>
        ))}
      </div>
    </div>

    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Abordagem EpicByte</p>
      <p className="text-sm leading-relaxed text-slate-300">{proposal.epicByteApproach}</p>
    </div>

    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-7">
      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-500">{template.structureTitle}</p>
      <div className="space-y-3">
        {proposal.suggestedFeatures.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-md bg-white/[0.035] px-4 py-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-cyan-300" />
            <p className="text-sm leading-relaxed text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default OperationalAnalysis;
