
import { useState, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '@/stores/language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeviceInfo } from '@/hooks/use-mobile';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const { isMobile } = useDeviceInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  // Group languages by region for better organization
  const languagesByRegion = useMemo(() => {
    const grouped: Record<string, Language[]> = {
      'all': availableLanguages
    };
    
    availableLanguages.forEach(lang => {
      if (lang.region) {
        grouped[lang.region] = grouped[lang.region] || [];
        grouped[lang.region].push(lang);
      }
    });
    
    return grouped;
  }, [availableLanguages]);

  const regions = useMemo(() => {
    return Object.keys(languagesByRegion).filter(r => r !== 'all');
  }, [languagesByRegion]);
  
  const displayLanguages = useMemo(() => {
    return activeTab === 'all' ? availableLanguages : (languagesByRegion[activeTab] || []);
  }, [activeTab, languagesByRegion, availableLanguages]);
  
  // Translate region names
  const getRegionName = (region: string) => {
    switch (region) {
      case 'NA': return t('regions.northAmerica', 'North America');
      case 'SA': return t('regions.southAmerica', 'South America');
      case 'EU': return t('regions.europe', 'Europe');
      case 'ASIA': return t('regions.asia', 'Asia');
      case 'MENA': return t('regions.middleEast', 'Middle East');
      default: return region;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 px-2 md:px-3"
          aria-label={t('selectLanguage', 'Select language')}
        >
          <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <Globe className="h-4 w-4 text-emerald" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-navy border border-emerald/20"
      >
        {!isMobile && regions.length > 0 && (
          <>
            <div className="p-2">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="text-xs">{t('regions.all', 'All')}</TabsTrigger>
                  {regions.map(region => (
                    <TabsTrigger key={region} value={region} className="text-xs">
                      {getRegionName(region)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          <DropdownMenuLabel>
            {t('languages.selectLanguage', 'Select Language')}
          </DropdownMenuLabel>
          {displayLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`flex items-center gap-2 py-2 cursor-pointer ${
                currentLanguage.code === language.code ? 'bg-emerald/10 text-emerald' : ''
              }`}
            >
              <span className="text-lg" aria-hidden="true">{language.flag}</span>
              <span>{language.name}</span>
              {language.isRTL && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {t('languages.rtl', 'RTL')}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
