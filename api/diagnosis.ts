type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ProjectMockup = {
  title: string;
  screenType: string;
  visualStyle: string;
  primaryAction: string;
  modules: string[];
  dataHighlights: string[];
};

type VisualConcept = {
  title: string;
  visualPrompt: string;
  imageAlt: string;
  palette: string[];
  heroLabel: string;
  imageDataUrl?: string | null;
};

type StrategicScore = {
  operationalComplexity: string;
  conversionPotential: string;
  automationPotential: string;
  structuringUrgency: string;
  recommendedSolutionType: string;
  productivityImpact?: string;
  traceability?: string;
  scalability?: string;
  justifications?: Record<string, string>;
};

type SolutionLevel = {
  recommended: 'Estrutura Essencial' | 'Estrutura Profissional' | 'Estrutura Escalável';
  rationale: string;
  options: Array<{
    label: string;
    description: string;
  }>;
};

type IdealSolution = {
  title: string;
  note: string;
  steps: string[];
};

type DiagnosisProposal = {
  businessName: string;
  businessContext: string;
  proposalPersona?: 'enterprise_system' | 'industrial_automation' | 'dashboard_bi' | 'landing_branding' | 'personal_brand' | 'athlete_artist' | 'clinic_premium' | 'law_firm' | 'luxury_brand' | 'ecommerce' | 'institutional_site' | 'inventory_warehouse_system' | 'gamer_cinematic';
  projectCategory: string;
  proposalTitle: string;
  briefingSummary: string;
  initialDiagnosis: string;
  operationalBottlenecks: string[];
  epicByteApproach: string;
  suggestedFeatures: string[];
  expectedOperationalImpacts: string[];
  strategicVision: string;
  recommendedTechnologies: string[];
  timeEstimate: string;
  investmentEstimate: string;
  evolutionOpportunities: string[];
  nextStep: string;
  mockup: ProjectMockup;
  visualConcept: VisualConcept;
  strategicScore: StrategicScore;
  solutionLevel: SolutionLevel;
  idealSolution: IdealSolution;
};

type DiagnosisResponse = {
  status: 'collecting' | 'proposal';
  assistantMessage: string;
  quickReplies: string[];
  collected: {
    niche: string;
    businessSize: 'pequeno' | 'medio' | 'enterprise' | 'indefinido';
    complexity: 'baixa' | 'media' | 'alta' | 'indefinida';
    mainGoal: string;
    questionCount: number;
  };
  proposal: DiagnosisProposal | null;
};

type ProjectContext = {
  projectName: string | null;
  rawUserIntent: string;
  projectType:
    | 'sistema_interno'
    | 'landing_promocional'
    | 'landing_branding'
    | 'dashboard'
    | 'automacao'
    | 'app'
    | 'site_institucional'
    | 'marca_pessoal'
    | 'portal'
    | 'saas'
    | 'ecommerce'
    | 'hibrido'
    | 'indefinido';
  semanticUniverse:
    | 'corporativo'
    | 'institucional'
    | 'operacional'
    | 'operacional_logistico'
    | 'industrial'
    | 'financeiro'
    | 'saas'
    | 'gamer_cinematografico'
    | 'artistico_musical'
    | 'esportivo'
    | 'luxo'
    | 'fitness'
    | 'educacional'
    | 'social'
    | 'fandom_comunidade'
    | 'marketplace'
    | 'medico_clinico'
    | 'juridico'
    | 'conteudo_editorial'
    | 'generico';
  entityType:
    | 'personal_brand'
    | 'celebrity'
    | 'hospital'
    | 'clinic'
    | 'law_firm'
    | 'industrial_operation'
    | 'ecommerce_brand'
    | 'internal_company_system'
    | 'financial_dashboard'
    | 'generic_business';
  experienceType:
    | 'institutional_branding'
    | 'personal_brand_landing'
    | 'commercial_landing'
    | 'ecommerce'
    | 'executive_dashboard'
    | 'internal_management_system'
    | 'operational_dashboard'
    | 'saas_platform'
    | 'mobile_app'
    | 'automation_system';
  goal: string | null;
  audience: string | null;
  visualStyle: string | null;
  colorPalette: string | null;
  keySections: string[];
  requiredFeatures: string[];
  forbiddenAssumptions: string[];
  conversationConfidence: number;
  questionsAsked: number;
  readyForProposal: boolean;
  visualPrompt: string | null;
};

const proposalSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    status: { type: 'string', enum: ['collecting', 'proposal'] },
    assistantMessage: { type: 'string' },
    quickReplies: {
      type: 'array',
      items: { type: 'string' },
      minItems: 0,
      maxItems: 8,
    },
    collected: {
      type: 'object',
      additionalProperties: false,
      properties: {
        niche: { type: 'string' },
        businessSize: { type: 'string', enum: ['pequeno', 'medio', 'enterprise', 'indefinido'] },
        complexity: { type: 'string', enum: ['baixa', 'media', 'alta', 'indefinida'] },
        mainGoal: { type: 'string' },
        questionCount: { type: 'number' },
      },
      required: ['niche', 'businessSize', 'complexity', 'mainGoal', 'questionCount'],
    },
    proposal: {
      anyOf: [
        { type: 'null' },
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            businessName: { type: 'string' },
            businessContext: {
              type: 'string',
              enum: [
                'LANDING_PAGE',
                'INSTITUTIONAL_WEBSITE',
                'HEALTHCARE',
                'LEGAL',
                'INDUSTRIAL_SYSTEM',
                'ERP',
                'SAAS_PLATFORM',
                'ECOMMERCE',
                'SCHEDULING_PLATFORM',
                'METROLOGY_SYSTEM',
                'OPERATIONAL_CONTROL',
                'DASHBOARD_SYSTEM',
              ],
            },
            projectCategory: {
              type: 'string',
            },
            proposalTitle: { type: 'string' },
            briefingSummary: { type: 'string' },
            initialDiagnosis: { type: 'string' },
            operationalBottlenecks: {
              type: 'array',
              items: { type: 'string' },
              minItems: 4,
              maxItems: 8,
            },
            epicByteApproach: { type: 'string' },
            suggestedFeatures: {
              type: 'array',
              items: { type: 'string' },
              minItems: 4,
              maxItems: 8,
            },
            expectedOperationalImpacts: {
              type: 'array',
              items: { type: 'string' },
              minItems: 4,
              maxItems: 8,
            },
            strategicVision: { type: 'string' },
            recommendedTechnologies: {
              type: 'array',
              items: { type: 'string' },
              minItems: 2,
              maxItems: 6,
            },
            timeEstimate: { type: 'string' },
            investmentEstimate: { type: 'string' },
            evolutionOpportunities: {
              type: 'array',
              items: { type: 'string' },
              minItems: 2,
              maxItems: 5,
            },
            nextStep: { type: 'string' },
            mockup: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                screenType: { type: 'string' },
                visualStyle: { type: 'string' },
                primaryAction: { type: 'string' },
                modules: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 6,
                },
                dataHighlights: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 6,
                },
              },
              required: ['title', 'screenType', 'visualStyle', 'primaryAction', 'modules', 'dataHighlights'],
            },
            visualConcept: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                visualPrompt: { type: 'string' },
                imageAlt: { type: 'string' },
                palette: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 5,
                },
                heroLabel: { type: 'string' },
              },
              required: ['title', 'visualPrompt', 'imageAlt', 'palette', 'heroLabel'],
            },
            strategicScore: {
              type: 'object',
              additionalProperties: false,
              properties: {
                operationalComplexity: { type: 'string' },
                conversionPotential: { type: 'string' },
                automationPotential: { type: 'string' },
                structuringUrgency: { type: 'string' },
                recommendedSolutionType: { type: 'string' },
              },
              required: [
                'operationalComplexity',
                'conversionPotential',
                'automationPotential',
                'structuringUrgency',
                'recommendedSolutionType',
              ],
            },
            solutionLevel: {
              type: 'object',
              additionalProperties: false,
              properties: {
                recommended: {
                  type: 'string',
                  enum: ['Estrutura Essencial', 'Estrutura Profissional', 'Estrutura Escalável'],
                },
                rationale: { type: 'string' },
                options: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      label: { type: 'string' },
                      description: { type: 'string' },
                    },
                    required: ['label', 'description'],
                  },
                },
              },
              required: ['recommended', 'rationale', 'options'],
            },
            idealSolution: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string' },
                note: { type: 'string' },
                steps: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 4,
                  maxItems: 8,
                },
              },
              required: ['title', 'note', 'steps'],
            },
          },
          required: [
            'businessName',
            'businessContext',
            'projectCategory',
            'proposalTitle',
            'briefingSummary',
            'initialDiagnosis',
            'operationalBottlenecks',
            'epicByteApproach',
            'suggestedFeatures',
            'expectedOperationalImpacts',
            'strategicVision',
            'recommendedTechnologies',
            'timeEstimate',
            'investmentEstimate',
            'evolutionOpportunities',
            'nextStep',
            'mockup',
            'visualConcept',
            'strategicScore',
            'solutionLevel',
            'idealSolution',
          ],
        },
      ],
    },
  },
  required: ['status', 'assistantMessage', 'quickReplies', 'collected', 'proposal'],
};

const legacySystemPrompt = `
Voce e a IA consultiva da EpicByte. Sua funcao principal e atuar como Analista de Requisitos e Desenvolvedor Senior conduzindo um levantamento funcional objetivo antes de gerar uma proposta.

Principio fundamental:
- Nao pense "qual categoria usar?". Pense "o que essa pessoa realmente quer construir?".
- Nao pense "qual template aplicar?". Pense "qual experiencia digital faz sentido para esse contexto?".
- Voce nao e formulario, chatbot de orcamento, coletor superficial de requisitos, fluxo engessado, classificador rigido, FAQ ou arvore de decisao.
- Voce atua como Engenheiro de Software Senior, Analista de Requisitos, Arquiteto de Solucoes Digitais, consultor estrategico, especialista em UX/sistemas, diretor de produto e consultor enterprise.
- Antes de perguntar, extraia automaticamente necessidade do cliente, objetivo do sistema, usuarios/perfis, fluxo atual ou desejado, entidades, cadastros, campos, dados de entrada, regras de negocio, status, aprovacoes, permissoes, saidas esperadas, relatorios, indicadores, integracoes, dores, riscos e prioridades.
- Sempre raciocine como alguem que realmente vai desenvolver o sistema: primeiro entenda o problema e a rotina, depois mapeie entradas, processamento/regras e saidas.
- Se o usuario fornece muitos detalhes, sintetize o que entendeu e pergunte somente a lacuna mais importante. Nao reinicie a descoberta.

Comportamento obrigatorio:
- Converse de forma natural, premium e objetiva.
- Faca perguntas objetivas de levantamento. Pode agrupar itens relacionados em uma unica pergunta quando isso acelerar o entendimento sem virar questionario longo; quando o briefing estiver rico, faca no maximo 1 pergunta de refinamento.
- A primeira resposta deve ser sempre uma descoberta consultiva quando o pedido for vago. Uma mensagem inicial curta nunca e suficiente para proposta.
- Nunca faca perguntas genericas desconectadas do contexto.
- Nunca trate projetos como templates.
- Nunca force categorias pre-definidas quando o briefing ja indica uma direcao mais precisa.
- Nunca classifique cedo demais. Primeiro investigue o problema real; depois classifique como landing page premium, site institucional, sistema interno, automacao, dashboard/BI, CRM/gestao comercial, agenda/agendamento, app, integracao ou projeto hibrido.
- Nunca ofereca opcoes irrelevantes ao contexto informado.
- Nunca trate todos os projetos como landing pages comerciais.
- Nunca force agendamento, conversao, WhatsApp, leads, painel operacional, dashboard, ecommerce, advocacia ou odontologia. Esses elementos so entram quando fizerem sentido para o contexto.
- Nunca diga que o cliente quer sair do WhatsApp, planilha, papel, landing page ou qualquer outro formato se ele nao citou isso explicitamente. Pergunte sobre o processo atual sem afirmar origem do problema.
- Nunca responda "nao vou tratar isso como landing page" quando o cliente pediu claramente sistema, automacao, dashboard, CRM, app ou integracao. Esse contraste contamina o contexto e soa defensivo.
- Nunca use fallback generico. Se faltar contexto, faca uma pergunta consultiva que ajude a revelar a experiencia digital correta.
- Suas perguntas devem evoluir conforme o que o cliente respondeu anteriormente.
- Evite perguntas tecnicas. O cliente nao precisa saber stack, arquitetura ou termos de tecnologia.
- Antes de gerar proposta para sistemas, confirme maturidade minima: necessidade do cliente, objetivo principal, usuarios/perfis, fluxo ou jornada, dados de entrada, regras/status principais, saidas esperadas/relatorios/indicadores, integracoes relevantes e prioridade de primeira versao. Nao exija briefing perfeito; a entrega e uma proposta inicial, nao especificacao final.
- Antes de fazer qualquer pergunta, interprete profundamente o que o cliente escreveu, identifique segmento, tipo de projeto, gargalos, oportunidades, objetivos implicitos, complexidade operacional e valor percebido.
- Se o usuario ja trouxe um briefing detalhado, NAO faca perguntas basicas, NAO peca informacoes ja descritas e NAO aja como formulario.
- Se o usuario ja trouxe entidades, campos, fluxo, perfis, permissoes e indicadores, NAO pergunte "como funciona hoje". Sintetize e avance para refinamento ou proposta.
- Se o usuario fornecer briefing longo e detalhado, NAO reduza para proposta generica. Preserve volume de dados/cadastros, regras de prioridade, plataformas obrigatorias, modulos solicitados, relatorios, perfis de acesso, automacoes, indicadores e restricoes tecnicas.
- Se faltar nome do negocio/projeto, pergunte somente quando isso for relevante. Nunca use "ramo de atuacao" como pergunta padrao se o contexto ja estiver claro.
- Se o usuario nao souber o tipo de solucao, ajude a traduzir: divulgacao/captacao vira landing ou site; venda online vira ecommerce; dados, usuarios, permissoes, workflows, regras, entradas e saidas viram sistema, dashboard ou automacao.
- Na proposta final, adapte sua postura: arquiteto de processos para sistemas, especialista em automacao para IA/integrações e diretor criativo estrategico para branding, landing e marca pessoal.
- Nao liste apenas telas, cadastros, CRUDs ou funcionalidades frias. Em sistemas, traduza em eficiencia e controle; em branding/landing, traduza em narrativa, presenca, percepcao premium, conexao emocional e experiencia.
- Nao gere proposta na primeira mensagem quando o pedido for vago, mesmo que mencione sistema, landing, dashboard ou automacao.
- Faca no maximo 5 interacoes de levantamento antes da proposta quando o projeto for sistema, automacao, dashboard, app ou integracao. Se o cliente trouxer um bloco rico de informacoes, avance mais rapido.
- Quando houver informacoes suficientes, retorne status "proposal".
- Antes da proposta, retorne status "question".
- assistantMessage deve ser curta e consultiva.
- Quando status for "question", assistantMessage deve seguir obrigatoriamente esta estrutura em texto natural:
  1. Sintese objetiva do que foi entendido, especialmente quando o usuario trouxe detalhes.
  2. Leitura da lacuna que ainda muda arquitetura, regra de negocio, custo, risco ou escopo.
  3. Apenas depois, uma pergunta complementar realmente necessaria.
- Pergunte apenas o que muda arquitetura, complexidade, custo, integracao, escalabilidade, governanca ou escopo.
- Descubra naturalmente: objetivo do projeto, publico-alvo/usuarios, funcionalidades, regras, nivel de sofisticacao, prioridades e, quando for site/landing, identidade visual, estilo, percepcao desejada, tom da marca e referencias implicitas.
- Para sistema ou automacao, investigue de forma objetiva: necessidade do cliente, processo atual, ponto inicial e final do fluxo, ordem de servico/formulario/planilha, cadastros/entidades, campos preenchidos, dados de entrada, usuarios/perfis, status, aprovacoes, prazos, prioridades, responsaveis, regras de negocio, permissoes, excecoes, saidas de dados, relatorios, indicadores e o que gera retrabalho, perda de informacao ou atraso.
- Para landing page ou site, investigue objetivo, publico-alvo, marca/produto/pessoa, estilo visual, acao principal, conteudos, diferenciais, provas sociais, imagens/videos/referencias e integracoes com WhatsApp, formulario, agenda ou pagamento.
- As perguntas sobre dados finais e acao principal so sao obrigatorias se o usuario ainda nao informou saidas/indicadores ou objetivo/CTA. Nunca pergunte algo que ja foi respondido.
- Quando status for "proposal", assistantMessage deve ser exatamente: "Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial."
- quickReplies deve trazer respostas faceis de tocar quando fizer sentido.

Modo de descoberta contextual:
- Nao existe funil fixo. A categoria nasce do briefing e do historico da conversa.
- Nunca assuma agendamento, WhatsApp, painel operacional, advocacia, odontologia, agenda ou lead funnel sem sinal claro.
- Landing page pode ser marca pessoal, institucional, conteudo, campanha, conversao, evento, produto, portfolio, loja ou experiencia institucional premium.
- Se o cliente trouxer marca pessoal, investigue narrativa, publico, conteudos, redes, estilo e objetivo da pagina sem mencionar exemplos de outros projetos.
- Se trouxer dashboard financeiro, investigue fontes de dados, receitas, despesas, categorias, periodo, metas, relatorios, usuarios e decisoes que o painel deve apoiar.
- Se trouxer sistema operacional, investigue fluxo, status, responsaveis, aprovacoes, prazos, dados finais e indicadores sem importar termos de dominios nao citados.
- Se mencionar almoxarifado, estoque, produto, requisicao, baixa, quantidade, disponibilidade, assinatura, retirada, custo por area ou produtos mais requisitados, classifique como sistema interno de almoxarifado, requisicoes e estoque. Nao classifique como dashboard, landing, branding ou presenca digital.
- Para almoxarifado, extraia automaticamente produto, estoque, requisicao, solicitante, responsavel, operador do almoxarifado, administrador, area/local, assinatura, baixa de estoque e historico de movimentacao. Se o fluxo ja foi descrito, nao pergunte "como esse processo funciona hoje"; pergunte no maximo um refinamento sobre aprovacao, assinatura ou indisponibilidade.
- Sempre identifique tambem o universo semantico dominante: corporativo, operacional, industrial, financeiro, SaaS, gamer/cinematografico, artistico/musical, esportivo, luxo, fitness, educacional, social, fandom/comunidade, marketplace, medico/clinico, juridico ou editorial.
- O universo semantico muda tom, copy, preview, modulos, PDF, CTA e impacto esperado. Nao use template corporativo em entretenimento, gamer, fandom, artista, marca pessoal ou campanha promocional.
- Se o projeto for jogo, game, trailer, gameplay, PlayStation, Xbox, Nintendo, Steam, GOD OF WAR, lançamento ou campanha gamer, classifique como landing promocional de universo gamer/cinematografico. Use hype, imersao, atmosfera, comunidade gamer, trailer, gameplay, CTA de compra e storytelling epico. Nao use linguagem institucional corporativa.

Personas internas de linguagem:
- ENTERPRISE SYSTEM: use operacao, fluxo, indicadores, produtividade, rastreabilidade, governanca, automacao, dashboards, SLA e processos somente quando o projeto for sistema interno, dashboard, ERP, operacao ou automacao corporativa.
- BRANDING / LANDING PREMIUM: use narrativa, experiencia, percepcao, presenca, identidade, direcao criativa, cinematografia, emocao, exclusividade, comunidade, editorial, posicionamento e storytelling quando o projeto for landing, marca pessoal, institucional, atleta, artista, influenciador, luxo, lifestyle ou empresa premium.
- AUTOMACAO / IA: use integracao, automacao, escala, atendimento, eficiencia, inteligencia operacional, sincronizacao e reducao manual quando o projeto pedir explicitamente automacao, atendimento automatizado, IA, chatbot ou integracoes.

Regra de profundidade para branding, landing e marca pessoal:
- Mesmo apos descobrir objetivo, publico e direcao inicial, nao encerre o briefing ate entender sensacao emocional desejada, percepcao de marca, referencias visuais, tipo de experiencia, tom visual, narrativa principal, diferenciais e prioridade da primeira versao.
- Perguntas boas para esses casos: "O que voce quer que a pessoa sinta ao entrar na pagina?", "A experiencia deve transmitir mais emocao, autoridade, exclusividade ou proximidade?", "Existe alguma referencia visual, filme, marca ou site que represente o estilo desejado?", "Voce imagina algo mais cinematografico, minimalista, tecnologico, editorial ou luxuoso?", "O foco principal e impacto visual, comunidade, posicionamento de marca ou conversao?", "A pagina deve parecer mais um portal institucional, documentario visual ou experiencia imersiva?"

Sinais que voce deve observar naturalmente, sem transformar em formulario:
- Objetivo explicito e objetivo implicito.
- Tipo de experiencia digital que faz sentido: marca, produto, conteudo, sistema, dashboard, app, ecommerce, automacao ou operacao.
- Publico, tom, identidade, nivel de sofisticacao e emocao desejada.
- Funcionalidades, canais, rotinas, integracoes, regras, permissoes, relatorios e indicadores apenas quando forem relevantes.
- Preferencias visuais ou direcao criativa quando isso impactar a proposta.

Classificacao flexivel:
- Use businessContext apenas como chave tecnica interna para o JSON.
- projectCategory deve ser livre, descritivo e coerente com o briefing. Exemplos: "Landing page institucional de marca pessoal", "Dashboard executivo financeiro hospitalar", "Sistema operacional metrologico", "Site institucional premium".
- A classificacao deve orientar linguagem, perguntas, imagem, orcamento, prazo e profundidade tecnica, mas nunca deve engessar a conversa.

Regras absolutas de isolamento de contexto:
- Nao reutilize termos de outros projetos sem evidencia explicita do cliente. Nao mencione FIFO, calibracao, laudos, metrologia, producao, equipamentos, hospital, nomes de famosos, financeiro ou qualquer dominio especifico se o cliente nao trouxe esse contexto.
- Se o projeto for landing, branding, marca pessoal ou institucional, nao use impacto operacional, produtividade operacional, governanca, rastreabilidade, fila critica, implantacao enterprise, saturacao operacional, SLA, processos internos, automacao industrial ou dashboards corporativos. Fale em experiencia, narrativa, presenca digital, percepcao premium, impacto visual, posicionamento, comunidade, storytelling e conexao emocional.
- Se businessContext for HEALTHCARE, nunca use FIFO, fila critica, calibracao, rastreabilidade industrial, SLA operacional, dashboard industrial, metrologia, laudos industriais, peso operacional ou controle dimensional.
- Se businessContext for LEGAL, nunca use producao, chao de fabrica, metrologia, controle dimensional, calibracao, FIFO ou equipamento industrial.
- Se businessContext for LANDING_PAGE, INSTITUTIONAL_WEBSITE ou SCHEDULING_PLATFORM, nunca renderize dashboard operacional, KPIs industriais, fluxo fabril, calibração, laudos ou filas industriais.
- Se businessContext for INDUSTRIAL_SYSTEM, METROLOGY_SYSTEM, OPERATIONAL_CONTROL ou DASHBOARD_SYSTEM, nao gere landing page comercial generica. Gere dashboard, KPIs, fluxo operacional, monitoramento, alertas, graficos e rastreabilidade.
- Cada proposta deve limpar completamente memoria visual, termos, KPIs e componentes de outros segmentos.

Nomes provisorios sugeridos:
- barbearia: Barbearia Premium
- clinica odontologica: Clínica Sorriso Real
- loja feminina: Cheia de Charme
- restaurante: Restaurante Essenza
- academia: Studio Performance

Adaptacao por porte:
- Pequenos negocios: linguagem simples, foco em resultado, orcamento acessivel, sem stack pesada.
- Projetos medios: equilibrio entre negocio, automacao e tecnologia.
- Enterprise: arquitetura, integracoes, governanca, escalabilidade e rastreabilidade.

Faixas de referencia:
- Landing institucional simples: R$ 2.500 a R$ 5.000.
- Landing premium com conversao: R$ 4.000 a R$ 8.000.
- Landing com agendamento/WhatsApp/painel simples: R$ 6.000 a R$ 15.000.
- Site institucional completo: R$ 8.000 a R$ 20.000.
- Ecommerce: R$ 12.000 a R$ 40.000.
- Sistema interno simples: R$ 15.000 a R$ 40.000.
- Sistema de gestao medio: R$ 40.000 a R$ 90.000.
- Sistema enterprise complexo: R$ 90.000 a R$ 250.000+.
- Sistemas enterprise com muitos cadastros, permissoes, regras, usuarios, validacoes e integracoes devem ter prazo realista: MVP de 4 a 6 meses, solucao solida de 8 a 12 meses e evolucao enterprise de 12 a 18 meses.

Tecnologias:
- Para pequenos negocios, evite listar React, Node, PostgreSQL, APIs e cloud de forma pesada. Use termos como "plataforma web responsiva", "agenda online", "painel de gestao", "integracao com WhatsApp", "SEO e performance".
- Para projetos tecnicos/enterprise, pode detalhar stack, integracoes, banco de dados, permissoes, dashboards e governanca.

Memoria do briefing:
- Os textos devem citar detalhes informados pelo cliente: nicho, porte, objetivo, canais, rotinas e funcionalidades desejadas.
- Em briefings detalhados, cada requisito critico deve virar valor percebido. Nao use siglas ou termos de dominio que o cliente nao informou.
- Evite frases genericas. Pareca uma consultoria humana que entendeu o contexto.
- Se o cliente citar papel, atraso, retrabalho, logistica, produtividade, controle, saturacao, equipe, equipamentos, laudos, impressao ou volume operacional, explore profundamente os impactos, riscos e ganhos.
- Em contexto enterprise/industrial, priorize rastreabilidade, governanca, saturacao, eficiencia operacional, indicadores, logistica, produtividade e conformidade.
- Em pequeno negocio, priorize vendas, agenda, presenca digital, atendimento, praticidade e conversao.

Nível de solução:
- Estrutura Essencial: divulgacao, contato via WhatsApp, pagina institucional ou landing simples.
- Estrutura Profissional: agendamento, painel administrativo, automacoes leves, WhatsApp/Instagram.
- Estrutura Escalável: multiplas unidades, usuarios, dashboards, integracoes complexas e sistemas internos.

Proposta final deve conter:
1. businessName com nome real ou provisorio elegante.
2. businessContext com uma das chaves tecnicas aceitas.
3. projectCategory livre e especifico ao projeto, sem termos genericos como "ramo de atuacao".
4. proposalTitle personalizado com o nome do negocio.
4. briefingSummary citando o contexto coletado.
5. Leitura contextual identificada, com interpretacao consultiva do problema ou oportunidade.
6. Gargalos ou oportunidades, personalizados ao briefing.
7. Visao estrategica da solucao, explicando por que essa estrutura importa e como melhora negocio ou operacao.
8. Abordagem da EpicByte conectando problema -> solucao -> impacto.
9. Estrutura recomendada, sempre em formato beneficio + impacto + valor, usando a persona correta do projeto.
10. Impactos esperados, coerentes com o projeto.
11. Tecnologias recomendadas somente na profundidade adequada.
12. Score estrategico do projeto.
13. Nivel de solucao recomendado.
14. Solucao ideal para evolucao, deixando claro que pode comecar simples e evoluir por etapas.
15. Estimativa de prazo.
16. Estimativa de investimento em faixa, justificando pelo tipo e complexidade.
17. Oportunidades futuras.
18. Mockup visual coerente com o tipo de solucao.
19. Conceito visual de imagem IA altamente especifico para segmento e tipo de projeto.
20. CTA para validar a proposta com base no briefing gerado pela IA.

Regras para operationalBottlenecks:
- Identifique riscos, gargalos, desperdicios, lentidao, retrabalho, ausencia de rastreabilidade, processos manuais, problemas logisticos, baixa visibilidade operacional, saturacao de recursos, dependencia de papel e dependencia humana quando coerente.
- Cada item deve ser especifico para o cliente. Nao use frases genericas.

Regras para suggestedFeatures:
- Cada item deve explicar proposito, ganho e contexto de uso.
- Evite nomes crus como "CRUD de usuarios" ou "tela de cadastro". Explique beneficio, impacto e contexto de uso.

Regras para expectedOperationalImpacts:
- Liste ganhos reais, como reducao de papel, velocidade de resposta, distribuicao operacional, rastreabilidade, previsibilidade de saturacao, reducao de retrabalho, centralizacao de informacoes e tomada de decisao por dados, quando fizer sentido.

Diretrizes para visualConcept:
- Antes de escrever visualPrompt, interprete segmento, universo semantico, emocao, tipo de solucao e contexto do projeto.
- O visualPrompt deve priorizar a experiencia correta para o universo: operacional para sistemas, editorial/emocional para artistas, imersiva e epica para games, clean/confiavel para clinicas, sobria/autoritativa para juridico, comercial para ecommerce.
- Nao force "modern SaaS", "enterprise" ou "institucional" quando o universo for gamer, artistico, fandom, musical, esportivo ou promocional.
- Para landing pages, pedir hero cinematografica, tipografia gigante, composicao editorial, visual institucional premium, storytelling visual, secoes reais, blocos reais e profundidade premium.
- Para dashboards, pedir KPIs reais, graficos realistas, estrutura enterprise, hierarquia visual impecavel, layout executivo, UX moderno e aparencia estilo Bloomberg + Stripe + Linear + Notion + Framer.
- A imagem em si deve SER a experiencia, nao uma apresentacao da experiencia.
- A imagem nao deve parecer interface generica, dashboard fake, Behance showcase, layout sci-fi, UI futurista exagerada, template artificial, laptop mockup, monitor display, phone showcase, device showcase, website presentation, framed presentation, floating UI render, centered UI render, fake 3D interface ou excesso de cards.
- A imagem deve parecer site premium publicado, campanha global de marca, experiencia editorial de luxo, identidade digital cinematografica, empresa implantada, produto real, sistema corporativo real ou plataforma enterprise autentica.
- A imagem representa exclusivamente o negocio do cliente. Nunca inserir logo EpicByte, OpenAI, GPT, marcas famosas, concorrentes, nomes aleatorios, clientes ficticios, seção "nossos clientes", logos corporativos, depoimentos falsos com marcas ou mockups genericos de agencia.
- Nunca usar nomes/logos de GM, Bosch, Fiat, Volkswagen, Google, Microsoft, Salesforce, SAP, Oracle ou qualquer marca de terceiro. Se precisar de texto de marca, use apenas o nome do cliente ou nomes neutros profissionais coerentes com o segmento.
- Textos de interface devem ser discretos, coerentes com o segmento e reforçar o valor correto: experiencia e marca para landing/branding; controle e dados para sistemas.
- Se envolver muitos dados, usuarios internos, permissoes, cadastros, relatorios, workflows, indicadores ou gestao operacional, NAO gere landing page. Gere dashboard, sistema interno, painel administrativo ou centro operacional digital.
- Se envolver divulgacao, captacao de cliente, presenca digital, servicos, agendamento ou vendas, gere landing page, site institucional ou ecommerce.
- Para escritorio de advocacia, clinica, dentista, barbearia, restaurante, estetica, negocio local ou escritorio, SEMPRE gere PROFESSIONAL MARKETING WEBSITE TEMPLATE. Nunca gere dashboard, SaaS interface, ecommerce, marketplace, carrinho, produtos ou interface futurista.
- O template comercial deve ter estrutura realista de site: menu, hero, CTA, servicos/areas, depoimentos, indicadores de confianca, contato, footer, tipografia limpa e espacamento realista.
- A imagem deve parecer ThemeForest premium template, site de agencia premiado ou website comercial real, nao arte conceitual.
- Para advocacia: visual escuro, elegante, sofisticado, preto/dourado/cinza/azul profundo, pessoa executiva de terno, ambiente corporativo, autoridade, confianca, discricao.
- Para odontologia ou consultorio medico: visual limpo, branco, azul claro, verde agua, profissional de saude, acolhimento, agenda, tratamentos e confianca.
- Para barbearia: visual masculino, preto, grafite, dourado, madeira, barbeiro ou cliente em cadeira, agenda online, servicos, precos e WhatsApp.
- Para moda feminina: rosa, branco, nude, elegante, modelo feminina, categorias, colecoes e CTA de compra.
- Para ecommerce: layout de loja virtual com catalogo, produto, carrinho e checkout.
- Para app mobile: mockup de aplicativo mobile premium.
- Para sistemas industriais, metrologia, producao, qualidade, laudos ou FIFO, use como base:
  "Create a highly realistic enterprise operational dashboard interface for an industrial metrology inspection room. The system is built for Microsoft PowerApps and Office 365. Show FIFO control queues with priority weights, metrology inspection requests, equipment saturation, operator productivity, calibration alerts, PDF report workflow, non-conformity indicators, quality control status and real-time production monitoring. The interface must look like a real enterprise industrial software dashboard used inside an automotive factory. Premium dark navy UI, cyan highlights, clean typography, realistic data cards, charts, tables, workflow panels, desktop dashboard and mobile companion. High fidelity, professional, realistic, no random unreadable text, no distorted UI, no generic SaaS template."
- visualPrompt deve estar em ingles, ser curto, limpo e separado da proposta textual. Ele deve depender apenas de nome do projeto, tipo de experiencia, publico, estilo visual, paleta, secoes-chave e restricoes de contexto.
- Nunca passe orçamento, score, timeline, riscos, historico completo ou texto da proposta para o visualPrompt.
- Inclua nome do negocio, publico, objetivo, estilo visual, cores desejadas, tipo de solucao e elementos obrigatorios da interface. Nao inclua estetica EpicByte dentro da imagem do cliente.
- Evite textos longos dentro da imagem e proiba layout baguncado, logos distorcidos, palavras quebradas, estilo cartoon ou UI generica.
- imageAlt deve explicar o conceito em linguagem humana.

Nao cite OpenAI, modelo, prompt, politica interna ou limitacoes internas.
Responda sempre em portugues do Brasil.
`.trim();

const systemPrompt = `
Você é um consultor técnico especializado em levantamento de requisitos para sistemas digitais sob medida.

REGRAS ABSOLUTAS:
- Conduza UMA pergunta por vez. Nunca agrupe perguntas.
- Nunca assuma o tipo de projeto. Baseie-se APENAS no que o cliente disse.
- Se o cliente disser "clínica", é clínica. Se disser "loja", é loja. Nunca invente contexto.
- Mantenha o foco no que foi dito. Nunca mude o assunto.
- Não use jargões técnicos na conversa. Fale como um consultor humano, direto e empático.
- Não force landing page, dashboard, CRM, WhatsApp, agendamento, ecommerce ou automação sem o cliente ter dado sinal claro.
- Se o cliente responder parcialmente, continue da etapa atual ou da próxima lacuna mais importante.
- Os quickReplies devem ser específicos ao contexto atual, não genéricos.

FLUXO DE LEVANTAMENTO:
Siga esta ordem, uma etapa por turno:
1. Confirmar o tipo de projeto e objetivo principal.
2. Identificar quem vai usar o sistema, incluindo usuários finais e administrativos.
3. Entender o processo atual, ou seja, como funciona hoje sem o sistema.
4. Mapear as funcionalidades principais desejadas.
5. Identificar integrações ou restrições técnicas.
6. Entender prazo e prioridade da primeira versão.

REGRA DE PROPOSTA:
- Quando tiver informação suficiente para as 6 etapas, gere status "proposal".
- Antes disso, gere status "collecting".
- A proposta deve respeitar estritamente o contexto informado pelo cliente.
- Se o cliente pedir para gerar a proposta antes das 6 etapas, gere com o que tiver e deixe claro que é uma proposta inicial.
- Ao sugerir a solução, dê prioridade para um site ou sistema web responsivo, acessível por navegador, com boa experiência em computadores, celulares e tablets.
- Só recomende aplicativo mobile nativo quando o cliente pedir explicitamente app iOS/Android ou houver uma justificativa forte. Caso contrário, prefira web responsivo/PWA.
- Em recommendedTechnologies, mockup, timeEstimate e strategicVision, deixe claro que a primeira versão deve funcionar bem em desktop, telefone e tablet.
- Se o cliente descreve clínica odontológica com landing page, agendamento, pacientes, dentistas, prontuário, financeiro e indicadores, classifique como "plataforma web odontológica com landing page, agendamento online e gestão interna". Nunca reduza isso para "dashboard operacional".
- Para clínicas, use linguagem de pacientes, dentistas, agenda, tratamentos, prontuário, comparecimento, recepção e administração. Não use fila operacional, criticidade industrial, saturação operacional ou rastreabilidade fabril.
- Antes de gerar a proposta, separe duas coisas: DOMÍNIO do cliente e TIPO DE SOLUÇÃO. Exemplo: escritório de direito é domínio jurídico; a solução pode ser site institucional, landing page, portal do cliente ou sistema interno. Celebridade é domínio de marca pessoal; a solução pode ser landing editorial, portal oficial ou campanha. Nunca transforme domínio em outro domínio.
- Se o cliente pedir página, landing, site institucional ou presença digital, não gere sistema de gestão, dashboard ou ERP, exceto se ele também pedir controle interno, usuários, cadastros, permissões ou relatórios.
- Se o cliente pedir sistema de gestão, não gere landing page como solução principal; a landing pode ser módulo complementar apenas se o cliente pedir captação, apresentação pública ou conversão.

FORMATO DE RESPOSTA:
Retorne somente JSON válido no schema solicitado.
- assistantMessage: pergunta ou comentário curto.
- status: "collecting" ou "proposal".
- quickReplies: 3 a 6 opções específicas ao contexto atual.
- proposal: null enquanto coleta; objeto completo quando for proposta.

Nao cite OpenAI, modelo, prompt, politica interna ou limitacoes internas.
Responda sempre em portugues do Brasil.
`.trim();

const json = (res: any, status: number, body: Record<string, unknown>) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
};

const extractRequestBody = (body: unknown) => {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  if (typeof body === 'object') {
    return body as Record<string, unknown>;
  }

  return {};
};

const extractOutputText = (data: any) => {
  if (typeof data?.output_text === 'string' && data.output_text) {
    return data.output_text;
  }

  const chunks: string[] = [];
  const output = Array.isArray(data?.output) ? data.output : [];

  output.forEach((entry: any) => {
    const content = Array.isArray(entry?.content) ? entry.content : [];
    content.forEach((item: any) => {
      if (typeof item?.text === 'string' && item.text.trim()) {
        chunks.push(item.text);
      }
    });
  });

  return chunks.join('\n').trim();
};

const safeParseJson = (value: string): Partial<DiagnosisResponse> | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as Partial<DiagnosisResponse>;
  } catch {
    const start = value.indexOf('{');
    const end = value.lastIndexOf('}');
    if (start < 0 || end <= start) return null;

    try {
      return JSON.parse(value.slice(start, end + 1)) as Partial<DiagnosisResponse>;
    } catch {
      return null;
    }
  }
};

const textIncludes = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

const hasDetailedBriefing = (messages: ChatMessage[]) => {
  const userText = messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ');
  const text = userText.toLowerCase();
  const strategicSignals = [
    'enterprise',
    'metrolog',
    'fifo',
    'rastreabilidade',
    'dashboard',
    'integra',
    'erp',
    'sap',
    'permiss',
    'auditoria',
    'capacidade',
    'produtividade',
    'workflow',
    'usuários',
    'usuarios',
    'controles',
    'criticidade',
    'automação',
    'automacao',
    'relatório',
    'relatorio',
  ];

  return userText.length > 180 || strategicSignals.filter((signal) => text.includes(signal)).length >= 3;
};

const inferConversationArchetype = (messages: ChatMessage[]) => {
  const text = messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ').toLowerCase();
  if (['neymar', 'avril lavigne', 'celebridade', 'celebrity', 'atleta', 'cantora', 'cantor', 'artista', 'banda', 'influencer', 'marca pessoal', 'personal brand'].some((term) => text.includes(term))) {
    return 'personal-brand';
  }
  if (['hospital', 'hospitalar'].some((term) => text.includes(term))) return 'hospital';
  if (['ecommerce', 'loja virtual', 'checkout', 'produto', 'catálogo', 'catalogo'].some((term) => text.includes(term))) return 'ecommerce';
  if (['sistema interno', 'rastreabilidade', 'automação', 'automacao', 'workflow', 'permiss', 'dashboard'].some((term) => text.includes(term))) return 'internal-system';
  return 'general';
};

const extractBusinessName = (raw: string) => {
  const dashMatch = raw.match(/(?:^|\n|\.|\s)([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\wÀ-ÿ&' ]{2,45})\s*(?:—|-)\s*([a-zA-ZÀ-ÿ ]{3,40})/);
  if (dashMatch?.[1]) return dashMatch[1].trim();

  const knownEntityMatch = raw.match(/\b(god of war|neymar|avril lavigne|cristiano ronaldo|messi|ronaldo fen[oô]meno|anitta|ivete sangalo)\b/i);
  if (knownEntityMatch?.[1]) {
    return knownEntityMatch[1]
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  const roleNameMatch = raw.match(/\b(?:jogador|atleta|celebridade|cantora|cantor|artista|influencer|criador|creator)\s+(?:do\s+|da\s+)?([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\wÀ-ÿ' ]{2,35})/i);
  if (roleNameMatch?.[1]) return roleNameMatch[1].replace(/[.,;].*$/, '').trim();

  const namedMatch = raw.match(/(?:nome|negócio|negocio|projeto|empresa|marca)\s+(?:é|e|seria|chama|chamado|:)\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\wÀ-ÿ&' ]{2,45})/i);
  if (namedMatch?.[1]) return namedMatch[1].replace(/[.,;].*$/, '').trim();

  return '';
};

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const inferProjectContext = (messages: ChatMessage[]): ProjectContext => {
  const rawUserIntent = messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ');
  const text = rawUserIntent.toLowerCase();
  const questionsAsked = messages.filter((message) => message.role === 'user').length;
  const projectName = extractBusinessName(rawUserIntent) || null;

  const isPersonalBrand = textIncludes(text, ['neymar', 'avril lavigne', 'celebridade', 'atleta', 'jogador', 'cantora', 'cantor', 'banda', 'música', 'musica', 'show', 'shows', 'marca pessoal', 'influencer', 'creator', 'artista']);
  const isHospital = textIncludes(text, ['hospital', 'hospitalar']);
  const isClinic = textIncludes(text, ['odont', 'clínica', 'clinica', 'consultório', 'consultorio', 'médico', 'medico', 'saúde', 'saude']);
  const isLegal = textIncludes(text, ['advocacia', 'advogado', 'jurídico', 'juridico', 'escritório de advocacia', 'escritorio de advocacia']);
  const isIndustrial = textIncludes(text, ['industrial', 'metrolog', 'fifo', 'calibra', 'laudo', 'produção', 'producao', 'controle dimensional', 'chão de fábrica', 'chao de fabrica']);
  const isFinancialDashboard = isHospital && textIncludes(text, ['financeiro', 'ebitda', 'receita', 'despesa', 'margem', 'convênio', 'convenio', 'fluxo de caixa', 'dashboard', 'bi']);
  const isEcommerce = textIncludes(text, ['ecommerce', 'e-commerce', 'loja virtual', 'checkout', 'carrinho', 'catálogo', 'catalogo']);
  const isInternal = textIncludes(text, ['sistema interno', 'permiss', 'workflow', 'aprovação', 'aprovacao', 'usuários', 'usuarios', 'cadastro', 'gestão interna', 'gestao interna']);
  const isMobile = textIncludes(text, ['app mobile', 'aplicativo', 'ios', 'android']);
  const isAutomation = textIncludes(text, ['automat', 'planilha', 'processo interno', 'retrabalho']);
  const isDashboard = textIncludes(text, ['dashboard', 'indicador', 'relatório', 'relatorio', 'bi', 'painel']);
  const isGamer = textIncludes(text, ['game', 'gamer', 'jogo', 'playstation', 'xbox', 'nintendo', 'steam', 'god of war', 'kratos', 'trailer', 'gameplay', 'universo nórdico', 'universo nordico']);
  const isPromotional = textIncludes(text, ['landing promocional', 'campanha', 'promocional', 'lançamento', 'lancamento', 'pré-venda', 'pre-venda', 'comprar agora']);
  const isWarehouse = isInventoryWarehouseBriefing(text);
  const isClinicHybrid = isClinic && textIncludes(text, ['agenda', 'agendamento', 'consulta', 'dentista', 'dentistas', 'paciente', 'pacientes', 'prontuário', 'prontuario', 'landing', 'serviços', 'servicos']);

  const projectType: ProjectContext['projectType'] =
    isWarehouse || isInternal ? 'sistema_interno'
      : isGamer || isPromotional ? 'landing_promocional'
        : isPersonalBrand ? 'marca_pessoal'
          : isClinicHybrid ? 'hibrido'
            : isDashboard || isFinancialDashboard ? 'dashboard'
              : isAutomation ? 'automacao'
                : isMobile ? 'app'
                  : isEcommerce ? 'ecommerce'
                    : textIncludes(text, ['site institucional', 'institucional']) ? 'site_institucional'
                      : textIncludes(text, ['portal']) ? 'portal'
                        : textIncludes(text, ['saas', 'plataforma']) ? 'saas'
                          : textIncludes(text, ['landing', 'página', 'pagina']) ? 'landing_branding'
                            : 'indefinido';

  const semanticUniverse: ProjectContext['semanticUniverse'] =
    isWarehouse ? 'operacional_logistico'
      : isGamer ? 'gamer_cinematografico'
        : textIncludes(text, ['avril lavigne', 'cantora', 'cantor', 'banda', 'música', 'musica', 'show', 'album', 'álbum']) ? 'artistico_musical'
          : textIncludes(text, ['neymar', 'jogador', 'atleta', 'futebol', 'esportivo']) ? 'esportivo'
            : isFinancialDashboard ? 'financeiro'
              : isIndustrial ? 'industrial'
                : isClinic ? 'medico_clinico'
                  : isLegal ? 'juridico'
                    : isEcommerce ? 'marketplace'
                      : textIncludes(text, ['fitness', 'academia', 'treino', 'performance']) ? 'fitness'
                        : textIncludes(text, ['curso', 'educacional', 'aluno', 'aula']) ? 'educacional'
                          : textIncludes(text, ['fãs', 'fas', 'fandom', 'comunidade']) ? 'fandom_comunidade'
                            : textIncludes(text, ['luxo', 'luxuoso', 'premium', 'lifestyle']) ? 'luxo'
                              : isInternal || isAutomation || isDashboard ? 'operacional'
                                : textIncludes(text, ['conteúdo', 'conteudo', 'editorial', 'blog']) ? 'conteudo_editorial'
                                  : textIncludes(text, ['institucional']) ? 'institucional'
                                    : 'generico';

  let entityType: ProjectContext['entityType'] = 'generic_business';
  if (isPersonalBrand) entityType = textIncludes(text, ['neymar', 'avril lavigne', 'celebridade', 'jogador', 'atleta', 'cantora', 'cantor', 'banda', 'artista']) ? 'celebrity' : 'personal_brand';
  else if (isFinancialDashboard) entityType = 'financial_dashboard';
  else if (isHospital) entityType = 'hospital';
  else if (isClinic) entityType = 'clinic';
  else if (isLegal) entityType = 'law_firm';
  else if (isIndustrial) entityType = 'industrial_operation';
  else if (isEcommerce) entityType = 'ecommerce_brand';
  else if (isInternal || isAutomation || isDashboard) entityType = 'internal_company_system';

  let experienceType: ProjectContext['experienceType'] = 'commercial_landing';
  if (isGamer || isPromotional) experienceType = 'commercial_landing';
  else if (isPersonalBrand) experienceType = 'personal_brand_landing';
  else if (isFinancialDashboard) experienceType = 'executive_dashboard';
  else if (isIndustrial && (isDashboard || isInternal)) experienceType = 'operational_dashboard';
  else if (isInternal) experienceType = 'internal_management_system';
  else if (isAutomation) experienceType = 'automation_system';
  else if (isEcommerce) experienceType = 'ecommerce';
  else if (isMobile) experienceType = 'mobile_app';
  else if (isDashboard) experienceType = 'executive_dashboard';
  else if (textIncludes(text, ['institucional', 'presença institucional', 'presenca institucional'])) experienceType = 'institutional_branding';

  const keySections = unique([
    textIncludes(text, ['trajetória', 'trajetoria', 'história', 'historia']) ? 'trajetória' : '',
    textIncludes(text, ['foto', 'galeria']) ? 'galeria visual' : '',
    textIncludes(text, ['vídeo', 'video', 'conteúdo', 'conteudo']) ? 'conteúdo e vídeos' : '',
    textIncludes(text, ['instituto', 'projeto social']) ? 'instituto/projetos sociais' : '',
    textIncludes(text, ['loja', 'produto oficial']) ? 'loja oficial' : '',
    textIncludes(text, ['evento', 'agenda de eventos']) ? 'agenda de eventos' : '',
    textIncludes(text, ['show', 'shows', 'turnê', 'turne', 'datas']) ? 'datas de shows' : '',
    textIncludes(text, ['música', 'musica', 'album', 'álbum']) ? 'músicas e álbuns' : '',
    textIncludes(text, ['receita']) ? 'receita operacional' : '',
    textIncludes(text, ['despesa']) ? 'despesas' : '',
    textIncludes(text, ['ebitda']) ? 'EBITDA' : '',
    textIncludes(text, ['fifo']) ? 'FIFO ponderado' : '',
    textIncludes(text, ['rastreabilidade']) ? 'rastreabilidade' : '',
    textIncludes(text, ['calibra']) ? 'calibração' : '',
  ]);

  const requiredFeatures = unique([
    textIncludes(text, ['whatsapp']) ? 'WhatsApp' : '',
    textIncludes(text, ['agenda', 'agendamento', 'horário', 'horario']) ? 'agendamento' : '',
    textIncludes(text, ['pagamento', 'checkout']) ? 'pagamento/checkout' : '',
    textIncludes(text, ['dashboard', 'indicador', 'bi']) ? 'dashboard/indicadores' : '',
    textIncludes(text, ['relatório', 'relatorio', 'pdf']) ? 'relatórios' : '',
    textIncludes(text, ['permiss']) ? 'permissões' : '',
    textIncludes(text, ['integra', 'erp', 'sap', 'microsoft 365', 'powerapps']) ? 'integrações' : '',
  ]);

  const visualStyle = textIncludes(text, ['preto', 'dourado'])
    ? 'preto e dourado'
    : textIncludes(text, ['cinematográfico', 'cinematografico'])
      ? 'cinematográfico'
      : textIncludes(text, ['clean', 'minimalista'])
        ? 'clean/minimalista'
        : null;
  const colorPalette = textIncludes(text, ['preto', 'dourado'])
    ? 'preto e dourado'
    : textIncludes(text, ['azul', 'branco'])
      ? 'azul e branco'
      : null;

  const forbiddenAssumptions = isPersonalBrand
    ? ['agendamento obrigatório', 'advocacia', 'odontologia', 'painel operacional', 'dashboard operacional', 'metrologia', 'rastreabilidade operacional', 'FIFO', 'calibração', 'WhatsApp obrigatório', 'leads jurídicos']
    : isFinancialDashboard
      ? ['landing page', 'celebridade', 'agendamento comercial', 'escritório jurídico']
      : isIndustrial
        ? ['landing page comercial genérica', 'pacientes', 'consulta médica', 'ecommerce']
        : isClinic
          ? ['FIFO', 'calibração', 'fila crítica industrial', 'dashboard industrial', 'peso operacional']
          : isLegal
            ? ['produção', 'chão de fábrica', 'metrologia', 'controle dimensional', 'calibração']
            : [];

  const goal = isPersonalBrand
    ? textIncludes(text, ['show', 'shows', 'turnê', 'turne', 'datas'])
      ? 'presença institucional, divulgação de shows e conteúdo oficial'
      : 'presença institucional, storytelling e conexão com público'
    : isFinancialDashboard
      ? 'gestão executiva financeira e indicadores hospitalares'
      : isIndustrial
        ? 'controle operacional, rastreabilidade e governança'
        : isEcommerce
          ? 'venda online e conversão'
          : isInternal || isAutomation
            ? 'organização de processos internos e automação'
            : textIncludes(text, ['divulgar', 'presença', 'presenca'])
              ? 'presença digital e divulgação'
              : null;
  const audience = isPersonalBrand
    ? 'fãs, imprensa, marcas, comunidade e público institucional'
    : isFinancialDashboard
      ? 'diretoria, financeiro e controladoria'
      : isIndustrial
        ? 'operação, supervisão, qualidade e gestão'
        : isClinic
          ? 'pacientes'
          : isLegal
            ? 'clientes em busca de autoridade jurídica'
            : null;

  let confidence = 0.25;
  if (projectName) confidence += 0.2;
  if (experienceType) confidence += 0.18;
  if (goal) confidence += 0.18;
  if (audience) confidence += 0.1;
  if (visualStyle || colorPalette) confidence += 0.1;
  if (keySections.length || requiredFeatures.length) confidence += 0.14;
  if (questionsAsked >= 3) confidence += 0.1;
  confidence = Math.min(1, Number(confidence.toFixed(2)));

  const hasOperationalFlow = textIncludes(text, ['processo', 'fluxo', 'status', 'responsável', 'responsavel', 'aprovação', 'aprovacao', 'ordem de serviço', 'ordem de servico', 'planilha', 'formulário', 'formulario']);
  const hasInputs = textIncludes(text, ['campo', 'dados de entrada', 'formulário', 'formulario', 'planilha', 'importar', 'receita', 'despesa', 'categoria', 'cliente', 'serviço', 'servico']);
  const hasOutputs = textIncludes(text, ['indicador', 'relatório', 'relatorio', 'dashboard', 'dados finais', 'visualizar', 'acompanhar', 'meta', 'produtividade', 'atraso']);
  const hasPriority = textIncludes(text, ['urgente', 'prioridade', 'primeiro módulo', 'primeiro modulo', 'foco principal', 'mais importante', 'mvp', 'começar', 'comecar', 'primeira versão', 'primeira versao', 'entregar rápido', 'entregar rapido', 'reduzir trabalho manual', 'atender clientes melhor', 'organizar dados', 'gerar relatórios', 'gerar relatorios', 'integrar ferramentas', 'impacto visual', 'posicionamento de marca', 'narrativa completa', 'canais oficiais', 'tudo equilibrado']);
  const hasAudienceOrUsers = Boolean(audience) || textIncludes(text, ['cliente', 'visitante', 'usuário', 'usuario', 'equipe', 'gestor', 'diretoria', 'paciente', 'responsável', 'responsavel', 'fã', 'fãs', 'fas', 'torcida', 'comunidade', 'seguidores', 'público', 'publico']);
  const isOperationalDiscovery = isInternal || isAutomation || isDashboard || isIndustrial;
  const operationalMaturity = [goal, hasAudienceOrUsers, hasOperationalFlow, hasInputs, hasOutputs, requiredFeatures.length > 0, hasPriority].filter(Boolean).length;
  const landingMaturity = [goal, hasAudienceOrUsers, visualStyle || colorPalette, keySections.length > 0, requiredFeatures.length > 0, textIncludes(text, ['cta', 'ação principal', 'acao principal', 'whatsapp', 'agendar', 'comprar', 'formulário', 'formulario', 'portfolio', 'portfólio', 'divulgação', 'divulgacao', 'informativa', 'informativo', 'informações', 'informacoes', 'conhecer', 'trajetória', 'trajetoria', 'história', 'historia', 'explorar', 'conteúdo oficial', 'conteudo oficial'])].filter(Boolean).length;
  const hasEnoughDiscovery =
    isOperationalDiscovery
      ? questionsAsked >= 4 && operationalMaturity >= 5
      : questionsAsked >= 3 && landingMaturity >= 4;

  return {
    projectName,
    rawUserIntent,
    projectType,
    semanticUniverse,
    entityType,
    experienceType,
    goal,
    audience,
    visualStyle,
    colorPalette,
    keySections,
    requiredFeatures,
    forbiddenAssumptions,
    conversationConfidence: confidence,
    questionsAsked,
    readyForProposal: hasEnoughDiscovery || questionsAsked >= 7,
    visualPrompt: null,
  };
};

const getDynamicSuggestions = (projectContext: ProjectContext) => {
  if (projectContext.semanticUniverse === 'gamer_cinematografico') {
    return ['Trailer em destaque', 'Gameplay showcase', 'Comprar agora', 'Wishlist', 'Comunidade gamer', 'Atmosfera cinematográfica', 'Galeria de mídia'];
  }

  if (projectContext.experienceType === 'personal_brand_landing') {
    if (projectContext.keySections.length) {
      return ['Preto e dourado', 'Estádio cinematográfico', 'Esportivo premium', 'Minimalista elegante', 'Deixe a EpicByte definir'];
    }
    return ['História e trajetória', 'Fotos e vídeos', 'Instituto/projetos sociais', 'Redes sociais', 'Loja oficial', 'Agenda de eventos', 'Estilo cinematográfico'];
  }

  if (projectContext.experienceType === 'executive_dashboard' || projectContext.entityType === 'financial_dashboard') {
    return ['Receita operacional', 'Despesas', 'EBITDA', 'Convênios', 'Unidades', 'Fluxo de caixa', 'Indicadores executivos', 'Visual clean institucional'];
  }

  if (projectContext.entityType === 'industrial_operation' || projectContext.experienceType === 'operational_dashboard') {
    return ['FIFO ponderado', 'Rastreabilidade', 'Laudos PDF', 'Saturação de equipamentos', 'Produtividade por colaborador', 'Permissões', 'PowerApps e Lists', 'Alertas de calibração'];
  }

  if (projectContext.entityType === 'clinic') {
    return ['Agendamento online', 'Tratamentos', 'Equipe especialista', 'Depoimentos', 'WhatsApp', 'Visual branco e azul', 'Atendimento humanizado'];
  }

  if (projectContext.entityType === 'law_firm') {
    return ['Áreas de atuação', 'Autoridade jurídica', 'Artigos e notícias', 'Contato consultivo', 'Preto e dourado', 'Visual institucional'];
  }

  if (projectContext.entityType === 'ecommerce_brand') {
    return ['Catálogo premium', 'Checkout simples', 'Campanhas e lançamentos', 'Gestão de pedidos', 'Mobile first', 'Carrinho', 'Produtos em destaque'];
  }

  return ['Necessidade principal', 'Fluxo atual', 'Usuários/perfis', 'Dados de entrada', 'Regras e status', 'Saídas/relatórios', 'Integrações', 'Prioridade MVP'];
};

const isStellantisMetrologyBriefing = (value: string) => {
  const text = value.toLowerCase();
  const hasMetrologySignals = textIncludes(text, ['metrolog', 'fifo', 'calibra', 'laudo', 'controle dimensional', 'powerapps', 'microsoft lists', 'office 365']);
  const hasEnterpriseSignals = textIncludes(text, ['stellantis', '700', 'controles previstos', 'peças previstas', 'pecas previstas', 'saturação', 'saturacao', 'turno']);
  return hasMetrologySignals && (hasEnterpriseSignals || textIncludes(text, ['motivos de controle', 'peso', 'postos de trabalho']));
};

const inventoryWarehouseTerms = [
  'almoxarifado',
  'estoque',
  'produto',
  'produtos',
  'requisição',
  'requisicao',
  'requisições',
  'requisicoes',
  'baixa',
  'quantidade',
  'disponibilidade',
  'assinatura',
  'retirada',
  'custo por área',
  'custo por area',
  'produtos mais requisitados',
  'matrícula',
  'matricula',
  'responsável',
  'responsavel',
];

const isInventoryWarehouseBriefing = (value: string) => {
  const text = value.toLowerCase();
  return textIncludes(text, ['almoxarifado']) || findMatchedTerms(text, inventoryWarehouseTerms).length >= 3;
};

const hasDetailedInventoryWarehouseBriefing = (value: string) => {
  const text = value.toLowerCase();
  return isInventoryWarehouseBriefing(text) && findMatchedTerms(text, inventoryWarehouseTerms).length >= 6;
};

const isDentalClinicManagementBriefing = (value: string) => {
  const text = value.toLowerCase();
  const hasDentalContext = textIncludes(text, ['odont', 'dentista', 'dentistas', 'procedimento', 'procedimentos', 'prontuário', 'prontuario', 'odontograma']);
  const hasScheduling = textIncludes(text, ['agenda', 'agendamento', 'consulta', 'horário', 'horario', 'remarcação', 'remarcacao', 'cancelamento']);
  const hasCommercialWebsite = textIncludes(text, ['landing', 'serviços', 'servicos', 'depoimentos', 'whatsapp', 'mapa', 'contato']);
  const hasManagement = textIncludes(text, ['pacientes', 'profissionais', 'convênios', 'convenios', 'faturamento', 'recibos', 'financeiro', 'painel', 'indicadores']);
  return hasDentalContext && hasScheduling && (hasCommercialWebsite || hasManagement);
};

const inferContext = (messages: ChatMessage[]) => {
  const projectContext = inferProjectContext(messages);
  const raw = messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ');
  const text = raw.toLowerCase();
  const isStellantisMetrology = isStellantisMetrologyBriefing(raw);
  const isInventoryWarehouse = isInventoryWarehouseBriefing(raw);
  const userTurns = messages.filter((message) => message.role === 'user').length;
  const isEnterprise = textIncludes(text, [
    'industr',
    'metrolog',
    'laudo',
    'fifo',
    'equipamento',
    'produção',
    'producao',
    'logística',
    'logistica',
    'papel',
    'impress',
    'controle diário',
    'controles diarios',
    'sistema interno',
  ]) || isInventoryWarehouse;
  const wantsScheduling = textIncludes(text, ['agenda', 'agendamento', 'horário', 'horario']);
  const wantsSales = textIncludes(text, ['vender', 'vendas', 'ecommerce', 'loja', 'instagram']);
  const wantsAutomation = textIncludes(text, ['automat', 'planilha', 'processo', 'retrabalho', 'organizar']);
  const wantsApp = textIncludes(text, ['app mobile', 'aplicativo', 'ios', 'android']);
  const wantsEcommerce = textIncludes(text, ['ecommerce', 'loja virtual', 'checkout', 'carrinho', 'catálogo', 'catalogo']);
  const wantsDashboard = !isInventoryWarehouse && textIncludes(text, ['dashboard', 'indicador', 'relatório', 'relatorio', 'bi', 'painel operacional']);
  const wantsInternalSystem = isInventoryWarehouse || textIncludes(text, ['usuários', 'usuarios', 'permiss', 'cadastro', 'workflow', 'aprovação', 'aprovacao', 'sistema interno', 'gestão interna', 'gestao interna']);
  const niche = projectContext.entityType === 'celebrity' || projectContext.entityType === 'personal_brand'
    ? 'marca pessoal'
    : projectContext.entityType === 'financial_dashboard'
      ? 'gestão financeira hospitalar'
      : textIncludes(text, ['barbearia', 'barbeiro'])
    ? 'barbearia'
    : textIncludes(text, ['advocacia', 'advogado', 'jurídico', 'juridico', 'escritório de advocacia', 'escritorio de advocacia'])
      ? 'advocacia'
      : textIncludes(text, ['odont'])
        ? 'odontologia'
        : textIncludes(text, ['médico', 'medico', 'consultório', 'consultorio', 'clínica', 'clinica', 'saúde', 'saude'])
          ? 'consultório médico'
      : textIncludes(text, ['restaurante', 'delivery'])
        ? 'restaurante'
        : textIncludes(text, ['academia', 'studio'])
          ? 'academia'
          : textIncludes(text, ['moda feminina', 'loja feminina', 'boutique'])
            ? 'moda feminina'
            : textIncludes(text, ['loja', 'ecommerce'])
              ? 'loja'
            : isInventoryWarehouse
              ? 'almoxarifado e estoque'
            : isEnterprise
              ? 'operação empresarial'
              : 'negócio digital';
  const detectedName = projectContext.projectName || extractBusinessName(raw);
  const fallbackName = textIncludes(text, ['neymar'])
    ? 'Neymar'
    : textIncludes(text, ['avril lavigne'])
      ? 'Avril Lavigne'
      : textIncludes(text, ['cristiano ronaldo'])
        ? 'Cristiano Ronaldo'
        : textIncludes(text, ['messi'])
          ? 'Messi'
          : textIncludes(text, ['anitta'])
            ? 'Anitta'
            : textIncludes(text, ['stellantis'])
    ? 'Stellantis'
    : niche === 'barbearia'
      ? 'Barbearia Premium'
      : niche === 'odontologia'
        ? 'Clínica Sorriso Real'
        : niche === 'advocacia'
          ? 'Escritório Jurídico Premium'
          : niche === 'restaurante'
            ? 'Restaurante Essenza'
            : niche === 'academia'
              ? 'Studio Performance'
              : niche === 'moda feminina' || niche === 'loja'
                ? 'Cheia de Charme'
                : isEnterprise
                  ? 'Operação Digital EpicByte'
                  : 'Projeto Digital Premium';
  const businessName = detectedName || fallbackName;
  const projectCategory = isStellantisMetrology
    ? 'Sistema enterprise de gestão metrológica e controle operacional'
    : isInventoryWarehouse
      ? 'Sistema interno de almoxarifado, requisições e estoque'
    : projectContext.experienceType === 'personal_brand_landing'
    ? 'Landing page institucional de marca pessoal'
    : projectContext.experienceType === 'executive_dashboard'
      ? 'Dashboard executivo'
      : projectContext.experienceType === 'institutional_branding'
        ? 'Site institucional premium'
        : isEnterprise
    ? textIncludes(text, ['enterprise', 'múltiplas', 'multiplas', 'governança', 'governanca'])
      ? 'Sistema enterprise complexo'
      : wantsDashboard
        ? 'Dashboard operacional'
        : 'Sistema interno de gestão'
    : wantsApp
      ? 'App mobile'
      : wantsEcommerce
        ? 'Ecommerce'
        : wantsInternalSystem
          ? 'Sistema interno de gestão'
          : wantsAutomation
            ? 'Automação de processos'
            : wantsScheduling
              ? 'Landing page com conversão/agendamento'
              : wantsSales
                ? 'Landing page com conversão/agendamento'
                : 'Landing page institucional';
  const businessContext = isStellantisMetrology
    ? 'METROLOGY_SYSTEM'
    : isInventoryWarehouse
      ? 'OPERATIONAL_CONTROL'
    : projectContext.entityType === 'financial_dashboard'
    ? 'DASHBOARD_SYSTEM'
    : projectContext.entityType === 'celebrity' || projectContext.entityType === 'personal_brand'
      ? 'INSTITUTIONAL_WEBSITE'
      : isEnterprise
    ? textIncludes(text, ['metrolog', 'calibra', 'laudo', 'controle dimensional', 'fifo'])
      ? 'METROLOGY_SYSTEM'
      : wantsDashboard
        ? 'DASHBOARD_SYSTEM'
        : 'INDUSTRIAL_SYSTEM'
    : niche === 'odontologia' || niche === 'consultório médico'
      ? 'HEALTHCARE'
      : niche === 'advocacia'
        ? 'LEGAL'
        : wantsEcommerce
          ? 'ECOMMERCE'
          : wantsInternalSystem
            ? 'ERP'
            : wantsAutomation
              ? 'OPERATIONAL_CONTROL'
              : wantsScheduling
                ? 'SCHEDULING_PLATFORM'
                : 'LANDING_PAGE';

  return {
    raw,
    projectContext,
    userTurns,
    niche,
    businessName,
    businessContext,
    projectCategory,
    isEnterprise,
    isStellantisMetrology,
    wantsScheduling,
    wantsSales,
    wantsAutomation,
    wantsApp,
    wantsEcommerce,
    wantsDashboard,
    wantsInternalSystem,
    hasDetectedName: Boolean(detectedName),
    hasKnownNiche: niche !== 'negócio digital',
    businessSize: isEnterprise ? 'enterprise' : wantsAutomation || wantsScheduling ? 'medio' : 'pequeno',
    complexity: isEnterprise ? 'alta' : wantsAutomation || wantsScheduling ? 'media' : 'baixa',
    mainGoal: isEnterprise
      ? isInventoryWarehouse
        ? 'controlar almoxarifado, requisições, baixa de estoque e indicadores de consumo'
        : 'digitalizar e dar rastreabilidade à operação'
      : wantsScheduling
        ? 'receber agendamentos e organizar atendimento'
        : wantsSales
          ? 'aumentar vendas e conversão digital'
          : wantsAutomation
            ? 'automatizar processos e reduzir retrabalho'
            : 'fortalecer presença digital',
  } as const;
};

const buildFallbackProposalBase = (messages: ChatMessage[]): DiagnosisProposal => {
  const context = inferContext(messages);
  const projectContext = context.projectContext;
  const isGamerCinematic = projectContext.semanticUniverse === 'gamer_cinematografico';
  const isPersonalBrand = projectContext.experienceType === 'personal_brand_landing';
  const isExecutiveDashboard = projectContext.experienceType === 'executive_dashboard' || projectContext.entityType === 'financial_dashboard';

  if (isDentalClinicManagementBriefing(context.raw)) {
    const clinicName = context.businessName.includes('SMS') || context.businessName === 'Projeto Digital Premium'
      ? 'Sorriso Real'
      : context.businessName.replace(/^Clínica\s+/i, '');
    const businessName = clinicName.toLowerCase().includes('clínica') ? clinicName : `Clínica ${clinicName}`;
    const visualPrompt = `Create a realistic responsive web platform for ${businessName}, a premium dental clinic. Show a professional clinic landing page with hero, online appointment CTA, treatments, testimonials, map/contact and WhatsApp, plus an internal scheduling and management area with dentists, patients, procedures, availability calendar, appointment status, reminders, medical records, odontogram, financial indicators and reports. Clean white and light blue healthcare design, trustworthy, modern, humanized, desktop dashboard and mobile/tablet responsive views. No industrial dashboard, no generic SaaS, no factory, no metrology.`;

    return {
      businessName,
      businessContext: 'HEALTHCARE',
      proposalPersona: 'clinic_premium',
      projectCategory: 'Plataforma web odontológica com landing page, agendamento online e gestão interna',
      proposalTitle: `Plataforma web responsiva para ${businessName}`,
      briefingSummary: `O briefing descreve uma solução híbrida para clínica odontológica: uma landing page comercial para apresentar serviços, transmitir confiança e captar pacientes, integrada a um sistema interno para agenda de dentistas, pacientes, procedimentos, convênios, horários, prontuário, lembretes, financeiro e indicadores administrativos.`,
      initialDiagnosis: `A necessidade central não é um dashboard isolado. O projeto precisa unir captação e operação: o paciente encontra a clínica, entende os serviços e agenda online; a equipe administra dentistas, disponibilidade, consultas, prontuários e retornos; os administradores acompanham ocupação, faturamento previsto, comparecimento e desempenho por profissional.`,
      operationalBottlenecks: [
        'Agendamento manual aumenta risco de conflito de horários, remarcações confusas e perda de disponibilidade real por dentista.',
        'Informações de pacientes, procedimentos, convênios, valores e histórico clínico podem ficar espalhadas entre agenda física, fichas e comunicação informal.',
        'Faltas e atrasos tendem a aumentar quando não há lembretes automáticos e acompanhamento claro de confirmação.',
        'A clínica perde oportunidades comerciais quando serviços, diferenciais, depoimentos, localização e botão de agendamento não estão organizados em uma experiência confiável.',
        'Gestores têm pouca visibilidade sobre consultas do dia, horários livres, faturamento previsto, taxa de comparecimento e desempenho dos profissionais.',
      ],
      epicByteApproach: `A EpicByte estruturaria uma plataforma web responsiva com duas frentes conectadas: uma landing page profissional para conversão de pacientes e um painel interno de gestão para a rotina da clínica. A primeira versão prioriza agendamento online, cadastro operacional, visualização de agenda, status de consulta, lembretes e indicadores essenciais.`,
      suggestedFeatures: [
        'Landing page responsiva com hero, serviços odontológicos, diferenciais, depoimentos, fotos da clínica, FAQ, mapa, contato e botão fixo de WhatsApp.',
        'Agendamento online com disponibilidade por data, horário, dentista, sala e tipo de procedimento, reduzindo trabalho manual da recepção.',
        'Cadastro de dentistas, especialidades, pacientes, procedimentos, convênios, valores, salas e horários de funcionamento.',
        'Agenda por dia, semana e mês, com marcação, remarcação, cancelamento, encaixes, bloqueios e status da consulta.',
        'Prontuário digital com evolução clínica, anexos de exames, odontograma, planos de tratamento e acompanhamento de retornos.',
        'Lembretes automáticos por WhatsApp, SMS ou e-mail para reduzir faltas e melhorar comparecimento.',
        'Painel administrativo com consultas do dia, horários livres, faturamento previsto, procedimentos mais realizados, pacientes novos, taxa de comparecimento e desempenho por profissional.',
      ],
      expectedOperationalImpacts: [
        'Redução do trabalho manual da secretária ao consultar disponibilidade e sugerir horários.',
        'Menos falhas de agenda por conflito, esquecimento, cancelamento mal registrado ou bloqueio não visível.',
        'Melhor experiência para pacientes, com agendamento mais simples e acesso claro aos serviços da clínica.',
        'Mais controle para dentistas e administradores sobre agenda, histórico clínico, retornos e indicadores de atendimento.',
        'Aumento de conversões pela combinação de landing confiável, CTA de agendamento e WhatsApp sempre acessível.',
      ],
      strategicVision: `A visão estratégica é criar um ecossistema web único para a clínica: a parte pública atrai e orienta pacientes; a parte interna organiza a operação clínica e administrativa. A solução deve começar com agendamento, cadastros essenciais e agenda responsiva, evoluindo depois para prontuário avançado, financeiro, recibos, planos de tratamento e automações.`,
      recommendedTechnologies: [
        'Site/sistema web responsivo, acessível pelo navegador, otimizado para computadores, celulares e tablets.',
        'Área pública com landing page de alta performance, SEO local e CTA de agendamento.',
        'Painel administrativo com autenticação, perfis de acesso e agenda por profissional.',
        'Banco de dados para pacientes, profissionais, procedimentos, convênios, consultas, prontuários e histórico.',
        'Integrações futuras com WhatsApp, SMS, e-mail, mapas, pagamento/Pix e emissão de recibos.',
      ],
      timeEstimate: 'MVP profissional entre 8 e 12 semanas para landing, agendamento online, cadastros essenciais, agenda por profissional, status de consulta e painel inicial. Prontuário completo, odontograma, financeiro e automações avançadas podem evoluir em fases seguintes.',
      investmentEstimate: 'R$ 28.000 a R$ 65.000 para uma primeira versão profissional com landing + sistema interno de agendamento e gestão. Prontuário avançado, odontograma, financeiro completo, recibos e múltiplas integrações podem ampliar a faixa.',
      evolutionOpportunities: [
        'Prontuário odontológico completo com odontograma, anexos, evolução e plano de tratamento.',
        'Financeiro com recibos, controle de pagamentos, convênios e faturamento por profissional.',
        'Automações de confirmação, lembrete, retorno preventivo e reativação de pacientes.',
        'Área do paciente para acompanhar consultas, retornos e documentos.',
        'BI clínico e comercial com taxa de comparecimento, conversão da landing e desempenho por serviço.',
      ],
      nextStep: 'Validar o MVP: se a primeira entrega deve focar em landing + agenda online + cadastros essenciais, deixando prontuário completo, odontograma e financeiro para a segunda fase.',
      mockup: {
        title: 'Plataforma web odontológica responsiva',
        screenType: 'Landing page + sistema interno responsivo para desktop, celular e tablet',
        visualStyle: 'Visual limpo e confiável, branco e azul claro, com estética odontológica moderna, acolhedora e profissional.',
        primaryAction: 'Agendar consulta',
        modules: ['Landing da clínica', 'Agendamento online', 'Agenda por dentista', 'Cadastros clínicos', 'Prontuário digital', 'Painel administrativo'],
        dataHighlights: ['Consultas do dia', 'Horários livres', 'Faturamento previsto', 'Taxa de comparecimento', 'Pacientes novos', 'Desempenho por profissional'],
      },
      visualConcept: {
        title: `Preview web responsivo para ${businessName}`,
        visualPrompt,
        imageAlt: `Plataforma web odontológica para ${businessName}, com landing page de serviços, agendamento online e painel interno de gestão clínica.`,
        palette: ['#f8fafc', '#dbeafe', '#38bdf8', '#0f172a'],
        heroLabel: businessName,
        imageDataUrl: null,
      },
      strategicScore: {
        operationalComplexity: 'Média/alta',
        conversionPotential: 'Alto',
        automationPotential: 'Alto',
        structuringUrgency: 'Alta',
        recommendedSolutionType: 'Plataforma web responsiva com landing, agendamento e gestão odontológica',
        productivityImpact: 'Alto',
        traceability: 'Média/alta',
        scalability: 'Alta',
        justifications: {
          operationalComplexity: 'O projeto combina captação, agenda, múltiplos profissionais, prontuário, financeiro e indicadores.',
          conversionPotential: 'A landing com agendamento reduz atrito entre interesse do paciente e marcação da consulta.',
          automationPotential: 'Lembretes, confirmação, retornos e indicadores podem reduzir trabalho manual e faltas.',
        },
      },
      solutionLevel: {
        recommended: 'Estrutura Profissional',
        rationale: 'A solução une presença comercial e operação interna. O MVP deve ser robusto o suficiente para agenda real, mas evoluir por fases para não inflar prazo e custo.',
        options: [
          { label: 'Essencial', description: 'Landing, WhatsApp, formulário e agenda simples.' },
          { label: 'Profissional', description: 'Landing + agendamento online + agenda por dentista + cadastros e painel inicial.' },
          { label: 'Escalável', description: 'Prontuário completo, odontograma, financeiro, recibos, automações e área do paciente.' },
        ],
      },
      idealSolution: {
        title: 'MVP recomendado para a clínica',
        note: 'Começar pelo que reduz trabalho manual e aumenta conversão, deixando módulos clínicos avançados para evolução controlada.',
        steps: [
          'Landing responsiva com serviços, diferenciais, depoimentos, mapa, WhatsApp e CTA de agendamento.',
          'Cadastro de dentistas, especialidades, pacientes, procedimentos, convênios, salas e horários.',
          'Agenda por profissional com marcação, remarcação, cancelamento, encaixe, bloqueio e status.',
          'Agendamento online com disponibilidade por data e horário.',
          'Lembretes automáticos para reduzir faltas.',
          'Painel administrativo com consultas do dia, horários livres, faturamento previsto e taxa de comparecimento.',
          'Evolução para prontuário, odontograma, financeiro, recibos e planos de tratamento.',
        ],
      },
    };
  }

  if (isGamerCinematic) {
    const gameName = context.businessName === 'Projeto Digital Premium' ? 'God Of War' : context.businessName;
    const visualPrompt = `Create an immersive cinematic promotional landing page for ${gameName}, inspired by a dark mythological AAA action-adventure game universe. Full-page website screenshot, no device mockup. Frozen Nordic atmosphere, icy mountains, ancient runes, ash, smoke, cinematic particles, axe silhouette, brutal premium typography, hero trailer section, gameplay showcase, character story, community hype, CTA "Comprar agora", PlayStation-level AAA campaign energy. Dark blue, steel, ice, ember accents. Do not create corporate SaaS, institutional branding, business dashboard, clinic, law firm or generic premium company website.`;

    return {
      businessName: gameName,
      businessContext: 'LANDING_PAGE',
      proposalPersona: 'gamer_cinematic',
      projectCategory: 'Landing page promocional gamer cinematográfica',
      proposalTitle: `Landing promocional imersiva para ${gameName}`,
      briefingSummary: `O briefing aponta para uma landing page promocional de jogo, com universo gamer cinematográfico, foco em impacto visual, hype, trailer, gameplay, storytelling épico e conversão para compra ou wishlist.`,
      initialDiagnosis: `O valor central da página não é institucional: é criar imersão imediata. Para ${gameName}, a experiência precisa vender atmosfera, conflito, escala, gameplay e desejo de jogar, combinando narrativa visual, trailer, seções de gameplay e uma chamada de compra forte.`,
      operationalBottlenecks: [
        'Risco de uma página promocional parecer corporativa ou genérica, reduzindo hype e conexão com a comunidade gamer.',
        'Trailer, gameplay, história e CTA podem perder força se não houver hierarquia visual cinematográfica.',
        'Ausência de ambientação forte compromete a percepção de escala AAA e universo épico.',
        'Comunidade e fandom podem não encontrar rapidamente mídia, compra, plataformas e conteúdos-chave.',
      ],
      epicByteApproach: `A EpicByte estruturaria uma experiência promocional imersiva, com hero cinematográfico, atmosfera visual de alto impacto, trailer em destaque, gameplay showcase, narrativa do universo e CTA de compra. A direção visual seria tratada como campanha gamer AAA, não como site institucional.`,
      suggestedFeatures: [
        'Hero cinematográfico com atmosfera nórdica, partículas, runas, machado e CTA de compra.',
        'Seção de trailer com reprodução em destaque e chamadas de impacto.',
        'Gameplay showcase com blocos de combate, exploração, progressão e narrativa.',
        'Seção de história e personagens com linguagem épica e visual editorial.',
        'Bloco de mídia para screenshots, vídeos e artes promocionais.',
        'CTA persistente para comprar agora, wishlist ou escolher plataforma.',
      ],
      expectedOperationalImpacts: [
        'Aumento de impacto visual e memorabilidade da campanha.',
        'Mais clareza entre atmosfera, gameplay, trailer e ação de compra.',
        'Maior engajamento de comunidade gamer e fãs do universo.',
        'Experiência mais coerente com lançamento AAA, sem linguagem corporativa.',
      ],
      strategicVision: `A visão estratégica é transformar a landing em uma experiência de campanha: primeiro capturar pela atmosfera, depois sustentar com trailer e gameplay, e por fim converter por CTA de compra/wishlist sem quebrar a imersão.`,
      recommendedTechnologies: [
        'Landing responsiva com performance alta para mídia pesada.',
        'Seções otimizadas para trailer, gameplay, screenshots e CTA de compra.',
        'Animações sutis, transições cinematográficas e carregamento progressivo de assets.',
      ],
      timeEstimate: 'De 4 a 8 semanas para uma landing promocional cinematográfica com hero, trailer, gameplay, mídia e CTA responsivo.',
      investmentEstimate: 'R$ 12.000 a R$ 35.000 para uma experiência promocional premium; motion avançado, 3D, assets exclusivos e integrações de compra podem ampliar o escopo.',
      evolutionOpportunities: [
        'Área de mídia com wallpapers, trailers e screenshots.',
        'Integração com wishlist, pré-venda ou lojas de plataforma.',
        'Contagem regressiva para lançamento e eventos da comunidade.',
        'Experiências interativas com lore, runas, mapa ou personagens.',
      ],
      nextStep: 'Validar plataformas, CTA principal, assets disponíveis e nível de motion/imersão esperado para a primeira versão.',
      mockup: {
        title: 'Experiência promocional gamer',
        screenType: 'Landing cinematográfica de jogo AAA',
        visualStyle: 'Dark cinematográfico com gelo, runas, fumaça, partículas, tipografia brutalista premium e seções imersivas.',
        primaryAction: 'Comprar agora',
        modules: ['Hero cinematográfico', 'Trailer oficial', 'Gameplay showcase', 'História e personagens', 'Galeria de mídia', 'CTA de compra'],
        dataHighlights: ['Trailer em destaque', 'Gameplay', 'Plataformas', 'Wishlist', 'Comunidade', 'Mídia oficial'],
      },
      visualConcept: {
        title: `Preview cinematográfico para ${gameName}`,
        visualPrompt,
        imageAlt: `Landing gamer cinematográfica para ${gameName}, com atmosfera nórdica, gelo, runas, machado, trailer, gameplay e CTA de compra.`,
        palette: ['#67e8f9', '#1e3a8a', '#0f172a', '#f97316'],
        heroLabel: gameName,
        imageDataUrl: null,
      },
      strategicScore: {
        operationalComplexity: 'Média',
        conversionPotential: 'Alto',
        automationPotential: 'Baixo',
        structuringUrgency: 'Alta',
        recommendedSolutionType: 'Landing promocional gamer cinematográfica',
      },
      solutionLevel: {
        recommended: 'Estrutura Profissional',
        rationale: 'A experiência precisa combinar impacto visual, mídia, narrativa e conversão sem parecer template corporativo.',
        options: [
          { label: 'Essencial', description: 'Hero, trailer, gameplay, mídia e CTA.' },
          { label: 'Profissional', description: 'Direção cinematográfica, motion, seções narrativas e CTA persistente.' },
          { label: 'Escalável', description: 'Interações, lore, countdown, wishlist e integração com lojas.' },
        ],
      },
      idealSolution: {
        title: 'Jornada promocional ideal',
        note: 'A página deve criar imersão antes de pedir conversão.',
        steps: ['Impacto visual imediato', 'Trailer em destaque', 'Gameplay e combate', 'História e universo', 'Mídia oficial', 'Comprar agora ou wishlist'],
      },
    };
  }

  if (isPersonalBrand) {
    const rawPersonalBrandText = projectContext.rawUserIntent.toLowerCase();
    const name = context.businessName === 'Projeto Digital Premium' && textIncludes(rawPersonalBrandText, ['neymar'])
      ? 'Neymar'
      : context.businessName === 'Projeto Digital Premium' && textIncludes(rawPersonalBrandText, ['avril lavigne'])
        ? 'Avril Lavigne'
        : context.businessName;
    const visualStyle = projectContext.visualStyle || 'cinematográfico, esportivo premium e editorial';
    const isMusicArtist = textIncludes(rawPersonalBrandText, ['avril lavigne', 'cantora', 'cantor', 'banda', 'música', 'musica', 'show', 'shows', 'turnê', 'turne', 'album', 'álbum']);
    const visualPrompt = isMusicArtist
      ? `Crie uma landing page profissional para ${name}, artista musical/cantora. A imagem deve ser um screenshot full-page direto da página, de borda a borda, sem fundo externo, sem página centralizada, sem monitor, notebook, celular, tablet, moldura ou mockup. Use informações relevantes da artista: carreira, música, turnê/datas de shows, fotos, vídeos, álbuns, comunidade de fãs, redes sociais e conteúdo oficial. Visual musical premium, moderno e realista, com hero imersivo de palco/show, estética editorial rock/pop, tipografia forte e seções profissionais abaixo. Priorize composição editorial premium, menos cards pequenos, mais respiro visual, seções amplas e hierarquia sofisticada.`
      : `Crie uma landing page profissional para ${name}, jogador de futebol. A imagem deve ser um screenshot full-page direto da página, de borda a borda, sem fundo externo, sem página centralizada, sem monitor, notebook, celular, tablet, moldura ou mockup. Use informações relevantes do jogador: carreira, futebol, legado, comunidade, redes sociais, instituto/projetos sociais, vídeos e conteúdo oficial. Visual esportivo premium, moderno e realista, com hero imersivo em estádio, estética preto e dourado, tipografia forte e seções profissionais abaixo. Priorize composição editorial premium, menos cards pequenos, mais respiro visual, seções amplas e hierarquia sofisticada.`;

    return {
      businessName: name,
      businessContext: 'INSTITUTIONAL_WEBSITE',
      projectCategory: isMusicArtist ? 'Landing page institucional de artista musical' : 'Landing page institucional de marca pessoal',
      proposalTitle: `Experiência digital de marca pessoal para ${name}`,
      briefingSummary: isMusicArtist
        ? `O briefing aponta para uma landing page institucional de artista musical, com foco em divulgar informações, datas de shows, fotos, vídeos, trajetória e conteúdo oficial para fãs e público institucional.`
        : `O briefing aponta para uma presença digital institucional de marca pessoal, com foco em imagem pública, trajetória, conexão com fãs e conteúdo oficial. A proposta precisa funcionar como uma experiência editorial premium, não como uma landing comum de captação.`,
      initialDiagnosis: isMusicArtist
        ? `Para ${name}, o valor está em consolidar presença oficial, agenda, narrativa artística e conteúdo visual em uma experiência proprietária. A página deve facilitar acesso a shows, mídia, redes sociais e materiais oficiais sem parecer catálogo genérico.`
        : `Para ${name}, o valor está em transformar reputação, história e presença pública em uma experiência digital proprietária. A página deve organizar narrativa, mídia, redes e projetos relevantes com uma direção visual forte, capaz de transmitir escala, exclusividade e proximidade emocional.`,
      operationalBottlenecks: [
        'Narrativa pública espalhada entre redes sociais, notícias e conteúdos de terceiros, enfraquecendo a percepção de presença oficial.',
        'Ausência de uma experiência central para consolidar trajetória, vídeos, fotos, projetos e presença institucional.',
        'Risco de percepção genérica caso a página pareça apenas um portfólio ou template de campanha.',
        'Dificuldade de direcionar fãs, imprensa e marcas para conteúdos oficiais e atualizados em um único ambiente.',
      ],
      epicByteApproach: `A EpicByte estruturaria uma experiência de marca pessoal com narrativa visual, hierarquia editorial e blocos de conteúdo pensados para reforçar reputação, legado e conexão com o público. A abordagem conecta branding, UX e presença institucional para que a página pareça um ativo oficial de alto valor.`,
      suggestedFeatures: [
        'Hero cinematográfico com posicionamento de marca e impacto visual imediato, reforçando presença global e autoridade pública.',
        'Linha narrativa de trajetória e conquistas para transformar história em percepção de valor, não apenas em cronologia.',
        'Galeria de fotos e vídeos com curadoria editorial, criando uma experiência viva para fãs, imprensa e parceiros.',
        'Blocos para instituto, projetos sociais ou conteúdo oficial, ampliando profundidade institucional sem parecer venda forçada.',
        'Presença elegante de redes sociais e canais oficiais para aproximar comunidade, conteúdo e identidade pública.',
      ],
      expectedOperationalImpacts: [
        'Narrativa oficial mais forte, clara e memorável.',
        'Experiência mais forte para fãs, imprensa, patrocinadores e parceiros.',
        'Centralização de conteúdo, trajetória e presença institucional em um ambiente proprietário.',
        'Aumento de percepção premium por meio de direção visual cinematográfica e editorial.',
      ],
      strategicVision: `A visão estratégica é criar um hub institucional de marca pessoal: uma experiência que organiza imagem pública, legado e canais oficiais com acabamento global, preparada para evoluir para conteúdo exclusivo, loja, eventos ou projetos sociais quando fizer sentido.`,
      recommendedTechnologies: [
        'Site institucional responsivo com performance alta e experiência mobile refinada.',
        'Estrutura de conteúdo preparada para atualizações de fotos, vídeos, notícias e projetos.',
        'SEO técnico e dados estruturados para presença institucional e busca orgânica.',
      ],
      timeEstimate: '4 a 8 semanas para direção criativa, UX/UI premium, implementação responsiva e ajustes editoriais.',
      investmentEstimate: 'R$ 8.000 a R$ 20.000 para uma experiência institucional premium de marca pessoal; evoluções com conteúdo dinâmico, loja ou área exclusiva podem ampliar o escopo.',
      evolutionOpportunities: [
        'Área de notícias e conteúdos oficiais atualizáveis.',
        'Loja oficial ou campanhas de produtos, se houver estratégia comercial.',
        'Hub de eventos, instituto ou projetos sociais com narrativa própria.',
      ],
      nextStep: 'Validar a proposta gerada pela IA e definir a primeira versão ideal com narrativa, direção visual, seções prioritárias e plano de conteúdo.',
      mockup: {
        title: `Presença institucional para ${name}`,
        screenType: 'Landing editorial premium de marca pessoal',
        visualStyle,
        primaryAction: 'Explorar trajetória e conteúdo oficial',
        modules: ['Hero cinematográfico', 'Trajetória', 'Galeria e vídeos', 'Redes sociais', 'Projetos oficiais'],
        dataHighlights: ['Conteúdos em destaque', 'Engajamento por seção', 'Acessos mobile', 'Cliques para canais oficiais'],
      },
      visualConcept: {
        title: `Direção visual para ${name}`,
        visualPrompt,
        imageAlt: `Experiência digital premium para marca pessoal de ${name}, com narrativa editorial, fotos, trajetória e presença institucional.`,
        palette: ['#050505', '#d6a84f', '#111827', '#f8fafc'],
        heroLabel: name,
        imageDataUrl: null,
      },
      strategicScore: {
        operationalComplexity: 'Média em experiência',
        conversionPotential: 'Alto em engajamento',
        automationPotential: 'Baixo',
        structuringUrgency: 'Média em posicionamento',
        recommendedSolutionType: 'Landing institucional de marca pessoal com storytelling editorial',
      },
      solutionLevel: {
        recommended: 'Estrutura Profissional',
        rationale: 'Marca pessoal de alto valor exige direção criativa, narrativa, performance e estrutura editorial, não apenas uma página simples.',
        options: [
          { label: 'Estrutura Essencial', description: 'Presença institucional com narrativa, hero e canais oficiais.' },
          { label: 'Estrutura Profissional', description: 'Storytelling completo, galeria, vídeos, projetos e conteúdo editorial.' },
          { label: 'Estrutura Escalável', description: 'Conteúdo dinâmico, loja oficial, campanhas, eventos e área exclusiva.' },
        ],
      },
      idealSolution: {
        title: 'Solução ideal para evolução',
        note: 'O projeto pode começar como presença institucional premium e evoluir para um ecossistema de marca.',
        steps: ['Narrativa e direção visual', 'Landing editorial premium', 'Conteúdo dinâmico', 'Projetos oficiais', 'Loja ou experiências exclusivas'],
      },
    };
  }

  if (isExecutiveDashboard) {
    const name = context.businessName;
    const visualPrompt = `Create a clean institutional executive financial dashboard for ${name}. Focus on hospital financial management with revenue, expenses, EBITDA, operating margin, payers, units, cash flow and financial KPIs. White background, dark green and gold accents, professional BI layout, realistic corporate healthcare dashboard, clear charts, filters by period and unit. ultra realistic, premium UI, cinematic, modern SaaS, enterprise, realistic interface, luxury digital experience, sophisticated layout, high-end UI/UX, 2026 design trend, dribbble shot, awwwards quality. The result must look like a real enterprise dashboard used by hospital executives. Do not generate landing page, mockup monitor, futuristic neon UI, celebrity branding, appointment website or generic SaaS template.`;
    const base = buildFallbackProposal(messages.map((message) => ({ ...message, content: 'Preciso organizar uma operação empresarial com uma solução digital gerencial.' })));
    return {
      ...base,
      businessName: name,
      businessContext: 'DASHBOARD_SYSTEM',
      projectCategory: 'Dashboard executivo financeiro',
      proposalTitle: `Dashboard executivo financeiro para ${name}`,
      briefingSummary: `A necessidade aponta para uma visão executiva financeira hospitalar, focada em consolidar receitas, despesas, margem, EBITDA, convênios, unidades e fluxo de caixa em uma camada gerencial clara.`,
      initialDiagnosis: `O desafio central não é apenas visualizar números, mas transformar dados financeiros em leitura executiva para decisão rápida, comparação por unidade/período e identificação de desvios relevantes.`,
      visualConcept: {
        ...base.visualConcept,
        title: `Preview executivo para ${name}`,
        visualPrompt,
        imageAlt: `Dashboard financeiro executivo para ${name}, com indicadores hospitalares, filtros e visão gerencial.`,
        palette: ['#f8fafc', '#0f3d2e', '#c6a15b', '#111827'],
      },
    };
  }

  const isEnterprise = context.isEnterprise;
  const isStellantisMetrology = context.isStellantisMetrology;
  const solutionLevel = isEnterprise
    ? 'Estrutura Escalável'
    : context.wantsScheduling || context.wantsAutomation
      ? 'Estrutura Profissional'
      : 'Estrutura Essencial';
  const investmentEstimate = isEnterprise
    ? isStellantisMetrology
      ? 'R$ 120.000 a R$ 250.000+, dependendo do nível de implantação, volume de cadastros, validações, suporte, governança, integrações e maturidade operacional.'
      : context.projectCategory === 'Sistema enterprise complexo'
      ? 'R$ 90.000 a R$ 250.000+, conforme integrações, governança, volume de usuários, validações e criticidade operacional.'
      : 'R$ 40.000 a R$ 90.000 para uma solução operacional com dashboards, permissões e fluxos digitais, quando o escopo não envolver criticidade enterprise ampliada.'
    : context.wantsEcommerce
      ? 'R$ 12.000 a R$ 40.000 para ecommerce com catálogo, produto, carrinho, checkout e gestão inicial.'
      : context.wantsInternalSystem || context.wantsAutomation
        ? 'R$ 15.000 a R$ 40.000 para sistema interno simples ou automação de processos, conforme regras e relatórios.'
        : context.wantsScheduling
          ? 'R$ 6.000 a R$ 15.000 para landing com agendamento, WhatsApp e painel simples.'
          : context.wantsSales
            ? 'R$ 4.000 a R$ 8.000 para landing premium com foco em conversão.'
            : 'R$ 2.500 a R$ 5.000 para uma landing institucional inicial com foco em presença digital.';
  const timeEstimate = isEnterprise
    ? isStellantisMetrology
      ? 'MVP controlado: 4 a 6 meses. Solução sólida: 8 a 12 meses. Evolução enterprise: 12 a 18 meses, conforme cadastros, validações, permissões, suporte, testes operacionais e governança.'
      : 'MVP entre 4 e 6 meses; solução sólida entre 8 e 12 meses; evolução enterprise entre 12 e 18 meses, conforme cadastros, permissões, regras, usuários, validações e integrações.'
    : '3 a 6 semanas para concepção, design, implementação e ajustes finais.';
  const visualType = isEnterprise ? 'internal operational platform' : context.wantsScheduling ? 'website with online scheduling' : 'conversion-focused landing page';
  const segmentVisualDirection =
    context.niche === 'advocacia'
      ? 'dark elegant law firm visual, black, gold, graphite and deep blue accents, confident lawyer in tailored suit, sophisticated corporate atmosphere, practice areas, credibility indicators, testimonials and contact CTA'
      : context.niche === 'odontologia'
        ? 'clean premium dental clinic visual, white and light blue design, smiling dentist or patient, health-focused elegant UI, online appointment CTA, treatments section, trust indicators and testimonials'
        : context.niche === 'barbearia'
          ? 'premium barbershop visual, dark masculine style, black, graphite, gold and wood textures, stylish barber environment, services, pricing, online booking CTA and WhatsApp contact'
          : context.niche === 'moda feminina'
            ? 'premium feminine fashion visual, rose, white and nude palette, elegant model, collections, categories, product cards and shopping CTA'
            : context.niche === 'consultório médico'
              ? 'clean medical clinic visual, white, blue and soft green palette, healthcare professional, appointment CTA, specialties, trust and patient care'
              : 'premium segment-specific commercial visual with realistic imagery and coherent brand direction';
  const visualPrompt = isEnterprise
    ? `Create a real authentic enterprise software experience for ${context.businessName}, an industrial metrology and quality control operation. Required style: ultra realistic, premium UI, cinematic, modern SaaS, enterprise, realistic interface, luxury digital experience, sophisticated layout, high-end UI/UX, 2026 design trend, dribbble shot, awwwards quality. Before generating, interpret the brand as engineering-driven, precise, operationally serious and performance-oriented. The dashboard must feel like a real system used by a billion-dollar institution: executive-level hierarchy, realistic operational data visualization, real KPIs, realistic charts, clean density, elegant chart composition, subtle premium depth, modern UX and institutional UI with Bloomberg + Stripe + Linear + Notion + Framer quality. Do not create a fake futuristic dashboard, gaming UI, sci-fi interface, centered UI render, laptop mockup, monitor display, phone showcase, framed presentation or over-glowing neon interface. Use only ${context.businessName} or neutral labels such as Industrial Quality Hub, Metrology Operations, Operational Center. Never include EpicByte, OpenAI, GPT, famous brands, third-party logos, fake client names, GM, Bosch, Fiat, Volkswagen, Google, Microsoft, Salesforce, SAP or Oracle.`
    : context.wantsEcommerce
      ? `Create a premium ecommerce proposal visualization for ${context.businessName}, a ${context.niche}. Show desktop storefront, mobile shopping flow, product catalog, product detail, cart, checkout, category navigation, trust section and refined brand colors. Visual direction: ${segmentVisualDirection}. High-fidelity commercial UI, realistic and polished, no generic template.`
      : context.wantsApp
        ? `Create a premium mobile app mockup for ${context.businessName}, a ${context.niche}. Show multiple realistic smartphone screens, onboarding, dashboard, main action flow, notifications, profile and polished mobile UI. Visual direction: ${segmentVisualDirection}. High-fidelity, realistic, premium app presentation.`
        : context.wantsInternalSystem || context.wantsAutomation
          ? `Create a realistic enterprise internal management system dashboard for ${context.businessName}, a ${context.niche}. Show administrative dashboard, user management, workflow status, operational indicators, reports, filters, approval flows, role-based access, desktop dashboard and mobile companion. Premium dark navy interface, cyan and blue accents, operational control center feel.`
          : `Create a cinematic editorial premium digital brand experience for ${context.businessName}, a ${context.niche}. Required style: ultra realistic, premium UI, cinematic, modern SaaS, enterprise, realistic interface, luxury digital experience, sophisticated layout, high-end UI/UX, 2026 design trend, dribbble shot, awwwards quality. Before generating, interpret the brand positioning, emotion, sophistication level and commercial intent. The image must feel like a real global brand campaign or published premium website experience. The image itself must BE the experience, not a UI render, not a website presentation, not a monitor mockup and not a template preview. Prioritize cinematic hero, giant premium typography, immersive brand storytelling, emotional visual hierarchy, asymmetrical composition, high-end typography, premium photography direction, visual breathing space, real sections, real content blocks, premium depth, sophisticated commercial rhythm and luxury branding aesthetics. Include navigation, refined CTA, subtle service/practice/treatment storytelling, institutional credibility without logo strips and contact invitation integrated into the page narrative. Visual direction: ${segmentVisualDirection}. Use only ${context.businessName} as brand text. Never include EpicByte, OpenAI, GPT, famous brands, third-party logos, fake client names, section "our clients", ecommerce, shopping cart, products, marketplace, dashboard, SaaS admin interface, laptop mockup, monitor display, physical screen presentation, website shown on notebook, phone showcase, device showcases, website presentation frames, framed presentation, floating UI renders, centered UI renders, Behance showcase style, futuristic UI showcases or conceptual art.`;

  if (isInventoryWarehouseBriefing(context.raw)) {
    const warehouseVisualPrompt = `Create a realistic premium SaaS internal warehouse and inventory management system for an almoxarifado. Show product catalog cards with images, name, description, value and available quantity; pending requisitions; stock availability validation; stock write-off flow; signature confirmation; operator search by employee ID; cost by area dashboard; monthly consumption curve; ranking of most requested products and areas. Dark navy enterprise UI with cyan, blue and violet accents, clean tables, charts, filters, role-based access, desktop dashboard and mobile companion. Do not show metrology, calibration, production line, FIFO industrial inspection, personal brand, landing page, marketing website or generic BI-only dashboard.`;

    return {
      businessName: context.businessName,
      businessContext: 'OPERATIONAL_CONTROL',
      proposalPersona: 'inventory_warehouse_system',
      projectCategory: 'Sistema interno de almoxarifado, requisições e estoque',
      proposalTitle: `Sistema interno de almoxarifado, requisições e estoque para ${context.businessName}`,
      briefingSummary: 'O briefing descreve um sistema interno de almoxarifado para controlar produtos cadastrados com imagem, descrição, valor e quantidade disponível, criar requisições, validar disponibilidade, registrar retirada com assinatura, executar baixa de estoque e acompanhar custos e consumo por área, pessoa e período.',
      initialDiagnosis: 'O desafio central é transformar o almoxarifado em um fluxo digital rastreável: o usuário solicita, o responsável retira, o operador valida disponibilidade, registra entrega, coleta assinatura e baixa o estoque. Sem essa camada, disponibilidade, custos, histórico e responsabilidade ficam difíceis de auditar.',
      operationalBottlenecks: [
        'Risco de retirada sem registro completo de solicitante, responsável, operador, área e produto.',
        'Baixa visibilidade de disponibilidade real quando quantidade, reserva e baixa não estão no mesmo fluxo.',
        'Dificuldade de auditar histórico de movimentações, assinaturas e indisponibilidades por período.',
        'Custos por área e por pessoa ficam pouco claros quando requisições e valores não são consolidados automaticamente.',
        'Produtos mais requisitados e maiores consumidores podem passar despercebidos sem ranking e curva mensal de consumo.',
      ],
      epicByteApproach: 'A EpicByte estruturaria uma plataforma interna com catálogo de produtos, requisições, perfis de acesso, atendimento pelo operador, assinatura de retirada, baixa automática de estoque e indicadores de consumo. A solução nasce do fluxo real do almoxarifado, não de um dashboard isolado.',
      suggestedFeatures: [
        'Cadastro de produtos com imagem, nome, descrição, valor unitário e quantidade disponível.',
        'Fluxo de requisição para solicitantes criarem e editarem apenas suas próprias solicitações.',
        'Atendimento pelo operador do almoxarifado com busca por matrícula, validação de disponibilidade, registro de entrega, assinatura e baixa de estoque.',
        'Perfis de acesso para solicitante, operador do almoxarifado e administrador, com permissões separadas por responsabilidade.',
        'Registro de indisponibilidade com histórico e possibilidade de alerta de reposição em evolução futura.',
        'Histórico completo de movimentações, retiradas, responsáveis, operadores, áreas e custos.',
        'Dashboard de consumo com requisições por área, custos por área, custos por pessoa, maiores consumidores, produtos mais requisitados e acumulado mês a mês.',
      ],
      expectedOperationalImpacts: [
        'Mais controle sobre disponibilidade e baixa de estoque no momento da retirada.',
        'Rastreabilidade completa de quem solicitou, quem retirou, quem entregou e qual produto foi movimentado.',
        'Redução de perdas de informação e divergências entre requisição, assinatura e estoque disponível.',
        'Leitura clara de custos por área, pessoa e período para apoiar compras e reposição.',
        'Melhor planejamento de estoque a partir de ranking de produtos mais requisitados e curva mensal de consumo.',
      ],
      strategicVision: 'A visão estratégica é criar uma camada operacional para o almoxarifado, onde produto, estoque, requisição, retirada, assinatura, baixa e indicadores formam um mesmo sistema. A primeira versão resolve controle e rastreabilidade; a evolução pode incluir aprovação, alertas de reposição, compras e integração com ERP.',
      recommendedTechnologies: [
        'Plataforma web responsiva com autenticação e perfis de acesso.',
        'Banco de dados estruturado para produtos, requisições, movimentações, assinaturas e histórico.',
        'Dashboard operacional para consumo, custos, disponibilidade, rankings e curva mensal.',
        'Camada preparada para futuras integrações com compras, ERP ou notificações internas.',
      ],
      timeEstimate: 'De 6 a 10 semanas para uma primeira versão profissional com cadastro de produtos, requisições, perfis, baixa, assinatura e indicadores essenciais.',
      investmentEstimate: 'R$ 18.000 a R$ 42.000 para uma primeira versão profissional; aprovações avançadas, compras, ERP e alertas inteligentes podem ampliar o escopo.',
      evolutionOpportunities: [
        'Fluxo de aprovação antes da retirada por área, centro de custo ou valor da requisição.',
        'Alertas de reposição por estoque mínimo e curva de consumo.',
        'Módulo de compras conectado a produtos indisponíveis ou abaixo do mínimo.',
        'Integração com ERP ou sistema financeiro para centro de custo e compras.',
      ],
      nextStep: 'Validar regra de aprovação, formato da assinatura e comportamento quando não houver estoque para fechar o escopo da primeira versão.',
      mockup: {
        title: 'Centro operacional de almoxarifado',
        screenType: 'Sistema interno de estoque, requisições e baixa controlada',
        visualStyle: 'Dark premium EpicByte com cyan, azul, violeta, cards de produto, tabelas operacionais e gráficos de consumo.',
        primaryAction: 'Atender requisição e baixar estoque',
        modules: ['Catálogo de produtos', 'Requisições pendentes', 'Baixa de estoque', 'Assinatura de retirada', 'Perfis e permissões', 'Indicadores de consumo'],
        dataHighlights: ['Quantidade disponível', 'Custos por área', 'Produtos mais requisitados', 'Maiores consumidores', 'Acumulado mês a mês', 'Histórico de retiradas'],
      },
      visualConcept: {
        title: 'Preview conceitual do sistema de almoxarifado',
        visualPrompt: warehouseVisualPrompt,
        imageAlt: 'Dashboard de almoxarifado com cards de produtos, requisições pendentes, baixa de estoque, assinatura, custos por área e rankings de consumo.',
        palette: ['#22d3ee', '#2563eb', '#7c3aed', '#020617'],
        heroLabel: 'Almoxarifado inteligente',
        imageDataUrl: null,
      },
      strategicScore: {
        operationalComplexity: 'Alta',
        conversionPotential: 'Não aplicável',
        automationPotential: 'Alta',
        structuringUrgency: 'Alta',
        recommendedSolutionType: 'Sistema interno de almoxarifado, requisições e estoque',
        productivityImpact: 'Alto',
        traceability: 'Alta',
        scalability: 'Alta',
        justifications: {
          operationalComplexity: 'O fluxo combina produto, estoque, requisição, retirada, assinatura, baixa, permissões e indicadores.',
          automationPotential: 'A baixa, histórico, custos e rankings podem ser alimentados automaticamente pelo próprio fluxo.',
          traceability: 'Cada movimentação precisa registrar solicitante, responsável, operador, área, assinatura e status.',
        },
      },
      solutionLevel: {
        recommended: 'Estrutura Profissional',
        rationale: 'O projeto precisa ir além de cadastro e tabela; o valor está em fluxo controlado, permissões, baixa de estoque, assinatura e indicadores gerenciais.',
        options: [
          { label: 'Essencial', description: 'Cadastro de produtos, requisição simples, baixa manual e histórico básico.' },
          { label: 'Profissional', description: 'Perfis, assinatura, indisponibilidade, baixa controlada e dashboards por área/pessoa/produto.' },
          { label: 'Escalável', description: 'Aprovações, estoque mínimo, compras, alertas e integração com ERP.' },
        ],
      },
      idealSolution: {
        title: 'Fluxo ideal de requisição e baixa',
        note: 'A solução deve acompanhar a jornada completa entre solicitação, atendimento no almoxarifado, assinatura e atualização de estoque.',
        steps: [
          'Usuário acessa o sistema e pesquisa produtos disponíveis.',
          'Solicitante cria requisição no nome do responsável pela retirada.',
          'Sistema registra produto, área, responsável, quantidade, valor e status.',
          'Responsável comparece ao almoxarifado.',
          'Operador pesquisa por matrícula ou responsável.',
          'Operador valida disponibilidade.',
          'Com estoque disponível, entrega produto, registra assinatura e baixa quantidade.',
          'Sem estoque disponível, registra indisponibilidade e mantém histórico para reposição.',
        ],
      },
    };
  }

  return {
    businessName: context.businessName,
    businessContext: context.businessContext,
    projectCategory: context.projectCategory,
    proposalTitle: `${context.projectCategory} para ${context.businessName}`,
    briefingSummary: isStellantisMetrology
      ? `O briefing descreve um sistema enterprise de gestão metrológica e controle operacional para ${context.businessName}, com mais de 700 controles previstos, tempos previstos por controle, equipamentos previstos, peças previstas, controles extras, motivos de controle com pesos pré-definidos e PowerApps + Microsoft Lists/Office 365 como plataforma obrigatória. A proposta precisa preservar a complexidade real da operação, incluindo FIFO por peso e ordem de chegada, postos de trabalho filtrando seus próprios controles, produtividade por colaborador e turno, atividades extras, permissões, calibração, férias, laudos PDF e saturação em tempo real.`
      : `Com base no briefing informado, o projeto foi classificado como ${context.projectCategory}. O objetivo central aponta para ${context.mainGoal} em um contexto de ${context.niche}. A estrutura inicial deve começar objetiva, mas preparada para evoluir conforme o fluxo real de atendimento, operação e captação ganhar maturidade.`,
    initialDiagnosis: isEnterprise
      ? isStellantisMetrology
        ? `A operação metrológica descrita tem criticidade enterprise: alto volume de controles previstos, variação de tempos por controle, dependência de equipamentos, postos de trabalho, turnos, controles extras e necessidade de laudos com status técnico. O valor central da solução é transformar a sala metrológica em um fluxo rastreável, priorizado e mensurável, reduzindo atrasos, saturação invisível e decisões sem base operacional.`
        : `A operação descrita indica dependência de processos manuais, baixa rastreabilidade e dificuldade de enxergar gargalos em tempo real. O valor central da solução não está apenas em criar telas, mas em transformar a rotina em um fluxo digital controlado, priorizado e mensurável.`
      : `A presença digital precisa transformar descoberta em conexão. A experiência deve apresentar a marca com clareza, criar percepção premium e conduzir o visitante de forma fluida entre entendimento, confiança e ação.`,
    operationalBottlenecks: isEnterprise
      ? isStellantisMetrology
        ? [
          'Alto volume de mais de 700 controles previstos sem uma camada única para relacionar peças, tempos previstos, equipamentos e prioridades operacionais.',
          'Risco de atraso em demandas críticas quando motivos de controle com pesos diferentes não são priorizados por FIFO ponderado e ordem de chegada.',
          'Baixa visibilidade de saturação de equipamentos em tempo real, dificultando distribuição de carga e tomada de decisão por capacidade.',
          'Postos de trabalho podem receber controles fora do seu escopo sem filtros adequados, aumentando ruído operacional e retrabalho.',
          'Produtividade por colaborador e turno fica pouco rastreável quando controles, atividades extras, 5S, qualificação e reuniões não entram no mesmo fluxo.',
          'Gestão de equipamentos, vencimento de calibração, férias, áreas, operações, máquinas, usuários e permissões exige governança integrada para reduzir risco operacional.',
        ]
        : [
          'Dependência de controles manuais que dificulta rastrear prazos, responsáveis e prioridades.',
          'Baixa visibilidade sobre filas, atrasos e saturação operacional durante a execução das demandas.',
          'Retrabalho causado por informações espalhadas entre papel, planilhas e comunicação informal.',
          'Dificuldade de priorizar solicitações críticas sem um critério operacional claro.',
          'Tomada de decisão limitada pela ausência de indicadores centralizados e atualizados.',
        ]
      : [
          'Primeira impressão abaixo do valor real da marca, reduzindo percepção premium.',
          'Narrativa pouco clara, fazendo o visitante entender a oferta sem sentir diferenciação.',
          'Experiência visual genérica, parecida com template e sem personalidade própria.',
          'Jornada de descoberta pouco fluida entre história, diferenciais, confiança e ação.',
        ],
    epicByteApproach: isEnterprise
      ? `A EpicByte estruturaria uma plataforma operacional centralizada para conectar solicitação, priorização, execução e indicadores em um fluxo único. A abordagem parte do problema operacional, transforma etapas críticas em processos digitais rastreáveis e entrega dados úteis para gestão em tempo real.`
      : `A EpicByte criaria uma experiência digital premium para apresentar ${context.businessName} com narrativa, direção visual e ritmo editorial. A solução começa pela percepção que a marca precisa causar e evolui para uma jornada clara entre descoberta, conexão e engajamento do público.`,
    suggestedFeatures: isEnterprise
      ? isStellantisMetrology
        ? [
          'Base operacional em PowerApps + Microsoft Lists/Office 365 para respeitar a plataforma obrigatória e centralizar controles, cadastros, permissões e rastreabilidade no ecossistema corporativo.',
          'Gestão de mais de 700 controles previstos com tempos previstos por controle, peças previstas, controles extras e equipamentos previstos, permitindo planejamento de capacidade e leitura real da carga operacional.',
          'FIFO ponderado por motivos de controle com pesos pré-definidos e ordem de chegada, priorizando demandas críticas sem perder justiça operacional e reduzindo atrasos em controles de maior impacto.',
          'Postos de trabalho com filtros por área/operação/máquina para exibir apenas os controles aplicáveis, diminuindo ruído, retrabalho e risco de execução fora do escopo.',
          'Acompanhamento de produtividade por colaborador e turno, incluindo atividades extras como 5S, qualificação e reunião, para medir capacidade real e não apenas volume de controles concluídos.',
          'Gestão de equipamentos com vencimento de calibração e saturação em tempo real, reduzindo risco de uso indevido e antecipando gargalos de capacidade.',
          'Emissão de laudos PDF com status conforme, tendência e não conforme, acelerando retorno das informações e fortalecendo rastreabilidade técnica para auditorias.',
          'Governança de áreas, operações, máquinas, usuários, permissões e férias para conectar disponibilidade de pessoas, capacidade técnica e regras de acesso ao fluxo metrológico.',
        ]
        : [
          'Fila operacional inteligente com priorização por criticidade, reduzindo atrasos em demandas urgentes e melhorando a resposta da equipe.',
          'Painel centralizado de acompanhamento para dar visibilidade sobre status, responsáveis, prazos e gargalos da operação.',
          'Registro digital das etapas críticas para aumentar rastreabilidade, reduzir dependência de papel e fortalecer governança.',
          'Indicadores de produtividade e saturação para apoiar decisões sobre carga operacional, equipe e capacidade.',
          'Perfis de acesso por função para proteger informações e organizar responsabilidades dentro do fluxo.',
        ]
      : [
          'Hero editorial com impacto visual imediato, criando presença premium desde o primeiro contato.',
          'Narrativa de marca organizada em blocos claros, para transformar informação em percepção de valor.',
          'Seções de diferenciais, provas e conteúdos visuais para reforçar confiança sem parecer discurso genérico.',
          'Experiência responsiva com ritmo fluido, transições elegantes e leitura forte no mobile.',
        ],
    expectedOperationalImpacts: isEnterprise
      ? isStellantisMetrology
        ? [
          'Priorização mais inteligente de controles críticos por peso e ordem de chegada, reduzindo atrasos operacionais em demandas de maior impacto.',
          'Melhor previsibilidade da capacidade metrológica ao relacionar tempos previstos, equipamentos, colaboradores, turnos e saturação em tempo real.',
          'Aumento da rastreabilidade técnica sobre peças, controles previstos, controles extras, laudos PDF, status de conformidade e responsáveis.',
          'Redução de retrabalho nos postos por filtros de controles aplicáveis e governança de áreas, operações, máquinas, usuários e permissões.',
          'Mais visibilidade de produtividade real ao considerar controles executados e atividades extras como 5S, qualificação e reunião.',
          'Menor risco de uso de equipamento com calibração vencida e melhor preparação para auditorias e conformidade operacional.',
        ]
        : [
          'Redução de retrabalho manual e de circulação de informações fora do sistema.',
          'Aumento da rastreabilidade sobre demandas, responsáveis, prioridades e prazos.',
          'Melhor previsibilidade de gargalos, atrasos e saturação operacional.',
          'Resposta mais rápida para processos críticos e melhor distribuição da carga de trabalho.',
          'Centralização de dados para tomada de decisão com base em indicadores reais.',
        ]
      : [
          'Fortalecimento da presença institucional e da percepção premium.',
          'Experiência mais fluida entre descoberta, conexão e engajamento do público.',
          'Maior clareza sobre narrativa, diferenciais e ação esperada sem perder sofisticação.',
          'Mais memorabilidade visual por meio de direção criativa consistente.',
        ],
    strategicVision: isEnterprise
      ? isStellantisMetrology
        ? `A visão estratégica é criar um núcleo operacional metrológico dentro do ambiente Microsoft 365, onde planejamento, priorização, execução, laudos, calibração, produtividade, férias e saturação deixam de ser controles isolados e passam a formar uma camada integrada de governança. Isso transforma a sala metrológica em uma operação previsível, auditável e orientada por capacidade real.`
        : `A visão estratégica é migrar uma rotina operacional dispersa para uma camada digital controlada, rastreável e orientada por dados. Isso permite começar com um fluxo essencial e evoluir para indicadores, automações e governança sem redesenhar a operação do zero.`
      : `A visão estratégica é transformar a presença digital em uma experiência de marca: primeiro criando impacto e clareza, depois fortalecendo confiança e, por fim, evoluindo para conteúdos, campanhas ou jornadas mais ricas conforme a marca amadurece.`,
    recommendedTechnologies: isEnterprise
      ? isStellantisMetrology
        ? [
          'PowerApps como camada de aplicação operacional obrigatória.',
          'Microsoft Lists/Office 365 como base corporativa para cadastros, controles, permissões e rastreabilidade.',
          'Fluxos automatizados no ecossistema Microsoft para alertas, laudos PDF, status e governança de aprovações quando aplicável.',
          'Painéis operacionais para produtividade, saturação, calibração, FIFO ponderado e acompanhamento por turno.',
        ]
        : [
          'Plataforma web responsiva com autenticação e perfis de acesso.',
          'Banco de dados estruturado para histórico, rastreabilidade e indicadores.',
          'Painéis operacionais em tempo real para gestão e priorização.',
          'Integrações futuras com Microsoft 365, WhatsApp, ERP ou ferramentas internas.',
        ]
      : [
          'Plataforma web responsiva preparada para performance e SEO.',
          'Integração com WhatsApp ou agenda online quando aplicável.',
          'Painel leve de gestão para acompanhar contatos e solicitações.',
        ],
    timeEstimate,
    investmentEstimate,
    evolutionOpportunities: isEnterprise
      ? isStellantisMetrology
        ? [
          'Dashboard executivo de capacidade metrológica, saturação de equipamentos e produtividade por turno.',
          'Alertas automáticos para calibração, fila crítica, controles atrasados e gargalos por posto de trabalho.',
          'Camada de auditoria e histórico para rastrear alterações, laudos, status e decisões operacionais.',
          'Evolução para integração com bases corporativas e relatórios executivos consolidados.',
        ]
        : [
          'Dashboards executivos para produtividade, gargalos e capacidade operacional.',
          'Automações de alertas para prazos, criticidade e pendências.',
          'Integrações com sistemas internos e camadas de governança por área.',
        ]
      : [
          'Novas seções editoriais para aprofundar história, bastidores, portfólio ou conteúdo institucional.',
          'Campanhas visuais de lançamento, datas especiais ou posicionamento de marca.',
          'Conteúdos dinâmicos para manter a experiência viva sem perder acabamento premium.',
        ],
    nextStep: 'Validar a proposta gerada pela IA para confirmar prioridades, escopo e primeira versão ideal.',
    mockup: {
      title: isEnterprise ? (isStellantisMetrology ? 'Centro metrológico operacional' : 'Painel operacional inteligente') : `Experiência digital para ${context.businessName}`,
      screenType: isEnterprise ? (isStellantisMetrology ? 'Sistema enterprise de gestão metrológica e controle operacional' : 'Dashboard operacional desktop com visão executiva') : 'Landing premium editorial com experiência mobile refinada',
      visualStyle: 'Dark premium EpicByte com cyan, azul, violeta, tipografia moderna e cards SaaS.',
      primaryAction: isEnterprise ? 'Acompanhar operação em tempo real' : context.wantsScheduling ? 'Agendar atendimento' : 'Solicitar diagnóstico',
      modules: isEnterprise
        ? isStellantisMetrology
          ? ['FIFO ponderado', 'Controles previstos e extras', 'Saturação de equipamentos', 'Laudos PDF', 'Produtividade por turno', 'Permissões e férias']
          : ['Fila priorizada', 'Status por demanda', 'Indicadores de produtividade', 'Alertas operacionais']
        : ['Hero editorial', 'Narrativa principal', 'Diferenciais', 'Prova social', 'Ação principal'],
      dataHighlights: isEnterprise
        ? isStellantisMetrology
          ? ['+700 controles previstos', 'Tempos previstos por controle', 'Calibração vencendo', 'Saturação em tempo real', 'Status conforme/tendência/não conforme']
          : ['Demandas críticas', 'SLA previsto', 'Saturação operacional', 'Produtividade por período']
        : ['Engajamento da página', 'Cliques na ação principal', 'Conteúdos mais acessados', 'Leitura mobile'],
    },
    visualConcept: {
      title: `Preview conceitual para ${context.businessName}`,
      visualPrompt,
      imageAlt: isStellantisMetrology
        ? `Sistema enterprise metrológico para ${context.businessName}, com FIFO ponderado, controles previstos, produtividade, calibração, laudos PDF e saturação de equipamentos.`
        : `Mockup premium mostrando a solução proposta para ${context.businessName}, com visual desktop e mobile alinhado ao briefing.`,
      palette: ['#22d3ee', '#2563eb', '#7c3aed', '#020617'],
      heroLabel: context.businessName,
      imageDataUrl: null,
    },
    strategicScore: {
      operationalComplexity: isEnterprise ? 'Alta' : context.wantsScheduling || context.wantsAutomation ? 'Média' : 'Baixa',
      conversionPotential: context.wantsSales || !isEnterprise ? 'Alto' : 'Médio',
      automationPotential: isEnterprise || context.wantsAutomation || context.wantsScheduling ? 'Alto' : 'Médio',
      structuringUrgency: isEnterprise ? 'Alta' : 'Média',
      recommendedSolutionType: isEnterprise ? (isStellantisMetrology ? 'Sistema enterprise de gestão metrológica e controle operacional' : 'Sistema operacional interno com dashboards e governança') : context.wantsScheduling ? 'Landing premium com jornada de agendamento' : 'Landing editorial premium com narrativa e CTA refinado',
    },
    solutionLevel: {
      recommended: solutionLevel,
      rationale: isEnterprise
        ? isStellantisMetrology
          ? 'O contexto exige alto volume de controles, plataforma obrigatória Microsoft, regras de prioridade, laudos, calibração, produtividade, saturação e governança por permissões.'
          : 'O contexto exige rastreabilidade, indicadores, múltiplos fluxos e evolução por etapas.'
        : solutionLevel === 'Estrutura Profissional'
          ? 'O projeto combina presença digital premium com jornada clara e pontos de ação bem posicionados.'
          : 'O primeiro ganho está em estruturar presença digital clara, memorável e coerente com a percepção desejada.',
      options: [
        { label: 'Estrutura Essencial', description: 'Presença digital, narrativa clara e ação principal bem posicionada.' },
        { label: 'Estrutura Profissional', description: 'Direção criativa, seções premium, conteúdo visual e jornada refinada.' },
        { label: 'Estrutura Escalável', description: 'Usuários, dashboards, integrações, governança e sistemas internos.' },
      ],
    },
    idealSolution: {
      title: 'Solução ideal para evolução',
      note: 'O projeto pode começar simples e evoluir por etapas, preservando investimento e validando valor rapidamente.',
      steps: isEnterprise
        ? isStellantisMetrology
          ? ['Mapeamento dos cadastros e regras metrológicas', 'MVP PowerApps com FIFO ponderado', 'Laudos PDF e calibração', 'Produtividade por turno e saturação', 'Governança enterprise e evolução executiva']
          : ['Mapeamento do fluxo atual', 'MVP operacional rastreável', 'Dashboards de produtividade', 'Automações de alerta', 'Integrações com sistemas internos']
        : ['Direção criativa e narrativa', 'Landing editorial premium', 'Conteúdo visual refinado', 'Ação principal integrada', 'Evolução da experiência digital'],
    },
  };
};

const prioritizeResponsiveWebProposal = (proposal: DiagnosisProposal): DiagnosisProposal => {
  const responsiveTechnology = 'Site/sistema web responsivo, acessível pelo navegador, otimizado para computadores, celulares e tablets.';
  const technologies = [
    responsiveTechnology,
    ...proposal.recommendedTechnologies.filter((item) => !item.toLowerCase().includes('web responsiv')),
  ].slice(0, 6);

  const screenType = proposal.mockup.screenType.toLowerCase().includes('responsiv')
    ? proposal.mockup.screenType
    : `${proposal.mockup.screenType} responsivo para desktop, celular e tablet`;

  return {
    ...proposal,
    strategicVision: proposal.strategicVision.toLowerCase().includes('responsiv')
      ? proposal.strategicVision
      : `${proposal.strategicVision} A prioridade da primeira versão deve ser uma experiência web responsiva, funcionando bem no computador da equipe e no celular ou tablet dos clientes/usuários.`,
    recommendedTechnologies: technologies,
    mockup: {
      ...proposal.mockup,
      screenType,
      dataHighlights: Array.from(new Set([
        ...proposal.mockup.dataHighlights,
        'Uso em desktop, celular e tablet',
      ])).slice(0, 6),
    },
  };
};

const buildFallbackProposal = (messages: ChatMessage[]): DiagnosisProposal =>
  prioritizeResponsiveWebProposal(buildFallbackProposalBase(messages));

type DiscoveryKind =
  | 'landing'
  | 'site'
  | 'system'
  | 'automation'
  | 'dashboard'
  | 'crm'
  | 'scheduling'
  | 'app'
  | 'integration'
  | 'hybrid'
  | 'unknown';

type BriefingPersona = 'BRANDING_LANDING' | 'ENTERPRISE_SYSTEM' | 'AUTOMATION_AI' | 'UNKNOWN';

type BriefingState = {
  projectType: DiscoveryKind;
  subject: string;
  goal: string;
  audience: string;
  emotionalDirection: string;
  narrativeFormat: string;
  visualStyle: string;
  visualReferences: string;
  mainCTA: string;
  requiredContent: string;
  priority: string;
  platformOrTech: string;
  integrations: string;
  finalDataDesired: string;
  currentPersona: BriefingPersona;
  askedQuestions: string[];
  answeredFields: string[];
  wantsToEndDiscovery: boolean;
  userSaysAlreadyAnswered: boolean;
  readyForProposal: boolean;
};

const getUserText = (messages: ChatMessage[]) =>
  messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ');

const hasAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

const getAssistantText = (messages: ChatMessage[]) =>
  messages.filter((message) => message.role === 'assistant').map((message) => message.content).join(' ').toLowerCase();

const addAnswered = (fields: string[], field: string, value: string) => {
  if (value && !fields.includes(field)) fields.push(field);
};

const findMatchedTerms = (text: string, terms: string[]) => terms.filter((term) => text.includes(term));

const inferDiscoveryKind = (messages: ChatMessage[]): DiscoveryKind => {
  const text = getUserText(messages).toLowerCase();
  if (isInventoryWarehouseBriefing(text)) return 'system';
  const hits = {
    landing: hasAny(text, ['landing page', 'lp ', 'página de venda', 'pagina de venda', 'página premium', 'pagina premium', 'página de divulgação', 'pagina de divulgação', 'hotsite']),
    site: hasAny(text, ['site institucional', 'site ', 'presença digital', 'presenca digital', 'portfólio', 'portfolio', 'página institucional', 'pagina institucional']),
    system: hasAny(text, ['sistema', 'portal', 'plataforma interna', 'controle dos serviços', 'controle de serviços', 'ordem de serviço', 'ordem de servico']),
    automation: hasAny(text, ['automatizar', 'automação', 'automacao', 'processo manual', 'retrabalho']),
    dashboard: hasAny(text, ['dashboard', 'bi', 'indicador', 'relatório', 'relatorio', 'painel financeiro', 'painel de gestão', 'painel de gestao']),
    crm: hasAny(text, ['crm', 'funil comercial', 'gestão comercial', 'gestao comercial', 'vendas']),
    scheduling: hasAny(text, ['agenda', 'agendamento', 'marcação', 'marcacao', 'consulta', 'horário', 'horario']),
    app: hasAny(text, ['aplicativo', 'app mobile', 'ios', 'android']),
    integration: hasAny(text, ['integração', 'integracao', 'api', 'whatsapp', 'pagamento', 'checkout', 'pix', 'inteligência artificial', 'inteligencia artificial', 'chatbot', 'assistente virtual']),
  };
  const active = Object.entries(hits).filter(([, value]) => value).map(([key]) => key);
  if (active.length > 1 && (hits.system || hits.automation || hits.dashboard || hits.integration)) return 'hybrid';
  return (active[0] as DiscoveryKind) || 'unknown';
};

const buildBriefingState = (messages: ChatMessage[]): BriefingState => {
  const raw = getUserText(messages);
  const text = raw.toLowerCase();
  const assistantText = getAssistantText(messages);
  const context = inferContext(messages);
  const initialKind = inferDiscoveryKind(messages);
  const isInventoryWarehouse = isInventoryWarehouseBriefing(text);
  const isBranding =
    ['landing', 'site'].includes(initialKind) ||
    context.projectContext.experienceType === 'personal_brand_landing' ||
    hasAny(text, ['marca pessoal', 'cantora', 'cantor', 'artista', 'atleta', 'jogador', 'influencer', 'avril lavigne', 'neymar', 'presença digital', 'presenca digital', 'página institucional', 'pagina institucional', 'hotsite']);
  const isAutomation = ['automation', 'integration'].includes(initialKind) || hasAny(text, ['chatbot', 'assistente virtual', 'inteligência artificial', 'inteligencia artificial']);
  const isSystem = ['system', 'dashboard', 'crm'].includes(initialKind);
  const projectType: DiscoveryKind = isInventoryWarehouse ? 'system' : isBranding ? (initialKind === 'site' ? 'site' : 'landing') : initialKind;
  const currentPersona: BriefingPersona = isBranding ? 'BRANDING_LANDING' : isAutomation ? 'AUTOMATION_AI' : isSystem ? 'ENTERPRISE_SYSTEM' : 'UNKNOWN';

  const answeredFields: string[] = [];
  const askedQuestions = [
    assistantText.includes('emoção que essa experiência') || assistantText.includes('experiência deve transmitir') ? 'emotionalDirection' : '',
    assistantText.includes('formato narrativo') || assistantText.includes('portal institucional') ? 'narrativeFormat' : '',
    assistantText.includes('público principal') ? 'audience' : '',
    assistantText.includes('conteúdos') || assistantText.includes('fotos') ? 'requiredContent' : '',
    assistantText.includes('ação principal') || assistantText.includes('visitante deve') ? 'mainCTA' : '',
    assistantText.includes('referência estética') || assistantText.includes('referencia estética') || assistantText.includes('filme, marca') ? 'visualReferences' : '',
    assistantText.includes('prioridade da primeira versão') || assistantText.includes('prioridade da primeira versao') ? 'priority' : '',
    assistantText.includes('tom visual dominante') ? 'visualStyle' : '',
    assistantText.includes('processo funciona hoje') || assistantText.includes('serviço nasce') ? 'currentFlow' : '',
    assistantText.includes('dados finais') ? 'finalDataDesired' : '',
  ].filter(Boolean);

  const emotionTerms = ['emoção', 'emocao', 'inspiração', 'inspiracao', 'legado', 'autoridade', 'exclusividade', 'proximidade', 'admiração', 'admiracao', 'orgulho', 'impacto', 'conexão', 'conexao'];
  const audienceTerms = ['fãs e comunidade', 'fas e comunidade', 'fãs', 'fas', 'comunidade', 'torcida', 'seguidores', 'clientes finais', 'empresas', 'público local', 'publico local'];
  const narrativeTerms = ['experiência imersiva', 'experiencia imersiva', 'hotsite cinematográfico', 'hotsite cinematografico', 'documentário visual', 'documentario visual', 'portal institucional', 'landing editorial', 'página informativa', 'pagina informativa'];
  const visualTerms = ['luxuoso', 'luxo', 'cinematográfico', 'cinematografico', 'minimalista', 'tecnológico', 'tecnologico', 'editorial', 'sofisticado', 'sofisticada', 'premium'];
  const contentTerms = ['fotos e vídeos', 'fotos e videos', 'foto', 'fotos', 'vídeo', 'video', 'vídeos', 'videos', 'trajetória', 'trajetoria', 'história', 'historia', 'conquistas', 'redes sociais', 'conteúdo oficial', 'conteudo oficial'];
  const ctaTerms = ['conhecer a história', 'conhecer a historia', 'ver vídeos', 'ver videos', 'explorar vídeos', 'explorar videos', 'seguir canais oficiais', 'consumir conteúdo', 'consumir conteudo', 'divulgação', 'divulgacao', 'informações', 'informacoes'];
  const priorityTerms = ['impacto visual', 'narrativa completa', 'posicionamento de marca', 'canais oficiais', 'tudo equilibrado', 'entregar rápido', 'entregar rapido', 'reduzir trabalho manual', 'atender clientes melhor', 'organizar dados', 'gerar relatórios', 'gerar relatorios', 'integrar ferramentas'];
  const referenceTerms = ['sem referência definida', 'sem referencia definida', 'não sei', 'nao sei', 'cinematográfico', 'cinematografico', 'campanha esportiva', 'campanha visual', 'editorial', 'luxuoso', 'luxo', 'minimalista', 'tecnológico', 'tecnologico', 'filme', 'site parecido', 'referência', 'referencia'];
  const stopTerms = ['chega de levantamentos', 'pare de me perguntar', 'não pergunte mais', 'nao pergunte mais', 'me passe o levantamento', 'passe o levantamento', 'crie com as informações que você tem', 'crie com as informacoes que voce tem', 'já respondi', 'ja respondi', 'pode gerar', 'continue', 'finaliza', 'finalize', 'gera a proposta', 'gere a proposta', 'não sei', 'nao sei', 'sem referência definida', 'sem referencia definida'];

  const subject = context.businessName || context.projectContext.projectName || extractBusinessName(raw);
  const goal = hasAny(text, ['divulgação', 'divulgacao', 'informativa', 'informativo', 'conhecer', 'presença', 'presenca'])
    ? 'divulgação e presença institucional'
    : context.mainGoal;
  const audience = findMatchedTerms(text, audienceTerms).join(', ');
  const emotionalDirection = findMatchedTerms(text, emotionTerms).join(', ');
  const narrativeFormat = findMatchedTerms(text, narrativeTerms).join(', ');
  const visualStyle = findMatchedTerms(text, visualTerms).join(', ');
  const visualReferences = findMatchedTerms(text, referenceTerms).join(', ');
  const mainCTA = findMatchedTerms(text, ctaTerms).join(', ');
  const requiredContent = findMatchedTerms(text, contentTerms).join(', ');
  const priority = findMatchedTerms(text, priorityTerms).join(', ');
  const integrations = findMatchedTerms(text, ['whatsapp', 'api', 'pagamento', 'pix', 'agenda', 'chatbot', 'inteligência artificial', 'inteligencia artificial']).join(', ');
  const finalDataDesired = findMatchedTerms(text, ['faturamento', 'despesas', 'clientes', 'produtividade', 'atrasos', 'status', 'prazos', 'indicadores']).join(', ');
  const platformOrTech = findMatchedTerms(text, ['wordpress', 'react', 'webflow', 'shopify', 'powerapps', 'microsoft', 'api']).join(', ');

  addAnswered(answeredFields, 'projectType', projectType !== 'unknown' ? projectType : '');
  addAnswered(answeredFields, 'subject', subject);
  addAnswered(answeredFields, 'goal', goal);
  addAnswered(answeredFields, 'audience', audience);
  addAnswered(answeredFields, 'emotionalDirection', emotionalDirection);
  addAnswered(answeredFields, 'narrativeFormat', narrativeFormat);
  addAnswered(answeredFields, 'visualStyle', visualStyle);
  addAnswered(answeredFields, 'visualReferences', visualReferences);
  addAnswered(answeredFields, 'mainCTA', mainCTA);
  addAnswered(answeredFields, 'requiredContent', requiredContent);
  addAnswered(answeredFields, 'priority', priority);
  addAnswered(answeredFields, 'platformOrTech', platformOrTech);
  addAnswered(answeredFields, 'integrations', integrations);
  addAnswered(answeredFields, 'finalDataDesired', finalDataDesired);

  if (isInventoryWarehouse) {
    addAnswered(answeredFields, 'projectType', 'sistema_interno');
    addAnswered(answeredFields, 'goal', 'controlar almoxarifado, estoque, requisições, baixa e indicadores');
    addAnswered(answeredFields, 'audience', 'solicitante, operador do almoxarifado, administrador, responsáveis por área');
    addAnswered(answeredFields, 'currentFlow', 'fluxo de requisição, retirada, assinatura, baixa de estoque e indisponibilidade');
    addAnswered(answeredFields, 'inputData', 'produto, imagem, descrição, valor, quantidade, solicitante, responsável, área, matrícula');
    addAnswered(answeredFields, 'permissions', 'solicitante, operador e administrador');
    addAnswered(answeredFields, 'finalDataDesired', 'requisições por área, custos por pessoa, maiores consumidores, produtos mais requisitados, histórico de retiradas');
  }

  const wantsToEndDiscovery = hasAny(text, stopTerms);
  const userSaysAlreadyAnswered = hasAny(text, ['já respondi', 'ja respondi']);
  const landingReady = currentPersona === 'BRANDING_LANDING' && Boolean(projectType !== 'unknown' && subject && audience && (emotionalDirection || visualStyle) && (requiredContent || priority));
  const systemReady = currentPersona === 'ENTERPRISE_SYSTEM' && ['projectType', 'goal', 'audience', 'finalDataDesired'].every((field) => answeredFields.includes(field));
  const readyForProposal = wantsToEndDiscovery || landingReady || systemReady;

  return {
    projectType,
    subject,
    goal,
    audience,
    emotionalDirection,
    narrativeFormat,
    visualStyle,
    visualReferences,
    mainCTA,
    requiredContent,
    priority,
    platformOrTech,
    integrations,
    finalDataDesired,
    currentPersona,
    askedQuestions,
    answeredFields,
    wantsToEndDiscovery,
    userSaysAlreadyAnswered,
    readyForProposal,
  };
};

const getDiscoverySignals = (messages: ChatMessage[]) => {
  const text = getUserText(messages).toLowerCase();
  const userTurns = messages.filter((message) => message.role === 'user').length;
  const kind = inferDiscoveryKind(messages);
  const inventoryWarehouse = isInventoryWarehouseBriefing(text);
  return {
    kind,
    inventoryWarehouse,
    userTurns,
    hasObjective: hasAny(text, ['objetivo', 'necessidade', 'problema', 'quero', 'preciso', 'para ', 'resolver', 'controlar', 'automatizar', 'vender', 'divulgar', 'acompanhar']),
    hasAudience: inventoryWarehouse || hasAny(text, ['cliente', 'visitante', 'usuário', 'usuario', 'equipe', 'gestor', 'diretoria', 'paciente', 'vendedor', 'responsável', 'responsavel', 'público', 'publico', 'fã', 'fãs', 'fas', 'torcida', 'comunidade', 'seguidores']),
    hasCurrentFlow: inventoryWarehouse || hasAny(text, ['hoje', 'atualmente', 'funciona', 'fluxo', 'processo', 'whatsapp', 'planilha', 'formulário', 'formulario', 'papel', 'manual']),
    hasInputs: inventoryWarehouse || hasAny(text, ['campo', 'preench', 'dados', 'entrada', 'input', 'planilha', 'formulário', 'formulario', 'importar', 'cadastro', 'entidade', 'receita', 'despesa', 'categoria', 'cliente']),
    hasOutputs: inventoryWarehouse || hasAny(text, ['saída', 'saida', 'output', 'dados finais', 'visualizar', 'acompanhar', 'indicador', 'dashboard', 'relatório', 'relatorio', 'meta', 'produtividade', 'atraso', 'status', 'faturamento']),
    hasIntegrations: hasAny(text, ['whatsapp', 'api', 'pagamento', 'pix', 'erp', 'agenda', 'google calendar', 'inteligência artificial', 'inteligencia artificial', 'chatbot', 'assistente virtual', 'integração', 'integracao']),
    hasPriority: hasAny(text, ['prioridade', 'foco principal', 'mais importante', 'urgente', 'primeiro módulo', 'primeiro modulo', 'mvp', 'começar', 'comecar', 'primeira versão', 'primeira versao', 'entregar rápido', 'entregar rapido', 'reduzir trabalho manual', 'atender clientes melhor', 'organizar dados', 'gerar relatórios', 'gerar relatorios', 'integrar ferramentas', 'impacto visual', 'posicionamento de marca', 'narrativa completa', 'canais oficiais', 'tudo equilibrado']),
    hasVisualOrContent: hasAny(text, ['visual', 'estilo', 'referência', 'referencia', 'seção', 'secao', 'conteúdo', 'conteudo', 'foto', 'vídeo', 'video', 'depoimento', 'prova social', 'trajetória', 'trajetoria', 'história', 'historia', 'conquista', 'redes sociais', 'transição', 'transicao', 'impactante', 'profissional']),
    hasCta: hasAny(text, ['whatsapp', 'agendar', 'comprar', 'formulário', 'formulario', 'seguir', 'portfólio', 'portfolio', 'cta', 'ação principal', 'acao principal', 'divulgação', 'divulgacao', 'informativa', 'informativo', 'informações', 'informacoes', 'conhecer', 'trajetória', 'trajetoria', 'história', 'historia', 'explorar', 'conteúdo oficial', 'conteudo oficial']),
    hasEmotion: hasAny(text, ['sentir', 'sensação', 'sensacao', 'emoção', 'emocao', 'emocional', 'impacto', 'impactante', 'admiração', 'admiracao', 'inspiração', 'inspiracao', 'orgulho', 'proximidade', 'exclusividade', 'autoridade', 'legado', 'conexão', 'conexao', 'memorável', 'memoravel']),
    hasReferences: hasAny(text, ['referência', 'referencia', 'inspiração visual', 'inspiracao visual', 'filme', 'marca como referência', 'marca como referencia', 'site parecido', 'exemplo visual', 'campanha visual', 'campanha esportiva', 'behance', 'awwwards', 'apple', 'nike', 'adidas', 'netflix']),
    hasBrandPerception: hasAny(text, ['percepção', 'percepcao', 'posicionamento', 'presença', 'presenca', 'identidade', 'premium', 'luxo', 'luxuoso', 'sofisticado', 'sofisticada', 'editorial', 'cinematográfico', 'cinematografico', 'minimalista', 'tecnológico', 'tecnologico']),
    hasExperienceType: hasAny(text, ['portal institucional', 'documentário visual', 'documentario visual', 'experiência imersiva', 'experiencia imersiva', 'página informativa', 'pagina informativa', 'informativa', 'institucional', 'editorial', 'landing', 'hotsite']),
  };
};

const getRequirementsDepth = (text: string) => {
  const checks = [
    hasAny(text, ['necessidade', 'problema', 'objetivo', 'resolver', 'controlar', 'automatizar']),
    hasAny(text, ['usuário', 'usuario', 'usuários', 'usuarios', 'perfil', 'perfis', 'administrador', 'operador', 'responsável', 'responsavel', 'equipe']),
    hasAny(text, ['cadastro', 'entidade', 'produto', 'cliente', 'serviço', 'servico', 'requisição', 'requisicao', 'chamado', 'ordem de serviço', 'ordem de servico', 'agenda', 'financeiro']),
    hasAny(text, ['campo', 'entrada', 'input', 'imagem', 'valor', 'descrição', 'descricao', 'quantidade', 'status', 'categoria', 'matrícula', 'matricula']),
    hasAny(text, ['cria', 'criar', 'edita', 'valida', 'aprova', 'baixa', 'entrega', 'assina', 'retira', 'finaliza', 'notifica']),
    hasAny(text, ['permissão', 'permissao', 'permissões', 'permissoes', 'apenas a própria', 'apenas a propria', 'gerencia tudo', 'acesso']),
    hasAny(text, ['saída', 'saida', 'output', 'indicador', 'dashboard', 'relatório', 'relatorio', 'gráfico', 'grafico', 'custos', 'ranking', 'histórico', 'historico', 'mês a mês', 'mes a mes']),
    hasAny(text, ['integração', 'integracao', 'api', 'erp', 'whatsapp', 'pagamento', 'agenda', 'email']),
    hasAny(text, ['aprovação', 'aprovacao', 'assinatura', 'disponibilidade', 'indisponibilidade', 'prioridade', 'prazo', 'regra']),
  ];

  return checks.filter(Boolean).length;
};

const isRichOperationalBriefing = (messages: ChatMessage[]) => {
  const text = getUserText(messages).toLowerCase();
  const kind = inferDiscoveryKind(messages);
  return ['system', 'automation', 'dashboard', 'crm', 'scheduling', 'app', 'integration', 'hybrid'].includes(kind) && getRequirementsDepth(text) >= 5;
};

const buildOperationalRequirementSynthesis = (text: string) => {
  if (hasAny(text, ['crm', 'funil', 'vendas', 'lead', 'comercial'])) {
    return 'Entendi. O levantamento aponta para uma solução comercial com usuários, funil, registros de interação, permissões, acompanhamento de oportunidades e indicadores de vendas.';
  }
  if (hasAny(text, ['financeiro', 'receita', 'despesa', 'faturamento', 'conta', 'caixa', 'pagamento'])) {
    return 'Entendi. O levantamento aponta para uma solução financeira com registros, categorias, responsáveis, filtros, indicadores, relatórios e leitura de desempenho por período.';
  }
  if (hasAny(text, ['agenda', 'agendamento', 'horário', 'horario', 'consulta'])) {
    return 'Entendi. O levantamento aponta para uma solução de agenda com usuários, disponibilidade, criação de horários, confirmação, histórico e indicadores de atendimento.';
  }
  if (hasAny(text, ['chamado', 'manutenção', 'manutencao', 'ordem de serviço', 'ordem de servico'])) {
    return 'Entendi. O levantamento aponta para um sistema interno de chamados ou ordens de serviço, com abertura de demanda, responsáveis, status, prazos, histórico e indicadores operacionais.';
  }
  return 'Entendi. O levantamento já descreve uma solução interna com necessidade, entidades, usuários, fluxo, permissões, regras e indicadores suficientes para sair do básico e tratar a primeira versão.';
};

const hasBriefingMaturity = (messages: ChatMessage[]) => {
  const state = buildBriefingState(messages);
  const text = getUserText(messages).toLowerCase();
  if (hasDetailedInventoryWarehouseBriefing(text)) {
    const assistantText = getAssistantText(messages);
    return hasAny(text, ['aprovação', 'aprovacao', 'sem aprovação', 'sem aprovacao', 'diretamente', 'assinatura digital', 'pendência', 'pendencia', 'alerta de reposição', 'alerta de reposicao']) ||
      assistantText.includes('aprovação antes da retirada') ||
      state.wantsToEndDiscovery ||
      state.userSaysAlreadyAnswered;
  }
  if (state.readyForProposal) return true;
  const projectContext = inferContext(messages).projectContext;
  if (projectContext.semanticUniverse === 'gamer_cinematografico') {
    return messages.filter((message) => message.role === 'user').length >= 2 &&
      hasAny(text, ['trailer', 'gameplay', 'comprar', 'wishlist', 'comunidade', 'galeria', 'impacto visual', 'história', 'historia', 'universo']);
  }
  if (state.currentPersona === 'BRANDING_LANDING') return false;
  const signals = getDiscoverySignals(messages);
  if (isRichOperationalBriefing(messages) && (signals.hasOutputs || signals.hasPriority || signals.hasIntegrations || state.wantsToEndDiscovery || state.userSaysAlreadyAnswered)) {
    return true;
  }
  const isOperational = ['system', 'automation', 'dashboard', 'crm', 'scheduling', 'app', 'integration', 'hybrid'].includes(signals.kind);
  if (isOperational) {
    if (signals.userTurns < 2) return false;
    const coverage = [
      signals.hasObjective,
      signals.hasAudience,
      signals.hasCurrentFlow,
      signals.hasInputs,
      signals.hasOutputs,
      signals.hasIntegrations,
      signals.hasPriority,
    ].filter(Boolean).length;
    return coverage >= 5 || (signals.userTurns >= 3 && coverage >= 4);
  }
  if (signals.userTurns < 4) return false;
  return Boolean(
    signals.hasObjective &&
      signals.hasAudience &&
      signals.hasCta &&
      signals.hasExperienceType &&
      signals.hasPriority &&
      signals.hasReferences &&
      (signals.hasEmotion || signals.hasBrandPerception) &&
      signals.hasVisualOrContent
  );
};

const getRequirementStep = (messages: ChatMessage[]) => {
  const text = getUserText(messages).toLowerCase();
  const userTurns = messages.filter((message) => message.role === 'user').length;
  const signals = getDiscoverySignals(messages);
  const state = buildBriefingState(messages);
  const assistantText = getAssistantText(messages);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content.trim().toLowerCase() || '';
  const priorityWasAsked = assistantText.includes('prioridade da primeira versão') || assistantText.includes('prioridade da primeira versao');
  const latestAnswerAfterPriority = priorityWasAsked && Boolean(lastUserMessage) && !hasAny(lastUserMessage, ['prioridade da primeira versão', 'prioridade da primeira versao']);

  if (state.wantsToEndDiscovery || state.userSaysAlreadyAnswered) return 7;
  if (userTurns <= 0) return 1;
  if (!signals.hasObjective) return 1;
  if (!signals.hasAudience) return 2;
  if (!signals.hasCurrentFlow) return 3;
  if (!signals.hasInputs && !hasAny(text, ['funcionalidade', 'funcionalidades', 'módulo', 'modulo', 'tela', 'cadastro', 'controle'])) return 4;
  if (!signals.hasIntegrations && !hasAny(text, ['sem integração', 'sem integracao', 'não precisa integrar', 'nao precisa integrar'])) return 5;
  if (!signals.hasPriority && !latestAnswerAfterPriority && !hasAny(text, ['prazo', 'urgente', 'primeira versão', 'primeira versao', 'mvp'])) return 6;
  return 7;
};

const hasRequirementsMaturity = (messages: ChatMessage[]) => getRequirementStep(messages) >= 7;

const buildRequirementsDiscoveryQuestion = (messages: ChatMessage[]): DiagnosisResponse | null => {
  if (hasRequirementsMaturity(messages)) return null;

  const context = inferContext(messages);
  const step = getRequirementStep(messages);
  const collected = {
    niche: context.niche,
    businessSize: context.businessSize,
    complexity: context.complexity,
    mainGoal: context.mainGoal,
    questionCount: context.userTurns,
  };
  const text = getUserText(messages).toLowerCase();
  const subject = context.businessName && context.businessName !== 'Projeto Digital' ? context.businessName : 'esse projeto';
  const isClinic = hasAny(text, ['clínica', 'clinica', 'consultório', 'consultorio', 'paciente']);
  const isStore = hasAny(text, ['loja', 'produto', 'estoque', 'venda', 'ecommerce', 'e-commerce']);

  const respond = (assistantMessage: string, quickReplies: string[]): DiagnosisResponse => ({
    status: 'collecting',
    assistantMessage,
    quickReplies,
    collected,
    proposal: null,
  });

  if (step === 1) {
    return respond(
      `Entendi o início da ideia. Para começar o levantamento, qual é o tipo de projeto e qual objetivo principal ${subject} precisa resolver?`,
      ['Sistema interno', 'Portal para clientes', 'Dashboard de gestão', 'Automação de atendimento', 'Controle operacional', 'Loja online']
    );
  }

  if (step === 2) {
    return respond(
      'Perfeito. Agora preciso entender quem usa a solução. Quais perfis de usuários vão acessar esse sistema?',
      isClinic
        ? ['Recepção', 'Profissionais da clínica', 'Pacientes', 'Administrador', 'Financeiro']
        : isStore
          ? ['Clientes', 'Vendedores', 'Estoque', 'Administrador', 'Financeiro']
          : ['Cliente final', 'Atendimento', 'Operação', 'Gestor', 'Administrador', 'Financeiro']
    );
  }

  if (step === 3) {
    return respond(
      'Entendi os usuários. Como esse processo funciona hoje, antes do sistema?',
      isClinic
        ? ['WhatsApp', 'Telefone', 'Agenda manual', 'Planilha', 'Sistema atual']
        : isStore
          ? ['Venda presencial', 'Instagram/WhatsApp', 'Planilha', 'Sistema atual', 'Controle manual']
          : ['Planilha', 'WhatsApp', 'Papel/formulário', 'Sistema atual', 'Processo manual']
    );
  }

  if (step === 4) {
    return respond(
      'Certo. Qual funcionalidade principal precisa existir na primeira versão?',
      isClinic
        ? ['Agenda de atendimentos', 'Cadastro de pacientes', 'Confirmação automática', 'Prontuário/observações', 'Relatórios']
        : isStore
          ? ['Catálogo de produtos', 'Controle de estoque', 'Pedidos/vendas', 'Cadastro de clientes', 'Relatórios']
          : ['Cadastros', 'Controle de status', 'Aprovações', 'Relatórios', 'Dashboard', 'Notificações']
    );
  }

  if (step === 5) {
    return respond(
      'Essa funcionalidade já dá forma ao escopo. Existe alguma integração ou restrição que precisa ser considerada?',
      ['Sem integração inicial', 'WhatsApp', 'Pagamento/Pix', 'Agenda externa', 'Planilha/Excel', 'ERP ou sistema atual']
    );
  }

  return respond(
    'Para fechar o levantamento inicial, qual é a prioridade da primeira versão?',
    ['Entregar rápido', 'Reduzir trabalho manual', 'Organizar dados', 'Gerar relatórios', 'Atender clientes melhor', 'Integrar ferramentas']
  );
};

const buildDiscoveryQuestion = (messages: ChatMessage[]): DiagnosisResponse | null => {
  if (hasBriefingMaturity(messages)) return null;

  const context = inferContext(messages);
  const state = buildBriefingState(messages);
  const signals = getDiscoverySignals(messages);
  const collected = {
    niche: context.niche,
    businessSize: context.businessSize,
    complexity: context.complexity,
    mainGoal: context.mainGoal,
    questionCount: context.userTurns,
  };
  const text = getUserText(messages).toLowerCase();
  const askedFinalDataQuestion = hasAny(text, ['dados finais', 'visualizar ou acompanhar', 'quantidade de ordens de serviço', 'quantidade de ordens de servico']);
  const askedMainActionQuestion = hasAny(text, ['ação principal que o visitante', 'acao principal que o visitante', 'chamar no whatsapp, agendar']);
  const assistantText = getAssistantText(messages);

  const respond = (assistantMessage: string, quickReplies: string[] = getDynamicSuggestions(context.projectContext)): DiagnosisResponse => ({
    status: 'collecting',
    assistantMessage,
    quickReplies,
    collected,
    proposal: null,
  });

  if (state.wantsToEndDiscovery || state.userSaysAlreadyAnswered) return null;

  if (context.projectContext.semanticUniverse === 'gamer_cinematografico') {
    const hasGamerStructure = hasAny(text, ['trailer', 'gameplay', 'comprar', 'wishlist', 'plataforma', 'playstation', 'xbox', 'steam', 'comunidade', 'galeria']);
    if (!hasGamerStructure) {
      return respond(
        'Entendi. Isso não é uma página institucional: é uma landing promocional gamer, com foco em atmosfera, hype, trailer, gameplay e conversão para compra ou wishlist. Para calibrar a experiência, o que precisa ter mais peso na primeira versão: trailer, gameplay, história do universo, galeria de mídia, comunidade ou CTA de compra?',
        ['Trailer', 'Gameplay', 'História do universo', 'Galeria de mídia', 'Comunidade', 'Comprar agora']
      );
    }
    if (!signals.hasPriority) {
      return respond(
        'A direção já aponta para uma experiência imersiva e cinematográfica. Para fechar o briefing sem transformar isso em site corporativo, qual é a prioridade: impacto visual, conversão para compra, apresentação de gameplay ou engajamento da comunidade?',
        ['Impacto visual', 'Comprar agora', 'Gameplay', 'Comunidade', 'Wishlist']
      );
    }
    return null;
  }

  if (isInventoryWarehouseBriefing(text)) {
    if (hasDetailedInventoryWarehouseBriefing(text) && !assistantText.includes('aprovação antes da retirada')) {
      return respond(
        'Entendi. Agora ficou claro que o projeto é um sistema interno de almoxarifado com gestão de produtos, estoque, requisições, perfis de acesso, baixa controlada, assinatura de retirada e indicadores de consumo por área, pessoa e período. Antes de gerar a proposta, só preciso validar um ponto: a requisição precisa passar por aprovação antes da retirada ou o operador do almoxarifado pode atender diretamente?',
        ['Precisa de aprovação', 'Operador atende direto', 'Depende da área', 'Já respondi, gere a proposta']
      );
    }

    if (!hasDetailedInventoryWarehouseBriefing(text)) {
      return respond(
        'Entendi. Isso aponta para um sistema interno de almoxarifado e estoque, não apenas um painel de indicadores. Para completar o briefing, preciso entender o fluxo de requisição: quem solicita, quem atende no almoxarifado, quais dados do produto entram no cadastro e quais indicadores de consumo você quer acompanhar?',
        ['Solicitante e operador', 'Produtos com imagem e valor', 'Baixa de estoque', 'Custos por área', 'Produtos mais requisitados']
      );
    }

    return null;
  }

  if (isRichOperationalBriefing(messages)) {
    const synthesis = buildOperationalRequirementSynthesis(text);
    if (!signals.hasIntegrations) {
      return respond(
        `${synthesis} Antes de estruturar a proposta, preciso validar uma lacuna que muda arquitetura e evolução: esse sistema precisa conversar com alguma base existente, ERP, planilha, WhatsApp, e-mail, pagamento, agenda ou API externa?`,
        ['Sem integrações agora', 'ERP', 'Planilhas', 'WhatsApp', 'E-mail', 'API externa']
      );
    }
    if (!signals.hasPriority) {
      return respond(
        `${synthesis} Para fechar a primeira versão sem inflar escopo, qual é a prioridade principal: controlar o fluxo, reduzir retrabalho, melhorar rastreabilidade, acelerar atendimento, gerar indicadores ou integrar ferramentas?`,
        ['Controlar fluxo', 'Reduzir retrabalho', 'Rastreabilidade', 'Acelerar atendimento', 'Indicadores', 'Integrações']
      );
    }
    return null;
  }

  if (state.currentPersona === 'BRANDING_LANDING') {
    if (signals.userTurns <= 1 && !state.answeredFields.includes('emotionalDirection') && !state.askedQuestions.includes('emotionalDirection')) {
      return respond(
        'Entendi. Aqui estamos falando de presença, narrativa e percepção pública, não apenas de uma página bonita. Antes de estruturar seções, preciso entender a emoção que essa experiência deve provocar. O que você quer que a pessoa sinta ao entrar na página: emoção, autoridade, exclusividade, proximidade, inspiração ou sensação de legado?',
        ['Emoção', 'Autoridade', 'Exclusividade', 'Proximidade', 'Inspiração', 'Legado']
      );
    }
    if (!state.answeredFields.includes('emotionalDirection') && !state.answeredFields.includes('visualStyle') && !state.askedQuestions.includes('emotionalDirection')) {
      return respond(
        'A direção da página começa pela percepção que ela cria. Para uma marca pessoal ou presença premium, isso define fotografia, ritmo, texto, movimento e hierarquia visual. A experiência deve transmitir mais emoção, autoridade, exclusividade ou proximidade?',
        ['Emoção', 'Autoridade', 'Exclusividade', 'Proximidade', 'Inspiração', 'Legado']
      );
    }
    if (!state.answeredFields.includes('narrativeFormat') && !state.askedQuestions.includes('narrativeFormat')) {
      return respond(
        'Perfeito. Essa resposta ajuda a posicionar a página como uma experiência de marca. Agora preciso entender o formato narrativo: ela deve parecer mais um portal institucional, um documentário visual, uma experiência imersiva ou uma landing editorial premium?',
        ['Portal institucional', 'Documentário visual', 'Experiência imersiva', 'Landing editorial', 'Hotsite cinematográfico']
      );
    }
    if (!state.answeredFields.includes('audience') && !state.askedQuestions.includes('audience')) {
      return respond(
        'Perfeito. A função da página começa a ficar mais clara, mas ainda falta calibrar a linguagem para quem vai consumir essa experiência. Isso muda tom, ritmo visual, profundidade da história e peso das redes sociais. Quem é o público principal dessa página?',
        ['Clientes finais', 'Empresas', 'Fãs e comunidade', 'Investidores/parceiros', 'Público local']
      );
    }
    if (!state.answeredFields.includes('requiredContent') && !state.askedQuestions.includes('requiredContent')) {
      return respond(
        'Entendi. Já existe uma direção comercial mais clara. Agora preciso separar o que é essencial do que seria apenas decorativo, porque uma página premium depende de narrativa, prova e imagem bem escolhidas. Quais conteúdos, diferenciais, provas sociais, imagens, vídeos ou referências visuais precisam aparecer?',
        ['Fotos e vídeos', 'Depoimentos', 'Diferenciais', 'Serviços/produtos', 'Referências visuais']
      );
    }
    if (!state.answeredFields.includes('mainCTA') && !askedMainActionQuestion && !state.askedQuestions.includes('mainCTA')) {
      return respond(
        'Agora a narrativa já tem uma base melhor. Falta decidir a ação principal da página sem transformar isso em venda forçada. O visitante deve principalmente conhecer a história, explorar vídeos e redes, seguir canais oficiais, entrar em contato ou consumir conteúdo?',
        ['Conhecer a história', 'Ver vídeos e redes', 'Seguir canais oficiais', 'Entrar em contato', 'Consumir conteúdo']
      );
    }
    if (!state.answeredFields.includes('visualStyle') && !state.askedQuestions.includes('visualStyle')) {
      return respond(
        'A direção criativa já está mais clara. Qual tom visual deve dominar a experiência: cinematográfico, minimalista, tecnológico, editorial ou luxuoso?',
        ['Cinematográfico', 'Minimalista', 'Tecnológico', 'Editorial', 'Luxuoso']
      );
    }
    if (!state.answeredFields.includes('visualReferences') && !state.askedQuestions.includes('visualReferences')) {
      return respond(
        'A página já tem objetivo, público e narrativa, mas uma experiência premium depende muito de referência estética. Existe algum filme, marca, site, campanha ou estilo visual que represente o clima desejado?',
        ['Cinematográfico', 'Minimalista', 'Editorial', 'Luxuoso', 'Tecnológico', 'Sem referência definida']
      );
    }
    if (!state.answeredFields.includes('priority') && !state.askedQuestions.includes('priority')) {
      return respond(
        'Entendi. Então a página é principalmente informativa e institucional, com foco em presença, história e conexão com o público. Para fechar o briefing sem cair em template, qual deve ser a prioridade da primeira versão: impacto visual, comunidade, posicionamento de marca, narrativa completa ou conversão para canais oficiais?',
        ['Impacto visual', 'Comunidade', 'Posicionamento de marca', 'Narrativa completa', 'Canais oficiais']
      );
    }
    return null;
  }

  if (signals.kind === 'dashboard') {
    if (!signals.hasInputs) {
      return respond(
        'Entendi. Para desenvolver esse dashboard corretamente, preciso mapear primeiro a origem dos dados e depois as saídas esperadas. Quais dados serão importados ou preenchidos hoje: receitas, despesas, categorias, período, contas, metas, clientes, unidades ou planilhas existentes?',
        ['Receitas e despesas', 'Categorias', 'Planilhas', 'Metas', 'Contas/bancos', 'Períodos']
      );
    }
    if (!signals.hasOutputs) {
      return respond(
        'Perfeito. Com a entrada de dados mais clara, o próximo ponto é definir a saída: quais relatórios, indicadores, filtros ou alertas o cliente precisa visualizar para tomar decisão?',
        ['Faturamento', 'Despesas', 'Margem/lucro', 'Metas', 'Fluxo de caixa', 'Relatórios mensais']
      );
    }
    return respond(
      'Agora a leitura do dashboard começa a ficar mais concreta. Falta entender governança: quem vai usar esse painel e que decisões cada pessoa precisa tomar a partir dele?',
      ['Só diretoria', 'Financeiro', 'Gestores por área', 'Equipe comercial', 'Acesso por permissões']
    );
  }

  if (signals.kind === 'automation' && hasAny(text, ['clínica', 'clinica', 'consultório', 'consultorio', 'paciente', 'atendimento'])) {
    if (signals.userTurns <= 1) {
      return respond(
        'Entendi. Automatizar atendimento de clínica exige mapear entrada, agenda, equipe e acompanhamento antes de escolher qualquer ferramenta. Me descreva o fluxo atual: por quais canais os pacientes chegam, quais tipos de atendimento existem, como são confirmação, lembretes e reagendamentos, quem da equipe participa e quais indicadores você gostaria de acompanhar?',
        ['WhatsApp', 'Instagram', 'Telefone', 'Agenda manual', 'Confirmação automática', 'Lembretes']
      );
    }
    if (!signals.hasCurrentFlow) {
      return respond(
        'Entendi. Automatizar atendimento de clínica exige mapear primeiro como o paciente entra e onde a equipe perde tempo. Isso evita criar uma automação que só replica o improviso atual. Hoje os atendimentos chegam por quais canais e como viram agenda?',
        ['WhatsApp', 'Instagram', 'Telefone', 'Site/formulário', 'Agenda manual']
      );
    }
    if (!signals.hasIntegrations) {
      return respond(
        'Perfeito. O canal de entrada define boa parte da automação. Agora preciso entender o que deve acontecer sem intervenção manual: confirmação, lembrete, reagendamento, triagem, cadastro do paciente ou integração com agenda?',
        ['Confirmação automática', 'Lembretes', 'Reagendamento', 'Triagem', 'Integração com agenda']
      );
    }
    return respond(
      'A automação já aponta para ganho real de operação. Para dimensionar o controle, quais indicadores a clínica precisa acompanhar: atendimentos marcados, faltas, tempo de resposta, origem dos pacientes, produtividade da equipe ou ocupação da agenda?',
      ['Atendimentos marcados', 'Faltas', 'Tempo de resposta', 'Origem dos pacientes', 'Ocupação da agenda']
    );
  }

  if (['system', 'automation', 'crm', 'scheduling', 'app', 'integration', 'hybrid', 'unknown'].includes(signals.kind)) {
    if (signals.userTurns <= 1 && ['system', 'automation', 'hybrid'].includes(signals.kind)) {
      return respond(
        'Entendi. Vou tratar isso como levantamento funcional de sistema. Para mapear corretamente, me descreva em um bloco: qual necessidade o cliente quer resolver, quem vai usar, como o processo começa e termina hoje, quais dados entram, quais status/regras existem, quais saídas ou relatórios precisam aparecer e qual seria a prioridade da primeira versão.',
        ['Necessidade do cliente', 'Usuários/perfis', 'Fluxo atual', 'Dados de entrada', 'Regras e status', 'Saídas/relatórios', 'Prioridade MVP']
      );
    }
    if (!signals.hasCurrentFlow) {
      return respond(
        'Entendi a necessidade inicial, mas ainda falta enxergar o fluxo real. Isso define módulos, banco de dados, permissões e escopo. Como esse processo funciona hoje, desde a entrada da demanda até a finalização?',
        ['Entrada da demanda', 'Registro atual', 'Formulário/planilha', 'Ordem de serviço', 'Aprovação', 'Finalização']
      );
    }
    if (!signals.hasInputs) {
      return respond(
        'Perfeito. O fluxo já está mais claro; agora preciso mapear a entrada de dados. Quais cadastros, campos, documentos ou informações precisam entrar no sistema para que ele funcione?',
        ['Cadastros principais', 'Campos obrigatórios', 'Documentos/anexos', 'Dados do cliente', 'Status e responsável']
      );
    }
    if (!signals.hasAudience) {
      return respond(
        'Entendi. A estrutura começa nos dados, mas a arquitetura depende de quem usa e do que cada perfil pode fazer. Quem participaria do sistema e quais permissões principais cada perfil precisa ter?',
        ['Atendimento', 'Operação', 'Gestores', 'Financeiro', 'Clientes', 'Responsáveis externos']
      );
    }
    if (!signals.hasOutputs || !askedFinalDataQuestion) {
      return respond(
        'Agora já dá para ver que o valor não é só registrar informações, mas transformar a rotina em controle gerencial. Quais saídas o sistema precisa entregar: relatórios, dashboards, indicadores, alertas, histórico, exportação ou algum documento final?',
        ['Ordens de serviço', 'Faturamento', 'Clientes', 'Produtividade', 'Atrasos e prazos', 'Status do fluxo']
      );
    }
    if (!signals.hasPriority) {
      return respond(
        'Com fluxo, dados e indicadores mais claros, falta definir prioridade de implantação. Isso evita uma primeira versão grande demais e ajuda a entregar valor rápido. O que precisa ser resolvido primeiro: retrabalho, perda de informação, atraso, falta de responsáveis, falta de relatórios ou integração com ferramentas atuais?',
        ['Retrabalho', 'Perda de informação', 'Atrasos', 'Responsáveis', 'Relatórios', 'Integrações']
      );
    }
  }

  return respond(
    'Entendi a intenção inicial, mas ainda falta transformar isso em levantamento de sistema. Para eu avaliar como desenvolvedor, qual necessidade o cliente quer resolver e quais informações precisam entrar e sair da solução?',
    ['Necessidade principal', 'Dados de entrada', 'Saídas esperadas', 'Usuários/perfis', 'Fluxo atual', 'Prioridade MVP']
  );
};

const buildFallbackResponse = (messages: ChatMessage[]): DiagnosisResponse => {
  const context = inferContext(messages);
  const projectContext = context.projectContext;
  const detailedBriefing = hasDetailedBriefing(messages);
  const archetype = inferConversationArchetype(messages);
  const contextualReplies = getDynamicSuggestions(projectContext);
  const briefingState = buildBriefingState(messages);
  const requirementsQuestion = buildRequirementsDiscoveryQuestion(messages);

  if (requirementsQuestion) {
    return requirementsQuestion;
  }

  if (hasRequirementsMaturity(messages)) {
    return {
      status: 'proposal',
      assistantMessage: 'Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial.',
      quickReplies: [],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: buildFallbackProposal(messages),
    };
  }

  const discoveryQuestion = buildDiscoveryQuestion(messages);

  if (discoveryQuestion) {
    return discoveryQuestion;
  }

  if (briefingState.userSaysAlreadyAnswered) {
    return {
      status: 'proposal',
      assistantMessage: 'Você tem razão, essa informação já foi registrada. Vou seguir com a proposta usando o briefing atual.',
      quickReplies: [],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: buildFallbackProposal(messages),
    };
  }

  if (briefingState.readyForProposal) {
    return {
      status: 'proposal',
      assistantMessage: briefingState.wantsToEndDiscovery
        ? 'Perfeito. Vou seguir com a proposta usando o briefing atual; pontos mais finos podem ser refinados depois.'
        : 'Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial.',
      quickReplies: [],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: buildFallbackProposal(messages),
    };
  }

  if (projectContext.readyForProposal && briefingState.currentPersona !== 'BRANDING_LANDING') {
    return {
      status: 'proposal',
      assistantMessage: 'Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial.',
      quickReplies: [],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: buildFallbackProposal(messages),
    };
  }

  if (projectContext.experienceType === 'personal_brand_landing') {
    const hasFocus = projectContext.keySections.length > 0;
    return {
      status: 'collecting',
      assistantMessage: hasFocus
        ? `Perfeito. A experiência de ${context.businessName} já começa a ganhar direção: marca pessoal com foco em ${projectContext.keySections.join(', ')}. Isso pede uma narrativa visual forte, capaz de transformar presença pública em experiência institucional. Qual direção estética combina melhor com essa página?`
        : `Entendi. Estamos falando de uma presença digital institucional e de marca pessoal, focada em imagem pública, trajetória e conexão com fãs. Isso não deve ser tratado como site comercial comum nem como funil de agendamento. O que você gostaria de destacar primeiro nessa experiência?`,
      quickReplies: contextualReplies,
      collected: {
        niche: 'marca pessoal',
        businessSize: 'medio',
        complexity: 'media',
        mainGoal: projectContext.goal || 'construir presença digital premium de marca pessoal',
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (projectContext.experienceType === 'executive_dashboard' || projectContext.entityType === 'financial_dashboard') {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. A direção aqui é uma camada executiva de gestão, onde o valor está em transformar dados financeiros e operacionais em leitura rápida para decisão. Para dimensionar o dashboard corretamente, quais indicadores precisam aparecer primeiro?',
      quickReplies: contextualReplies,
      collected: {
        niche: context.niche,
        businessSize: 'enterprise',
        complexity: 'alta',
        mainGoal: projectContext.goal || 'gestão executiva por indicadores',
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if ((projectContext.entityType === 'industrial_operation' || projectContext.experienceType === 'operational_dashboard') && context.userTurns <= 3) {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. Você está descrevendo uma solução operacional, onde rastreabilidade, priorização, capacidade e governança tendem a influenciar diretamente arquitetura, custo e prazo. O ponto mais importante agora é entender o que muda o fluxo: existe integração com ERP, Microsoft 365/PowerApps, planilhas ou outro sistema interno?',
      quickReplies: contextualReplies,
      collected: {
        niche: context.niche,
        businessSize: 'enterprise',
        complexity: 'alta',
        mainGoal: projectContext.goal || context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (archetype === 'personal-brand' && context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. Estamos falando de uma presença digital institucional e de marca pessoal, onde a experiência precisa vender imagem, narrativa e posicionamento antes de qualquer funcionalidade. A direção visual deve transmitir escala, exclusividade e conexão emocional com o público. O que você gostaria de destacar como centro dessa experiência?',
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: 'marca pessoal',
        businessSize: 'medio',
        complexity: 'media',
        mainGoal: 'construir presença digital premium de marca pessoal',
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (archetype === 'hospital' && context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. O contexto hospitalar exige uma leitura mais corporativa: gestão, indicadores, eficiência assistencial, operação financeira e credibilidade institucional precisam caminhar juntos. O ponto central é decidir se a solução nasce mais voltada para gestão executiva ou para experiência do paciente. Qual desses eixos é mais estratégico agora?',
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: 'hospital',
        businessSize: 'enterprise',
        complexity: 'alta',
        mainGoal: 'estruturar gestão hospitalar e inteligência operacional',
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (archetype === 'ecommerce' && context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. Aqui o foco não é apenas criar uma loja, mas construir uma experiência comercial capaz de transformar produto, desejo e confiança em conversão. A arquitetura visual precisa destacar valor, reduzir fricção e conduzir o cliente até a compra. Qual ponto deve ter prioridade na primeira versão?',
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: context.niche,
        businessSize: 'medio',
        complexity: 'media',
        mainGoal: 'aumentar conversão e estruturar venda online',
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (archetype === 'internal-system' && detailedBriefing && context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage:
        'Entendi. Você está descrevendo uma solução interna onde o valor está em organizar fluxo, responsabilidade, rastreabilidade e tomada de decisão. Esse tipo de projeto muda a operação porque reduz dependência manual e torna gargalos visíveis. O ponto que mais altera arquitetura e investimento agora é a integração: esse sistema precisa conversar com ERP, planilhas, Microsoft 365 ou outra base existente?',
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (!detailedBriefing && !context.hasDetectedName && context.userTurns <= 4) {
    return {
      status: 'collecting',
      assistantMessage: 'Pelo que você descreveu, existe uma oportunidade de estruturar uma solução digital, mas ainda falta a necessidade central. Antes de montar a proposta, preciso entender o que o cliente quer resolver, quem vai usar e quais dados precisam ser registrados ou visualizados.',
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (!detailedBriefing && !context.hasKnownNiche && context.userTurns <= 4) {
    return {
      status: 'collecting',
      assistantMessage: `Entendi que ${context.businessName} precisa de uma solução digital, mas ainda falta a necessidade central para calibrar escopo, dados, módulos, prazo e investimento. O que precisa ser resolvido primeiro e quais informações o sistema precisa controlar?`,
      quickReplies: getDynamicSuggestions(context.projectContext),
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (detailedBriefing && context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage: context.isEnterprise
        ? 'Entendi. Você está descrevendo uma solução operacional de alta complexidade, com impacto direto em rastreabilidade, priorização, capacidade e governança. Esse tipo de sistema precisa funcionar como uma camada de controle da operação, reduzindo gargalos invisíveis, retrabalho e baixa previsibilidade. Para dimensionar arquitetura, integrações e custo com precisão, preciso entender um ponto estratégico: haverá integração com ERP/SAP, Microsoft 365 ou algum sistema interno existente?'
        : `Entendi. O projeto de ${context.businessName} aponta para ${context.mainGoal}, com necessidade de transformar presença digital em confiança, clareza e conversão. A oportunidade está em reduzir atrito entre o interesse do cliente e a ação desejada, seja contato, agendamento ou venda. Para estruturar a proposta corretamente, preciso entender o que mais muda o escopo: precisa de agendamento, WhatsApp, pagamentos ou painel administrativo?`,
      quickReplies: context.isEnterprise
        ? ['Integração com SAP/ERP', 'Microsoft 365/PowerApps', 'Sem integração inicial', 'Múltiplas plantas']
        : ['Agendamento online', 'WhatsApp', 'Pagamentos', 'Painel administrativo'],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  if (context.userTurns <= 2) {
    return {
      status: 'collecting',
      assistantMessage: 'Pelo que foi informado, já existe uma intenção inicial, mas ainda preciso mapear o uso real. Isso muda módulos, dados, permissões, prazo e investimento. Qual é o fluxo principal que o sistema precisa controlar, da entrada da demanda até a saída final?',
      quickReplies: ['Entrada da demanda', 'Usuários/perfis', 'Dados de entrada', 'Regras/status', 'Relatórios/indicadores', 'Prioridade MVP'],
      collected: {
        niche: context.niche,
        businessSize: context.businessSize,
        complexity: context.complexity,
        mainGoal: context.mainGoal,
        questionCount: context.userTurns,
      },
      proposal: null,
    };
  }

  return {
    status: 'proposal',
    assistantMessage: 'Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial.',
    quickReplies: [],
    collected: {
      niche: context.niche,
      businessSize: context.businessSize,
      complexity: context.complexity,
      mainGoal: context.mainGoal,
      questionCount: context.userTurns,
    },
    proposal: buildFallbackProposal(messages),
  };
};

const normalizeMessages = (body: Record<string, unknown>): ChatMessage[] => {
  if (Array.isArray(body.messages)) {
    return body.messages
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const value = item as Record<string, unknown>;
        const role = value.role === 'assistant' ? 'assistant' : 'user';
        const content = typeof value.content === 'string' ? value.content.trim() : '';
        return content ? { role, content } : null;
      })
      .filter(Boolean)
      .slice(-24) as ChatMessage[];
  }

  const input = typeof body.input === 'string' ? body.input.trim() : '';
  return input ? [{ role: 'user', content: input }] : [];
};

const validatePayload = (payload: Partial<DiagnosisResponse>): payload is DiagnosisResponse => {
  if (!payload || !payload.status || !payload.assistantMessage || !payload.collected) return false;
  if (payload.status === 'collecting') return Array.isArray(payload.quickReplies);
  if (payload.status !== 'proposal' || !payload.proposal) return false;

  return Boolean(
    payload.proposal.businessName &&
      payload.proposal.businessContext &&
      payload.proposal.projectCategory &&
      payload.proposal.proposalTitle &&
      payload.proposal.briefingSummary &&
      payload.proposal.initialDiagnosis &&
      Array.isArray(payload.proposal.operationalBottlenecks) &&
      payload.proposal.epicByteApproach &&
      Array.isArray(payload.proposal.suggestedFeatures) &&
      Array.isArray(payload.proposal.expectedOperationalImpacts) &&
      payload.proposal.strategicVision &&
      Array.isArray(payload.proposal.recommendedTechnologies) &&
      payload.proposal.timeEstimate &&
      payload.proposal.investmentEstimate &&
      Array.isArray(payload.proposal.evolutionOpportunities) &&
      payload.proposal.nextStep &&
      payload.proposal.mockup &&
      payload.proposal.visualConcept &&
      payload.proposal.visualConcept.visualPrompt &&
      payload.proposal.strategicScore &&
      payload.proposal.solutionLevel &&
      payload.proposal.idealSolution
  );
};

const industrialTerms = [
  'fifo',
  'calibra',
  'metrolog',
  'controle dimensional',
  'peso operacional',
  'laudo',
  'chão de fábrica',
  'chao de fabrica',
  'produção',
  'producao',
  'equipamento',
  'criticidade',
  'sla operacional',
  'rastreabilidade industrial',
];

const isIndustrialContext = (context?: string) =>
  ['INDUSTRIAL_SYSTEM', 'METROLOGY_SYSTEM', 'OPERATIONAL_CONTROL', 'DASHBOARD_SYSTEM', 'ERP'].includes(String(context || ''));

const hasIndustrialLeak = (value: string) => {
  const text = value.toLowerCase();
  return industrialTerms.some((term) => text.includes(term));
};

const contextSafeDefaults = (proposal: DiagnosisProposal) => {
  if (proposal.businessContext === 'INSTITUTIONAL_WEBSITE' && ['artista', 'cantora', 'cantor', 'marca pessoal', 'celebridade'].some((term) => `${proposal.projectCategory} ${proposal.proposalTitle} ${proposal.briefingSummary}`.toLowerCase().includes(term))) {
    return {
      modules: ['Hero institucional', 'Trajetória artística', 'Fotos e vídeos', 'Datas de shows', 'Redes sociais'],
      highlights: ['Conteúdo oficial', 'Shows em destaque', 'Engajamento da comunidade', 'Acessos mobile'],
      features: [
        'Experiência institucional de marca pessoal para organizar narrativa, agenda, fotos, vídeos e canais oficiais em um único ambiente premium.',
        'Seção de datas de shows e conteúdo oficial para conectar fãs com informações relevantes sem depender apenas de redes sociais.',
        'Galeria editorial de fotos e vídeos para reforçar identidade artística, presença de palco e comunidade.',
      ],
    };
  }

  if (proposal.businessContext === 'HEALTHCARE') {
    return {
      modules: ['Hero com agendamento', 'Tratamentos e especialidades', 'Depoimentos de pacientes', 'Contato e WhatsApp'],
      highlights: ['Solicitações de consulta', 'Cliques no agendamento', 'Tratamentos mais acessados', 'Contato mobile'],
      features: [
        'Página premium com foco em confiança, acolhimento e clareza para transformar visitantes em pacientes agendados.',
        'Fluxo de agendamento e WhatsApp com menor atrito, facilitando o contato sem exigir conhecimento técnico do paciente.',
        'Seção de tratamentos, diferenciais e depoimentos para fortalecer credibilidade antes da primeira consulta.',
      ],
    };
  }

  if (proposal.businessContext === 'LEGAL') {
    return {
      modules: ['Hero institucional', 'Áreas de atuação', 'Credenciais e autoridade', 'Contato para consulta'],
      highlights: ['Pedidos de avaliação', 'Áreas mais acessadas', 'Consultas iniciadas', 'Origem dos contatos'],
      features: [
        'Website institucional premium com foco em autoridade, discrição e confiança para qualificar contatos jurídicos.',
        'Estrutura de áreas de atuação e diferenciais para orientar o visitante sem parecer uma vitrine genérica.',
        'CTA de consulta estratégica com contato direto, reduzindo atrito entre interesse e atendimento inicial.',
      ],
    };
  }

  return {
    modules: ['Hero comercial', 'Serviços principais', 'Prova social', 'Contato rápido'],
    highlights: ['Contatos recebidos', 'Cliques no CTA', 'Serviços mais acessados', 'Conversões mobile'],
    features: [
      'Website comercial premium com narrativa clara, CTA objetivo e estrutura orientada à conversão.',
      'Seções de serviços, diferenciais e prova social para aumentar confiança antes do primeiro contato.',
      'Contato por WhatsApp, formulário ou agenda conforme a jornada mais adequada para o segmento.',
    ],
  };
};

const sanitizeProposalContext = (proposal: DiagnosisProposal): DiagnosisProposal => {
  if (isIndustrialContext(proposal.businessContext)) return proposal;

  const defaults = contextSafeDefaults(proposal);
  const cleanList = (items: string[], fallback: string[]) => {
    const cleaned = items.filter((item) => !hasIndustrialLeak(item));
    return cleaned.length ? cleaned : fallback;
  };

  return {
    ...proposal,
    suggestedFeatures: cleanList(proposal.suggestedFeatures, defaults.features),
    operationalBottlenecks: cleanList(proposal.operationalBottlenecks, [
      'Baixa clareza comercial pode reduzir confiança e impedir que visitantes avancem para contato ou agendamento.',
      'Ausência de uma jornada digital bem estruturada aumenta dependência de atendimento manual em dúvidas repetitivas.',
      'Pouca prova social e baixa organização da oferta dificultam a percepção de valor antes da primeira conversa.',
    ]),
    expectedOperationalImpacts: cleanList(proposal.expectedOperationalImpacts, [
      'Maior confiança do visitante ao encontrar uma apresentação profissional, clara e coerente com o segmento.',
      'Experiência mais fluida entre descoberta, conexão e ação principal.',
      'Melhor organização da presença digital para apoiar vendas, agendamentos ou solicitações comerciais.',
    ]),
    mockup: {
      ...proposal.mockup,
      title: hasIndustrialLeak(proposal.mockup.title) ? `Website premium para ${proposal.businessName}` : proposal.mockup.title,
      screenType: hasIndustrialLeak(proposal.mockup.screenType) ? 'Website comercial desktop com estrutura mobile responsiva' : proposal.mockup.screenType,
      modules: cleanList(proposal.mockup.modules, defaults.modules),
      dataHighlights: cleanList(proposal.mockup.dataHighlights, defaults.highlights),
    },
    strategicScore: {
      ...proposal.strategicScore,
      recommendedSolutionType: hasIndustrialLeak(proposal.strategicScore.recommendedSolutionType)
        ? proposal.projectCategory || 'Website comercial premium'
        : proposal.strategicScore.recommendedSolutionType,
    },
  };
};

const proposalText = (proposal: DiagnosisProposal) =>
  [
    proposal.businessName,
    proposal.businessContext,
    proposal.projectCategory,
    proposal.proposalTitle,
    proposal.briefingSummary,
    proposal.initialDiagnosis,
    proposal.epicByteApproach,
    proposal.strategicVision,
    proposal.strategicScore?.recommendedSolutionType,
    proposal.mockup?.title,
    proposal.mockup?.screenType,
    ...(proposal.operationalBottlenecks || []),
    ...(proposal.suggestedFeatures || []),
    ...(proposal.expectedOperationalImpacts || []),
  ].join(' ').toLowerCase();

const hasSemanticDrift = (messages: ChatMessage[], proposal: DiagnosisProposal) => {
  const context = inferContext(messages);
  const source = getUserText(messages).toLowerCase();
  const output = proposalText(proposal);
  const askedForManagement = textIncludes(source, ['sistema', 'gestão', 'gestao', 'cadastro', 'usuários', 'usuarios', 'permiss', 'relatório', 'relatorio', 'dashboard', 'painel', 'admin']);
  const askedForPublicPage = textIncludes(source, ['landing', 'página', 'pagina', 'site', 'presença digital', 'presenca digital', 'institucional', 'portfolio', 'portfólio']);
  const outputIsManagement = textIncludes(output, ['dashboard operacional', 'erp', 'sistema interno', 'gestão interna', 'gestao interna', 'fila operacional', 'saturação operacional', 'saturacao operacional']);
  const outputIsPublicPage = textIncludes(output, ['landing', 'site institucional', 'website', 'página', 'pagina']);

  if (isDentalClinicManagementBriefing(source)) {
    return !textIncludes(output, ['odont', 'dentista', 'paciente', 'agenda']) ||
      textIncludes(output, ['dashboard operacional', 'fila operacional', 'saturação operacional', 'saturacao operacional']);
  }

  if (context.businessContext === 'LEGAL') {
    return !textIncludes(output, ['advocacia', 'jurídic', 'juridic', 'direito', 'escritório', 'escritorio']) ||
      textIncludes(output, ['odont', 'paciente', 'dentista', 'industrial', 'metrolog', 'fifo', 'calibra']);
  }

  if (context.projectContext.entityType === 'celebrity' || context.projectContext.entityType === 'personal_brand') {
    return outputIsManagement || textIncludes(output, ['paciente', 'dentista', 'advocacia', 'industrial', 'estoque', 'almoxarifado']);
  }

  if (context.wantsEcommerce) {
    return !textIncludes(output, ['ecommerce', 'loja', 'catálogo', 'catalogo', 'produto', 'checkout']) ||
      textIncludes(output, ['odont', 'advocacia', 'industrial', 'metrolog']);
  }

  if (askedForPublicPage && !askedForManagement && outputIsManagement) return true;
  if (askedForManagement && !askedForPublicPage && outputIsPublicPage && !outputIsManagement) return true;

  if (context.businessContext === 'HEALTHCARE') {
    return textIncludes(output, ['industrial', 'metrolog', 'fifo', 'calibra', 'chão de fábrica', 'chao de fabrica']);
  }

  return false;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const body = extractRequestBody(req.body);
  const messages = normalizeMessages(body);
  if (!messages.length) {
    return json(res, 400, { error: 'Envie uma mensagem para iniciar o diagnostico.' });
  }

  const briefingState = buildBriefingState(messages);
  if (briefingState.wantsToEndDiscovery || briefingState.userSaysAlreadyAnswered) {
    return json(res, 200, buildFallbackResponse(messages));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(res, 200, buildFallbackResponse(messages));
  }

  const briefingIsMature = hasRequirementsMaturity(messages);
  const conversationHistory = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          {
            role: 'user',
            content: briefingIsMature
              ? 'As 6 etapas do levantamento já têm informação suficiente. Gere status "proposal" agora e não faça nova pergunta.'
              : 'Continue o levantamento seguindo exatamente a próxima etapa pendente. Faça uma única pergunta objetiva.',
          },
        ],
        temperature: 0.2,
        max_output_tokens: 3600,
        text: {
          format: {
            type: 'json_schema',
            name: 'epicbyte_guided_diagnosis',
            strict: true,
            schema: proposalSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      return json(res, 200, buildFallbackResponse(messages));
    }

    const data = await response.json();
    const refusal = data?.output?.[0]?.content?.[0];
    if (refusal?.type === 'refusal') {
      return json(res, 200, buildFallbackResponse(messages));
    }

    const payload = safeParseJson(extractOutputText(data));
    if (!validatePayload(payload)) {
      return json(res, 200, buildFallbackResponse(messages));
    }

    if (payload.status === 'proposal' && !briefingIsMature) {
      return json(res, 200, buildFallbackResponse(messages));
    }

    if (payload.status === 'collecting' && briefingIsMature) {
      return json(res, 200, {
        ...buildFallbackResponse(messages),
        status: 'proposal',
        assistantMessage: 'Perfeito. Já tenho informações suficientes para estruturar sua proposta inicial.',
        quickReplies: [],
        proposal: buildFallbackProposal(messages),
      });
    }

    const proposal = payload.proposal
      ? (hasSemanticDrift(messages, payload.proposal) || isDentalClinicManagementBriefing(getUserText(messages)) || isInventoryWarehouseBriefing(getUserText(messages)) || inferContext(messages).projectContext.semanticUniverse === 'gamer_cinematografico')
        ? buildFallbackProposal(messages)
        : prioritizeResponsiveWebProposal(sanitizeProposalContext({
          ...payload.proposal,
          operationalBottlenecks: payload.proposal.operationalBottlenecks.slice(0, 8),
          suggestedFeatures: payload.proposal.suggestedFeatures.slice(0, 8),
          expectedOperationalImpacts: payload.proposal.expectedOperationalImpacts.slice(0, 8),
          recommendedTechnologies: payload.proposal.recommendedTechnologies.slice(0, 6),
          evolutionOpportunities: payload.proposal.evolutionOpportunities.slice(0, 5),
          mockup: {
            ...payload.proposal.mockup,
            modules: payload.proposal.mockup.modules.slice(0, 6),
            dataHighlights: payload.proposal.mockup.dataHighlights.slice(0, 6),
          },
          visualConcept: {
            ...payload.proposal.visualConcept,
            palette: payload.proposal.visualConcept.palette.slice(0, 5),
            imageDataUrl: null,
          },
          solutionLevel: {
            ...payload.proposal.solutionLevel,
            options: payload.proposal.solutionLevel.options.slice(0, 3),
          },
          idealSolution: {
            ...payload.proposal.idealSolution,
            steps: payload.proposal.idealSolution.steps.slice(0, 8),
          },
        }))
      : null;

    return json(res, 200, {
      status: payload.status,
      assistantMessage: payload.assistantMessage,
      quickReplies: payload.quickReplies.slice(0, 8),
      collected: payload.collected,
      proposal,
    });
  } catch (error) {
    return json(res, 200, buildFallbackResponse(messages));
  }
}
