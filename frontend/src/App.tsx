import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ThemeToggle from './components/ThemeToggle';
import StatusBar from './components/StatusBar';
import type { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const should_use_dark = savedTheme === 'dark';
    setIsDark(should_use_dark);
    document.body.classList.toggle('dark-theme', should_use_dark);
  }, []);

  // Toggle between dark and light themes
  const toggle_theme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    document.body.classList.toggle('dark-theme', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Send message to AI chatbot API with streaming support
  const send_message = async (text: string) => {
    // Generate unique IDs to prevent collisions
    const timestamp = Date.now();
    const userMessageId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    const aiMessageId = `${timestamp + 1}-${Math.random().toString(36).substr(2, 9)}`;
    
    const userMessage: Message = {
      id: userMessageId,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create AI message placeholder for streaming
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = setTimeout(() => controller.abort(), 65000); // 65 seconds
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamDone = false;

      setIsConnected(true);

      while (!streamDone) {
        const { done, value } = await reader.read();
        
        if (done) {
          streamDone = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.done) {
                streamDone = true;
                setIsLoading(false);
                break;
              }
              
              if (data.content) {
                // Update message incrementally
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, text: msg.text + data.content }
                    : msg
                ));
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
              // Continue processing other lines even if one fails
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = "Sorry, I'm having trouble connecting to the server. Please try again later.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorText = "The request took too long. Please try again with a shorter question.";
        } else if (error.message.includes('429')) {
          errorText = "Too many requests. Please wait a moment and try again.";
        } else if (error.message.includes('500')) {
          errorText = "Server error. Please try again later.";
        } else if (error.message) {
          errorText = error.message;
        }
      }
      
      // Update the AI message with error, or remove if empty
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, text: errorText }
            : msg
        );
        // Remove message if it's still empty (shouldn't happen, but safety check)
        return updated.filter(msg => !(msg.id === aiMessageId && msg.text === ''));
      });
      
      setIsConnected(false);
      setIsLoading(false);
    } finally {
      // Cleanup: clear timeout and release reader
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
          // Reader may already be released
          console.debug('Reader already released:', e);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={send_message}
      />
      <ThemeToggle isDark={isDark} onToggle={toggle_theme} />
      <StatusBar 
        isConnected={isConnected} 
        status={isConnected ? "Connected" : "Disconnected"}
        liveStatus="Nashville, TN | Open to new opportunities"
      />
    </div>
  );
}

export default App;
