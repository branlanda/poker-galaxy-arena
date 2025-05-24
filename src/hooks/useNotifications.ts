
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  player_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  expires_at?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setNotifications(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('player_id', user.id);
        
      if (updateError) throw updateError;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };
  
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('player_id', user.id)
        .eq('is_read', false);
        
      if (updateError) throw updateError;
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
