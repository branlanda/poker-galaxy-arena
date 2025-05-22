
import React from 'react';
import { AlertCircle, ArrowUp, AlertTriangle, UserX, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

// Mock alerts data
const alerts = [
  {
    id: 1,
    type: 'withdrawal',
    user: 'player123',
    message: 'Unusual withdrawal pattern detected',
    amount: '$500.00',
    time: '10 minutes ago',
    severity: 'high',
    icon: <ArrowUp className="h-5 w-5" />,
  },
  {
    id: 2,
    type: 'suspicious',
    user: 'gambler42',
    message: 'Multiple failed login attempts',
    amount: null,
    time: '1 hour ago',
    severity: 'medium',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    id: 3,
    type: 'chargeback',
    user: 'pokerface99',
    message: 'Chargeback request received',
    amount: '$200.00',
    time: '3 hours ago',
    severity: 'high',
    icon: <AlertOctagon className="h-5 w-5" />,
  },
  {
    id: 4,
    type: 'abuse',
    user: 'cardshark77',
    message: 'Chat abuse reported by multiple users',
    amount: null,
    time: '5 hours ago',
    severity: 'medium',
    icon: <UserX className="h-5 w-5" />,
  },
];

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

const AlertsPanel: React.FC = () => {
  const { toast } = useToast();

  const handleResolve = (id: number, user: string) => {
    toast({
      title: 'Alert marked as resolved',
      description: `Alert for ${user} has been resolved`,
    });
  };
  
  const handleInvestigate = (id: number, user: string) => {
    toast({
      title: 'Investigation started',
      description: `Investigation for ${user} has been initiated`,
    });
  };
  
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>No alerts at this time</p>
        </div>
      ) : (
        alerts.map(alert => (
          <div 
            key={alert.id}
            className="bg-[#0e2337] rounded-lg p-4 border-l-4"
            style={{ borderColor: alert.severity === 'high' ? '#f87171' : '#fbbf24' }}
          >
            <div className="flex gap-3">
              <div className={`p-2 rounded-lg ${getSeverityClass(alert.severity)}`}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{alert.message}</h4>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-muted-foreground">User: <span className="text-white">{alert.user}</span></p>
                    {alert.amount && <p className="text-sm text-muted-foreground">Amount: <span className="text-white">{alert.amount}</span></p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleResolve(alert.id, alert.user)}
                    >
                      Resolve
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleInvestigate(alert.id, alert.user)}
                    >
                      Investigate
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
