import React from 'react';
import { BrainCircuit, GitBranch, Network } from 'lucide-react';

// Os painéis descrevem capacidades; não exibem métricas nem resultados.
const panels = [
  {
    title: 'Sistemas conectados',
    detail: 'CRM • ERP • Automação',
    icon: Network,
    position: 'hero-panel-a hidden lg:block',
    duration: '9s',
    delay: '0s'
  },
  {
    title: 'Fluxo inteligente',
    detail: 'Entrada → Regra → Ação',
    icon: GitBranch,
    position: 'hero-panel-b',
    duration: '11s',
    delay: '-3s'
  },
  {
    title: 'IA aplicada',
    detail: 'Análise • Contexto • Decisão',
    icon: BrainCircuit,
    position: 'hero-panel-c hidden md:block',
    duration: '13s',
    delay: '-6s'
  }
];

const HeroFloatingPanels: React.FC = () => (
  <div className="hero-layer-panels pointer-events-none absolute inset-0">
    {panels.map(({ title, detail, icon: Icon, position, duration, delay }) => (
      <div key={title} className={`absolute ${position}`}>
        <div className="hero-panel" style={{ animationDuration: duration, animationDelay: delay }}>
          <div className="flex items-center gap-2 text-hero-cyan">
            <Icon size={14} aria-hidden="true" />
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">{title}</p>
          </div>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-hero-white">{detail}</p>
        </div>
      </div>
    ))}
  </div>
);

export default HeroFloatingPanels;
