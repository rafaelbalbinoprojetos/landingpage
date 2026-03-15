import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
  GitBranch,
  LineChart,
  Menu,
  Network,
  Radar,
  Repeat,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Target,
  Wallet,
  Workflow,
  X,
  Zap
} from 'lucide-react';
import { NavItem } from './types';

const MEDIA_VERSION = '2026-03-14-4';

const scrollToId = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const navItems: NavItem[] = [
  { label: 'Problema', href: '#problema' },
  { label: 'Categoria', href: '#abordagem' },
  { label: 'Arquitetura', href: '#arquitetura' },
  { label: 'Resultados', href: '#prova' },
  { label: 'Método', href: '#metodo' }
];

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, className = '', delayMs = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = revealRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className={`${className} transition-all duration-700 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-[2px]'
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};

interface ScrollScrubVideoProps {
  src: string;
  className?: string;
  children?: ReactNode;
  tone?: 'default' | 'blue';
}

const ScrollScrubVideo: React.FC<ScrollScrubVideoProps> = ({ src, className = '', children, tone = 'default' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(0);
  const targetProgressRef = useRef(0);
  const smoothTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let rafId = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const updateTargetProgressFromScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewport = window.innerHeight;
      const startLine = viewport * 0.92;
      const endLine = viewport * 0.08;
      // Distância maior para espalhar o avanço do vídeo e evitar saltos bruscos.
      const travel = startLine - endLine + rect.height + viewport * 0.9;
      const rawProgress = (startLine - rect.top) / travel;
      let progress = clamp(rawProgress, 0, 1);

      // Quando o bloco está quase saindo da tela, garante que o vídeo
      // chegue no final sem depender de um scroll muito longo.
      const nearExitStart = viewport * 0.35;
      const nearExitProgress = clamp((nearExitStart - rect.bottom) / nearExitStart, 0, 1);
      if (nearExitProgress > 0) {
        const finalSecondStart =
          durationRef.current > 0 ? clamp((durationRef.current - 1) / durationRef.current, 0, 1) : 0.84;
        const boostedProgress = finalSecondStart + (1 - finalSecondStart) * nearExitProgress;
        progress = Math.max(progress, boostedProgress);
      }

      targetProgressRef.current = progress;
    };

    const animateScrub = () => {
      rafId = requestAnimationFrame(animateScrub);
      if (durationRef.current <= 0) return;

      const targetTime = targetProgressRef.current * durationRef.current;
      const diff = targetTime - smoothTimeRef.current;

      // Interpolação contínua para preencher a transição entre frames.
      smoothTimeRef.current += diff * 0.2;

      if (Math.abs(diff) < 0.002) {
        smoothTimeRef.current = targetTime;
      }

      // Evita atribuições redundantes e melhora estabilidade.
      if (Math.abs(video.currentTime - smoothTimeRef.current) > 0.001) {
        video.currentTime = smoothTimeRef.current;
      }
    };

    const onLoadedMetadata = () => {
      durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
      video.pause();
      updateTargetProgressFromScroll();
      smoothTimeRef.current = targetProgressRef.current * durationRef.current;
      video.currentTime = smoothTimeRef.current;
    };

    const onScrollOrResize = () => updateTargetProgressFromScroll();

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    updateTargetProgressFromScroll();
    animateScrub();

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45"
        src={src}
        muted
        playsInline
        preload="auto"
      />
      {tone === 'blue' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#071429]/78 via-[#0a1b33]/60 to-[#081427]/84 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081a31]/58 via-transparent to-[#081a31]/58 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,40,80,0.35),rgba(10,15,30,0.6))] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-transparent to-slate-950/55 pointer-events-none" />
        </>
      )}
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3 shadow-2xl shadow-black/30' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12 flex justify-between items-center">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Cpu size={22} className="text-white" />
          </span>
          <span className="font-display text-white text-xl sm:text-2xl tracking-tight uppercase">
            EPIC<span className="text-cyan-300">BYTE</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToId(e, item.href)}
              className="text-xs uppercase tracking-[0.18em] text-slate-300/90 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={(e) => scrollToId(e, '#contato')}
            className="bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-cyan-300 transition-colors"
          >
            Diagnóstico 30 min
          </button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg border border-white/10 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 sm:px-8 xl:px-12 pt-4 pb-6">
          <div className="glass rounded-2xl p-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  scrollToId(e, item.href);
                }}
                className="text-slate-100 py-2 border-b border-white/5 last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                scrollToId(e, '#contato');
              }}
              className="bg-cyan-400 text-slate-950 mt-2 py-3 rounded-xl font-semibold"
            >
              Agendar diagnóstico
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(0);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const targetParallaxRef = useRef(0);
  const smoothParallaxRef = useRef(0);
  const metricCardARef = useRef<HTMLDivElement | null>(null);
  const metricCardBRef = useRef<HTMLDivElement | null>(null);
  const metricCardCRef = useRef<HTMLDivElement | null>(null);
  const circuitLayerRef = useRef<HTMLDivElement | null>(null);
  const interfaceLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let rafId = 0;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const updateTargetProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const startLine = viewport * 0.92;
      const endLine = viewport * 0.08;
      const travel = startLine - endLine + rect.height + viewport * 0.9;
      const raw = (startLine - rect.top) / travel;
      const progress = clamp(raw, 0, 1);
      const topBlend = clamp(window.scrollY / 140, 0, 1);
      const blendedProgress = progress * topBlend;
      targetProgressRef.current = blendedProgress;
      targetParallaxRef.current = (0.5 - blendedProgress) * 64;
    };

    const syncVideoWithScroll = () => {
      rafId = requestAnimationFrame(syncVideoWithScroll);
      smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.24;
      smoothParallaxRef.current += (targetParallaxRef.current - smoothParallaxRef.current) * 0.18;

      const progress = smoothProgressRef.current;
      const zoom = 1.04 + clamp((progress - 0.06) / 0.32, 0, 1) * 0.14;
      const metricsDrift = clamp(progress, 0, 1);
      const circuitsReveal = clamp((progress - 0.6) / 0.2, 0, 1);
      const uiReveal = clamp((progress - 0.8) / 0.15, 0, 1);

      if (durationRef.current > 0) {
        video.currentTime = progress * durationRef.current;
      }
      video.style.transform = `translate3d(0, ${smoothParallaxRef.current.toFixed(2)}px, 0) scale(${zoom.toFixed(3)})`;

      if (metricCardARef.current) {
        metricCardARef.current.style.opacity = '0.9';
        metricCardARef.current.style.transform = `translate3d(0, ${(-6 - smoothParallaxRef.current * 0.11 + metricsDrift * 8).toFixed(2)}px, 0) rotateZ(${(-1.2 + metricsDrift * 1.1).toFixed(2)}deg) scale(${(0.986 + metricsDrift * 0.02).toFixed(3)})`;
      }
      if (metricCardBRef.current) {
        metricCardBRef.current.style.opacity = '0.88';
        metricCardBRef.current.style.transform = `translate3d(0, ${(4 + smoothParallaxRef.current * 0.1 - metricsDrift * 7).toFixed(2)}px, 0) rotateZ(${(1.5 - metricsDrift * 1.3).toFixed(2)}deg) scale(${(0.984 + metricsDrift * 0.018).toFixed(3)})`;
      }
      if (metricCardCRef.current) {
        metricCardCRef.current.style.opacity = '0.9';
        metricCardCRef.current.style.transform = `translate3d(0, ${(-2 - smoothParallaxRef.current * 0.09 + metricsDrift * 6).toFixed(2)}px, 0) rotateZ(${(-0.9 + metricsDrift * 1).toFixed(2)}deg) scale(${(0.985 + metricsDrift * 0.016).toFixed(3)})`;
      }
      if (circuitLayerRef.current) {
        circuitLayerRef.current.style.opacity = (circuitsReveal * 0.7).toFixed(3);
      }
      if (interfaceLayerRef.current) {
        interfaceLayerRef.current.style.opacity = (uiReveal * 0.85).toFixed(3);
      }
    };

    const onMetadataLoaded = () => {
      durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
      updateTargetProgress();
      const isAtTopOnLoad = window.scrollY <= 8;
      if (isAtTopOnLoad) {
        targetProgressRef.current = 0;
        smoothProgressRef.current = 0;
        targetParallaxRef.current = 0;
        smoothParallaxRef.current = 0;
      } else {
        const startOffsetProgress = durationRef.current > 0 ? Math.min(1, 1 / durationRef.current) : 0;
        const adjusted = clamp(targetProgressRef.current - startOffsetProgress, 0, 1);
        targetProgressRef.current = adjusted;
        smoothProgressRef.current = adjusted;
      }
      smoothParallaxRef.current = targetParallaxRef.current;
      if (durationRef.current > 0) {
        video.currentTime = smoothProgressRef.current * durationRef.current;
      }
      const initialZoom = 1.04 + clamp((smoothProgressRef.current - 0.06) / 0.32, 0, 1) * 0.14;
      video.style.transform = `translate3d(0, ${smoothParallaxRef.current.toFixed(2)}px, 0) scale(${initialZoom.toFixed(3)})`;
    };

    const onScrollOrResize = () => updateTargetProgress();

    video.addEventListener('loadedmetadata', onMetadataLoaded);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    updateTargetProgress();
    syncVideoWithScroll();

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', onMetadataLoaded);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 bg-grid">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(100deg, #05070b 0%, #04060a 38%, #030406 62%, #010102 82%, #000000 100%)'
        }}
      />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-6 xl:col-span-5">
            <p className="eyebrow mb-5">NOVA CATEGORIA TECNOLÓGICA</p>
            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl text-white leading-[1.03] tracking-tight mb-7">
              Planilhas não escalam empresas.
              <br />
              <span className="text-gradient-animated">Sistemas</span> sim.
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-[1.86] mb-10">
              A EpicByte constrói o sistema operacional das empresas modernas. Integramos dados, processos e decisões
              em uma arquitetura inteligente preparada para escalar negócios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={(e) => scrollToId(e, '#contato')}
                className="group bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 text-slate-950 px-7 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_14px_40px_rgba(56,189,248,0.35)]"
              >
                Agendar diagnóstico estratégico – 30 minutos
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={(e) => scrollToId(e, '#abordagem')}
                className="px-7 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.12em] text-slate-100 border border-white/25 bg-white/[0.02] hover:bg-white/[0.07] hover:shadow-[0_0_32px_rgba(56,189,248,0.18)] transition-all"
              >
                Ver como funciona
              </button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 xl:col-span-7 lg:flex lg:justify-end" delayMs={120}>
            <div className="relative w-full max-w-[22rem] sm:max-w-[25rem] md:max-w-[28rem] lg:max-w-[30rem] xl:max-w-[32rem] aspect-[9/16] overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover [object-position:58%_center] pointer-events-none will-change-transform"
                style={{
                  maskImage:
                    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 100%)'
                }}
                src={`/media/promo.mp4?v=${MEDIA_VERSION}`}
                muted
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/30 to-black/58 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/44 via-transparent to-black/30 pointer-events-none" />
              <div
                className="absolute inset-y-0 left-0 w-[36%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.62) 46%, rgba(0,0,0,0) 100%)'
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-[42%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.48) 46%, rgba(0,0,0,0.18) 74%, rgba(0,0,0,0) 100%)'
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[44%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.5) 44%, rgba(0,0,0,0.2) 72%, rgba(0,0,0,0) 100%)'
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-[52%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 34%, rgba(0,0,0,0.58) 62%, rgba(0,0,0,0) 100%)'
                }}
              />

              <div
                ref={circuitLayerRef}
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(56,189,248,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.14) 1px, transparent 1px)',
                  backgroundSize: '42px 42px, 42px 42px',
                  maskImage: 'radial-gradient(circle at 70% 45%, black 30%, transparent 75%)'
                }}
              />
              <div
                ref={interfaceLayerRef}
                className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
              >
                <div className="absolute top-[19%] right-[14%] w-36 h-[1px] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                <div className="absolute top-[34%] right-[11%] w-44 h-[1px] bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
                <div className="absolute top-[51%] right-[12%] w-40 h-[1px] bg-gradient-to-r from-violet-300/0 via-violet-300/70 to-violet-300/0" />
                <div className="absolute bottom-[22%] left-[12%] w-28 h-[1px] bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
              </div>

              <div
                ref={metricCardARef}
                className="absolute top-6 right-3 sm:top-7 sm:right-4 md:top-8 md:right-5 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-2.5 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">Data reliability</p>
                <p className="text-white font-display text-xl leading-tight">99.4%</p>
              </div>
              <div
                ref={metricCardBRef}
                className="absolute top-[51%] left-2 sm:left-3 md:top-[49%] md:left-4 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-2.5 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">Process automation</p>
                <p className="text-white font-display text-xl leading-tight">+72%</p>
              </div>
              <div
                ref={metricCardCRef}
                className="absolute bottom-7 right-3 sm:bottom-8 sm:right-4 md:bottom-10 md:right-5 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-2.5 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">Operational response</p>
                <p className="text-white font-display text-xl leading-tight">-38%</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const LiveOpsStrip: React.FC = () => (
  <section className="pb-12 md:pb-14">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
      <div className="grid lg:grid-cols-12 gap-5">
        <Reveal className="lg:col-span-4" delayMs={40}>
        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.14em] mb-2">Pipeline ativo</p>
          <div className="space-y-2">
            {['Captação de lead', 'Qualificação automática', 'Proposta gerada', 'Cobrança sincronizada'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-300 text-[13px] bg-white/[0.04] rounded-lg px-3 py-1.5">
                <CheckCircle2 size={14} className="text-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        <Reveal className="lg:col-span-4" delayMs={100}>
        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.14em] mb-2">Fluxo de dados</p>
          <div className="space-y-3">
            <div className="h-1.5 rounded bg-white/10 overflow-hidden"><div className="h-full w-[82%] bg-gradient-to-r from-cyan-300 to-cyan-400" /></div>
            <div className="h-1.5 rounded bg-white/10 overflow-hidden"><div className="h-full w-[68%] bg-gradient-to-r from-blue-300 to-blue-400" /></div>
            <div className="h-1.5 rounded bg-white/10 overflow-hidden"><div className="h-full w-[90%] bg-gradient-to-r from-violet-300 to-violet-400" /></div>
          </div>
          <p className="text-slate-500 text-[11px] mt-3">Sincronizacao continua entre sistemas e times.</p>
        </div>
        </Reveal>

        <Reveal className="lg:col-span-4" delayMs={160}>
        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.14em] mb-2">Engine status</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/[0.04] p-2.5">
              <p className="text-slate-500 text-[11px] uppercase">Process jobs</p>
              <p className="font-display text-white text-xl">1.284</p>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2.5">
              <p className="text-slate-500 text-[11px] uppercase">Latency</p>
              <p className="font-display text-white text-xl">148ms</p>
            </div>
          </div>
          <p className="text-slate-500 text-[11px] mt-3">Operação representada como sistema em funcionamento.</p>
        </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const StructuralProblem: React.FC = () => {
  const pains = [
    'Dados espalhados em planilhas e ferramentas isoladas',
    'Retrabalho constante por falta de integração entre áreas',
    'Dependencia de pessoas específicas para processos críticos',
    'Decisões lentas por informações atrasadas',
    'Crescimento desorganizado e perda de eficiencia operacional'
  ];

  return (
    <section id="problema" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow mb-4">Problema estrutural das empresas modernas</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-5xl mb-5">
            Empresas crescem rápido, mas operações fragmentadas quebram a escala.
          </h2>
          <p className="text-slate-400 max-w-4xl text-lg">
            O gargalo não esta na equipe. Esta na falta de uma arquitetura operacional inteligente.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal delayMs={60}>
          <div className="glass rounded-3xl p-7 md:p-9">
            <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
              <AlertTriangle size={20} className="text-rose-300" /> Dores reais
            </h3>
            <ul className="space-y-4">
              {pains.map((pain) => (
                <li key={pain} className="text-slate-300 flex gap-3 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-300 shrink-0" />
                  {pain}
                </li>
              ))}
            </ul>
          </div>
          </Reveal>

          <Reveal delayMs={120}>
          <div className="rounded-3xl p-7 md:p-9 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10">
            <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
              <LineChart size={20} className="text-amber-300" /> Efeito sistêmico
            </h3>
            <div className="space-y-4">
              {[
                'Custos crescem sem ganho proporcional de capacidade',
                'Baixa previsibilidade financeira e operacional',
                'Gestao toma decisões com atraso e baixa confianca'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-200 leading-relaxed">
                  <ChevronRight size={18} className="text-amber-300 shrink-0 mt-1" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-400 mt-7">Resultado: mais esforco manual e menos escala real.</p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const NewApproach: React.FC = () => {
  const benefits = [
    { title: 'Centralizacao de dados', description: 'Fonte unica de verdade para toda a operação.', icon: <Database size={20} /> },
    { title: 'Automação de processos', description: 'Execução automatizada de rotinas repetitivas.', icon: <Workflow size={20} /> },
    { title: 'Previsibilidade financeira', description: 'Visao clara de caixa, margem e performance.', icon: <Wallet size={20} /> },
    { title: 'Rastreabilidade operacional', description: 'Eventos críticos auditaveis ponta a ponta.', icon: <GitBranch size={20} /> },
    { title: 'Escalabilidade sem custo proporcional', description: 'Crescimento com estrutura, não com caos.', icon: <BarChart3 size={20} /> }
  ];

  return (
    <section id="abordagem" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">Nova categoria: Business Operating System</p>
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight mb-6">
              Estrutura Digital Empresarial para empresas que querem escalar com precisao.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              A EpicByte projeta a camada de arquitetura que organiza dados, processos e decisões como
              um sistema operacional corporativo.
            </p>
          </Reveal>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delayMs={50 + index * 70}>
              <div className="glass rounded-2xl p-6 border-white/10 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArchitectureSection: React.FC = () => {
  const sources = ['CRM', 'ERP', 'Planilhas', 'Apps internos', 'Vendas', 'WhatsApp', 'Financeiro'];

  return (
    <section id="arquitetura" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Arquitetura tecnológica viva</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-5xl mb-6">
            Sistemas empresariais conectados por uma infraestrutura central: <span className="text-gradient">Epic Core Engine</span>.
          </h2>
          <p className="text-slate-400 text-lg max-w-4xl mb-12">
            CRM, ERP, planilhas, apps e canais de comunicacao deixam de ser ilhas. Tudo passa por uma
            camada de inteligencia que orquestra fluxos e dados em tempo real.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <Reveal className="lg:col-span-4" delayMs={40}>
          <div className="grid grid-cols-2 gap-3">
            {sources.map((source) => (
              <div key={source} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-slate-200 text-sm">
                {source}
              </div>
            ))}
          </div>
          </Reveal>

          <Reveal className="lg:col-span-4" delayMs={90}>
            <div className="glass rounded-3xl p-7 border-cyan-300/30">
              <div className="flex items-center gap-3 mb-4 text-cyan-200">
                <Network size={20} />
                <p className="text-xs uppercase tracking-[0.15em]">Camada central de inteligencia</p>
              </div>
              <h3 className="font-display text-2xl text-white mb-3">Epic Core Engine</h3>
              <p className="text-slate-300 leading-relaxed mb-5">
                Conecta sistemas, sincroniza eventos e padroniza processos de operação.
              </p>
              <div className="space-y-2">
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[86%] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 animate-pulse" /></div>
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[74%] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 animate-pulse" /></div>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-4 space-y-3" delayMs={140}>
            {['Dados unificados', 'Processos orquestrados', 'Decisão em tempo real', 'Operação auditavel'].map((item) => (
              <div key={item} className="glass rounded-xl px-4 py-3 text-slate-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-cyan-300" />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Proof: React.FC = () => {
  const metrics = [
    { value: '-63%', label: 'redução média de retrabalho operacional' },
    { value: '+41%', label: 'aumento de produtividade de times' },
    { value: '99,4%', label: 'confiabilidade de dados críticos' }
  ];

  return (
    <section id="prova" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Prova de engenharia aplicada</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-4xl mb-12">
            Indicadores de impacto operacional validando engenharia em cenarios reais.
          </h2>
        </Reveal>

        <div className="grid xl:grid-cols-12 gap-6">
          <Reveal className="xl:col-span-5" delayMs={50}>
          <div className="glass rounded-3xl p-7 md:p-8">
            <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
              <Target size={20} className="text-cyan-300" /> Impacto mensuravel
            </h3>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-3xl font-display text-white">{metric.value}</p>
                  <p className="text-slate-400 text-sm uppercase tracking-[0.08em] mt-1">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          <div className="xl:col-span-7 grid md:grid-cols-3 gap-5">
            <Reveal delayMs={90}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-cyan-300 mb-4">
                <Radar size={18} />
                <p className="text-xs uppercase tracking-[0.14em]">Dashboard operacional</p>
              </div>
              <div className="space-y-3">
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[84%] bg-cyan-300" /></div>
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[67%] bg-blue-300" /></div>
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[91%] bg-violet-300" /></div>
              </div>
            </div>
            </Reveal>

            <Reveal delayMs={130}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-cyan-300 mb-4">
                <GitBranch size={18} />
                <p className="text-xs uppercase tracking-[0.14em]">Pipeline de processos</p>
              </div>
              <div className="space-y-2">
                {['Intake', 'Regra de negócio', 'Orquestracao', 'Entrega'].map((step) => (
                  <div key={step} className="text-slate-300 text-sm rounded-lg bg-white/5 px-3 py-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-300" /> {step}
                  </div>
                ))}
              </div>
            </div>
            </Reveal>

            <Reveal delayMs={170}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-cyan-300 mb-4">
                <ClipboardList size={18} />
                <p className="text-xs uppercase tracking-[0.14em]">Interface de operação</p>
              </div>
              <div className="space-y-2">
                {['Job #8421', 'SLA 04:22', 'Sync financeiro', 'Status: healthy'].map((line) => (
                  <div key={line} className="rounded-lg bg-white/5 px-3 py-2 text-slate-300 text-sm">{line}</div>
                ))}
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Ecosystem: React.FC = () => {
  const systems: Array<{
    id: string;
    name: string;
    title: string;
    subtitle: string;
    cta: string;
    metrics: string[];
    stat: string;
    videoSrc?: string;
  }> = [
    {
      id: 'korden',
      name: 'KORDEN',
      title: 'Controle total da sua vida financeira.',
      subtitle: 'Receitas, despesas, investimentos e planejamento em um só lugar.',
      cta: 'Conhecer Korden',
      metrics: ['Receitas sincronizadas', 'Previsão de caixa', 'Evolução patrimonial'],
      stat: '+28% de organização financeira'
    },
    {
      id: 'meushape',
      name: 'MEUSHAPE',
      title: 'Sua evolução física, com inteligência.',
      subtitle: 'Treinos, nutrição e análise corporal.',
      cta: 'Conhecer MeuShape',
      metrics: ['Registro de treino', 'Meta nutricional', 'Gráfico de evolução'],
      stat: '+34% de consistência em rotina',
      videoSrc: `/media/meushape.mp4?v=${MEDIA_VERSION}`
    },
    {
      id: 'essencia',
      name: 'ESSÊNCIA DOS LIVROS',
      title: 'Histórias que você vive, lê e escuta.',
      subtitle: 'Conteúdo em leitura dinâmica, áudio e experiência interativa.',
      cta: 'Explorar biblioteca',
      metrics: ['Leitura no tablet', 'Modo audiobook', 'Resumo visual animado'],
      stat: '+52% de consumo de conteúdo',
      videoSrc: `/media/essencia.mp4?v=${MEDIA_VERSION}`
    },
    {
      id: 'quality-lens',
      name: 'QUALITY LENS',
      title: 'Inteligência para qualidade industrial.',
      subtitle: 'Paquímetro, CMM, tolerância e análise de qualidade em uma visão única.',
      cta: 'Ver solução industrial',
      metrics: ['Controle metrológico', 'Análise de tolerância', 'Rastreabilidade de inspeção'],
      stat: '-41% de não conformidades'
    }
  ];

  return (
    <section id="tecnologia" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Ecossistema tecnológico EpicByte</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-5xl mb-12">
            Produtos reais que comprovam capacidade de construir sistemas complexos e escaláveis.
          </h2>
        </Reveal>

        <div className="space-y-8">
          {systems.map((system, index) => (
            <Reveal key={system.id} delayMs={40 + index * 60}>
              <article
                className={`glass rounded-[2rem] border-white/10 ${system.videoSrc ? 'overflow-hidden p-0' : 'p-6 md:p-8 lg:p-10'}`}
              >
                <div className={`grid lg:grid-cols-12 ${system.videoSrc ? 'gap-0 items-stretch' : 'gap-8 items-center'}`}>
                  <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-2' : ''} ${system.videoSrc ? 'p-6 md:p-8 lg:p-10' : ''}`}>
                    <p className="text-cyan-200 text-xs uppercase tracking-[0.18em] mb-4">{system.name}</p>
                    <h3 className="font-display text-2xl md:text-4xl text-white leading-tight mb-4">{system.title}</h3>
                    <p className="text-slate-300 md:text-lg leading-relaxed mb-6">{system.subtitle}</p>
                    <div className="space-y-2 mb-6">
                      {system.metrics.map((metric) => (
                        <div key={metric} className="rounded-lg bg-white/5 px-3 py-2 text-slate-200 text-sm flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-cyan-300" /> {metric}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-cyan-300/20 via-blue-400/15 to-violet-400/20 border border-white/10 px-4 py-3 mb-6">
                      <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-1">Indicador de impacto</p>
                      <p className="font-display text-white text-xl">{system.stat}</p>
                    </div>
                    <button className="bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-[0.14em] hover:bg-cyan-300 transition-colors">
                      {system.cta}
                    </button>
                  </div>

                  <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {system.videoSrc ? (
                      <ScrollScrubVideo src={system.videoSrc} className="h-80 md:h-96 lg:h-full lg:min-h-[28rem] w-full" />
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-slate-400 text-xs uppercase tracking-[0.14em]">Cena operacional</p>
                          <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Ativo
                          </span>
                        </div>
                        <div className="space-y-2 mb-5">
                          {system.metrics.map((metric) => (
                            <div key={metric} className="rounded-lg bg-white/5 px-3 py-2 text-slate-200 text-sm flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-cyan-300" /> {metric}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-cyan-300/20 via-blue-400/15 to-violet-400/20 border border-white/10 px-4 py-3">
                          <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-1">Indicador de impacto</p>
                          <p className="font-display text-white text-xl">{system.stat}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechnicalCapability: React.FC = () => {
  const capabilities = [
    {
      title: 'Automação operacional corporativa',
      description: 'Fluxos críticos com rastreabilidade, governanca e confiabilidade.',
      icon: <Workflow size={20} />
    },
    {
      title: 'Sistemas inteligentes baseados em dados',
      description: 'Motores de decisão para reduzir operação manual e acelerar resposta.',
      icon: <Database size={20} />
    },
    {
      title: 'Plataformas SaaS completas',
      description: 'Arquitetura full-stack para produtos de missao critica.',
      icon: <Cpu size={20} />
    },
    {
      title: 'Engenharia de software de alta performance',
      description: 'Infraestrutura robusta para suportar crescimento empresarial.',
      icon: <Rocket size={20} />
    }
  ];

  return (
    <section id="capacidade" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Capacidade tecnica</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-5xl mb-12">
            Construimos infraestrutura digital para operações críticas, não apenas software isolado.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delayMs={40 + index * 60}>
            <div className="glass rounded-2xl p-6 border-white/10">
              <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-4">
                {capability.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{capability.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{capability.description}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Method: React.FC = () => {
  const steps = [
    { title: 'Diagnóstico da operação', description: 'Mapeamos gargalos e fricções estruturais.', icon: <ScanSearch size={20} /> },
    { title: 'Arquitetura da estrutura digital', description: 'Desenhamos o business operating system ideal.', icon: <Database size={20} /> },
    { title: 'Desenvolvimento de alto nivel', description: 'Implementamos com engenharia robusta e escalavel.', icon: <Cpu size={20} /> },
    { title: 'Implantacao assistida', description: 'Acompanhamos transicao sem ruptura operacional.', icon: <Rocket size={20} /> },
    { title: 'Operação evolutiva', description: 'Evoluimos o sistema com o crescimento do negócio.', icon: <Repeat size={20} /> }
  ];

  return (
    <section id="metodo" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Método de implementação</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-4xl mb-12">
            Cinco etapas para transformar operação manual em infraestrutura digital escalavel.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
          {steps.map((step, index) => (
            <Reveal key={step.title} delayMs={40 + index * 55}>
            <div className="glass rounded-2xl p-6 border-white/10">
              <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <p className="text-cyan-200 text-xs uppercase tracking-[0.14em] mb-2">Etapa {index + 1}</p>
              <h3 className="text-white font-semibold mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Transformation: React.FC = () => {
  const before = [
    'Controles espalhados e baixa visibilidade operacional',
    'Decisões baseadas em achismo e informacao atrasada',
    'Dependencia de pessoas específicas para tarefas críticas',
    'Crescimento desorganizado e operação reativa'
  ];

  const after = [
    'Operação centralizada em arquitetura unica',
    'Processos automatizados e auditaveis',
    'Dados confiáveis em tempo real para decisão',
    'Crescimento estruturado e escalavel'
  ];

  return (
    <section id="transformacao" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Transformacao operacional</p>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight max-w-4xl mb-12">
            Antes e depois da implantação da infraestrutura EpicByte.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal delayMs={60}>
          <div className="rounded-3xl border border-rose-300/20 bg-rose-300/5 p-7">
            <h3 className="text-rose-200 font-semibold text-xl mb-5">Antes</h3>
            <div className="space-y-3">
              {before.map((item) => (
                <div key={item} className="text-slate-300 flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-300 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          </Reveal>

          <Reveal delayMs={120}>
          <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/5 p-7">
            <h3 className="text-cyan-200 font-semibold text-xl mb-5">Depois</h3>
            <div className="space-y-3">
              {after.map((item) => (
                <div key={item} className="text-slate-200 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyan-300 shrink-0 mt-1" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC = () => (
  <section id="contato" className="py-20 md:py-28 scroll-mt-24">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
      <Reveal>
      <div className="rounded-[2rem] md:rounded-[3rem] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/10 p-8 md:p-14 text-center">
        <p className="eyebrow mb-4 text-cyan-100">Seção final de conversão</p>
        <h2 className="font-display text-3xl md:text-6xl text-white leading-tight mb-6">
          Empresas não precisam trabalhar mais para crescer. Precisam estruturar melhor sua operação.
        </h2>
        <p className="text-slate-200 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-10">
          Agende um diagnóstico estratégico gratuito de 30 minutos para identificar onde automação e
          arquitetura digital podem transformar sua capacidade de escala.
        </p>
        <button className="bg-cyan-300 text-slate-950 px-8 md:px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.14em] hover:bg-cyan-200 transition-colors inline-flex items-center gap-2">
          Quero meu diagnóstico estratégico
          <ShieldCheck size={18} />
        </button>
      </div>
      </Reveal>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="py-12 border-t border-white/10">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <p className="font-display text-white text-xl tracking-tight uppercase">EPICBYTE</p>
        <p className="text-slate-400 text-sm mt-2">
          Engenharia para construir a infraestrutura digital das empresas modernas.
        </p>
      </div>
      <p className="text-slate-500 text-xs uppercase tracking-[0.16em]">contato@epicbyte.tech</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <LiveOpsStrip />
        <StructuralProblem />
        <NewApproach />
        <ArchitectureSection />
        <Proof />
        <Ecosystem />
        <TechnicalCapability />
        <Method />
        <Transformation />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
