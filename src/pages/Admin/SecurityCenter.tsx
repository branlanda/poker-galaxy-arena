
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useAntiFraud } from '@/hooks/useAntiFraud';
import { useTransactionVerification } from '@/hooks/useTransactionVerification';
import { Shield, AlertTriangle, Check, X, Search, Ban } from 'lucide-react';

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState('alerts');
  const { 
    alerts, 
    rules, 
    loading: fraudLoading, 
    fetchAlerts, 
    fetchRules, 
    toggleRule, 
    updateAlertStatus, 
    banUser 
  } = useAntiFraud();
  
  const {
    transactions,
    loading: txLoading,
    fetchPendingTransactions,
    approveTransaction,
    rejectTransaction,
    flagTransaction
  } = useTransactionVerification();

  useEffect(() => {
    fetchAlerts();
    fetchRules();
    fetchPendingTransactions();
  }, [fetchAlerts, fetchRules, fetchPendingTransactions]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Security Center</h1>
          <p className="text-gray-500">Monitor and manage security alerts and fraud detection</p>
        </div>
        <Button>Generate Security Report</Button>
      </div>

      <Tabs defaultValue="alerts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Alerts
            {alerts.filter(a => a.status === 'new').length > 0 && (
              <Badge className="ml-2 bg-red-500">{alerts.filter(a => a.status === 'new').length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Shield className="mr-2 h-4 w-4" />
            Detection Rules
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Search className="mr-2 h-4 w-4" />
            Transaction Verification
            {transactions.filter(t => t.verificationStatus === 'unverified').length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{transactions.filter(t => t.verificationStatus === 'unverified').length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Review and manage security alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald border-t-transparent rounded-full"></div>
                  </div>
                ) : alerts.length > 0 ? (
                  alerts.map(alert => (
                    <Card key={alert.id} className="overflow-hidden">
                      <div className={`h-1 ${
                        alert.severity === 'high' ? 'bg-red-500' : 
                        alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{alert.alertType}</h3>
                            <p className="text-sm text-gray-500">{alert.description}</p>
                            <div className="flex items-center mt-1">
                              <Badge className="mr-2">User: {alert.userName}</Badge>
                              <Badge variant="outline">{new Date(alert.timestamp).toLocaleString()}</Badge>
                            </div>
                          </div>
                          <div className="flex mt-3 sm:mt-0">
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="mr-2"
                              onClick={() => updateAlertStatus(alert.id, 'investigating')}
                            >
                              Investigate
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="mr-2"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => banUser(alert.userId)}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Ban User
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge className={`
                            ${alert.status === 'new' ? 'bg-red-500' : 
                              alert.status === 'investigating' ? 'bg-amber-500' : 
                              alert.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'}
                          `}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-gray-500">No alerts found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Rules</CardTitle>
              <CardDescription>Configure and manage fraud detection rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald border-t-transparent rounded-full"></div>
                  </div>
                ) : rules.length > 0 ? (
                  rules.map(rule => (
                    <Card key={rule.id} className="overflow-hidden">
                      <div className={`h-1 ${
                        rule.severity === 'high' ? 'bg-red-500' : 
                        rule.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{rule.name}</h3>
                            <p className="text-sm text-gray-500">{rule.description}</p>
                            <div className="flex items-center mt-1">
                              <Badge className={`
                                ${rule.severity === 'high' ? 'bg-red-500' : 
                                  rule.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}
                              `}>
                                {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)} Severity
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 sm:mt-0">
                            <Badge className={rule.active ? 'bg-green-500' : 'bg-gray-500'}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="ml-4"
                              onClick={() => toggleRule(rule.id)}
                            >
                              {rule.active ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-gray-500">No rules found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Verification</CardTitle>
              <CardDescription>Verify and approve pending transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {txLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald border-t-transparent rounded-full"></div>
                  </div>
                ) : transactions.length > 0 ? (
                  transactions.map(tx => (
                    <Card key={tx.id} className="overflow-hidden">
                      <div className={`h-1 ${
                        tx.verificationStatus === 'flagged' ? 'bg-red-500' : 
                        tx.verificationStatus === 'unverified' ? 'bg-amber-500' : 'bg-green-500'
                      }`}></div>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}: ${tx.amount.toLocaleString()}
                            </h3>
                            <p className="text-sm text-gray-500">User: {tx.userName}</p>
                            <div className="flex items-center mt-1">
                              <Badge className={`mr-2 ${
                                tx.status === 'pending' ? 'bg-amber-500' : 
                                tx.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </Badge>
                              <Badge variant="outline">{new Date(tx.createdAt).toLocaleString()}</Badge>
                            </div>
                          </div>
                          <div className="flex mt-3 sm:mt-0">
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="mr-2"
                              onClick={() => approveTransaction(tx.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="mr-2"
                              onClick={() => rejectTransaction(tx.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => flagTransaction(tx.id)}
                            >
                              Flag
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-gray-500">No pending transactions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
