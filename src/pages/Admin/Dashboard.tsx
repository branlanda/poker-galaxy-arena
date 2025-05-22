
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import KPIWidget from '@/components/admin/KPIWidget';
import RakeChart from '@/components/admin/RakeChart';
import { useTranslation } from '@/hooks/useTranslation';
import { Users, Banknote, Trophy, ArrowUp, Clock, Table as TableIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveUsersWidget from '@/components/admin/ActiveUsersWidget';
import TableActivityWidget from '@/components/admin/TableActivityWidget';
import TransactionVolumeChart from '@/components/admin/TransactionVolumeChart';
import AlertsPanel from '@/components/admin/AlertsPanel';

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Mock KPI data - in production, this would come from an API call
  const kpis = [
    { key: 'dau', value: 423, icon: <Users size={24} />, color: 'emerald' as const },
    { key: 'rake24h', value: '250 USDT', icon: <Banknote size={24} />, color: 'gold' as const },
    { key: 'activeTournaments', value: 3, icon: <Trophy size={24} />, color: 'emerald' as const },
    { key: 'pendingWithdrawals', value: 2, icon: <ArrowUp size={24} />, color: 'accent' as const },
    { key: 'activeTables', value: 7, icon: <TableIcon size={24} />, color: 'emerald' as const },
    { key: 'avgSessionTime', value: '24 min', icon: <Clock size={24} />, color: 'gold' as const },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.dashboard.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active users widget */}
        <Card className="p-4">
          <h3 className="font-medium text-lg mb-4">{t('admin.dashboard.activeUsers')}</h3>
          <ActiveUsersWidget />
        </Card>

        {/* Table activity widget */}
        <Card className="p-4">
          <h3 className="font-medium text-lg mb-4">{t('admin.dashboard.tableActivity')}</h3>
          <TableActivityWidget />
        </Card>
      </div>
      
      <Tabs defaultValue="rake" className="w-full">
        <TabsList>
          <TabsTrigger value="rake">{t('admin.dashboard.rake')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('admin.dashboard.transactions')}</TabsTrigger>
        </TabsList>
        <TabsContent value="rake" className="mt-2">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">{t('admin.dashboard.rakeOverTime')}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('day')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'day' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.day')}
                </button>
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'week' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.week')}
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'month' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.month')}
                </button>
              </div>
            </div>
            <RakeChart />
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="mt-2">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">{t('admin.dashboard.transactionVolume')}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('day')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'day' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.day')}
                </button>
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'week' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.week')}
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'month' ? 'bg-emerald/20 text-emerald' : 'bg-muted'}`}
                >
                  {t('admin.timeRange.month')}
                </button>
              </div>
            </div>
            <TransactionVolumeChart timeRange={timeRange} />
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="p-4">
        <h3 className="font-medium text-lg mb-4">{t('admin.dashboard.alerts')}</h3>
        <AlertsPanel />
      </Card>
    </div>
  );
};

export default Dashboard;
