
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LedgerEntry {
  id: string;
  type: 'deposit' | 'withdraw' | 'game_win' | 'game_loss' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
  txHash?: string;
}

interface LedgerTableProps {
  entries: LedgerEntry[];
}

const LedgerTable: React.FC<LedgerTableProps> = ({ entries }) => {
  const getTypeLabel = (type: LedgerEntry['type']) => {
    switch (type) {
      case 'deposit': return 'Depósito';
      case 'withdraw': return 'Retiro';
      case 'game_win': return 'Ganancia';
      case 'game_loss': return 'Pérdida';
      case 'bonus': return 'Bonus';
      default: return type;
    }
  };

  const getStatusBadge = (status: LedgerEntry['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Completado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">Pendiente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Fallido</Badge>;
    }
  };

  const getAmountColor = (type: LedgerEntry['type']) => {
    return ['deposit', 'game_win', 'bonus'].includes(type) ? 'text-green-400' : 'text-red-400';
  };

  const getAmountPrefix = (type: LedgerEntry['type']) => {
    return ['deposit', 'game_win', 'bonus'].includes(type) ? '+' : '-';
  };

  return (
    <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Historial de transacciones</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white">No hay transacciones registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-emerald/20">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{getTypeLabel(entry.type)}</span>
                    {getStatusBadge(entry.status)}
                  </div>
                  <p className="text-white text-sm">{entry.description}</p>
                  <p className="text-white text-xs">
                    {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                  {entry.txHash && (
                    <p className="text-white text-xs font-mono">
                      TX: {entry.txHash.slice(0, 10)}...{entry.txHash.slice(-10)}
                    </p>
                  )}
                </div>
                <div className={`text-lg font-bold ${getAmountColor(entry.type)}`}>
                  {getAmountPrefix(entry.type)}{Math.abs(entry.amount).toFixed(2)} USDT
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LedgerTable;
