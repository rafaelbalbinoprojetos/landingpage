import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import handler from '../api/diagnosis-image';
import { briefFromMockup, buildImagePrompt, getImageSize, resolveStyle, sanitizeImageBrief } from '../api/_diagnosis/imagePrompt';
import type { ImageBrief } from '../api/_diagnosis/imagePrompt';

const sap: ImageBrief = {
  productName: 'Governança de Reservas',
  productCategory: 'Sistema corporativo integrado ao SAP',
  objective: 'Controlar reservas e custos por área',
  users: ['Gestores', 'Suprimentos'],
  layoutPattern: 'corporativo',
  modules: ['Reservas', 'Aprovações', 'Custos', 'Relatórios'],
  kpis: ['Reservas ativas', 'Valor total reservado', 'Itens críticos', 'Duplicidades'],
  charts: ['Evolução dos custos', 'Custos por área'],
  tableColumns: ['Reserva', 'Área', 'Valor', 'Status'],
  primaryAction: 'Aprovar reserva',
  device: 'desktop',
  identity: '',
  references: '',
};

test('o prompt tem os 9 blocos, na ordem, e usa os requisitos do projeto', () => {
  const prompt = buildImagePrompt(sap, 'auto');
  const titles = ['1. CONTEXTO', '2. DIREÇÃO', '3. ESTRUTURA', '4. COMPONENTES', '5. HIERARQUIA', '6. PALETA', '7. TIPOGRAFIA', '8. RESTRIÇÕES', '9. PROPORÇÃO'];
  const positions = titles.map((title) => prompt.indexOf(title));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const item of ['Duplicidades', 'Evolução dos custos', 'Aprovar reserva']) assert.ok(prompt.includes(item));
  assert.match(prompt, /ilustrativos/);
});

test('o layout muda conforme o tipo de produto', () => {
  const layouts = (['corporativo', 'financeiro', 'educacional', 'medico', 'ecommerce', 'mobile', 'landing'] as const)
    .map((layoutPattern) => buildImagePrompt({ ...sap, layoutPattern }, 'enterprise_dark').split('3. ESTRUTURA')[1].split('4. COMPONENTES')[0]);
  assert.equal(new Set(layouts).size, 7);
});

test('os 4 estilos são aplicados, e sem escolha o estilo segue o tipo de produto', () => {
  for (const [style, name] of [['glassmorphism_premium', 'Glassmorphism Premium'], ['enterprise_dark', 'Enterprise Dark'], ['minimal_light', 'Minimal Light'], ['futuristic_tech', 'Futuristic Tech']]) {
    assert.ok(buildImagePrompt(sap, style).includes(name));
  }
  assert.equal(resolveStyle('auto', 'medico'), 'minimal_light');
  assert.equal(resolveStyle('invalido', 'corporativo'), 'enterprise_dark');
  assert.equal(resolveStyle(undefined, 'landing'), 'glassmorphism_premium');
});

test('a identidade do cliente substitui a paleta padrão', () => {
  assert.ok(buildImagePrompt({ ...sap, identity: 'Verde #00A86B' }, 'auto').includes('Verde #00A86B'));
});

test('o formato acompanha o dispositivo', () => {
  assert.equal(getImageSize(sap), '1536x1024');
  assert.equal(getImageSize({ ...sap, layoutPattern: 'mobile' }), '1024x1536');
});

test('dados do navegador são limitados e a lista é reduzida', () => {
  const brief = sanitizeImageBrief({ ...sap, productName: 'a'.repeat(500), modules: Array(30).fill('Módulo'), kpis: Array(20).fill('K'), layoutPattern: 'hack' });
  assert.equal(brief?.productName.length, 60);
  assert.equal(brief?.modules.length, 7);
  assert.equal(brief?.kpis.length, 4);
  assert.equal(brief?.layoutPattern, 'corporativo');
  assert.equal(sanitizeImageBrief({ productName: 'x', modules: [] }), null);
  assert.equal(sanitizeImageBrief('texto'), null);
});

test('proposta sem briefing de imagem deriva os dados do mockup', () => {
  const brief = briefFromMockup({
    businessName: 'Loja Alfa',
    projectCategory: 'E-commerce',
    mockup: { title: 'Loja', screenType: 'Catálogo', primaryAction: 'Comprar', modules: ['Produtos'], dataHighlights: ['Vendas'] },
  });
  assert.equal(brief?.layoutPattern, 'ecommerce');
});

type Call = { url: string; body: any };
let calls: Call[] = [];
let reviews: unknown[] = [];

const clearReviewEnvironment = () => {
  for (const key of ['IMAGE_REVIEW_ENABLED', 'IMAGE_REVIEW_MAX_REGENERATIONS', 'IMAGE_REVIEW_MIN_SCORE', 'OPENAI_IMAGE_MODEL', 'OPENAI_IMAGE_QUALITY']) delete process.env[key];
};

beforeEach(() => {
  calls = [];
  reviews = [];
  clearReviewEnvironment();
  process.env.OPENAI_API_KEY = 'teste';
  globalThis.fetch = (async (url: unknown, init: any) => {
    const target = String(url);
    calls.push({ url: target, body: JSON.parse(init.body) });
    if (target.includes('/images/generations')) {
      const count = calls.filter((call) => call.url.includes('/images/generations')).length;
      return new Response(JSON.stringify({ data: [{ b64_json: `imagem${count}` }] }), { status: 200 });
    }
    return new Response(JSON.stringify({ output_text: JSON.stringify(reviews.shift()) }), { status: 200 });
  }) as typeof fetch;
});

const callApi = async (body: unknown) => {
  let output: any;
  const res = { status() { return this; }, setHeader() { return this; }, send(text: string) { output = JSON.parse(text); } };
  await handler({ method: 'POST', body }, res);
  return output;
};

const review = (score: number, corrections = '') => ({
  scores: { fidelidade: score, hierarquia: 5, legibilidade: 5, coerencia: 5, consistencia: 5, qualidade: 5, sem_elementos_indevidos: 5 },
  corrections,
});

test('padrão: uma única geração, sem avaliação, sem mudar modelo e qualidade', async () => {
  const result = await callApi({ imageBrief: sap, prompt: 'BRIEFING BRUTO' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.model, 'gpt-image-2.5-sunburst');
  assert.equal(calls[0].body.quality, 'high');
  assert.ok(!calls[0].body.prompt.includes('BRIEFING BRUTO'));
  assert.ok(calls[0].body.prompt.includes('Reservas ativas'));
  assert.ok(result.imageDataUrl.endsWith('imagem1'));
});

test('avaliação ligada sem regeneração: avalia, mas não gera de novo', async () => {
  process.env.IMAGE_REVIEW_ENABLED = 'true';
  reviews = [review(1, 'Corrigir textos')];
  await callApi({ imageBrief: sap });
  assert.equal(calls.filter((call) => call.url.includes('/images/generations')).length, 1);
  assert.equal(calls.length, 2);
});

test('regeneração recebe as correções e respeita o limite configurado', async () => {
  process.env.IMAGE_REVIEW_ENABLED = 'true';
  process.env.IMAGE_REVIEW_MAX_REGENERATIONS = '1';
  reviews = [review(2, 'Corrigir o texto do menu'), review(5)];
  const result = await callApi({ imageBrief: sap });
  const generations = calls.filter((call) => call.url.includes('/images/generations'));
  assert.equal(generations.length, 2);
  assert.ok(generations[1].body.prompt.includes('Corrigir o texto do menu'));
  assert.ok(result.imageDataUrl.endsWith('imagem2'));
});

test('entrega a melhor versão se a regeneração sair pior', async () => {
  process.env.IMAGE_REVIEW_ENABLED = 'true';
  process.env.IMAGE_REVIEW_MAX_REGENERATIONS = '1';
  reviews = [review(3, 'Ajustar'), review(1)];
  const result = await callApi({ imageBrief: sap });
  assert.ok(result.imageDataUrl.endsWith('imagem1'));
});

test('imagem boa não gera custo extra', async () => {
  process.env.IMAGE_REVIEW_ENABLED = 'true';
  process.env.IMAGE_REVIEW_MAX_REGENERATIONS = '2';
  reviews = [review(5)];
  await callApi({ imageBrief: sap });
  assert.equal(calls.filter((call) => call.url.includes('/images/generations')).length, 1);
});

test('falha na avaliação entrega a imagem já gerada', async () => {
  process.env.IMAGE_REVIEW_ENABLED = 'true';
  reviews = ['resposta inválida'];
  const result = await callApi({ imageBrief: sap });
  assert.ok(result.imageDataUrl.endsWith('imagem1'));
});
