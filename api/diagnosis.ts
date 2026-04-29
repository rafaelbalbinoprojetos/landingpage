type DiagnosisPayload = {
  initialDiagnosis: string;
  epicByteApproach: string;
  developmentPlan: string[];
  recommendedTechnologies: string[];
  expectedFeatures: string[];
  timeEstimate: string;
  investmentEstimate: string;
  evolutionOpportunities: string[];
  nextStep: string;
};

const diagnosisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    initialDiagnosis: { type: 'string' },
    epicByteApproach: { type: 'string' },
    developmentPlan: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 6,
    },
    recommendedTechnologies: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 6,
    },
    expectedFeatures: {
      type: 'array',
      items: { type: 'string' },
      minItems: 4,
      maxItems: 8,
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
  },
  required: [
    'initialDiagnosis',
    'epicByteApproach',
    'developmentPlan',
    'recommendedTechnologies',
    'expectedFeatures',
    'timeEstimate',
    'investmentEstimate',
    'evolutionOpportunities',
    'nextStep',
  ],
};

const systemPrompt = `
Voce e um especialista senior da EpicByte em arquitetura de sistemas empresariais, automacao de processos e desenvolvimento de solucoes digitais sob medida.

Seu papel e atuar como um pre-consultor estrategico, analisando a solicitacao do cliente e gerando uma resposta profissional, clara e orientada a negocio.

Regras obrigatorias:
- Nunca responda como assistente generico.
- Sempre responda como especialista em arquitetura operacional.
- Evite respostas vagas, superficiais ou excessivamente academicas.
- Nao diga apenas "depende"; sempre entregue uma estimativa.
- Nunca forneca preco fechado; sempre forneca faixa estimada com justificativa.
- Linguagem profissional, empresarial, direta e consultiva.
- Responda em portugues do Brasil.
- Nao cite OpenAI, modelo, prompt, politica ou limitacoes internas.

Objetivo da resposta:
1. Entender o tipo de solucao.
2. Traduzir o problema em arquitetura.
3. Explicar como seria desenvolvido.
4. Sugerir tecnologias adequadas.
5. Descrever funcionalidades.
6. Estimar esforco em tempo.
7. Estimar investimento em faixa de valor.
8. Direcionar para diagnostico estrategico.

Regras de inteligencia por contexto:
- Se for landing page: priorize conversao, UX/UI premium, animacoes suaves, performance, SEO e stack como React + Tailwind + Vercel.
- Se for sistema empresarial: priorize automacao, integracao entre areas, banco de dados, rastreabilidade e dashboards.
- Se for caso corporativo com ecossistema Microsoft: considere PowerApps + Microsoft Lists quando fizer sentido.
- Se for sistema complexo: divida em modulos, fale de escalabilidade e backend estruturado.

Diretrizes de formato:
- initialDiagnosis: explique o que o cliente realmente esta pedindo em termos de negocio e sistema.
- epicByteApproach: explique como a EpicByte estruturaria a solucao em arquitetura, integracao, automacao e dados.
- developmentPlan: liste etapas concretas de implementacao.
- recommendedTechnologies: liste stack e integracoes adequadas ao caso.
- expectedFeatures: liste telas, automacoes, integracoes, dashboards e fluxos esperados.
- timeEstimate: forneca faixa de tempo realista, por exemplo "2 a 6 semanas" ou "2 a 4 meses", com breve contexto.
- investmentEstimate: forneca faixa em reais com justificativa. Nunca valor unico.
- evolutionOpportunities: liste melhorias futuras relevantes.
- nextStep: direcione explicitamente para um diagnostico estrategico de 30 minutos.

Faixas de referencia para investimento:
- Landing pages premium: normalmente entre R$ 8 mil e R$ 25 mil.
- Portais, paineis e sistemas de media complexidade: normalmente entre R$ 25 mil e R$ 90 mil.
- Sistemas empresariais mais robustos, integrados ou modulares: normalmente entre R$ 90 mil e R$ 250 mil ou mais.

Use essas faixas como referencia, ajustando ao contexto descrito pelo cliente.
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

  const messageContent = data?.output?.[0]?.content;
  if (!Array.isArray(messageContent)) {
    return '';
  }

  const textPart = messageContent.find((item: any) => item?.type === 'output_text');
  return typeof textPart?.text === 'string' ? textPart.text : '';
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(res, 500, { error: 'OPENAI_API_KEY nao configurada no ambiente.' });
  }

  const body = extractRequestBody(req.body);
  const input = typeof body.input === 'string' ? body.input.trim() : '';
  if (!input) {
    return json(res, 400, { error: 'Descricao da solicitacao obrigatoria.' });
  }

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
          {
            role: 'user',
            content: `Agora analise a solicitacao do cliente e gere a resposta seguindo exatamente a estrutura pedida:\n\n${input}`,
          },
        ],
        max_output_tokens: 1400,
        text: {
          format: {
            type: 'json_schema',
            name: 'epicbyte_client_request_analysis',
            strict: true,
            schema: diagnosisSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json(res, 502, {
        error: 'Falha ao consultar a OpenAI.',
        details: errorText.slice(0, 1200),
      });
    }

    const data = await response.json();
    const refusal = data?.output?.[0]?.content?.[0];
    if (refusal?.type === 'refusal') {
      return json(res, 422, {
        error: 'Nao foi possivel gerar a analise para esse conteudo.',
      });
    }

    const payload = JSON.parse(extractOutputText(data) || '{}') as Partial<DiagnosisPayload>;
    if (
      !payload.initialDiagnosis ||
      !payload.epicByteApproach ||
      !Array.isArray(payload.developmentPlan) ||
      !Array.isArray(payload.recommendedTechnologies) ||
      !Array.isArray(payload.expectedFeatures) ||
      !payload.timeEstimate ||
      !payload.investmentEstimate ||
      !Array.isArray(payload.evolutionOpportunities) ||
      !payload.nextStep
    ) {
      return json(res, 502, { error: 'Resposta invalida retornada pela OpenAI.' });
    }

    return json(res, 200, {
      initialDiagnosis: payload.initialDiagnosis,
      epicByteApproach: payload.epicByteApproach,
      developmentPlan: payload.developmentPlan.slice(0, 6),
      recommendedTechnologies: payload.recommendedTechnologies.slice(0, 6),
      expectedFeatures: payload.expectedFeatures.slice(0, 8),
      timeEstimate: payload.timeEstimate,
      investmentEstimate: payload.investmentEstimate,
      evolutionOpportunities: payload.evolutionOpportunities.slice(0, 5),
      nextStep: payload.nextStep,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    return json(res, 500, {
      error: 'Erro interno ao gerar analise.',
      details: message,
    });
  }
}
