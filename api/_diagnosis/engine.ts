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
  'saas',
  'saude',
  'outro',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const DIMENSIONS = [
  'contexto', 'objetivos', 'usuarios', 'processos', 'funcionalidades', 'restricoes', 'entradas', 'saidas', 'regras', 'integracoes',
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

export const FINDING_TYPES = ['prazo_incompativel', 'integracao_indefinida', 'dependencia_terceiros', 'dados_sensiveis', 'regra_ausente', 'complexidade_desproporcional'] as const;
export type Finding = { type: (typeof FINDING_TYPES)[number]; explanation: string; basis: 'fato' | 'hipotese' };

export type BriefingEngineState = {
  sessionId: string;
  initialDescription: string;
  transcript: Array<{ role: 'user' | 'assistant'; content: string }>;
  decisions: string[];
  findings: Finding[];
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
  endIntent?: boolean;
  findings?: Finding[];
  decisions?: string[];
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
  funcionalidades: { label: 'Funcionalidades', question: 'Quais funcionalidades não podem faltar?', replies: ['Cadastros', 'Fluxo de aprovação', 'Painel de indicadores', 'Relatórios'] },
  restricoes: { label: 'Restrições', question: 'Existe alguma restrição técnica, legal ou operacional a respeitar?', replies: ['Exigência legal', 'Tecnologia já definida', 'Uso sem internet', 'Nenhuma conhecida'] },
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
  critical: ['contexto', 'usuarios', 'processos', 'funcionalidades', 'regras', 'integracoes', 'prioridades'],
  important: ['objetivos', 'entradas', 'saidas', 'permissoes', 'seguranca', 'restricoes', 'volumes', 'prazo', 'orcamento'],
} as const;

// Perguntas próprias de cada categoria, usadas quando a pergunta da IA não serve.
export const categoryQuestions: Partial<Record<ProjectCategory, Partial<Record<Dimension, string>>>> = {
  saude: {
    usuarios: 'Quem atende e quem administra: recepção, profissionais de saúde, financeiro?',
    regras: 'Quais regras de atendimento e prontuário precisam ser seguidas?',
    seguranca: 'Quais dados de pacientes serão guardados e quem pode acessá-los?',
  },
  saas: {
    usuarios: 'Quem é o cliente pagante e quem usa a plataforma no dia a dia?',
    regras: 'Como funcionarão os planos, limites e cobrança?',
    volumes: 'Quantas empresas clientes você espera no primeiro ano?',
  },
  aplicativo: {
    entradas: 'O aplicativo precisa de câmera, localização, notificações ou uso sem internet?',
    funcionalidades: 'Qual é a tarefa principal que a pessoa fará no aplicativo?',
  },
  ecommerce: {
    entradas: 'Quantos produtos serão vendidos e como é o controle de estoque?',
    integracoes: 'Quais meios de pagamento e frete você precisa?',
  },
  automacao: {
    processos: 'Qual tarefa repetitiva você quer automatizar e como ela acontece hoje?',
    regras: 'Em quais casos a automação deve parar e chamar uma pessoa?',
  },
  ia: {
    entradas: 'Quais dados ou documentos a inteligência artificial usará?',
    regras: 'O que acontece quando a resposta da IA estiver errada, e quem revisa?',
  },
  integracao_corporativa: {
    integracoes: 'Quais sistemas precisam conversar, e você já tem acesso às APIs ou arquivos deles?',
    regras: 'Em caso de divergência entre os sistemas, qual prevalece?',
  },
  landing_page: {
    objetivos: 'Qual resultado principal essa página deve gerar?',
  },
};

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
  saas: {
    critical: ['contexto', 'usuarios', 'funcionalidades', 'regras', 'prioridades'],
    important: ['integracoes', 'permissoes', 'seguranca', 'volumes', 'restricoes', 'prazo', 'orcamento'],
  },
  saude: {
    critical: ['contexto', 'usuarios', 'processos', 'funcionalidades', 'regras', 'seguranca', 'permissoes'],
    important: ['integracoes', 'volumes', 'restricoes', 'prioridades', 'prazo', 'orcamento'],
  },
  outro: {
    critical: ['contexto', 'objetivos', 'usuarios', 'prioridades'],
    important: ['processos', 'integracoes', 'prazo', 'orcamento'],
  },
};

export const createEmptyState = (sessionId = 'sessao'): BriefingEngineState => ({
  sessionId,
  initialDescription: '',
  transcript: [],
  decisions: [],
  findings: [],
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
const statusFromOrigin = (origin: RequirementOrigin): RequirementStatus =>
  origin === 'cliente' ? 'confirmado' : origin === 'recomendacao_epicbyte' ? 'recomendacao' : 'hipotese_pendente';

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// A resposta da IA também é validada: itens fora do formato são descartados.
export const parseInterviewOutput = (raw: any): InterviewOutput | null => {
  if (!raw || typeof raw.assistantMessage !== 'string' || !Array.isArray(raw.quickReplies) || !Array.isArray(raw.dimensionUpdates) || !Array.isArray(raw.requirements) || !Array.isArray(raw.conflicts)) return null;
  const category = oneOf(PROJECT_CATEGORIES, raw.category);
  if (!category) return null;
  return {
    assistantMessage: clampText(raw.assistantMessage, 900),
    quickReplies: raw.quickReplies.map((item: unknown) => clampText(item, 60)).filter(Boolean).slice(0, 6),
    category,
    targetDimension: oneOf([...DIMENSIONS, 'conflito'] as const, raw.targetDimension) || 'conflito',
    endIntent: raw.endIntent === true,
    dimensionUpdates: raw.dimensionUpdates.flatMap((item: any) => {
      const dimension = oneOf(DIMENSIONS, item?.dimension);
      const status = oneOf(DIMENSION_STATUSES, item?.status);
      return dimension && status ? [{ dimension, status, summary: clampText(item.summary, 400) }] : [];
    }),
    requirements: raw.requirements.slice(0, 20).flatMap((item: any) => {
      const kind = oneOf(REQUIREMENT_KINDS, item?.kind);
      const origin = oneOf(REQUIREMENT_ORIGINS, item?.origin);
      const description = clampText(item?.description, 500);
      if (!kind || !origin || !description) return [];
      return [{ kind, origin, description, priority: oneOf(['alta', 'media', 'baixa'] as const, item.priority) || 'media' as const, dependsOn: Array.isArray(item.dependsOn) ? item.dependsOn.map((dep: unknown) => clampText(dep, 500)).filter(Boolean) : [] }];
    }),
    conflicts: raw.conflicts.slice(0, 8).map((item: any) => ({ description: clampText(item?.description, 300), blocking: item?.blocking === true })).filter((item: Conflict) => item.description),
    findings: (Array.isArray(raw.findings) ? raw.findings : []).slice(0, 10).flatMap((item: any) => {
      const type = oneOf(FINDING_TYPES, item?.type);
      const explanation = clampText(item?.explanation, 400);
      return type && explanation ? [{ type, explanation, basis: item.basis === 'fato' ? 'fato' as const : 'hipotese' as const }] : [];
    }),
    decisions: (Array.isArray(raw.decisions) ? raw.decisions : []).map((item: unknown) => clampText(item, 300)).filter(Boolean).slice(0, 10),
  };
};

export const mergeInterview = (previous: BriefingEngineState, output: InterviewOutput): BriefingEngineState => {
  const state: BriefingEngineState = {
    ...previous,
    dimensions: { ...previous.dimensions },
    requirements: [...previous.requirements],
    category: oneOf(PROJECT_CATEGORIES, output.category) || previous.category,
    conflicts: output.conflicts.filter((item) => item.description?.trim()).slice(0, 8),
    decisions: [...new Set([...previous.decisions, ...(output.decisions || [])])].slice(-30),
    findings: [...previous.findings, ...(output.findings || []).filter((item) => !previous.findings.some((known) => normalize(known.explanation) === normalize(item.explanation)))].slice(-20),
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
  const specific = categoryQuestions[state.category || 'outro']?.[decision.target];
  return { message: specific || guide.question, quickReplies: guide.replies, target: decision.target };
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
const OPERATIONAL_CATEGORIES: ProjectCategory[] = ['sistema_web', 'automacao', 'ia', 'integracao_corporativa', 'saude', 'saas'];

export const isOperationalCategory = (category: ProjectCategory | null) =>
  Boolean(category && OPERATIONAL_CATEGORIES.includes(category));

const blockedMarketing = (clientText: string) => {
  const client = normalize(clientText);
  return MARKETING_TERMS.filter((term) => !client.includes(term));
};

// Remove linguagem de marketing de projetos operacionais, salvo se o próprio cliente a usou.
export const removeOffTopicMarketing = (category: ProjectCategory | null, clientText: string, items: string[]) => {
  if (!isOperationalCategory(category)) return items;
  const blocked = blockedMarketing(clientText);
  return items.filter((item) => !blocked.some((term) => normalize(item).includes(term)));
};

export const removeOffTopicSentences = (category: ProjectCategory | null, clientText: string, text: string) => {
  if (!isOperationalCategory(category) || !text) return text;
  const blocked = blockedMarketing(clientText);
  return text.split(/(?<=[.!?])\s+/).filter((sentence) => !blocked.some((term) => normalize(sentence).includes(term))).join(' ');
};
