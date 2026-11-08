import React, { FormEvent, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadInfo } from './types';

interface LeadCaptureStepProps {
  initialLead?: LeadInfo | null;
  onContinue: (lead: LeadInfo) => void;
}

const emptyLead: LeadInfo = {
  name: '',
  whatsapp: '',
  email: '',
  companyName: ''
};

const LeadCaptureStep: React.FC<LeadCaptureStepProps> = ({ initialLead, onContinue }) => {
  const [lead, setLead] = useState<LeadInfo>(initialLead || emptyLead);

  const updateLead = (field: keyof LeadInfo, value: string) => {
    setLead((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue({
      name: lead.name.trim(),
      whatsapp: lead.whatsapp.trim(),
      email: lead.email.trim(),
      companyName: lead.companyName.trim()
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl rounded-lg border border-cyan-300/20 bg-[#07111f]/95 p-5 md:p-6"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">Personalização do material</p>
          <h3 className="font-display text-2xl leading-tight text-white">Antes de montar sua proposta completa</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Informe seus dados para deixar o documento mais personalizado. Não enviaremos WhatsApp automaticamente agora.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={lead.name}
          onChange={(event) => updateLead('name', event.target.value)}
          placeholder="Seu nome"
          className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
        <input
          value={lead.whatsapp}
          onChange={(event) => updateLead('whatsapp', event.target.value)}
          placeholder="WhatsApp"
          inputMode="tel"
          className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
        <input
          value={lead.email}
          onChange={(event) => updateLead('email', event.target.value)}
          placeholder="E-mail opcional"
          inputMode="email"
          className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
        <input
          value={lead.companyName}
          onChange={(event) => updateLead('companyName', event.target.value)}
          placeholder="Nome da empresa opcional"
          className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">
          Esses dados ficam preparados para futura geração de PDF e envio manual pela equipe.
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-cyan-200 sm:w-auto"
        >
          Continuar para proposta
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
};

export default LeadCaptureStep;
