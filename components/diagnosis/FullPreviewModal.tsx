import React from 'react';
import { createPortal } from 'react-dom';
import { BarChart3, Clapperboard, Gamepad2, Gauge, PackageCheck, PenLine, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { BUSINESS_CONTEXTS, classifyProposalContext, getProposalPersona, isEnterpriseProposal } from './proposalInsights';
import { DiagnosisProposal } from './types';

interface FullPreviewModalProps {
  proposal: DiagnosisProposal;
  onClose: () => void;
}

const FullPreviewModal: React.FC<FullPreviewModalProps> = ({ proposal, onClose }) => {
  const image = proposal.visualConcept.imageDataUrl;
  const enterprise = isEnterpriseProposal(proposal);
  const persona = getProposalPersona(proposal);
  const context = classifyProposalContext(proposal);
  const isWarehouse = persona === 'inventory_warehouse_system';
  const isGamer = persona === 'gamer_cinematic';
  const isMetrology = persona === 'industrial_automation' || context === BUSINESS_CONTEXTS.METROLOGY_SYSTEM;
  const operationalPanelItems = isWarehouse
    ? [
        { icon: ShieldCheck, label: 'Aprovação de requisição' },
        { icon: PackageCheck, label: 'Baixa e disponibilidade' },
        { icon: PenLine, label: 'Assinatura de retirada' },
      ]
    : isGamer
      ? [
          { icon: Clapperboard, label: 'Trailer em destaque' },
          { icon: Gamepad2, label: 'Gameplay showcase' },
          { icon: ShoppingBag, label: 'Comprar agora' },
        ]
    : isMetrology
      ? [
          { icon: Gauge, label: 'FIFO por criticidade' },
          { icon: BarChart3, label: 'Capacidade e produtividade' },
          { icon: ShieldCheck, label: 'Calibração e conformidade' },
        ]
      : enterprise
        ? [
            { icon: Gauge, label: 'Fluxo e prioridades' },
            { icon: BarChart3, label: 'Indicadores operacionais' },
            { icon: ShieldCheck, label: 'Permissões e auditoria' },
          ]
        : [
            { icon: Gauge, label: 'Fila de oportunidades' },
            { icon: BarChart3, label: 'Conversão e canais' },
            { icon: ShieldCheck, label: 'Controle de atendimento' },
          ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-xl">
      <div className="fixed left-1/2 top-1/2 max-h-[92vh] w-[calc(100vw-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-cyan-300/20 bg-[#06101f]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#06101f]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100">Visual completo da proposta</p>
            <h3 className="font-display text-xl text-white">{proposal.visualConcept.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-slate-200"
            aria-label="Fechar visual completo"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-12">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/25 lg:col-span-7">
            {image ? (
              <img src={image} alt={proposal.visualConcept.imageAlt} className="h-full min-h-[28rem] w-full object-cover" />
            ) : (
              <div className="flex min-h-[28rem] items-center justify-center bg-gradient-to-br from-cyan-300/14 via-blue-400/10 to-violet-400/14 p-8 text-center">
                <p className="max-w-md text-sm leading-relaxed text-slate-300">{proposal.visualConcept.imageAlt}</p>
              </div>
            )}
          </div>
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">Resumo visual</p>
              <p className="text-sm leading-relaxed text-slate-300">{proposal.mockup.visualStyle}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Telas previstas</p>
              <div className="space-y-2">
                {proposal.mockup.modules.map((module) => (
                  <p key={module} className="rounded-md bg-white/[0.04] px-3 py-2 text-sm text-slate-300">{module}</p>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-sm leading-relaxed text-cyan-50">
                Preview preparado para visualização desktop e mobile, com estrutura de apresentação para reunião estratégica.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Painel operacional previsto</p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {operationalPanelItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-md bg-black/20 px-3 py-2 text-sm text-slate-300">
                      <Icon size={15} className="text-cyan-300" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FullPreviewModal;
