
import { useTranslation as useReactI18next } from 'react-i18next';
import { useLanguage } from '@/stores/language';

// Enhanced useTranslation hook that combines our language store with react-i18next
export const useTranslation = () => {
  const { t, i18n } = useReactI18next();
  const { currentLanguage, setLanguage } = useLanguage();

  // Make sure the i18next instance is in sync with our language store
  if (i18n.language !== currentLanguage.code) {
    i18n.changeLanguage(currentLanguage.code);
  }

  return { t };
};
