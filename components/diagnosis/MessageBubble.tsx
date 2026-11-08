import React from 'react';
import { Bot, UserRound } from 'lucide-react';
import { ChatMessage } from './types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-2 md:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ion/25 to-iris/25 text-ion">
          <Bot size={16} aria-hidden="true" />
        </div>
      ) : null}
      <div
        className={`min-w-0 max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed md:max-w-[74%] ${
          isUser
            ? 'rounded-br-sm bg-ion text-night'
            : 'rounded-bl-sm border border-white/10 bg-night-3 text-snow'
        }`}
      >
        {message.content}
      </div>
      {isUser ? (
        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-fog sm:flex">
          <UserRound size={16} aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
};

export default MessageBubble;
