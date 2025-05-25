
import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from './NotificationToast';

export const NotificationToastContainer = () => {
  const { notifications, markAsRead } = useNotifications();
  const [toastQueue, setToastQueue] = useState<string[]>([]);

  useEffect(() => {
    // Only add new notifications to the queue if they're not already processed
    const unreadNotifications = notifications
      .filter(notification => !notification.read && !toastQueue.includes(notification.id))
      .map(notification => notification.id);

    if (unreadNotifications.length > 0) {
      setToastQueue(prev => [...prev, ...unreadNotifications]);
    }
  }, [notifications]); // Remove toastQueue from dependencies to prevent infinite loop

  const handleToastClose = (notificationId: string) => {
    markAsRead(notificationId);
    setToastQueue(prev => prev.filter(id => id !== notificationId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastQueue.map(notificationId => {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return null;

        return (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => handleToastClose(notification.id)}
          />
        );
      })}
    </div>
  );
};
