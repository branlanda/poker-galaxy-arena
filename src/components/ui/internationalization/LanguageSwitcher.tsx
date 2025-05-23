
import React from 'react';
import { useLanguage } from '@/stores/language';
import { Button } from '@/components/ui/Button';
import { Check, Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';

export interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'ghost',
  size = 'sm',
  showText = true
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  
  // Group languages by region for better organization
  const languagesByRegion = React.useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    availableLanguages.forEach(lang => {
      const region = lang.region || 'Other';
      if (!grouped[region]) {
        grouped[region] = [];
      }
      grouped[region].push(lang);
    });
    
    return grouped;
  }, [availableLanguages]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="flex items-center gap-2"
          aria-label={t('selectLanguage', 'Select language')}
        >
          <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
          {showText && (
            <span className="hidden md:inline">{currentLanguage.name}</span>
          )}
          <Globe className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('languages.select', 'Select Language')}</DropdownMenuLabel>
        
        {Object.entries(languagesByRegion).map(([region, languages]) => (
          <React.Fragment key={region}>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {region}
              </DropdownMenuLabel>
              
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => setLanguage(language)}
                  className={`flex items-center justify-between gap-2 ${
                    currentLanguage.code === language.code ? 'bg-emerald/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check className="h-4 w-4 text-emerald" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
