import React, { forwardRef, useEffect, useRef, useState } from 'react';

const ROBOT_SRC = '/media/robo.webp';
const MAX_PARALLAX_PX = 10;

// O elemento encaminhado marca o peito do robô, de onde a energia sai.
const EpicByteRobot = forwardRef<HTMLSpanElement>((_, originRef) => {
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = parallaxRef.current;
    const allowed = window.matchMedia(
      '(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    ).matches;
    if (!node || !allowed) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
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
    <div className="relative mx-auto aspect-[1080/1024] w-full max-w-[17rem] md:max-w-[21rem] lg:max-w-[30rem]">
      <span ref={originRef} className="absolute left-[57.9%] top-[53.7%] h-px w-px" aria-hidden="true" />
      <div className="xp-halo absolute inset-[6%] rounded-full" aria-hidden="true" />
      <div className="xp-ring absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />
      <div className="xp-shadow absolute bottom-[-3%] left-1/2 h-[7%] w-[46%] -translate-x-1/2 rounded-full" aria-hidden="true" />
      <div ref={parallaxRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        <div className="xp-float h-full w-full">
          {failed ? (
            <div className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-ion/40 p-6 text-center text-sm text-fog">
              Placeholder temporário: imagem do robô não encontrada em {ROBOT_SRC}
            </div>
          ) : (
            <img
              src={ROBOT_SRC}
              alt="Mascote robô da EpicByte, flutuando e sorrindo"
              width={900}
              height={853}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="xp-robot h-full w-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
});

EpicByteRobot.displayName = 'EpicByteRobot';

export default EpicByteRobot;
