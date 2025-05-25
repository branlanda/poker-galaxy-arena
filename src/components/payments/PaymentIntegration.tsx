
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, QrCode, Shield } from 'lucide-react';
import StripeCheckout from './StripeCheckout';
import RealBalanceManager from './RealBalanceManager';

const PaymentIntegration: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState(50);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = [25, 50, 100, 250, 500];

  const handleDepositSuccess = () => {
    setShowStripeCheckout(false);
    toast({
      title: "Depósito exitoso",
      description: `Se han añadido $${depositAmount} a su cuenta`,
    });
  };

  const handleDepositError = (error: string) => {
    setShowStripeCheckout(false);
    toast({
      title: "Error en depósito",
      description: error,
      variant: "destructive",
    });
  };

  const handleWithdraw = async () => {
    if (withdrawAmount < 10) {
      toast({
        title: "Error",
        description: "El monto mínimo de retiro es $10",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawMethod) {
      toast({
        title: "Error",
        description: "Seleccione un método de retiro",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Retiro procesado",
        description: `Su retiro de $${withdrawAmount} está siendo procesado`,
      });
      
      setWithdrawAmount(0);
      setWithdrawMethod('');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el retiro",
        variant: "destructive",
      });
    }
  };

  if (showStripeCheckout) {
    return (
      <div className="flex justify-center">
        <StripeCheckout
          amount={depositAmount}
          onSuccess={handleDepositSuccess}
          onError={handleDepositError}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Sistema de Pagos</h1>
      </div>

      <RealBalanceManager />

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Depósito</TabsTrigger>
          <TabsTrigger value="withdraw">Retiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Depositar Fondos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Seleccione el monto</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={depositAmount === amount ? "default" : "outline"}
                      onClick={() => setDepositAmount(amount)}
                      className="h-12"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customAmount">O ingrese un monto personalizado</Label>
                <Input
                  id="customAmount"
                  type="number"
                  min="5"
                  max="10000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  placeholder="Monto en USD"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Pago Seguro</span>
                </div>
                <p className="text-sm text-blue-700">
                  Los pagos son procesados de forma segura a través de Stripe. 
                  Aceptamos tarjetas de crédito y débito principales.
                </p>
              </div>

              <Button
                onClick={() => setShowStripeCheckout(true)}
                className="w-full"
                size="lg"
                disabled={depositAmount < 5}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Depositar ${depositAmount}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Retirar Fondos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Monto a retirar</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  min="10"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  placeholder="Monto mínimo $10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawMethod">Método de retiro</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione método de retiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Transferencia Bancaria</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Criptomonedas</SelectItem>
                    <SelectItem value="coinpal">CoinPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawMethod === 'bank' && (
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Cuenta bancaria</Label>
                  <Input
                    id="bankAccount"
                    placeholder="Ingrese número de cuenta"
                  />
                </div>
              )}

              {withdrawMethod === 'paypal' && (
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">Email de PayPal</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="usuario@email.com"
                  />
                </div>
              )}

              {withdrawMethod === 'crypto' && (
                <div className="space-y-2">
                  <Label htmlFor="cryptoAddress">Dirección de wallet</Label>
                  <Input
                    id="cryptoAddress"
                    placeholder="Dirección de criptomoneda"
                  />
                </div>
              )}

              {withdrawMethod === 'coinpal' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">CoinPal Integration</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Los retiros a través de CoinPal se procesan en criptomonedas estables.
                  </p>
                </div>
              )}

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Los retiros pueden tardar de 1-3 días hábiles en procesarse.
                  Se aplicará una comisión del 2.5% sobre el monto retirado.
                </p>
              </div>

              <Button
                onClick={handleWithdraw}
                className="w-full"
                size="lg"
                disabled={withdrawAmount < 10 || !withdrawMethod}
              >
                Solicitar Retiro de ${withdrawAmount}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentIntegration;
