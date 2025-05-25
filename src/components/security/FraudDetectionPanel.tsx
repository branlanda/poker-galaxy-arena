
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Eye, Ban, CheckCircle, Clock } from 'lucide-react';

interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  type: 'velocity' | 'amount' | 'location' | 'pattern' | 'device';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  metadata: any;
}

const FraudDetectionPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFraudAlerts();
  }, []);

  const loadFraudAlerts = async () => {
    setLoading(true);
    try {
      // Simulate loading fraud alerts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAlerts: FraudAlert[] = [
        {
          id: '1',
          userId: 'user123',
          userName: 'Juan Pérez',
          type: 'velocity',
          severity: 'high',
          description: 'Múltiples transacciones en corto período de tiempo',
          timestamp: new Date(Date.now() - 300000),
          status: 'new',
          metadata: { transactionCount: 15, timeWindow: '5 minutos' }
        },
        {
          id: '2',
          userId: 'user456',
          userName: 'María García',
          type: 'amount',
          severity: 'critical',
          description: 'Transacción por monto inusualmente alto',
          timestamp: new Date(Date.now() - 600000),
          status: 'investigating',
          metadata: { amount: 50000, averageAmount: 250 }
        },
        {
          id: '3',
          userId: 'user789',
          userName: 'Carlos López',
          type: 'location',
          severity: 'medium',
          description: 'Acceso desde ubicación geográfica inusual',
          timestamp: new Date(Date.now() - 900000),
          status: 'new',
          metadata: { newLocation: 'Rusia', usualLocation: 'México' }
        }
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas de fraude",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, newStatus: FraudAlert['status']) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: newStatus } : alert
        )
      );

      toast({
        title: "Estado actualizado",
        description: `La alerta ha sido marcada como ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la alerta",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: FraudAlert['status']) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4" />;
      case 'investigating': return <Eye className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'false_positive': return <Ban className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: FraudAlert['type']) => {
    const labels = {
      velocity: 'Velocidad',
      amount: 'Monto',
      location: 'Ubicación',
      pattern: 'Patrón',
      device: 'Dispositivo'
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Panel de Detección de Fraude
          </span>
          <Button onClick={loadFraudAlerts} disabled={loading} variant="outline" size="sm">
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No hay alertas de fraude activas
          </p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(alert.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-medium">{alert.userName} (ID: {alert.userId})</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getStatusIcon(alert.status)}
                    <span className="text-sm capitalize">{alert.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {alert.metadata && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <strong>Detalles:</strong> {JSON.stringify(alert.metadata, null, 2)}
                  </div>
                )}

                {alert.status === 'new' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateAlertStatus(alert.id, 'investigating')}
                    >
                      Investigar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAlertStatus(alert.id, 'false_positive')}
                    >
                      Falso Positivo
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    >
                      Confirmar Fraude
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FraudDetectionPanel;
