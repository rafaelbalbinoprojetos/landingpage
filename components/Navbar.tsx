import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../landingContent';

export const Wordmark: React.FC = () => (
  <span className="inline-flex items-center gap-2.5">
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <rect width="16" height="4" fill="currentColor" />
      <rect y="6" width="10" height="4" fill="#22d3ee" />
      <rect y="12" width="16" height="4" fill="currentColor" />
    </svg>
    <span className="text-lg font-semibold tracking-[-0.02em]">EpicByte</span>
  </span>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night text-snow">
      <div className="shell flex h-16 items-center justify-between">
        <a href="#topo" aria-label="EpicByte, início">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-fog transition-colors hover:text-snow">
              {item.label}
            </a>
          ))}
          <a href="#briefing" className="border-b border-ion pb-0.5 text-sm font-semibold text-snow">
            Iniciar briefing
          </a>
        </nav>

        <button
          type="button"
          className="p-2 lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <nav className="shell border-t border-white/10 pb-4 lg:hidden" aria-label="Principal no celular">
          {[...navItems, { label: 'Iniciar briefing', href: '#briefing' }].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block border-b border-white/10 py-4 text-lg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
};

export default Navbar;
