import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../config/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default to Khmer 'km' or load from localStorage
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('vreal_language') || 'km';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('vreal_language', lang);
    if (lang === 'km') {
      document.documentElement.lang = 'km';
    } else {
      document.documentElement.lang = 'en';
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.km;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
