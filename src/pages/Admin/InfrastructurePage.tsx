
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import InfrastructureMonitoringDashboard from '@/components/infrastructure/InfrastructureMonitoringDashboard';

const InfrastructurePage: React.FC = () => {
  return (
    <AppLayout>
      <InfrastructureMonitoringDashboard />
    </AppLayout>
  );
};

export default InfrastructurePage;
