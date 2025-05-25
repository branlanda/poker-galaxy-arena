
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'payout';
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

const RealBalanceManager: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch real balance
      await new Promise(resolve => setTimeout(resolve, 1000));
      // This would be replaced with actual API call
      const mockBalance = 1250.75;
      setBalance(mockBalance);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el balance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Simulate API call to fetch transaction history
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'deposit',
          amount: 500,
          timestamp: new Date(Date.now() - 86400000),
          status: 'completed',
          description: 'Depósito con tarjeta'
        },
        {
          id: '2',
          type: 'bet',
          amount: -25,
          timestamp: new Date(Date.now() - 3600000),
          status: 'completed',
          description: 'Apuesta en mesa Texas Hold\'em'
        },
        {
          id: '3',
          type: 'payout',
          amount: 75,
          timestamp: new Date(Date.now() - 1800000),
          status: 'completed',
          description: 'Ganancia en mesa Texas Hold\'em'
        }
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'payout':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
      case 'bet':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Balance Actual
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBalance}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald">
            {isLoading ? (
              <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            ) : (
              formatAmount(balance)
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Balance disponible para jugar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay transacciones recientes
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.timestamp.toLocaleDateString()} - {transaction.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Completado' : 
                       transaction.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealBalanceManager;
