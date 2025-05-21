
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  labelKey: string; // i18n key
  value: string | number;
  icon: React.ReactNode;
  color: 'emerald' | 'gold' | 'accent';
}

const KPIWidget = ({ labelKey, value, icon, color }: Props) => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-2xl p-5 bg-[#0e2337] flex items-center gap-4">
      <div className={`text-${color} text-3xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{t(labelKey)}</p>
        <p className="text-2xl font-mono text-white">{value}</p>
      </div>
    </div>
  );
};

export default KPIWidget;
