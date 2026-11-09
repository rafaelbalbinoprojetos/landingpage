import type { jsPDF as JsPDF } from 'jspdf';
import { DiagnosisProposal, LeadInfo, ProposalRequirement } from '../types';
import { getImplementationPlan, getProposalTemplate } from '../proposalInsights';

type Rgb = [number, number, number];

const palette = {
  night: [5, 8, 22] as Rgb,
  night2: [13, 21, 40] as Rgb,
  ink: [15, 23, 42] as Rgb,
  body: [51, 62, 80] as Rgb,
  muted: [100, 112, 130] as Rgb,
  line: [221, 226, 234] as Rgb,
  tint: [244, 246, 250] as Rgb,
  white: [255, 255, 255] as Rgb,
  snow: [245, 247, 251] as Rgb,
  fog: [168, 182, 203] as Rgb,
  cyan: [34, 211, 238] as Rgb,
  teal: [14, 116, 144] as Rgb,
  iris: [109, 79, 216] as Rgb,
  amberBg: [254, 247, 230] as Rgb,
  amberLine: [217, 158, 40] as Rgb,
  amberInk: [110, 74, 8] as Rgb,
};

const fonts = { text: 'helvetica', heading: 'helvetica', mono: 'courier' };
const PROPOSAL_VALIDITY_DAYS = 30;
const MARGIN = 22;
const TOP = 30;
const BOTTOM = 24;
const PT_TO_MM = 0.3528;

// As fontes da marca são embutidas no PDF; sem elas, o documento usa a Helvetica.
const fontFiles = [
  { file: 'Archivo-Regular.ttf', family: 'Archivo', style: 'normal' },
  { file: 'Archivo-SemiBold.ttf', family: 'Archivo', style: 'bold' },
  { file: 'PlexMono-Medium.ttf', family: 'PlexMono', style: 'normal' },
];

const loadBrandFonts = async (doc: JsPDF) => {
  try {
    const loaded = await Promise.all(fontFiles.map(async (font) => {
      const response = await fetch(`/fonts/pdf/${font.file}`);
      if (!response.ok) throw new Error(font.file);
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = '';
      for (let index = 0; index < bytes.length; index += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
      }
      return { ...font, base64: btoa(binary) };
    }));
    loaded.forEach((font) => {
      doc.addFileToVFS(font.file, font.base64);
      doc.addFont(font.file, font.family, font.style);
    });
    fonts.text = 'Archivo';
    fonts.heading = 'Archivo';
    fonts.mono = 'PlexMono';
  } catch (error) {
    console.error('Brand fonts unavailable, using Helvetica:', error);
    fonts.text = 'helvetica';
    fonts.heading = 'helvetica';
    fonts.mono = 'courier';
  }
};

// As fontes não têm todos os símbolos que a IA pode escrever, como setas e emojis.
const clean = (value: unknown) =>
  String(value ?? '')
    .replace(/[→➔➜]/g, '-')
    .replace(/[^ -ſ–—‘’“”•…\n]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();

const money = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;
const levelLabel = (level: string) => (level === 'media' ? 'Média' : level === 'alta' ? 'Alta' : level === 'baixa' ? 'Baixa' : level);

const sanitizeFileName = (value: string) =>
  String(value || 'Proposta')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'Proposta';

const buildReference = (name: string, date: Date) => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 46656;
  return `EB-${date.getFullYear()}-${hash.toString(36).toUpperCase().padStart(3, '0')}`;
};

class Document {
  doc: JsPDF;
  width: number;
  height: number;
  contentWidth: number;
  y = TOP;
  sections: Array<{ number: string; title: string; page: number }> = [];
  currentSection = '';

  constructor(doc: JsPDF) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.height = doc.internal.pageSize.getHeight();
    this.contentWidth = this.width - MARGIN * 2;
  }

  fill(color: Rgb) { this.doc.setFillColor(color[0], color[1], color[2]); }
  draw(color: Rgb) { this.doc.setDrawColor(color[0], color[1], color[2]); }
  ink(color: Rgb) { this.doc.setTextColor(color[0], color[1], color[2]); }

  font(family: string, style: 'normal' | 'bold', size: number, color: Rgb) {
    this.doc.setFont(family, style);
    this.doc.setFontSize(size);
    this.ink(color);
  }

  opacity(value: number) {
    const anyDoc = this.doc as any;
    anyDoc.setGState(new anyDoc.GState({ opacity: value }));
  }

  page() {
    this.doc.addPage();
    this.y = TOP;
  }

  ensure(height: number) {
    if (this.y + height > this.height - BOTTOM) this.page();
  }

  gradientLine(x: number, y: number, width: number, height: number) {
    const steps = 48;
    for (let step = 0; step < steps; step += 1) {
      const t = step / (steps - 1);
      this.doc.setFillColor(
        Math.round(palette.cyan[0] + (palette.iris[0] - palette.cyan[0]) * t),
        Math.round(palette.cyan[1] + (palette.iris[1] - palette.cyan[1]) * t),
        Math.round(palette.cyan[2] + (palette.iris[2] - palette.cyan[2]) * t)
      );
      this.doc.rect(x + (width / steps) * step, y, width / steps + 0.35, height, 'F');
    }
  }

  logo(x: number, y: number, size: number, light: boolean) {
    const unit = size / 16;
    this.fill(light ? palette.snow : palette.ink);
    this.doc.rect(x, y, 16 * unit, 4 * unit, 'F');
    this.fill(light ? palette.cyan : palette.teal);
    this.doc.rect(x, y + 6 * unit, 10 * unit, 4 * unit, 'F');
    this.fill(light ? palette.snow : palette.ink);
    this.doc.rect(x, y + 12 * unit, 16 * unit, 4 * unit, 'F');
  }

  // Seções curtas continuam na página atual quando há espaço, evitando páginas vazias.
  section(title: string, flowIfRoom = false) {
    if (flowIfRoom && this.y < this.height * 0.52) this.y += 14;
    else this.page();
    const number = String(this.sections.length + 1).padStart(2, '0');
    this.sections.push({ number, title, page: this.doc.getNumberOfPages() });
    this.font(fonts.mono, 'normal', 9, palette.teal);
    this.doc.text(number, MARGIN, this.y);
    this.y += 11;
    this.font(fonts.heading, 'bold', 25, palette.ink);
    const lines = this.doc.splitTextToSize(clean(title), this.contentWidth) as string[];
    lines.forEach((line) => {
      this.doc.text(line, MARGIN, this.y);
      this.y += 10;
    });
    this.y += 1;
    this.gradientLine(MARGIN, this.y, 26, 0.7);
    this.y += 12;
  }

  subheading(title: string) {
    this.ensure(18);
    this.y += 3;
    this.font(fonts.heading, 'bold', 12.5, palette.ink);
    this.doc.text(clean(title), MARGIN, this.y);
    this.y += 7;
  }

  paragraph(text: unknown, options: { size?: number; color?: Rgb; x?: number; width?: number; after?: number; bold?: boolean } = {}) {
    const value = clean(text);
    if (!value) return;
    const size = options.size || 10.5;
    const leading = size * PT_TO_MM * 1.55;
    const x = options.x ?? MARGIN;
    this.font(fonts.text, options.bold ? 'bold' : 'normal', size, options.color || palette.body);
    const lines = this.doc.splitTextToSize(value, options.width ?? Math.min(this.contentWidth, 150)) as string[];
    lines.forEach((line) => {
      if (this.y + leading > this.height - BOTTOM) {
        this.page();
        this.font(fonts.text, options.bold ? 'bold' : 'normal', size, options.color || palette.body);
      }
      this.doc.text(line, x, this.y);
      this.y += leading;
    });
    this.y += options.after ?? 4;
  }

  numberedList(items: unknown[]) {
    items.map(clean).filter(Boolean).forEach((item, index) => {
      const lines = this.doc.setFont(fonts.text, 'normal').setFontSize(10.5).splitTextToSize(item, this.contentWidth - 14) as string[];
      const leading = 10.5 * PT_TO_MM * 1.5;
      this.ensure(lines.length * leading + 6);
      this.font(fonts.mono, 'normal', 8.5, palette.teal);
      this.doc.text(String(index + 1).padStart(2, '0'), MARGIN, this.y);
      this.font(fonts.text, 'normal', 10.5, palette.body);
      lines.forEach((line, lineIndex) => this.doc.text(line, MARGIN + 14, this.y + lineIndex * leading));
      this.y += lines.length * leading + 2.5;
      this.draw(palette.line);
      this.doc.setLineWidth(0.15);
      this.doc.line(MARGIN, this.y, MARGIN + this.contentWidth, this.y);
      this.y += 5;
    });
    this.y += 2;
  }

  bullets(items: unknown[]) {
    items.map(clean).filter(Boolean).forEach((item) => {
      const leading = 10 * PT_TO_MM * 1.5;
      const lines = this.doc.setFont(fonts.text, 'normal').setFontSize(10).splitTextToSize(item, this.contentWidth - 7) as string[];
      this.ensure(lines.length * leading + 3);
      this.fill(palette.teal);
      this.doc.rect(MARGIN, this.y - 2, 1.4, 1.4, 'F');
      this.font(fonts.text, 'normal', 10, palette.body);
      lines.forEach((line, index) => this.doc.text(line, MARGIN + 7, this.y + index * leading));
      this.y += lines.length * leading + 2.5;
    });
    this.y += 3;
  }

  figures(items: Array<{ label: string; value: string }>) {
    const gap = 4;
    const width = (this.contentWidth - gap * (items.length - 1)) / items.length;
    const inner = width - 8;
    const prepared = items.map((item) => {
      this.doc.setFont(fonts.heading, 'bold').setFontSize(13);
      return { ...item, lines: this.doc.splitTextToSize(clean(item.value), inner) as string[] };
    });
    const height = 17 + Math.max(...prepared.map((item) => item.lines.length)) * 6;
    this.ensure(height + 6);
    prepared.forEach((item, index) => {
      const x = MARGIN + index * (width + gap);
      this.fill(palette.night);
      this.doc.rect(x, this.y, width, height, 'F');
      this.font(fonts.mono, 'normal', 6.8, palette.cyan);
      this.doc.text(clean(item.label).toUpperCase(), x + 4, this.y + 7);
      this.font(fonts.heading, 'bold', 13, palette.snow);
      item.lines.forEach((line, lineIndex) => this.doc.text(line, x + 4, this.y + 14.5 + lineIndex * 6));
    });
    this.y += height + 8;
  }

  table(columns: Array<{ title: string; width: number; align?: 'left' | 'right'; strong?: boolean }>, rows: string[][]) {
    const total = columns.reduce((sum, column) => sum + column.width, 0);
    const widths = columns.map((column) => (column.width / total) * this.contentWidth);
    const padding = 2.5;
    const leading = 9.2 * PT_TO_MM * 1.45;

    const header = () => {
      this.fill(palette.night);
      this.doc.rect(MARGIN, this.y, this.contentWidth, 8.5, 'F');
      this.font(fonts.mono, 'normal', 7, palette.snow);
      let x = MARGIN;
      columns.forEach((column, index) => {
        const label = clean(column.title).toUpperCase();
        if (column.align === 'right') this.doc.text(label, x + widths[index] - padding, this.y + 5.5, { align: 'right' });
        else this.doc.text(label, x + padding, this.y + 5.5);
        x += widths[index];
      });
      this.y += 8.5;
    };

    this.ensure(26);
    header();
    rows.forEach((row) => {
      const wrapped = row.map((cell, index) => {
        this.doc.setFont(fonts.text, columns[index].strong ? 'bold' : 'normal').setFontSize(9.2);
        return this.doc.splitTextToSize(clean(cell), widths[index] - padding * 2) as string[];
      });
      const height = Math.max(...wrapped.map((lines) => lines.length)) * leading + 5;
      if (this.y + height > this.height - BOTTOM) {
        this.page();
        header();
      }
      let x = MARGIN;
      wrapped.forEach((lines, index) => {
        const column = columns[index];
        this.font(fonts.text, column.strong ? 'bold' : 'normal', 9.2, column.strong ? palette.ink : palette.body);
        lines.forEach((line, lineIndex) => {
          const baseline = this.y + 5 + lineIndex * leading;
          if (column.align === 'right') this.doc.text(line, x + widths[index] - padding, baseline, { align: 'right' });
          else this.doc.text(line, x + padding, baseline);
        });
        x += widths[index];
      });
      this.y += height;
      this.draw(palette.line);
      this.doc.setLineWidth(0.15);
      this.doc.line(MARGIN, this.y, MARGIN + this.contentWidth, this.y);
    });
    this.y += 8;
  }

  callout(title: string, text: string, tone: 'neutral' | 'alert' = 'neutral') {
    const background = tone === 'alert' ? palette.amberBg : palette.tint;
    const accent = tone === 'alert' ? palette.amberLine : palette.teal;
    const color = tone === 'alert' ? palette.amberInk : palette.body;
    const leading = 9.6 * PT_TO_MM * 1.5;
    const lines = this.doc.setFont(fonts.text, 'normal').setFontSize(9.6).splitTextToSize(clean(text), this.contentWidth - 14) as string[];
    const height = lines.length * leading + 15;
    this.ensure(height + 4);
    this.fill(background);
    this.doc.rect(MARGIN, this.y, this.contentWidth, height, 'F');
    this.fill(accent);
    this.doc.rect(MARGIN, this.y, 1, height, 'F');
    this.font(fonts.heading, 'bold', 9.6, tone === 'alert' ? palette.amberInk : palette.ink);
    this.doc.text(clean(title), MARGIN + 7, this.y + 7);
    this.font(fonts.text, 'normal', 9.6, color);
    lines.forEach((line, index) => this.doc.text(line, MARGIN + 7, this.y + 12.5 + index * leading));
    this.y += height + 7;
  }

  image(dataUrl: string, caption: string) {
    try {
      const format = /^data:image\/jpe?g/i.test(dataUrl) ? 'JPEG' : 'PNG';
      const properties = this.doc.getImageProperties(dataUrl);
      const available = this.height - BOTTOM - TOP - 12;
      let width = this.contentWidth;
      let height = (properties.height / properties.width) * width;
      if (height > Math.min(available, 170)) {
        height = Math.min(available, 170);
        width = (properties.width / properties.height) * height;
      }
      this.ensure(height + 12);
      this.doc.addImage(dataUrl, format, MARGIN + (this.contentWidth - width) / 2, this.y, width, height, undefined, 'FAST');
      this.y += height + 5;
      this.font(fonts.text, 'normal', 8, palette.muted);
      this.doc.text(this.doc.splitTextToSize(clean(caption), this.contentWidth) as string[], MARGIN, this.y);
      this.y += 10;
    } catch (error) {
      console.error('Concept image could not be added to the PDF:', error);
    }
  }
}

const drawCover = (pdf: Document, proposal: DiagnosisProposal, lead: LeadInfo | null, reference: string, date: Date) => {
  const { doc, width, height } = pdf;
  const client = clean(lead?.companyName || proposal.businessName || lead?.name || 'Seu projeto');

  pdf.fill(palette.night);
  doc.rect(0, 0, width, height, 'F');

  // Brilho suave no canto, feito com círculos quase transparentes.
  pdf.fill(palette.teal);
  pdf.opacity(0.02);
  for (let radius = 130; radius > 8; radius -= 6) doc.circle(width + 8, -8, radius, 'F');
  pdf.fill(palette.iris);
  for (let radius = 90; radius > 8; radius -= 6) doc.circle(-10, height * 0.72, radius, 'F');
  pdf.opacity(1);

  pdf.logo(MARGIN, 26, 9, true);
  pdf.font(fonts.heading, 'bold', 13, palette.snow);
  doc.text('EpicByte', MARGIN + 12.5, 33);

  pdf.font(fonts.mono, 'normal', 8, palette.fog);
  doc.text('CONFIDENCIAL', width - MARGIN, 33, { align: 'right' });

  pdf.font(fonts.mono, 'normal', 9.5, palette.cyan);
  doc.text('PROPOSTA TÉCNICA E COMERCIAL', MARGIN, 104);

  pdf.font(fonts.heading, 'bold', 34, palette.snow);
  const titleLines = (doc.splitTextToSize(clean(proposal.proposalTitle || `Proposta para ${client}`), pdf.contentWidth) as string[]).slice(0, 4);
  let y = 120;
  titleLines.forEach((line) => {
    doc.text(line, MARGIN, y);
    y += 14;
  });
  pdf.gradientLine(MARGIN, y - 4, 44, 1);

  pdf.font(fonts.text, 'normal', 13, palette.fog);
  doc.text(`Preparada para ${client}`, MARGIN, y + 10, { maxWidth: pdf.contentWidth });

  const formatted = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
  const details = [
    ['Referência', reference],
    ['Data', formatted],
    ['Validade', `${PROPOSAL_VALIDITY_DAYS} dias`],
    ...(lead?.name ? [['Aos cuidados de', clean(lead.name)]] : []),
  ];
  const baseY = height - 44;
  doc.setDrawColor(60, 72, 96);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, baseY - 8, width - MARGIN, baseY - 8);
  details.forEach(([label, value], index) => {
    const x = MARGIN + (pdf.contentWidth / details.length) * index;
    pdf.font(fonts.mono, 'normal', 6.8, palette.fog);
    doc.text(label.toUpperCase(), x, baseY);
    pdf.font(fonts.text, 'normal', 9.5, palette.snow);
    doc.text(doc.splitTextToSize(value, pdf.contentWidth / details.length - 4) as string[], x, baseY + 6);
  });
  pdf.font(fonts.text, 'normal', 7.5, palette.fog);
  doc.text('Este documento contém informações confidenciais destinadas exclusivamente ao destinatário.', MARGIN, height - 18);
};

const drawContents = (pdf: Document, page: number) => {
  const { doc } = pdf;
  doc.setPage(page);
  let y = TOP;
  pdf.font(fonts.heading, 'bold', 25, palette.ink);
  doc.text('Sumário', MARGIN, y + 11);
  y += 16;
  pdf.gradientLine(MARGIN, y, 26, 0.7);
  y += 16;
  pdf.sections.forEach((section) => {
    pdf.font(fonts.mono, 'normal', 9, palette.teal);
    doc.text(section.number, MARGIN, y);
    pdf.font(fonts.text, 'normal', 11.5, palette.ink);
    doc.text(clean(section.title), MARGIN + 14, y);
    doc.textWithLink(' ', MARGIN + 14, y, { pageNumber: section.page });
    doc.link(MARGIN, y - 5, pdf.contentWidth, 9, { pageNumber: section.page });
    pdf.font(fonts.mono, 'normal', 9, palette.muted);
    doc.text(String(section.page), MARGIN + pdf.contentWidth, y, { align: 'right' });
    y += 5;
    pdf.draw(palette.line);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y, MARGIN + pdf.contentWidth, y);
    y += 8;
  });
};

const drawPageChrome = (pdf: Document, reference: string) => {
  const { doc, width, height } = pdf;
  const total = doc.getNumberOfPages();
  for (let page = 2; page <= total; page += 1) {
    doc.setPage(page);
    pdf.logo(MARGIN, 12, 4, false);
    pdf.font(fonts.heading, 'bold', 8.5, palette.ink);
    doc.text('EpicByte', MARGIN + 6.2, 15.2);
    pdf.font(fonts.mono, 'normal', 7, palette.muted);
    doc.text(`CONFIDENCIAL  /  ${reference}`, width - MARGIN, 15.2, { align: 'right' });
    pdf.draw(palette.line);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, height - 15, width - MARGIN, height - 15);
    doc.text('Proposta técnica e comercial', MARGIN, height - 10);
    doc.text(`${page} / ${total}`, width - MARGIN, height - 10, { align: 'right' });
  }
};

const drawSchedule = (pdf: Document, proposal: DiagnosisProposal) => {
  const phases = proposal.pricing?.phases || [];
  if (!phases.length) return;
  const { doc } = pdf;
  const longest = Math.max(...phases.map((phase) => phase.weeksMax));
  const labelWidth = 48;
  const trackX = MARGIN + labelWidth;
  const trackWidth = pdf.contentWidth - labelWidth;
  const rowHeight = 15;
  pdf.ensure(phases.length * rowHeight + 18);

  pdf.font(fonts.mono, 'normal', 7, palette.muted);
  [0, 0.25, 0.5, 0.75, 1].forEach((point) => {
    const x = trackX + trackWidth * point;
    pdf.draw(palette.line);
    doc.setLineWidth(0.15);
    doc.line(x, pdf.y + 2, x, pdf.y + 3 + phases.length * rowHeight);
    doc.text(`${Math.round(longest * point)}`, x, pdf.y, { align: point === 1 ? 'right' : point === 0 ? 'left' : 'center' });
  });
  pdf.y += 5;
  phases.forEach((phase) => {
    pdf.font(fonts.text, 'bold', 9, palette.ink);
    doc.text((doc.splitTextToSize(clean(phase.name), labelWidth - 4) as string[]).slice(0, 2), MARGIN, pdf.y + 4);
    const minimum = (phase.weeksMin / longest) * trackWidth;
    const maximum = (phase.weeksMax / longest) * trackWidth;
    pdf.fill(palette.line);
    doc.rect(trackX, pdf.y + 1, maximum, 6, 'F');
    pdf.gradientLine(trackX, pdf.y + 1, minimum, 6);
    pdf.font(fonts.mono, 'normal', 7, palette.muted);
    doc.text(`${phase.weeksMin} a ${phase.weeksMax} semanas`, trackX, pdf.y + 11);
    pdf.y += rowHeight;
  });
  pdf.y += 5;
  pdf.font(fonts.text, 'normal', 8, palette.muted);
  doc.text('Escala em semanas. O trecho colorido indica o prazo mínimo, e o cinza, a margem até o prazo máximo.', MARGIN, pdf.y);
  pdf.y += 10;
};

// Etapas neutras para propostas por módulos; o plano antigo é voltado a projetos de marca.
const modularWorkPlan = [
  'Imersão e validação técnica: revisão de requisitos, regras, integrações e acessos.',
  'Desenho da solução: arquitetura, fluxos principais e protótipo das telas críticas.',
  'Desenvolvimento por módulos, com entregas parciais para validação.',
  'Testes e homologação com os usuários-chave.',
  'Implantação, treinamento e acompanhamento inicial.',
];

const requirementRows = (items: ProposalRequirement[]) =>
  items.map((item) => [item.id, item.description, levelLabel(item.priority), item.dependencies.join(', ') || '-']);

export const buildProposalPdf = async (proposal: DiagnosisProposal, lead: LeadInfo | null) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  await loadBrandFonts(doc);

  const pdf = new Document(doc);
  const date = new Date();
  const client = clean(lead?.companyName || proposal.businessName || lead?.name || 'Seu projeto');
  const reference = buildReference(client, date);
  const template = getProposalTemplate(proposal);
  const pricing = proposal.pricing;
  const modules = proposal.estimationModules || [];
  const requirements = proposal.requirementsModel?.requirements || [];

  doc.setProperties({
    title: clean(proposal.proposalTitle || `Proposta para ${client}`),
    subject: 'Proposta técnica e comercial',
    author: 'EpicByte',
    creator: 'EpicByte',
  });

  drawCover(pdf, proposal, lead, reference, date);
  pdf.page();
  const contentsPage = doc.getNumberOfPages();

  pdf.section('Resumo executivo');
  pdf.paragraph(proposal.executiveSummary || proposal.briefingSummary, { size: 13, color: palette.ink, after: 8 });
  if (proposal.reviewRequired) {
    pdf.callout('Proposta em revisão', 'Valores e prazos serão confirmados pela equipe EpicByte após a validação do escopo.', 'alert');
  }
  if (pricing?.priced && pricing.phases.length) {
    const first = pricing.phases[0] as { name: string; investmentMin: number; investmentMax: number; weeksMin: number; weeksMax: number };
    pdf.figures([
      { label: `Investimento ${first.name}`, value: `${money(first.investmentMin)}\na ${money(first.investmentMax)}` },
      { label: `Prazo ${first.name}`, value: `${first.weeksMin} a ${first.weeksMax} semanas` },
      { label: 'Nível recomendado', value: proposal.solutionLevel.recommended },
    ]);
  }
  if (proposal.executiveSummary) pdf.paragraph(proposal.briefingSummary);
  pdf.subheading('Por que este nível de solução');
  pdf.paragraph(proposal.solutionLevel.rationale);

  pdf.section('Contexto e diagnóstico');
  if (proposal.businessProblem) {
    pdf.subheading('Problema de negócio');
    pdf.paragraph(proposal.businessProblem);
    pdf.subheading('Diagnóstico');
  }
  pdf.paragraph(proposal.initialDiagnosis);
  pdf.subheading('Principais pontos identificados');
  pdf.numberedList(proposal.operationalBottlenecks);
  pdf.subheading('Leitura estratégica');
  pdf.table(
    [{ title: 'Dimensão', width: 40, strong: true }, { title: 'Avaliação', width: 60 }],
    [
      ['Complexidade', proposal.strategicScore.operationalComplexity],
      ['Potencial de automação', proposal.strategicScore.automationPotential],
      ['Urgência de estruturação', proposal.strategicScore.structuringUrgency],
      ['Tipo de solução recomendado', proposal.strategicScore.recommendedSolutionType],
    ].filter(([, value]) => clean(value))
  );

  pdf.section('Solução proposta');
  pdf.paragraph(proposal.epicByteApproach);
  pdf.paragraph(proposal.strategicVision);
  if (proposal.visualConcept.imageDataUrl) {
    pdf.image(proposal.visualConcept.imageDataUrl, `Conceito visual: ${proposal.visualConcept.title}. Textos e valores são ilustrativos, não representam dados reais.`);
  }
  if (proposal.benefits?.length || proposal.expectedOperationalImpacts?.length) {
    pdf.subheading('Benefícios esperados');
    pdf.bullets(proposal.benefits?.length ? proposal.benefits : proposal.expectedOperationalImpacts);
  }

  pdf.section('Escopo por fase');
  if (modules.length) {
    const phaseLabels = { mvp: 'MVP', profissional: 'Versão profissional', evolucao: 'Evolução futura' };
    (['mvp', 'profissional', 'evolucao'] as const).forEach((phase) => {
      const items = modules.filter((module) => module.phase === phase);
      if (!items.length) return;
      pdf.subheading(phaseLabels[phase]);
      pdf.table(
        [{ title: 'Módulo', width: 32, strong: true }, { title: 'Descrição', width: 54 }, { title: 'Complexidade', width: 16 }],
        items.map((module) => [module.name, module.description, levelLabel(module.complexity)])
      );
    });
  } else {
    pdf.subheading('Funcionalidades previstas');
    pdf.numberedList(proposal.suggestedFeatures);
    pdf.subheading('Evolução futura');
    pdf.bullets(proposal.evolutionOpportunities);
  }

  pdf.section('Arquitetura e tecnologia', true);
  pdf.paragraph(proposal.architecture);
  if (proposal.integrations?.length) { pdf.subheading('Integrações'); pdf.bullets(proposal.integrations); }
  if (proposal.nonFunctionalRequirements?.length) { pdf.subheading('Requisitos não funcionais'); pdf.bullets(proposal.nonFunctionalRequirements); }
  pdf.subheading('Tecnologias recomendadas');
  pdf.bullets(proposal.recommendedTechnologies);

  pdf.section('Cronograma');
  if (pricing) drawSchedule(pdf, proposal);
  else pdf.paragraph(proposal.timeEstimate);
  if (pricing?.deadlineAlert) pdf.callout('Atenção ao prazo informado', pricing.deadlineAlert, 'alert');
  pdf.subheading('Etapas de trabalho');
  pdf.numberedList(modules.length ? modularWorkPlan : getImplementationPlan(proposal).slice(0, 7));

  pdf.section('Investimento');
  if (pricing?.priced && pricing.phases.length) {
    pdf.table(
      [{ title: 'Fase', width: 40, strong: true }, { title: 'Investimento', width: 38, align: 'right', strong: true }, { title: 'Prazo', width: 22, align: 'right' }],
      pricing.phases.map((phase) => [phase.name, `${money(phase.investmentMin as number)} a ${money(phase.investmentMax as number)}`, `${phase.weeksMin} a ${phase.weeksMax} semanas`])
    );
    if (pricing.budgetAlert) pdf.callout('Atenção à faixa informada', pricing.budgetAlert, 'alert');
    pdf.subheading('Custos recorrentes e de terceiros');
    pdf.table(
      [{ title: 'Item', width: 30, strong: true }, { title: 'Condição', width: 70 }],
      [
        ...(pricing.maintenanceMonthlyMax > 0
          ? [['Manutenção', `${money(pricing.maintenanceMonthlyMin)} a ${money(pricing.maintenanceMonthlyMax)} por mês, se contratada.`]]
          : []),
        ['Infraestrutura', pricing.infrastructureNote],
        ['Licenças', pricing.licensesNote],
      ]
    );
    if (proposal.commercialRationale) { pdf.subheading('O que pesa no investimento'); pdf.paragraph(proposal.commercialRationale); }
    pdf.subheading('Base da estimativa');
    pdf.bullets(pricing.assumptions);
  } else {
    pdf.paragraph(proposal.investmentEstimate, { size: 12, color: palette.ink });
  }
  pdf.callout(
    'Natureza desta estimativa',
    'Os valores são uma estimativa inicial baseada nas informações do briefing. Não constituem cotação nem oferta vinculante: preço, prazo e condições de pagamento são confirmados pela EpicByte após a validação técnica do escopo.'
  );

  if (requirements.length) {
    pdf.section('Requisitos levantados');
    pdf.paragraph('Cada item indica sua origem, separando o que foi confirmado no briefing, o que a EpicByte recomenda e o que ainda precisa de validação.');
    const groups: Array<[ProposalRequirement['status'], string]> = [
      ['confirmado', 'Confirmados pelo cliente'],
      ['recomendacao', 'Recomendações da EpicByte'],
      ['hipotese_pendente', 'Hipóteses a validar'],
    ];
    groups.forEach(([status, label]) => {
      const items = requirements.filter((item) => item.status === status);
      if (!items.length) return;
      pdf.subheading(label);
      pdf.table(
        [{ title: 'ID', width: 13, strong: true }, { title: 'Requisito', width: 58 }, { title: 'Prioridade', width: 13 }, { title: 'Depende de', width: 16 }],
        requirementRows(items)
      );
    });
  }

  if (proposal.assumptions?.length || proposal.exclusions?.length || proposal.risks?.length || proposal.pendingItems?.length) {
    pdf.section('Premissas, exclusões e riscos', true);
    if (proposal.assumptions?.length) { pdf.subheading('Premissas'); pdf.bullets(proposal.assumptions); }
    if (proposal.exclusions?.length) { pdf.subheading('Fora do escopo'); pdf.bullets(proposal.exclusions); }
    if (proposal.risks?.length) { pdf.subheading('Riscos e mitigação'); pdf.bullets(proposal.risks); }
    if (proposal.pendingItems?.length) { pdf.subheading('Pendências a validar'); pdf.bullets(proposal.pendingItems); }
  }

  pdf.section('Próximos passos', true);
  pdf.numberedList(template.nextSteps);
  pdf.y += 6;
  pdf.ensure(46);
  pdf.fill(palette.night);
  doc.rect(MARGIN, pdf.y, pdf.contentWidth, 40, 'F');
  pdf.logo(MARGIN + 8, pdf.y + 8, 6, true);
  pdf.font(fonts.heading, 'bold', 13, palette.snow);
  doc.text(doc.splitTextToSize(clean(`Vamos validar esta proposta com ${client}?`), pdf.contentWidth - 16) as string[], MARGIN + 8, pdf.y + 22);
  pdf.font(fonts.text, 'normal', 9.5, palette.fog);
  doc.textWithLink('epicbyte.com.br', MARGIN + 8, pdf.y + 32, { url: 'https://epicbyte.com.br' });
  pdf.y += 40;

  drawContents(pdf, contentsPage);
  drawPageChrome(pdf, reference);
  return { doc, client };
};

export const generateProposalPdf = async (proposal: DiagnosisProposal, lead: LeadInfo | null) => {
  const { doc, client } = await buildProposalPdf(proposal, lead);
  doc.save(`EpicByte-Proposta-${sanitizeFileName(client)}.pdf`);
};
