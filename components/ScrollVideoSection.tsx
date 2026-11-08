import React, { useEffect, useRef } from 'react';

const VIDEO_SRC = '/media/video_dev_system.mp4?v=1';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

const NAVBAR_HEIGHT = 64;
const END_OVERSCROLL = 0.35;

// A seção rola normalmente, sem prender a página, sempre em largura total:
// a rolagem percorre o vídeo durante a passagem pela tela.
const ScrollVideoSection: React.FC = () => {
  const trackRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ambientRef = useRef<HTMLCanvasElement | null>(null);

  // Fundo desfocado a partir do quadro atual: preenche as sobras sem cortar o vídeo.
  useEffect(() => {
    const video = videoRef.current;
    const context = ambientRef.current?.getContext('2d');
    if (!video || !context) return;
    const draw = () => context.drawImage(video, 0, 0, 32, 18);
    video.addEventListener('loadeddata', draw);
    video.addEventListener('seeked', draw);
    return () => {
      video.removeEventListener('loadeddata', draw);
      video.removeEventListener('seeked', draw);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    let raf = 0;
    let time = 0;

    const tick = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      // O vídeo começa quando a seção entra pela base da tela e termina pouco depois de encostar no topo.
      const start = window.innerHeight;
      const end = NAVBAR_HEIGHT - rect.height * END_OVERSCROLL;
      const progress = clamp((start - rect.top) / (start - end));

      if (video.duration) {
        // A margem final evita buscar além do último quadro decodificável.
        const target = progress * Math.max(0, video.duration - 0.05);
        const diff = target - time;
        time = Math.abs(diff) < 0.004 ? target : time + diff * 0.2;
        if (!video.seeking) video.currentTime = time;
        if (time !== target) raf = requestAnimationFrame(tick);
      }
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Alguns navegadores móveis só liberam os quadros depois de um play inicial.
    video.play()?.then(() => video.pause()).catch(() => undefined);

    video.addEventListener('loadedmetadata', request);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', request);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  return (
    <section ref={trackRef} aria-label="Vídeo: desenvolvimento de sistemas" className="relative aspect-video max-h-[calc(100svh-4rem)] w-full scroll-mt-16 bg-night">
      <div className="flex h-full items-center justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#1f0a3f]">
          <canvas
            ref={ambientRef}
            width={32}
            height={18}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-125 blur-2xl"
          />
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="relative h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ScrollVideoSection;
