import React, { RefObject, useEffect, useState } from 'react';
import { ExperienceServiceId } from './ServiceMiniVisualization';

interface Connection {
  id: ExperienceServiceId;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface EnergyConnectionsProps {
  stageRef: RefObject<HTMLElement | null>;
  originRef: RefObject<HTMLElement | null>;
  cardRefs: RefObject<Partial<Record<ExperienceServiceId, HTMLElement | null>>>;
  order: ExperienceServiceId[];
  activeId: ExperienceServiceId | null;
}

// As linhas ficam atrás do robô e são calculadas com as medidas reais dos elementos.
const EnergyConnections: React.FC<EnergyConnectionsProps> = ({ stageRef, originRef, cardRefs, order, activeId }) => {
  const [connections, setConnections] = useState<Connection[]>([]);

  // Efeito passivo: as refs do palco e dos cards, irmãos e pai deste componente, já existem aqui.
  useEffect(() => {
    const stage = stageRef.current;
    const origin = originRef.current;
    if (!stage || !origin) return;

    const measure = () => {
      const base = stage.getBoundingClientRect();
      const start = origin.getBoundingClientRect();
      const x1 = start.left - base.left;
      const y1 = start.top - base.top;
      const next: Connection[] = [];
      order.forEach((id) => {
        const card = cardRefs.current[id];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const toLeft = rect.right - base.left < x1;
        const x2 = toLeft ? rect.right - base.left : rect.left - base.left;
        const y2 = rect.top - base.top + rect.height / 2;
        const mid = (x1 + x2) / 2;
        next.push({ id, x1, y1, x2, y2, d: `M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}` });
      });
      setConnections(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageRef, originRef, cardRefs, order]);

  return (
    <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block" fill="none" aria-hidden="true">
      <defs>
        {connections.map((line) => (
          <linearGradient key={line.id} id={`xp-grad-${line.id}`} gradientUnits="userSpaceOnUse" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}>
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        ))}
      </defs>
      {connections.map((line, index) => {
        const stroke = `url(#xp-grad-${line.id})`;
        return (
          <g key={line.id} className="xp-connection" data-active={activeId === line.id}>
            <path d={line.d} stroke={stroke} pathLength={1} className="xp-line-glow" />
            <path d={line.d} stroke={stroke} pathLength={1} className="xp-line" style={{ animationDelay: `${1600 + index * 400}ms` }} />
            <path d={line.d} stroke="#E8FBFF" pathLength={1} className="xp-pulse" style={{ animationDelay: `${3800 + index * 1500}ms` }} />
            <circle cx={line.x2} cy={line.y2} r="3.5" fill="#22D3EE" className="xp-node" style={{ animationDelay: `${2200 + index * 400}ms` }} />
          </g>
        );
      })}
    </svg>
  );
};

export default EnergyConnections;
