import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { useAntiFraud } from '@/hooks/useAntiFraud';
import { useTransactionVerification } from '@/hooks/useTransactionVerification';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';

export default function SecurityCenter() {
  const {
    alerts,
    rules,
    loading,
    fetchAlerts,
    fetchRules,
    toggleRule,
    updateAlertStatus,
    banUser
  } = useAntiFraud();

  const {
    verifying,
    transactions,
    loading: txLoading,
    fetchPendingTransactions,
    verifyTransaction,
    approveTransaction,
    rejectTransaction,
    flagTransaction
  } = useTransactionVerification();

  useEffect(() => {
    fetchAlerts();
    fetchRules();
    fetchPendingTransactions();
  }, [fetchAlerts, fetchRules, fetchPendingTransactions]);

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    await toggleRule(ruleId);
  };

  const handleUpdateAlertStatus = async (alertId: string, status: 'new' | 'investigating' | 'resolved' | 'ignored') => {
    await updateAlertStatus(alertId, status);
  };

  const handleBanUser = async (userId: string) => {
    await banUser(userId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>
            Monitor and manage security alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No active security alerts
            </p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border rounded-lg"
                >
                  <p>Description: {alert.description}</p>
                  <p>Severity: {alert.severity}</p>
                  <p>User ID: {alert.userId}</p>
                  <p>Created At: {format(new Date(alert.timestamp), 'PPpp')}</p>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                    >
                      Resolve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBanUser(alert.userId)}
                    >
                      Ban User
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Rules</CardTitle>
          <CardDescription>
            Manage and configure security rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rules.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No security rules defined
            </p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p>{rule.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`rule-${rule.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                      {rule.active ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch 
                      id={`rule-${rule.id}`} 
                      checked={rule.active} 
                      onCheckedChange={(checked) => handleToggleRule(rule.id, checked)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
          <CardDescription>
            Review and verify pending transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No pending transactions
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`p-4 border rounded-lg ${
                    tx.status === 'flagged' ? 'border-red-500' : 
                    tx.status === 'verified' ? 'border-green-500' : 
                    'border-gray-300'
                  }`}
                >
                  <p>Transaction ID: {tx.id}</p>
                  <p>Type: {tx.type}</p>
                  <p>Status: {tx.status}</p>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => verifyTransaction(tx.blockchain_tx_hash || '')}
                      disabled={verifying}
                    >
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => approveTransaction(tx.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => rejectTransaction(tx.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => flagTransaction(tx.id)}
                    >
                      Flag
                    </Button>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>User: {tx.user_id || 'Unknown'}</p>
                    <p>Amount: {tx.amount}</p>
                    <p>Date: {format(new Date(tx.created_at), 'PPpp')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
