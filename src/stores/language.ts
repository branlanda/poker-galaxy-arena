
import { create } from 'zustand';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageState>((set) => {
  // Check if there's a stored language preference
  const storedLanguage = localStorage.getItem('language');
  const initialLanguage = storedLanguage
    ? languages.find((lang) => lang.code === storedLanguage) || languages[0]
    : languages[0];

  return {
    currentLanguage: initialLanguage,
    setLanguage: (language) => {
      localStorage.setItem('language', language.code);
      set({ currentLanguage: language });
    },
  };
});
