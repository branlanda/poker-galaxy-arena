
import React from 'react';
import { 
  Bell, 
  Calendar, 
  Trophy, 
  Users, 
  Gift, 
  AlertCircle, 
  ExternalLink,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TOURNAMENT_STARTING':
        return <Calendar className="h-5 w-5 text-emerald" />;
      case 'GAME_INVITE':
        return <Users className="h-5 w-5 text-blue-400" />;
      case 'ACHIEVEMENT':
        return <Trophy className="h-5 w-5 text-emerald" />;
      case 'FRIEND_REQUEST':
        return <Users className="h-5 w-5 text-purple-400" />;
      case 'REWARD':
        return <Gift className="h-5 w-5 text-yellow-400" />;
      default:
        return <Bell className="h-5 w-5 text-emerald" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 cursor-pointer transition-colors ${
        notification.is_read
          ? 'bg-navy/30 hover:bg-navy/50'
          : 'bg-emerald/5 hover:bg-emerald/10 border-l-2 border-l-emerald'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
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
          
          <p className={`text-sm mb-2 ${
            notification.is_read ? 'text-gray-400' : 'text-gray-300'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {formatTime(notification.created_at)}
            </p>
            
            <div className="flex items-center space-x-2">
              {notification.action_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-emerald hover:text-emerald hover:bg-emerald/10"
                  onClick={handleActionClick}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              
              {!notification.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
