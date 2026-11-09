// Motor comercial: a IA estima horas por módulo; o preço é sempre calculado aqui.

export const COMMERCIAL_CATEGORIES = [
  'landing_simples', 'landing_premium', 'landing_3d', 'site_institucional', 'ecommerce', 'sistema_simples',
  'sistema_profissional', 'sistema_corporativo', 'aplicativo_mobile', 'plataforma_saas', 'automacao_integracao', 'dados_sensiveis',
] as const;
export type CommercialCategory = (typeof COMMERCIAL_CATEGORIES)[number];

export type EstimatedModule = {
  name: string;
  description: string;
  phase: 'mvp' | 'profissional' | 'evolucao';
  complexity: 'baixa' | 'media' | 'alta';
  hoursMin: number;
  hoursMax: number;
  reusable: boolean;
};

export type CommercialParameters = {
  internalHourlyCost: number | null;
  overheadRate: number;
  complexityFactors: Record<EstimatedModule['complexity'], number>;
  reuseFactor: number;
  contingencyRate: number;
  grossMarginRate: number;
  taxRate: number;
  commercialExpenseRate: number;
  externalCosts: number;
  minimumProjectPrice: number;
  infrastructureMonthly: number | null;
  maintenanceMonthlyRate: number | null;
  weeklyCapacityHours: number;
  homologationWeeks: number;
  referenceHours: [number, number] | null;
};

// Sem custo por hora não há preço: a proposta fica em revisão.
// A reutilização começa em 1 (sem desconto) até haver produtividade observada.
// As faixas de referência só alertam fora do esperado e nunca definem o preço.
const defaults: CommercialParameters = {
  internalHourlyCost: null,
  overheadRate: 0.25,
  complexityFactors: { baixa: 1, media: 1, alta: 1 },
  reuseFactor: 1,
  contingencyRate: 0.15,
  grossMarginRate: 0.4,
  taxRate: 0,
  commercialExpenseRate: 0,
  externalCosts: 0,
  minimumProjectPrice: 0,
  infrastructureMonthly: null,
  maintenanceMonthlyRate: null,
  weeklyCapacityHours: 30,
  homologationWeeks: 1,
  referenceHours: null,
};

const referenceHours: Record<CommercialCategory, [number, number]> = {
  landing_simples: [8, 60],
  landing_premium: [30, 160],
  landing_3d: [80, 320],
  site_institucional: [30, 200],
  ecommerce: [120, 800],
  sistema_simples: [80, 400],
  sistema_profissional: [200, 1200],
  sistema_corporativo: [400, 3000],
  aplicativo_mobile: [200, 1500],
  plataforma_saas: [300, 2500],
  automacao_integracao: [40, 800],
  dados_sensiveis: [300, 2500],
};

const categoryDefaults: Partial<Record<CommercialCategory, Partial<CommercialParameters>>> = {
  landing_simples: { homologationWeeks: 0.5 },
  landing_premium: { homologationWeeks: 0.5 },
  sistema_corporativo: { contingencyRate: 0.2, homologationWeeks: 2 },
  dados_sensiveis: { contingencyRate: 0.2, homologationWeeks: 2 },
};

export const getCommercialParameters = (category: CommercialCategory): CommercialParameters => {
  let custom: any = {};
  try {
    custom = JSON.parse(process.env.PRICING_CONFIG_JSON || '{}');
  } catch {
    console.error('PRICING_CONFIG_JSON is invalid.');
  }
  const envCost = Number(process.env.PRICING_INTERNAL_HOURLY_COST);
  return {
    ...defaults,
    referenceHours: referenceHours[category],
    ...categoryDefaults[category],
    ...(Number.isFinite(envCost) && envCost > 0 ? { internalHourlyCost: envCost } : {}),
    ...custom.default,
    ...custom.categories?.[category],
  };
};

export type PhaseEstimate = {
  name: string;
  modules: string[];
  hoursMin: number;
  hoursMax: number;
  costMin: number | null;
  costMax: number | null;
  investmentMin: number | null;
  investmentMax: number | null;
  weeksMin: number;
  weeksMax: number;
};

export type PricingEstimate = {
  source: 'motor_comercial';
  priced: boolean;
  reviewRequired: boolean;
  reviewReasons: string[];
  category: CommercialCategory;
  phases: PhaseEstimate[];
  maintenanceMonthlyMin: number;
  maintenanceMonthlyMax: number;
  infrastructureNote: string;
  licensesNote: string;
  assumptions: string[];
  deadlineAlert: string | null;
  budgetAlert: string | null;
};

const roundMoney = (value: number) => Math.round(value / 100) * 100;
const money = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;

export const priceFromCost = (cost: number, parameters: CommercialParameters) => {
  // Margem incide sobre o preço de venda: preço = custo / (1 - margem - deduções).
  const share = 1 - parameters.grossMarginRate - parameters.taxRate - parameters.commercialExpenseRate;
  return share > 0.05 ? cost / share : null;
};

const adjustedHours = (module: EstimatedModule, hours: number, parameters: CommercialParameters) =>
  hours * parameters.complexityFactors[module.complexity] * (module.reusable ? parameters.reuseFactor : 1) * (1 + parameters.overheadRate);

const estimatePhase = (name: string, modules: EstimatedModule[], parameters: CommercialParameters): PhaseEstimate => {
  const hoursMin = Math.ceil(modules.reduce((sum, module) => sum + adjustedHours(module, module.hoursMin, parameters), 0));
  const hoursMax = Math.ceil(modules.reduce((sum, module) => sum + adjustedHours(module, module.hoursMax, parameters), 0));
  const rate = parameters.internalHourlyCost;
  const cost = (hours: number) => (rate ? hours * rate * (1 + parameters.contingencyRate) + parameters.externalCosts : null);
  const price = (hours: number) => {
    const value = cost(hours);
    const calculated = value === null ? null : priceFromCost(value, parameters);
    return calculated === null ? null : roundMoney(Math.max(calculated, parameters.minimumProjectPrice));
  };
  const costMin = cost(hoursMin);
  const costMax = cost(hoursMax);
  return {
    name,
    modules: modules.map((module) => module.name),
    hoursMin,
    hoursMax,
    costMin: costMin === null ? null : Math.round(costMin),
    costMax: costMax === null ? null : Math.round(costMax),
    investmentMin: price(hoursMin),
    investmentMax: price(hoursMax),
    weeksMin: Math.max(1, Math.ceil(hoursMin / parameters.weeklyCapacityHours + parameters.homologationWeeks)),
    weeksMax: Math.max(1, Math.ceil(hoursMax / parameters.weeklyCapacityHours + parameters.homologationWeeks)),
  };
};

export const estimateFromHours = (
  category: CommercialCategory,
  modules: EstimatedModule[],
  client: { deadlineWeeks: number | null; budgetMax: number | null },
  parameters = getCommercialParameters(category)
): PricingEstimate => {
  const mvp = modules.filter((module) => module.phase === 'mvp');
  const professional = modules.filter((module) => module.phase !== 'evolucao');
  const reviewReasons: string[] = [];
  if (!mvp.length) reviewReasons.push('A estimativa não definiu módulos para o MVP.');

  const phases = mvp.length ? [estimatePhase('MVP', mvp, parameters)] : [];
  if (mvp.length && professional.length > mvp.length) phases.push(estimatePhase('Versão profissional (inclui o MVP)', professional, parameters));

  const priced = phases.length > 0 && phases.every((phase) => phase.investmentMin !== null && phase.investmentMax !== null);
  if (!priced) reviewReasons.push('Os parâmetros comerciais precisam ser definidos para calcular o investimento.');

  const last = phases[phases.length - 1];
  const band = parameters.referenceHours;
  if (last && band && (last.hoursMax < band[0] || last.hoursMin > band[1])) {
    reviewReasons.push(`O esforço estimado (${last.hoursMin} a ${last.hoursMax} horas) está fora da referência da categoria (${band[0]} a ${band[1]} horas).`);
  }

  const first = phases[0];
  const maintenanceRate = parameters.maintenanceMonthlyRate;
  return {
    source: 'motor_comercial',
    priced,
    reviewRequired: reviewReasons.length > 0,
    reviewReasons,
    category,
    phases,
    maintenanceMonthlyMin: priced && maintenanceRate ? roundMoney(last.investmentMin! * maintenanceRate) : 0,
    maintenanceMonthlyMax: priced && maintenanceRate ? roundMoney(last.investmentMax! * maintenanceRate) : 0,
    infrastructureNote: parameters.infrastructureMonthly
      ? `Infraestrutura estimada em ${money(parameters.infrastructureMonthly)} por mês, à parte da implantação.`
      : 'Infraestrutura (hospedagem, banco de dados e serviços em nuvem) não está incluída: depende de cotação com os fornecedores.',
    licensesNote: 'Licenças e APIs de terceiros não estão incluídas, salvo indicação: dependem de cotação com os fornecedores.',
    assumptions: [
      'Estimativa inicial, calculada a partir do esforço previsto por módulo e sujeita à validação técnica e comercial da EpicByte. Não é uma cotação.',
      'O prazo considera a capacidade da equipe, a disponibilidade do cliente para validações, o acesso às integrações e a homologação.',
    ],
    deadlineAlert: first && client.deadlineWeeks && client.deadlineWeeks > 0 && client.deadlineWeeks < first.weeksMin
      ? `O prazo informado (${client.deadlineWeeks} semanas) é menor que a estimativa da primeira fase (${first.weeksMin} a ${first.weeksMax} semanas). A alternativa é uma entrega faseada: reduzir a primeira fase ao fluxo crítico dentro da data e levar os demais módulos para a fase seguinte.`
      : null,
    budgetAlert: priced && client.budgetMax && client.budgetMax > 0 && client.budgetMax < first.investmentMin!
      ? `A faixa informada (até ${money(client.budgetMax)}) fica abaixo da estimativa da primeira fase (a partir de ${money(first.investmentMin!)}). Será preciso reduzir o escopo inicial ou faseá-lo.`
      : null,
  };
};

export const REVIEW_TEXT = 'Em revisão pela equipe EpicByte: o valor será confirmado após a validação do escopo.';

export const formatInvestment = (estimate: PricingEstimate) => {
  if (!estimate.priced) return REVIEW_TEXT;
  return [
    ...estimate.phases.map((phase) => `${phase.name}: ${money(phase.investmentMin!)} a ${money(phase.investmentMax!)} de implantação.`),
    estimate.maintenanceMonthlyMax > 0 ? `Manutenção recorrente: ${money(estimate.maintenanceMonthlyMin)} a ${money(estimate.maintenanceMonthlyMax)} por mês, se contratada.` : null,
    'Estimativa inicial, sujeita à validação; infraestrutura e licenças à parte.',
    estimate.budgetAlert,
  ].filter(Boolean).join(' ');
};

export const formatTimeline = (estimate: PricingEstimate) =>
  [
    ...estimate.phases.map((phase) => `${phase.name}: ${phase.weeksMin} a ${phase.weeksMax} semanas, incluindo testes e homologação.`),
    estimate.deadlineAlert,
  ].filter(Boolean).join(' ') || REVIEW_TEXT;

// Valores só podem vir do motor: frases da IA com preço ou prazo são removidas.
const COMMERCIAL_PATTERN = /R\$\s?\d|\b\d+(?:[.,]\d+)?\s*(?:mil|reais)\b|\b\d+\s*(?:a|-|até)?\s*\d*\s*(?:semanas?|meses|m[eê]s)\b/i;

export const scrubCommercialText = (text: string) =>
  text.split(/(?<=[.!?])\s+/).filter((sentence) => !COMMERCIAL_PATTERN.test(sentence)).join(' ').trim();

export const scrubCommercialDeep = <T>(value: T, skipKeys: string[] = []): T => {
  if (typeof value === 'string') return scrubCommercialText(value) as unknown as T;
  if (Array.isArray(value)) {
    return value.map((item) => scrubCommercialDeep(item, skipKeys)).filter((item) => item !== '') as unknown as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, skipKeys.includes(key) ? item : scrubCommercialDeep(item, skipKeys)])
    ) as T;
  }
  return value;
};

export const hasCommercialDivergence = (value: unknown, skipKeys: string[] = []): boolean => {
  if (typeof value === 'string') return COMMERCIAL_PATTERN.test(value);
  if (Array.isArray(value)) return value.some((item) => hasCommercialDivergence(item, skipKeys));
  if (value && typeof value === 'object') {
    return Object.entries(value).some(([key, item]) => !skipKeys.includes(key) && hasCommercialDivergence(item, skipKeys));
  }
  return false;
};

export type CalibrationRecord = {
  project: string;
  category: CommercialCategory;
  estimatedHours: number;
  actualHours: number;
  actualCost: number;
  reworkHours: number;
  price: number;
};

// Calibração só informa: qualquer ajuste de parâmetro é decisão do proprietário.
export const summarizeCalibration = (records: CalibrationRecord[]) => {
  if (!records.length) return null;
  const sum = (pick: (record: CalibrationRecord) => number) => records.reduce((total, record) => total + pick(record), 0);
  const revenue = sum((record) => record.price);
  return {
    projects: records.length,
    actualVsEstimated: sum((record) => record.actualHours) / sum((record) => record.estimatedHours),
    reworkShare: sum((record) => record.reworkHours) / sum((record) => record.actualHours),
    grossMargin: revenue ? (revenue - sum((record) => record.actualCost)) / revenue : 0,
  };
};
