// A IA estima preço e prazo conforme a necessidade do cliente.
// Aqui os valores são validados, formatados e comparados com o que o cliente informou.

export type AiPhaseEstimate = {
  name: string;
  modules: string[];
  investmentMin: number;
  investmentMax: number;
  weeksMin: number;
  weeksMax: number;
};

export type AiPriceEstimate = {
  phases: AiPhaseEstimate[];
  maintenanceMonthlyMin: number;
  maintenanceMonthlyMax: number;
  assumptions: string[];
};

export const aiPriceEstimateSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    phases: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          modules: { type: 'array', items: { type: 'string' } },
          investmentMin: { type: 'number' },
          investmentMax: { type: 'number' },
          weeksMin: { type: 'number' },
          weeksMax: { type: 'number' },
        },
        required: ['name', 'modules', 'investmentMin', 'investmentMax', 'weeksMin', 'weeksMax'],
      },
    },
    maintenanceMonthlyMin: { type: 'number' },
    maintenanceMonthlyMax: { type: 'number' },
    assumptions: { type: 'array', items: { type: 'string' } },
  },
  required: ['phases', 'maintenanceMonthlyMin', 'maintenanceMonthlyMax', 'assumptions'],
};

export type PricingEstimate = AiPriceEstimate & {
  source: 'estimativa_ia';
  infrastructureNote: string;
  licensesNote: string;
  deadlineAlert: string | null;
  budgetAlert: string | null;
};

const money = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;
const roundMoney = (value: number) => Math.round(value / 100) * 100;
const isPositive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

// Devolve null quando a estimativa é inutilizável, para a proposta não exibir valores incoerentes.
export const buildPricing = (
  estimate: AiPriceEstimate | null | undefined,
  client: { deadlineWeeks: number | null; budgetMax: number | null }
): PricingEstimate | null => {
  const phases = estimate?.phases;
  if (!Array.isArray(phases) || !phases.length) return null;
  const valid = phases.every(
    (phase) => phase.name?.trim() && isPositive(phase.investmentMin) && phase.investmentMax >= phase.investmentMin && isPositive(phase.weeksMin) && phase.weeksMax >= phase.weeksMin
  );
  if (!valid) return null;

  const normalized = phases.slice(0, 3).map((phase) => ({
    ...phase,
    modules: Array.isArray(phase.modules) ? phase.modules : [],
    investmentMin: roundMoney(phase.investmentMin),
    investmentMax: roundMoney(phase.investmentMax),
    weeksMin: Math.ceil(phase.weeksMin),
    weeksMax: Math.ceil(phase.weeksMax),
  }));
  const first = normalized[0];

  return {
    source: 'estimativa_ia',
    phases: normalized,
    maintenanceMonthlyMin: roundMoney(Math.max(0, estimate!.maintenanceMonthlyMin || 0)),
    maintenanceMonthlyMax: roundMoney(Math.max(0, estimate!.maintenanceMonthlyMax || 0)),
    infrastructureNote: 'Infraestrutura (hospedagem, banco de dados e serviços em nuvem) não está incluída: depende de cotação com os fornecedores.',
    licensesNote: 'Licenças e APIs de terceiros não estão incluídas: dependem de cotação com os fornecedores.',
    assumptions: [
      'Estimativa inicial gerada por IA a partir do briefing, sujeita à validação técnica e comercial da EpicByte. Não é uma cotação.',
      ...(estimate!.assumptions || []).slice(0, 6),
    ],
    deadlineAlert: isPositive(client.deadlineWeeks) && client.deadlineWeeks < first.weeksMin
      ? `O prazo informado (${client.deadlineWeeks} semanas) é menor que a estimativa da primeira fase (${first.weeksMin} a ${first.weeksMax} semanas). A alternativa é uma entrega faseada: reduzir a primeira fase ao fluxo crítico dentro da data e levar os demais módulos para a fase seguinte.`
      : null,
    budgetAlert: isPositive(client.budgetMax) && client.budgetMax < first.investmentMin
      ? `A faixa informada (até ${money(client.budgetMax)}) fica abaixo da estimativa da primeira fase (a partir de ${money(first.investmentMin)}). Será preciso reduzir o escopo inicial ou faseá-lo.`
      : null,
  };
};

export const formatInvestment = (estimate: PricingEstimate) =>
  [
    ...estimate.phases.map((phase) => `${phase.name}: ${money(phase.investmentMin)} a ${money(phase.investmentMax)} de implantação.`),
    estimate.maintenanceMonthlyMax > 0 ? `Manutenção recorrente: ${money(estimate.maintenanceMonthlyMin)} a ${money(estimate.maintenanceMonthlyMax)} por mês, se contratada.` : null,
    'Estimativa inicial, sujeita à validação; infraestrutura e licenças à parte.',
    estimate.budgetAlert,
  ].filter(Boolean).join(' ');

export const formatTimeline = (estimate: PricingEstimate) =>
  [
    ...estimate.phases.map((phase) => `${phase.name}: ${phase.weeksMin} a ${phase.weeksMax} semanas, incluindo testes e homologação.`),
    estimate.deadlineAlert,
  ].filter(Boolean).join(' ');
