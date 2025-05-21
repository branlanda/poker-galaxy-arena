
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  created_at: string;
  status: string;
}

interface LedgerTableProps {
  entries: LedgerEntry[];
}

const LedgerTable: React.FC<LedgerTableProps> = ({ entries = [] }) => {
  // Helper function to format transaction types
  const formatType = (type: string) => {
    const types: Record<string, string> = {
      'DEPOSIT': 'Depósito',
      'WITHDRAW': 'Retiro',
      'RAKE': 'Rake',
      'PAYOUT': 'Pago',
      'REFERRAL': 'Referido',
      'HOLD': 'Retenido',
      'RELEASE': 'Liberado'
    };
    return types[type] || type;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Movimientos recientes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">No hay movimientos recientes</TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                <TableCell>{formatType(entry.type)}</TableCell>
                <TableCell className={entry.type === 'DEPOSIT' || entry.type === 'PAYOUT' ? 'text-green-500' : entry.type === 'WITHDRAW' || entry.type === 'RAKE' ? 'text-red-500' : ''}>
                  {entry.type === 'DEPOSIT' || entry.type === 'PAYOUT' ? '+' : entry.type === 'WITHDRAW' || entry.type === 'RAKE' ? '-' : ''}
                  {Math.abs(entry.amount).toFixed(2)} USDT
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    entry.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    entry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    entry.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100'
                  }`}>
                    {entry.status === 'COMPLETED' ? 'Completado' : 
                     entry.status === 'PENDING' ? 'Pendiente' : 
                     entry.status === 'FAILED' ? 'Fallido' : entry.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LedgerTable;
