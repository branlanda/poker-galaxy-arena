
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useTournamentNotifications } from '@/hooks/useTournamentNotifications';

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
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  id: string;
  player_id: string;
  notification_type: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const tournamentNotifications = useTournamentNotifications();
  
  // Combine regular notifications with tournament notifications
  const allNotifications = [
    ...notifications,
    ...tournamentNotifications.notifications.map(tn => ({
      id: tn.id,
      player_id: tn.player_id || '',
      title: tn.title,
      message: tn.message,
      notification_type: tn.notification_type,
      is_read: tn.is_read,
      created_at: tn.created_at,
      action_url: undefined,
      expires_at: undefined
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const unreadCount = allNotifications.filter(n => !n.is_read).length;
  
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

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('player_id', user.id);
        
      if (fetchError) throw fetchError;
      
      setPreferences(data || []);
    } catch (err: any) {
      console.error('Error fetching notification preferences:', err);
    }
  };
  
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    // Check if it's a tournament notification
    const isTournamentNotification = tournamentNotifications.notifications.find(tn => tn.id === id);
    if (isTournamentNotification) {
      return tournamentNotifications.markAsRead(id);
    }
    
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
      // Mark regular notifications as read
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('player_id', user.id)
        .eq('is_read', false);
        
      if (updateError) throw updateError;
      
      // Mark tournament notifications as read
      const unreadTournamentNotifications = tournamentNotifications.notifications.filter(tn => !tn.is_read);
      for (const notification of unreadTournamentNotifications) {
        await tournamentNotifications.markAsRead(notification.id);
      }
      
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

  const updatePreference = async (
    notificationType: string, 
    field: 'email_enabled' | 'push_enabled' | 'in_app_enabled', 
    value: boolean
  ) => {
    if (!user) return;
    
    try {
      const { error: updateError } = await supabase
        .from('notification_preferences')
        .upsert({
          player_id: user.id,
          notification_type: notificationType,
          [field]: value
        });
        
      if (updateError) throw updateError;
      
      setPreferences(prevPrefs => 
        prevPrefs.map(pref => 
          pref.notification_type === notificationType 
            ? { ...pref, [field]: value }
            : pref
        )
      );
      
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: string,
    actionUrl?: string,
    expiresAt?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_player_id: user.id,
        p_title: title,
        p_message: message,
        p_type: type,
        p_action_url: actionUrl,
        p_expires_at: expiresAt,
        p_metadata: metadata || {}
      });
      
      if (error) throw error;
      
      // Refresh notifications
      fetchNotifications();
      
      return data;
    } catch (err: any) {
      console.error('Error creating notification:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `player_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast notification if in-app notifications are enabled
            const pref = preferences.find(p => p.notification_type === newNotification.notification_type);
            if (!pref || pref.in_app_enabled) {
              toast({
                title: newNotification.title,
                description: newNotification.message,
                duration: 5000,
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `player_id=eq.${user.id}`
          },
          (payload) => {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === updatedNotification.id ? updatedNotification : notif
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, preferences]);
  
  return {
    notifications: allNotifications,
    preferences,
    loading: loading || tournamentNotifications.loading,
    error,
    unreadCount,
    fetchNotifications,
    fetchPreferences,
    markAsRead,
    markAllAsRead,
    updatePreference,
    createNotification
  };
}
