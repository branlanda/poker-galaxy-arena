
import React from 'react';
import { LedgerEntry } from '@/stores/ledger';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const LedgerRow = ({ entry }: { entry: LedgerEntry }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-700/20 text-emerald-400';
      case 'PENDING': return 'bg-amber-700/20 text-amber-400';
      case 'FAILED': return 'bg-red-700/20 text-red-400';
      default: return 'bg-gray-700/20 text-gray-400';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'DEPOSIT': return 'bg-emerald-700/20 text-emerald-400';
      case 'WITHDRAW': return 'bg-amber-700/20 text-amber-400';
      case 'RAKE': return 'bg-purple-700/20 text-purple-400';
      case 'PAYOUT': return 'bg-blue-700/20 text-blue-400';
      case 'REFERRAL': return 'bg-gold-700/20 text-gold-400';
      default: return 'bg-gray-700/20 text-gray-400';
    }
  };

  return (
    <TableRow className="hover:bg-[#0e2337]">
      <TableCell>{new Date(entry.date).toLocaleString()}</TableCell>
      <TableCell>{entry.userAlias}</TableCell>
      <TableCell>
        <Badge className={getTypeColor(entry.type)}>
          {entry.type}
        </Badge>
      </TableCell>
      <TableCell className="font-mono">${entry.amount.toFixed(2)}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(entry.status)}>
          {entry.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
