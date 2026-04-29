import { NavItem } from './types';

export const navItems: NavItem[] = [
  { label: 'Problema', href: '#problema' },
  { label: 'Categoria', href: '#abordagem' },
  { label: 'Arquitetura', href: '#arquitetura' },
  { label: 'Resultados', href: '#prova' },
  { label: 'Método', href: '#metodo' }
];

export const heroMetrics = [
  {
    label: 'Confiabilidade operacional',
    value: '99,4%',
    note: 'Exemplo de impacto mensurável em eventos, status e dados críticos.'
  },
  {
    label: 'Automação em processos repetitivos',
    value: '+72%',
    note: 'Exemplo de ganho operacional após padronização de rotinas.'
  },
  {
    label: 'Tempo de resposta operacional',
    value: '-38%',
    note: 'Exemplo de redução entre evento, decisão e execução.'
  }
] as const;

export const proofMetrics = [
  {
    value: '99,4%',
    label: 'de confiabilidade operacional',
    note: 'Exemplo de impacto mensurável em consistência de status, dados e handoffs críticos.'
  },
  {
    value: '+72%',
    label: 'de automação em processos repetitivos',
    note: 'Exemplo de redução de trabalho manual em rotinas entre CRM, financeiro, vendas e operação.'
  },
  {
    value: '-38%',
    label: 'de tempo de resposta operacional',
    note: 'Exemplo de aceleração entre entrada do evento, regra de negócio e ação executada.'
  }
] as const;

export const operationFlow = [
  {
    title: 'Lead',
    detail: 'Entrada capturada',
    signal: 'Origem sincronizada'
  },
  {
    title: 'Qualificação',
    detail: 'Regras e score',
    signal: 'Prioridade automática'
  },
  {
    title: 'Proposta',
    detail: 'Escopo padronizado',
    signal: 'Tempo e margem visíveis'
  },
  {
    title: 'Execução',
    detail: 'Jobs e responsáveis',
    signal: 'SLA em monitoramento'
  },
  {
    title: 'Cobrança',
    detail: 'Evento financeiro',
    signal: 'Status conciliado'
  },
  {
    title: 'Indicadores',
    detail: 'Painel decisório',
    signal: 'Resposta em tempo real'
  }
] as const;

export const audienceFit = {
  ideal: [
    'Crescem rápido e precisam organizar a operação',
    'Dependem de planilhas, WhatsApp e ferramentas soltas',
    'Precisam reduzir retrabalho entre áreas',
    'Querem previsibilidade financeira e operacional',
    'Buscam sistemas sob medida para escalar'
  ],
  notIdeal: [
    'Procura apenas uma planilha mais bonita',
    'Não tem volume operacional relevante',
    'Quer solução genérica sem diagnóstico',
    'Não pretende mudar processos internos',
    'Busca ferramenta isolada, não arquitetura'
  ]
} as const;

export const architectureSources = ['CRM', 'ERP', 'Planilhas', 'Apps internos', 'Vendas', 'WhatsApp', 'Financeiro'] as const;

export const transformationContent = {
  before: [
    'Controles espalhados e baixa visibilidade operacional',
    'Decisões baseadas em achismo e informacao atrasada',
    'Dependencia de pessoas específicas para tarefas críticas',
    'Crescimento desorganizado e operação reativa'
  ],
  after: [
    'Operação centralizada em arquitetura unica',
    'Processos automatizados e auditaveis',
    'Dados confiáveis em tempo real para decisão',
    'Crescimento estruturado e escalavel'
  ]
} as const;
