
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLedgerStore } from '@/stores/ledger';
import { LedgerTable } from '@/components/admin/LedgerTable';
import { LedgerFilters } from '@/components/admin/LedgerFilters';
import { ExportCsvButton } from '@/components/admin/ExportCsvButton';
import { Card } from '@/components/ui/card';
import { useLedgerMocks } from '@/hooks/useLedgerMocks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Ledger = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('transactions');
  useLedgerMocks(); // Load mock data for UI demo
  
  const { setFilters, filters } = useLedgerStore();
  
  const mockAnomalies = [
    { id: 1, user: 'player123', type: 'Deposit', amount: '$500.00', timestamp: '2025-05-21 15:30:45', reason: 'Multiple deposits in short period' },
    { id: 2, user: 'bigStacks42', type: 'Withdrawal', amount: '$2,000.00', timestamp: '2025-05-21 12:10:22', reason: 'Withdrawal shortly after deposit' },
    { id: 3, user: 'pokerFace99', type: 'Withdrawal', amount: '$750.00', timestamp: '2025-05-20 23:15:33', reason: 'Unusual pattern detected' },
  ];
  
  const mockAudits = [
    { id: 1, timestamp: '2025-05-21 16:00:01', action: 'Daily reconciliation', status: 'Completed', balance: '$42,580.75' },
    { id: 2, timestamp: '2025-05-20 16:00:03', action: 'Daily reconciliation', status: 'Completed', balance: '$41,208.50' },
    { id: 3, timestamp: '2025-05-19 16:00:02', action: 'Daily reconciliation', status: 'Completed', balance: '$43,127.25' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin.ledger.title')}</h1>
        <ExportCsvButton />
      </div>
      
      <Tabs defaultValue="transactions" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">{t('admin.ledger.transactions')}</TabsTrigger>
          <TabsTrigger value="anomalies">{t('admin.ledger.anomalies')}</TabsTrigger>
          <TabsTrigger value="audit">{t('admin.ledger.audit')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card className="p-4">
            <LedgerFilters
              onFilterChange={filters => setFilters(filters)}
              currentFilters={filters}
            />
            <LedgerTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="anomalies">
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{t('admin.ledger.detectedAnomalies')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.ledger.anomaliesDescription')}
              </p>
            </div>
            
            <div className="rounded-lg border border-emerald/10 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnomalies.map(item => (
                    <TableRow key={item.id} className="hover:bg-[#0e2337] cursor-pointer">
                      <TableCell className="font-medium">{item.user}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-500">
                          {item.reason}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit">
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{t('admin.ledger.auditTrail')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.ledger.auditDescription')}
              </p>
            </div>
            
            <div className="rounded-lg border border-emerald/10 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAudits.map(item => (
                    <TableRow key={item.id} className="hover:bg-[#0e2337]">
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-emerald/20 text-emerald">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">{item.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ledger;
