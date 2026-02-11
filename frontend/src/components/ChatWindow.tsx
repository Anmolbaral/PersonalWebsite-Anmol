import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, NotebookPen, Github, Linkedin, BookOpen } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LeaveNote from './LeaveNote';
import ReadsModal from './ReadsModal';
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
  const [isReadsOpen, setIsReadsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const leaveNoteButtonRef = useRef<HTMLButtonElement>(null);
  const readsButtonRef = useRef<HTMLButtonElement>(null);
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
        className="w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-[90vh] xs:min-h-[88vh] sm:min-h-[85vh] md:min-h-[82vh] rounded-xl xs:rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden relative"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-strong)',
        }}
      >
        <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-3 xs:py-4 sm:py-5 md:py-6 border-b relative z-10 backdrop-blur"
          style={{ background: 'var(--surface)', borderColor: 'var(--surface-contrast)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 xs:gap-3 sm:gap-4">
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 min-w-0 flex-1">
              <div
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 animate-pulse-subtle" style={{ color: 'var(--text-primary)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold truncate" style={{ color: 'var(--text-primary)' }}>Anmol Baruwal</h1>
                <p className="text-[10px] xs:text-xs sm:text-sm truncate" style={{ color: 'var(--text-secondary)' }}>Engineer · Educator · Researcher</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end">
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] xs:text-xs sm:text-sm font-medium px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl transition-all touch-manipulation"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                  minWidth: '36px',
                }}
              >
                <span className="hidden xs:inline">Resume</span>
                <span className="xs:hidden">CV</span>
              </a>
              <a
                href="https://github.com/Anmolbaral"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-medium px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl transition-all touch-manipulation"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                  minWidth: '36px',
                }}
              >
                <Github className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/anmolbaruwal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-medium px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl transition-all touch-manipulation"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                  minWidth: '36px',
                }}
              >
                <Linkedin className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              </a>
              <button
                ref={readsButtonRef}
                onClick={() => setIsReadsOpen(true)}
                className="flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-medium px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl transition-all touch-manipulation"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                  minWidth: '36px',
                }}
              >
                <BookOpen className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              </button>
              <button
                onClick={() => setIsLeaveNoteOpen(true)}
                className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm font-medium px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl transition-all touch-manipulation"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                }}
              >
                <NotebookPen className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Leave a note</span>
                <span className="hidden xs:inline md:hidden">Note</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-3 xs:py-4 sm:py-6 md:py-8 space-y-3 xs:space-y-4 sm:space-y-6 relative z-10"
          style={{ background: 'var(--surface)' }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 xs:space-y-4 sm:space-y-6 px-2 xs:px-3 sm:px-4">
              <div
                className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Sparkles className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-float" style={{ color: 'var(--text-primary)' }} />
              </div>
              <div className="space-y-1.5 xs:space-y-2 max-w-2xl px-2">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Hi!</h2>
                <p className="text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                I build scalable software and accessible AI experiences.
                How can I help you today?
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-center max-w-3xl w-full px-2">
                {quick_prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handle_prompt_click(prompt)}
                  className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 text-[10px] xs:text-xs sm:text-sm rounded-md xs:rounded-lg transition-all hover:scale-[1.02] touch-manipulation"
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

        <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-3 xs:py-4 sm:py-5 md:py-6 border-t relative z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--surface-contrast)' }}>
          <form onSubmit={handle_submit} className="flex flex-col gap-1.5 xs:gap-2 sm:gap-3">
            <div className="flex gap-1.5 xs:gap-2 sm:gap-3 items-center">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handle_key_down}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="w-full px-2.5 xs:px-3 sm:px-4 md:px-5 py-2 xs:py-2.5 sm:py-3 md:py-3.5 text-xs xs:text-sm sm:text-base border-none rounded-md xs:rounded-lg sm:rounded-xl resize-none focus:outline-none transition-all placeholder:text-[color:var(--text-secondary)]"
                  style={{
                    maxHeight: '120px',
                    minHeight: '40px',
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
                className="px-2.5 xs:px-3 sm:px-4 md:px-5 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[40px] xs:min-w-[44px] sm:min-w-[52px] h-[40px] xs:h-[44px] sm:h-[52px] group touch-manipulation"
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
                <Send className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1.5 xs:gap-2 text-[9px] xs:text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="hidden md:inline">Press Enter to send · Shift + Enter for a new line</span>
              <span className="hidden xs:inline md:hidden">Enter to send · Shift+Enter for new line</span>
              <span className="xs:hidden text-center">Enter to send</span>
              <button
                type="button"
                ref={leaveNoteButtonRef}
                onClick={() => setIsLeaveNoteOpen(true)}
                className="px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg transition-all touch-manipulation text-[9px] xs:text-xs sm:text-sm"
                style={{
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-button)',
                  color: 'var(--text-primary)',
                  minHeight: '32px',
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
      <ReadsModal
        isOpen={isReadsOpen}
        onClose={() => setIsReadsOpen(false)}
        triggerButtonRef={readsButtonRef}
      />
    </div>
  );
};

export default ChatWindow;
