import React, { ReactNode, useEffect, useRef } from 'react';

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
      const travel = startLine - endLine + rect.height + viewport * 0.9;
      const rawProgress = (startLine - rect.top) / travel;
      let progress = clamp(rawProgress, 0, 1);

      const finalPushStart = viewport * 0.82;
      const finalPushEnd = viewport * 0.2;
      const nearExitProgress = clamp((finalPushStart - rect.bottom) / (finalPushStart - finalPushEnd), 0, 1);
      if (nearExitProgress > 0) {
        const finalSegmentStart =
          durationRef.current > 0 ? clamp((durationRef.current - 1.4) / durationRef.current, 0, 1) : 0.8;
        const boostedProgress = finalSegmentStart + (1 - finalSegmentStart) * nearExitProgress;
        progress = Math.max(progress, boostedProgress);
      }

      targetProgressRef.current = progress;
    };

    const animateScrub = () => {
      rafId = requestAnimationFrame(animateScrub);
      if (durationRef.current <= 0) return;

      const targetTime = targetProgressRef.current * durationRef.current;
      const diff = targetTime - smoothTimeRef.current;
      smoothTimeRef.current += diff * 0.2;

      if (Math.abs(diff) < 0.002) {
        smoothTimeRef.current = targetTime;
      }

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

export default ScrollScrubVideo;
