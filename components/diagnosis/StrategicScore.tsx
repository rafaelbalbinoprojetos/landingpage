import React from 'react';
import { DiagnosisProposal } from './types';
import { getProposalTemplate } from './proposalInsights';

interface StrategicScoreProps {
  proposal: DiagnosisProposal;
}

const levelWidth = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('muito')) return '96%';
  if (normalized.includes('alta') || normalized.includes('alto')) return '86%';
  if (normalized.includes('média') || normalized.includes('medio') || normalized.includes('médio')) return '62%';
  return '38%';
};

const getValue = (proposal: DiagnosisProposal, key: string) => {
  const score = proposal.strategicScore as unknown as Record<string, string | undefined>;
  if (score[key]) return score[key] as string;
  if (key === 'productivityImpact') return proposal.solutionLevel.recommended === 'Estrutura Escalável' ? 'Muito alto' : 'Médio';
  if (key === 'traceability') return proposal.solutionLevel.recommended === 'Estrutura Escalável' ? 'Muito alta' : 'Média';
  if (key === 'scalability') return proposal.solutionLevel.recommended === 'Estrutura Essencial' ? 'Média' : 'Alta';
  return 'Médio';
};

const getJustification = (proposal: DiagnosisProposal, label: string, value: string) => {
  const custom = proposal.strategicScore.justifications?.[label];
  if (custom) return custom;
  const normalizedLabel = label.toLowerCase();
  if (['experiência', 'experiencia', 'presença', 'presenca', 'engajamento', 'narrativa', 'confiança', 'confianca', 'reputação', 'reputacao'].some((term) => normalizedLabel.includes(term))) {
    return `Nível ${value.toLowerCase()} pela relação entre narrativa, percepção visual, clareza da jornada e força de conexão com o público.`;
  }
  if (normalizedLabel.includes('conteúdo') || normalizedLabel.includes('conteudo')) {
    return `Nível ${value.toLowerCase()} pelo potencial de manter a experiência viva com mídia, campanhas e atualizações editoriais.`;
  }
  if (label.includes('Complexidade')) return `Nível ${value.toLowerCase()} pela combinação entre escopo, regras, operação e necessidade de governança.`;
  if (label.includes('automação')) return `Nível ${value.toLowerCase()} porque parte do valor vem de reduzir tarefas manuais e padronizar o fluxo.`;
  if (label.includes('produtividade')) return `Nível ${value.toLowerCase()} pelo potencial de acelerar atendimento, execução e acompanhamento da operação.`;
  if (label.includes('Rastreabilidade')) return `Nível ${value.toLowerCase()} pela necessidade de histórico, status, responsáveis e tomada de decisão confiável.`;
  if (label.includes('Escalabilidade')) return `Nível ${value.toLowerCase()} considerando evolução por módulos, usuários e integrações futuras.`;
  return `Nível ${value.toLowerCase()} pela urgência de estruturar a operação com menos fricção e mais previsibilidade.`;
};

const StrategicScore: React.FC<StrategicScoreProps> = ({ proposal }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
    {(() => {
      const template = getProposalTemplate(proposal);
      const scoreItems = [
        [template.scoreLabels.operationalComplexity, 'operationalComplexity'],
        [template.scoreLabels.automationPotential, 'automationPotential'],
        [template.scoreLabels.productivityImpact, 'productivityImpact'],
        [template.scoreLabels.traceability, 'traceability'],
        ['Escalabilidade', 'scalability'],
        ['Urgência de estruturação', 'structuringUrgency']
      ] as const;

      return (
        <>
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-100">{template.scoreTitle}</p>
        <h4 className="font-display text-2xl text-white">{proposal.strategicScore.recommendedSolutionType}</h4>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Leitura baseada no impacto potencial da solução sobre eficiência, conversão, automação e necessidade de estruturação.
        </p>
      </div>
      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
        leitura proprietária EpicByte
      </span>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {scoreItems.map(([label, key]) => {
        const value = getValue(proposal, key);
        return (
          <div key={label} className="rounded-md border border-white/10 bg-black/20 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-300">{label}</p>
              <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-200">
                {value}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 transition-all duration-700"
                style={{ width: levelWidth(value) }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{getJustification(proposal, label, value)}</p>
          </div>
        );
      })}
    </div>
        </>
      );
    })()}
  </div>
);

export default StrategicScore;
