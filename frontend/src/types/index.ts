// Core application types

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Note {
  id: string;
  name: string;
  email: string;
  message: string;
  contactInfo?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
}

export interface ChatResponse {
  response: string;
}

export interface NoteSubmission {
  name: string;
  email: string;
  message: string;
  contactInfo?: string;
}

export interface ReadItem {
  title: string;
  author?: string;
  url?: string;
  status: 'reading' | 'read';
  note?: string;
}
