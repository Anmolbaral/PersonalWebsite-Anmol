import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import LeaveNote from './LeaveNote';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLeaveNoteOpen, setIsLeaveNoteOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const leaveNoteButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom when new messages arrive
  // Debounced to avoid excessive scrolling during streaming
  const scroll_to_bottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll if there are messages
    if (messages.length > 0) {
      // Use requestAnimationFrame for better performance
      const timeoutId = setTimeout(() => {
        scroll_to_bottom();
      }, 100); // Small delay to batch rapid updates during streaming
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Handle chat form submission
  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Handle Enter key to send message
  const handle_key_press = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handle_submit(e);
    }
  };

  return (
    <div className="relative">
      <div className="w-full max-w-10xl h-[95vh] max-h-[900px] bg-[var(--chat-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-500 mb-20">
        {/* Hanging line effect */}
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-px h-5 bg-gradient-to-b from-[var(--border-color)] to-transparent"></div>
        
        {/* Header */}
        <div className="flex-shrink-0 p-10 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-[var(--text-primary)] font-semibold text-xl">Anmol Baruwal</h1>
            <span className="text-[var(--text-secondary)] text-base">AI Assistant</span>
          </div>
          <div className="flex pl-20 items-center space-x-4">
            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume</span>
            </a>
            <button
              ref={leaveNoteButtonRef}
              onClick={() => setIsLeaveNoteOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Leave a Note</span>
            </button>
          </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8">
        {messages.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] mt-8">
            {/* Jarvis-like symbol */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full inline-block mx-1"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full inline-block mx-1"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full inline-block mx-1"></div>
              </div>
            </div>
            
            {/* Welcome message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Anmol's AI Portfolio
              </h1>
              <p className="text-base mb-2 text-[var(--text-secondary)]">I'm here to help you learn about Anmol's experience, projects, and skills.</p>
              <p className="text-sm text-[var(--text-secondary)]">How can I assist you today?</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onSendMessage("Tell me about your latest project")}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Latest Project</span>
              </button>
              <button
                onClick={() => onSendMessage("Tell me about your latest work experience")}
                className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span>Latest Work</span>
              </button>
              <button
                onClick={() => onSendMessage("What are your skills?")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Skills</span>
              </button>
              <button
                onClick={() => onSendMessage("Tell me about your education")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>Education</span>
              </button>
              <button
                onClick={() => setIsLeaveNoteOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Leave a Note</span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-6 border-t border-[var(--border-color)]">
        <form onSubmit={handle_submit} className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handle_key_press}
            placeholder="Ask me about Anmol..."
            disabled={isLoading}
            className="flex-1 bg-[var(--input-bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] border border-[var(--border-color)] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-base"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-7 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span>Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
      </div>
      
      {/* Leave Note Modal */}
      <LeaveNote 
        isOpen={isLeaveNoteOpen} 
        onClose={() => setIsLeaveNoteOpen(false)}
        triggerButtonRef={leaveNoteButtonRef}
      />
    </div>
  );
};

export default ChatWindow;
