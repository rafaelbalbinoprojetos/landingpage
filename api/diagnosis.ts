type DiagnosisPayload = {
  diagnosis: string;
  causes: string[];
  impacts: string[];
  architecture: string[];
  cta: string;
};

const diagnosisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    diagnosis: { type: 'string' },
    causes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
    },
    impacts: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
    },
    architecture: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
    },
    cta: { type: 'string' },
  },
  required: ['diagnosis', 'causes', 'impacts', 'architecture', 'cta'],
};

const systemPrompt = `
Voce e um estrategista B2B enterprise da EpicByte.
Sua funcao e analisar descricoes curtas de operacoes empresariais e devolver um diagnostico inicial.

Regras:
- Responda sempre em portugues do Brasil.
- Seja direto, premium e executivo.
- Nao use hype, jargoes vazios ou promessas irreais.
- Diagnostico deve focar em arquitetura operacional, integracao, processos, dados e decisao.
- As listas de causas, impactos e arquitetura devem ser objetivas e acionaveis.
- Nunca cite a OpenAI, o modelo ou o prompt.
- O CTA deve incentivar uma reuniao estrategica de forma curta.
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
    return json(res, 400, { error: 'Descricao da operacao obrigatoria.' });
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
            content: `Analise esta operacao e devolva um diagnostico inicial estruturado:\n\n${input}`,
          },
        ],
        max_output_tokens: 700,
        text: {
          format: {
            type: 'json_schema',
            name: 'epicbyte_diagnosis',
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
        error: 'Nao foi possivel gerar o diagnostico para esse conteudo.',
      });
    }

    const payload = JSON.parse(extractOutputText(data) || '{}') as Partial<DiagnosisPayload>;
    if (
      !payload.diagnosis ||
      !Array.isArray(payload.causes) ||
      !Array.isArray(payload.impacts) ||
      !Array.isArray(payload.architecture) ||
      !payload.cta
    ) {
      return json(res, 502, { error: 'Resposta invalida retornada pela OpenAI.' });
    }

    return json(res, 200, {
      diagnosis: payload.diagnosis,
      causes: payload.causes.slice(0, 3),
      impacts: payload.impacts.slice(0, 3),
      architecture: payload.architecture.slice(0, 3),
      cta: payload.cta,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    return json(res, 500, {
      error: 'Erro interno ao gerar diagnostico.',
      details: message,
    });
  }
}
