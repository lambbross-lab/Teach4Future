import { supabase } from '../lib/supabase';

export type ChatMessage = {
  id: string;
  sender: 'visitor' | 'team';
  content: string;
  created_at: string;
};

type ChatResponse<T> = T & { error?: string };

const storageKey = 'teach4future_chat_visitor_token';

const visitorToken = () => {
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(storageKey, token);
  return token;
};

const invoke = async <T>(body: Record<string, unknown>): Promise<ChatResponse<T>> => {
  if (!supabase) throw new Error('CHAT_NOT_CONFIGURED');
  const { data, error } = await supabase.functions.invoke('chat-support', { body: { ...body, visitorToken: visitorToken() } });
  if (error) throw error;
  return data as ChatResponse<T>;
};

export const getChatAvailability = () => invoke<{ available: boolean }>({ action: 'availability' });

export const startChat = (language: 'en' | 'es') => invoke<{ conversationId: string; messages: ChatMessage[] }>({ action: 'start', language });

export const getChatMessages = (conversationId: string) => invoke<{ messages: ChatMessage[] }>({ action: 'messages', conversationId });

export const sendChatMessage = (conversationId: string, message: string) => invoke<{ message: ChatMessage }>({ action: 'send', conversationId, message });
