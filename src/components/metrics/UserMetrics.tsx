import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Activity, Users, Clock, TrendingUp } from 'lucide-react';

interface MetricsData {
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  conversionRate: number;
  popularPages: Array<{ page: string; views: number }>;
  userActions: Array<{ action: string; count: number }>;
}

export const UserMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;

      try {
        // Fetch analytics data
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const { data: events } = await supabase
          .from('analytics_events')
          .select('*')
          .gte('timestamp', oneDayAgo.toISOString());

        if (events) {
          // Calculate metrics
          const uniqueUsers = new Set(events.map(e => e.user_id)).size;
          const uniqueSessions = new Set(events.map(e => e.session_id)).size;
          
          // Calculate average session duration
          const sessionDurations = Array.from(new Set(events.map(e => e.session_id)))
            .map(sessionId => {
              const sessionEvents = events.filter(e => e.session_id === sessionId);
              if (sessionEvents.length < 2) return 0;
              
              const times = sessionEvents.map(e => new Date(e.timestamp).getTime());
              return Math.max(...times) - Math.min(...times);
            });
          
          const avgDuration = sessionDurations.length > 0 
            ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
            : 0;

          // Calculate popular pages
          const pageViews = events.filter(e => e.event_name === 'page_view');
          const pageCount: Record<string, number> = {};
          
          pageViews.forEach(event => {
            const page = event.properties?.page || 'unknown';
            pageCount[page] = (pageCount[page] || 0) + 1;
          });

          const popularPages = Object.entries(pageCount)
            .map(([page, views]) => ({ page, views: Number(views) }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

          // Calculate user actions
          const userActionEvents = events.filter(e => e.event_name === 'user_action');
          const actionCount: Record<string, number> = {};
          
          userActionEvents.forEach(event => {
            const action = event.properties?.action || 'unknown';
            actionCount[action] = (actionCount[action] || 0) + 1;
          });

          const topActions = Object.entries(actionCount)
            .map(([action, count]) => ({ action, count: Number(count) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setMetrics({
            activeUsers: uniqueUsers,
            totalSessions: uniqueSessions,
            averageSessionDuration: avgDuration,
            conversionRate: uniqueUsers > 0 ? (uniqueSessions / uniqueUsers) * 100 : 0,
            popularPages,
            userActions: topActions
          });
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No metrics available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics.averageSessionDuration / 60000)}m
            </div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Session/user ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.popularPages.map(({ page, views }) => (
                <div key={page} className="flex justify-between items-center">
                  <span className="text-sm">{page}</span>
                  <Badge variant="secondary">{views} views</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top User Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.userActions.map(({ action, count }) => (
                <div key={action} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{action.replace('_', ' ')}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
