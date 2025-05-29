
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const updateTheme = useCallback((newTheme: Theme) => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', newTheme);
    
    // Update document class and CSS variables
    const root = document.documentElement;
    
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      if (newTheme === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--background', '210 80% 10%');
        root.style.setProperty('--foreground', '0 0% 100%');
        root.style.setProperty('--card', '210 80% 12%');
        root.style.setProperty('--card-foreground', '0 0% 100%');
        root.style.setProperty('--popover', '210 80% 8%');
        root.style.setProperty('--popover-foreground', '0 0% 100%');
        root.style.setProperty('--muted', '210 40% 15%');
        root.style.setProperty('--muted-foreground', '215.4 16.3% 70%');
        root.style.setProperty('--border', '214.3 31.8% 20%');
        root.style.setProperty('--input', '214.3 31.8% 20%');
      } else {
        root.classList.remove('dark');
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '210 80% 10%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '210 80% 10%');
        root.style.setProperty('--popover', '0 0% 100%');
        root.style.setProperty('--popover-foreground', '210 80% 10%');
        root.style.setProperty('--muted', '210 40% 98%');
        root.style.setProperty('--muted-foreground', '215.4 16.3% 46%');
        root.style.setProperty('--border', '214.3 31.8% 91%');
        root.style.setProperty('--input', '214.3 31.8% 91%');
      }
    });
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme, updateTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return {
    theme,
    setTheme: setThemeValue,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
