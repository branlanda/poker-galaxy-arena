
import React from 'react';
import { AlertCircle, ArrowUp, AlertTriangle, UserX, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Alert } from '@/stores/alerts';
import { useAdmin } from '@/hooks/useAdmin';
import { useTranslation } from '@/hooks/useTranslation';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts = [] }) => {
  const { toast } = useToast();
  const { createAuditLog } = useAdmin();
  const { t } = useTranslation();

  const handleResolve = (id: string, description: string) => {
    createAuditLog('RESOLVE_ALERT', `Alert resolved: ${description}`, { alertId: id });
    
    toast({
      title: 'Alert marked as resolved',
      description: `Alert has been resolved`,
    });
  };
  
  const handleInvestigate = (id: string, type: string) => {
    createAuditLog('INVESTIGATE_ALERT', `Investigation started for alert: ${type}`, { alertId: id });
    
    toast({
      title: 'Investigation started',
      description: `Investigation has been initiated`,
    });
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return <ArrowUp className="h-5 w-5" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'abuse':
        return <UserX className="h-5 w-5" />;
      case 'chargeback':
        return <AlertOctagon className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-amber-400 bg-amber-400/10';
      case 'low':
        return 'text-emerald bg-emerald/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };
  
  // Mock alerts if none provided for preview purposes
  const displayAlerts = alerts.length > 0 ? alerts : [
    {
      id: '1',
      type: 'withdrawal',
      severity: 'high',
      description: 'Unusual withdrawal pattern detected for player123',
      created_at: new Date().toISOString(),
      resolved: false,
      metadata: { amount: '$500.00', userId: 'player123' }
    },
    {
      id: '2',
      type: 'suspicious',
      severity: 'medium',
      description: 'Multiple failed login attempts for gambler42',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
      metadata: { userId: 'gambler42' }
    }
  ];
  
  return (
    <div className="space-y-4">
      {displayAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>{t('admin.dashboard.noAlerts')}</p>
        </div>
      ) : (
        displayAlerts.map(alert => (
          <div 
            key={alert.id}
            className="bg-[#0e2337] rounded-lg p-4 border-l-4"
            style={{ borderColor: alert.severity === 'high' ? '#f87171' : '#fbbf24' }}
          >
            <div className="flex gap-3">
              <div className={`p-2 rounded-lg ${getSeverityClass(alert.severity)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{alert.description}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1 mt-1">
                    {alert.metadata?.userId && (
                      <p className="text-sm text-muted-foreground">
                        {t('admin.users.user')}: <span className="text-white">{alert.metadata.userId}</span>
                      </p>
                    )}
                    {alert.metadata?.amount && (
                      <p className="text-sm text-muted-foreground">
                        {t('admin.users.amount')}: <span className="text-white">{alert.metadata.amount}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleResolve(alert.id, alert.description)}
                    >
                      {t('admin.resolve')}
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleInvestigate(alert.id, alert.type)}
                    >
                      {t('admin.investigate')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertsPanel;
