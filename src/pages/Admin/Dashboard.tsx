
import React from 'react';
import { Card } from "@/components/ui/card";
import KPIWidget from '@/components/admin/KPIWidget';
import RakeChart from '@/components/admin/RakeChart';
import { useTranslation } from '@/hooks/useTranslation';
import { Users, Banknote, Trophy, ArrowUp } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  
  // Mock KPI data
  const kpis = [
    { key: 'dau', value: 423, icon: <Users size={24} />, color: 'emerald' as const },
    { key: 'rake24h', value: '250 USDT', icon: <Banknote size={24} />, color: 'gold' as const },
    { key: 'activeTournaments', value: 3, icon: <Trophy size={24} />, color: 'emerald' as const },
    { key: 'pendingWithdrawals', value: 2, icon: <ArrowUp size={24} />, color: 'accent' as const },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.dashboard.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(k => (
          <KPIWidget 
            key={k.key}
            labelKey={`admin.dashboard.${k.key}`}
            value={k.value} 
            icon={k.icon} 
            color={k.color}
          />
        ))}
      </div>
      
      <RakeChart />
    </div>
  );
};

export default Dashboard;
