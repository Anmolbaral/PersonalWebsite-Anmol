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
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-5 rounded-2xl shadow-sm text-base ${
            message.isUser
              ? 'bg-[var(--user-bubble-bg)] text-[var(--user-bubble-text)] rounded-br-none'
              : 'bg-[var(--ai-bubble-bg)] text-[var(--ai-bubble-text)] rounded-bl-none'
          }`}
        >
          {message.isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4 mb-2" {...props} />,
                  h2: ({...props}) => <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-4 mb-2 flex items-center gap-2" {...props} />,
                  h3: ({...props}) => <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-3 mb-2" {...props} />,
                  p: ({...props}) => <p className="text-[var(--text-primary)] leading-relaxed my-2" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-inside text-[var(--text-primary)] my-3 space-y-1.5 ml-2" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-inside text-[var(--text-primary)] my-3 space-y-1.5 ml-2" {...props} />,
                  li: ({...props}) => <li className="text-[var(--text-primary)] ml-2" {...props} />,
                  strong: ({...props}) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
                  em: ({...props}) => <em className="italic text-[var(--text-primary)]" {...props} />,
                  code: ({inline, className, children, ...props}: any) => {
                    if (inline) {
                      return (
                        <code className="bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({children, ...props}: any) => (
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3" {...props}>
                      {children}
                    </pre>
                  ),
                  blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-[var(--text-secondary)] my-3" {...props} />,
                  a: ({...props}) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  hr: ({...props}) => <hr className="border-[var(--border-color)] my-4" {...props} />,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
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
