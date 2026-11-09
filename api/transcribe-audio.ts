import { LIMIT_MESSAGE, checkAiBudget } from './_diagnosis/security.js';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

const maxAudioBytes = 18 * 1024 * 1024;
const transcriptionFallbackError = 'Não consegui transcrever esse áudio com segurança. Você pode tentar gravar novamente ou digitar a mensagem.';
const transcriptionLimitError = 'A transcrição por áudio atingiu um limite temporário da OpenAI. Você pode tentar novamente em instantes ou digitar a mensagem para continuar o briefing.';

const json = (res: any, status: number, body: Record<string, unknown>) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
};

const readRequestBuffer = async (req: any) => {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > maxAudioBytes) {
      throw new Error('AUDIO_TOO_LARGE');
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
};

const parseBoundary = (contentType: string) => {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  return match?.[1] || match?.[2] || '';
};

const stripCrlf = (buffer: Buffer) => {
  let start = 0;
  let end = buffer.length;
  while (buffer[start] === 13 || buffer[start] === 10) start += 1;
  while (end > start && (buffer[end - 1] === 13 || buffer[end - 1] === 10)) end -= 1;
  return buffer.subarray(start, end);
};

const parseMultipartAudio = (buffer: Buffer, boundary: string) => {
  const delimiter = Buffer.from(`--${boundary}`);
  let position = buffer.indexOf(delimiter);

  while (position !== -1) {
    const nextPosition = buffer.indexOf(delimiter, position + delimiter.length);
    if (nextPosition === -1) break;

    const rawPart = stripCrlf(buffer.subarray(position + delimiter.length, nextPosition));
    position = nextPosition;

    if (!rawPart.length || rawPart.equals(Buffer.from('--'))) continue;

    const headerEnd = rawPart.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEnd === -1) continue;

    const headerText = rawPart.subarray(0, headerEnd).toString('utf8');
    const body = stripCrlf(rawPart.subarray(headerEnd + 4));
    const disposition = headerText.match(/content-disposition:\s*([^\r\n]+)/i)?.[1] || '';
    const contentType = headerText.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || 'audio/webm';
    const name = disposition.match(/name="([^"]+)"/i)?.[1] || '';
    const filename = disposition.match(/filename="([^"]+)"/i)?.[1] || 'briefing-audio.webm';

    if (name === 'audio' && body.length) {
      return { buffer: body, contentType, filename };
    }
  }

  return null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!(await checkAiBudget(req, 'transcribe'))) return json(res, 429, { text: '', error: LIMIT_MESSAGE });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(res, 200, {
      text: '',
      error: 'Transcrição indisponível: OPENAI_API_KEY não configurada.',
      code: 'missing_openai_key',
    });
  }

  try {
    const contentType = String(req.headers['content-type'] || '');
    const boundary = parseBoundary(contentType);
    if (!boundary) {
      return json(res, 200, { text: '', error: 'Envie o áudio em multipart/form-data.', code: 'invalid_form_data' });
    }

    const requestBuffer = await readRequestBuffer(req);
    const audio = parseMultipartAudio(requestBuffer, boundary);
    if (!audio) {
      return json(res, 200, { text: '', error: 'Arquivo de áudio não encontrado.', code: 'missing_audio' });
    }

    if (audio.buffer.length > maxAudioBytes) {
      return json(res, 200, {
        text: '',
        error: 'O áudio ficou muito longo. Tente gravar em partes menores para manter a precisão do briefing.',
        code: 'audio_too_large',
      });
    }

    const formData = new FormData();
    const audioBlob = new Blob([audio.buffer], { type: audio.contentType });
    formData.append('file', audioBlob, audio.filename || 'briefing-audio.webm');
    formData.append('model', process.env.OPENAI_TRANSCRIPTION_MODEL || 'whisper-1');
    formData.append('language', 'pt');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    if (!response.ok) {
      const isLimitError = response.status === 429;
      return json(res, 200, {
        text: '',
        error: isLimitError ? transcriptionLimitError : transcriptionFallbackError,
        code: isLimitError ? 'openai_rate_limited' : 'openai_transcription_failed',
        upstreamStatus: response.status,
        reason: responseText.slice(0, 500),
      });
    }

    const data = JSON.parse(responseText || '{}') as { text?: string };
    return json(res, 200, { text: String(data.text || '').trim() });
  } catch (error) {
    if (error instanceof Error && error.message === 'AUDIO_TOO_LARGE') {
      return json(res, 200, {
        text: '',
        error: 'O áudio ficou muito longo. Tente gravar em partes menores para manter a precisão do briefing.',
        code: 'audio_too_large',
      });
    }

    return json(res, 200, {
      text: '',
      error: transcriptionFallbackError,
      code: 'transcription_failed',
    });
  }
}
