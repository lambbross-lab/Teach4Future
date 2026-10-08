
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BilingualText, CourseSession } from '../types';
import type { SiteLanguage } from './localizedPaths';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getText(text: BilingualText, lang: SiteLanguage): string {
  if (typeof text === 'string') return text;
  return text[lang] || text['en'];
}

export function formatDate(dateString: string, lang: SiteLanguage = 'en') {
  const locales: Record<SiteLanguage, string> = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT' };
  return new Date(dateString).toLocaleDateString(locales[lang], {
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

export function automaticSessionStatus(session: Pick<CourseSession, 'endDate' | 'seatsLeft'>): CourseSession['status'] {
  if (!isCurrentOrUpcoming(session.endDate)) return 'Closed';
  if (session.seatsLeft <= 0) return 'Waiting List';
  if (session.seatsLeft <= 3) return 'Almost Full';
  return 'Open';
}
