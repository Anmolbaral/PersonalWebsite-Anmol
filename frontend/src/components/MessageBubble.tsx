import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Format timestamp to readable time
  const format_time = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-lg ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-4 rounded-2xl shadow-sm text-base ${
            message.isUser
              ? 'bg-[var(--user-bubble-bg)] text-[var(--user-bubble-text)] rounded-br-none'
              : 'bg-[var(--ai-bubble-bg)] text-[var(--ai-bubble-text)] rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <div className={`text-sm text-[var(--text-secondary)] mt-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
          {format_time(message.timestamp)}
        </div>
      </div>
      {!message.isUser && (
        <div className="order-2 ml-4 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-base font-semibold">
            AI
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
