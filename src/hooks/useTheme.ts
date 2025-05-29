
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Always default to light theme for black text on white background
    return 'light';
  });

  const updateTheme = useCallback((newTheme: Theme) => {
    // Force light theme to ensure black text on white background
    const forcedTheme = 'light';
    
    // Update localStorage when theme changes
    localStorage.setItem('theme', forcedTheme);
    
    // Update document class and CSS variables
    const root = document.documentElement;
    
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      // Always use light theme settings for black text on white
      root.classList.remove('dark');
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '0 0% 0%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '0 0% 0%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '0 0% 0%');
      root.style.setProperty('--muted', '210 40% 98%');
      root.style.setProperty('--muted-foreground', '0 0% 0%');
      root.style.setProperty('--border', '214.3 31.8% 91%');
      root.style.setProperty('--input', '214.3 31.8% 91%');
    });
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme, updateTheme]);

  const toggleTheme = useCallback(() => {
    // Always stay on light theme
    setTheme('light');
  }, []);

  const setThemeValue = useCallback((newTheme: Theme) => {
    // Always set to light theme
    setTheme('light');
  }, []);

  return {
    theme: 'light' as Theme,
    setTheme: setThemeValue,
    toggleTheme,
    isDark: false,
    isLight: true,
  };
}
