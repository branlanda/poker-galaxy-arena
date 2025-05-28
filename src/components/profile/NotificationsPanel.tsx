
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Bell, UserPlus, Calendar, Award, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/community';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  open,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchNotifications();
    }
  }, [open, user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
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
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true } 
            : notif
        )
      );
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleFriendRequest = async (notificationId: string, friendId: string, accept: boolean) => {
    if (!user) return;
    
    try {
      // Update the friend request status in the friends table
      const { error: updateError } = await supabase
        .from('friends')
        .update({ 
          status: accept ? 'ACCEPTED' : 'REJECTED',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);
      
      if (updateError) throw updateError;
      
      // If accepted, create a reciprocal relationship
      if (accept) {
        await supabase
          .from('friends')
          .insert({
            user_id: user.id,
            friend_id: friendId,
            status: 'ACCEPTED'
          });
      }
      
      // Mark the notification as read
      await markAsRead(notificationId);
      
      // Show success toast
      toast({
        title: accept 
          ? t('notifications.friendRequestAccepted') 
          : t('notifications.friendRequestRejected'),
      });
      
      // Refresh notifications
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: t('errors.actionFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return <UserPlus className="h-5 w-5 text-blue-400" />;
      case 'ACHIEVEMENT':
        return <Award className="h-5 w-5 text-emerald" />;
      case 'GAME_INVITE':
        return <Calendar className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-emerald" />;
    }
  };

  const renderNotificationActions = (notification: Notification) => {
    // Extract friend ID from meta if this is a friend request
    const friendId = notification.notification_type === 'FRIEND_REQUEST' 
      ? (notification.action_url?.split('/')?.[1] || '') 
      : '';

    switch (notification.notification_type) {
      case 'FRIEND_REQUEST':
        return (
          <div className="flex space-x-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-emerald/10 border-emerald hover:bg-emerald/20 text-emerald hover:text-emerald"
              onClick={() => handleFriendRequest(notification.id, friendId, true)}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('accept')}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-red-500/10 border-red-500 hover:bg-red-500/20 text-red-400 hover:text-red-400"
              onClick={() => handleFriendRequest(notification.id, friendId, false)}
            >
              <X className="h-4 w-4 mr-1" />
              {t('decline')}
            </Button>
          </div>
        );
      default:
        if (notification.is_read) {
          return null;
        }
        return (
          <Button 
            size="sm" 
            variant="ghost" 
            className="mt-2 text-gray-300 hover:text-white"
            onClick={() => markAsRead(notification.id)}
          >
            {t('notifications.markAsRead')}
          </Button>
        );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg border border-emerald/20 rounded-lg w-full max-w-md overflow-hidden animate-in slide-in-from-right">
        <div className="p-4 border-b border-emerald/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-emerald" />
            <h2 className="text-lg font-medium text-white">
              {t('notifications.title')}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-300 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-400">{t('loading')}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-gray-500" />
              <p className="mt-4 text-gray-400">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            <div className="divide-y divide-emerald/10">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${notification.is_read ? 'bg-slate-800/30' : 'bg-emerald/5'}`}
                >
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-white">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                      
                      {renderNotificationActions(notification)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
