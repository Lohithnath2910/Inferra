import { ChatSession } from '@/types';

const STORAGE_KEY = 'inferra-chat-sessions';

export const saveChatSession = (session: ChatSession): void => {
  try {
    const sessions = getChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(sessions),
    }));
  } catch (error) {
    console.error('Failed to save chat session:', error);
  }
};

export const getChatSessions = (): ChatSession[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load chat sessions:', error);
    return [];
  }
};

export const getChatSession = (id: string): ChatSession | null => {
  const sessions = getChatSessions();
  return sessions.find(s => s.id === id) || null;
};

export const deleteChatSession = (id: string): void => {
  try {
    const sessions = getChatSessions().filter(s => s.id !== id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(sessions),
    }));
  } catch (error) {
    console.error('Failed to delete chat session:', error);
  }
};

export const clearAllSessions = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: null,
    }));
  } catch (error) {
    console.error('Failed to clear all sessions:', error);
  }
};