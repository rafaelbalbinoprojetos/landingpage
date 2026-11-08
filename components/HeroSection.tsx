import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import HeroPortrait from './hero/HeroPortrait';

const HeroSection: React.FC = () => (
  <section id="topo" className="relative overflow-hidden bg-hero-bg text-hero-white">
    <HeroBackground />
    <div className="shell relative grid items-center gap-6 pb-6 lg:grid-cols-[55fr_45fr] lg:gap-10 lg:pb-0 lg:pt-6">
      <HeroContent />
      <HeroPortrait />
    </div>
  </section>
);

export default HeroSection;
