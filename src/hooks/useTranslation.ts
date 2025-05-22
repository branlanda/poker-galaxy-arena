
import { useTranslation as useReactI18next, UseTranslationOptions } from 'react-i18next';
import { useLanguage } from '@/stores/language';
import { useMemo } from 'react';

/**
 * Enhanced translation hook that combines our language store with react-i18next
 * @param ns - Namespace(s) to use
 * @param options - Additional options for react-i18next
 * @returns Enhanced translation utilities
 */
export const useTranslation = (ns?: string | string[], options?: UseTranslationOptions<string>) => {
  const { t: originalT, i18n } = useReactI18next(ns, options);
  const { currentLanguage, setLanguage, getLanguageByCode } = useLanguage();

  // Make sure the i18next instance is in sync with our language store
  if (i18n.language !== currentLanguage.code) {
    i18n.changeLanguage(currentLanguage.code);
  }

  // Enhanced translation functionality
  const enhancedT = useMemo(() => {
    const tFunction = (key: string, options?: any): string => {
      const translation = originalT(key, options);
      
      // Handle case when translation is missing
      if (typeof translation === 'object') {
        // If the result is an object, return the key as a fallback
        console.warn(`Translation for key "${key}" returned an object instead of a string`);
        return key.split('.').pop() || key;
      }
      
      // Return key as fallback if translation is missing (helpful for development)
      if (translation === key && key.includes('.')) {
        return key.split('.').pop() || key;
      }
      
      return translation;
    };
    
    return tFunction;
  }, [originalT]);

  return {
    t: enhancedT,
    i18n,
    language: currentLanguage,
    isRTL: !!currentLanguage.isRTL,
    changeLanguage: (langCode: string) => {
      const language = getLanguageByCode(langCode);
      if (language) {
        setLanguage(language);
      }
    }
  };
};
