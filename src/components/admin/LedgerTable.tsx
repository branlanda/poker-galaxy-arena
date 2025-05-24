
import React, { useMemo } from 'react';
import { useLedgerStore } from '@/stores/ledger';
import { LedgerRow } from './LedgerRow';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead,
  TableCell
} from '@/components/ui/table';

export const LedgerTable = () => {
  const { t } = useTranslation();
  const { entries, filters, page, loadMore, loading } = useLedgerStore();
  
  const filtered = useMemo(() => 
    entries
      .filter(e => !filters.type || e.type === filters.type)
      .filter(e => !filters.from || new Date(e.date) >= new Date(filters.from))
      .filter(e => !filters.to || new Date(e.date) <= new Date(filters.to)),
    [entries, filters]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-12"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-16"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-emerald/10 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, page * 20).map(e => <LedgerRow key={e.id} entry={e} />)}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filtered.length > page * 20 && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMore} variant="outline">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};
