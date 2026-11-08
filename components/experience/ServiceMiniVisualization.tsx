import React from 'react';

export type ExperienceServiceId = 'sistemas' | 'automacao' | 'integracao' | 'ia';

const Dashboard: React.FC = () => (
  <div className="grid h-full grid-cols-[3.25rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-white/10 bg-night/70">
    <div className="space-y-2 border-r border-white/10 p-2">
      <span className="block h-1.5 rounded bg-ion/70" />
      {[70, 85, 55].map((width) => (
        <span key={width} className="block h-1.5 rounded bg-white/15" style={{ width: `${width}%` }} />
      ))}
    </div>
    <div className="flex min-w-0 flex-col gap-2 p-2">
      <div className="grid grid-cols-2 gap-2">
        <span className="rounded border border-white/10 p-1.5"><span className="block h-1 w-2/3 rounded bg-white/25" /><span className="mt-1.5 block h-1.5 w-1/2 rounded bg-ion/80" /></span>
        <span className="rounded border border-white/10 p-1.5"><span className="block h-1 w-1/2 rounded bg-white/25" /><span className="mt-1.5 block h-1.5 w-2/3 rounded bg-iris/80" /></span>
      </div>
      <div className="flex min-h-[2.5rem] flex-1 items-end gap-1">
        {[38, 62, 48, 78, 58, 88, 70].map((height, index) => (
          <span key={index} className="xp-bar flex-1 rounded-t bg-gradient-to-t from-azure to-ion" style={{ height: `${height}%`, transitionDelay: `${index * 35}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

const steps = ['Entrada', 'Validação', 'Execução', 'Resultado'];

const Flow: React.FC = () => (
  <ol className="flex h-full flex-col justify-center gap-1.5">
    {steps.map((step, index) => (
      <li key={step} className="xp-step flex items-center gap-2 rounded-md border border-white/10 bg-night/70 px-2.5 py-1 text-xs text-snow" style={{ transitionDelay: `${index * 110}ms` }}>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ion" />
        {step}
      </li>
    ))}
  </ol>
);

const nodes = [
  { label: 'CRM', x: 42, y: 24 },
  { label: 'ERP', x: 238, y: 24 },
  { label: 'APIs', x: 42, y: 92 },
  { label: 'Banco', x: 238, y: 92 }
];

const Network: React.FC = () => (
  <svg viewBox="0 0 280 116" className="h-full w-full" fill="none">
    {nodes.map((node) => (
      <path key={node.label} d={`M140 58 L${node.x} ${node.y}`} stroke="#22D3EE" strokeOpacity="0.6" className="xp-link" />
    ))}
    <circle cx="140" cy="58" r="17" fill="#111B30" stroke="#8B5CF6" />
    <circle cx="140" cy="58" r="5" fill="#22D3EE" />
    {nodes.map((node) => (
      <g key={node.label}>
        <rect x={node.x - 28} y={node.y - 13} width="56" height="26" rx="7" fill="#111B30" stroke="#FFFFFF" strokeOpacity="0.2" />
        <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#F5F7FB" fontSize="12">{node.label}</text>
      </g>
    ))}
  </svg>
);

const Chat: React.FC = () => (
  <div className="flex h-full flex-col justify-center gap-1.5 text-xs leading-snug">
    <p className="ml-auto max-w-[85%] rounded-lg bg-ion px-2.5 py-1 text-night">O que priorizar hoje?</p>
    <div className="flex items-center gap-1 px-1" >
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="xp-dot h-1.5 w-1.5 rounded-full bg-iris" style={{ animationDelay: `${dot * 160}ms` }} />
      ))}
    </div>
    <p className="max-w-[92%] rounded-lg border border-white/10 bg-night-3 px-2.5 py-1 text-snow">Comece pelos pedidos que aguardam aprovação.</p>
  </div>
);

const visuals: Record<ExperienceServiceId, React.FC> = {
  sistemas: Dashboard,
  automacao: Flow,
  integracao: Network,
  ia: Chat
};

const ServiceMiniVisualization: React.FC<{ id: ExperienceServiceId }> = ({ id }) => {
  const Visual = visuals[id];
  return (
    <div className="h-28" aria-hidden="true">
      <Visual />
    </div>
  );
};

export default ServiceMiniVisualization;
