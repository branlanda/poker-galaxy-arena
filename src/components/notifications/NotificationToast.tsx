
import React from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationToastProps {
  id: string;
  title: string;
  message: string;
  type: 'TOURNAMENT_STARTING' | 'GAME_INVITE' | 'ACHIEVEMENT' | 'FRIEND_REQUEST' | 'REWARD' | 'SYSTEM_MESSAGE';
  onClose: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  title,
  message,
  type,
  onClose,
  onAction,
  actionLabel,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'TOURNAMENT_STARTING':
        return <Trophy className="h-5 w-5 text-emerald" />;
      case 'ACHIEVEMENT':
        return <CheckCircle className="h-5 w-5 text-emerald" />;
      case 'GAME_INVITE':
        return <Bell className="h-5 w-5 text-blue-400" />;
      case 'FRIEND_REQUEST':
        return <Info className="h-5 w-5 text-purple-400" />;
      case 'REWARD':
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'TOURNAMENT_STARTING':
        return 'bg-emerald/20 border-emerald/30';
      case 'ACHIEVEMENT':
        return 'bg-emerald/20 border-emerald/30';
      case 'GAME_INVITE':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'FRIEND_REQUEST':
        return 'bg-purple-500/20 border-purple-500/30';
      case 'REWARD':
        return 'bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'bg-navy/90 border-emerald/20';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-20 right-4 z-50 w-80 p-4 rounded-lg border backdrop-blur-lg transition-all duration-300 ease-in-out',
        getBackgroundColor(),
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-300 mb-2">{message}</p>
          
          {onAction && actionLabel && (
            <Button
              size="sm"
              variant="outline"
              className="bg-emerald/10 border-emerald hover:bg-emerald/20 text-emerald"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
