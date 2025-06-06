
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { useAuthSync } from '@/hooks/useAuthSync';
import AppRoutes from '@/components/routing/AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  useAuthSync();
  
  return (
    <Router>
      <AnalyticsProvider>
        <AppRoutes />
        <Toaster />
      </AnalyticsProvider>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
