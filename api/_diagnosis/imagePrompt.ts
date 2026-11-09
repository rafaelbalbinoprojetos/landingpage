// Monta o prompt de imagem em blocos, a partir de dados estruturados do projeto.
// O briefing bruto nunca chega ao modelo de imagem.

export const LAYOUT_PATTERNS = ['corporativo', 'financeiro', 'educacional', 'medico', 'ecommerce', 'mobile', 'landing'] as const;
export type LayoutPattern = (typeof LAYOUT_PATTERNS)[number];

export const VISUAL_STYLES = ['auto', 'glassmorphism_premium', 'enterprise_dark', 'minimal_light', 'futuristic_tech'] as const;
export type VisualStyle = (typeof VISUAL_STYLES)[number];

export type ImageBrief = {
  productName: string;
  productCategory: string;
  objective: string;
  users: string[];
  layoutPattern: LayoutPattern;
  modules: string[];
  kpis: string[];
  charts: string[];
  tableColumns: string[];
  primaryAction: string;
  device: 'desktop' | 'mobile';
  identity: string;
  references: string;
};

const stringArray = { type: 'array', items: { type: 'string' } };

export const imageBriefSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    productName: { type: 'string' },
    productCategory: { type: 'string' },
    objective: { type: 'string' },
    users: stringArray,
    layoutPattern: { type: 'string', enum: [...LAYOUT_PATTERNS] },
    modules: stringArray,
    kpis: stringArray,
    charts: stringArray,
    tableColumns: stringArray,
    primaryAction: { type: 'string' },
    device: { type: 'string', enum: ['desktop', 'mobile'] },
    identity: { type: 'string' },
    references: { type: 'string' },
  },
  required: ['productName', 'productCategory', 'objective', 'users', 'layoutPattern', 'modules', 'kpis', 'charts', 'tableColumns', 'primaryAction', 'device', 'identity', 'references'],
};

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const list = (value: unknown, maxItems: number, maxLength = 48) =>
  (Array.isArray(value) ? value : []).map((item) => text(item, maxLength)).filter(Boolean).slice(0, maxItems);

// Os dados vêm do navegador, então são limitados antes de entrar no prompt.
// Listas curtas também reduzem erros de texto na imagem.
export const sanitizeImageBrief = (raw: unknown): ImageBrief | null => {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Record<string, unknown>;
  const modules = list(input.modules, 7);
  const productName = text(input.productName, 60);
  if (!productName || !modules.length) return null;
  return {
    productName,
    productCategory: text(input.productCategory, 80),
    objective: text(input.objective, 200),
    users: list(input.users, 4),
    layoutPattern: LAYOUT_PATTERNS.includes(input.layoutPattern as LayoutPattern) ? (input.layoutPattern as LayoutPattern) : 'corporativo',
    modules,
    kpis: list(input.kpis, 4),
    charts: list(input.charts, 2),
    tableColumns: list(input.tableColumns, 5, 24),
    primaryAction: text(input.primaryAction, 40),
    device: input.device === 'mobile' ? 'mobile' : 'desktop',
    identity: text(input.identity, 200),
    references: text(input.references, 200),
  };
};

export const inferLayoutPattern = (value: string): LayoutPattern => {
  const source = value.toLowerCase();
  if (/landing|site institucional|p[aá]gina|hotsite|portf[oó]lio/.test(source)) return 'landing';
  if (/e-?commerce|loja|cat[aá]logo|carrinho/.test(source)) return 'ecommerce';
  if (/aplicativo|app mobile|ios|android/.test(source)) return 'mobile';
  if (/cl[ií]nica|m[eé]dic|hospital|paciente|odonto/.test(source)) return 'medico';
  if (/financ|banco|fatura|fluxo de caixa|invest/.test(source)) return 'financeiro';
  if (/educa|escola|curso|aluno|aprendiz/.test(source)) return 'educacional';
  return 'corporativo';
};

// Propostas do modo de reserva não trazem o briefing de imagem; ele é derivado do mockup.
export const briefFromMockup = (raw: unknown): ImageBrief | null => {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Record<string, any>;
  const description = [input.projectCategory, input.mockup?.screenType, input.mockup?.title].filter(Boolean).join(' ');
  const layoutPattern = inferLayoutPattern(description);
  return sanitizeImageBrief({
    productName: input.businessName,
    productCategory: input.projectCategory,
    objective: input.mockup?.title,
    users: [],
    layoutPattern,
    modules: input.mockup?.modules,
    kpis: input.mockup?.dataHighlights,
    charts: [],
    tableColumns: [],
    primaryAction: input.mockup?.primaryAction,
    device: layoutPattern === 'mobile' ? 'mobile' : 'desktop',
    identity: '',
    references: '',
  });
};

const patternDirection: Record<LayoutPattern, { structure: string; components: string; hierarchy: string }> = {
  corporativo: {
    structure: 'Dashboard operacional denso e elegante: menu lateral, barra superior com busca e filtros, linha de indicadores, gráfico principal, painel de alertas e tabela de trabalho.',
    components: 'Filtros avançados, chips de status, alertas e ações por linha.',
    hierarchy: 'Primeiro os indicadores, depois o gráfico principal, por fim a tabela operacional.',
  },
  financeiro: {
    structure: 'Painel financeiro: menu lateral, seletor de período, indicadores de valor, gráfico de evolução, composição por categoria e tabela de lançamentos.',
    components: 'Variações com seta, seletor de período e tabela com valores alinhados à direita.',
    hierarchy: 'Valores de maior peso em destaque, com o gráfico de evolução como foco central.',
  },
  educacional: {
    structure: 'Plataforma de aprendizagem: navegação clara, trilha de progressão, próximas atividades, módulos em andamento e progresso do aluno.',
    components: 'Barras de progresso, marcos da jornada e cartões de atividade.',
    hierarchy: 'Próxima atividade em destaque, seguida do progresso na jornada.',
  },
  medico: {
    structure: 'Sistema de saúde: agenda ou fila de atendimento, ficha resumida e indicadores essenciais, com muito respiro.',
    components: 'Status de atendimento discretos e campos de leitura rápida.',
    hierarchy: 'Clareza e confiança acima de tudo; informação crítica imediatamente legível.',
  },
  ecommerce: {
    structure: 'Interface de loja com produtos, vendas e pedidos: vitrine ou catálogo, resumo de vendas, pedidos recentes e funil de conversão quando for painel.',
    components: 'Cartões de produto com imagem, preço e status de pedido.',
    hierarchy: 'Produto e ação de compra ou gestão de pedidos em primeiro plano.',
  },
  mobile: {
    structure: 'Uma única tela de aplicativo em formato vertical, de borda a borda, com barra de navegação inferior e componentes nativos.',
    components: 'Navegação inferior, cartões tocáveis e ação principal ao alcance do polegar.',
    hierarchy: 'Uma tarefa principal por tela, com áreas de toque generosas.',
  },
  landing: {
    structure: 'Landing page com composição editorial: navegação, hero com mensagem forte e ação principal, e seções seguintes com narrativa e prova.',
    components: 'Botão de ação principal, imagem de destaque e blocos de seção amplos.',
    hierarchy: 'Mensagem e ação principal dominam; o restante conduz a leitura.',
  },
};

const styleDirection: Record<Exclude<VisualStyle, 'auto'>, { name: string; materials: string; palette: string; typography: string }> = {
  glassmorphism_premium: {
    name: 'Glassmorphism Premium',
    materials: 'Fundo com gradientes suaves e profundidade; superfícies translúcidas com blur elegante, bordas finas e luminosidade discreta. Glassmorphism controlado, sem prejudicar a leitura.',
    palette: 'Tons profundos e harmônicos, com um ou dois acentos de cor usados apenas com função.',
    typography: 'Sans-serif moderna, com pesos bem definidos e alto contraste com o fundo.',
  },
  enterprise_dark: {
    name: 'Enterprise Dark',
    materials: 'Fundo escuro sóbrio e superfícies sólidas em camadas, com bordas finas de baixo contraste e sombras contidas.',
    palette: 'Grafite e azul-marinho, com acento único e cores semânticas para status.',
    typography: 'Sans-serif de interface, compacta e muito legível, com números tabulares.',
  },
  minimal_light: {
    name: 'Minimal Light',
    materials: 'Fundo claro, superfícies brancas, bordas muito finas e sombras quase imperceptíveis, com bastante respiro.',
    palette: 'Neutros claros, com um acento de cor sóbrio e cores semânticas discretas.',
    typography: 'Sans-serif limpa, com hierarquia feita por peso e tamanho.',
  },
  futuristic_tech: {
    name: 'Futuristic Tech',
    materials: 'Fundo escuro com profundidade, linhas técnicas finas e brilho muito contido nos elementos ativos. Sofisticado, nunca com aparência de videogame.',
    palette: 'Azul-noite, com ciano e violeta como acentos pontuais.',
    typography: 'Sans-serif geométrica para títulos e monoespaçada apenas em rótulos curtos.',
  },
};

export const resolveStyle = (style: unknown, pattern: LayoutPattern): Exclude<VisualStyle, 'auto'> => {
  if (VISUAL_STYLES.includes(style as VisualStyle) && style !== 'auto') return style as Exclude<VisualStyle, 'auto'>;
  if (pattern === 'medico') return 'minimal_light';
  if (pattern === 'corporativo' || pattern === 'financeiro') return 'enterprise_dark';
  return 'glassmorphism_premium';
};

export const getImageSize = (brief: ImageBrief) =>
  brief.device === 'mobile' || brief.layoutPattern === 'mobile' ? '1024x1536' : '1536x1024';

const joined = (items: string[], fallback: string) => (items.length ? items.join('; ') : fallback);

export const buildImagePrompt = (brief: ImageBrief, requestedStyle: unknown, correction = '') => {
  const pattern = patternDirection[brief.layoutPattern];
  const style = styleDirection[resolveStyle(requestedStyle, brief.layoutPattern)];
  const isLanding = brief.layoutPattern === 'landing';
  const size = getImageSize(brief);

  return [
    `1. CONTEXTO DO PRODUTO\n${brief.productName}: ${brief.productCategory}. Objetivo: ${brief.objective}. Usuários: ${joined(brief.users, 'conforme o tipo de produto')}.`,
    `2. DIREÇÃO DE ARTE\nConceito de interface de um produto digital premium real, pronto para comercialização, com acabamento de portfólio de alto nível. Estilo: ${style.name}. É uma interface, não um infográfico.${brief.references ? ` Referências do cliente: ${brief.references}.` : ''}`,
    `3. ESTRUTURA DA INTERFACE\n${pattern.structure}`,
    `4. COMPONENTES OBRIGATÓRIOS\n${isLanding ? 'Seções' : 'Menu'}: ${joined(brief.modules, 'conforme o produto')}.\n${isLanding ? 'Provas e destaques' : 'Indicadores'}: ${joined(brief.kpis, 'somente os essenciais')}.\n${brief.charts.length ? `Gráficos: ${brief.charts.join('; ')}.\n` : ''}${brief.tableColumns.length ? `Colunas da tabela: ${brief.tableColumns.join('; ')}.\n` : ''}${brief.primaryAction ? `Ação principal: ${brief.primaryAction}.\n` : ''}${pattern.components} Não adicione funcionalidades além das listadas.`,
    `5. HIERARQUIA VISUAL\n${pattern.hierarchy} Alinhamento rigoroso, grade consistente, espaçamento uniforme e proporções corretas.`,
    `6. PALETA E MATERIAIS\n${style.materials} ${brief.identity ? `Identidade do cliente, com prioridade sobre a paleta padrão: ${brief.identity}.` : style.palette} Ícones minimalistas de um único conjunto e gráficos sofisticados.`,
    `7. TIPOGRAFIA\n${style.typography} Todo texto em português do Brasil, com ortografia correta e tamanho legível. Use poucos textos, curtos: prefira menos rótulos a qualquer texto ilegível.`,
    '8. RESTRIÇÕES\nValores numéricos são ilustrativos, redondos e coerentes entre si, sem representar dados reais do cliente. Evite excesso de neon, brilho artificial, cartões gigantes, ícones inconsistentes, visual de template, excesso de informação, texto decorativo, caracteres incorretos, componentes impossíveis, logotipos de terceiros e lorem ipsum.',
    `9. PROPORÇÃO E QUALIDADE\nFormato ${size}, alta resolução. Enquadramento frontal, com a interface preenchendo 100% da imagem de borda a borda, sem perspectiva, monitor, celular, moldura, mesa ou fundo externo.`,
    correction ? `CORREÇÕES OBRIGATÓRIAS DESTA VERSÃO\n${correction}` : '',
  ].filter(Boolean).join('\n\n');
};

export const REVIEW_CRITERIA = ['fidelidade', 'hierarquia', 'legibilidade', 'coerencia', 'consistencia', 'qualidade', 'sem_elementos_indevidos'] as const;

export const imageReviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scores: {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(REVIEW_CRITERIA.map((criterion) => [criterion, { type: 'integer' }])),
      required: [...REVIEW_CRITERIA],
    },
    corrections: { type: 'string' },
  },
  required: ['scores', 'corrections'],
};

export const buildReviewPrompt = (brief: ImageBrief) =>
  `Você é um diretor de arte avaliando o conceito de interface gerado para este projeto: ${JSON.stringify(brief)}. Dê de 1 a 5 para: fidelidade ao briefing, hierarquia, legibilidade, coerência dos componentes, consistência estética, qualidade premium e ausência de elementos indevidos. Seja rigoroso com texto errado ou ilegível. Em corrections, liste instruções específicas para a próxima geração, ou deixe vazio se não houver.`;

export type ImageReview = { scores: Record<(typeof REVIEW_CRITERIA)[number], number>; corrections: string };

export const scoreReview = (review: ImageReview) => Math.min(...REVIEW_CRITERIA.map((criterion) => Number(review.scores[criterion]) || 0));

// Tudo desligado por padrão: cada avaliação e regeneração tem custo.
export const getReviewConfig = () => {
  const number = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return value !== undefined && Number.isFinite(parsed) ? parsed : fallback;
  };
  return {
    enabled: process.env.IMAGE_REVIEW_ENABLED === 'true',
    minScore: number(process.env.IMAGE_REVIEW_MIN_SCORE, 4),
    maxRegenerations: Math.max(0, Math.min(2, number(process.env.IMAGE_REVIEW_MAX_REGENERATIONS, 0))),
    model: process.env.IMAGE_REVIEW_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  };
};
