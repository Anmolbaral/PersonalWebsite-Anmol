import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, NotebookPen } from 'lucide-react';
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
    <div className="text-4xl animate-worker-bounce">👷</div>
    <div className="relative animate-hammer-swing origin-left">
      <div className="text-3xl">🔨</div>
    </div>
    <div className="absolute left-16 top-4">
      <div className="text-xl animate-spark-1">✨</div>
      <div className="text-lg animate-spark-2 absolute left-2 -top-1">💥</div>
      <div className="text-sm animate-spark-3 absolute -left-1 top-1">⚡</div>
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
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full max-w-6xl mx-auto min-h-[82vh] bg-[#e7e3dc] rounded-3xl flex flex-col overflow-hidden relative"
        style={{
          boxShadow: `
            20px 20px 60px #c3beb6,
            -20px -20px 60px #ffffff,
            inset 2px 2px 5px rgba(255, 255, 255, 0.55),
            inset -2px -2px 5px rgba(0, 0, 0, 0.04)
          `,
        }}
      >
        <div className="px-8 py-6 border-b border-[#d3cec6] relative z-10 bg-[#e7e3dc]/95 backdrop-blur">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl bg-[#e7e3dc] flex items-center justify-center"
                style={{
                  boxShadow: `
                    8px 8px 16px #c3beb6,
                    -8px -8px 16px #ffffff
                  `,
                }}
              >
                <Sparkles className="w-6 h-6 text-stone-700 animate-pulse-subtle" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-stone-800">Anmol Baruwal</h1>
                <p className="text-sm text-stone-500">Engineer · Educator · Researcher</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-stone-700 px-4 py-3 rounded-xl bg-[#e7e3dc] transition-all"
                style={{
                  boxShadow: `
                    6px 6px 12px #c3beb6,
                    -6px -6px 12px #ffffff
                  `,
                }}
              >
                View Resume
              </a>
              <button
                onClick={() => setIsLeaveNoteOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-stone-700 px-4 py-3 rounded-xl bg-[#e7e3dc] transition-all"
                style={{
                  boxShadow: `
                    6px 6px 12px #c3beb6,
                    -6px -6px 12px #ffffff
                  `,
                }}
              >
                <NotebookPen className="w-4 h-4" />
                Leave a note
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 space-y-6 relative z-10 bg-[#e7e3dc]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
              <div
                className="w-20 h-20 rounded-full bg-[#e7e3dc] flex items-center justify-center relative"
                style={{
                  boxShadow: `
                    10px 10px 24px #c3beb6,
                    -10px -10px 24px #ffffff
                  `,
                }}
              >
                <Sparkles className="w-10 h-10 text-stone-600 animate-float" />
              </div>
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl font-semibold text-stone-800">Welcome</h2>
                <p className="text-stone-600 leading-relaxed">
                  I craft accessible AI and technology experiences through education, makerspaces, and hands-on building.
                  Ask about the work, approach, or how you can collaborate.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                {quick_prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handle_prompt_click(prompt)}
                    className="px-4 py-2 text-sm bg-[#e7e3dc] text-stone-700 rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      boxShadow: `
                        5px 5px 12px #c3beb6,
                        -5px -5px 12px #ffffff
                      `,
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 5px 5px 12px #c3beb6, inset -5px -5px 12px #ffffff';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = '5px 5px 12px #c3beb6, -5px -5px 12px #ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '5px 5px 12px #c3beb6, -5px -5px 12px #ffffff';
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
                    className="bg-[#e7e3dc] rounded-2xl px-5 py-4"
                    style={{
                      boxShadow: '6px 6px 12px #c3beb6, -6px -6px 12px #ffffff',
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <HammerAnimation />
                      <span className="text-xs text-stone-600 font-medium">crafting response...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 md:px-8 py-6 border-t border-[#d3cec6] bg-[#e7e3dc] relative z-10">
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
                  className="w-full px-4 py-3 bg-[#e7e3dc] border-none rounded-xl resize-none focus:outline-none transition-all text-stone-800 placeholder-stone-400"
                  style={{
                    maxHeight: '140px',
                    minHeight: '52px',
                    boxShadow: 'inset 6px 6px 12px #c3beb6, inset -6px -6px 12px #ffffff',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 7px 7px 14px #c3beb6, inset -7px -7px 14px #ffffff';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 6px 6px 12px #c3beb6, inset -6px -6px 12px #ffffff';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 bg-[#e7e3dc] text-stone-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[52px] h-[52px] group"
                style={{
                  boxShadow: '6px 6px 12px #c3beb6, -6px -6px 12px #ffffff',
                }}
                onMouseDown={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = 'inset 6px 6px 12px #c3beb6, inset -6px -6px 12px #ffffff';
                  }
                }}
                onMouseUp={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = '6px 6px 12px #c3beb6, -6px -6px 12px #ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = '6px 6px 12px #c3beb6, -6px -6px 12px #ffffff';
                  }
                }}
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Press Enter to send · Shift + Enter for a new line</span>
              <button
                type="button"
                ref={leaveNoteButtonRef}
                onClick={() => setIsLeaveNoteOpen(true)}
                className="px-4 py-2 rounded-lg text-stone-700 bg-[#e7e3dc] transition-all"
                style={{
                  boxShadow: `
                    5px 5px 12px #c3beb6,
                    -5px -5px 12px #ffffff
                  `,
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 5px 5px 12px #c3beb6, inset -5px -5px 12px #ffffff';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '5px 5px 12px #c3beb6, -5px -5px 12px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '5px 5px 12px #c3beb6, -5px -5px 12px #ffffff';
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
