
import React, { useState, useEffect } from 'react';
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
import { useAlertsStore } from '@/stores/alerts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const { alerts, fetchAlerts } = useAlertsStore();
  const [stats, setStats] = useState({
    activeUsers: 0,
    rake24h: '0',
    activeTables: 0,
    activeTournaments: 0,
    pendingWithdrawals: 0,
    avgSessionTime: '0'
  });
  
  useEffect(() => {
    fetchAlerts();
    fetchRealTimeStats();
    
    // Set up realtime subscription for alerts
    const alertsChannel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, () => {
        fetchAlerts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, [fetchAlerts]);
  
  const fetchRealTimeStats = async () => {
    try {
      // In a real app, these would be actual Supabase RPC calls
      // This is simplified for the demo
      
      // Example: const { data: activeUsers } = await supabase.rpc('get_active_users');
      // For now, using mock data
      
      setStats({
        activeUsers: 423,
        rake24h: '250 USDT',
        activeTables: 7,
        activeTournaments: 3,
        pendingWithdrawals: 2,
        avgSessionTime: '24 min'
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  // Computed KPIs based on stats
  const kpis = [
    { key: 'dau', value: stats.activeUsers, icon: <Users size={24} />, color: 'emerald' as const },
    { key: 'rake24h', value: stats.rake24h, icon: <Banknote size={24} />, color: 'gold' as const },
    { key: 'activeTournaments', value: stats.activeTournaments, icon: <Trophy size={24} />, color: 'emerald' as const },
    { key: 'pendingWithdrawals', value: stats.pendingWithdrawals, icon: <ArrowUp size={24} />, color: 'accent' as const },
    { key: 'activeTables', value: stats.activeTables, icon: <TableIcon size={24} />, color: 'emerald' as const },
    { key: 'avgSessionTime', value: stats.avgSessionTime, icon: <Clock size={24} />, color: 'gold' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.dashboard.title')}</h2>
        <Link to="/admin/export">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 rotate-45" />
            {t('admin.dashboard.exportData')}
          </Button>
        </Link>
      </div>
      
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">{t('admin.dashboard.alerts')}</h3>
          <Link to="/admin/security">
            <Button variant="link" className="text-sm text-emerald">
              {t('admin.dashboard.viewAllAlerts')}
            </Button>
          </Link>
        </div>
        <AlertsPanel alerts={alerts.filter(alert => !alert.resolved).slice(0, 5)} />
      </Card>
    </div>
  );
};

export default Dashboard;
