import React, { useState } from 'react';
import EvolutionSection from './EvolutionSection';
import FullPreviewModal from './FullPreviewModal';
import ImpactAndRisks from './ImpactAndRisks';
import ImplementationTimeline from './ImplementationTimeline';
import OperationalAnalysis from './OperationalAnalysis';
import PricingCard from './PricingCard';
import ProposalDetails from './ProposalDetails';
import ProposalActions from './ProposalActions';
import SolutionLevel from './SolutionLevel';
import StrategicScore from './StrategicScore';
import VisualPreview from './VisualPreview';
import { DiagnosisProposal, LeadInfo } from './types';

interface ProposalRevealProps {
  proposal: DiagnosisProposal;
  lead: LeadInfo | null;
  onLeadChange: (lead: LeadInfo) => void;
  onRegenerateImage?: (style: string) => Promise<boolean>;
}

const RevealBlock: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => (
  <div
    className="animate-[proposalBlockReveal_780ms_ease-out_both]"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

const ProposalReveal: React.FC<ProposalRevealProps> = ({ proposal, lead, onLeadChange, onRegenerateImage }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-5">
      <style>
        {`
          @keyframes proposalBlockReveal {
            from { opacity: 0; transform: translateY(24px); filter: blur(12px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
        `}
      </style>

      <RevealBlock delay={0}>
        <div className="relative overflow-hidden rounded-lg border border-cyan-300/20 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-cyan-300/[0.045] p-5 md:p-7">
          <div className="relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              Documento estratégico gerado pela EpicByte
            </p>
            {proposal.projectCategory ? (
              <span className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                {proposal.projectCategory}
              </span>
            ) : null}
            <h3 className="font-display text-3xl leading-tight text-white md:text-5xl">
              {proposal.proposalTitle || `Proposta inicial para ${proposal.businessName}`}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              {proposal.briefingSummary}
            </p>
          </div>
        </div>
      </RevealBlock>

      <RevealBlock delay={140}>
        <OperationalAnalysis proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={260}>
        <VisualPreview proposal={proposal} onOpenFullPreview={() => setIsPreviewOpen(true)} onRegenerateImage={onRegenerateImage} />
      </RevealBlock>

      <RevealBlock delay={380}>
        <StrategicScore proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={500}>
        <ImpactAndRisks proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={620}>
        <SolutionLevel proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={740}>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-500">Infraestrutura sugerida</p>
          <div className="grid gap-3 md:grid-cols-2">
            {proposal.recommendedTechnologies.map((item) => (
              <p key={item} className="rounded-md bg-white/[0.035] px-4 py-3 text-sm leading-relaxed text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </div>
      </RevealBlock>

      <RevealBlock delay={860}>
        <ImplementationTimeline proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={980}>
        <PricingCard proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={1040}>
        <ProposalDetails proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={1100}>
        <EvolutionSection proposal={proposal} />
      </RevealBlock>

      <RevealBlock delay={1220}>
        <ProposalActions proposal={proposal} lead={lead} onLeadChange={onLeadChange} />
      </RevealBlock>

      {isPreviewOpen ? (
        <FullPreviewModal proposal={proposal} onClose={() => setIsPreviewOpen(false)} />
      ) : null}
    </div>
  );
};

export default ProposalReveal;
