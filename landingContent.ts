import { NavItem } from './types';

export const CONTACT_EMAIL = 'contato@epicbyte.tech';

export const navItems: NavItem[] = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Como funciona', href: '#sistema' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Método', href: '#metodo' }
];

export const symptoms = [
  { symptom: 'O mesmo dado é digitado em três lugares.', effect: 'Ninguém sabe qual versão está certa.' },
  { symptom: 'O processo vive na cabeça de quem sempre fez.', effect: 'Férias e desligamentos viram risco operacional.' },
  { symptom: 'O relatório de segunda-feira leva a manhã inteira.', effect: 'A decisão chega depois do problema.' },
  { symptom: 'Vendas, operação e financeiro se falam por WhatsApp.', effect: 'O que foi combinado não fica registrado em lugar nenhum.' }
];

export const services = [
  {
    id: 'sistemas',
    title: 'Sistemas sob medida',
    description: 'Software interno, portais e aplicativos desenhados em torno de como sua empresa realmente trabalha.',
    examples: ['Gestão interna', 'Portal do cliente', 'Aplicativos']
  },
  {
    id: 'automacao',
    title: 'Automação de processos',
    description: 'Rotinas repetitivas passam a rodar sozinhas, com regra clara e histórico do que foi feito.',
    examples: ['Aprovações', 'Cobranças', 'Notificações']
  },
  {
    id: 'integracao',
    title: 'Integração de ferramentas',
    description: 'CRM, ERP, financeiro e planilhas passam a compartilhar a mesma informação, sem redigitação.',
    examples: ['APIs', 'Sincronização', 'Migração de dados']
  },
  {
    id: 'ia',
    title: 'Inteligência artificial aplicada',
    description: 'IA onde ela resolve um problema concreto: ler documentos, responder clientes, resumir dados.',
    examples: ['Assistentes', 'Leitura de documentos', 'Análise']
  }
] as const;

export const networkSources = [
  { id: 'whatsapp', label: 'WhatsApp', results: ['tarefas', 'alertas'], note: 'Pedidos que chegam por mensagem viram tarefas com responsável, e o que foge da regra gera um alerta.' },
  { id: 'planilhas', label: 'Planilhas', results: ['dashboards', 'indicadores'], note: 'Os dados saem de arquivos soltos, entram na base única e alimentam painéis sem consolidação manual.' },
  { id: 'crm', label: 'CRM', results: ['tarefas', 'cobrancas'], note: 'Uma venda fechada no CRM abre as tarefas de execução e prepara a cobrança, sem repasse manual.' },
  { id: 'erp', label: 'ERP', results: ['cobrancas', 'indicadores'], note: 'Os registros do ERP alimentam as cobranças e mantêm os indicadores financeiros atualizados.' },
  { id: 'formularios', label: 'Formulários', results: ['tarefas', 'alertas'], note: 'Cada envio é validado pelas regras do negócio, vira tarefa e sinaliza o que estiver incompleto.' }
] as const;

export const networkResults = [
  { id: 'tarefas', label: 'Tarefas com responsáveis', note: 'Mensagens, vendas e formulários chegam à equipe como tarefas com dono e prazo.' },
  { id: 'cobrancas', label: 'Cobranças automatizadas', note: 'Eventos do CRM e do ERP disparam a cobrança certa, no momento certo.' },
  { id: 'alertas', label: 'Alertas de exceção', note: 'O que foge da regra avisa a pessoa responsável, em vez de passar despercebido.' },
  { id: 'dashboards', label: 'Dashboards', note: 'A gestão consulta os dados em um painel, sem montar relatório à mão.' },
  { id: 'indicadores', label: 'Indicadores atualizados', note: 'Os números são calculados a partir da mesma base usada pela operação.' }
] as const;

export const coreCapabilities = [
  'Banco de dados centralizado',
  'Regras de negócio',
  'Automações',
  'Integrações',
  'Inteligência artificial',
  'Permissões e histórico'
];

export const operationFlow = [
  { title: 'Lead', detail: 'Entra com a origem registrada', explanation: 'O contato chega por qualquer canal e é registrado uma única vez, com a origem identificada.' },
  { title: 'Qualificação', detail: 'Regras definem a prioridade', explanation: 'Critérios definidos com a sua equipe indicam a prioridade e quem deve atender.' },
  { title: 'Proposta', detail: 'Escopo e margem padronizados', explanation: 'A proposta aproveita os dados já coletados e segue um escopo e uma margem padronizados.' },
  { title: 'Execução', detail: 'Tarefas e prazos atribuídos', explanation: 'Com a aprovação, as tarefas são criadas com responsável e prazo, e o andamento fica visível.' },
  { title: 'Cobrança', detail: 'Gerada e conciliada', explanation: 'A entrega dispara a cobrança, e o pagamento é conciliado sem nova digitação.' },
  { title: 'Indicadores', detail: 'Atualizados sem consolidação', explanation: 'Cada etapa alimenta os indicadores, sem ninguém precisar consolidar planilhas.' }
];

export const projects = [
  {
    name: 'Korden',
    category: 'Finanças pessoais com IA',
    description: 'Assistente financeiro que entende texto, áudio e extrato, e responde em português claro quanto a pessoa pode gastar hoje.',
    scope: ['Entrada por texto, áudio e extrato', 'Saldo previsto do mês', 'Alertas antes de apertar'],
    href: 'https://www.korden.com.br',
    linkLabel: 'Visitar korden.com.br',
    accent: '#F97316',
    image: '/media/projects/korden-site.webp',
    imageAlt: 'Captura da página inicial do Korden',
    imageHeight: 800,
    url: 'korden.com.br'
  },
  {
    name: 'MeuShape',
    category: 'Plataforma fitness',
    description: 'Treinos, cardápio e um coach de IA que adapta cada fase da rotina aos objetivos do usuário.',
    scope: ['Treinos guiados', 'Cardápio inteligente', 'Coach de IA com voz'],
    href: 'https://meushape-five.vercel.app/',
    linkLabel: 'Abrir plataforma',
    accent: '#10B981',
    image: '/media/projects/meushape-app.webp',
    imageAlt: 'Captura da tela de acesso da plataforma MeuShape',
    imageHeight: 750,
    url: 'meushape-five.vercel.app'
  },
  {
    name: 'Essência dos Livros',
    category: 'Conteúdo multiformato',
    description: 'Uma mesma base de conteúdo distribuída entre leitura, audiobook e resumo visual animado.',
    scope: ['Leitura', 'Modo audiobook', 'Resumo visual'],
    accent: '#F59E0B'
  },
  {
    name: 'Quality Lens',
    category: 'Qualidade industrial',
    description: 'Medição, análise de tolerância e rastreabilidade de inspeção reunidas em um único fluxo técnico.',
    scope: ['Controle metrológico', 'Análise de tolerância', 'Rastreabilidade'],
    accent: '#22D3EE'
  }
];

export const kordenConversation = [
  { from: 'Usuário', text: 'Quanto posso gastar esse fim de semana?' },
  { from: 'Korden', text: 'Se você gastar até R$180, ainda fecha o mês positivo.' }
];

export const methodSteps = [
  {
    title: 'Diagnóstico',
    description: 'O briefing organiza objetivo, fluxo, dados e integrações. É daí que sai o recorte do que vale construir primeiro.',
    artifacts: ['Objetivo', 'Fluxo atual', 'Dados', 'Integrações']
  },
  {
    title: 'Arquitetura',
    description: 'Dados, regras e telas são definidos antes do código, para o escopo não mudar no meio do caminho.',
    artifacts: ['Modelo de dados', 'Regras', 'Telas']
  },
  {
    title: 'Implantação',
    description: 'A primeira versão entra em uso em uma parte real da operação e é ajustada com quem usa todo dia.',
    artifacts: ['Primeira versão', 'Uso real', 'Ajustes']
  },
  {
    title: 'Evolução',
    description: 'Com o sistema em uso, novas automações e integrações entram por ordem de impacto.',
    artifacts: ['Automações', 'Integrações', 'Prioridades']
  }
];

export const audienceFit = {
  ideal: [
    'Sua empresa cresceu e os controles não acompanharam',
    'A operação depende de planilhas, WhatsApp e ferramentas soltas',
    'O retrabalho entre áreas já custa caro',
    'Você busca um sistema feito para o seu processo'
  ],
  notIdeal: [
    'Você procura apenas uma planilha mais bonita',
    'A operação ainda não tem volume que justifique um sistema',
    'Um software pronto já resolve bem o seu caso',
    'Não há abertura para rever processos internos'
  ]
};
