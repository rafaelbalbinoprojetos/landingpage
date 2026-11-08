import React, { useEffect, useRef, useState } from 'react';
import { Check, DraftingCompass, Minus, Repeat, Rocket, ScanSearch } from 'lucide-react';
import { audienceFit, methodSteps } from '../landingContent';
import Reveal from './Reveal';

const icons = [ScanSearch, DraftingCompass, Rocket, Repeat];

const MethodologyTimeline: React.FC = () => {
  const lineRef = useRef<HTMLOListElement | null>(null);
  const [filled, setFilled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = lineRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="metodo" className="eb-section scroll-mt-16 bg-mist-2 text-night">
      <div className="eb-ruler shell mb-14 text-night" aria-hidden="true" />
      <div className="shell">
        <Reveal>
          <p className="eb-kicker mb-4 text-ion-deep">Da ideia ao impacto</p>
          <h2 className="eb-title">Como trabalhamos.</h2>
        </Reveal>

        <ol ref={lineRef} className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
          <div className="absolute inset-x-0 top-6 hidden h-0.5 bg-night/10 lg:block" aria-hidden="true">
            <div className={`eb-fill-x h-full bg-gradient-to-r from-ion via-azure to-iris ${filled ? 'scale-x-100' : 'scale-x-0'}`} />
          </div>
          <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-night/10 lg:hidden" aria-hidden="true">
            <div className={`eb-fill-y h-full w-full bg-gradient-to-b from-ion via-azure to-iris ${filled ? 'scale-y-100' : 'scale-y-0'}`} />
          </div>

          {methodSteps.map((step, index) => {
            const Icon = icons[index];
            const isActive = active === index;
            return (
              <li key={step.title} className="relative pl-16 lg:pl-0">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  aria-label={`Etapa ${index + 1}: ${step.title}`}
                  className={`absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 lg:static ${
                    isActive ? 'scale-110 border-night bg-night text-ion' : 'border-night/20 bg-white text-night'
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </button>
                <p className="headline mt-1 text-5xl text-night/15 lg:mt-6" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="eb-subtitle mt-2">{step.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-graphite">{step.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {step.artifacts.map((artifact) => (
                    <li
                      key={artifact}
                      className={`rounded-md border bg-white px-2 py-1 text-xs text-night transition-colors duration-200 ${
                        isActive ? 'border-ion-deep' : 'border-night/15'
                      }`}
                    >
                      {artifact}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <Reveal className="mt-20 grid overflow-hidden rounded-2xl md:grid-cols-2 lg:mt-28">
          <div className="bg-night p-7 text-snow md:p-10">
            <h3 className="eb-subtitle">Faz sentido falar com a gente quando</h3>
            <ul className="mt-7 space-y-4">
              {audienceFit.ideal.map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-snug">
                  <Check size={18} className="mt-1 shrink-0 text-ion" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-night/15 bg-white p-7 md:rounded-r-2xl md:border-l-0 md:p-10">
            <h3 className="eb-subtitle">Provavelmente não é o momento quando</h3>
            <ul className="mt-7 space-y-4 text-graphite">
              {audienceFit.notIdeal.map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-snug">
                  <Minus size={18} className="mt-1 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default MethodologyTimeline;
