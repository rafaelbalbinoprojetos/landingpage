import React from 'react';
import { AppWindow, ArrowRight, BrainCircuit, FileText, GitBranch, Plug } from 'lucide-react';
import { services } from '../landingContent';
import Reveal from './Reveal';

const AppVisual: React.FC = () => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-night" aria-hidden="true">
    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
    </div>
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)]">
      <ul className="space-y-1 border-r border-white/10 p-1.5 text-xs text-fog sm:p-2.5">
        <li className="rounded bg-ion/15 px-2 py-1.5 text-ion">Pedidos</li>
        <li className="px-2 py-1.5">Clientes</li>
        <li className="px-2 py-1.5">Financeiro</li>
        <li className="px-2 py-1.5">Relatórios</li>
      </ul>
      <div className="space-y-3 p-3">
        <div className="flex h-20 items-end gap-1.5">
          {[38, 62, 48, 78, 58, 88, 70, 96].map((height, index) => (
            <span
              key={index}
              className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-azure to-ion transition-transform duration-300 group-hover:scale-y-105"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        {['Em andamento', 'Aguardando aprovação', 'Concluído'].map((status, index) => (
          <div key={status} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2 text-xs text-fog">
            <span className="h-1.5 rounded bg-white/20" style={{ width: `${46 - index * 8}%` }} />
            <span className="whitespace-nowrap">{status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FlowVisual: React.FC = () => (
  <svg viewBox="0 0 360 170" className="h-auto w-full" fill="none" aria-hidden="true">
    <path d="M92 85 H132" stroke="#22D3EE" strokeWidth="1.5" className="eb-march" />
    <path d="M196 85 C225 85 222 42 250 42" stroke="#22D3EE" strokeWidth="1.5" className="eb-march" />
    <path d="M196 85 C225 85 222 128 250 128" stroke="#8B5CF6" strokeWidth="1.5" className="eb-march" />
    <rect x="4" y="64" width="88" height="42" rx="9" fill="#111B30" stroke="#FFFFFF" strokeOpacity="0.18" />
    <text x="48" y="90" textAnchor="middle" fill="#F5F7FB" fontSize="13">Pedido</text>
    <path d="M164 53 L196 85 L164 117 L132 85 Z" fill="#111B30" stroke="#22D3EE" />
    <text x="164" y="89" textAnchor="middle" fill="#F5F7FB" fontSize="12">Regra</text>
    <rect x="250" y="20" width="106" height="44" rx="9" fill="#111B30" stroke="#22D3EE" strokeOpacity="0.6" />
    <text x="303" y="47" textAnchor="middle" fill="#F5F7FB" fontSize="13">Aprovar</text>
    <rect x="250" y="106" width="106" height="44" rx="9" fill="#111B30" stroke="#8B5CF6" strokeOpacity="0.7" />
    <text x="303" y="133" textAnchor="middle" fill="#F5F7FB" fontSize="13">Notificar</text>
  </svg>
);

const IntegrationVisual: React.FC = () => (
  <div className="relative" aria-hidden="true">
    <div className="flex flex-wrap justify-between gap-2">
      {['CRM', 'ERP', 'Planilhas'].map((tool) => (
        <span key={tool} className="eb-chip">{tool}</span>
      ))}
    </div>
    <svg viewBox="0 0 300 40" className="h-10 w-full" preserveAspectRatio="none" fill="none">
      {[30, 150, 270].map((x) => (
        <path key={x} d={`M${x} 0 V40`} stroke="#22D3EE" strokeOpacity="0.8" className="eb-march" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
    <div className="rounded-lg border border-ion/50 bg-gradient-to-r from-ion/15 via-azure/20 to-iris/20 px-4 py-3 text-center text-sm font-semibold text-snow">
      Camada de integração
    </div>
    <svg viewBox="0 0 300 40" className="h-10 w-full" preserveAspectRatio="none" fill="none">
      {[75, 225].map((x) => (
        <path key={x} d={`M${x} 0 V40`} stroke="#8B5CF6" strokeOpacity="0.9" className="eb-march" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
    <div className="flex justify-around gap-2">
      {['Financeiro', 'Seu sistema'].map((tool) => (
        <span key={tool} className="eb-chip">{tool}</span>
      ))}
    </div>
  </div>
);

const AssistantVisual: React.FC = () => (
  <div className="space-y-3 rounded-xl border border-white/10 bg-night p-4" aria-hidden="true">
    <div className="flex flex-wrap gap-2">
      {['contrato.pdf', 'pedido.xlsx'].map((file) => (
        <span key={file} className="eb-chip inline-flex items-center gap-1.5">
          <FileText size={12} className="text-iris" /> {file}
        </span>
      ))}
    </div>
    <p className="ml-auto max-w-[85%] rounded-lg bg-ion px-3 py-2 text-sm leading-snug text-night">
      O que este contrato exige antes da entrega?
    </p>
    <p className="max-w-[92%] rounded-lg border border-white/10 bg-night-3 px-3 py-2 text-sm leading-snug text-snow">
      Ele pede o pedido aprovado e a conferência dos itens. Marquei os dois pontos no documento.
    </p>
  </div>
);

const items = {
  sistemas: { Icon: AppWindow, Visual: AppVisual, span: 'lg:col-span-7', layout: 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]' },
  automacao: { Icon: GitBranch, Visual: FlowVisual, span: 'lg:col-span-5', layout: '' },
  integracao: { Icon: Plug, Visual: IntegrationVisual, span: 'lg:col-span-5', layout: '' },
  ia: { Icon: BrainCircuit, Visual: AssistantVisual, span: 'lg:col-span-7', layout: 'md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]' }
};

const ServiceShowcase: React.FC = () => (
  <section id="servicos" className="eb-section relative scroll-mt-16 overflow-hidden bg-night-2 text-snow">
    <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[70%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent)]" />
    <div className="shell relative">
      <Reveal>
        <p className="eb-kicker mb-4 text-ion">O que fazemos</p>
        <h2 className="eb-title max-w-[20ch]">
          Quatro frentes, um mesmo objetivo: <span className="eb-grad">sua operação funcionando sem improviso.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {services.map((service, index) => {
          const { Icon, Visual, span, layout } = items[service.id];
          return (
            <Reveal key={service.id} delayMs={index * 50} className={`min-w-0 ${span}`}>
              <article id={`servico-${service.id}`} className={`group scroll-mt-20 eb-panel eb-panel-interactive grid h-full min-w-0 grid-cols-[minmax(0,1fr)] gap-6 p-5 md:p-7 ${layout}`}>
                <div className={`flex flex-col ${service.id === 'ia' ? 'md:order-2' : ''}`}>
                  <div className="flex items-center justify-between text-fog">
                    <Icon size={22} className="text-ion" aria-hidden="true" />
                    <span className="eb-kicker">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="eb-subtitle mt-6">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-fog">{service.description}</p>
                  <ul className="eb-kicker mt-5 flex flex-wrap gap-x-4 gap-y-1 normal-case tracking-normal text-fog">
                    {service.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                  <a href="#briefing" className="eb-link mt-auto pt-4 text-ion" aria-label={`Falar sobre ${service.title}`}>
                    Falar sobre isso <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
                <div className={`self-center ${service.id === 'ia' ? 'md:order-1' : ''}`}>
                  <Visual />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-fog">Ilustrações de conceito, sem dados de clientes.</p>
    </div>
  </section>
);

export default ServiceShowcase;
