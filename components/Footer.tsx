import React from 'react';
import { CONTACT_EMAIL, navItems } from '../landingContent';
import { Wordmark } from './Navbar';

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 bg-night py-14 text-snow">
    <div className="shell grid gap-10 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="text-fog">Prefere conversar direto?</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="eb-title mt-3 inline-block break-all !text-[clamp(1.5rem,1.1rem+2vw,3rem)] transition-colors hover:text-ion"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
      <nav className="grid content-start gap-2 md:col-span-3 md:col-start-10" aria-label="Rodapé">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="text-fog transition-colors hover:text-ion">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-fog md:col-span-12">
        <Wordmark />
        <span>Desenvolvimento de sistemas e serviços inteligentes.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
