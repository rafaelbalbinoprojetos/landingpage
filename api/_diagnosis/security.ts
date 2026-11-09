import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

// Estado assinado: o navegador guarda o token, mas não consegue alterá-lo.
const getSecret = () => {
  const base = process.env.BRIEFING_STATE_SECRET || process.env.OPENAI_API_KEY || process.env.ELEVENLABS_API_KEY || '';
  return base ? createHash('sha256').update(`epicbyte-briefing:${base}`).digest() : null;
};

const hmac = (secret: Buffer, purpose: string, encoded: string) =>
  createHmac('sha256', secret).update(`${purpose}.${encoded}`).digest('base64url');

export const signPayload = (purpose: string, payload: unknown, ttlSeconds: number) => {
  const secret = getSecret();
  if (!secret) return null;
  const encoded = Buffer.from(JSON.stringify({ exp: Date.now() + ttlSeconds * 1000, payload })).toString('base64url');
  return `${encoded}.${hmac(secret, purpose, encoded)}`;
};

export const verifyPayload = <T>(purpose: string, token: unknown): T | null => {
  const secret = getSecret();
  if (!secret || typeof token !== 'string' || token.length > 200_000) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra !== undefined) return null;
  const expected = Buffer.from(hmac(secret, purpose, encoded));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return parsed.exp > Date.now() ? (parsed.payload as T) : null;
  } catch {
    return null;
  }
};

export const newId = () => randomUUID();

// Dados pessoais não precisam chegar ao modelo para definir um escopo.
export const redactPersonalData = (text: string) =>
  text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[e-mail removido]')
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[documento removido]')
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, '[documento removido]')
    .replace(/\b(?:\d[ -]?){13,19}\b/g, '[número removido]')
    .replace(/(?:\+?55[\s-]?)?\(?\b\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}\b/g, '[telefone removido]');

export const MAX_MESSAGE_LENGTH = 4000;

export const sanitizeClientMessage = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return redactPersonalData(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim()).slice(0, MAX_MESSAGE_LENGTH);
};

// O texto do cliente segue delimitado e sem marcações, para ser lido como dado.
export const wrapClientData = (text: string) =>
  `<mensagem_cliente>${text.replace(/</g, '‹').replace(/>/g, '›')}</mensagem_cliente>`;

const LEAK_PATTERN = /instru[cç][aã]o do sistema|system prompt|prompt do sistema|mensagem_cliente|minhas instru[cç][oõ]es|openai|chatgpt/i;
export const leaksInternals = (text: string) => LEAK_PATTERN.test(text);

export type AiKind = 'diagnosis' | 'proposal' | 'image' | 'voice' | 'transcribe';

const defaultLimits = {
  perHour: { diagnosis: 60, proposal: 6, image: 6, voice: 10, transcribe: 20 } as Record<AiKind, number>,
  costUnits: { diagnosis: 1, proposal: 5, image: 30, voice: 2, transcribe: 2 } as Record<AiKind, number>,
  dailyBudgetPerIp: 300,
  dailyBudgetGlobal: 3000,
  proposalsPerSession: 3,
  imagesPerProposal: 3,
};

export const getLimits = () => {
  try {
    const custom = JSON.parse(process.env.AI_LIMITS_JSON || '{}');
    return {
      ...defaultLimits,
      ...custom,
      perHour: { ...defaultLimits.perHour, ...custom.perHour },
      costUnits: { ...defaultLimits.costUnits, ...custom.costUnits },
    } as typeof defaultLimits;
  } catch {
    return defaultLimits;
  }
};

const memory = new Map<string, { value: number; expires: number }>();
export const resetRateLimitMemory = () => memory.clear();

const storeUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const storeToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
export const hasPersistentStore = () => Boolean(storeUrl() && storeToken());

const redis = async (commands: unknown[][]) => {
  const response = await fetch(`${storeUrl()}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${storeToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) throw new Error(`Store ${response.status}`);
  return (await response.json()) as Array<{ result: unknown }>;
};

const memoryAdd = (key: string, amount: number, windowSeconds: number) => {
  const now = Date.now();
  const current = memory.get(key);
  const entry = current && current.expires > now ? current : { value: 0, expires: now + windowSeconds * 1000 };
  entry.value += amount;
  memory.set(key, entry);
  return entry.value;
};

const addCounter = async (key: string, amount: number, windowSeconds: number) => {
  if (hasPersistentStore()) {
    try {
      const [incremented] = await redis([['INCRBY', key, amount], ['EXPIRE', key, windowSeconds, 'NX']]);
      return Number(incremented.result);
    } catch (error) {
      // Sem o armazenamento, o limite continua valendo nesta instância.
      console.error('Rate limit store unavailable:', error instanceof Error ? error.message : 'unknown');
    }
  }
  return memoryAdd(key, amount, windowSeconds);
};

export const consumeLimit = async (key: string, limit: number, windowSeconds: number, amount = 1) =>
  (await addCounter(`epicbyte:${key}`, amount, windowSeconds)) <= limit;

export const acquireLock = async (key: string, ttlSeconds: number) => {
  const name = `epicbyte:lock:${key}`;
  if (hasPersistentStore()) {
    try {
      const [result] = await redis([['SET', name, '1', 'NX', 'EX', ttlSeconds]]);
      return result.result === 'OK';
    } catch (error) {
      console.error('Lock store unavailable:', error instanceof Error ? error.message : 'unknown');
    }
  }
  const current = memory.get(name);
  if (current && current.expires > Date.now()) return false;
  memory.set(name, { value: 1, expires: Date.now() + ttlSeconds * 1000 });
  return true;
};

export const releaseLock = async (key: string) => {
  const name = `epicbyte:lock:${key}`;
  memory.delete(name);
  if (hasPersistentStore()) {
    try {
      await redis([['DEL', name]]);
    } catch {
      // O bloqueio expira sozinho.
    }
  }
};

export const getClientKey = (req: any) => {
  const headers = req?.headers || {};
  const raw = String(headers['x-vercel-forwarded-for'] || headers['x-forwarded-for'] || req?.socket?.remoteAddress || 'unknown');
  // Guarda apenas um hash do IP.
  return createHash('sha256').update(raw.split(',')[0].trim()).digest('hex').slice(0, 24);
};

// Limite por hora e orçamento diário de consumo, por visitante e global.
export const checkAiBudget = async (req: any, kind: AiKind) => {
  const limits = getLimits();
  const client = getClientKey(req);
  const day = new Date().toISOString().slice(0, 10);
  const cost = limits.costUnits[kind];
  if (!(await consumeLimit(`rate:${kind}:${client}`, limits.perHour[kind], 3600))) return false;
  if (!(await consumeLimit(`budget:${day}:${client}`, limits.dailyBudgetPerIp, 86400, cost))) return false;
  return consumeLimit(`budget:${day}:global`, limits.dailyBudgetGlobal, 86400, cost);
};

export const LIMIT_MESSAGE = 'Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente.';
