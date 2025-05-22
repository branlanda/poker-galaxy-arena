
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  created_at: string;
  status: string;
  tx_hash?: string;
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

  // Helper function to format transaction status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500">Completado</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pendiente</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Fallido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Helper function to format transaction hash
  const formatTxHash = (hash?: string) => {
    if (!hash) return "N/A";
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Movimientos recientes</h2>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">No hay movimientos recientes</TableCell>
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
                    {entry.tx_hash ? (
                      <a 
                        href={`https://tronscan.org/#/transaction/${entry.tx_hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {formatTxHash(entry.tx_hash)}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(entry.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LedgerTable;
