
import React from 'react';
import { useLedgerStore } from '@/stores/ledger';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { ExportCsvButton } from './ExportCsvButton';

interface LedgerFiltersProps {
  onFilterChange?: (filters: Partial<{ type?: string; from?: string; to?: string }>) => void;
  currentFilters?: { type?: string; from?: string; to?: string };
}

export const LedgerFilters = ({ onFilterChange, currentFilters }: LedgerFiltersProps = {}) => {
  const { t } = useTranslation();
  const setFilters = useLedgerStore(s => s.setFilters);
  
  const handleFilterChange = (filter: Partial<{ type?: string; from?: string; to?: string }>) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      setFilters(filter);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select 
        onChange={e => handleFilterChange({ type: e.target.value || undefined })} 
        className="bg-[#0e2337] border border-emerald/10 rounded px-4 py-2 text-sm"
        value={currentFilters?.type || ''}
      >
        <option value="">{t('admin.users.allStatus')}</option>
        {['DEPOSIT','WITHDRAW','RAKE','PAYOUT','REFERRAL'].map(type => (
          <option key={type} value={type}>{type.toLowerCase()}</option>
        ))}
      </select>
      <Input 
        type="date" 
        onChange={e => handleFilterChange({ from: e.target.value })} 
        className="w-auto" 
        placeholder="From"
        value={currentFilters?.from || ''}
      />
      <Input 
        type="date" 
        onChange={e => handleFilterChange({ to: e.target.value })} 
        className="w-auto" 
        placeholder="To"
        value={currentFilters?.to || ''}
      />
      <ExportCsvButton />
    </div>
  );
};
