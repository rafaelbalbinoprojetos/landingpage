import React from 'react';
import { Clock3, Wallet } from 'lucide-react';
import { DiagnosisProposal } from './types';

interface PricingCardProps {
  proposal: DiagnosisProposal;
}

const PricingCard: React.FC<PricingCardProps> = ({ proposal }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2 text-cyan-100">
        <Clock3 size={17} />
        <p className="text-[11px] uppercase tracking-[0.16em]">Prazo estimado</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{proposal.timeEstimate}</p>
    </div>

    <div className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-5">
      <div className="mb-3 flex items-center gap-2 text-cyan-100">
        <Wallet size={17} />
        <p className="text-[11px] uppercase tracking-[0.16em]">Investimento estimado</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-100">{proposal.investmentEstimate}</p>
    </div>
  </div>
);

export default PricingCard;
