import { buildImagePrompt, buildReviewPrompt, getImageSize, getReviewConfig, imageReviewSchema, sanitizeImageBrief, scoreReview } from './_diagnosis/imagePrompt.js';
import { LIMIT_MESSAGE, acquireLock, checkAiBudget, consumeLimit, getLimits, releaseLock, verifyPayload } from './_diagnosis/security.js';
import type { ImageBrief, ImageReview } from './_diagnosis/imagePrompt.js';

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

const compactPromptForRetry = (prompt: string) => {
  const compacted = prompt
    .replace(/\s+/g, ' ')
    .trim();

  return [
    compacted.slice(0, 1600),
    'Gere apenas a imagem final da interface, como um screenshot full-page real. A página deve preencher 100% da imagem, de borda a borda, sem fundo externo, sem canvas cinza, sem página centralizada, sem monitor, notebook, celular, tablet, moldura, mockup, apresentação, mesa ou ambiente físico.',
  ].join('\n\n');
};

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

const FUNCTION_LIMIT_MS = 180_000;

const reviewImage = async (apiKey: string, imageDataUrl: string, brief: ImageBrief, model: string): Promise<ImageReview | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: buildReviewPrompt(brief) },
            { type: 'input_image', image_url: imageDataUrl },
          ],
        }],
        text: { format: { type: 'json_schema', name: 'image_review', strict: true, schema: imageReviewSchema } },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Review ${response.status}`);
    const data = await response.json();
    const output = data?.output_text || data?.output?.flatMap((item: any) => item?.content || []).find((part: any) => part?.text)?.text;
    const review = JSON.parse(output);
    if (!review?.scores || typeof review.corrections !== 'string') throw new Error('Review invalid');
    return review;
  } catch (error) {
    // A avaliação é opcional: se falhar, a imagem já gerada é entregue.
    console.error('Image review failed:', error instanceof Error ? error.message : 'unknown');
    return null;
  }
};

const generateReviewedImage = async (apiKey: string, brief: ImageBrief, style: unknown, startedAt: number) => {
  const size = getImageSize(brief);
  const config = getReviewConfig();
  let best = await generateImageWithOpenAI(apiKey, buildImagePrompt(brief, style), size);
  if (!config.enabled) return best;

  let bestScore = -1;
  let attempts = 0;
  let current = best;
  for (;;) {
    const review = await reviewImage(apiKey, current.imageDataUrl, brief, config.model);
    if (!review) return best;
    const score = scoreReview(review);
    if (score > bestScore) {
      best = current;
      bestScore = score;
    }
    const remaining = FUNCTION_LIMIT_MS - (Date.now() - startedAt);
    if (score >= config.minScore || attempts >= config.maxRegenerations || remaining < OPENAI_IMAGE_TIMEOUT_MS + 25_000) return best;
    attempts += 1;
    try {
      current = await generateImageWithOpenAI(apiKey, buildImagePrompt(brief, style, review.corrections), size);
    } catch (error) {
      console.error('Image regeneration failed:', error instanceof Error ? error.message : 'unknown');
      return best;
    }
  }
};

const generateImageWithOpenAI = async (apiKey: string, prompt: string, size = '1536x1024') => {
  const model = String(process.env.OPENAI_IMAGE_MODEL || '').trim() || 'gpt-image-2.5-sunburst';
  const quality = String(process.env.OPENAI_IMAGE_QUALITY || '').trim() || 'high';
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
    return json(res, 200, { imageDataUrl: null, error: 'Geração de imagem desativada. A proposta textual foi preservada.' });
  }

  const apiKey = process.env.NANOBANANA || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey && !apiKey) {
    return json(res, 200, { imageDataUrl: null, error: 'Imagem indisponível neste ambiente. A proposta textual foi preservada.' });
  }

  // Só o servidor emite os dados da imagem: prompts livres não são aceitos.
  const body = extractRequestBody(req.body);
  const grant = verifyPayload<{ id: string; brief: unknown }>('image', body.imageGrant);
  const brief = grant ? sanitizeImageBrief(grant.brief) : null;
  if (!grant || !brief) return json(res, 403, { error: 'Solicitação de imagem inválida ou expirada.' });

  const lockKey = `image:${grant.id}`;
  if (!(await acquireLock(lockKey, Math.ceil(FUNCTION_LIMIT_MS / 1000)))) {
    return json(res, 409, { error: 'Já existe uma imagem sendo gerada para esta proposta.' });
  }

  try {
    const withinProposal = await consumeLimit(`image-count:${grant.id}`, getLimits().imagesPerProposal, 86400);
    if (!withinProposal || !(await checkAiBudget(req, 'image'))) return json(res, 429, { error: LIMIT_MESSAGE });

    const startedAt = Date.now();
    const imagePrompt = buildImagePrompt(brief, body.style);
    let image;
    if (openAiKey) {
      try {
        image = await generateReviewedImage(openAiKey, brief, body.style, startedAt);
      } catch (openAiError) {
        console.error('OpenAI image generation failed:', openAiError instanceof Error ? openAiError.message : 'unknown');
        if (!apiKey) throw openAiError;
      }
    }
    if (!image && apiKey) {
      try {
        image = await generateImageWithNanoBanana(apiKey, imagePrompt);
      } catch (primaryError) {
        console.error('Primary image attempt failed:', primaryError instanceof Error ? primaryError.message : 'unknown');
        image = await generateImageWithNanoBanana(apiKey, compactPromptForRetry(imagePrompt));
      }
    }
    if (!image) throw new Error('IMAGE_GENERATION_FAILED');
    return json(res, 200, { imageDataUrl: image.imageDataUrl, model: image.model, size: image.size });
  } catch (error) {
    console.error('Image generation failed:', error instanceof Error ? error.message : 'unknown');
    return json(res, 200, { imageDataUrl: null, error: 'Não foi possível gerar o preview visual agora. A proposta textual foi preservada.' });
  } finally {
    await releaseLock(lockKey);
  }
}
