
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languages } from '@/stores/language';

// Import translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';

// Configure i18next
i18n
  .use(LanguageDetector) // Detect language from browser
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      // Additional languages will be added as they become available
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    
    // Set detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    
    returnNull: false,    // Don't return null for missing translations
    returnEmptyString: false, // Don't return empty string for missing translations
    returnObjects: false,     // Don't return objects for namespace fallbacks
    
    // Handle plurals and nested keys
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
  });

// Function to change language that updates both i18next and our language store
export const changeLanguage = (languageCode: string) => {
  return i18n.changeLanguage(languageCode);
};

// Handle RTL languages
i18n.on('languageChanged', (lng) => {
  const language = languages.find(l => l.code === lng);
  
  if (language?.isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.classList.remove('rtl');
  }
});

export default i18n;
