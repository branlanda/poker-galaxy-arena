
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Notification } from '@/types/community';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data ? data.filter(n => !n.is_read).length : 0);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('player_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast({
        title: t('errors.actionFailed'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('player_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: t('notifications.allMarkedAsRead'),
      });
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: t('errors.actionFailed'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Set up real-time notifications
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    
    // Subscribe to notifications changes
    const channel = supabase
      .channel('notifications_channel')
      .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `player_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            
            // Update state
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
