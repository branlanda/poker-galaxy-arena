
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import LegalComplianceDashboard from '@/components/legal/LegalComplianceDashboard';

const LegalCompliancePage: React.FC = () => {
  return (
    <AppLayout>
      <LegalComplianceDashboard />
    </AppLayout>
  );
};

export default LegalCompliancePage;
