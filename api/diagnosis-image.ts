export const config = {
  maxDuration: 180,
};

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

const shouldGenerateImage = () => {
  const raw = String(process.env.NANOBANANA_IMAGE_ENABLED || process.env.OPENAI_IMAGE_ENABLED || 'true').toLowerCase().trim();
  return !['0', 'false', 'no', 'off'].includes(raw);
};

const isUnavailableModelError = (error: unknown) => {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error || '').toLowerCase();
  return ['model', 'does not exist', 'not found', 'unsupported', 'invalid'].some((term) => message.includes(term));
};

const inferPromptMode = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  if (
    [
      'law firm',
      'advocacia',
      'lawyer',
      'advogado',
      'dental',
      'dentist',
      'odont',
      'clinic',
      'clínica',
      'clinica',
      'barbershop',
      'barbearia',
      'restaurant',
      'restaurante',
      'aesthetics',
      'estética',
      'estetica',
      'local business',
      'office',
      'escritório',
      'escritorio',
    ].some((term) => normalized.includes(term))
  ) {
    return 'marketing-site';
  }

  if (
    ['metrology', 'metrolog', 'industrial', 'factory', 'automotive', 'fifo', 'calibration', 'calibração', 'laudo', 'inspection room'].some((term) =>
      normalized.includes(term)
    )
  ) {
    return 'industrial';
  }

  if (['internal management', 'admin dashboard', 'workflow', 'approval', 'role-based', 'sistema interno'].some((term) => normalized.includes(term))) {
    return 'internal';
  }

  if (['ecommerce', 'online store', 'loja virtual', 'checkout', 'cart', 'carrinho', 'catalog'].some((term) => normalized.includes(term))) {
    return 'ecommerce';
  }

  if (['mobile app', 'app mobile', 'aplicativo', 'smartphone screens', 'ios', 'android'].some((term) => normalized.includes(term))) {
    return 'app';
  }

  return 'marketing-site';
};

const getSegmentDirection = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  if (['law firm', 'advocacia', 'lawyer', 'advogado', 'juridico', 'jurídico'].some((term) => normalized.includes(term))) {
    return 'premium law firm brand direction: authority, luxury, executive confidence, institutional trust, discretion, black, graphite, dark blue and restrained gold palette, editorial photography of confident lawyers in a sophisticated corporate office, high-end legal positioning';
  }
  if (['dental', 'odont', 'dentist'].some((term) => normalized.includes(term))) {
    return 'premium dental clinic brand direction: human warmth, clinical trust, clean healthcare sophistication, white and light blue palette, soft natural light, smiling dentist or patient, modern clinic environment, calm appointment-focused storytelling';
  }
  if (['barbershop', 'barbearia', 'barber'].some((term) => normalized.includes(term))) {
    return 'premium barbershop brand direction: masculine elegance, urban lifestyle, black, graphite, restrained gold and wood textures, editorial photography inside a refined barber environment, confident service positioning and appointment-driven experience';
  }
  if (['fashion', 'moda feminina', 'loja feminina', 'boutique'].some((term) => normalized.includes(term))) {
    return 'premium feminine fashion brand direction: editorial lifestyle, refined femininity, rose, white and nude palette, elegant model photography, curated collections, spacious commercial storytelling and boutique-level perception';
  }
  if (['medical', 'consultorio', 'consultório', 'clinica', 'clínica', 'healthcare'].some((term) => normalized.includes(term))) {
    return 'premium medical brand direction: corporate healthcare credibility, clean white, blue and soft green palette, professional medical photography, patient care, trust, calm hierarchy and institutional clarity';
  }
  if (['hospital', 'healthcare enterprise', 'bi hospital', 'hospitalar'].some((term) => normalized.includes(term))) {
    return 'healthcare enterprise brand direction: executive healthcare management, BI credibility, real hospital operations, calm corporate interface, clean data hierarchy, institutional trust and operational seriousness';
  }
  if (['athlete', 'atleta', 'personal brand', 'marca pessoal', 'sport', 'esportivo'].some((term) => normalized.includes(term))) {
    return 'premium athlete personal brand direction: global lifestyle branding, editorial sports photography, cinematic movement, refined contrast, aspirational narrative, premium personal positioning and sophisticated campaign composition';
  }
  return 'segment-specific premium brand direction with real-world positioning, editorial photography, coherent colors, institutional hierarchy and polished commercial perception';
};

const compactPromptForRetry = (prompt: string) => {
  const compacted = prompt
    .replace(/\s+/g, ' ')
    .trim();

  return [
    compacted.slice(0, 1600),
    'Gere apenas a imagem final da interface, como um screenshot full-page real. A página deve preencher 100% da imagem, de borda a borda, sem fundo externo, sem canvas cinza, sem página centralizada, sem monitor, notebook, celular, tablet, moldura, mockup, apresentação, mesa ou ambiente físico.',
  ].join('\n\n');
};

const extractClientName = (prompt: string) => {
  const forMatch = prompt.match(/\bfor\s+([^,.]+?)(?:,|\s+a\s+|\s+an\s+|\s+based|\.)/i);
  if (forMatch?.[1]) return forMatch[1].trim();

  const namedMatch = prompt.match(/(?:business|project|client|empresa|negócio|negocio|projeto)\s+(?:name|is|é|e|:)\s*([^,.]+)/i);
  if (namedMatch?.[1]) return namedMatch[1].trim();

  return 'the client business';
};

const enhanceVisualPrompt = (prompt: string) => {
  const mode = inferPromptMode(prompt);
  const clientName = extractClientName(prompt);
  const finalBriefing = prompt.replace(/\{\{BRIEFING_FINAL\}\}/g, '').trim();
  const screenshotRule =
    'A imagem deve ser um screenshot direto, vertical e edge-to-edge da tela do site/sistema. A interface deve preencher 100% da imagem, de borda a borda. Nao crie pagina centralizada em fundo cinza, cartao flutuante, sombra externa, margem ao redor, monitor, notebook, celular, tablet, moldura, mockup, apresentacao, mesa ou ambiente fisico.';

  if (mode === 'industrial') {
    return [
      `Crie um print direto da tela de um sistema enterprise profissional para este briefing: ${finalBriefing}`,
      screenshotRule,
      'Se for metrologia/industria, mostre dashboard operacional realista com FIFO, rastreabilidade, produtividade, equipamentos, calibração, laudos e indicadores.',
      `Use apenas o nome do cliente quando fizer sentido: ${clientName}.`,
    ].join('\n');
  }

  if (mode === 'internal') {
    return [
      `Crie um print direto da tela de um sistema interno profissional para este briefing: ${finalBriefing}`,
      screenshotRule,
      'Mostre dashboard administrativo, status de workflow, indicadores, relatórios, filtros e permissões se fizer sentido.',
      `Use apenas o nome do cliente quando fizer sentido: ${clientName}.`,
    ].join('\n');
  }

  if (mode === 'ecommerce') {
    return [
      `Crie um print direto da tela de uma loja virtual profissional para este briefing: ${finalBriefing}`,
      screenshotRule,
      'Mostre catálogo, produto, carrinho/checkout e layout comercial premium se fizer sentido.',
      `Use apenas o nome do cliente quando fizer sentido: ${clientName}.`,
    ].join('\n');
  }

  if (mode === 'app') {
    return [
      `Crie a tela principal de um aplicativo profissional para este briefing: ${finalBriefing}`,
      screenshotRule,
      `Use apenas o nome do cliente quando fizer sentido: ${clientName}.`,
    ].join('\n');
  }

  return [
    `Crie um print direto da tela de uma landing page profissional para este briefing: ${finalBriefing}`,
    screenshotRule,
    'Mostre uma página completa, vertical, como captura de tela de site real, com hero, navegação e seções abaixo. Não use fundo externo fora da página.',
    'Priorize uma landing page editorial premium, com menos cards pequenos, mais respiro visual, seções amplas, tipografia limpa e hierarquia sofisticada. Evite excesso de miniaturas, excesso de blocos repetidos e textos pequenos demais.',
    'Se for Neymar ou marca pessoal de atleta, crie uma landing page profissional sobre Neymar Jr. com informações relevantes do jogador, carreira, futebol, comunidade, redes sociais, instituto e visual esportivo premium.',
    'Se for consultório odontológico, crie uma landing page profissional para consultório odontológico.',
    'Se for escritório de advocacia, crie uma landing page profissional para escritório de advocacia.',
    `Use apenas o nome do projeto/cliente quando fizer sentido: ${clientName}.`,
  ].join('\n');
};

const isApplicationPrompt = (prompt: string) =>
  /dashboard|painel|sistema|gest[aã]o|indicador|m[oó]dulos? reais|tabela|erp|crm|workflow/i.test(prompt) &&
  !/landing page|site institucional/i.test(prompt);

const applicationArtDirection = [
  'Crie a captura de tela de um sistema web real, em produção, projetado por um estúdio sênior de produto. Referência de acabamento: Linear, Stripe Dashboard e Vercel, sem copiar suas marcas.',
  'Composição desktop: menu lateral com os módulos reais, barra superior com busca, filtros e usuário, linha de indicadores, gráfico principal grande, painel secundário e tabela com dados.',
  'Acabamento: grade rigorosa, alinhamento perfeito, espaçamento consistente, hierarquia tipográfica clara, sans-serif de interface, bordas finas, poucas cores de destaque e chips de status.',
  'Os dados devem ser plausíveis e coerentes entre si: totais, gráficos e linhas da tabela contam a mesma história. Sem lorem ipsum nem blocos cinza no lugar de texto.',
  'Todo texto deve estar em português do Brasil, com ortografia correta, nítido e legível.',
].join('\n');

const siteArtDirection = [
  'Crie a captura de tela de um site real, projetado por um estúdio sênior, com direção de arte específica deste segmento.',
  'Composição: navegação, hero com mensagem forte e seções abaixo, com hierarquia editorial, tipografia sofisticada, imagens coerentes e respiro generoso.',
  'Todo texto deve estar em português do Brasil, com ortografia correta, nítido e legível. Sem lorem ipsum.',
].join('\n');

const buildDirectImagePrompt = (prompt: string) => [
  isApplicationPrompt(prompt) ? applicationArtDirection : siteArtDirection,
  `BRIEFING DESTA TELA:\n${prompt.trim()}`,
  'IMPORTANTE: gere somente a interface, preenchendo 100% da imagem de borda a borda. Não mostre monitor, notebook, celular, moldura, mesa, sombra de apresentação nem fundo externo. Não inclua logotipos de terceiros.',
].join('\n\n');

const getNanoBananaModels = () => {
  const configured = String(process.env.NANOBANANA_MODEL || process.env.GEMINI_IMAGE_MODEL || '').trim();
  return [configured, 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image-preview', 'gemini-2.5-flash-image']
    .filter(Boolean)
    .filter((model, index, models) => models.indexOf(model) === index);
};

const extractGeminiImage = (result: any) => {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inlineData = part?.inlineData || part?.inline_data;
    const data = inlineData?.data;
    if (data) {
      const mimeType = inlineData?.mimeType || inlineData?.mime_type || 'image/png';
      return `data:${mimeType};base64,${data}`;
    }
  }
  return null;
};

const extractGeminiText = (result: any) => {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  return parts.map((part: any) => part?.text).filter(Boolean).join(' ').trim();
};

const getNanoBananaRequestVariants = (mode: string) => {
  const aspectRatio = ['marketing-site', 'ecommerce', 'app'].includes(mode) ? '9:16' : '16:9';
  return [
  {
    label: `image-${aspectRatio}-2k`,
    body: (prompt: string) => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        responseFormat: {
          image: {
            aspectRatio,
            imageSize: '2K',
          },
        },
      },
    }),
  },
  {
    label: `image-${aspectRatio}`,
    body: (prompt: string) => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        responseFormat: {
          image: {
            aspectRatio,
          },
        },
      },
    }),
  },
  {
    label: 'image-only',
    body: (prompt: string) => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    }),
  },
  {
    label: 'official-simple',
    body: (prompt: string) => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  },
  {
    label: 'text-and-image',
    body: (prompt: string) => ({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  },
  ];
};

const generateImageWithNanoBanana = async (apiKey: string, prompt: string) => {
  const mode = inferPromptMode(prompt);
  const models = getNanoBananaModels();
  const requestVariants = [
    ...getNanoBananaRequestVariants(mode),
  ];
  let lastError: unknown = null;

  for (const model of models) {
    for (const variant of requestVariants) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(variant.body(prompt)),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = result?.error?.message || response.statusText || `Google image API returned ${response.status}.`;
          throw new Error(`${response.status} ${message}`);
        }

        const imageDataUrl = extractGeminiImage(result);
        if (imageDataUrl) {
          return {
            imageDataUrl,
            model,
            size: variant.label.replace('image-', ''),
            variant: variant.label,
          };
        }

        const text = extractGeminiText(result);
        lastError = new Error(text || `Nano Banana returned no inline image for ${model}/${variant.label}.`);
      } catch (error) {
        lastError = error;
        console.error('Nano Banana image attempt failed:', {
          model,
          variant: variant.label,
          message: error instanceof Error ? error.message : String(error),
        });
        if (!isUnavailableModelError(error)) continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Nano Banana image generation failed.');
};

// Limite abaixo do maxDuration, para sobrar tempo ao Gemini como reserva.
const OPENAI_IMAGE_TIMEOUT_MS = 120_000;

const generateImageWithOpenAI = async (apiKey: string, prompt: string) => {
  const model = String(process.env.OPENAI_IMAGE_MODEL || '').trim() || 'gpt-image-2.5-sunburst';
  const quality = String(process.env.OPENAI_IMAGE_QUALITY || '').trim() || 'high';
  const size = '1536x1024';
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, prompt, size, quality, n: 1 }),
    signal: AbortSignal.timeout(OPENAI_IMAGE_TIMEOUT_MS),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${result?.error?.message || response.statusText}`);
  }

  const base64 = result?.data?.[0]?.b64_json;
  if (!base64) throw new Error(`OpenAI returned no image for ${model}.`);
  return { imageDataUrl: `data:image/png;base64,${base64}`, model, size, variant: 'openai-images' };
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!shouldGenerateImage()) {
    return json(res, 200, {
      imageDataUrl: null,
      error: 'Geração de imagem está desativada por NANOBANANA_IMAGE_ENABLED. A proposta textual foi preservada.',
      reason: 'NANOBANANA_IMAGE_ENABLED_DISABLED',
    });
  }

  const apiKey = process.env.NANOBANANA || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey && !apiKey) {
    return json(res, 200, {
      imageDataUrl: null,
      error: 'Nenhuma chave de geração de imagem está configurada neste ambiente. A proposta textual foi preservada.',
      reason: 'MISSING_IMAGE_API_KEY',
    });
  }

  const body = extractRequestBody(req.body);
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) {
    return json(res, 400, { error: 'Prompt visual obrigatorio.' });
  }

  const imagePrompt = buildDirectImagePrompt(prompt);

  try {
    console.log('Visual prompt:', prompt);
    let image;
    if (openAiKey) {
      try {
        console.log('Calling OpenAI image generation...');
        image = await generateImageWithOpenAI(openAiKey, imagePrompt);
      } catch (openAiError) {
        console.error('OpenAI image generation failed:', openAiError);
        if (!apiKey) throw openAiError;
      }
    }
    if (!image && apiKey) {
      console.log('Calling Nano Banana image generation...');
      try {
        image = await generateImageWithNanoBanana(apiKey, imagePrompt);
      } catch (primaryError) {
        console.error('Nano Banana raw prompt failed, retrying with compact prompt:', primaryError);
        image = await generateImageWithNanoBanana(apiKey, compactPromptForRetry(prompt));
      }
    }
    if (!image) throw new Error('IMAGE_GENERATION_FAILED');
    console.log('Image generation result:', { model: image.model, size: image.size, variant: image.variant, hasImage: Boolean(image.imageDataUrl) });
    return json(res, 200, {
      imageDataUrl: image.imageDataUrl,
      image: image.imageDataUrl,
      model: image.model,
      size: image.size,
      variant: image.variant,
    });
  } catch (error) {
    console.error('Image generation failed:', error);
    const reason = error instanceof Error ? error.message : String(error || 'IMAGE_GENERATION_FAILED');
    return json(res, 200, {
      imageDataUrl: null,
      error: `Não foi possível gerar o preview visual premium agora. A proposta textual foi preservada. Detalhe técnico: ${reason}`,
      reason,
    });
  }
}
