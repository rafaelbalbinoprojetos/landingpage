import React, { useEffect, useRef, useState } from 'react';
import EnergyConnections from './EnergyConnections';
import EpicByteRobot from './EpicByteRobot';
import FloatingServiceCard, { ExperienceService } from './FloatingServiceCard';
import { ExperienceServiceId } from './ServiceMiniVisualization';

const experienceServices: ExperienceService[] = [
  {
    id: 'sistemas',
    kicker: 'Desenvolvimento de sistemas',
    title: 'Sistemas sob medida',
    description: 'Aplicações inteligentes desenvolvidas para acompanhar a operação real de cada empresa.',
    placement: 'lg:col-start-1 lg:row-start-1',
    delayMs: 1750
  },
  {
    id: 'automacao',
    kicker: 'Automação de processos',
    title: 'Automação inteligente',
    description: 'Processos conectados que executam tarefas, aplicam regras e reduzem o trabalho manual.',
    placement: 'lg:col-start-3 lg:row-start-1',
    delayMs: 2150
  },
  {
    id: 'integracao',
    kicker: 'Integrações',
    title: 'Tudo conectado',
    description: 'Sistemas, bancos de dados e ferramentas compartilhando informações em um único fluxo.',
    placement: 'lg:col-start-1 lg:row-start-2',
    delayMs: 2550
  },
  {
    id: 'ia',
    kicker: 'Inteligência artificial',
    title: 'IA aplicada ao negócio',
    description: 'Assistentes e análises inteligentes que transformam dados em decisões e ações.',
    placement: 'lg:col-start-3 lg:row-start-2',
    delayMs: 2950
  }
];

const serviceOrder = experienceServices.map((service) => service.id);

const particles = [
  [8, 18], [17, 72], [28, 40], [38, 88], [46, 12], [55, 92], [63, 30], [74, 80], [84, 22], [93, 62]
];

const EpicByteExperience: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const originRef = useRef<HTMLSpanElement | null>(null);
  const cardRefs = useRef<Partial<Record<ExperienceServiceId, HTMLLIElement | null>>>({});
  const [started, setStarted] = useState(false);
  const [inView, setInView] = useState(false);
  const [activeId, setActiveId] = useState<ExperienceServiceId | null>(null);

  // A apresentação roda uma única vez; os loops pausam fora da tela.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="xp-title" className="xp-section relative overflow-hidden bg-night py-12 text-snow lg:py-16">
      <h2 id="xp-title" className="sr-only">Sistemas, automação, integrações e IA da EpicByte</h2>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map(([left, top], index) => (
          <span key={`${left}-${top}`} className="xp-particle" style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * 0.7}s` }} />
        ))}
      </div>
      <div className="shell relative">
        <div
          ref={stageRef}
          data-started={started}
          data-live={inView}
          className="xp-stage relative grid grid-cols-[minmax(0,1fr)] items-stretch gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-2 lg:gap-x-8 lg:gap-y-6"
        >
          <EnergyConnections stageRef={stageRef} originRef={originRef} cardRefs={cardRefs} order={serviceOrder} activeId={activeId} />
          <div className="relative z-10 md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <EpicByteRobot ref={originRef} />
            <span className="xp-spine mx-auto mt-3 block h-8 w-px lg:hidden" aria-hidden="true" />
          </div>
          <ul className="contents">
            {experienceServices.map((service) => (
              <FloatingServiceCard
                key={service.id}
                ref={(node) => {
                  cardRefs.current[service.id] = node;
                }}
                service={service}
                activeId={activeId}
                onActivate={setActiveId}
              />
            ))}
          </ul>
        </div>
        <p className="mt-5 text-center text-xs text-fog">Ilustrações de conceito, sem dados de clientes.</p>
      </div>
    </section>
  );
};

export default EpicByteExperience;
