import React, { useEffect, useRef } from 'react';
import HeroFloatingPanels from './HeroFloatingPanels';
import HeroHalo from './HeroHalo';

const MAX_PARALLAX_PX = 12;
const VIDEO_SRC = '/media/promo.mp4?v=2026-03-14-4';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const HeroPortrait: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // O vídeo acompanha a rolagem, com suavização, sem interferir no scroll da página.
  useEffect(() => {
    const scene = sceneRef.current;
    const video = videoRef.current;
    if (!scene || !video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let time = 0;

    const targetTime = () => {
      const rect = scene.getBoundingClientRect();
      const viewport = window.innerHeight;
      const top = rect.top + window.scrollY;
      const start = Math.max(0, top - viewport * 0.75);
      const end = Math.max(start + 300, top + rect.height - viewport * 0.2);
      return clamp((window.scrollY - start) / (end - start)) * (video.duration || 0);
    };

    const tick = () => {
      frame = 0;
      if (!video.duration) return;
      const target = targetTime();
      const diff = target - time;
      time = Math.abs(diff) < 0.004 ? target : time + diff * 0.18;
      if (!video.seeking) video.currentTime = time;
      if (time !== target) frame = requestAnimationFrame(tick);
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Alguns navegadores móveis só liberam os quadros depois de um play inicial.
    const unlock = video.play();
    unlock?.then(() => video.pause()).catch(() => undefined);

    video.addEventListener('loadedmetadata', request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', request);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  // O parallax escreve direto em variáveis CSS, sem re-renderizar o React.
  useEffect(() => {
    const scene = sceneRef.current;
    const allowed = window.matchMedia(
      '(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    ).matches;
    if (!scene || !allowed) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      scene.style.setProperty('--hero-px', `${x.toFixed(2)}px`);
      scene.style.setProperty('--hero-py', `${y.toFixed(2)}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth - 0.5) * 2 * MAX_PARALLAX_PX;
      y = (event.clientY / window.innerHeight - 0.5) * 2 * MAX_PARALLAX_PX;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-scene relative mx-auto mt-8 w-full max-w-[26rem] md:max-w-[32rem] lg:mt-0 lg:max-w-none">
      <HeroHalo />
      <div className="hero-layer-photo relative">
        <div className="hero-video-fade">
          <div className="hero-video-silhouette">
            <div className="hero-video-frame">
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster="/media/hero-portrait.webp"
                muted
                playsInline
                preload="auto"
                aria-label="Retrato em preto e branco do responsável pela EpicByte, de óculos, com a mão apoiada no queixo"
                className="hero-video"
              />
              <div className="hero-video-side-light" aria-hidden="true" />
              <div className="hero-video-lift" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <HeroFloatingPanels />
    </div>
  );
};

export default HeroPortrait;
