import { LIMIT_MESSAGE, checkAiBudget } from './_diagnosis/security.js';

export const config = {
  maxDuration: 30,
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!(await checkAiBudget(req, 'voice'))) return json(res, 429, { error: LIMIT_MESSAGE });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return json(res, 500, { error: 'Geração de voz indisponível: configure ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID.' });
  }

  const body = extractRequestBody(req.body);
  const text = String(body.text || '').trim().slice(0, 900);
  if (!text) {
    return json(res, 400, { error: 'Texto obrigatório para geração de voz.' });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.48,
          similarity_boost: 0.78,
          style: 0.28,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const reason = await response.text();
      return json(res, response.status, {
        error: 'Não foi possível gerar o resumo em áudio agora.',
        reason: reason.slice(0, 500),
      });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    return json(res, 200, {
      audioBase64: audioBuffer.toString('base64'),
      contentType: response.headers.get('content-type') || 'audio/mpeg',
    });
  } catch {
    return json(res, 500, { error: 'Não foi possível gerar o resumo em áudio agora.' });
  }
}
