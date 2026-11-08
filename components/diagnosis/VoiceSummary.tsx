import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Volume2 } from 'lucide-react';
import { DiagnosisProposal, LeadInfo } from './types';

interface VoiceSummaryProps {
  proposal: DiagnosisProposal;
  lead: LeadInfo | null;
}

const getProjectTypeLabel = (proposal: DiagnosisProposal) => {
  const source = `${proposal.proposalPersona || ''} ${proposal.projectCategory || ''}`.toLowerCase();
  if (source.includes('athlete') || source.includes('artist') || source.includes('marca pessoal')) return 'presença digital';
  if (source.includes('clinic') || source.includes('clínica') || source.includes('clinica')) return 'experiência premium da clínica';
  if (source.includes('law') || source.includes('advocacia')) return 'posicionamento institucional';
  if (source.includes('dashboard') || source.includes('bi')) return 'dashboard estratégico';
  if (source.includes('automation') || source.includes('system') || source.includes('industrial')) return 'sistema';
  if (source.includes('landing') || source.includes('site')) return 'experiência digital';
  return 'projeto';
};

const buildVoiceText = (proposal: DiagnosisProposal, lead: LeadInfo | null) => {
  const firstName = lead?.name?.trim().split(/\s+/)[0] || '';
  const projectName = proposal.businessName || proposal.proposalTitle || 'projeto';
  const projectType = getProjectTypeLabel(proposal);
  const prefix = firstName ? `${firstName}, ` : '';

  if (['athlete_artist', 'personal_brand', 'landing_branding', 'luxury_brand', 'institutional_site'].includes(proposal.proposalPersona || '')) {
    return `${prefix}o briefing da ${projectType} para ${projectName} foi concluído. A proposta estratégica já está disponível na página, com narrativa, direção criativa, experiência visual e próximos passos para evoluir essa presença com padrão premium.`;
  }

  if (proposal.proposalPersona === 'clinic_premium') {
    return `${prefix}o briefing da ${projectType} para ${projectName} foi concluído. A proposta já está disponível, com jornada do paciente, experiência humanizada, agendamento, presença premium e próximos passos para validação.`;
  }

  if (proposal.proposalPersona === 'law_firm') {
    return `${prefix}o briefing do ${projectType} para ${projectName} foi concluído. A proposta já está disponível, com foco em reputação, autoridade, confiança institucional e próximos passos para validação.`;
  }

  return `${prefix}o briefing do ${projectType} ${projectName ? `para ${projectName}` : ''} foi concluído. A proposta estratégica já está disponível na página. Você pode consultar os detalhes, baixar o PDF ou agendar uma conversa para validar os próximos passos.`;
};

const VoiceSummary: React.FC<VoiceSummaryProps> = ({ proposal, lead }) => {
  const [audioSrc, setAudioSrc] = useState('');
  const [notice, setNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceText = useMemo(() => buildVoiceText(proposal, lead), [proposal, lead]);

  useEffect(() => {
    const controller = new AbortController();

    const generateVoice = async () => {
      setIsGenerating(true);
      setNotice('');
      setAudioSrc('');
      setNeedsManualPlay(false);

      try {
        const response = await fetch('/api/generate-voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: voiceText }),
          signal: controller.signal,
        });

        const data = (await response.json()) as { audioBase64?: string; contentType?: string; error?: string };
        if (!response.ok || !data.audioBase64) {
          throw new Error(data.error || 'Não foi possível gerar o resumo em áudio agora.');
        }

        setAudioSrc(`data:${data.contentType || 'audio/mpeg'};base64,${data.audioBase64}`);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Não foi possível gerar o resumo em áudio agora.';
        setNotice(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsGenerating(false);
        }
      }
    };

    void generateVoice();

    return () => controller.abort();
  }, [voiceText]);

  useEffect(() => {
    if (!audioSrc || !audioRef.current) return;

    audioRef.current.play()
      .then(() => setNeedsManualPlay(false))
      .catch(() => setNeedsManualPlay(true));
  }, [audioSrc]);

  const handlePlay = () => {
    audioRef.current?.play()
      .then(() => setNeedsManualPlay(false))
      .catch(() => setNeedsManualPlay(true));
  };

  return (
    <div className="mb-5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-300/12 text-cyan-100">
            <Volume2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Resumo em áudio da proposta</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {isGenerating ? 'Gerando confirmação por voz...' : 'Confirmação curta gerada para o fechamento do briefing.'}
            </p>
          </div>
        </div>

        {audioSrc ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <audio ref={audioRef} src={audioSrc} controls className="h-9 max-w-full" />
            {needsManualPlay ? (
              <button
                type="button"
                onClick={handlePlay}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 hover:bg-cyan-200"
              >
                <Play size={14} />
                Ouvir resumo
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {notice ? <p className="mt-3 text-xs leading-relaxed text-slate-400">{notice}</p> : null}
    </div>
  );
};

export default VoiceSummary;
