import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DiagnosisProposal } from './types';
import { getImplementationPlan, getProposalPersona, getProposalTemplate, isEnterpriseProposal } from './proposalInsights';

interface ImplementationTimelineProps {
  proposal: DiagnosisProposal;
}

const ImplementationTimeline: React.FC<ImplementationTimelineProps> = ({ proposal }) => {
  const plan = getImplementationPlan(proposal);
  const enterprise = isEnterpriseProposal(proposal);
  const template = getProposalTemplate(proposal);
  const persona = getProposalPersona(proposal);
  const branding = ['athlete_artist', 'landing_branding', 'personal_brand', 'luxury_brand', 'clinic_premium', 'law_firm', 'institutional_site', 'gamer_cinematic'].includes(persona);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-100">{template.timelineTitle}</p>
          <h4 className="font-display text-2xl text-white">
            {enterprise ? 'Implantação enterprise por etapas' : branding ? 'Evolução da experiência por etapas' : 'Evolução controlada da primeira versão'}
          </h4>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
          {enterprise ? 'MVP 4-6 meses · sólido 8-12 meses' : branding ? 'experiência inicial 3-6 semanas' : 'primeira entrega 3-6 semanas'}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {plan.map((phase, index) => (
          <div key={phase} className="relative overflow-hidden rounded-md border border-white/10 bg-black/20 p-4">
            <div className="relative mb-3 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                {index + 1}
              </span>
              <CheckCircle2 size={16} className="text-cyan-300" />
            </div>
            <p className="relative text-sm leading-relaxed text-slate-200">{phase}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImplementationTimeline;
