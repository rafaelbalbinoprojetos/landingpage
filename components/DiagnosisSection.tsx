import React, { useState } from 'react';
import { ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import SectionIntro from './SectionIntro';

const defaultInput =
  'Descreva sua operação, problemas ou processos manuais...';

type DiagnosisResult = {
  diagnosis: string;
  causes: string[];
  impacts: string[];
  architecture: string[];
  cta: string;
};

const DiagnosisSection: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: trimmedInput }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel gerar o diagnostico.');
      }

      setResult(data);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel gerar o diagnostico agora.';
      setResult(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="diagnostico-ia" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal className="mb-12">
          <SectionIntro
            eyebrow="Diagnóstico assistido"
            title="Diagnóstico estratégico com IA"
            description="Descreva o gargalo da sua operação e receba uma análise inicial sobre causas, impactos e a arquitetura sugerida."
            titleClassName="max-w-4xl mb-6"
            descriptionClassName="max-w-4xl"
          />
        </Reveal>

        <div className="grid gap-6 xl:grid-cols-12">
          <Reveal className="xl:col-span-5" delayMs={40}>
            <div className="glass rounded-[2rem] border-white/10 p-6 md:p-7 h-full">
              <div className="mb-5 flex items-center gap-3 text-cyan-200">
                <BrainCircuit size={20} />
                <p className="text-xs uppercase tracking-[0.16em]">Leitura inicial da operação</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={7}
                  placeholder={defaultInput}
                  className="w-full resize-none bg-transparent text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/50"
              >
                {isLoading ? 'Gerando diagnóstico' : 'Gerar diagnóstico'}
                <ArrowRight size={16} />
              </button>
              {error ? (
                <p className="mt-4 text-sm leading-relaxed text-rose-300">
                  {error}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="xl:col-span-7" delayMs={110}>
            <div className="glass rounded-[2rem] border-white/10 p-6 md:p-7 h-full">
              <div className="mb-5 flex items-center gap-3 text-cyan-200">
                <Sparkles size={18} />
                <p className="text-xs uppercase tracking-[0.16em]">Leitura estratégica inicial</p>
              </div>

              {result ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-2">Diagnóstico</p>
                    <p className="text-slate-100 leading-relaxed">{result.diagnosis}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-3">Causas</p>
                    <div className="space-y-3">
                      {result.causes.map((item) => (
                        <p key={item} className="text-sm leading-relaxed text-slate-300">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-3">Impactos</p>
                    <div className="space-y-3">
                      {result.impacts.map((item) => (
                        <p key={item} className="text-sm leading-relaxed text-slate-300">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 md:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100 mb-3">Arquitetura sugerida</p>
                    <div className="space-y-3">
                      {result.architecture.map((item) => (
                        <p key={item} className="text-sm leading-relaxed text-slate-100">
                          {item}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-300">
                        {result.cta}
                      </p>
                      <button
                        onClick={() => {
                          window.location.href = 'mailto:contato@epicbyte.tech?subject=Diagnostico%20estrategico%20EpicByte';
                        }}
                        className="rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-cyan-200"
                      >
                        Agendar reunião estratégica
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[22rem] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                  <div className="max-w-md">
                    <p className="font-display text-2xl text-white">Descreva a operação para iniciar a leitura.</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      O diagnóstico inicial organiza sintomas operacionais em linguagem de arquitetura, processo e decisão.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisSection;
