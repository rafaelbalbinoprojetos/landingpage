import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroMetrics } from '../landingContent';
import Reveal from './Reveal';

interface HeroSectionProps {
  mediaVersion: string;
  scrollToId: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mediaVersion, scrollToId }) => {
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
        <div className="grid xl:grid-cols-12 gap-10 xl:gap-14 items-center">
          <Reveal className="xl:col-span-5">
            <p className="eyebrow mb-5">NOVA CATEGORIA TECNOLÓGICA</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.03] tracking-tight mb-7">
              Planilhas não escalam empresas.
              <br />
              <span className="text-gradient-animated">Estruturas digitais</span> sim.
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-[1.86] mb-10">
              A EpicByte projeta sistemas operacionais empresariais que conectam dados, processos e decisões para
              empresas que precisam escalar com controle.
            </p>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
              Pare de operar com ferramentas isoladas. Estruture sua empresa como um sistema inteligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={(e) => scrollToId(e, '#contato')}
                className="group w-full sm:w-auto bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 text-slate-950 px-7 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_14px_40px_rgba(56,189,248,0.35)]"
              >
                Agendar diagnóstico estratégico - 30 minutos
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={(e) => scrollToId(e, '#operacao-sistema')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.12em] text-slate-100 border border-white/25 bg-white/[0.02] hover:bg-white/[0.07] hover:shadow-[0_0_32px_rgba(56,189,248,0.18)] transition-all"
              >
                Ver exemplo real funcionando
              </button>
            </div>
            <p className="mt-5 text-sm text-slate-500 max-w-xl">
              ERP registra. CRM vende. Planilhas improvisam. O Epic Core Engine opera.
            </p>
            <div className="mt-8 grid gap-3 md:hidden">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{metric.label}</p>
                  <p className="mt-1 font-display text-2xl text-white">{metric.value}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{metric.note}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="xl:col-span-7 xl:flex xl:justify-end" delayMs={120}>
            <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[30rem] xl:mx-0 xl:max-w-[32rem] aspect-[9/16] overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover [object-position:58%_center] pointer-events-none will-change-transform"
                style={{
                  maskImage:
                    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 74%, rgba(0,0,0,0) 100%)'
                }}
                src={`/media/promo.mp4?v=${mediaVersion}`}
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
                className="absolute top-6 right-3 hidden md:block sm:top-7 sm:right-4 md:top-8 md:right-5 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-3 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform max-w-[11rem]"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">{heroMetrics[0].label}</p>
                <p className="text-white font-display text-xl leading-tight">{heroMetrics[0].value}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{heroMetrics[0].note}</p>
              </div>
              <div
                ref={metricCardBRef}
                className="absolute top-[51%] left-2 hidden md:block sm:left-3 md:top-[49%] md:left-4 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-3 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform max-w-[11rem]"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">{heroMetrics[1].label}</p>
                <p className="text-white font-display text-xl leading-tight">{heroMetrics[1].value}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{heroMetrics[1].note}</p>
              </div>
              <div
                ref={metricCardCRef}
                className="absolute bottom-7 right-3 hidden md:block sm:bottom-8 sm:right-4 md:bottom-10 md:right-5 rounded-xl border border-cyan-200/20 bg-[rgba(20,30,50,0.24)] backdrop-blur-[12px] px-3.5 py-3 shadow-[0_0_25px_rgba(0,180,255,0.18)] opacity-100 will-change-transform max-w-[11rem]"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-slate-300">{heroMetrics[2].label}</p>
                <p className="text-white font-display text-xl leading-tight">{heroMetrics[2].value}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{heroMetrics[2].note}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
