
import React from 'react';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-navy border-b border-emerald/10 h-16 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{t('admin.dashboard.title')}</h1>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <div className="text-sm text-emerald">
          {user?.alias || user?.email}
        </div>
      </div>
    </header>
  );
};

export default Header;
