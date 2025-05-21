
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
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.dau': 'Active Users (24h)',
    'admin.dashboard.rake24h': 'Rake Last 24h',
    'admin.dashboard.activeTournaments': 'Active Tournaments',
    'admin.dashboard.pendingWithdrawals': 'Pending Withdrawals',
    'admin.dashboard.rake7d': 'Rake Last 7 Days',
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
    'admin.dashboard.title': 'Panel',
    'admin.dashboard.dau': 'Usuarios activos (24h)',
    'admin.dashboard.rake24h': 'Rake últimas 24h',
    'admin.dashboard.activeTournaments': 'Torneos activos',
    'admin.dashboard.pendingWithdrawals': 'Retiros pendientes',
    'admin.dashboard.rake7d': 'Rake últimos 7 días',
  },
  // Add more languages with their admin dashboard translations
  fr: {
    welcome: 'Bienvenue',
    playNow: 'Jouer Maintenant',
    learnMore: 'En Savoir Plus',
    login: 'Connexion',
    signup: 'S\'inscrire',
    logout: 'Déconnexion',
    funds: 'Fonds',
    admin: 'Admin',
    'admin.dashboard.title': 'Tableau de Bord',
    'admin.dashboard.dau': 'Utilisateurs Actifs (24h)',
    'admin.dashboard.rake24h': 'Rake Dernières 24h',
    'admin.dashboard.activeTournaments': 'Tournois Actifs',
    'admin.dashboard.pendingWithdrawals': 'Retraits en Attente',
    'admin.dashboard.rake7d': 'Rake Derniers 7 Jours',
  },
  de: {
    welcome: 'Willkommen',
    playNow: 'Jetzt Spielen',
    learnMore: 'Mehr Erfahren',
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    funds: 'Guthaben',
    admin: 'Admin',
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.dau': 'Aktive Benutzer (24h)',
    'admin.dashboard.rake24h': 'Rake letzte 24h',
    'admin.dashboard.activeTournaments': 'Aktive Turniere',
    'admin.dashboard.pendingWithdrawals': 'Ausstehende Abhebungen',
    'admin.dashboard.rake7d': 'Rake letzte 7 Tage',
  },
  // Add translations for the other languages in your language.ts file
  // ...
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
