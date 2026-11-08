import React from 'react';

const HeroHalo: React.FC = () => (
  <div className="hero-layer-halo pointer-events-none absolute" aria-hidden="true">
    <div className="hero-halo-glow absolute inset-0 rounded-full" />
    <svg viewBox="0 0 400 400" className="hero-halo-ring absolute inset-0 h-full w-full" fill="none">
      <defs>
        <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1BC9E6" />
          <stop offset="0.55" stopColor="#397FF4" />
          <stop offset="1" stopColor="#9A72E9" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="190" stroke="url(#hero-ring)" strokeWidth="2.5" strokeDasharray="420 26 240 18 420 70" strokeLinecap="round" />
      <circle cx="200" cy="200" r="176" stroke="url(#hero-ring)" strokeWidth="0.75" strokeOpacity="0.55" strokeDasharray="3 13" />
    </svg>
    <svg viewBox="0 0 400 400" className="hero-halo-ring-reverse absolute inset-0 h-full w-full" fill="none">
      <circle cx="200" cy="200" r="198" stroke="#1BC9E6" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="60 300 24 860" />
      <circle cx="200" cy="2" r="2.5" fill="#F7F9FF" />
    </svg>
  </div>
);

export default HeroHalo;
