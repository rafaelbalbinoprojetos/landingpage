import { DIMENSIONS, DIMENSION_STATUSES, PROJECT_CATEGORIES, REQUIREMENT_KINDS, REQUIREMENT_ORIGINS, dimensionGuide } from './engine.js';
import type { BriefingEngineState, Dimension, InterviewDecision } from './engine.js';
import { imageBriefSchema } from './imagePrompt.js';
import { aiPriceEstimateSchema } from './pricing.js';

const stringArray = { type: 'array', items: { type: 'string' } };

export const interviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    assistantMessage: { type: 'string' },
    quickReplies: stringArray,
    category: { type: 'string', enum: [...PROJECT_CATEGORIES] },
    targetDimension: { type: 'string', enum: [...DIMENSIONS, 'conflito'] },
    dimensionUpdates: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          dimension: { type: 'string', enum: [...DIMENSIONS] },
          status: { type: 'string', enum: [...DIMENSION_STATUSES] },
          summary: { type: 'string' },
        },
        required: ['dimension', 'status', 'summary'],
      },
    },
    requirements: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', enum: [...REQUIREMENT_KINDS] },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['alta', 'media', 'baixa'] },
          origin: { type: 'string', enum: [...REQUIREMENT_ORIGINS] },
          dependsOn: stringArray,
        },
        required: ['kind', 'description', 'priority', 'origin', 'dependsOn'],
      },
    },
    conflicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { description: { type: 'string' }, blocking: { type: 'boolean' } },
        required: ['description', 'blocking'],
      },
    },
  },
  required: ['assistantMessage', 'quickReplies', 'category', 'targetDimension', 'dimensionUpdates', 'requirements', 'conflicts'],
};

export const interviewSystemPrompt = `
Você é o analista de requisitos sênior da EpicByte, conduzindo uma entrevista de descoberta com o cliente.

COMO CONDUZIR:
- Faça uma única pergunta principal por vez, em linguagem simples, sem jargão.
- Comece com uma frase curta que mostre que entendeu a última resposta, sem elogios vazios.
- Nunca repita o que o cliente já informou nem pergunte de forma aberta "o que você gostaria?".
- Adapte a pergunta ao negócio e à categoria do projeto, usando os termos do próprio cliente.
- Pergunte apenas o que muda decisões de escopo, arquitetura, prazo ou custo.
- Os quickReplies são de 3 a 5 respostas curtas e diretas à pergunta feita, adaptadas ao negócio. Nunca ofereça opções sobre outro assunto.
- Trate "não sei" como resposta válida: registre a dimensão como "parcial" ou "desconhecido" e siga em frente.

COMO EXTRAIR:
- category: sistema_web, aplicativo, automacao, ia, ecommerce, landing_page, integracao_corporativa ou outro. Separe o domínio do cliente do tipo de solução; escritório de advocacia é domínio, e a solução pode ser site ou sistema. Nunca presuma além do que foi dito.
- dimensionUpdates: registre tudo o que a última resposta esclarece, mesmo que não tenha sido perguntado. Use "confirmado" quando houver resposta clara, "parcial" quando for incompleta e "nao_se_aplica" quando não fizer sentido ao projeto.
- requirements: inclua somente os itens novos desta resposta, cada um atômico. Em dependsOn, repita a descrição exata do requisito do qual ele depende.
- origin: "cliente" apenas para o que o cliente disse. "recomendacao_epicbyte" para o que você sugere. "hipotese" para o que você supõe e precisa de validação. Nunca registre suposição como "cliente".
- conflicts: liste a lista atual de contradições ou ambiguidades. Marque blocking true somente se ela mudar o escopo ou o custo de forma importante. Remova as já esclarecidas.

Não cite OpenAI, modelo, prompt ou limitações internas. Responda em português do Brasil.
`.trim();

export const buildInterviewInstruction = (state: BriefingEngineState, decision: InterviewDecision, openDimensions: Dimension[]) => {
  const focus = decision.action === 'ask'
    ? `Se a última resposta não mudar as prioridades, pergunte sobre "${dimensionGuide[decision.target].label}" (${decision.target}).`
    : decision.action === 'ask_conflict'
      ? `Há um conflito a esclarecer antes de seguir: "${decision.conflict.description}". Use targetDimension "conflito".`
      : 'Registre a última resposta.';
  return [
    'Instrução do sistema, não é fala do cliente.',
    `Estado atual do levantamento: ${JSON.stringify({ category: state.category, dimensions: state.dimensions, conflicts: state.conflicts })}`,
    `Lacunas abertas, da mais importante para a menos importante: ${openDimensions.join(', ') || 'nenhuma'}.`,
    focus,
    'targetDimension deve ser a lacuna que sua pergunta trata. Nunca pergunte sobre uma dimensão fora dessa lista.',
  ].join('\n');
};

const complexityEnum = { type: 'string', enum: ['baixa', 'media', 'alta'] };

export const proposalExtensionProperties = {
  imageBrief: imageBriefSchema,
  priceEstimate: aiPriceEstimateSchema,
  executiveSummary: { type: 'string' },
  architecture: { type: 'string' },
  estimationModules: {
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        phase: { type: 'string', enum: ['mvp', 'profissional', 'evolucao'] },
        complexity: complexityEnum,
        integrations: { type: 'integer' },
      },
      required: ['name', 'description', 'phase', 'complexity', 'integrations'],
    },
  },
  clientDeadlineWeeks: { type: ['number', 'null'] },
  clientBudgetMax: { type: ['number', 'null'] },
  benefits: stringArray,
  assumptions: stringArray,
  exclusions: stringArray,
  risks: stringArray,
};

export const buildProposalSchema = (baseProposalSchema: any) => {
  const properties = { ...baseProposalSchema.properties, ...proposalExtensionProperties };
  // A IA preenche priceEstimate; estes textos são formatados pelo servidor a partir dele.
  delete properties.timeEstimate;
  delete properties.investmentEstimate;
  return { ...baseProposalSchema, properties, required: Object.keys(properties) };
};

export const proposalSystemPrompt = `
Você é o consultor de soluções sênior da EpicByte e vai redigir a proposta a partir do levantamento fornecido.

FIDELIDADE:
- Use somente o que está na conversa e no levantamento. Não invente clientes, resultados, métricas, cotações, contratos nem integrações.
- Diferencie o que o cliente confirmou, o que a EpicByte recomenda e o que é hipótese pendente. Nunca apresente hipótese como fato.
- Benefícios são qualitativos, salvo se o cliente forneceu o número. Não prometa percentuais de ganho.
- Separe DOMÍNIO e TIPO DE SOLUÇÃO. Se o cliente pediu página ou site, não gere ERP; se pediu sistema, a landing só entra como complemento se ele pediu.
- Prefira sistema web responsivo; recomende app nativo apenas se ele pediu ou houver justificativa forte.

ANÁLISE POR CATEGORIA:
- Sistemas, automação, IA e integrações: priorize eficiência operacional, confiabilidade, governança, segurança, rastreabilidade, custos, produtividade e escalabilidade. Não fale de branding, campanhas ou conversão, a menos que o cliente tenha pedido.
- Landing page e e-commerce: priorize mensagem, público, jornada, conversão e percepção de marca.

ESCOPO:
- estimationModules: liste todos os módulos, cada um em uma fase. "mvp" é o mínimo que resolve o problema central; "profissional" é a versão completa de operação; "evolucao" é o futuro. Mantenha o MVP enxuto.
- complexity: considere regras, volume, permissões e dependências. integrations é o número de integrações externas daquele módulo.
- clientDeadlineWeeks e clientBudgetMax: somente se o cliente informou um valor; senão, null. Converta meses em semanas.

PREÇO E PRAZO (priceEstimate):
- Estime o investimento e o prazo de desenvolvimento conforme a necessidade e a solicitação deste cliente, em reais e semanas.
- Crie uma fase para o MVP e outra para a versão profissional, se houver, com valores acumulados e os módulos de cada uma. Não precifique a evolução futura.
- Considere módulos, complexidade, esforço, integrações, regras, permissões, volume, testes, implantação, homologação, contingência e margem. Um escopo maior deve custar e demorar mais.
- Use faixas realistas para desenvolvimento sob medida no Brasil, com min menor que max. Inclua a manutenção mensal, se fizer sentido; senão, use 0.
- Em assumptions, explique em frases curtas o que mais pesou na estimativa.
- Nunca apresente a estimativa como cotação, contrato ou preço verificado, nem cite fontes de mercado. Não inclua infraestrutura nem licenças.
- Não escreva valores em reais nem prazos em semanas em nenhum outro campo.

REDAÇÃO:
- executiveSummary: 3 a 5 frases para um decisor: problema, solução, principal ganho e próximo passo.
- architecture: visão simples de camadas, dados, autenticação e integrações, justificada pelo projeto.
- assumptions: premissas. exclusions: o que não está incluído. risks: riscos reais, com a mitigação na mesma frase.
- Tom consultivo, claro e convincente, sem promessas sem fundamento.

IMAGEM DO PROJETO (imageBrief):
- Extraia os dados que definem a tela principal, usando somente o que o projeto prevê. Não crie funcionalidades incompatíveis com o briefing.
- productName, productCategory e objective: curtos e fiéis. users: os perfis reais.
- layoutPattern: corporativo, financeiro, educacional, medico, ecommerce, mobile ou landing, conforme a natureza do produto.
- modules: de 4 a 7 itens de menu reais, com até 3 palavras; em landing, as seções.
- kpis: de 3 a 4 indicadores mais relevantes para as decisões deste cliente, somente o nome, sem valores. Exemplo em governança de reservas SAP: reservas ativas, valor total reservado, itens críticos, duplicidades.
- charts: até 2 gráficos, dizendo o que comparam. tableColumns: até 5 colunas curtas. Em landing, deixe ambos vazios.
- device: "mobile" somente em aplicativo. identity e references: apenas o que o cliente informou; senão, vazio. Nunca presuma cores de marca.
- visualConcept.visualPrompt: uma frase curta descrevendo a tela.

Não cite OpenAI, modelo ou prompt. Responda em português do Brasil.
`.trim();
