import React from 'react';
import { DiagnosisProposal, ProposalRequirement } from './types';

const money = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;
const levelLabel = (level: string) => (level === 'media' ? 'média' : level);

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
    <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-400">{title}</p>
    {children}
  </div>
);

const TextList: React.FC<{ items?: string[] }> = ({ items }) => (
  <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
    {(items || []).map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const phases = [
  { id: 'mvp', label: 'MVP' },
  { id: 'profissional', label: 'Versão profissional' },
  { id: 'evolucao', label: 'Evolução futura' },
] as const;

const requirementGroups: Array<{ status: ProposalRequirement['status']; label: string }> = [
  { status: 'confirmado', label: 'Confirmado por você' },
  { status: 'recomendacao', label: 'Recomendação da EpicByte' },
  { status: 'hipotese_pendente', label: 'Hipótese a validar' },
];

const ProposalDetails: React.FC<{ proposal: DiagnosisProposal }> = ({ proposal }) => {
  const { executiveSummary, architecture, estimationModules, pricing, requirementsModel } = proposal;
  // Propostas do modo de reserva não têm esses dados, e o bloco fica oculto.
  if (!estimationModules?.length && !requirementsModel?.requirements?.length) return null;

  return (
    <div className="space-y-5">
      {executiveSummary ? (
        <Block title="Resumo executivo">
          <p className="text-sm leading-relaxed text-slate-200 md:text-base">{executiveSummary}</p>
        </Block>
      ) : null}

      {estimationModules?.length ? (
        <Block title="Escopo por fase">
          <div className="grid gap-4 md:grid-cols-3">
            {phases.map((phase) => (
              <div key={phase.id}>
                <p className="mb-2 font-semibold text-white">{phase.label}</p>
                <ul className="space-y-3">
                  {estimationModules.filter((module) => module.phase === phase.id).map((module) => (
                    <li key={module.name} className="text-sm leading-snug text-slate-300">
                      <span className="block text-slate-100">{module.name}</span>
                      {module.description}
                      <span className="mt-1 block text-xs text-slate-400">Complexidade {levelLabel(module.complexity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {architecture ? (
        <Block title="Arquitetura proposta">
          <p className="text-sm leading-relaxed text-slate-300">{architecture}</p>
        </Block>
      ) : null}

      {proposal.benefits?.length ? <Block title="Benefícios"><TextList items={proposal.benefits} /></Block> : null}

      {pricing ? (
        <Block title="Composição do investimento">
          <div className="grid gap-3 md:grid-cols-2">
            {pricing.phases.map((phase) => (
              <div key={phase.name} className="rounded-md bg-white/[0.035] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{phase.name}</p>
                <p className="mt-1">{money(phase.investmentMin)} a {money(phase.investmentMax)}</p>
                <p>{phase.weeksMin} a {phase.weeksMax} semanas</p>
              </div>
            ))}
          </div>
          {pricing.deadlineAlert || pricing.budgetAlert ? (
            <div role="note" className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-100">
              {[pricing.deadlineAlert, pricing.budgetAlert].filter(Boolean).join(' ')}
            </div>
          ) : null}
          <div className="mt-4 text-sm leading-relaxed text-slate-300">
            {pricing.maintenanceMonthlyMax > 0 ? (
              <p>Manutenção recorrente, se contratada: {money(pricing.maintenanceMonthlyMin)} a {money(pricing.maintenanceMonthlyMax)} por mês.</p>
            ) : null}
            <p>{pricing.infrastructureNote}</p>
            <p>{pricing.licensesNote}</p>
          </div>
          <div className="mt-4">
            <TextList items={pricing.assumptions} />
          </div>
        </Block>
      ) : null}

      {requirementsModel?.requirements?.length ? (
        <Block title="Requisitos levantados">
          <div className="space-y-5">
            {requirementGroups.map((group) => {
              const items = requirementsModel.requirements.filter((item) => item.status === group.status);
              if (!items.length) return null;
              return (
                <div key={group.status}>
                  <p className="mb-2 font-semibold text-white">{group.label}</p>
                  <ul className="space-y-2 text-sm leading-snug text-slate-300">
                    {items.map((item) => (
                      <li key={item.id}>
                        <span className="mr-2 font-mono text-xs text-cyan-200">{item.id}</span>
                        {item.description}
                        <span className="ml-2 text-xs text-slate-400">prioridade {levelLabel(item.priority)}</span>
                        {item.dependencies.length ? <span className="ml-2 text-xs text-slate-400">depende de {item.dependencies.join(', ')}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Block>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        {proposal.assumptions?.length ? <Block title="Premissas"><TextList items={proposal.assumptions} /></Block> : null}
        {proposal.exclusions?.length ? <Block title="Fora do escopo"><TextList items={proposal.exclusions} /></Block> : null}
        {proposal.risks?.length ? <Block title="Riscos"><TextList items={proposal.risks} /></Block> : null}
      </div>
    </div>
  );
};

export default ProposalDetails;
