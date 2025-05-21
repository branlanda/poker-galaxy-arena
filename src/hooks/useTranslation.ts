
import { useLanguage } from '@/stores/language';

// Very basic translation implementation
// In a real app, you would use a more robust solution like i18next
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    playNow: 'Play Now',
    learnMore: 'Learn More',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    funds: 'Funds',
    admin: 'Admin',
  },
  es: {
    welcome: 'Bienvenido',
    playNow: 'Jugar Ahora',
    learnMore: 'Saber Más',
    login: 'Iniciar Sesión',
    signup: 'Crear Cuenta',
    logout: 'Cerrar Sesión',
    funds: 'Fondos',
    admin: 'Administrador',
  },
  // Add more languages as needed
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  const languageCode = currentLanguage.code;
  
  const t = (key: string): string => {
    // If the translation exists, return it
    if (translations[languageCode]?.[key]) {
      return translations[languageCode][key];
    }
    
    // Fallback to English
    if (translations.en?.[key]) {
      return translations.en[key];
    }
    
    // If no translation found, return the key
    return key;
  };

  return { t };
};
