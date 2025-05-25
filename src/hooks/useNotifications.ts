
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  notification_type: string;
  is_read: boolean;
  read: boolean; // For backward compatibility
  createdAt: Date;
  created_at: string;
  action_url?: string;
  player_id?: string;
}

export interface NotificationPreference {
  id: string;
  player_id: string;
  notification_type: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedNotifications = (data || []).map(notif => ({
        ...notif,
        read: notif.is_read,
        createdAt: new Date(notif.created_at)
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('player_id', user.id);
      
      if (error) throw error;
      setPreferences(data || []);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'is_read' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      is_read: false,
      createdAt: new Date(),
      created_at: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const createNotification = async (
    title: string,
    message: string,
    type: string,
    actionUrl?: string,
    playerId?: string,
    meta?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          player_id: playerId || user.id,
          title,
          message,
          notification_type: type,
          action_url: actionUrl,
          meta: meta || {}
        });

      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
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

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
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

      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read: true, 
          is_read: true 
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const updatePreference = async (
    notificationType: string,
    field: 'in_app_enabled' | 'email_enabled' | 'push_enabled',
    value: boolean
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          player_id: user.id,
          notification_type: notificationType,
          [field]: value
        });

      if (error) throw error;
      await fetchPreferences();
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    preferences,
    loading,
    unreadCount,
    addNotification,
    createNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updatePreference,
    fetchNotifications,
    fetchPreferences
  };
};
