
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLedgerMocks } from '@/hooks/useLedgerMocks';
import { LedgerFilters } from '@/components/admin/LedgerFilters';
import { LedgerTable } from '@/components/admin/LedgerTable';
import { Skeleton } from '@/components/ui/skeleton';

const Ledger = () => {
  const { t } = useTranslation();
  const { loading } = useLedgerMocks();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.sidebar.ledger')}</h2>
      
      <LedgerFilters />
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <LedgerTable />
      )}
    </div>
  );
};

export default Ledger;
