
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'crypto' | 'bank';
  status: 'active' | 'pending' | 'inactive';
  lastUsed?: string;
}

const PaymentIntegration: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Visa **** 4242',
      type: 'card',
      status: 'active',
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      name: 'Bitcoin Wallet',
      type: 'crypto',
      status: 'active',
      lastUsed: '2024-01-10'
    },
    {
      id: '3',
      name: 'Bank Transfer',
      type: 'bank',
      status: 'pending'
    }
  ];

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({
        title: "Monto inválido",
        description: "El monto mínimo es $10 USD",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Pago procesado",
        description: `Depósito de $${amount} USD procesado exitosamente`,
      });
      
      setAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Activo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">Pendiente</Badge>;
      default:
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Inactivo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="h-5 w-5" />
            Sistema de Pagos Integrado
          </CardTitle>
          <p className="text-gray-300">
            Realiza depósitos seguros usando Stripe y otros métodos de pago confiables.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-emerald/20">
          <TabsTrigger value="deposit" className="text-white data-[state=active]:bg-emerald data-[state=active]:text-white">
            Depositar
          </TabsTrigger>
          <TabsTrigger value="methods" className="text-white data-[state=active]:bg-emerald data-[state=active]:text-white">
            Métodos de Pago
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <Card className="bg-transparent border-emerald/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Realizar Depósito</CardTitle>
              <p className="text-gray-300">
                Agrega fondos a tu cuenta de forma segura
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Monto (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.00"
                  min="10"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-emerald/20 text-white placeholder-gray-300"
                />
                <p className="text-sm text-gray-300">
                  Monto mínimo: $10 USD
                </p>
              </div>

              <div className="border border-emerald/20 rounded-lg p-4 bg-slate-800/30">
                <h4 className="font-medium text-white mb-2">Información de Seguridad</h4>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Shield className="h-4 w-4 text-emerald" />
                  <span>Pagos procesados de forma segura por Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                  <Shield className="h-4 w-4 text-emerald" />
                  <span>Cifrado SSL de 256 bits</span>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading || !amount}
                className="w-full bg-emerald hover:bg-emerald/90 text-white"
              >
                {loading ? "Procesando..." : `Depositar $${amount || '0'} USD`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="bg-transparent border-emerald/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg border border-emerald/20">
                      <CreditCard className="h-5 w-5 text-emerald" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{method.name}</h4>
                      <p className="text-sm text-gray-300">
                        {method.lastUsed ? `Último uso: ${method.lastUsed}` : 'Nunca usado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(method.status)}
                    {getStatusBadge(method.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-transparent border-emerald/20 backdrop-blur-sm border-dashed">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h4 className="font-medium text-white mb-2">Agregar Método de Pago</h4>
              <p className="text-gray-300 mb-4">
                Conecta una nueva tarjeta de crédito o método de pago
              </p>
              <Button variant="outline" className="border-emerald/20 text-white hover:bg-emerald/10 bg-transparent">
                Agregar Método
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentIntegration;
