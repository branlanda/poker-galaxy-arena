import { create } from 'zustand';
import { changeLanguage } from '@/i18n';

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
  const storedLanguage = localStorage.getItem('i18nextLng') || localStorage.getItem('language');
  const initialLanguage = storedLanguage
    ? languages.find((lang) => lang.code === storedLanguage) || languages[0]
    : languages[0];

  return {
    currentLanguage: initialLanguage,
    setLanguage: (language) => {
      // Update i18next
      changeLanguage(language.code);
      
      // Store in localStorage (this is also handled by i18next, but we keep it for backward compatibility)
      localStorage.setItem('language', language.code);
      
      // Update state
      set({ currentLanguage: language });
    },
  };
});
