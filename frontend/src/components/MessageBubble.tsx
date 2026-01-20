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

  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
      role="article"
      aria-label={message.isUser ? 'Your message' : 'AI assistant message'}
    >
      <div className={`max-w-3xl ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-5 rounded-2xl text-base text-stone-800 ${
            message.isUser ? 'rounded-br-none' : 'rounded-bl-none'
          }`}
          style={{
            background: 'var(--surface)',
            boxShadow: message.isUser ? 'var(--shadow-bubble-user)' : 'var(--shadow-bubble-ai)',
          }}
        >
          {message.isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-stone-800">{message.text}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl font-semibold text-stone-800 mt-4 mb-2" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-xl font-semibold text-stone-800 mt-4 mb-2 flex items-center gap-2" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-lg font-semibold text-stone-800 mt-3 mb-2" {...props} />
                  ),
                  p: ({ ...props }) => <p className="text-stone-800 leading-relaxed my-2" {...props} />,
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside text-stone-800 my-3 space-y-1.5 ml-2" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside text-stone-800 my-3 space-y-1.5 ml-2" {...props} />
                  ),
                  li: ({ ...props }) => <li className="text-stone-800 ml-2" {...props} />,
                  strong: ({ ...props }) => <strong className="font-semibold text-stone-800" {...props} />,
                  em: ({ ...props }) => <em className="italic text-stone-800" {...props} />,
                  code: ({ inline, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="bg-[#f5f1ea] text-stone-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="text-sm font-mono text-stone-800 bg-[#f5f1ea] px-2 py-1 rounded block" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children, ...props }: any) => (
                    <pre
                      className="bg-[#1f2937] text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-stone-400 pl-4 italic text-stone-700 opacity-90 my-3" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a className="text-stone-800 underline decoration-stone-500" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  hr: ({ ...props }) => <hr className="border-stone-300 my-4" {...props} />,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className={`text-xs text-stone-500 mt-2 flex items-center gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{format_time(message.timestamp)}</span>
        </div>
      </div>
      {!message.isUser && (
        <div className="order-2 ml-4 flex-shrink-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-700 text-base font-semibold bg-[#e7e3dc]"
            style={{
              boxShadow: '6px 6px 12px #c3beb6, -6px -6px 12px #ffffff',
            }}
          >
            AI
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
