
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useAuth } from '@/stores/auth';

export const NotificationButton: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  
  if (!user) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-slate-700/50"
        onClick={() => setShowPanel(true)}
      >
        <Bell className="h-5 w-5 text-gray-300" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald text-[10px] font-medium flex items-center justify-center text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      <NotificationPanel
        open={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </>
  );
};
