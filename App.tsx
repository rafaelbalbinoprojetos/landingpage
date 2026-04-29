import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
  GitBranch,
  LineChart,
  Menu,
  Network,
  Radar,
  Repeat,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Target,
  Wallet,
  Workflow,
  X
} from 'lucide-react';
import DiagnosisSection from './components/DiagnosisSection';
import EcosystemSection from './components/EcosystemSection';
import HeroSection from './components/HeroSection';
import LiveOpsStrip from './components/LiveOpsStrip';
import LiveSystemFlowSectionBlock from './components/LiveSystemFlowSection';
import Reveal from './components/Reveal';
import ScrollScrubVideo from './components/ScrollScrubVideo';
import SectionIntro from './components/SectionIntro';
import {
  architectureSources,
  navItems,
  proofMetrics,
  transformationContent
} from './landingContent';

const MEDIA_VERSION = '2026-03-14-4';

const scrollToId = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3 shadow-2xl shadow-black/30' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12 flex justify-between items-center">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Cpu size={22} className="text-white" />
          </span>
          <span className="font-display text-white text-xl sm:text-2xl tracking-tight uppercase">
            EPIC<span className="text-cyan-300">BYTE</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToId(e, item.href)}
              className="text-xs uppercase tracking-[0.18em] text-slate-300/90 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={(e) => scrollToId(e, '#contato')}
            className="bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-cyan-300 transition-colors"
          >
            Diagnóstico 30 min
          </button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg border border-white/10 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 sm:px-8 xl:px-12 pt-4 pb-6">
          <div className="glass rounded-2xl p-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  scrollToId(e, item.href);
                }}
                className="text-slate-100 py-2 border-b border-white/5 last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                scrollToId(e, '#contato');
              }}
              className="bg-cyan-400 text-slate-950 mt-2 py-3 rounded-xl font-semibold"
            >
              Agendar diagnóstico
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const StructuralProblem: React.FC = () => {
  const pains = [
    'Dados espalhados em planilhas e ferramentas isoladas',
    'Retrabalho constante entre áreas',
    'Dependência de pessoas para processos críticos',
    'Decisões lentas por falta de informação confiável',
    'Crescimento desorganizado'
  ];

  return (
    <section id="problema" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal className="mb-12 md:mb-16">
          <SectionIntro
            eyebrow="Problema estrutural"
            title="Empresas crescem rápido. Mas a operação quebra."
            description="O problema não está na equipe. Está na falta de uma arquitetura operacional."
            titleClassName="max-w-5xl mb-5"
            descriptionClassName="max-w-4xl text-slate-400"
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal delayMs={60}>
            <div className="glass rounded-3xl p-7 md:p-9">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <AlertTriangle size={20} className="text-rose-300" /> Dores reais
              </h3>
              <ul className="space-y-4">
                {pains.map((pain) => (
                  <li key={pain} className="text-slate-300 flex gap-3 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-300 shrink-0" />
                    {pain}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-3xl p-7 md:p-9 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <LineChart size={20} className="text-amber-300" /> Efeito sistêmico
              </h3>
              <div className="space-y-4">
                {[
                  'Custos aumentam sem ganho proporcional',
                  'Baixa previsibilidade financeira',
                  'Gestão perde controle da operação',
                  'Mais esforço manual, menos escala'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-200 leading-relaxed">
                    <ChevronRight size={18} className="text-amber-300 shrink-0 mt-1" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const NewApproach: React.FC = () => {
  const benefits = [
    { title: 'Dados centralizados', description: 'Uma base operacional confiável para todas as áreas.', icon: <Database size={20} /> },
    { title: 'Processos automatizados', description: 'Regras e handoffs executados sem retrabalho manual.', icon: <Workflow size={20} /> },
    { title: 'Decisão rastreável', description: 'Contexto e histórico para agir com mais controle.', icon: <GitBranch size={20} /> },
    { title: 'Previsibilidade financeira', description: 'Operação e caixa caminhando dentro do mesmo sistema.', icon: <Wallet size={20} /> }
  ];

  return (
    <section id="abordagem" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <div className="grid xl:grid-cols-12 gap-8 items-start">
          <Reveal className="xl:col-span-5">
            <SectionIntro
              eyebrow="Nova categoria: Business Operating System"
              title="A EpicByte cria a camada que conecta toda a operação da empresa em um sistema único."
              description="Estrutura digital empresarial para empresas que precisam escalar com controle, contexto e previsibilidade."
              titleClassName="mb-6"
            />
            <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="font-display text-xl text-white leading-snug">
                ERP registra. CRM vende. A EpicByte faz sua empresa operar.
              </p>
            </div>
          </Reveal>

          <div className="xl:col-span-7 grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delayMs={50 + index * 70}>
                <div className="glass rounded-2xl p-6 border-white/10 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArchitectureSection: React.FC = () => {
  return (
    <section id="arquitetura" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal className="mb-12">
          <SectionIntro eyebrow="Epic Core Engine" title="Epic Core Engine" />
          <div className="max-w-5xl">
            <h3 className="font-display text-3xl md:text-5xl text-white leading-tight mb-4">
              O cérebro que faz sua empresa funcionar como um sistema.
            </h3>
            <p className="text-lg leading-relaxed text-slate-400 max-w-4xl">
              Conecta sistemas, sincroniza eventos, padroniza processos e transforma dados em decisões rastreáveis.
            </p>
          </div>
        </Reveal>

        <div className="grid xl:grid-cols-12 gap-6 items-center">
          <Reveal className="xl:col-span-4" delayMs={40}>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
              {architectureSources.map((source) => (
                <div key={source} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-slate-200 text-sm">
                  {source}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="xl:col-span-4" delayMs={90}>
            <div className="glass rounded-3xl p-7 border-cyan-300/30">
              <div className="flex items-center gap-3 mb-4 text-cyan-200">
                <Network size={20} />
                <p className="text-xs uppercase tracking-[0.15em]">Camada central de inteligencia</p>
              </div>
              <h3 className="font-display text-2xl text-white mb-3">Epic Core Engine</h3>
              <p className="text-slate-100 text-lg leading-relaxed mb-3">
                O cérebro que faz sua empresa funcionar como um sistema.
              </p>
              <p className="text-slate-400 leading-relaxed mb-5">
                Conecta sistemas, sincroniza eventos, padroniza processos e transforma dados em decisões rastreáveis.
              </p>
              <div className="space-y-2">
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[86%] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 animate-pulse" /></div>
                <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[74%] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 animate-pulse" /></div>
              </div>
            </div>
          </Reveal>

          <Reveal className="xl:col-span-4 space-y-3" delayMs={140}>
            {['Dados unificados', 'Processos orquestrados', 'Decisão em tempo real', 'Operação auditavel'].map((item) => (
              <div key={item} className="glass rounded-xl px-4 py-3 text-slate-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-cyan-300" />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Proof: React.FC = () => {
  return (
    <section id="prova" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <SectionIntro
            eyebrow="Prova de engenharia aplicada"
            title="Indicadores com contexto operacional, apresentados como exemplos de impacto mensurável."
            titleClassName="max-w-4xl mb-12"
          />
        </Reveal>

        <div className="grid 2xl:grid-cols-12 gap-6">
          <Reveal className="2xl:col-span-5" delayMs={50}>
            <div className="glass rounded-3xl p-7 md:p-8">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                <Target size={20} className="text-cyan-300" /> Impacto mensurável
              </h3>
              <div className="space-y-4">
                {proofMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-3xl font-display text-white">{metric.value}</p>
                    <p className="text-slate-200 text-sm uppercase tracking-[0.08em] mt-1">{metric.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{metric.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Os indicadores acima representam exemplos de impacto operacional mensurável em cenários onde a EpicByte
                estrutura dados, regras e execução sobre uma mesma arquitetura.
              </p>
            </div>
          </Reveal>

          <div className="2xl:col-span-7 grid sm:grid-cols-2 2xl:grid-cols-3 gap-5">
            <Reveal delayMs={90}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-cyan-300 mb-4">
                  <Radar size={18} />
                  <p className="text-xs uppercase tracking-[0.14em]">Dashboard operacional</p>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[84%] bg-cyan-300" /></div>
                  <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[67%] bg-blue-300" /></div>
                  <div className="h-2 rounded bg-white/10 overflow-hidden"><div className="h-full w-[91%] bg-violet-300" /></div>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={130}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-cyan-300 mb-4">
                  <GitBranch size={18} />
                  <p className="text-xs uppercase tracking-[0.14em]">Pipeline de processos</p>
                </div>
                <div className="space-y-2">
                  {['Intake', 'Regra de negócio', 'Orquestracao', 'Entrega'].map((step) => (
                    <div key={step} className="text-slate-300 text-sm rounded-lg bg-white/5 px-3 py-2 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-cyan-300" /> {step}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={170}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-cyan-300 mb-4">
                  <ClipboardList size={18} />
                  <p className="text-xs uppercase tracking-[0.14em]">Interface de operação</p>
                </div>
                <div className="space-y-2">
                  {['Job #8421', 'SLA 04:22', 'Sync financeiro', 'Status: healthy'].map((line) => (
                    <div key={line} className="rounded-lg bg-white/5 px-3 py-2 text-slate-300 text-sm">{line}</div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const AudienceQualification: React.FC = () => (
  <section id="qualificacao" className="py-20 md:py-28 scroll-mt-24">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
      <Reveal className="mb-12">
        <SectionIntro
          eyebrow="Qualificação de demanda"
          title="Para quem é - e para quem não é."
          description="A EpicByte estrutura operações complexas com múltiplas ferramentas, dependências entre áreas e necessidade real de escala."
          titleClassName="max-w-5xl mb-6"
          descriptionClassName="max-w-4xl"
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal delayMs={50}>
          <div className="glass rounded-[2rem] p-7 md:p-8 border-cyan-300/20 h-full">
            <h3 className="font-display text-2xl text-white mb-6">Para quem é</h3>
            <div className="space-y-4">
              {['Empresas em crescimento', 'Operação complexa', 'Múltiplas ferramentas', 'Necessidade de escala'].map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-200">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={110}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 md:p-8 h-full">
            <h3 className="font-display text-2xl text-white mb-6">Não é para</h3>
            <div className="space-y-4">
              {['Quem quer só uma planilha', 'Operações simples', 'Sem necessidade de integração'].map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const KordenSummarySection: React.FC = () => {
  return (
    <section id="korden" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <div className="grid xl:grid-cols-12 gap-8 xl:gap-10 items-stretch">
          <Reveal className="xl:col-span-6">
            <div className="glass rounded-[2rem] border-white/10 p-7 md:p-9 h-full">
              <p className="eyebrow mb-4">KORDEN | Prova de arquitetura</p>
              <h2 className="font-display text-3xl md:text-5xl text-white leading-tight mb-6">
                Sistema financeiro integrado à operação empresarial.
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                O Korden demonstra como a EpicByte transforma movimentações financeiras em decisões operacionais claras,
                previsíveis e contínuas.
              </p>
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 mb-6">
                <p className="text-cyan-100 text-sm md:text-base">
                  Mais de 10.000 lançamentos financeiros processados automaticamente em uma mesma lógica operacional.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={() => window.open('https://www.korden.com.br', '_blank', 'noopener,noreferrer')}
                  className="w-full sm:w-auto bg-cyan-300 text-slate-950 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-[0.14em] hover:bg-cyan-200 transition-colors"
                >
                  Ver prova real
                </button>
                <button
                  onClick={(e) => scrollToId(e, '#tecnologia')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-[0.14em] text-slate-100 border border-white/20 bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
                >
                  Ver mais arquiteturas
                </button>
              </div>
              <p className="text-slate-400 text-sm">Prova aplicada de como dados financeiros podem operar como sistema.</p>
            </div>
          </Reveal>

          <Reveal className="xl:col-span-6" delayMs={100}>
            <ScrollScrubVideo
              src={`/media/korden.mp4?v=${MEDIA_VERSION}`}
              className="rounded-[2rem] border border-white/10 min-h-[22rem] md:min-h-[26rem] h-full"
              tone="blue"
            >
              <div className="relative z-10 p-6 md:p-8">
                <p className="text-cyan-200 text-xs uppercase tracking-[0.18em] mb-4">Conversa com o financeiro</p>
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/15 bg-black/25 p-4">
                    <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-2">Operação</p>
                    <p className="text-slate-100 text-sm">Qual é a margem segura para os próximos dias?</p>
                  </div>
                  <div className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 p-4">
                    <p className="text-cyan-200 text-xs uppercase tracking-[0.12em] mb-2">Engine financeiro</p>
                    <p className="text-slate-100 text-sm">Existe espaço controlado para operar até R$180 sem comprometer o fechamento.</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-black/25 p-4">
                    <p className="text-slate-300 text-xs uppercase tracking-[0.12em] mb-2">Operação</p>
                    <p className="text-slate-100 text-sm">Se o ritmo de gastos mudar hoje, o sistema responde?</p>
                  </div>
                  <div className="rounded-xl border border-cyan-300/35 bg-cyan-300/10 p-4">
                    <p className="text-cyan-200 text-xs uppercase tracking-[0.12em] mb-2">Engine financeiro</p>
                    <p className="text-slate-100 text-sm">Sim. O status é recalculado em tempo real para apoiar a próxima decisão.</p>
                  </div>
                </div>
              </div>
            </ScrollScrubVideo>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const TechnicalCapability: React.FC = () => {
  const capabilities = [
    {
      title: 'Estruturação de operações digitais',
      description: 'Desenho da camada que organiza pessoas, sistemas e decisões dentro da mesma operação.',
      icon: <Workflow size={20} />
    },
    {
      title: 'Integração de sistemas empresariais',
      description: 'CRM, financeiro, operação e dados conectados em fluxos rastreáveis.',
      icon: <Database size={20} />
    },
    {
      title: 'Automação de processos críticos',
      description: 'Handoffs e rotinas centrais executados com menos atrito e menos dependência manual.',
      icon: <Cpu size={20} />
    },
    {
      title: 'Arquitetura de dados e decisões',
      description: 'Eventos transformados em contexto operacional para agir com mais velocidade e controle.',
      icon: <Rocket size={20} />
    }
  ];

  return (
    <section id="capacidade" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <SectionIntro
            eyebrow="O que a EpicByte estrutura"
            title="Arquitetura operacional para empresas que não podem mais depender de ferramentas isoladas."
            titleClassName="max-w-5xl mb-12"
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delayMs={40 + index * 60}>
              <div className="glass rounded-2xl p-6 border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-4">
                  {capability.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{capability.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{capability.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Method: React.FC = () => {
  const steps = [
    { title: 'Diagnóstico da operação', description: 'Mapeamos gargalos, dependências e pontos de ruptura operacional.', icon: <ScanSearch size={20} /> },
    { title: 'Arquitetura da estrutura digital', description: 'Desenhamos o Business Operating System adequado ao contexto da empresa.', icon: <Database size={20} /> },
    { title: 'Implementação da camada operacional', description: 'Conectamos sistemas, regras e estados em fluxos reais de operação.', icon: <Cpu size={20} /> },
    { title: 'Implantação assistida', description: 'Acompanhamos a transição com controle sobre risco, adoção e continuidade.', icon: <Rocket size={20} /> },
    { title: 'Evolução contínua', description: 'A estrutura digital cresce junto com a complexidade do negócio.', icon: <Repeat size={20} /> }
  ];

  return (
    <section id="metodo" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <SectionIntro
            eyebrow="Método de implementação"
            title="Cinco etapas para transformar caos operacional em estrutura digital empresarial."
            titleClassName="max-w-4xl mb-12"
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
          {steps.map((step, index) => (
            <Reveal key={step.title} delayMs={40 + index * 55}>
              <div className="glass rounded-2xl p-6 border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-5">
                  {step.icon}
                </div>
                <p className="text-cyan-200 text-xs uppercase tracking-[0.14em] mb-2">Etapa {index + 1}</p>
                <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Transformation: React.FC = () => {
  return (
    <section id="transformacao" className="py-20 md:py-28 bg-white/[0.02] scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
        <Reveal>
          <SectionIntro
            eyebrow="Transformação operacional"
            title="O antes e depois de uma empresa que para de improvisar e começa a operar como sistema."
            titleClassName="max-w-4xl mb-12"
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal delayMs={60}>
            <div className="rounded-3xl border border-rose-300/20 bg-rose-300/5 p-7">
              <h3 className="text-rose-200 font-semibold text-xl mb-5">Antes</h3>
              <div className="space-y-3">
                {transformationContent.before.map((item) => (
                  <div key={item} className="text-slate-300 flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-300 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/5 p-7">
              <h3 className="text-cyan-200 font-semibold text-xl mb-5">Depois</h3>
              <div className="space-y-3">
                {transformationContent.after.map((item) => (
                  <div key={item} className="text-slate-200 flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-cyan-300 shrink-0 mt-1" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC = () => (
  <section id="contato" className="py-20 md:py-28 scroll-mt-24">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12">
      <Reveal>
        <div className="rounded-[2rem] md:rounded-[3rem] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/10 p-6 sm:p-8 md:p-14 text-center">
          <p className="eyebrow mb-4 text-cyan-100">Próximo passo</p>
          <h2 className="font-display text-3xl sm:text-4xl xl:text-6xl text-white leading-tight mb-6">
            Sua empresa está pronta para operar como um sistema?
          </h2>
          <p className="text-slate-200 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-10">
            30 minutos para entender sua operação e identificar oportunidades reais.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
            <button
              onClick={() => {
                window.location.href = 'mailto:contato@epicbyte.tech?subject=Diagnostico%20estrategico%20EpicByte';
              }}
              className="bg-cyan-300 text-slate-950 px-8 md:px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.14em] hover:bg-cyan-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              Agendar diagnóstico estratégico
              <ShieldCheck size={18} />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="py-12 border-t border-white/10">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 xl:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <p className="font-display text-white text-xl tracking-tight uppercase">EPICBYTE</p>
        <p className="text-slate-400 text-sm mt-2">
          Estrutura digital empresarial para empresas que precisam escalar com controle.
        </p>
      </div>
      <p className="text-slate-500 text-xs uppercase tracking-[0.16em]">contato@epicbyte.tech</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection mediaVersion={MEDIA_VERSION} scrollToId={scrollToId} />
        <LiveOpsStrip />
        <StructuralProblem />
        <NewApproach />
        <LiveSystemFlowSectionBlock scrollToId={scrollToId} />
        <ArchitectureSection />
        <Proof />
        <DiagnosisSection />
        <AudienceQualification />
        <KordenSummarySection />
        <EcosystemSection mediaVersion={MEDIA_VERSION} />
        <TechnicalCapability />
        <Method />
        <Transformation />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
