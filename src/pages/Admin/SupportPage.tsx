
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import SupportDashboard from '@/components/support/SupportDashboard';

const SupportPage: React.FC = () => {
  return (
    <AppLayout>
      <SupportDashboard />
    </AppLayout>
  );
};

export default SupportPage;
