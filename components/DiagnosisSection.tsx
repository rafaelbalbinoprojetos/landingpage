import React from 'react';
import ConsultationChat from './diagnosis/ConsultationChat';
import Reveal from './Reveal';

const DiagnosisSection: React.FC = () => (
  <section id="briefing" className="eb-section relative scroll-mt-16 overflow-hidden bg-night text-snow">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mist-2/10 to-transparent" />
    <div className="pointer-events-none absolute left-1/2 top-24 h-[34rem] w-[60rem] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.18),transparent)]" />
    <div className="shell relative">
      <Reveal className="mb-12 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eb-kicker mb-4 text-ion">Briefing com IA</p>
          <h2 className="eb-title">
            Conte o que <span className="eb-grad">precisa resolver.</span>
          </h2>
        </div>
        <p className="max-w-lg text-lg leading-relaxed text-fog lg:col-span-4 lg:col-start-9 lg:self-end">
          Uma IA conduz o levantamento por texto ou áudio. Em cerca de 7 minutos, você recebe uma proposta inicial para
          baixar ou nos enviar.
        </p>
      </Reveal>

      <Reveal delayMs={80}>
        <ConsultationChat />
      </Reveal>
    </div>
  </section>
);

export default DiagnosisSection;
