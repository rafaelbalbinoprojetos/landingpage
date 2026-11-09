// Regras do diagnóstico adaptativo. A IA conduz a conversa e extrai os dados;
// este módulo decide o que ainda falta e quando o levantamento termina.

export const PROJECT_CATEGORIES = [
  'sistema_web',
  'aplicativo',
  'automacao',
  'ia',
  'ecommerce',
  'landing_page',
  'integracao_corporativa',
  'outro',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const DIMENSIONS = [
  'contexto', 'objetivos', 'usuarios', 'processos', 'entradas', 'saidas', 'regras', 'integracoes',
  'permissoes', 'seguranca', 'volumes', 'prioridades', 'prazo', 'orcamento', 'publico', 'conteudo', 'conversao', 'identidade',
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_STATUSES = ['desconhecido', 'parcial', 'confirmado', 'nao_se_aplica'] as const;
export type DimensionStatus = (typeof DIMENSION_STATUSES)[number];

export const REQUIREMENT_KINDS = [
  'contexto', 'objetivo', 'perfil_usuario', 'funcional', 'nao_funcional', 'regra_negocio', 'integracao',
  'seguranca', 'restricao', 'dependencia', 'criterio_aceite', 'risco', 'duvida',
] as const;
export type RequirementKind = (typeof REQUIREMENT_KINDS)[number];

export const REQUIREMENT_ORIGINS = ['cliente', 'recomendacao_epicbyte', 'hipotese'] as const;
export type RequirementOrigin = (typeof REQUIREMENT_ORIGINS)[number];
export type RequirementStatus = 'confirmado' | 'recomendacao' | 'hipotese_pendente';
export type Priority = 'alta' | 'media' | 'baixa';

export type Requirement = {
  id: string;
  kind: RequirementKind;
  description: string;
  priority: Priority;
  origin: RequirementOrigin;
  status: RequirementStatus;
  dependencies: string[];
};

export type Conflict = { description: string; blocking: boolean };

export type BriefingEngineState = {
  category: ProjectCategory | null;
  dimensions: Partial<Record<Dimension, { status: DimensionStatus; summary: string }>>;
  asked: Partial<Record<Dimension, number>>;
  conflictQuestions: number;
  conflicts: Conflict[];
  requirements: Requirement[];
  questionCount: number;
};

export type InterviewOutput = {
  assistantMessage: string;
  quickReplies: string[];
  category: ProjectCategory;
  targetDimension: Dimension | 'conflito';
  dimensionUpdates: Array<{ dimension: Dimension; status: DimensionStatus; summary: string }>;
  requirements: Array<Pick<Requirement, 'kind' | 'description' | 'priority' | 'origin'> & { dependsOn: string[] }>;
  conflicts: Conflict[];
};

export const SOFT_QUESTION_LIMIT = 10;
export const HARD_QUESTION_LIMIT = 14;
const CRITICAL_MAX_ASKS = 2;
const IMPORTANT_MAX_ASKS = 1;
const CONFLICT_MAX_ASKS = 2;

export const dimensionGuide: Record<Dimension, { label: string; question: string; replies: string[] }> = {
  contexto: { label: 'Contexto', question: 'Qual problema do negócio motivou este projeto hoje?', replies: ['Processo manual', 'Falta de controle', 'Sistema atual limitado', 'Nova oportunidade'] },
  objetivos: { label: 'Objetivos', question: 'Que resultado mostraria que o projeto deu certo?', replies: ['Reduzir retrabalho', 'Ganhar controle', 'Aumentar capacidade', 'Reduzir custos'] },
  usuarios: { label: 'Usuários', question: 'Quais perfis de pessoas vão usar a solução?', replies: ['Equipe interna', 'Gestores', 'Clientes', 'Administradores'] },
  processos: { label: 'Processo atual', question: 'Como esse processo acontece hoje, do início ao fim?', replies: ['Planilhas', 'WhatsApp e e-mail', 'Papel', 'Outro sistema'] },
  entradas: { label: 'Entradas', question: 'Quais informações principais precisam entrar na solução?', replies: ['Cadastros', 'Arquivos', 'Dados de outro sistema', 'Formulários'] },
  saidas: { label: 'Saídas', question: 'O que a solução precisa entregar no final?', replies: ['Relatórios', 'Painel de indicadores', 'Documentos', 'Notificações'] },
  regras: { label: 'Regras', question: 'Quais regras ou aprovações não podem falhar nesse processo?', replies: ['Aprovações por alçada', 'Prazos obrigatórios', 'Cálculos específicos', 'Ainda não definidas'] },
  integracoes: { label: 'Integrações', question: 'A solução precisa se conectar a algum sistema ou fonte de dados?', replies: ['Sem integração', 'ERP', 'Planilhas', 'API de terceiros'] },
  permissoes: { label: 'Permissões', question: 'O que cada perfil pode ver ou alterar?', replies: ['Todos veem tudo', 'Acesso por perfil', 'Acesso por unidade', 'Ainda não definido'] },
  seguranca: { label: 'Segurança', question: 'Há dados sensíveis ou exigências de segurança e auditoria?', replies: ['Dados pessoais (LGPD)', 'Dados financeiros', 'Auditoria de ações', 'Sem exigência especial'] },
  volumes: { label: 'Volumes', question: 'Qual é o volume aproximado de usuários e operações?', replies: ['Até 20 usuários', '20 a 200 usuários', 'Mais de 200 usuários', 'Não sei estimar'] },
  prioridades: { label: 'Prioridades', question: 'O que precisa existir na primeira entrega?', replies: ['O fluxo principal', 'Os cadastros', 'Os indicadores', 'As integrações'] },
  prazo: { label: 'Prazo', question: 'Existe uma data ou evento que define o prazo?', replies: ['Até 1 mês', '1 a 3 meses', '3 a 6 meses', 'Sem data definida'] },
  orcamento: { label: 'Orçamento', question: 'Existe uma faixa de investimento prevista para esta etapa?', replies: ['Até R$ 20 mil', 'R$ 20 a 60 mil', 'Acima de R$ 60 mil', 'Ainda não definida'] },
  publico: { label: 'Público', question: 'Quem é o público principal dessa página?', replies: ['Clientes finais', 'Empresas', 'Público local', 'Parceiros'] },
  conteudo: { label: 'Conteúdo', question: 'Quais conteúdos e provas precisam aparecer?', replies: ['Serviços ou produtos', 'Depoimentos', 'Fotos e vídeos', 'Ainda não tenho'] },
  conversao: { label: 'Ação principal', question: 'Qual ação o visitante deve realizar?', replies: ['Chamar no WhatsApp', 'Preencher formulário', 'Agendar', 'Comprar'] },
  identidade: { label: 'Identidade visual', question: 'Já existe identidade visual ou referência de estilo?', replies: ['Já tenho marca', 'Tenho referências', 'Preciso criar', 'Sem preferência'] },
};

const system = {
  critical: ['contexto', 'usuarios', 'processos', 'regras', 'integracoes', 'prioridades'],
  important: ['objetivos', 'entradas', 'saidas', 'permissoes', 'seguranca', 'volumes', 'prazo', 'orcamento'],
} as const;

export const requiredDimensions: Record<ProjectCategory, { critical: readonly Dimension[]; important: readonly Dimension[] }> = {
  sistema_web: system,
  aplicativo: {
    critical: ['contexto', 'usuarios', 'objetivos', 'entradas', 'prioridades'],
    important: ['saidas', 'integracoes', 'permissoes', 'seguranca', 'volumes', 'prazo', 'orcamento'],
  },
  automacao: {
    critical: ['contexto', 'processos', 'entradas', 'regras', 'saidas', 'integracoes'],
    important: ['usuarios', 'volumes', 'seguranca', 'prioridades', 'prazo', 'orcamento'],
  },
  ia: {
    critical: ['contexto', 'objetivos', 'entradas', 'saidas', 'regras'],
    important: ['usuarios', 'integracoes', 'seguranca', 'volumes', 'prioridades', 'prazo', 'orcamento'],
  },
  ecommerce: {
    critical: ['contexto', 'publico', 'entradas', 'integracoes', 'prioridades'],
    important: ['regras', 'volumes', 'seguranca', 'identidade', 'prazo', 'orcamento'],
  },
  landing_page: {
    critical: ['objetivos', 'publico', 'conversao', 'conteudo'],
    important: ['identidade', 'integracoes', 'prazo', 'orcamento'],
  },
  integracao_corporativa: {
    critical: ['contexto', 'processos', 'integracoes', 'entradas', 'saidas', 'regras', 'seguranca'],
    important: ['usuarios', 'permissoes', 'volumes', 'prioridades', 'prazo', 'orcamento'],
  },
  outro: {
    critical: ['contexto', 'objetivos', 'usuarios', 'prioridades'],
    important: ['processos', 'integracoes', 'prazo', 'orcamento'],
  },
};

export const createEmptyState = (): BriefingEngineState => ({
  category: null,
  dimensions: {},
  asked: {},
  conflictQuestions: 0,
  conflicts: [],
  requirements: [],
  questionCount: 0,
});

const clampText = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const oneOf = <T extends string>(options: readonly T[], value: unknown): T | null =>
  options.includes(value as T) ? (value as T) : null;
const clampCount = (value: unknown) => {
  const count = Number(value);
  return Number.isFinite(count) ? Math.min(100, Math.max(0, Math.floor(count))) : 0;
};

const statusFromOrigin = (origin: RequirementOrigin): RequirementStatus =>
  origin === 'cliente' ? 'confirmado' : origin === 'recomendacao_epicbyte' ? 'recomendacao' : 'hipotese_pendente';

// O estado volta do navegador, então tudo é revalidado antes de ser usado.
export const sanitizeState = (raw: unknown): BriefingEngineState => {
  const state = createEmptyState();
  if (!raw || typeof raw !== 'object') return state;
  const input = raw as Record<string, any>;

  state.category = oneOf(PROJECT_CATEGORIES, input.category);
  state.questionCount = clampCount(input.questionCount);
  state.conflictQuestions = clampCount(input.conflictQuestions);

  for (const dimension of DIMENSIONS) {
    const entry = input.dimensions?.[dimension];
    const status = oneOf(DIMENSION_STATUSES, entry?.status);
    if (status) state.dimensions[dimension] = { status, summary: clampText(entry.summary, 400) };
    const asked = clampCount(input.asked?.[dimension]);
    if (asked) state.asked[dimension] = asked;
  }

  if (Array.isArray(input.conflicts)) {
    state.conflicts = input.conflicts.slice(0, 8)
      .map((item: any) => ({ description: clampText(item?.description, 300), blocking: item?.blocking === true }))
      .filter((item: Conflict) => item.description);
  }

  if (Array.isArray(input.requirements)) {
    state.requirements = input.requirements.slice(0, 80).flatMap((item: any): Requirement[] => {
      const description = clampText(item?.description, 500);
      const kind = oneOf(REQUIREMENT_KINDS, item?.kind);
      const origin = oneOf(REQUIREMENT_ORIGINS, item?.origin);
      if (!description || !kind || !origin) return [];
      return [{
        id: clampText(item.id, 12) || '',
        kind,
        description,
        origin,
        priority: oneOf(['alta', 'media', 'baixa'] as const, item.priority) || 'media',
        status: statusFromOrigin(origin),
        dependencies: Array.isArray(item.dependencies) ? item.dependencies.map((dep: unknown) => clampText(dep, 12)).filter(Boolean).slice(0, 8) : [],
      }];
    });
  }
  return state;
};

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export const mergeInterview = (previous: BriefingEngineState, output: InterviewOutput): BriefingEngineState => {
  const state: BriefingEngineState = {
    ...previous,
    dimensions: { ...previous.dimensions },
    requirements: [...previous.requirements],
    category: oneOf(PROJECT_CATEGORIES, output.category) || previous.category,
    conflicts: output.conflicts.filter((item) => item.description?.trim()).slice(0, 8),
  };

  for (const update of output.dimensionUpdates) {
    const current = state.dimensions[update.dimension];
    // Uma resposta confirmada nunca volta a ser desconhecida.
    if (current?.status === 'confirmado' && update.status === 'desconhecido') continue;
    state.dimensions[update.dimension] = { status: update.status, summary: update.summary.trim().slice(0, 400) };
  }

  const known = new Map(state.requirements.map((item) => [normalize(item.description), item]));
  let nextId = state.requirements.reduce((max, item) => Math.max(max, Number(item.id.replace(/\D/g, '')) || 0), 0) + 1;
  for (const item of output.requirements) {
    const key = normalize(item.description);
    if (!key) continue;
    const existing = known.get(key);
    if (existing) {
      // O cliente confirmando uma hipótese ou recomendação tem prioridade.
      if (item.origin === 'cliente') {
        existing.origin = 'cliente';
        existing.status = 'confirmado';
      }
      continue;
    }
    const requirement: Requirement = {
      id: `REQ-${String(nextId).padStart(3, '0')}`,
      kind: item.kind,
      description: item.description.trim(),
      priority: item.priority,
      origin: item.origin,
      status: statusFromOrigin(item.origin),
      dependencies: [],
    };
    nextId += 1;
    requirement.dependencies = item.dependsOn
      .map((text) => known.get(normalize(text))?.id)
      .filter((id): id is string => Boolean(id));
    known.set(key, requirement);
    state.requirements.push(requirement);
  }
  state.requirements = state.requirements.slice(0, 80);
  return state;
};

const isResolved = (state: BriefingEngineState, dimension: Dimension, critical: boolean) => {
  const status = state.dimensions[dimension]?.status;
  if (status === 'confirmado' || status === 'nao_se_aplica') return true;
  if (!critical && status === 'parcial') return true;
  return (state.asked[dimension] || 0) >= (critical ? CRITICAL_MAX_ASKS : IMPORTANT_MAX_ASKS);
};

export const getOpenDimensions = (state: BriefingEngineState) => {
  const { critical, important } = requiredDimensions[state.category || 'outro'];
  return {
    critical: critical.filter((dimension) => !isResolved(state, dimension, true)),
    important: important.filter((dimension) => !isResolved(state, dimension, false)),
  };
};

export type InterviewDecision =
  | { action: 'ask'; target: Dimension }
  | { action: 'ask_conflict'; conflict: Conflict }
  | { action: 'propose'; reason: 'coverage' | 'requested' | 'limit' };

export const decideNext = (state: BriefingEngineState, endRequested = false): InterviewDecision => {
  if (endRequested) return { action: 'propose', reason: 'requested' };
  if (state.questionCount >= HARD_QUESTION_LIMIT) return { action: 'propose', reason: 'limit' };

  const blocking = state.conflicts.find((item) => item.blocking);
  if (blocking && state.conflictQuestions < CONFLICT_MAX_ASKS) return { action: 'ask_conflict', conflict: blocking };

  const open = getOpenDimensions(state);
  if (open.critical.length) return { action: 'ask', target: open.critical[0] };
  // Lacunas secundárias só valem a pergunta enquanto a entrevista está curta.
  if (open.important.length && state.questionCount < SOFT_QUESTION_LIMIT) return { action: 'ask', target: open.important[0] };
  return { action: 'propose', reason: 'coverage' };
};

// Usa a pergunta da IA quando ela trata de uma lacuna real; caso contrário, usa o roteiro.
export const resolveQuestion = (
  state: BriefingEngineState,
  decision: Extract<InterviewDecision, { action: 'ask' | 'ask_conflict' }>,
  output: Pick<InterviewOutput, 'assistantMessage' | 'quickReplies' | 'targetDimension'>
) => {
  const hasText = Boolean(output.assistantMessage?.trim());
  const replies = (fallback: string[]) => (output.quickReplies?.length ? output.quickReplies.slice(0, 6) : fallback);

  if (decision.action === 'ask_conflict') {
    return output.targetDimension === 'conflito' && hasText
      ? { message: output.assistantMessage, quickReplies: replies([]), target: 'conflito' as const }
      : {
          message: `Notei um ponto que precisa de confirmação: ${decision.conflict.description} Qual opção vale para o projeto?`,
          quickReplies: [],
          target: 'conflito' as const,
        };
  }

  const open = getOpenDimensions(state);
  const target = output.targetDimension;
  if (target !== 'conflito' && [...open.critical, ...open.important].includes(target) && hasText) {
    return { message: output.assistantMessage, quickReplies: replies(dimensionGuide[target].replies), target };
  }
  const guide = dimensionGuide[decision.target];
  return { message: guide.question, quickReplies: guide.replies, target: decision.target };
};

export const registerQuestion = (state: BriefingEngineState, target: Dimension | 'conflito'): BriefingEngineState => ({
  ...state,
  questionCount: state.questionCount + 1,
  conflictQuestions: state.conflictQuestions + (target === 'conflito' ? 1 : 0),
  asked: target === 'conflito' ? state.asked : { ...state.asked, [target]: (state.asked[target] || 0) + 1 },
});

export const getCoverage = (state: BriefingEngineState, target?: Dimension | 'conflito') => {
  const { critical, important } = requiredDimensions[state.category || 'outro'];
  const weight = critical.length * 2 + important.length;
  const done =
    critical.filter((dimension) => isResolved(state, dimension, true)).length * 2 +
    important.filter((dimension) => isResolved(state, dimension, false)).length;
  return {
    current: Math.min(95, Math.round((done / weight) * 100)),
    total: 100,
    label: !target ? 'Levantamento' : target === 'conflito' ? 'Confirmação' : dimensionGuide[target].label,
  };
};

// O que ficou sem resposta vira dúvida declarada na proposta, nunca um fato presumido.
export const finalizeState = (state: BriefingEngineState): BriefingEngineState => {
  const { critical, important } = requiredDimensions[state.category || 'outro'];
  const pending = [...critical, ...important].filter((dimension) => {
    const status = state.dimensions[dimension]?.status;
    return status !== 'confirmado' && status !== 'nao_se_aplica';
  });
  const conflicts = state.conflicts.map((item) => `Conflito a resolver: ${item.description}`);
  const doubts = [...pending.map((dimension) => `Validar ${dimensionGuide[dimension].label.toLowerCase()} com o cliente.`), ...conflicts];

  return mergeInterview(state, {
    assistantMessage: '',
    quickReplies: [],
    category: state.category || 'outro',
    targetDimension: 'conflito',
    dimensionUpdates: [],
    conflicts: state.conflicts,
    requirements: doubts.map((description) => ({
      kind: 'duvida' as const,
      description,
      priority: 'media' as const,
      origin: 'hipotese' as const,
      dependsOn: [],
    })),
  });
};

const MARKETING_TERMS = ['branding', 'campanha', 'conversao', 'landing', 'funil', 'captacao de leads', 'marca pessoal', 'storytelling'];
const OPERATIONAL_CATEGORIES: ProjectCategory[] = ['sistema_web', 'automacao', 'ia', 'integracao_corporativa'];

export const isOperationalCategory = (category: ProjectCategory | null) =>
  Boolean(category && OPERATIONAL_CATEGORIES.includes(category));

// Remove linguagem de marketing de projetos operacionais, salvo se o próprio cliente a usou.
export const removeOffTopicMarketing = (category: ProjectCategory | null, clientText: string, items: string[]) => {
  if (!isOperationalCategory(category)) return items;
  const client = normalize(clientText);
  const blocked = MARKETING_TERMS.filter((term) => !client.includes(term));
  return items.filter((item) => {
    const text = normalize(item);
    return !blocked.some((term) => text.includes(term));
  });
};
