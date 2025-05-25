
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthSync } from '@/hooks/useAuthSync';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { NotificationToastContainer } from '@/components/notifications/NotificationToastContainer';
import { GlobalPresenceTracker } from '@/components/presence/GlobalPresenceTracker';
import { OfflineIndicator } from '@/components/network/OfflineIndicator';
import { AppRoutes } from '@/components/routing/AppRoutes';

function App() {
  useAuthSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <GlobalPresenceTracker />
        <OfflineIndicator isOnline={isOnline} />
        <AppRoutes />
        <Toaster />
        <NotificationToastContainer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
