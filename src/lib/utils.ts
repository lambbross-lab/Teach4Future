
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BilingualText } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getText(text: BilingualText, lang: 'en' | 'es'): string {
  if (typeof text === 'string') return text;
  return text[lang] || text['en'];
}

export function formatDate(dateString: string, lang: 'en' | 'es' = 'en') {
  return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function isCurrentOrUpcoming(endDate: string) {
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  return endDate >= localToday;
}
