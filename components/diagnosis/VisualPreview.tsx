import React, { useState } from 'react';
import { Activity, AlertTriangle, BarChart3, CalendarDays, CheckCircle2, Clapperboard, Gamepad2, Gauge, MessageCircle, PackageCheck, PenLine, ShieldCheck, ShoppingBag, TrendingUp } from 'lucide-react';
import { BUSINESS_CONTEXTS, classifyProposalContext, getProposalPersona, isEnterpriseProposal } from './proposalInsights';
import { DiagnosisProposal } from './types';

interface VisualPreviewProps {
  proposal: DiagnosisProposal;
  onOpenFullPreview: () => void;
  onRegenerateImage?: (style: string) => Promise<boolean>;
}

// Cada geração tem custo, então o visitante tem um número limitado de novas versões.
const MAX_STYLE_REGENERATIONS = 2;

const imageStyles = [
  { id: 'glassmorphism_premium', label: 'Glassmorphism Premium' },
  { id: 'enterprise_dark', label: 'Enterprise Dark' },
  { id: 'minimal_light', label: 'Minimal Light' },
  { id: 'futuristic_tech', label: 'Futuristic Tech' },
];

const getPreviewContext = (proposal: DiagnosisProposal) => {
  const persona = getProposalPersona(proposal);
  const context = classifyProposalContext(proposal);
  const isWarehouse = persona === 'inventory_warehouse_system';
  const isGamer = persona === 'gamer_cinematic';
  const isMetrology = persona === 'industrial_automation' || context === BUSINESS_CONTEXTS.METROLOGY_SYSTEM;
  const enterprise = isEnterpriseProposal(proposal);
  const isHealthcare = context === BUSINESS_CONTEXTS.HEALTHCARE;
  const isLegal = context === BUSINESS_CONTEXTS.LEGAL;

  if (isGamer) {
    return {
      enterprise: false,
      context,
      cards: [
        { label: 'Trailer', value: 'Hero cinematográfico', icon: Clapperboard },
        { label: 'Gameplay', value: 'Showcase imersivo', icon: Gamepad2 },
        { label: 'CTA', value: 'Comprar agora', icon: ShoppingBag },
      ],
      flow: ['Hero épico', 'Trailer oficial', 'Gameplay showcase', 'História do universo', 'Galeria de mídia', 'Comprar agora'],
      highlights: ['Trailer em destaque', 'Gameplay', 'Wishlist', 'Comunidade gamer'],
      rows: [
        ['Trailer oficial', 'Em destaque', 'Alto hype'],
        ['Gameplay de combate', 'Showcase', 'Prioridade'],
        ['Galeria de mídia', 'Ativa', 'Explorar'],
        ['Comprar agora', 'CTA principal', 'Conversão'],
      ],
      metrics: [
        ['Hype', 'Alto'],
        ['Gameplay', 'Destaque'],
        ['CTA', 'Compra'],
      ],
      panelNote: 'Preview gamer com trailer, gameplay, atmosfera cinematográfica e CTA de compra',
      tableTitle: 'Experiência',
    };
  }

  if (isWarehouse) {
    return {
      enterprise,
      context,
      cards: [
        { label: 'Aprovação', value: 'Requisição controlada', icon: ShieldCheck },
        { label: 'Estoque', value: 'Baixa e disponibilidade', icon: PackageCheck },
        { label: 'Assinatura', value: 'Retirada rastreável', icon: PenLine },
      ],
      flow: ['Catálogo de produtos', 'Requisição criada', 'Aprovação da requisição', 'Validação de estoque', 'Baixa de estoque', 'Assinatura de retirada'],
      highlights: ['Quantidade disponível', 'Custos por área', 'Produtos mais requisitados', 'Maiores consumidores'],
      rows: [
        ['Requisição de EPI', 'Aguardando aprovação', 'Média'],
        ['Parafusos M8', 'Disponível', 'Normal'],
        ['Retirada por matrícula', 'Assinatura pendente', 'Atenção'],
        ['Produto sem estoque', 'Reposição sugerida', 'Crítico'],
      ],
      metrics: [
        ['Disponibilidade', 'Em tempo real'],
        ['Baixas', 'Rastreadas'],
        ['Risco', 'Estoque mínimo'],
      ],
      panelNote: 'Painel de almoxarifado com requisições, estoque, baixa, assinatura e consumo por área',
      tableTitle: 'Requisição',
    };
  }

  if (isMetrology) {
    return {
      enterprise,
      context,
      cards: [
        { label: 'Fila crítica', value: 'Peso FIFO', icon: Gauge },
        { label: 'Calibração', value: 'Alertas', icon: ShieldCheck },
        { label: 'Laudos', value: 'PDF digital', icon: BarChart3 },
      ],
      flow: proposal.mockup.modules.slice(0, 5),
      highlights: proposal.mockup.dataHighlights.slice(0, 4),
      rows: [
        ['Controle dimensional urgente', 'Peso 9.2', 'Crítico'],
        ['Calibração paquímetro digital', 'Vence hoje', 'Atenção'],
        ['Laudo peça linha B', 'PDF pronto', 'Liberado'],
        ['Inspeção lote produção', 'Fila 04', 'Em análise'],
      ],
      metrics: [
        ['Saturação', 'Monitorada'],
        ['Produtividade', '+Visível'],
        ['Risco', 'Monitorado'],
      ],
      panelNote: 'Painel inspirado em PowerApps / Office 365 enterprise',
      tableTitle: 'Demanda operacional',
    };
  }

  if (enterprise) {
    return {
      enterprise,
      context,
      cards: [
        { label: 'Fluxo', value: 'Rastreável', icon: Gauge },
        { label: 'Permissões', value: 'Por perfil', icon: ShieldCheck },
        { label: 'Indicadores', value: 'Operacionais', icon: BarChart3 },
      ],
      flow: proposal.mockup.modules.slice(0, 5),
      highlights: proposal.mockup.dataHighlights.slice(0, 4),
      rows: [
        ['Nova demanda interna', 'Registrada', 'Média'],
        ['Aprovação pendente', 'Em análise', 'Atenção'],
        ['Responsável definido', 'Em execução', 'Normal'],
        ['Indicador atualizado', 'Online', 'Monitorar'],
      ],
      metrics: [
        ['Fila', 'Ativa'],
        ['Produtividade', '+Visível'],
        ['Risco', 'Monitorado'],
      ],
      panelNote: 'Painel operacional preparado para rotina diária, permissões e indicadores',
      tableTitle: 'Demanda operacional',
    };
  }

  return {
    enterprise,
    context,
    cards: isHealthcare
      ? [
          { label: 'Agendamentos', value: 'Online', icon: CalendarDays },
          { label: 'Confiança', value: 'Alta', icon: ShieldCheck },
          { label: 'Contato', value: 'WhatsApp', icon: MessageCircle },
        ]
      : isLegal
        ? [
            { label: 'Autoridade', value: 'Premium', icon: ShieldCheck },
            { label: 'Consultas', value: 'CTA', icon: CalendarDays },
            { label: 'Credibilidade', value: 'Alta', icon: TrendingUp },
          ]
        : [
            { label: 'Conversões', value: 'Acompanhadas', icon: TrendingUp },
            { label: 'Agenda', value: 'Online', icon: CalendarDays },
            { label: 'Atendimento', value: 'WhatsApp', icon: MessageCircle },
          ],
    flow: proposal.mockup.modules.slice(0, 5),
    highlights: proposal.mockup.dataHighlights.slice(0, 4),
    rows: [
      [isHealthcare ? 'Solicitação de consulta' : isLegal ? 'Pedido de avaliação' : 'Novo contato recebido', 'WhatsApp', 'Quente'],
      [isHealthcare ? 'Agendamento online' : isLegal ? 'Consulta inicial' : 'Pedido de agenda', 'Hoje', 'Prioridade'],
      [isHealthcare ? 'Tratamento mais acessado' : isLegal ? 'Área de atuação' : 'Serviço mais acessado', 'Mobile', 'Alta intenção'],
      [isHealthcare ? 'Retorno de paciente' : isLegal ? 'Lead qualificado' : 'Retorno pendente', 'Contato', 'Acompanhar'],
    ],
    metrics: [
      ['Conversão', 'Acompanhada'],
      ['Atendimento', 'Online'],
      ['Risco', 'Baixo'],
    ],
    panelNote: 'Painel comercial preparado para operação diária',
    tableTitle: 'Oportunidade',
  };
};

const VisualPreview: React.FC<VisualPreviewProps> = ({ proposal, onOpenFullPreview, onRegenerateImage }) => {
  const [style, setStyle] = useState(imageStyles[0].id);
  const [regenerations, setRegenerations] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationError, setRegenerationError] = useState('');

  const regenerate = async () => {
    if (!onRegenerateImage || isRegenerating || regenerations >= MAX_STYLE_REGENERATIONS) return;
    setIsRegenerating(true);
    setRegenerationError('');
    setRegenerations((current) => current + 1);
    const succeeded = await onRegenerateImage(style);
    if (!succeeded) setRegenerationError('Não foi possível gerar nesse estilo agora. A imagem anterior foi mantida.');
    setIsRegenerating(false);
  };

  const { mockup, visualConcept } = proposal;
  const [activeTab, setActiveTab] = useState<'executive' | 'operational'>('executive');
  const palette = visualConcept.palette.length ? visualConcept.palette : ['#67e8f9', '#60a5fa', '#a78bfa'];
  const preview = getPreviewContext(proposal);
  const { context, enterprise } = preview;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="overflow-hidden rounded-lg border border-cyan-300/20 bg-[#07111f] lg:col-span-12">
        <div className="relative min-h-[22rem] md:min-h-[34rem]">
          {visualConcept.imageDataUrl ? (
            <img
              src={visualConcept.imageDataUrl}
              alt={visualConcept.imageAlt}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 25% 20%, ${palette[0]}44, transparent 34%), radial-gradient(circle at 75% 18%, ${palette[1] || palette[0]}33, transparent 32%), linear-gradient(135deg, #08111f 0%, #0a1628 48%, #050812 100%)`
              }}
            />
          )}
        </div>
        <div className="border-t border-white/10 bg-black/20 p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
            {visualConcept.imageModel ? `Imagem premium gerada por ${visualConcept.imageModel}` : 'Preview visual premium'}
          </p>
          <h4 className="font-display text-2xl leading-tight text-white">{visualConcept.title}</h4>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-300">{visualConcept.imageAlt}</p>
          <p className="mt-2 text-xs text-slate-400">Imagem conceitual: textos e valores são ilustrativos, não dados reais.</p>
          {onRegenerateImage && regenerations < MAX_STYLE_REGENERATIONS ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-300" htmlFor="image-style">Estilo visual</label>
              <select
                id="image-style"
                value={style}
                onChange={(event) => setStyle(event.target.value)}
                disabled={isRegenerating}
                className="min-h-[40px] rounded-md border border-white/15 bg-[#07111f] px-3 text-sm text-slate-100"
              >
                {imageStyles.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={regenerate}
                disabled={isRegenerating}
                className="min-h-[40px] rounded-md border border-cyan-300/40 px-4 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/10 disabled:cursor-wait disabled:opacity-60"
              >
                {isRegenerating ? 'Gerando, pode levar alguns minutos...' : 'Gerar neste estilo'}
              </button>
            </div>
          ) : null}
          {regenerationError ? <p role="alert" className="mt-3 text-xs text-amber-100">{regenerationError}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
              {context.replaceAll('_', ' ')}
            </span>
            <button
              type="button"
              onClick={onOpenFullPreview}
              className="rounded-full bg-cyan-300 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-950"
            >
              Ver visual completo
            </button>
          </div>
          {!visualConcept.imageDataUrl && visualConcept.imageError ? (
            <p className="mt-3 rounded-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
              {visualConcept.imageError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#07111f] lg:col-span-12">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{mockup.screenType}</p>
        </div>
        <div className="flex gap-2 border-b border-white/10 px-4 py-3">
          {[
            ['executive', 'Visão executiva'],
            ['operational', 'Painel operacional'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key as 'executive' | 'operational')}
              className={`rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                activeTab === key ? 'bg-cyan-300 text-slate-950' : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-12">
          <aside className="rounded-md border border-white/10 bg-white/[0.035] p-4 xl:col-span-4">
            <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-cyan-100">{visualConcept.heroLabel}</p>
            <h4 className="font-display text-2xl leading-tight text-white">{mockup.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{mockup.visualStyle}</p>
            <button
              type="button"
              onClick={onOpenFullPreview}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950"
            >
              Ver visual completo
            </button>
          </aside>

          <div className="space-y-4 xl:col-span-8">
            {activeTab === 'executive' ? (
              <>
            <div className="grid gap-3 sm:grid-cols-3">
              {preview.cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
                    <Icon size={16} className="mb-3 text-cyan-300" />
                    <p className="font-display text-xl text-white">{card.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">{card.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Fluxo operacional</p>
                <Activity size={16} className="text-cyan-300" />
              </div>
              <div className="space-y-3">
                {preview.flow.map((module, index) => (
                  <div key={module} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div>
                      <p className="mb-1 text-sm text-slate-200">{module}</p>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300"
                          style={{ width: `${68 + index * 6}%` }}
                        />
                      </div>
                    </div>
                    <CheckCircle2 size={16} className="text-cyan-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {preview.highlights.map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs leading-relaxed text-slate-300">
                  {item}
                </div>
              ))}
            </div>
              </>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  {preview.metrics.map(([label, value], index) => (
                    <div key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
                      <p className="font-display text-xl text-white">{value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-slate-500">{label}</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300" style={{ width: `${70 + index * 8}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.13em] text-slate-500">
                    <span>{preview.tableTitle}</span>
                    <span>Status</span>
                    <span>Prioridade</span>
                  </div>
                  {preview.rows.map(([name, status, priority]) => (
                    <div key={name} className="grid grid-cols-[1.5fr_1fr_1fr] items-center border-b border-white/5 px-4 py-3 text-xs text-slate-300 last:border-b-0">
                      <span>{name}</span>
                      <span className="text-cyan-100">{status}</span>
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-slate-200">
                        <AlertTriangle size={11} className="text-amber-200" />
                        {priority}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-cyan-100">
                    {preview.panelNote}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {mockup.modules.slice(0, 4).map((module) => (
                      <p key={module} className="rounded-md bg-black/20 px-3 py-2 text-xs leading-relaxed text-slate-200">{module}</p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualPreview;
