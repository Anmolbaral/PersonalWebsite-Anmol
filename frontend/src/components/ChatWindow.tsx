import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, NotebookPen, Github, Linkedin } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LeaveNote from './LeaveNote';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const quick_prompts = [
  "Show me your projects",
  "What are your key skills?",
  "Tell me about your education",
];

const HammerAnimation: React.FC = () => (
  <div className="flex items-center gap-3 h-16 relative">
    <div className="text-3xl animate-worker-bounce" aria-hidden="true">
      👷
    </div>
    <div className="relative animate-hammer-swing origin-left" aria-hidden="true">
      <div className="text-3xl">🔨</div>
    </div>
    <div className="absolute left-16 top-4">
      <div className="text-xl animate-spark-1" aria-hidden="true">✨</div>
      <div className="text-lg animate-spark-2 absolute left-2 -top-1" aria-hidden="true">💥</div>
      <div className="text-sm animate-spark-3 absolute -left-1 top-1" aria-hidden="true">⚡</div>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLeaveNoteOpen, setIsLeaveNoteOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const leaveNoteButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scroll_to_bottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      const timeoutId = setTimeout(() => {
        scroll_to_bottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoading]);

  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handle_key_down = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handle_submit(e);
    }
  };

  const handle_prompt_click = (prompt: string) => {
    if (isLoading) return;
    setInputValue('');
    onSendMessage(prompt);
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full max-w-6xl mx-auto min-h-[82vh] rounded-3xl flex flex-col overflow-hidden relative"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-strong)',
        }}
      >
        <div className="px-8 py-6 border-b relative z-10 backdrop-blur"
          style={{ background: 'var(--surface)', borderColor: 'var(--surface-contrast)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Sparkles className="w-6 h-6 animate-pulse-subtle" style={{ color: 'var(--text-primary)' }} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Anmol Baruwal</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Engineer · Educator · Researcher</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
              >
                Resume
              </a>
              <a
                href="https://github.com/Anmolbaral"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/anmolbaruwal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsLeaveNoteOpen(true)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
              >
                <NotebookPen className="w-4 h-4" />
                Leave a note
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 space-y-6 relative z-10"
          style={{ background: 'var(--surface)' }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Sparkles className="w-10 h-10 animate-float" style={{ color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome</h2>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I build scalable software and accessible AI experiences.
                How can I help you today?
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                {quick_prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handle_prompt_click(prompt)}
                  className="px-4 py-2 text-sm rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: 'var(--surface)',
                      boxShadow: 'var(--shadow-button)',
                      color: 'var(--text-primary)',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-button-inset)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-slide-in">
                  <div
                    className="rounded-2xl px-5 py-4"
                    style={{
                      background: 'var(--surface)',
                      boxShadow: 'var(--shadow-button)',
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <HammerAnimation />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>crafting response...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 md:px-8 py-6 border-t relative z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--surface-contrast)' }}>
          <form onSubmit={handle_submit} className="flex flex-col gap-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handle_key_down}
                  placeholder="Ask me anything about the work, impact, or story..."
                  rows={1}
                  className="w-full px-4 py-3 border-none rounded-xl resize-none focus:outline-none transition-all placeholder:text-[color:var(--text-secondary)]"
                  style={{
                    maxHeight: '140px',
                    minHeight: '52px',
                    background: 'var(--input-bg)',
                    boxShadow: 'var(--shadow-button-inset)',
                    color: 'var(--text-primary)',
                    caretColor: 'var(--text-primary)',
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 7px 7px 14px var(--shadow-dark), inset -7px -7px 14px var(--shadow-light)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-button-inset)';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[52px] h-[52px] group"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
                onMouseDown={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-button-inset)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                  }
                }}
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Press Enter to send · Shift + Enter for a new line</span>
              <button
                type="button"
                ref={leaveNoteButtonRef}
                onClick={() => setIsLeaveNoteOpen(true)}
                className="px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-button-inset)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-button)';
                }}
              >
                Share a quick note
              </button>
            </div>
          </form>
        </div>
      </div>

      <LeaveNote
        isOpen={isLeaveNoteOpen}
        onClose={() => setIsLeaveNoteOpen(false)}
        triggerButtonRef={leaveNoteButtonRef}
      />
    </div>
  );
};

export default ChatWindow;
