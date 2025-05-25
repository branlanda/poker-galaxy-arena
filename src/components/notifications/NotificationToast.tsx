
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className={`${getTypeStyles()} text-white p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
