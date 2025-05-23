
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecurityCenter = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('alerts');
  
  // Mock data for security alerts - would be fetched from Supabase in production
  const securityAlerts = [
    { 
      id: 1, 
      type: 'SUSPICIOUS_LOGIN', 
      userId: 'user123',
      username: 'player123',
      ip: '192.168.1.100', 
      timestamp: new Date(Date.now() - 25 * 60000),
      details: 'Multiple failed login attempts followed by successful login from new location'
    },
    { 
      id: 2, 
      type: 'LARGE_WITHDRAWAL', 
      userId: 'user456',
      username: 'highroller77',
      amount: 2500,
      timestamp: new Date(Date.now() - 120 * 60000),
      details: 'Unusually large withdrawal shortly after deposit'
    },
    { 
      id: 3, 
      type: 'UNUSUAL_ACTIVITY', 
      userId: 'user789',
      username: 'pokerface22',
      timestamp: new Date(Date.now() - 240 * 60000),
      details: 'Player folded multiple strong hands in succession'
    }
  ];
  
  // Mock data for blocked IPs - would be fetched from Supabase in production
  const blockedIPs = [
    { ip: '45.227.253.98', reason: 'Multiple failed login attempts', blocked_at: new Date(Date.now() - 2 * 24 * 60 * 60000) },
    { ip: '103.15.62.177', reason: 'Suspected bot activity', blocked_at: new Date(Date.now() - 5 * 24 * 60 * 60000) },
    { ip: '91.134.25.200', reason: 'Fraud attempt', blocked_at: new Date(Date.now() - 14 * 24 * 60 * 60000) }
  ];
  
  // Function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Function to download logs as CSV
  const downloadLogs = () => {
    // Implementation would connect to Supabase to fetch and format logs
    console.log('Downloading security logs...');
    
    // Mock alert to show this worked
    alert('Security logs downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.securityCenter.title', 'Security Center')}</h2>
        
        <Button 
          onClick={downloadLogs}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {t('admin.securityCenter.downloadLogs', 'Download Logs')}
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-emerald" />
          <div>
            <h3 className="font-medium text-lg">
              {t('admin.securityCenter.securityStatus', 'Security Status')}
            </h3>
            <p className="text-sm text-gray-400">
              {t('admin.securityCenter.activeThreats', 'Active threats: 3')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <p className="text-gray-400 text-sm">{t('admin.securityCenter.failedLogins', 'Failed Logins (24h)')}</p>
            <p className="text-xl font-bold">37</p>
          </div>
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <p className="text-gray-400 text-sm">{t('admin.securityCenter.suspiciousTx', 'Suspicious Transactions')}</p>
            <p className="text-xl font-bold">5</p>
          </div>
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <p className="text-gray-400 text-sm">{t('admin.securityCenter.blockedIPs', 'Blocked IPs')}</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">{t('admin.securityCenter.alerts', 'Alerts')}</TabsTrigger>
          <TabsTrigger value="blockedIPs">{t('admin.securityCenter.blockedIPs', 'Blocked IPs')}</TabsTrigger>
          <TabsTrigger value="auditLog">{t('admin.securityCenter.auditLog', 'Audit Log')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="mt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#081624]">
                  <TableHead>{t('admin.securityCenter.alertType', 'Alert Type')}</TableHead>
                  <TableHead>{t('admin.securityCenter.user', 'User')}</TableHead>
                  <TableHead>{t('admin.securityCenter.time', 'Time')}</TableHead>
                  <TableHead>{t('admin.securityCenter.details', 'Details')}</TableHead>
                  <TableHead>{t('admin.securityCenter.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityAlerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-[#0e2337]">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        {alert.type}
                      </div>
                    </TableCell>
                    <TableCell>{alert.username}</TableCell>
                    <TableCell>{formatDate(alert.timestamp)}</TableCell>
                    <TableCell>{alert.details}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {t('admin.securityCenter.investigate', 'Investigate')}
                        </Button>
                        <Button variant="destructive" size="sm">
                          {t('admin.securityCenter.block', 'Block')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockedIPs" className="mt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#081624]">
                  <TableHead>{t('admin.securityCenter.ipAddress', 'IP Address')}</TableHead>
                  <TableHead>{t('admin.securityCenter.reason', 'Reason')}</TableHead>
                  <TableHead>{t('admin.securityCenter.blockedAt', 'Blocked At')}</TableHead>
                  <TableHead>{t('admin.securityCenter.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockedIPs.map((ip, index) => (
                  <TableRow key={index} className="hover:bg-[#0e2337]">
                    <TableCell className="font-mono">{ip.ip}</TableCell>
                    <TableCell>{ip.reason}</TableCell>
                    <TableCell>{formatDate(ip.blocked_at)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {t('admin.securityCenter.unblock', 'Unblock')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="auditLog" className="mt-4">
          <Card className="p-4">
            <p className="text-gray-400 mb-4">
              {t('admin.securityCenter.auditLogDescription', 'View detailed logs of admin actions and system events.')}
            </p>
            {/* Audit log would be implemented here with filtering and pagination */}
            <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10 text-center">
              <p className="text-gray-400">
                {t('admin.securityCenter.auditLogEmpty', 'Loading audit log data...')}
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityCenter;
