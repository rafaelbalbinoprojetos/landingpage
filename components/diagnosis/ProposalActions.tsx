import React, { useEffect, useState } from 'react';
import { CalendarCheck, FileDown, MessageCircle } from 'lucide-react';
import { DiagnosisProposal, LeadInfo } from './types';
import { generateProposalPdf } from './pdf/proposalPdf';

interface ProposalActionsProps {
  proposal: DiagnosisProposal;
  lead: LeadInfo | null;
  onLeadChange: (lead: LeadInfo) => void;
}

const pdfSteps = [
  'Estruturando documento...',
  'Renderizando preview...',
  'Organizando arquitetura...',
  'Inserindo timeline e indicadores...',
  'Gerando PDF estratégico...'
] as const;

const ProposalActions: React.FC<ProposalActionsProps> = ({ proposal, lead, onLeadChange }) => {
  const [notice, setNotice] = useState('');
  const [whatsapp, setWhatsapp] = useState(lead?.whatsapp || '');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStep, setPdfStep] = useState(0);

  useEffect(() => {
    if (!isGeneratingPdf) return;
    const intervalId = window.setInterval(() => {
      setPdfStep((current) => (current + 1) % pdfSteps.length);
    }, 620);

    return () => window.clearInterval(intervalId);
  }, [isGeneratingPdf]);

  const handleDownloadProposalPDF = async () => {
    setNotice('');
    setIsGeneratingPdf(true);
    setPdfStep(0);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      await generateProposalPdf(proposal, lead);
      setNotice('PDF estratégico gerado com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível gerar o PDF agora.';
      setNotice(message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendProposalWhatsApp = () => {
    if (!whatsapp.trim()) {
      setNotice('Informe seu WhatsApp para deixar o envio futuro preparado.');
      return;
    }

    onLeadChange({
      name: lead?.name || '',
      email: lead?.email || '',
      companyName: lead?.companyName || '',
      whatsapp: whatsapp.trim()
    });
    setNotice('Envio automático será ativado em breve. Por enquanto, nossa equipe pode enviar manualmente após o diagnóstico.');
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-cyan-300/25 bg-gradient-to-br from-cyan-300/14 via-blue-400/10 to-violet-400/12 p-5">
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-100">Transformar essa proposta em projeto real</p>
      <h4 className="font-display mb-2 text-2xl text-white">Validar escopo, prioridade, riscos e próximos passos</h4>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-300">
        Com o briefing inicial pronto, você pode baixar a proposta, preparar o envio por WhatsApp ou chamar a EpicByte para validar os próximos passos.
      </p>
      <div className="relative grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
        <input
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          placeholder="WhatsApp para recebimento futuro"
          inputMode="tel"
          className="rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSendProposalWhatsApp}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 hover:bg-white/[0.1]"
        >
          <MessageCircle size={15} />
          Receber proposta no WhatsApp
        </button>
        <button
          type="button"
          onClick={handleDownloadProposalPDF}
          disabled={isGeneratingPdf}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 hover:bg-white/[0.1]"
        >
          <FileDown size={15} />
          {isGeneratingPdf ? 'Gerando PDF' : 'Baixar proposta em PDF'}
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = 'mailto:contato@epicbyte.tech?subject=Diagnostico%20estrategico%20EpicByte';
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 hover:bg-cyan-200"
        >
          <CalendarCheck size={15} />
          Falar com a EpicByte
        </button>
      </div>
      {isGeneratingPdf ? (
        <div className="relative mt-5 rounded-md border border-cyan-300/20 bg-black/25 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-cyan-100">{pdfSteps[pdfStep]}</p>
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 transition-all duration-500"
              style={{ width: `${20 + pdfStep * 20}%` }}
            />
          </div>
        </div>
      ) : null}
      {notice ? <p className="mt-4 text-sm leading-relaxed text-cyan-100">{notice}</p> : null}
    </div>
  );
};

export default ProposalActions;
