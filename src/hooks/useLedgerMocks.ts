
import { useEffect } from 'react';
import { useLedgerStore, LedgerEntry } from '@/stores/ledger';

const mockEntries: LedgerEntry[] = Array.from({ length: 50 }, (_, i) => ({
  id: `e${i}`,
  date: new Date(Date.now() - i * 3600_000).toISOString(),
  userAlias: `Player${i % 10}`,
  type: ['DEPOSIT','WITHDRAW','RAKE','PAYOUT','REFERRAL'][i % 5] as any,
  amount: parseFloat((Math.random() * 200).toFixed(2)),
  status: ['COMPLETED','PENDING','FAILED'][i % 3] as any,
}));

export function useLedgerMocks() {
  const { setEntries, setLoading } = useLedgerStore();
  
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setEntries(mockEntries.slice(0, 20));
      setLoading(false);
    }, 800);
  }, []);
}
