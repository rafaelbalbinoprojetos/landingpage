import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { BrainCircuit, Mic, RotateCcw, Send, Sparkles, Square, X } from 'lucide-react';
import ConversationFlow from './ConversationFlow';
import LeadCaptureStep from './LeadCaptureStep';
import LoadingPipeline from './LoadingPipeline';
import ProposalReveal from './ProposalReveal';
import SuggestionButtons from './SuggestionButtons';
import VoiceSummary from './VoiceSummary';
import { ChatMessage, DiagnosisApiResponse, DiagnosisProposal, LeadInfo } from './types';

const starterSuggestions = [
  'Sistema interno',
  'Automatizar processo',
  'Dashboard/relatórios',
  'CRM ou atendimento',
  'App ou portal',
  'Mapear requisitos'
];

const initialAssistantMessage: ChatMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  content:
    'Conte qual necessidade você quer resolver. Eu vou conduzir um levantamento objetivo, mapear usuários, fluxo, entradas, regras e saídas antes de estruturar a proposta.'
};

const pipelineDelayMs = 3600;
const maxRecordingMs = 120000;
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const createMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content
});

const getSupportedAudioMimeType = () => {
  const options = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/wav'
  ];

  return options.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';
};

const generateConceptImage = async (proposal: DiagnosisProposal): Promise<DiagnosisProposal> => {
  try {
    console.log('Visual prompt:', proposal.visualConcept.visualPrompt);
    console.log('Calling image generation...');
    const response = await fetch('/api/diagnosis-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: proposal.visualConcept.visualPrompt })
    });

    const rawResponse = await response.text();
    console.log('Image generation HTTP status:', response.status);
    console.log('Image generation raw response:', rawResponse);

    let data: { imageDataUrl?: string | null; error?: string; reason?: string; model?: string };
    try {
      data = JSON.parse(rawResponse || '{}');
    } catch {
      data = {
        imageDataUrl: null,
        error: `Resposta inválida do endpoint de imagem. Status ${response.status}.`,
        reason: rawResponse.slice(0, 500)
      };
    }

    console.log('Image generation result:', data);
    const imageError = data.imageDataUrl
      ? null
      : [data.error, data.reason ? `Detalhe técnico: ${data.reason}` : null].filter(Boolean).join(' ');
    return {
      ...proposal,
      visualConcept: {
        ...proposal.visualConcept,
        imageDataUrl: data.imageDataUrl || null,
        imageError,
        imageModel: data.model || null,
        visualExecutiveDataUrl: data.imageDataUrl || null,
        visualOperationalDataUrl: null
      }
    };
  } catch (imageError) {
    console.error('Image generation failed:', imageError);
    return {
      ...proposal,
      visualConcept: {
        ...proposal.visualConcept,
        imageError: 'Não foi possível gerar o preview visual premium agora. A proposta textual foi preservada.'
      }
    };
  }
};

const loadStoredLead = (): LeadInfo | null => {
  try {
    const raw = window.localStorage.getItem('epicbyte:consultation-lead');
    return raw ? JSON.parse(raw) as LeadInfo : null;
  } catch {
    return null;
  }
};

const ConsultationChat: React.FC = () => {
  const runIdRef = useRef(0);
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>(starterSuggestions);
  const [progress, setProgress] = useState<DiagnosisApiResponse['progress'] | null>(null);
  const [proposal, setProposal] = useState<DiagnosisProposal | null>(null);
  const [pendingProposal, setPendingProposal] = useState<DiagnosisProposal | null>(null);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(() => loadStoredLead());
  const [isLeadCaptureVisible, setIsLeadCaptureVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);
  const [isConversationExpanded, setIsConversationExpanded] = useState(true);
  const [error, setError] = useState('');
  const [audioStatus, setAudioStatus] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const proposalRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<number | null>(null);
  const shouldTranscribeRecordingRef = useRef(true);

  const collectedAnswers = messages.filter((message) => message.role === 'user').length;
  const isCompleted = Boolean(proposal);

  const resetConversation = () => {
    runIdRef.current += 1;
    setMessages([initialAssistantMessage]);
    setInput('');
    setQuickReplies(starterSuggestions);
    setProgress(null);
    setProposal(null);
    setPendingProposal(null);
    setIsLeadCaptureVisible(false);
    setIsLoading(false);
    setIsStructuring(false);
    setIsConversationExpanded(true);
    setError('');
    setAudioStatus('');
    setIsRecordingAudio(false);
    setIsTranscribingAudio(false);
    stopActiveRecording(false);
  };

  const requestDiagnosis = async (nextMessages: ChatMessage[]) => {
    setIsLoading(true);
    setError('');
    setQuickReplies([]);

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: nextMessages.filter((message) => message.id !== initialAssistantMessage.id) })
      });

      const data = (await response.json()) as DiagnosisApiResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data?.error || 'Não foi possível continuar o diagnóstico.');
      }

      const assistantMessage = createMessage('assistant', data.assistantMessage);
      setMessages((current) => [...current, assistantMessage]);

      if (data.status === 'proposal' && data.proposal) {
        setPendingProposal(data.proposal);
        setIsLeadCaptureVisible(true);
        setIsLoading(false);
      } else {
        setQuickReplies(data.quickReplies || []);
        setProgress(data.progress || null);
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível continuar o diagnóstico agora.';
      setError(message);
      setQuickReplies(starterSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || isStructuring || proposal || pendingProposal) return;

    const userMessage = createMessage('user', trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    await requestDiagnosis(nextMessages);
  };

  const clearRecordingTimeout = () => {
    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  const releaseRecordingStream = () => {
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    if (!audioBlob.size) {
      setAudioStatus('Não consegui capturar áudio nessa gravação. Tente novamente ou digite a mensagem.');
      return;
    }

    setIsTranscribingAudio(true);
    setAudioStatus('Transcrevendo áudio...');

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('wav') ? 'wav' : 'webm';
      formData.append('audio', audioBlob, `briefing-epicbyte.${extension}`);

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData
      });

      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text?.trim()) {
        throw new Error(data.error || 'Não consegui transcrever esse áudio com segurança. Você pode tentar gravar novamente ou digitar a mensagem.');
      }

      setAudioStatus('');
      await sendMessage(data.text);
    } catch (transcriptionError) {
      const message =
        transcriptionError instanceof Error
          ? transcriptionError.message
          : 'Não consegui transcrever esse áudio com segurança. Você pode tentar gravar novamente ou digitar a mensagem.';
      setAudioStatus(message);
    } finally {
      setIsTranscribingAudio(false);
    }
  };

  const stopActiveRecording = (shouldTranscribe = true) => {
    shouldTranscribeRecordingRef.current = shouldTranscribe;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      return;
    }

    clearRecordingTimeout();
    releaseRecordingStream();
    setIsRecordingAudio(false);
  };

  const startRecording = async () => {
    if (isLoading || isStructuring || isTranscribingAudio || proposal || pendingProposal) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setAudioStatus('Seu navegador não oferece suporte à gravação de áudio. Você pode digitar a mensagem normalmente.');
      return;
    }

    try {
      setAudioStatus('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      audioChunksRef.current = [];
      shouldTranscribeRecordingRef.current = true;

      const mimeType = getSupportedAudioMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearRecordingTimeout();
        releaseRecordingStream();
        setIsRecordingAudio(false);

        const shouldTranscribe = shouldTranscribeRecordingRef.current;
        const audioType = audioChunksRef.current[0]?.type || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: audioType });
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (shouldTranscribe) {
          void transcribeAudio(audioBlob);
        }
      };

      recorder.start();
      setIsRecordingAudio(true);
      setAudioStatus('Gravando...');
      recordingTimeoutRef.current = window.setTimeout(() => {
        setAudioStatus('O áudio ficou muito longo. Tente gravar em partes menores para manter a precisão do briefing.');
        stopActiveRecording(false);
      }, maxRecordingMs);
    } catch {
      setAudioStatus('Não consegui acessar seu microfone. Verifique a permissão do navegador e tente novamente.');
      releaseRecordingStream();
      setIsRecordingAudio(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecordingAudio) {
      stopActiveRecording(true);
      return;
    }

    void startRecording();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleSuggestion = (suggestion: string) => {
    if (suggestion === 'Já respondi, gere a proposta') {
      void sendMessage(suggestion);
      return;
    }
    setInput((current) => {
      const trimmed = current.trim();
      if (!trimmed) return suggestion;
      if (trimmed.includes(suggestion)) return current;
      return `${trimmed}; ${suggestion}`;
    });
  };

  const saveLead = (lead: LeadInfo) => {
    setLeadInfo(lead);
    try {
      window.localStorage.setItem('epicbyte:consultation-lead', JSON.stringify(lead));
    } catch {
      // localStorage pode estar indisponivel em modo privado.
    }
  };

  const continueToProposal = async (lead: LeadInfo) => {
    if (!pendingProposal) return;
    const activeRunId = runIdRef.current;
    saveLead(lead);
    setIsLeadCaptureVisible(false);
    setIsStructuring(true);
    const [proposalWithImage] = await Promise.all([
      generateConceptImage(pendingProposal),
      wait(pipelineDelayMs)
    ]);
    if (activeRunId !== runIdRef.current) return;
    setProposal(proposalWithImage);
    setPendingProposal(null);
    setIsStructuring(false);
    setIsConversationExpanded(false);
  };

  useEffect(() => {
    const chatContainer = chatScrollRef.current;
    if (!chatContainer) return;

    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (proposal) {
      window.setTimeout(() => {
        proposalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 160);
    }
  }, [proposal]);

  useEffect(() => () => {
    stopActiveRecording(false);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="glass relative overflow-hidden rounded-2xl p-4 backdrop-blur-md md:p-7">

        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ion to-iris text-night">
              <BrainCircuit size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-snow">EpicByte AI</p>
              <p className="flex items-center gap-2 text-sm text-fog" aria-live="polite">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isRecordingAudio ? 'animate-pulse bg-rose-400' : isLoading || isStructuring || isTranscribingAudio ? 'animate-pulse bg-iris' : 'bg-ion'
                  }`}
                  aria-hidden="true"
                />
                {isRecordingAudio
                  ? 'Gravando seu áudio'
                  : isTranscribingAudio
                    ? 'Transcrevendo áudio'
                    : isStructuring
                      ? 'Estruturando a proposta'
                      : isLoading
                        ? 'Analisando sua resposta'
                        : isCompleted
                          ? 'Briefing concluído'
                          : 'Aguardando sua mensagem'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetConversation}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 text-sm font-medium text-fog transition-colors hover:border-white/40 hover:text-snow"
            >
              <RotateCcw size={13} />
              Reiniciar
            </button>
          </div>
        </div>

        <p className="relative mb-6 max-w-3xl border-t border-white/10 pt-5 text-sm leading-relaxed text-fog md:text-base">
          Responda em linguagem natural. A IA interpreta o contexto, aprofunda requisitos e transforma o briefing em um
          documento estratégico quando houver informação suficiente.
        </p>

        <div className="relative space-y-4">
          <ConversationFlow
            messages={messages}
            isLoading={isLoading}
            isCompleted={isCompleted}
            isExpanded={isConversationExpanded}
            collectedAnswers={collectedAnswers}
            onToggleExpanded={() => setIsConversationExpanded((current) => !current)}
            scrollRef={chatScrollRef}
          />

          {progress && !proposal && !pendingProposal ? (
            <div
              role="progressbar"
              aria-label="Progresso do briefing"
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.current}
              aria-valuetext={`Pergunta ${progress.current} de até ${progress.total}: ${progress.label}`}
            >
              <div className="flex items-center justify-between gap-3 text-xs text-fog">
                <span>Pergunta {progress.current} de até {progress.total}</span>
                <span className="text-ion">{progress.label}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ion to-iris transition-all duration-500"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          ) : null}

          {!proposal && !pendingProposal ? (
            <form onSubmit={handleSubmit} className="rounded-xl border border-white/15 bg-night/70 p-4 transition-colors duration-200 focus-within:border-ion/70">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={5}
                aria-label="Sua mensagem para a EpicByte AI"
                placeholder={`Conte rapidamente o que você gostaria de criar.\n\nExemplos:\n• Quero divulgar minha barbearia\n• Quero automatizar agendamentos\n• Preciso substituir planilhas\n• Quero um sistema para minha operação`}
                className="w-full resize-none bg-transparent text-base leading-relaxed text-snow placeholder:text-fog/70 focus:outline-none md:text-sm"
              />
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <SuggestionButtons suggestions={quickReplies} onSelect={handleSuggestion} disabled={isLoading || isStructuring || isTranscribingAudio} />
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center lg:shrink-0 lg:flex-nowrap">
                  <button
                    type="button"
                    onClick={handleMicrophoneClick}
                    disabled={isLoading || isStructuring || isTranscribingAudio}
                    title={isRecordingAudio ? 'Gravando... clique para parar' : 'Gravar mensagem de voz'}
                    className={`col-span-2 inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 sm:col-span-1 sm:w-auto ${
                      isRecordingAudio
                        ? 'animate-pulse border-rose-300/40 bg-rose-400/18 text-rose-100'
                        : 'border-white/10 bg-white/[0.06] text-slate-100 hover:bg-white/[0.1]'
                    }`}
                  >
                    {isRecordingAudio ? <Square size={15} /> : <Mic size={15} />}
                    {isRecordingAudio ? 'Parar' : 'Áudio'}
                  </button>
                  {isRecordingAudio ? (
                    <button
                      type="button"
                      onClick={() => stopActiveRecording(false)}
                      className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 hover:bg-white/[0.06] sm:w-auto"
                    >
                      <X size={15} />
                      Cancelar
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || isStructuring || isTranscribingAudio}
                    className="col-span-2 inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-ion px-5 text-sm font-semibold text-night transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-ion/40 sm:w-auto"
                  >
                    {isLoading ? 'Analisando' : 'Enviar'}
                    <Send size={15} />
                  </button>
                </div>
              </div>
              {error ? <p role="alert" className="mt-4 rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-2 text-sm leading-relaxed text-rose-200">{error}</p> : null}
              {audioStatus ? (
                <p className={`mt-4 text-sm leading-relaxed ${isRecordingAudio || isTranscribingAudio ? 'text-cyan-100' : 'text-rose-300'}`}>
                  {audioStatus}
                </p>
              ) : null}
            </form>
          ) : null}
        </div>
      </div>

      {isLeadCaptureVisible && pendingProposal ? (
        <LeadCaptureStep initialLead={leadInfo} onContinue={continueToProposal} />
      ) : null}

      {isStructuring ? <LoadingPipeline /> : null}

      {proposal ? (
        <div ref={proposalRef} className="pt-1">
          <div className="mb-4 flex items-center gap-3 text-cyan-200">
            <Sparkles size={18} />
            <p className="text-xs uppercase tracking-[0.16em]">Proposta estratégica gerada</p>
          </div>
          <VoiceSummary proposal={proposal} lead={leadInfo} />
          <ProposalReveal proposal={proposal} lead={leadInfo} onLeadChange={saveLead} />
        </div>
      ) : null}
    </div>
  );
};

export default ConsultationChat;
