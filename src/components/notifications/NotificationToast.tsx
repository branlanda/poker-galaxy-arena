
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
        return 'bg-emerald border-emerald/50 text-white';
      case 'error':
        return 'bg-red-600 border-red-500 text-white';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500 text-white';
      default:
        return 'bg-slate-800 border-emerald/20 text-white';
    }
  };

  return (
    <div className={`${getTypeStyles()} p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-white">{notification.title}</h4>
          <p className="text-sm opacity-90 mt-1 text-gray-200">{notification.message}</p>
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
