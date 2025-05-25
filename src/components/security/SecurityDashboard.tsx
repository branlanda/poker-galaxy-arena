
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionValidator from './TransactionValidator';
import FraudDetectionPanel from './FraudDetectionPanel';
import { useTransactionVerification } from '@/hooks/useTransactionVerification';
import { useAntiFraud } from '@/hooks/useAntiFraud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  const { transactions, loading: txLoading } = useTransactionVerification();
  const { alerts, loading: alertsLoading } = useAntiFraud();

  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;
  const activeAlerts = alerts.filter(alert => alert.status === 'new' || alert.status === 'investigating').length;
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Centro de Seguridad</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{txLoading ? '...' : pendingTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {alertsLoading ? '...' : activeAlerts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Resueltas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {alertsLoading ? '...' : resolvedAlerts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Activo</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="validator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validator">Validador</TabsTrigger>
          <TabsTrigger value="fraud">Detección de Fraude</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validator" className="space-y-4">
          <TransactionValidator />
        </TabsContent>
        
        <TabsContent value="fraud" className="space-y-4">
          <FraudDetectionPanel />
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoreo en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Panel de monitoreo en tiempo real próximamente disponible.
                Aquí se mostrarán métricas de seguridad en vivo y alertas automáticas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
