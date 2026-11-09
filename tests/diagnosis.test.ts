import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import handler from '../api/diagnosis';
import { HARD_QUESTION_LIMIT, createEmptyState, decideNext, finalizeState, getOpenDimensions, mergeInterview, registerQuestion, removeOffTopicMarketing, sanitizeState } from '../api/_diagnosis/engine';
import type { Dimension, InterviewOutput, ProjectCategory } from '../api/_diagnosis/engine';
import { buildPricing, formatInvestment } from '../api/_diagnosis/pricing';

const interview = (overrides: Partial<InterviewOutput> = {}): InterviewOutput => ({
  assistantMessage: 'Entendi. Pergunta da IA?',
  quickReplies: ['A', 'B', 'C'],
  category: 'sistema_web',
  targetDimension: 'usuarios',
  dimensionUpdates: [],
  requirements: [],
  conflicts: [],
  ...overrides,
});

const confirmed = (dimensions: readonly Dimension[]) =>
  dimensions.map((dimension) => ({ dimension, status: 'confirmado' as const, summary: 'ok' }));

const proposalPayload = (overrides: Record<string, unknown> = {}) => ({
  businessName: 'Cliente',
  businessContext: 'ERP',
  projectCategory: 'Sistema',
  proposalTitle: 'Proposta',
  briefingSummary: 'Resumo',
  initialDiagnosis: 'Diagnóstico',
  operationalBottlenecks: ['Retrabalho', 'Campanha de branding', 'Falta de rastreio', 'Dados soltos'],
  epicByteApproach: 'Abordagem',
  suggestedFeatures: ['Aprovações', 'Relatórios', 'Auditoria', 'Permissões'],
  expectedOperationalImpacts: ['Menos retrabalho', 'Mais controle', 'Mais conversão', 'Rastreabilidade'],
  strategicVision: 'Visão',
  recommendedTechnologies: ['Web responsivo', 'Banco relacional'],
  evolutionOpportunities: ['BI', 'Mobile'],
  nextStep: 'Validar',
  mockup: { title: 'T', screenType: 'Painel', visualStyle: 'Limpo', primaryAction: 'Aprovar', modules: ['A', 'B', 'C'], dataHighlights: ['X', 'Y', 'Z'] },
  visualConcept: { title: 'V', visualPrompt: 'Tela do sistema', imageAlt: 'Tela', palette: ['#000', '#111', '#222'], heroLabel: 'H' },
  strategicScore: { operationalComplexity: 'Alta', conversionPotential: 'Alto', automationPotential: 'Alto', structuringUrgency: 'Alta', recommendedSolutionType: 'Sistema' },
  solutionLevel: { recommended: 'Estrutura Profissional', rationale: 'R', options: [{ label: 'a', description: 'b' }, { label: 'c', description: 'd' }, { label: 'e', description: 'f' }] },
  idealSolution: { title: 'I', note: 'N', steps: ['1', '2', '3', '4'] },
  executiveSummary: 'Resumo executivo',
  architecture: 'Camadas',
  estimationModules: [
    { name: 'Fluxo principal', description: 'd', phase: 'mvp', complexity: 'alta', integrations: 1 },
    { name: 'Relatórios', description: 'd', phase: 'profissional', complexity: 'media', integrations: 0 },
    { name: 'BI', description: 'd', phase: 'evolucao', complexity: 'alta', integrations: 0 },
  ],
  priceEstimate: {
    phases: [{ name: 'MVP', modules: ['Fluxo principal'], investmentMin: 20000, investmentMax: 30000, weeksMin: 8, weeksMax: 11 }],
    maintenanceMonthlyMin: 500,
    maintenanceMonthlyMax: 900,
    assumptions: ['Integração pesa no esforço.'],
  },
  clientDeadlineWeeks: null,
  clientBudgetMax: null,
  benefits: ['Controle'],
  assumptions: ['Premissa'],
  exclusions: ['Exclusão'],
  risks: ['Risco'],
  ...overrides,
});

let responses: unknown[] = [];
const sentBodies: any[] = [];

beforeEach(() => {
  responses = [];
  sentBodies.length = 0;
  process.env.OPENAI_API_KEY = 'teste';
  globalThis.fetch = (async (_url: unknown, init: any) => {
    sentBodies.push(JSON.parse(init.body));
    const next = responses.shift();
    if (next === 'fail') return new Response('{}', { status: 500 });
    return new Response(JSON.stringify({ output_text: JSON.stringify(next) }), { status: 200 });
  }) as typeof fetch;
});

const callApi = async (messages: unknown[], briefingState: unknown = null) => {
  let output: any;
  const res = { status() { return this; }, setHeader() { return this; }, send(body: string) { output = JSON.parse(body); } };
  await handler({ method: 'POST', body: { messages, briefingState } }, res);
  return output;
};

const user = (content: string) => ({ role: 'user', content });

const categoryCases: Array<[string, ProjectCategory, string]> = [
  ['integração com SAP', 'integracao_corporativa', 'integracoes'],
  ['plataforma financeira', 'sistema_web', 'regras'],
  ['aplicativo educacional', 'aplicativo', 'objetivos'],
  ['landing page', 'landing_page', 'publico'],
];

for (const [name, category, expected] of categoryCases) {
  test(`${name}: as perguntas seguem a categoria`, () => {
    const state = mergeInterview(createEmptyState(), interview({ category, dimensionUpdates: confirmed(['contexto']) }));
    const open = getOpenDimensions(state);
    assert.ok([...open.critical, ...open.important].includes(expected as Dimension));
  });
}

test('landing page não pergunta sobre regras, permissões ou processos', () => {
  const open = getOpenDimensions(mergeInterview(createEmptyState(), interview({ category: 'landing_page' })));
  for (const dimension of ['regras', 'permissoes', 'processos'] as Dimension[]) {
    assert.ok(![...open.critical, ...open.important].includes(dimension));
  }
});

test('não encerra por número fixo: lacuna crítica mantém a entrevista depois de 6 perguntas', () => {
  let state = mergeInterview(createEmptyState(), interview({ dimensionUpdates: confirmed(['contexto', 'usuarios', 'processos', 'regras', 'prioridades']) }));
  state = { ...state, questionCount: 6 };
  assert.deepEqual(decideNext(state), { action: 'ask', target: 'integracoes' });
});

test('encerra cedo quando tudo o que é necessário já foi respondido', () => {
  const state = mergeInterview(createEmptyState(), interview({
    category: 'landing_page',
    dimensionUpdates: confirmed(['objetivos', 'publico', 'conversao', 'conteudo', 'identidade', 'integracoes', 'prazo', 'orcamento']),
  }));
  assert.deepEqual(decideNext(state), { action: 'propose', reason: 'coverage' });
});

test('respostas incompletas: cada lacuna tem limite e a entrevista sempre termina', () => {
  let state = mergeInterview(createEmptyState(), interview());
  let questions = 0;
  for (;;) {
    const decision = decideNext(state);
    if (decision.action === 'propose') break;
    assert.equal(decision.action, 'ask');
    state = registerQuestion(state, (decision as { target: Dimension }).target);
    questions += 1;
    assert.ok(questions <= HARD_QUESTION_LIMIT);
  }
  assert.ok(Object.values(state.asked).every((count) => (count || 0) <= 2));
  const doubts = finalizeState(state).requirements.filter((item) => item.kind === 'duvida');
  assert.ok(doubts.length > 0);
  assert.ok(doubts.every((item) => item.status === 'hipotese_pendente'));
});

test('requisitos conflitantes: conflito bloqueante é perguntado primeiro, com limite', () => {
  let state = mergeInterview(createEmptyState(), interview({ conflicts: [{ description: 'Sem login, mas com acesso por perfil.', blocking: true }] }));
  assert.equal(decideNext(state).action, 'ask_conflict');
  state = registerQuestion(registerQuestion(state, 'conflito'), 'conflito');
  assert.equal(decideNext(state).action, 'ask');
  assert.ok(finalizeState(state).requirements.some((item) => item.description.includes('Sem login')));
});

test('requisito tem id, origem e status coerentes, e hipótese não vira fato', () => {
  const state = mergeInterview(createEmptyState(), interview({
    requirements: [
      { kind: 'funcional', description: 'Aprovar pedidos', priority: 'alta', origin: 'cliente', dependsOn: [] },
      { kind: 'seguranca', description: 'Registrar auditoria', priority: 'media', origin: 'recomendacao_epicbyte', dependsOn: ['Aprovar pedidos'] },
      { kind: 'restricao', description: 'Uso em uma unidade', priority: 'baixa', origin: 'hipotese', dependsOn: [] },
    ],
  }));
  assert.deepEqual(state.requirements.map((item) => [item.id, item.status]), [
    ['REQ-001', 'confirmado'], ['REQ-002', 'recomendacao'], ['REQ-003', 'hipotese_pendente'],
  ]);
  assert.deepEqual(state.requirements[1].dependencies, ['REQ-001']);
  const again = mergeInterview(state, interview({ requirements: [{ kind: 'restricao', description: 'Uso em uma unidade!', priority: 'baixa', origin: 'cliente', dependsOn: [] }] }));
  assert.equal(again.requirements.length, 3);
  assert.equal(again.requirements[2].status, 'confirmado');
});

test('estado adulterado no navegador é descartado ou corrigido', () => {
  const state = sanitizeState({
    category: 'hack',
    questionCount: 'x',
    dimensions: { contexto: { status: 'invalido' }, usuarios: { status: 'confirmado', summary: 'a'.repeat(900) } },
    requirements: [{ description: 'Falso', kind: 'funcional', origin: 'hipotese', status: 'confirmado' }, { description: '', kind: 'x' }],
  });
  assert.equal(state.category, null);
  assert.equal(state.questionCount, 0);
  assert.equal(state.dimensions.contexto, undefined);
  assert.equal(state.dimensions.usuarios?.summary.length, 400);
  assert.equal(state.requirements.length, 1);
  assert.equal(state.requirements[0].status, 'hipotese_pendente');
});

test('marketing sai da proposta operacional, salvo se o cliente pediu', () => {
  const items = ['Campanha de branding', 'Rastreabilidade'];
  assert.deepEqual(removeOffTopicMarketing('sistema_web', 'quero um ERP', items), ['Rastreabilidade']);
  assert.deepEqual(removeOffTopicMarketing('sistema_web', 'ERP e campanha de branding', items), items);
  assert.deepEqual(removeOffTopicMarketing('landing_page', 'site', items), items);
});

const aiEstimate = {
  phases: [
    { name: 'MVP', modules: ['A'], investmentMin: 20040, investmentMax: 30000, weeksMin: 8, weeksMax: 11 },
    { name: 'Versão profissional', modules: ['A', 'B'], investmentMin: 35000, investmentMax: 50000, weeksMin: 12, weeksMax: 16 },
  ],
  maintenanceMonthlyMin: 800,
  maintenanceMonthlyMax: 1200,
  assumptions: ['Integração com ERP pesa no esforço.'],
};
const noClientLimits = { deadlineWeeks: null, budgetMax: null };

test('estimativa da IA é preservada, arredondada e identificada como não sendo cotação', () => {
  const pricing = buildPricing(aiEstimate, noClientLimits)!;
  assert.equal(pricing.source, 'estimativa_ia');
  assert.equal(pricing.phases[0].investmentMin, 20000);
  assert.equal(pricing.phases[1].investmentMax, 50000);
  assert.match(pricing.assumptions[0], /Não é uma cotação/);
  assert.match(pricing.infrastructureNote, /não está incluída/);
  assert.match(formatInvestment(pricing), /sujeita à validação/);
});

test('estimativa incoerente ou ausente é rejeitada', () => {
  const invert = { ...aiEstimate, phases: [{ ...aiEstimate.phases[0], investmentMin: 90000 }] };
  const zero = { ...aiEstimate, phases: [{ ...aiEstimate.phases[0], investmentMin: 0 }] };
  assert.equal(buildPricing(invert, noClientLimits), null);
  assert.equal(buildPricing(zero, noClientLimits), null);
  assert.equal(buildPricing({ ...aiEstimate, phases: [] }, noClientLimits), null);
  assert.equal(buildPricing(null, noClientLimits), null);
});

test('prazo irreal e orçamento insuficiente geram alerta com entrega faseada', () => {
  const pricing = buildPricing(aiEstimate, { deadlineWeeks: 1, budgetMax: 1000 })!;
  assert.match(pricing.deadlineAlert || '', /entrega faseada/);
  assert.match(pricing.budgetAlert || '', /reduzir o escopo/);
  const fine = buildPricing(aiEstimate, { deadlineWeeks: 52, budgetMax: 900000 })!;
  assert.equal(fine.deadlineAlert, null);
  assert.equal(fine.budgetAlert, null);
});

test('API: pergunta da IA é usada quando trata de uma lacuna real', async () => {
  responses = [interview({ dimensionUpdates: confirmed(['contexto']) })];
  const result = await callApi([user('Preciso de um sistema de compras')]);
  assert.equal(result.status, 'collecting');
  assert.equal(result.assistantMessage, 'Entendi. Pergunta da IA?');
  assert.equal(result.briefingState.asked.usuarios, 1);
  assert.equal(result.briefingState.questionCount, 1);
  assert.equal(result.progress.total, 100);
  assert.ok(result.progress.current > 0);
});

test('API: pergunta sobre tema já resolvido é trocada pelo roteiro', async () => {
  responses = [interview({ targetDimension: 'contexto', dimensionUpdates: confirmed(['contexto']) })];
  const result = await callApi([user('Preciso de um sistema')]);
  assert.notEqual(result.assistantMessage, 'Entendi. Pergunta da IA?');
  assert.equal(result.briefingState.asked.contexto, undefined);
});

test('API: "não sei" não encerra o briefing', async () => {
  responses = [interview({ dimensionUpdates: [{ dimension: 'usuarios', status: 'parcial', summary: 'não sabe' }] })];
  assert.equal((await callApi([user('Não sei quem vai usar')])).status, 'collecting');
});

test('API: pedido de encerramento gera proposta com a estimativa da IA', async () => {
  responses = [proposalPayload({ clientDeadlineWeeks: 1 })];
  const state = mergeInterview(createEmptyState(), interview({
    requirements: [{ kind: 'funcional', description: 'Aprovar compras', priority: 'alta', origin: 'cliente', dependsOn: [] }],
  }));
  const result = await callApi([user('Sistema de compras'), user('Já respondi, gere a proposta')], state);
  assert.equal(result.status, 'proposal');
  assert.equal(sentBodies.length, 1);
  assert.equal(sentBodies[0].text.format.name, 'epicbyte_proposal');
  assert.match(result.proposal.investmentEstimate, /R\$/);
  assert.match(result.proposal.timeEstimate, /entrega faseada/);
  assert.equal(result.proposal.strategicScore.conversionPotential, 'Não se aplica');
  assert.ok(!result.proposal.operationalBottlenecks.some((item: string) => /branding/i.test(item)));
  assert.ok(result.proposal.requirementsModel.requirements.some((item: any) => item.id === 'REQ-001' && item.status === 'confirmado'));
  assert.equal(result.proposal.pricing.source, 'estimativa_ia');
  assert.equal(result.proposal.pricing.phases[0].investmentMin, 20000);
  assert.match(result.proposal.visualConcept.visualPrompt, /Módulos reais/);
});

test('API: a IA estima preço em campo estruturado, e o servidor formata o texto', async () => {
  responses = [proposalPayload()];
  await callApi([user('Já respondi, gere a proposta')]);
  const { properties, required } = sentBodies[0].text.format.schema;
  assert.ok(properties.priceEstimate);
  assert.equal(properties.investmentEstimate, undefined);
  assert.equal(properties.timeEstimate, undefined);
  assert.deepEqual([...required].sort(), Object.keys(properties).sort());
});

test('API: estimativa inválida usa a proposta modelo, sem exibir valores incoerentes', async () => {
  responses = [proposalPayload({ priceEstimate: { phases: [], maintenanceMonthlyMin: 0, maintenanceMonthlyMax: 0, assumptions: [] } })];
  const result = await callApi([user('Já respondi, gere a proposta')]);
  assert.equal(result.status, 'proposal');
  assert.equal(result.proposal.pricing, undefined);
});

test('API: se a IA falha, o briefing continua pelo roteiro e a proposta sai pelo modelo', async () => {
  responses = ['fail'];
  assert.equal((await callApi([user('Preciso de um sistema')])).status, 'collecting');
  responses = ['fail'];
  const result = await callApi([user('Já respondi, gere a proposta')]);
  assert.equal(result.status, 'proposal');
  assert.ok(result.proposal.proposalTitle);
});
