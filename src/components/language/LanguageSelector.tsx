
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, languages, Language } from '@/stores/language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
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
        className="w-48 bg-navy border border-emerald/20"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            className={`flex items-center gap-2 py-2 cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-emerald/10 text-emerald' : ''
            }`}
          >
            <span className="text-lg" aria-hidden="true">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
