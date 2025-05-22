
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLedgerMocks } from '@/hooks/useLedgerMocks';
import { LedgerFilters } from '@/components/admin/LedgerFilters';
import { LedgerTable } from '@/components/admin/LedgerTable';

const Ledger = () => {
  const { t } = useTranslation();
  useLedgerMocks();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.sidebar.ledger')}</h2>
      
      <LedgerFilters />
      <LedgerTable />
    </div>
  );
};

export default Ledger;
