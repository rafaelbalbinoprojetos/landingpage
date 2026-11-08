import React, { RefObject } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage } from './types';

interface ConversationFlowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  collectedAnswers: number;
  onToggleExpanded: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const ConversationFlow: React.FC<ConversationFlowProps> = ({
  messages,
  isLoading,
  isCompleted,
  isExpanded,
  collectedAnswers,
  onToggleExpanded,
  scrollRef
}) => {
  if (isCompleted && !isExpanded) {
    return (
      <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-300/12 text-emerald-200">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <p className="font-display text-xl text-white">Briefing concluído</p>
              <p className="mt-1 text-sm text-slate-400">{collectedAnswers} respostas coletadas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleExpanded}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition-colors hover:bg-white/[0.08]"
          >
            Expandir conversa
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-night/50 p-3 md:p-5">
      {isCompleted ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300"
          >
            Minimizar conversa
            <ChevronUp size={13} />
          </button>
        </div>
      ) : null}

      <div ref={scrollRef} className="max-h-[60svh] space-y-4 overflow-y-auto pb-1 pr-1 md:max-h-[36rem]">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading ? (
          <div className="flex items-center gap-2 pl-12 text-sm text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            Interpretando contexto do negócio...
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ConversationFlow;
