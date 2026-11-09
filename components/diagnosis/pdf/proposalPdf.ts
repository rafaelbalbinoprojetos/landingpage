import type { jsPDF as JsPDF } from 'jspdf';
import { DiagnosisProposal, LeadInfo } from '../types';
import {
  getImplementationPlan,
  getImpactPotential,
  getProposalPersona,
  getProposalTemplate,
  getReducedRisks,
  getRoiNarrative,
  getSuccessIndicators,
} from '../proposalInsights';

type PdfContext = {
  doc: JsPDF;
  width: number;
  height: number;
  margin: number;
  contentWidth: number;
  proposal: DiagnosisProposal;
  lead: LeadInfo | null;
};

const colors = {
  bg: [3, 8, 18] as [number, number, number],
  panel: [10, 20, 38] as [number, number, number],
  panel2: [13, 27, 50] as [number, number, number],
  cyan: [103, 232, 249] as [number, number, number],
  blue: [96, 165, 250] as [number, number, number],
  violet: [167, 139, 250] as [number, number, number],
  white: [245, 250, 255] as [number, number, number],
  muted: [148, 163, 184] as [number, number, number],
  soft: [203, 213, 225] as [number, number, number],
  border: [37, 52, 76] as [number, number, number],
};

const mm = (value: number) => value;

const sanitizeFileName = (value: string) =>
  String(value || 'Proposta')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'Proposta';

const setFill = (doc: JsPDF, color: [number, number, number]) => doc.setFillColor(color[0], color[1], color[2]);
const setText = (doc: JsPDF, color: [number, number, number]) => doc.setTextColor(color[0], color[1], color[2]);
const setDraw = (doc: JsPDF, color: [number, number, number]) => doc.setDrawColor(color[0], color[1], color[2]);

const addPageShell = (ctx: PdfContext, title?: string) => {
  const { doc, width, height, margin } = ctx;
  setFill(doc, colors.bg);
  doc.rect(0, 0, width, height, 'F');

  setFill(doc, [7, 18, 36]);
  doc.circle(width - 18, 18, 34, 'F');
  setFill(doc, [15, 32, 58]);
  doc.circle(8, height - 18, 28, 'F');

  setDraw(doc, colors.border);
  doc.setLineWidth(0.2);
  doc.line(margin, height - 13, width - margin, height - 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setText(doc, colors.cyan);
  doc.text('EPICBYTE', margin, height - 8);
  doc.setFont('helvetica', 'normal');
  setText(doc, colors.muted);
  doc.text('Documento estratégico inicial', width - margin, height - 8, { align: 'right' });

  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    setText(doc, colors.white);
    doc.text(title, margin, margin + 5, { maxWidth: ctx.contentWidth });
  }
};

const addNewPage = (ctx: PdfContext, title?: string) => {
  ctx.doc.addPage();
  addPageShell(ctx, title);
};

const textBlock = (
  ctx: PdfContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: { size?: number; color?: [number, number, number]; lineHeight?: number; bold?: boolean } = {}
) => {
  const { doc } = ctx;
  doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
  doc.setFontSize(options.size || 10);
  setText(doc, options.color || colors.soft);
  const lines = doc.splitTextToSize(text || '', maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (options.lineHeight || 5);
};

const card = (
  ctx: PdfContext,
  x: number,
  y: number,
  w: number,
  h: number,
  options: { fill?: [number, number, number]; border?: [number, number, number] } = {}
) => {
  const { doc } = ctx;
  setFill(doc, options.fill || colors.panel);
  setDraw(doc, options.border || colors.border);
  doc.roundedRect(x, y, w, h, 4, 4, 'FD');
};

const chip = (ctx: PdfContext, text: string, x: number, y: number, w: number) => {
  const { doc } = ctx;
  setFill(doc, [12, 42, 63]);
  setDraw(doc, [34, 211, 238]);
  doc.roundedRect(x, y, w, 8, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  setText(doc, colors.cyan);
  doc.text(text, x + 3, y + 5.3);
};

const listCards = (ctx: PdfContext, items: string[], x: number, y: number, w: number, titleColor = colors.cyan) => {
  let currentY = y;
  items.slice(0, 8).forEach((item, index) => {
    const estimated = Math.max(17, Math.ceil((item.length / 78)) * 5 + 10);
    card(ctx, x, currentY, w, estimated, { fill: index % 2 === 0 ? colors.panel : colors.panel2 });
    setFill(ctx.doc, titleColor);
    ctx.doc.circle(x + 5, currentY + 6, 1.4, 'F');
    currentY = textBlock(ctx, item, x + 10, currentY + 6.5, w - 15, { size: 8.5, color: colors.soft, lineHeight: 4.2 });
    currentY += 5;
  });
};

const addScoreBar = (ctx: PdfContext, label: string, value: string, x: number, y: number, w: number) => {
  const normalized = value.toLowerCase();
  const pct = normalized.includes('muito') ? 0.96 : normalized.includes('alt') ? 0.86 : normalized.includes('méd') || normalized.includes('med') ? 0.62 : 0.38;
  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(8.5);
  setText(ctx.doc, colors.soft);
  ctx.doc.text(label, x, y);
  setText(ctx.doc, colors.cyan);
  ctx.doc.text(value, x + w, y, { align: 'right' });
  setFill(ctx.doc, [24, 36, 56]);
  ctx.doc.roundedRect(x, y + 3, w, 3, 1.5, 1.5, 'F');
  setFill(ctx.doc, colors.cyan);
  ctx.doc.roundedRect(x, y + 3, w * pct, 3, 1.5, 1.5, 'F');
};

const getScoreValue = (proposal: DiagnosisProposal, key: string) => {
  const score = proposal.strategicScore as unknown as Record<string, string | undefined>;
  if (score[key]) return score[key] as string;
  if (key === 'productivityImpact') return proposal.solutionLevel.recommended === 'Estrutura Escalável' ? 'Muito alto' : 'Médio';
  if (key === 'traceability') return proposal.solutionLevel.recommended === 'Estrutura Escalável' ? 'Muito alta' : 'Média';
  if (key === 'scalability') return proposal.solutionLevel.recommended === 'Estrutura Essencial' ? 'Média' : 'Alta';
  return 'Médio';
};

const qrPlaceholder = (ctx: PdfContext, x: number, y: number, label: string) => {
  const { doc } = ctx;
  card(ctx, x, y, 34, 42, { fill: [6, 18, 34], border: [34, 211, 238] });
  setFill(doc, colors.white);
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if ((row * col + row + col) % 3 !== 0) continue;
      doc.rect(x + 5 + col * 2.6, y + 5 + row * 2.6, 1.5, 1.5, 'F');
    }
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setText(doc, colors.cyan);
  doc.text(label, x + 17, y + 37, { align: 'center' });
};

export const PDFCover = (ctx: PdfContext) => {
  addPageShell(ctx);
  const { doc, width, height, margin, contentWidth, proposal, lead } = ctx;
  setFill(doc, [3, 12, 28]);
  doc.rect(0, 0, width, height, 'F');
  setFill(doc, [9, 42, 63]);
  doc.circle(width - 28, 34, 50, 'F');
  setFill(doc, [37, 23, 74]);
  doc.circle(16, height - 42, 48, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setText(doc, colors.cyan);
  doc.text('EPICBYTE', margin, 32);
  setDraw(doc, colors.cyan);
  doc.setLineWidth(0.6);
  doc.line(margin, 38, margin + 38, 38);

  doc.setFontSize(38);
  setText(doc, colors.white);
  doc.text('Documento', margin, 72);
  doc.text('Estratégico Inicial', margin, 88);

  const template = getProposalTemplate(proposal);
  const target = lead?.companyName || proposal.businessName || lead?.name || 'seu projeto';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  setText(doc, colors.soft);
  doc.text(`${template.coverSubtitle} para ${target}`, margin, 106, { maxWidth: contentWidth - 15 });

  card(ctx, margin, 126, contentWidth, 44, { fill: [8, 24, 45], border: [34, 211, 238] });
  textBlock(
    ctx,
    'A solução foi estruturada com base nas informações fornecidas durante a consultoria assistida por IA da EpicByte.',
    margin + 8,
    140,
    contentWidth - 16,
    { size: 12, color: colors.white, lineHeight: 6 }
  );

  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());
  chip(ctx, date, margin + 8, 157, 58);
  chip(ctx, 'Estruturado por IA + validação estratégica EpicByte', margin + 70, 157, 88);
};

export const PDFExecutiveSummary = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.summaryTitle);
  const { margin, contentWidth, proposal } = ctx;
  let y = 48;
  y = textBlock(ctx, proposal.briefingSummary, margin, y, contentWidth, { size: 11.2, color: colors.soft, lineHeight: 5.6 });

  const cardY = y + 10;
  card(ctx, margin, cardY, contentWidth, 42);
  textBlock(ctx, 'Nível de solução recomendado', margin + 8, cardY + 12, 75, { size: 8, color: colors.muted, bold: true });
  textBlock(ctx, proposal.solutionLevel.recommended, margin + 8, cardY + 22, 80, { size: 15, color: colors.white, bold: true });
  textBlock(ctx, proposal.solutionLevel.rationale, margin + 92, cardY + 12, contentWidth - 100, { size: 8.8, color: colors.soft, lineHeight: 4.2 });

  const scoreY = cardY + 56;
  card(ctx, margin, scoreY, contentWidth, 70);
  textBlock(ctx, template.scoreTitle, margin + 8, scoreY + 12, 90, { size: 12, color: colors.white, bold: true });
  addScoreBar(ctx, template.scoreLabels.operationalComplexity, proposal.strategicScore.operationalComplexity, margin + 8, scoreY + 28, contentWidth - 16);
  addScoreBar(ctx, template.scoreLabels.automationPotential, proposal.strategicScore.automationPotential, margin + 8, scoreY + 40, contentWidth - 16);
  addScoreBar(ctx, template.scoreLabels.productivityImpact, getScoreValue(proposal, 'productivityImpact'), margin + 8, scoreY + 52, contentWidth - 16);
  addScoreBar(ctx, template.scoreLabels.traceability, getScoreValue(proposal, 'traceability'), margin + 8, scoreY + 64, contentWidth - 16);
};

export const PDFOperationalAnalysis = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.analysisTitle);
  const { margin, contentWidth, proposal } = ctx;
  textBlock(ctx, proposal.initialDiagnosis, margin, 48, contentWidth, { size: 10.5, color: colors.soft, lineHeight: 5.2 });
  listCards(ctx, proposal.operationalBottlenecks, margin, 72, contentWidth, [251, 191, 36]);
};

export const PDFStrategicStructure = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.structureTitle);
  const { margin, contentWidth, proposal } = ctx;
  let y = textBlock(ctx, proposal.strategicVision, margin, 48, contentWidth, { size: 10.5, color: colors.soft, lineHeight: 5.2 });
  y += 10;
  listCards(ctx, proposal.suggestedFeatures, margin, y, contentWidth);
};

export const PDFVisualPreview = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.previewTitle);
  const { doc, margin, contentWidth, proposal } = ctx;
  const image = proposal.visualConcept.imageDataUrl;
  if (image) {
    try {
      doc.addImage(image, 'PNG', margin, 48, contentWidth, 116, undefined, 'FAST');
    } catch {
      card(ctx, margin, 48, contentWidth, 116);
    }
  } else {
    card(ctx, margin, 48, contentWidth, 116, { fill: [8, 24, 45], border: [34, 211, 238] });
  }
  textBlock(ctx, proposal.visualConcept.title, margin, 178, contentWidth, { size: 15, color: colors.white, bold: true });
  textBlock(ctx, proposal.visualConcept.imageAlt, margin, 190, contentWidth, { size: 10, color: colors.soft, lineHeight: 5 });
  listCards(ctx, proposal.mockup.modules, margin, 212, contentWidth);
};

export const PDFImpacts = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.impactsTitle);
  const { margin, contentWidth, proposal } = ctx;
  let y = textBlock(ctx, getRoiNarrative(proposal), margin, 48, contentWidth, { size: 10.5, color: colors.soft, lineHeight: 5.2 });
  y += 8;
  listCards(ctx, getImpactPotential(proposal).concat(proposal.expectedOperationalImpacts).slice(0, 8), margin, y, contentWidth);
};

export const PDFImplementationTimeline = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.timelineTitle);
  const { margin, contentWidth, proposal } = ctx;
  const plan = getImplementationPlan(proposal);
  let y = 48;
  plan.slice(0, 6).forEach((phase, index) => {
    card(ctx, margin, y, contentWidth, 24, { fill: index % 2 === 0 ? colors.panel : colors.panel2 });
    setFill(ctx.doc, colors.cyan);
    ctx.doc.circle(margin + 8, y + 12, 4, 'F');
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(8);
    setText(ctx.doc, colors.bg);
    ctx.doc.text(String(index + 1), margin + 8, y + 14.5, { align: 'center' });
    textBlock(ctx, phase, margin + 18, y + 10, contentWidth - 24, { size: 9.4, color: colors.soft, lineHeight: 4.5 });
    y += 31;
  });
  card(ctx, margin, y + 4, contentWidth, 30, { fill: [9, 38, 56], border: [34, 211, 238] });
  const persona = getProposalPersona(proposal);
  const timelineNote =
    persona === 'enterprise_system' || persona === 'industrial_automation'
      ? 'Projetos enterprise devem evoluir por validações. A recomendação é iniciar com um MVP operacional controlado e ampliar para indicadores, integrações e governança conforme a operação amadurece.'
      : persona === 'gamer_cinematic'
        ? 'Experiências promocionais gamer devem evoluir por impacto, mídia e comunidade. A primeira versão consolida atmosfera, trailer, gameplay e CTA; as próximas ampliam conteúdo, countdown e integrações de compra.'
      : persona === 'athlete_artist'
        ? 'Experiências editoriais devem evoluir por narrativa, mídia e comunidade. A primeira versão consolida presença e direção criativa; as próximas ampliam conteúdo, motion e campanhas.'
        : 'A primeira versão deve validar narrativa, percepção e ação principal. Depois, a experiência pode evoluir com novos conteúdos, campanhas e integrações conforme a marca amadurece.';
  textBlock(ctx, timelineNote, margin + 8, y + 17, contentWidth - 16, { size: 9.5, color: colors.white, lineHeight: 4.8 });
};

export const PDFInvestment = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.investmentTitle);
  const { margin, contentWidth, proposal } = ctx;
  card(ctx, margin, 48, contentWidth, 38, { fill: [9, 38, 56], border: [34, 211, 238] });
  textBlock(ctx, 'Investimento estimado', margin + 8, 61, 70, { size: 8, color: colors.cyan, bold: true });
  textBlock(ctx, proposal.investmentEstimate, margin + 8, 74, contentWidth - 16, { size: 12, color: colors.white, lineHeight: 5 });

  card(ctx, margin, 98, contentWidth, 42);
  textBlock(ctx, proposal.timeEstimate, margin + 8, 113, contentWidth - 16, { size: 11, color: colors.soft, lineHeight: 5 });

  textBlock(ctx, template.evolutionTitle, margin, 150, contentWidth, { size: 16, color: colors.white, bold: true });
  listCards(ctx, getReducedRisks(proposal).concat(proposal.evolutionOpportunities, proposal.idealSolution.steps).slice(0, 7), margin, 162, contentWidth);
};

const levelLabel = (level: string) => (level === 'media' ? 'média' : level);

const flowSections = (ctx: PdfContext, pageTitle: string, sections: Array<{ title: string; items: string[] }>) => {
  const { doc, margin, contentWidth, height } = ctx;
  const bottom = height - 22;
  addNewPage(ctx, pageTitle);
  let y = 52;
  const ensureSpace = (needed: number) => {
    if (y + needed <= bottom) return;
    addNewPage(ctx, pageTitle);
    y = 52;
  };

  sections.filter((section) => section.items.length).forEach((section) => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setText(doc, colors.cyan);
    doc.text(section.title, margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    setText(doc, colors.soft);
    section.items.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentWidth) as string[];
      ensureSpace(lines.length * 4.8 + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setText(doc, colors.soft);
      doc.text(lines, margin, y);
      y += lines.length * 4.8 + 2;
    });
    y += 5;
  });
};

export const PDFDetailedScope = (ctx: PdfContext) => {
  const { proposal } = ctx;
  if (!proposal.estimationModules?.length) return;
  const modules = (phase: string) =>
    (proposal.estimationModules || []).filter((module) => module.phase === phase).map((module) => `${module.name}: ${module.description} (complexidade ${levelLabel(module.complexity)})`);
  const pricing = proposal.pricing;
  flowSections(ctx, 'Escopo, premissas e riscos', [
    { title: 'Resumo executivo', items: proposal.executiveSummary ? [proposal.executiveSummary] : [] },
    { title: 'MVP', items: modules('mvp') },
    { title: 'Versão profissional', items: modules('profissional') },
    { title: 'Evolução futura', items: modules('evolucao') },
    { title: 'Arquitetura proposta', items: proposal.architecture ? [proposal.architecture] : [] },
    { title: 'Benefícios', items: proposal.benefits || [] },
    {
      title: 'Composição do investimento',
      items: pricing
        ? [pricing.deadlineAlert, pricing.budgetAlert, pricing.infrastructureNote, pricing.licensesNote, ...pricing.assumptions].filter((item): item is string => Boolean(item))
        : [],
    },
    { title: 'Premissas', items: proposal.assumptions || [] },
    { title: 'Fora do escopo', items: proposal.exclusions || [] },
    { title: 'Riscos', items: proposal.risks || [] },
  ]);
};

export const PDFRequirements = (ctx: PdfContext) => {
  const requirements = ctx.proposal.requirementsModel?.requirements || [];
  if (!requirements.length) return;
  const group = (status: string) =>
    requirements.filter((item) => item.status === status).map((item) => `${item.id} [prioridade ${levelLabel(item.priority)}] ${item.description}${item.dependencies.length ? ` (depende de ${item.dependencies.join(', ')})` : ''}`);
  flowSections(ctx, 'Requisitos levantados', [
    { title: 'Confirmados pelo cliente', items: group('confirmado') },
    { title: 'Recomendações da EpicByte', items: group('recomendacao') },
    { title: 'Hipóteses a validar', items: group('hipotese_pendente') },
  ]);
};

export const PDFNextSteps = (ctx: PdfContext) => {
  const template = getProposalTemplate(ctx.proposal);
  addNewPage(ctx, template.nextStepsTitle);
  const { margin, contentWidth } = ctx;
  const steps = template.nextSteps;
  listCards(ctx, steps, margin, 52, contentWidth);
  qrPlaceholder(ctx, margin, 138, 'Agendar');
  qrPlaceholder(ctx, margin + 42, 138, 'WhatsApp');
  textBlock(ctx, 'QR Codes reservados para integração comercial: agenda estratégica e recebimento futuro da proposta via WhatsApp.', margin + 88, 152, contentWidth - 88, { size: 9.5, color: colors.soft, lineHeight: 4.8 });
  card(ctx, margin, 206, contentWidth, 48, { fill: [8, 24, 45], border: [34, 211, 238] });
  textBlock(
    ctx,
    template.ctaHeadline,
    margin + 8,
    226,
    contentWidth - 16,
    { size: 15, color: colors.white, bold: true, lineHeight: 7 }
  );
};

export const generateProposalPdf = async (proposal: DiagnosisProposal, lead: LeadInfo | null) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = mm(16);
  const ctx: PdfContext = {
    doc,
    width,
    height,
    margin,
    contentWidth: width - margin * 2,
    proposal,
    lead,
  };

  PDFCover(ctx);
  PDFExecutiveSummary(ctx);
  const persona = getProposalPersona(proposal);
  const visualFirstPersonas = ['athlete_artist', 'landing_branding', 'personal_brand', 'luxury_brand', 'clinic_premium', 'law_firm', 'institutional_site', 'gamer_cinematic'];
  if (visualFirstPersonas.includes(persona)) {
    PDFOperationalAnalysis(ctx);
    PDFVisualPreview(ctx);
    PDFStrategicStructure(ctx);
  } else {
    PDFOperationalAnalysis(ctx);
    PDFStrategicStructure(ctx);
    PDFVisualPreview(ctx);
  }
  PDFImpacts(ctx);
  PDFImplementationTimeline(ctx);
  PDFInvestment(ctx);
  PDFDetailedScope(ctx);
  PDFRequirements(ctx);
  PDFNextSteps(ctx);

  const name = sanitizeFileName(lead?.companyName || proposal.businessName || lead?.name || 'Proposta');
  doc.save(`EpicByte-Proposta-${name}.pdf`);
};
