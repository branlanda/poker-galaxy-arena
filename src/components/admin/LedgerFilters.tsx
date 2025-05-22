
import React from 'react';
import { useLedgerStore } from '@/stores/ledger';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { ExportCsvButton } from './ExportCsvButton';

export const LedgerFilters = () => {
  const { t } = useTranslation();
  const setFilters = useLedgerStore(s => s.setFilters);
  
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select 
        onChange={e => setFilters({ type: e.target.value || undefined })} 
        className="bg-[#0e2337] border border-emerald/10 rounded px-4 py-2 text-sm"
      >
        <option value="">{t('admin.users.allStatus')}</option>
        {['DEPOSIT','WITHDRAW','RAKE','PAYOUT','REFERRAL'].map(type => (
          <option key={type} value={type}>{type.toLowerCase()}</option>
        ))}
      </select>
      <Input 
        type="date" 
        onChange={e => setFilters({ from: e.target.value })} 
        className="w-auto" 
        placeholder="From"
      />
      <Input 
        type="date" 
        onChange={e => setFilters({ to: e.target.value })} 
        className="w-auto" 
        placeholder="To"
      />
      <ExportCsvButton />
    </div>
  );
};
