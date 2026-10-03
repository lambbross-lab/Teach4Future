
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { translations } from '../translations';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedPreference = localStorage.getItem('languagePreference');
    if (savedPreference === 'en' || savedPreference === 'es') {
      return savedPreference;
    }

    const browserLanguage = navigator.languages?.[0] || navigator.language || 'en';
    return browserLanguage.toLowerCase().startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // The old key did not distinguish an automatic default from a choice made by the visitor.
    // Removing it lets existing Spanish-speaking visitors receive the new browser-based default.
    localStorage.removeItem('language');
  }, []);

  const chooseLanguage = (lang: Language) => {
    localStorage.setItem('languagePreference', lang);
    setLanguage(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
