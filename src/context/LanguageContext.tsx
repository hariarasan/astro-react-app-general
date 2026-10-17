import React, { createContext, useContext, useMemo, useState } from 'react';

import type { AppLanguage } from '../types/language';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Tamil is the default for the astrology data itself (sign/planet/
  // nakshatra names from the backend). App chrome - section titles,
  // buttons, etc. - stays in English for now; see AppLanguage.
  const [language, setLanguage] = useState<AppLanguage>('ta');

  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
