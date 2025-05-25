
import React, { useState, useEffect } from 'react';
import { NotificationToast } from './NotificationToast';
import { useNotifications } from '@/hooks/useNotifications';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: any;
  actionUrl?: string;
}

export const NotificationToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const { notifications } = useNotifications();

  useEffect(() => {
    // Listen for new notifications and show them as toasts
    const recentNotifications = notifications.filter(notif => {
      const notifTime = new Date(notif.created_at).getTime();
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return notifTime > fiveMinutesAgo && !notif.is_read;
    });

    const newToasts = recentNotifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.notification_type,
      actionUrl: notif.action_url
    }));

    setToasts(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const trulyNew = newToasts.filter(t => !existingIds.has(t.id));
      return [...prev, ...trulyNew];
    });
  }, [notifications]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            transform: `translateY(${index * 90}px)`,
            zIndex: 50 - index 
          }}
          className="absolute top-0 right-0"
        >
          <NotificationToast
            id={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
            onAction={toast.actionUrl ? () => window.location.href = toast.actionUrl! : undefined}
            actionLabel={toast.actionUrl ? 'View' : undefined}
          />
        </div>
      ))}
    </div>
  );
};
