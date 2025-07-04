export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pdfFilename?: string;
}

export interface UploadResponse {
  success: boolean;
  filename?: string;
  message?: string;
}

export interface AskResponse {
  answer: string;
}

export interface APIError {
  message: string;
  status?: number;
}