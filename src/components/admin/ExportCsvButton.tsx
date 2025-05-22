
import React from 'react';
import { useLedgerStore } from '@/stores/ledger';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { Download } from 'lucide-react';

export const ExportCsvButton = () => {
  const { t } = useTranslation();
  const entries = useLedgerStore(s => s.entries);
  
  const handleExport = () => {
    const csv = [
      ['Date','User','Type','Amount','Status'],
      ...entries.map(e => [
        new Date(e.date).toISOString().split('T')[0], 
        e.userAlias, 
        e.type, 
        e.amount.toFixed(2), 
        e.status
      ])
    ].map(r => r.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Button 
      variant="secondary" 
      onClick={handleExport}
      className="ml-auto"
    >
      <Download className="mr-2 h-4 w-4" />
      {t('admin.users.allStatus')}
    </Button>
  );
};
