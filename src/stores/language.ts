import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { changeLanguage } from '@/i18n';

export type Language = {
  code: string;
  name: string;
  flag: string;
  isRTL?: boolean;
  region?: string;
};

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'NA' },
  { code: 'es', name: 'Español', flag: '🇪🇸', region: 'EU' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'EU' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'EU' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', region: 'EU' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'EU' },
  { code: 'zh', name: '中文', flag: '🇨🇳', region: 'ASIA' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', region: 'ASIA' },
  // New languages for more international reach
  { code: 'ru', name: 'Русский', flag: '🇷🇺', region: 'EU' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', isRTL: true, region: 'MENA' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'ASIA' },
  { code: 'pt-br', name: 'Português (Brasil)', flag: '🇧🇷', region: 'SA' },
  { code: 'es-mx', name: 'Español (México)', flag: '🇲🇽', region: 'NA' },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageByCode: (code: string) => Language | undefined;
  getLanguagesByRegion: (region?: string) => Language[];
  availableLanguages: Language[];
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => {
      // Check if there's a stored language preference
      const getBrowserLanguage = (): string => {
        const detectedLang = navigator.language.toLowerCase();
        
        // First check for direct match (e.g., pt-br)
        const directMatch = languages.find(lang => lang.code.toLowerCase() === detectedLang);
        if (directMatch) return directMatch.code;
        
        // Then check for language part only match (e.g., pt from pt-br)
        const langPartOnly = detectedLang.split('-')[0];
        const langPartMatch = languages.find(lang => lang.code.toLowerCase() === langPartOnly);
        if (langPartMatch) return langPartMatch.code;
        
        // Default to English
        return 'en';
      };

      const storedLanguage = typeof window !== 'undefined' ? 
        localStorage.getItem('i18nextLng') || localStorage.getItem('language') : null;
      
      const initialLanguage = storedLanguage
        ? languages.find((lang) => lang.code === storedLanguage) || languages[0]
        : languages.find(lang => lang.code === getBrowserLanguage()) || languages[0];

      return {
        currentLanguage: initialLanguage,
        availableLanguages: languages,
        
        setLanguage: (language) => {
          // Update i18next
          changeLanguage(language.code);
          
          // Store in localStorage (this is also handled by i18next, but we keep it for backward compatibility)
          if (typeof window !== 'undefined') {
            localStorage.setItem('language', language.code);
          }
          
          // Update state
          set({ currentLanguage: language });
          
          // If language is RTL, add appropriate styling to document
          if (typeof document !== 'undefined') {
            if (language.isRTL) {
              document.documentElement.setAttribute('dir', 'rtl');
              document.documentElement.classList.add('rtl');
            } else {
              document.documentElement.setAttribute('dir', 'ltr');
              document.documentElement.classList.remove('rtl');
            }
          }
        },
        
        getLanguageByCode: (code) => {
          return languages.find(lang => lang.code === code);
        },
        
        getLanguagesByRegion: (region) => {
          if (!region) return languages;
          return languages.filter(lang => lang.region === region);
        }
      };
    },
    {
      name: 'language-store', // unique name for localStorage
    }
  )
);
