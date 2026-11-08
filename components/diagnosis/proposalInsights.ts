import { DiagnosisProposal } from './types';

export type ProposalPersona =
  | 'enterprise_system'
  | 'industrial_automation'
  | 'dashboard_bi'
  | 'landing_branding'
  | 'personal_brand'
  | 'athlete_artist'
  | 'clinic_premium'
  | 'law_firm'
  | 'luxury_brand'
  | 'ecommerce'
  | 'institutional_site'
  | 'inventory_warehouse_system'
  | 'gamer_cinematic';

export type ProposalTemplate = {
  persona: ProposalPersona;
  coverSubtitle: string;
  summaryTitle: string;
  scoreTitle: string;
  scoreLabels: {
    operationalComplexity: string;
    automationPotential: string;
    productivityImpact: string;
    traceability: string;
  };
  analysisTitle: string;
  bottlenecksTitle: string;
  structureTitle: string;
  previewTitle: string;
  impactsTitle: string;
  timelineTitle: string;
  investmentTitle: string;
  evolutionTitle: string;
  nextStepsTitle: string;
  ctaHeadline: string;
  nextSteps: string[];
};

export const BUSINESS_CONTEXTS = {
  LANDING_PAGE: 'LANDING_PAGE',
  INSTITUTIONAL_WEBSITE: 'INSTITUTIONAL_WEBSITE',
  HEALTHCARE: 'HEALTHCARE',
  LEGAL: 'LEGAL',
  INDUSTRIAL_SYSTEM: 'INDUSTRIAL_SYSTEM',
  ERP: 'ERP',
  SAAS_PLATFORM: 'SAAS_PLATFORM',
  ECOMMERCE: 'ECOMMERCE',
  SCHEDULING_PLATFORM: 'SCHEDULING_PLATFORM',
  METROLOGY_SYSTEM: 'METROLOGY_SYSTEM',
  OPERATIONAL_CONTROL: 'OPERATIONAL_CONTROL',
  DASHBOARD_SYSTEM: 'DASHBOARD_SYSTEM',
  LOCAL_BUSINESS: 'LOCAL_BUSINESS',
} as const;

const contextSource = (proposal: DiagnosisProposal) =>
  [
    proposal.businessContext,
    proposal.projectCategory,
    proposal.businessName,
    proposal.briefingSummary,
    proposal.initialDiagnosis,
    proposal.mockup.title,
    proposal.strategicScore.recommendedSolutionType,
    ...proposal.suggestedFeatures,
    ...proposal.operationalBottlenecks,
  ].join(' ').toLowerCase();

export const getProposalPersona = (proposal: DiagnosisProposal): ProposalPersona => {
  if (proposal.proposalPersona) return proposal.proposalPersona;
  const source = contextSource(proposal);
  const context = classifyProposalContext(proposal);

  if (['avril lavigne', 'neymar', 'cantora', 'cantor', 'artista', 'atleta', 'jogador', 'fãs', 'fas', 'fandom', 'marca pessoal'].some((term) => source.includes(term))) {
    return 'athlete_artist';
  }
  if (['god of war', 'gameplay', 'trailer', 'playstation', 'xbox', 'steam', 'jogo', 'gamer', 'wishlist', 'comprar agora'].some((term) => source.includes(term))) return 'gamer_cinematic';
  if (['luxo', 'luxuoso', 'lifestyle', 'marca premium'].some((term) => source.includes(term))) return 'luxury_brand';
  if (context === BUSINESS_CONTEXTS.HEALTHCARE || ['clínica', 'clinica', 'estética', 'estetica', 'paciente', 'tratamento'].some((term) => source.includes(term))) return 'clinic_premium';
  if (context === BUSINESS_CONTEXTS.LEGAL) return 'law_firm';
  if (context === BUSINESS_CONTEXTS.ECOMMERCE) return 'ecommerce';
  if (['almoxarifado', 'estoque', 'requisição', 'requisicao', 'baixa de estoque', 'produtos mais requisitados'].some((term) => source.includes(term))) return 'inventory_warehouse_system';
  if (context === BUSINESS_CONTEXTS.DASHBOARD_SYSTEM || ['dashboard', 'bi', 'indicador executivo', 'painel executivo'].some((term) => source.includes(term))) return 'dashboard_bi';
  if (context === BUSINESS_CONTEXTS.METROLOGY_SYSTEM || ['metrolog', 'powerapps', 'fifo', 'calibra', 'laudo'].some((term) => source.includes(term))) return 'industrial_automation';
  if (isEnterpriseProposal(proposal)) return 'enterprise_system';
  if (context === BUSINESS_CONTEXTS.INSTITUTIONAL_WEBSITE || ['site institucional', 'institucional'].some((term) => source.includes(term))) return 'institutional_site';
  return 'landing_branding';
};

const baseTemplate = (persona: ProposalPersona): ProposalTemplate => ({
  persona,
  coverSubtitle: 'Estruturação digital personalizada',
  summaryTitle: 'Visão geral da estratégia',
  scoreTitle: 'Leitura estratégica do projeto',
  scoreLabels: {
    operationalComplexity: 'Complexidade do projeto',
    automationPotential: 'Potencial de automação',
    productivityImpact: 'Impacto esperado',
    traceability: 'Clareza e controle',
  },
  analysisTitle: 'Leitura estratégica identificada',
  bottlenecksTitle: 'Pontos críticos e oportunidades',
  structureTitle: 'Estrutura recomendada',
  previewTitle: 'Preview conceitual da solução',
  impactsTitle: 'Impactos esperados',
  timelineTitle: 'Evolução da solução',
  investmentTitle: 'Estrutura de investimento',
  evolutionTitle: 'Riscos reduzidos e evolução possível',
  nextStepsTitle: 'Próximos passos',
  ctaHeadline: 'A EpicByte estrutura experiências digitais inteligentes, com estratégia, design e tecnologia no mesmo raciocínio.',
  nextSteps: [
    'Validar a proposta com a equipe EpicByte.',
    'Refinar escopo, prioridades e critérios de sucesso.',
    'Organizar a primeira versão com foco no valor principal.',
    'Evoluir a experiência por etapas conforme o projeto amadurece.',
  ],
});

export const getProposalTemplate = (proposal: DiagnosisProposal): ProposalTemplate => {
  const persona = getProposalPersona(proposal);
  const template = baseTemplate(persona);

  if (persona === 'inventory_warehouse_system') {
    return {
      ...template,
      coverSubtitle: 'Sistema interno de almoxarifado e estoque',
      summaryTitle: 'Visão geral da operação',
      scoreTitle: 'Leitura operacional do almoxarifado',
      scoreLabels: {
        operationalComplexity: 'Complexidade operacional',
        automationPotential: 'Potencial de automação',
        productivityImpact: 'Controle de consumo',
        traceability: 'Rastreabilidade',
      },
      analysisTitle: 'Gargalos operacionais identificados',
      bottlenecksTitle: 'Gargalos operacionais',
      structureTitle: 'Módulos do sistema',
      previewTitle: 'Preview conceitual do almoxarifado',
      impactsTitle: 'Riscos reduzidos',
      timelineTitle: 'Evolução da solução',
      evolutionTitle: 'Indicadores, permissões e evolução',
      ctaHeadline: 'A EpicByte estrutura sistemas internos que conectam estoque, requisições, baixa, assinatura e indicadores em um fluxo rastreável.',
      nextSteps: [
        'Validar regra de aprovação antes da retirada.',
        'Definir formato de assinatura e confirmação de entrega.',
        'Confirmar comportamento para indisponibilidade e reposição.',
        'Organizar a primeira versão com cadastro, requisição, baixa, permissões e indicadores.',
      ],
    };
  }

  if (persona === 'gamer_cinematic') {
    return {
      ...template,
      coverSubtitle: 'Landing promocional gamer cinematográfica',
      summaryTitle: 'Narrativa da experiência promocional',
      scoreTitle: 'Leitura de hype e imersão',
      scoreLabels: {
        operationalComplexity: 'Complexidade da experiência',
        automationPotential: 'Potencial de mídia viva',
        productivityImpact: 'Força de conversão',
        traceability: 'Coerência do universo',
      },
      analysisTitle: 'Atmosfera, gameplay e comunidade',
      bottlenecksTitle: 'Riscos de uma campanha genérica',
      structureTitle: 'Jornada promocional recomendada',
      previewTitle: 'Preview cinematográfico gamer',
      impactsTitle: 'Impactos de hype e conversão',
      timelineTitle: 'Evolução da campanha',
      investmentTitle: 'Investimento na experiência promocional',
      evolutionTitle: 'Expansão de mídia, comunidade e lançamento',
      nextStepsTitle: 'Próximos passos da campanha',
      ctaHeadline: 'A EpicByte transforma universos gamer em experiências promocionais imersivas, com atmosfera, trailer, gameplay e CTA no mesmo ritmo visual.',
      nextSteps: [
        'Validar CTA principal: compra, wishlist, pré-venda ou plataforma.',
        'Definir assets disponíveis: trailer, gameplay, screenshots e key art.',
        'Organizar a hierarquia entre atmosfera, história, mídia e conversão.',
        'Evoluir com countdown, comunidade, mídia extra e integrações de loja.',
      ],
    };
  }

  if (persona === 'industrial_automation' || persona === 'enterprise_system') {
    return {
      ...template,
      coverSubtitle: 'Arquitetura operacional personalizada',
      summaryTitle: 'Visão geral da operação',
      scoreTitle: 'Score estratégico do projeto',
      scoreLabels: {
        operationalComplexity: 'Complexidade operacional',
        automationPotential: 'Potencial de automação',
        productivityImpact: 'Impacto na produtividade',
        traceability: 'Rastreabilidade',
      },
      analysisTitle: 'Gargalos operacionais identificados',
      bottlenecksTitle: 'Gargalos operacionais',
      structureTitle: 'Arquitetura da solução',
      previewTitle: 'Preview conceitual da plataforma',
      impactsTitle: 'Impactos operacionais esperados',
      timelineTitle: 'Timeline de implantação',
      evolutionTitle: 'Governança, riscos reduzidos e evolução',
      ctaHeadline: 'A EpicByte estrutura operações digitais inteligentes, conectando processos, dados e decisões.',
      nextSteps: [
        'Validar a proposta com a equipe EpicByte.',
        'Mapear operação, responsáveis, gargalos e integrações necessárias.',
        'Definir arquitetura, permissões, indicadores e critérios de implantação.',
        'Organizar implantação por etapas para reduzir risco e acelerar ganho operacional.',
      ],
    };
  }

  if (persona === 'dashboard_bi') {
    return {
      ...template,
      coverSubtitle: 'Inteligência executiva personalizada',
      summaryTitle: 'Visão executiva do projeto',
      scoreTitle: 'Maturidade analítica',
      scoreLabels: {
        operationalComplexity: 'Complexidade dos dados',
        automationPotential: 'Automação de leitura',
        productivityImpact: 'Apoio à decisão',
        traceability: 'Confiabilidade da informação',
      },
      analysisTitle: 'Desafio de leitura gerencial',
      bottlenecksTitle: 'Pontos cegos de gestão',
      structureTitle: 'Camada de inteligência recomendada',
      previewTitle: 'Preview conceitual do BI',
      impactsTitle: 'Impactos na tomada de decisão',
      timelineTitle: 'Evolução da inteligência de dados',
      evolutionTitle: 'Indicadores, governança de dados e evolução',
    };
  }

  if (persona === 'athlete_artist') {
    return {
      ...template,
      coverSubtitle: 'Experiência editorial de marca pessoal',
      summaryTitle: 'Narrativa da experiência',
      scoreTitle: 'Leitura de presença e percepção',
      scoreLabels: {
        operationalComplexity: 'Complexidade da experiência',
        automationPotential: 'Potencial de conteúdo vivo',
        productivityImpact: 'Força de engajamento',
        traceability: 'Coerência narrativa',
      },
      analysisTitle: 'Presença pública e narrativa',
      bottlenecksTitle: 'Oportunidades de presença e percepção',
      structureTitle: 'Direção criativa e jornada visual',
      previewTitle: 'Preview cinematográfico da experiência',
      impactsTitle: 'Impactos de presença e percepção',
      timelineTitle: 'Evolução da experiência digital',
      investmentTitle: 'Investimento na experiência',
      evolutionTitle: 'Expansão futura da experiência',
      nextStepsTitle: 'Curadoria da experiência',
      ctaHeadline: 'A EpicByte transforma presença pública em experiência digital memorável, com narrativa, direção criativa e tecnologia.',
      nextSteps: [
        'Validar narrativa principal, emoção desejada e universo visual.',
        'Definir hierarquia de trajetória, mídia, comunidade e canais oficiais.',
        'Criar direção visual editorial e protótipo da experiência.',
        'Evoluir conteúdo, motion e campanhas futuras a partir da primeira versão.',
      ],
    };
  }

  if (persona === 'clinic_premium') {
    return {
      ...template,
      coverSubtitle: 'Experiência premium para saúde e estética',
      summaryTitle: 'Jornada do paciente',
      scoreTitle: 'Leitura de confiança e conversão',
      scoreLabels: {
        operationalComplexity: 'Complexidade da jornada',
        automationPotential: 'Potencial de agendamento',
        productivityImpact: 'Clareza para o paciente',
        traceability: 'Confiança percebida',
      },
      analysisTitle: 'Confiança, acolhimento e autoridade',
      bottlenecksTitle: 'Oportunidades na jornada do paciente',
      structureTitle: 'Experiência humanizada recomendada',
      previewTitle: 'Preview clean premium',
      impactsTitle: 'Impactos na confiança e agendamento',
      timelineTitle: 'Evolução da presença clínica',
      ctaHeadline: 'A EpicByte cria experiências digitais que unem confiança, acolhimento e clareza para transformar interesse em agendamento.',
    };
  }

  if (persona === 'law_firm') {
    return {
      ...template,
      coverSubtitle: 'Presença institucional jurídica',
      summaryTitle: 'Posicionamento institucional',
      scoreTitle: 'Leitura de autoridade',
      scoreLabels: {
        operationalComplexity: 'Complexidade institucional',
        automationPotential: 'Potencial de qualificação',
        productivityImpact: 'Força de reputação',
        traceability: 'Clareza de posicionamento',
      },
      analysisTitle: 'Reputação, autoridade e discrição',
      bottlenecksTitle: 'Oportunidades de posicionamento',
      structureTitle: 'Arquitetura institucional recomendada',
      previewTitle: 'Preview institucional sofisticado',
      impactsTitle: 'Impactos de reputação e confiança',
      timelineTitle: 'Evolução da presença institucional',
      ctaHeadline: 'A EpicByte estrutura presença digital jurídica com autoridade, discrição e confiança institucional.',
    };
  }

  if (persona === 'ecommerce') {
    return {
      ...template,
      coverSubtitle: 'Experiência comercial digital',
      summaryTitle: 'Estratégia de venda online',
      analysisTitle: 'Jornada de compra identificada',
      bottlenecksTitle: 'Oportunidades de conversão',
      structureTitle: 'Experiência de compra recomendada',
      previewTitle: 'Preview comercial do ecommerce',
      impactsTitle: 'Impactos comerciais esperados',
      timelineTitle: 'Evolução da loja digital',
    };
  }

  return template;
};

export const classifyProposalContext = (proposal: DiagnosisProposal) => {
  if (proposal.businessContext) return proposal.businessContext;
  const source = contextSource(proposal);

  if (['almoxarifado', 'estoque', 'requisição', 'requisicao', 'baixa de estoque', 'produtos mais requisitados'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.OPERATIONAL_CONTROL;
  if (['metrolog', 'calibra', 'controle dimensional', 'laudo', 'fifo'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.METROLOGY_SYSTEM;
  if (['industrial', 'produção', 'producao', 'chão de fábrica', 'chao de fabrica', 'equipamento', 'inspeção', 'inspecao'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.INDUSTRIAL_SYSTEM;
  if (['dashboard operacional', 'indicador', 'kpi', 'monitoramento'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.DASHBOARD_SYSTEM;
  if (['erp', 'backoffice'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.ERP;
  if (['saas', 'plataforma'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.SAAS_PLATFORM;
  if (['ecommerce', 'loja virtual', 'checkout', 'carrinho', 'catálogo', 'catalogo'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.ECOMMERCE;
  if (['odont', 'clínica', 'clinica', 'consultório', 'consultorio', 'médico', 'medico', 'saúde', 'saude', 'paciente'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.HEALTHCARE;
  if (['advocacia', 'advogado', 'jurídico', 'juridico', 'escritório de advocacia', 'escritorio de advocacia'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.LEGAL;
  if (['agenda', 'agendamento', 'horário', 'horario'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.SCHEDULING_PLATFORM;
  if (['site institucional'].some((term) => source.includes(term))) return BUSINESS_CONTEXTS.INSTITUTIONAL_WEBSITE;
  return BUSINESS_CONTEXTS.LANDING_PAGE;
};

export const isEnterpriseProposal = (proposal: DiagnosisProposal) => {
  const context = classifyProposalContext(proposal);
  const enterpriseContexts = [
    BUSINESS_CONTEXTS.INDUSTRIAL_SYSTEM,
    BUSINESS_CONTEXTS.METROLOGY_SYSTEM,
    BUSINESS_CONTEXTS.OPERATIONAL_CONTROL,
    BUSINESS_CONTEXTS.DASHBOARD_SYSTEM,
    BUSINESS_CONTEXTS.ERP,
  ] as string[];

  return enterpriseContexts.includes(context);
};

export const getImplementationPlan = (proposal: DiagnosisProposal) => {
  if (proposal.implementationPlan?.length) return proposal.implementationPlan;
  const persona = getProposalPersona(proposal);

  if (persona === 'athlete_artist') {
    return [
      'Fase 1 — Curadoria da narrativa, emoção central e universo visual',
      'Fase 2 — Direção criativa, arquitetura editorial e jornada da comunidade',
      'Fase 3 — Design cinematográfico com mídia, trajetória e canais oficiais',
      'Fase 4 — Implementação responsiva com transições, performance e acabamento premium',
      'Fase 5 — Evolução com novos conteúdos, campanhas, motion e experiências futuras',
    ];
  }

  if (persona === 'gamer_cinematic') {
    return [
      'Aumenta impacto visual e sensação de lançamento AAA desde o primeiro scroll.',
      'Organiza trailer, gameplay, história e mídia em uma jornada de hype coerente.',
      'Facilita conversão para compra, wishlist ou plataforma sem quebrar imersão.',
      'Fortalece engajamento da comunidade gamer e percepção de universo épico.',
    ];
  }

  if (persona === 'clinic_premium') {
    return [
      'Fase 1 — Definição da jornada do paciente, confiança e diferenciais',
      'Fase 2 — Direção visual clean premium e estrutura de serviços',
      'Fase 3 — Implementação da página com agendamento, WhatsApp ou formulário',
      'Fase 4 — Ajustes mobile, performance, prova social e conteúdo institucional',
      'Fase 5 — Evolução com relacionamento, campanhas e conteúdos educativos',
    ];
  }

  if (persona === 'law_firm') {
    return [
      'Fase 1 — Posicionamento institucional, tom de autoridade e áreas de atuação',
      'Fase 2 — Direção visual sóbria, arquitetura de conteúdo e narrativa de reputação',
      'Fase 3 — Implementação do website com contato consultivo e presença editorial',
      'Fase 4 — Revisão de clareza, discrição, performance e experiência mobile',
      'Fase 5 — Evolução com artigos, publicações e reforço institucional',
    ];
  }

  if (persona === 'landing_branding' || persona === 'personal_brand' || persona === 'luxury_brand' || persona === 'institutional_site') {
    return [
      'Fase 1 — Direção estratégica da marca, narrativa e percepção desejada',
      'Fase 2 — Design premium, hierarquia visual e jornada de engajamento',
      'Fase 3 — Implementação responsiva com transições e conteúdo refinado',
      'Fase 4 — Testes mobile, performance e polimento visual',
      'Fase 5 — Evolução da experiência digital com campanhas e novos conteúdos',
    ];
  }

  if (persona === 'inventory_warehouse_system') {
    return [
      'Fase 1 — Mapeamento do cadastro de produtos, perfis, áreas e regras de requisição',
      'Fase 2 — Estruturação do fluxo de solicitação, atendimento, assinatura e baixa de estoque',
      'Fase 3 — Desenvolvimento dos módulos de catálogo, requisições, permissões e histórico',
      'Fase 4 — Dashboards de consumo por área, pessoa, produto e período',
      'Fase 5 — Evolução com aprovação, reposição, compras e integrações internas',
    ];
  }

  if (isEnterpriseProposal(proposal)) {
    return [
      'Fase 1 — Mapeamento operacional e critérios de criticidade',
      'Fase 2 — Estruturação da base de dados, permissões e governança',
      'Fase 3 — Desenvolvimento dos módulos principais e fila operacional',
      'Fase 4 — Testes com usuários, validações e ajustes de processo',
      'Fase 5 — Implantação assistida com acompanhamento da operação',
      'Fase 6 — Evolução com indicadores, alertas e integrações enterprise',
    ];
  }

  return [
    'Fase 1 — Validação do objetivo comercial e jornada do cliente',
    'Fase 2 — Design premium e estrutura de conversão',
    'Fase 3 — Implementação da landing, agenda ou painel inicial',
    'Fase 4 — Testes mobile, performance e ajustes finais',
    'Fase 5 — Publicação assistida e primeiros indicadores',
  ];
};

export const getImpactPotential = (proposal: DiagnosisProposal) => {
  if (proposal.operationalImpactPotential?.length) return proposal.operationalImpactPotential;
  const persona = getProposalPersona(proposal);

  if (persona === 'athlete_artist') {
    return [
      'Fortalece a presença pública ao transformar história, mídia e canais oficiais em uma experiência única.',
      'Cria uma jornada mais emocional para fãs, comunidade, imprensa e marcas parceiras.',
      'Aumenta percepção premium por meio de direção criativa, cinematografia e narrativa editorial.',
      'Organiza trajetória, vídeos, fotos e universo visual sem depender apenas de redes sociais.',
      'Prepara a marca pessoal para campanhas, lançamentos, conteúdo exclusivo e novas experiências digitais.',
    ];
  }

  if (persona === 'gamer_cinematic') {
    return [
      'Landing parecer corporativa ou genérica para um universo gamer.',
      'Trailer e gameplay perderem força por falta de hierarquia visual.',
      'CTA de compra desconectado da atmosfera da campanha.',
      'Comunidade não encontrar rapidamente mídia, plataformas e conteúdo oficial.',
    ];
  }

  if (persona === 'clinic_premium') {
    return [
      'Aumenta confiança antes do primeiro contato ao apresentar autoridade, acolhimento e clareza.',
      'Melhora a jornada do paciente entre descoberta, entendimento dos tratamentos e agendamento.',
      'Valoriza diferenciais, equipe, prova social e experiência humanizada.',
      'Reduz insegurança do visitante ao organizar informações sensíveis com linguagem simples e premium.',
    ];
  }

  if (persona === 'law_firm') {
    return [
      'Fortalece reputação institucional com presença sóbria, clara e confiável.',
      'Aumenta percepção de autoridade sem comprometer discrição ou seriedade.',
      'Organiza áreas de atuação, credenciais e contato consultivo em uma jornada mais profissional.',
      'Cria base editorial para artigos, conteúdos jurídicos e posicionamento de longo prazo.',
    ];
  }

  if (persona === 'landing_branding' || persona === 'personal_brand' || persona === 'luxury_brand' || persona === 'institutional_site') {
    return [
      'Fortalece percepção premium por meio de narrativa, identidade visual e clareza de posicionamento.',
      'Cria uma experiência mais fluida entre descoberta, conexão e ação principal.',
      'Aumenta memorabilidade da marca com hierarquia visual, conteúdo e ritmo editorial.',
      'Prepara a presença digital para campanhas, novos conteúdos e evolução por etapas.',
    ];
  }

  if (persona === 'inventory_warehouse_system') {
    return [
      'Aumenta controle sobre requisições, retiradas, assinaturas e baixa de estoque.',
      'Reduz divergências entre quantidade disponível, produto entregue e histórico registrado.',
      'Dá leitura de custos por área, pessoa e período para apoiar compras e reposição.',
      'Revela maiores consumidores e produtos mais requisitados com rankings e curva mensal.',
      'Fortalece rastreabilidade entre solicitante, responsável, operador e administrador.',
    ];
  }

  if (isEnterpriseProposal(proposal)) {
    return [
      'Potencial de redução de retrabalho ao centralizar solicitações, status e responsáveis em um fluxo único.',
      'Pode contribuir para economia de papel e menor dependência de impressão ao digitalizar laudos e registros operacionais.',
      'Tende a acelerar a resposta para demandas críticas ao priorizar filas por peso operacional, e não apenas por ordem de chegada.',
      'Fortalece rastreabilidade e auditoria ao manter histórico, decisões e evidências em ambiente controlado.',
      'Melhora o uso da mão de obra ao revelar saturação, gargalos e produtividade por etapa.',
    ];
  }

  return [
    'Potencial de aumento de conversão ao reduzir fricção entre interesse, contato e agendamento.',
    'Pode reduzir dúvidas repetitivas ao apresentar serviços, diferenciais e próximos passos com clareza.',
    'Melhora a previsibilidade comercial ao organizar solicitações recebidas por canais digitais.',
    'Fortalece a percepção de profissionalismo antes da primeira conversa com o cliente.',
  ];
};

export const getReducedRisks = (proposal: DiagnosisProposal) => {
  if (proposal.reducedOperationalRisks?.length) return proposal.reducedOperationalRisks;
  const persona = getProposalPersona(proposal);

  if (persona === 'athlete_artist') {
    return [
      'Percepção genérica por falta de direção criativa própria.',
      'Narrativa pública dispersa entre redes sociais, notícias e conteúdos de terceiros.',
      'Baixo impacto emocional caso a página pareça apenas um portfólio comum.',
      'Perda de força institucional por não organizar trajetória, mídia e comunidade em um ambiente proprietário.',
    ];
  }

  if (persona === 'gamer_cinematic') {
    return [
      'Cliques em comprar agora, wishlist ou plataformas.',
      'Visualizações e interação com trailer.',
      'Engajamento nas seções de gameplay e mídia.',
      'Tempo de permanência na experiência imersiva.',
    ];
  }

  if (persona === 'clinic_premium') {
    return [
      'Baixa confiança antes do primeiro atendimento.',
      'Dúvidas sobre tratamentos, autoridade profissional ou próximos passos.',
      'Jornada de agendamento confusa ou pouco acolhedora.',
      'Presença visual abaixo do padrão premium esperado pelo público.',
    ];
  }

  if (persona === 'law_firm') {
    return [
      'Imagem institucional genérica ou pouco confiável.',
      'Baixa clareza sobre áreas de atuação e diferenciais.',
      'Contato consultivo sem contexto suficiente para qualificar o visitante.',
      'Percepção de autoridade prejudicada por linguagem ou visual inadequados.',
    ];
  }

  if (persona === 'landing_branding' || persona === 'personal_brand' || persona === 'luxury_brand' || persona === 'institutional_site') {
    return [
      'Primeira impressão abaixo do valor real da marca.',
      'Narrativa pouco clara, reduzindo conexão e memorabilidade.',
      'Experiência visual com aparência de template.',
      'Ação principal pouco evidente dentro da jornada de marca.',
    ];
  }

  if (persona === 'inventory_warehouse_system') {
    return [
      'Retirada sem registro claro de responsável, operador e assinatura.',
      'Baixa de estoque feita fora do fluxo da requisição.',
      'Indisponibilidade sem histórico para reposição ou compras.',
      'Custos por área e por pessoa sem consolidação confiável.',
      'Produtos críticos consumidos sem visibilidade mensal ou ranking.',
    ];
  }

  if (isEnterpriseProposal(proposal)) {
    return [
      'Uso de equipamento com calibração vencida ou status operacional incerto.',
      'Perda de rastreabilidade entre solicitação, execução, laudo e retorno para produção.',
      'Fila mal priorizada, atrasando controles críticos por falta de peso operacional.',
      'Dependência de papel e circulação manual de informações sensíveis.',
      'Dificuldade em auditorias por dados dispersos, incompletos ou sem histórico confiável.',
      'Baixa visibilidade de capacidade, saturação de equipamentos e carga da equipe.',
    ];
  }

  return [
    'Perda de oportunidades por contato pouco claro ou presença digital fraca.',
    'Atendimento manual sobrecarregado por dúvidas repetitivas.',
    'Baixa confiança do cliente antes do primeiro contato.',
    'Dificuldade de acompanhar origem, volume e qualidade dos leads.',
  ];
};

export const getSuccessIndicators = (proposal: DiagnosisProposal) => {
  if (proposal.successIndicators?.length) return proposal.successIndicators;
  const persona = getProposalPersona(proposal);

  if (persona === 'athlete_artist') {
    return [
      'Engajamento nas seções de trajetória, mídia e conteúdo oficial.',
      'Cliques para redes sociais e canais oficiais.',
      'Tempo de permanência na experiência editorial.',
      'Interações com fotos, vídeos, campanhas e conteúdo de comunidade.',
    ];
  }

  if (persona === 'gamer_cinematic') {
    return [
      'Cliques em comprar agora, wishlist ou plataformas.',
      'Visualizações e interação com trailer.',
      'Engajamento nas seções de gameplay e mídia.',
      'Tempo de permanência na experiência imersiva.',
    ];
  }

  if (persona === 'clinic_premium') {
    return [
      'Cliques em agendamento, WhatsApp ou formulário.',
      'Interesse por tratamentos e diferenciais.',
      'Tempo de permanência em prova social, equipe e informações de confiança.',
      'Origem dos contatos e taxa de avanço para atendimento.',
    ];
  }

  if (persona === 'law_firm') {
    return [
      'Solicitações de contato consultivo.',
      'Áreas de atuação mais acessadas.',
      'Leitura de artigos, credenciais e conteúdos institucionais.',
      'Origem e qualidade dos contatos recebidos.',
    ];
  }

  if (persona === 'landing_branding' || persona === 'personal_brand' || persona === 'luxury_brand' || persona === 'institutional_site') {
    return [
      'Engajamento por seção da página.',
      'Cliques na ação principal.',
      'Tempo de permanência e leitura mobile.',
      'Conteúdos, diferenciais ou provas mais acessados.',
    ];
  }

  if (persona === 'inventory_warehouse_system') {
    return [
      'Requisições por área, responsável e período.',
      'Custos por área, pessoa e centro de consumo.',
      'Produtos mais requisitados e maiores consumidores.',
      'Quantidade disponível, baixas realizadas e indisponibilidades.',
      'Histórico de retiradas com assinatura e operador responsável.',
    ];
  }

  if (isEnterpriseProposal(proposal)) {
    return [
      'Tempo médio entre solicitação, execução e retorno do controle.',
      'Volume de demandas por prioridade, status e área solicitante.',
      'Saturação de equipamentos e disponibilidade operacional.',
      'Produtividade por colaborador, turno ou tipo de controle.',
      'Quantidade de laudos digitais emitidos e rastreados.',
    ];
  }

  return [
    'Cliques em WhatsApp, agenda ou formulário.',
    'Taxa de conversão por seção da página.',
    'Origem dos contatos e serviços mais procurados.',
    'Tempo de resposta e oportunidades qualificadas.',
  ];
};

export const getRoiNarrative = (proposal: DiagnosisProposal) => {
  if (proposal.roiNarrative) return proposal.roiNarrative;
  const persona = getProposalPersona(proposal);

  if (persona === 'athlete_artist') {
    return 'O retorno esperado está na força de presença: uma experiência editorial bem construída aumenta percepção premium, organiza narrativa pública e cria um ambiente proprietário para fãs, mídia, marcas e comunidade se conectarem com a trajetória e o universo visual do artista.';
  }

  if (persona === 'clinic_premium') {
    return 'O retorno esperado está em confiança e clareza: uma experiência premium reduz insegurança, valoriza autoridade e facilita a passagem do interesse para o agendamento, preservando acolhimento e sofisticação.';
  }

  if (persona === 'inventory_warehouse_system') {
    return 'O retorno esperado está no controle operacional: menos divergência de estoque, mais rastreabilidade nas retiradas, leitura clara de consumo por área e base confiável para reposição, compras e planejamento de custos.';
  }

  if (persona === 'gamer_cinematic') {
    return 'O retorno esperado está em hype e conversão: uma landing gamer bem direcionada aumenta impacto visual, organiza trailer e gameplay, aproxima comunidade e transforma atmosfera em ação de compra ou wishlist.';
  }

  if (persona === 'law_firm') {
    return 'O retorno esperado está em reputação institucional: a presença digital deve transmitir autoridade, discrição e clareza para qualificar contatos e reforçar posicionamento jurídico sem parecer comercial demais.';
  }

  if (persona === 'landing_branding' || persona === 'personal_brand' || persona === 'luxury_brand' || persona === 'institutional_site') {
    return 'O retorno esperado está na qualidade da experiência: narrativa, direção visual e clareza de posicionamento ajudam a transformar descoberta em conexão, confiança e ação com mais percepção de valor.';
  }

  if (isEnterpriseProposal(proposal)) {
    return 'Com a digitalização dos fluxos críticos, a operação pode reduzir desperdício, acelerar respostas para produção, fortalecer rastreabilidade e criar uma base mais confiável para decisões de capacidade, produtividade e conformidade. Sem dados operacionais completos, a estimativa deve permanecer qualitativa, mas o potencial de ganho é alto quando há volume diário, papel, filas e múltiplos responsáveis.';
  }

  return 'A proposta pode contribuir para maior geração de oportunidades ao tornar a jornada mais clara, confiável e rápida. O ganho tende a aparecer na redução de fricção comercial, melhor organização de contatos e maior profissionalismo percebido pelo cliente.';
};
