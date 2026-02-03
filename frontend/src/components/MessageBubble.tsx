import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Format timestamp to readable time
  const format_time = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Remove emoji/icons and normalize persona to first-person for assistant messages
  const sanitize_text = (text: string, isUser: boolean) => {
    if (isUser) return text;
    // Strip common emoji pictographs (including 🚀)
    const emojiRegex = /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu;
    let cleaned = text.replace(emojiRegex, '');

    // Normalize references to the speaker into first-person
    cleaned = cleaned.replace(/\bAnmol\s+Baruwal\b/gi, 'I');
    cleaned = cleaned.replace(/\bAnmol\b/gi, 'I');
    cleaned = cleaned.replace(/\bhe's\b/gi, "I'm");
    cleaned = cleaned.replace(/\bhe is\b/gi, 'I am');
    cleaned = cleaned.replace(/\bhis\b/gi, 'my');
    cleaned = cleaned.replace(/\bhim\b/gi, 'me');
    cleaned = cleaned.replace(/\bhe\b/gi, 'I');

    return cleaned;
  };

  const cleanedText = sanitize_text(message.text, message.isUser);

  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
      role="article"
      aria-label={message.isUser ? 'Your message' : 'AI assistant message'}
    >
      <div className={`w-full xs:max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-3xl ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-2xl text-xs xs:text-sm sm:text-base md:text-lg ${
            message.isUser ? 'rounded-br-none' : 'rounded-bl-none'
          }`}
          style={{
            background: 'var(--surface)',
            boxShadow: message.isUser ? 'var(--shadow-bubble-user)' : 'var(--shadow-bubble-ai)',
            color: 'var(--text-primary)',
          }}
        >
          {message.isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-primary)' }}>{cleanedText}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold mt-2 xs:mt-3 sm:mt-4 mb-1.5 xs:mb-2" style={{ color: 'var(--text-primary)' }} {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mt-2 xs:mt-3 sm:mt-4 mb-1.5 xs:mb-2 flex items-center gap-1.5 xs:gap-2" style={{ color: 'var(--text-primary)' }} {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold mt-1.5 xs:mt-2 sm:mt-3 mb-1.5 xs:mb-2" style={{ color: 'var(--text-primary)' }} {...props} />
                  ),
                  p: ({ ...props }) => <p className="leading-relaxed my-2" style={{ color: 'var(--text-primary)' }} {...props} />,
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside my-3 space-y-1.5 ml-2" style={{ color: 'var(--text-primary)' }} {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside my-3 space-y-1.5 ml-2" style={{ color: 'var(--text-primary)' }} {...props} />
                  ),
                  li: ({ ...props }) => <li className="ml-2" style={{ color: 'var(--text-primary)' }} {...props} />,
                  strong: ({ ...props }) => <strong className="font-semibold" style={{ color: 'var(--text-primary)' }} {...props} />,
                  em: ({ ...props }) => <em className="italic" style={{ color: 'var(--text-primary)' }} {...props} />,
                  code: ({ inline, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--code-bg)', color: 'var(--code-text)' }} {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="text-sm font-mono px-2 py-1 rounded block" style={{ background: 'var(--code-bg)', color: 'var(--code-text)' }} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children, ...props }: any) => (
                    <pre
                      className="p-4 rounded-lg overflow-x-auto text-sm font-mono my-3"
                      style={{ background: '#1f2937', color: '#e5e7eb' }}
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 pl-4 italic opacity-90 my-3" style={{ borderColor: 'var(--surface-contrast)', color: 'var(--text-secondary)' }} {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a className="underline" style={{ color: 'var(--link-color)' }} target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  hr: ({ ...props }) => <hr className="my-4" style={{ borderColor: 'var(--surface-contrast)' }} {...props} />,
                }}
              >
                {cleanedText}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className={`text-xs mt-2 flex items-center gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`} style={{ color: 'var(--text-secondary)' }}>
          <span>{format_time(message.timestamp)}</span>
        </div>
      </div>
      {!message.isUser && (
        <div className="order-2 ml-1.5 xs:ml-2 sm:ml-4 flex-shrink-0">
          <div
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] xs:text-xs sm:text-base md:text-lg font-semibold tracking-tight"
            style={{
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-button)',
              color: 'var(--text-primary)',
            }}
          >
            AB
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
