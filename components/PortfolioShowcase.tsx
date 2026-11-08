import React from 'react';
import { ArrowUpRight, BookOpen, Headphones, Sparkles } from 'lucide-react';
import { kordenConversation, projects } from '../landingContent';
import Reveal from './Reveal';

type Project = (typeof projects)[number];

const BrowserMockup: React.FC<{ project: Project; tilt: string }> = ({ project, tilt }) => (
  <figure
    className="eb-mockup overflow-hidden rounded-xl border border-night/15 bg-night"
    style={{ '--tilt': tilt, '--accent': project.accent } as React.CSSProperties}
  >
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
      </span>
      <span className="truncate rounded bg-white/10 px-3 py-0.5 font-mono text-[0.6875rem] text-fog">{project.url}</span>
    </div>
    <img
      src={project.image}
      alt={project.imageAlt}
      width={1280}
      height={project.imageHeight}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full"
    />
  </figure>
);

const IllustrationFrame: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <figure
    className="eb-mockup eb-tech-grid relative overflow-hidden rounded-xl border border-night/15 bg-night p-5 text-snow"
    style={{ '--tilt': '0deg', '--accent': accent } as React.CSSProperties}
  >
    {children}
    <figcaption className="mt-4 text-xs text-fog">Representação ilustrativa, não é captura do produto.</figcaption>
  </figure>
);

const EssenciaVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <IllustrationFrame accent={accent}>
    <div className="grid grid-cols-3 gap-3" aria-hidden="true">
      <div className="rounded-lg border border-white/15 bg-night-3 p-3">
        <BookOpen size={18} style={{ color: accent }} />
        <p className="mt-2 text-xs">Leitura</p>
        <div className="mt-3 space-y-1.5">
          {[100, 86, 94, 62].map((width) => (
            <span key={width} className="block h-1 rounded bg-white/25" style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-white/15 bg-night-3 p-3">
        <Headphones size={18} style={{ color: accent }} />
        <p className="mt-2 text-xs">Áudio</p>
        <div className="mt-3 flex h-6 items-center gap-0.5">
          {[30, 70, 45, 95, 55, 80, 35, 65, 40].map((height, index) => (
            <span key={index} className="flex-1 rounded" style={{ height: `${height}%`, background: accent }} />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-white/15 bg-night-3 p-3">
        <Sparkles size={18} style={{ color: accent }} />
        <p className="mt-2 text-xs">Visual</p>
        <div className="mt-3 h-6 rounded" style={{ background: `linear-gradient(120deg, ${accent}, #8B5CF6)` }} />
      </div>
    </div>
  </IllustrationFrame>
);

const QualityVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <IllustrationFrame accent={accent}>
    <svg viewBox="0 0 320 110" className="h-auto w-full" fill="none" aria-hidden="true">
      <rect x="0" y="32" width="320" height="46" fill={accent} fillOpacity="0.12" />
      <path d="M0 32 H320 M0 78 H320" stroke={accent} strokeOpacity="0.7" strokeDasharray="4 5" />
      <path d="M0 58 L45 50 L90 62 L135 46 L180 56 L225 44 L270 60 L320 52" stroke="#F5F7FB" strokeWidth="1.5" />
      {[[45, 50], [90, 62], [135, 46], [180, 56], [225, 44], [270, 60]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill={accent} />
      ))}
      <text x="2" y="24" fill="#A8B6CB" fontSize="11">Limite superior de tolerância</text>
      <text x="2" y="96" fill="#A8B6CB" fontSize="11">Limite inferior de tolerância</text>
    </svg>
  </IllustrationFrame>
);

const Details: React.FC<{ project: Project }> = ({ project }) => (
  <>
    <p className="eb-kicker flex items-center gap-2 text-graphite">
      <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
      {project.category}
    </p>
    <h3 className="eb-title mt-3 !text-[clamp(2rem,1.6rem+1.6vw,3rem)]">{project.name}</h3>
    <p className="mt-4 text-lg leading-snug text-night/85">{project.description}</p>
    <ul className="mt-5 space-y-1.5 text-graphite">
      {project.scope.map((item) => (
        <li key={item} className="flex gap-2.5 leading-snug">
          <span className="mt-[0.6em] h-px w-3 shrink-0 bg-night/50" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
    {project.href ? (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className="eb-link mt-4 border-b border-night">
        {project.linkLabel}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    ) : null}
  </>
);

const PortfolioShowcase: React.FC = () => {
  const [korden, meushape, essencia, quality] = projects;

  return (
    <div className="bg-night">
      <section id="projetos" className="eb-section scroll-mt-16 rounded-t-[2rem] bg-mist text-night md:rounded-t-[3rem]">
        <div className="shell">
          <Reveal>
            <p className="eb-kicker mb-4 text-ion-deep">Produtos digitais selecionados</p>
            <h2 className="eb-title max-w-[16ch]">
              Produtos que <span className="eb-grad-light">já construímos.</span>
            </h2>
          </Reveal>

          <Reveal delayMs={60} className="mt-14">
            <article className="group grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Details project={korden} />
              </div>
              <div className="relative lg:col-span-8">
                <BrowserMockup project={korden} tilt="-4deg" />
                <dl className="mt-3 rounded-xl border border-white/10 bg-night/95 p-4 text-snow shadow-2xl lg:absolute lg:-bottom-6 lg:-left-6 lg:mt-0 lg:w-80">
                  <p className="eb-kicker mb-2 text-fog">Exemplo do site do Korden</p>
                  {kordenConversation.map((line) => (
                    <div key={line.text} className="mt-2">
                      <dt className="text-xs" style={{ color: line.from === 'Korden' ? korden.accent : '#A8B6CB' }}>{line.from}</dt>
                      <dd className="text-sm leading-snug">{line.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </Reveal>

          <Reveal delayMs={60} className="mt-20 lg:mt-28">
            <article className="group grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:order-2 lg:col-span-4 lg:col-start-9">
                <Details project={meushape} />
              </div>
              <div className="lg:order-1 lg:col-span-7">
                <BrowserMockup project={meushape} tilt="4deg" />
              </div>
            </article>
          </Reveal>

          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:mt-28 xl:gap-20">
            <Reveal>
              <article className="group">
                <EssenciaVisual accent={essencia.accent} />
                <div className="mt-7"><Details project={essencia} /></div>
              </article>
            </Reveal>
            <Reveal delayMs={80} className="md:mt-16">
              <article className="group">
                <QualityVisual accent={quality.accent} />
                <div className="mt-7"><Details project={quality} /></div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioShowcase;
