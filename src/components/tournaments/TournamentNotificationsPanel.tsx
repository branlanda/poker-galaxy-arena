
import React from 'react';
import { useTournamentNotifications } from '@/hooks/useTournamentNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Clock, Trophy, Users, AlertCircle } from 'lucide-react';

interface TournamentNotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const TournamentNotificationsPanel: React.FC<TournamentNotificationsPanelProps> = ({
  open,
  onClose
}) => {
  const { notifications, loading, unreadCount, markAsRead } = useTournamentNotifications();
  const { t } = useTranslation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tournament_starting':
      case 'tournament_started':
        return <Trophy className="h-4 w-4 text-emerald" />;
      case 'player_eliminated':
        return <Users className="h-4 w-4 text-red-500" />;
      case 'blind_level_change':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'break_started':
      case 'break_ended':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'final_table':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'tournament_completed':
        return <Trophy className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('notifications.justNow', 'Just now');
    if (diffInMinutes < 60) return t('notifications.minutesAgo', `${diffInMinutes}m ago`);
    if (diffInMinutes < 1440) return t('notifications.hoursAgo', `${Math.floor(diffInMinutes / 60)}h ago`);
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-navy border-emerald/20 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald" />
            {t('tournaments.notifications.title', 'Tournament Notifications')}
            {unreadCount > 0 && (
              <Badge className="bg-emerald/20 text-emerald border-emerald/30">
                {unreadCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {t('tournaments.notifications.description', 'Stay updated with your tournament activity')}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-navy/70 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    notification.is_read
                      ? 'bg-navy/30 border-gray-600 hover:bg-navy/50'
                      : 'bg-emerald/10 border-emerald/30 hover:bg-emerald/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${
                          notification.is_read ? 'text-gray-300' : 'text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-emerald rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.is_read ? 'text-gray-400' : 'text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('tournaments.notifications.empty', 'No Notifications')}
              </h3>
              <p className="text-gray-400">
                {t('tournaments.notifications.emptyDescription', 'Tournament notifications will appear here')}
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
