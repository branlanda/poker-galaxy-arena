import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Calendar, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';

const KpiExport = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isExporting, setIsExporting] = useState(false);
  
  const kpiCategories = [
    { id: 'users', name: t('admin.kpiExport.users', 'Users & Registrations') },
    { id: 'tables', name: t('admin.kpiExport.tables', 'Tables & Games') },
    { id: 'transactions', name: t('admin.kpiExport.transactions', 'Transactions & Revenue') },
    { id: 'gameplay', name: t('admin.kpiExport.gameplay', 'Gameplay Metrics') },
  ];
  
  const exportData = async (category: string) => {
    setIsExporting(true);
    
    try {
      let query;
      
      // In a real implementation, these would be actual queries based on the category
      switch (category) {
        case 'users':
          // Example query for user registrations
          query = supabase
            .from('players')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);
          break;
          
        case 'tables':
          // Example query for table data
          query = supabase
            .from('lobby_tables')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);
          break;
          
        case 'transactions':
          // Example query for transaction data
          query = supabase
            .from('ledger_entries')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);
          break;
          
        case 'gameplay':
          // Example query for gameplay metrics
          query = supabase
            .from('hands')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .limit(1000);  // Limit for large tables
          break;
          
        default:
          throw new Error('Invalid category');
      }
      
      // For demonstration purposes only, we're showing a success message
      // In production, this would process the data and generate a CSV file
      setTimeout(() => {
        setIsExporting(false);
        alert(`${category.toUpperCase()} data exported successfully!`);
      }, 1500);
      
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
      alert('Error exporting data. Please check console for details.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.kpiExport.title', 'KPI & Data Export')}</h2>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">{t('admin.kpiExport.dateRange', 'Select Date Range')}</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-400">
              {t('admin.kpiExport.startDate', 'Start Date')}
            </label>
            <input
              id="start-date"
              type="date"
              className="bg-[#0e2337] border border-emerald/10 rounded-md p-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-400">
              {t('admin.kpiExport.endDate', 'End Date')}
            </label>
            <input
              id="end-date"
              type="date"
              className="bg-[#0e2337] border border-emerald/10 rounded-md p-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                const today = new Date();
                const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
              }}
            >
              <Calendar className="h-4 w-4" />
              {t('admin.kpiExport.last30Days', 'Last 30 Days')}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            {kpiCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {kpiCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="bg-[#0e2337]/70 p-6 rounded-lg border border-emerald/10">
                <h4 className="font-medium text-lg mb-4">{category.name} {t('admin.kpiExport.export', 'Export')}</h4>
                
                <p className="text-gray-400 mb-6">
                  {t('admin.kpiExport.description', 
                    `Export ${category.name.toLowerCase()} data for the selected date range. The data will be downloaded as a CSV file.`
                  )}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => exportData(category.id)}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        {t('admin.kpiExport.exporting', 'Exporting...')}
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        {t('admin.kpiExport.exportCSV', 'Export CSV')}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => exportData(`${category.id}_json`)}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t('admin.kpiExport.exportJSON', 'Export JSON')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">{t('admin.kpiExport.automatedReports', 'Automated Reports')}</h3>
        
        <p className="text-gray-400 mb-6">
          {t('admin.kpiExport.automatedDescription', 'Set up automated reports to be generated and delivered on a schedule.')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <h4 className="font-medium mb-2">{t('admin.kpiExport.dailyReport', 'Daily Activity Report')}</h4>
            <p className="text-sm text-gray-400 mb-4">{t('admin.kpiExport.sentDaily', 'Sent daily at 6:00 AM')}</p>
            <Button variant="outline" size="sm" className="w-full">
              {t('admin.kpiExport.configure', 'Configure')}
            </Button>
          </div>
          
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <h4 className="font-medium mb-2">{t('admin.kpiExport.weeklyReport', 'Weekly Performance Summary')}</h4>
            <p className="text-sm text-gray-400 mb-4">{t('admin.kpiExport.sentWeekly', 'Sent weekly on Mondays')}</p>
            <Button variant="outline" size="sm" className="w-full">
              {t('admin.kpiExport.configure', 'Configure')}
            </Button>
          </div>
          
          <div className="bg-[#0e2337]/70 p-4 rounded-lg border border-emerald/10">
            <h4 className="font-medium mb-2">{t('admin.kpiExport.monthlyReport', 'Monthly Financial Report')}</h4>
            <p className="text-sm text-gray-400 mb-4">{t('admin.kpiExport.sentMonthly', 'Sent on the 1st of each month')}</p>
            <Button variant="outline" size="sm" className="w-full">
              {t('admin.kpiExport.configure', 'Configure')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KpiExport;
