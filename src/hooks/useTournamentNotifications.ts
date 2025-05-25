
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { toast } from '@/hooks/use-toast';

export interface TournamentNotification {
  id: string;
  tournament_id: string;
  player_id: string | null;
  notification_type: 'tournament_starting' | 'tournament_started' | 'player_eliminated' | 'blind_level_change' | 'break_started' | 'break_ended' | 'final_table' | 'tournament_completed';
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export function useTournamentNotifications() {
  const [notifications, setNotifications] = useState<TournamentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournament_notifications')
        .select('*')
        .or(`player_id.eq.${user.id},player_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      console.error('Error fetching tournament notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tournament_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('player_id', user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  const createNotification = async (
    tournamentId: string,
    type: TournamentNotification['notification_type'],
    title: string,
    message: string,
    playerId?: string,
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('tournament_notifications')
        .insert({
          tournament_id: tournamentId,
          player_id: playerId || null,
          notification_type: type,
          title,
          message,
          data: data || {}
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error creating notification:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to real-time notifications
      const channel = supabase
        .channel('tournament-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'tournament_notifications',
            filter: `player_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as TournamentNotification;
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: 5000,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    createNotification,
    fetchNotifications
  };
}
