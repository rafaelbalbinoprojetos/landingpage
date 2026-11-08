import React, { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ServiceMiniVisualization, { ExperienceServiceId } from './ServiceMiniVisualization';

export interface ExperienceService {
  id: ExperienceServiceId;
  kicker: string;
  title: string;
  description: string;
  placement: string;
  delayMs: number;
}

interface FloatingServiceCardProps {
  service: ExperienceService;
  activeId: ExperienceServiceId | null;
  onActivate: (id: ExperienceServiceId | null) => void;
}

const FloatingServiceCard = forwardRef<HTMLLIElement, FloatingServiceCardProps>(
  ({ service, activeId, onActivate }, ref) => (
    <li ref={ref} className={`relative z-20 min-w-0 ${service.placement}`}>
      <div className="xp-card-in h-full" style={{ animationDelay: `${service.delayMs}ms` }}>
        <a
          href={`#servico-${service.id}`}
          data-active={activeId === service.id}
          data-dimmed={activeId !== null && activeId !== service.id}
          onMouseEnter={() => onActivate(service.id)}
          onMouseLeave={() => onActivate(null)}
          onFocus={() => onActivate(service.id)}
          onBlur={() => onActivate(null)}
          className="xp-card flex h-full flex-col rounded-2xl p-4 text-snow"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="eb-kicker text-ion">{service.kicker}</span>
            <ArrowUpRight size={16} className="xp-arrow shrink-0 text-fog" aria-hidden="true" />
          </span>
          <span className="mt-3 block text-xl font-semibold leading-tight">{service.title}</span>
          <span className="mt-1.5 block text-sm leading-snug text-fog">{service.description}</span>
          <span className="mt-3 block">
            <ServiceMiniVisualization id={service.id} />
          </span>
        </a>
      </div>
    </li>
  )
);

FloatingServiceCard.displayName = 'FloatingServiceCard';

export default FloatingServiceCard;
