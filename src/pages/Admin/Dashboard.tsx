import React, { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { PieChart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ total_users: number; total_tables: number }>({
    total_users: 0,
    total_tables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
        if (error) throw error;
        setStats(data);
      } catch (error: any) {
        toast({
          title: t('errors.failedToLoad'),
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast, t]);

  if (!user) {
    return <div>{t('loading')}...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.totalUsers')}</CardTitle>
            <CardDescription>{t('admin.registeredUsers')}</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? t('loading') + '...' : stats.total_users}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.totalTables')}</CardTitle>
            <CardDescription>{t('admin.activePokerTables')}</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? t('loading') + '...' : stats.total_tables}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.chatModeration')}</CardTitle>
            <CardDescription>{t('admin.moderateChat')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin/chat-moderation')} variant="secondary">
              <PieChart className="w-4 h-4 mr-2" />
              {t('admin.goToChatModeration')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
