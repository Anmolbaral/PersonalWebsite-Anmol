import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';
import ChatWindow from './components/ChatWindow';
import ThemeToggle from './components/ThemeToggle';
import StatusBar from './components/StatusBar';
import type { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.body.classList.add('light-theme');
    }
  }, []);

  // Toggle between dark and light themes
  const toggle_theme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Send message to AI chatbot API
  const send_message = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: text,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-20">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={send_message}
      />
      <ThemeToggle isDark={isDark} onToggle={toggle_theme} />
      <StatusBar 
        isConnected={isConnected} 
        status={isConnected ? "Connected" : "Disconnected"}
        liveStatus="📍 Nashville, TN | 🚀 Open to new opportunities"
      />
      <Analytics />
    </div>
  );
}

export default App;
