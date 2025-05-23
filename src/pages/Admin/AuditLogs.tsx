
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuditLogsStore } from '@/stores/auditLogs';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileJson, FileText, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const AuditLogs = () => {
  const { t } = useTranslation();
  const { logs, isLoading, filters, fetchLogs, setFilters, exportLogs } = useAuditLogsStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, filters]);
  
  const handleSearch = () => {
    // Apply search term to description or user_id
    // In a real app, this would be handled by the server
  };
  
  const handleActionFilterChange = (value: string) => {
    setFilters({ action: value === 'all' ? undefined : value });
  };
  
  const handleDateSelect = (field: 'fromDate' | 'toDate', date: Date | undefined) => {
    if (date) {
      setFilters({ [field]: date.toISOString() });
    } else {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    }
  };
  
  const handleExport = (format: 'csv' | 'json') => {
    exportLogs(format);
  };
  
  const actionTypes = [
    { value: 'all', label: t('admin.audit.allActions') },
    { value: 'LOGIN', label: t('admin.audit.login') },
    { value: 'BAN_USER', label: t('admin.audit.banUser') },
    { value: 'UNBAN_USER', label: t('admin.audit.unbanUser') },
    { value: 'APPROVE_KYC', label: t('admin.audit.approveKyc') },
    { value: 'RESET_FUNDS', label: t('admin.audit.resetFunds') },
    { value: 'DELETE_CHAT_MESSAGE', label: t('admin.audit.deleteChatMessage') },
    { value: 'RESOLVE_ALERT', label: t('admin.audit.resolveAlert') },
  ];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {t('admin.audit.title')}
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            CSV
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleExport('json')}
            className="flex items-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('admin.audit.search')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select 
            value={filters.action || 'all'} 
            onValueChange={handleActionFilterChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('admin.audit.allActions')} />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map(action => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`flex items-center gap-2 ${filters.fromDate ? 'border-emerald text-emerald' : ''}`}
                >
                  <Calendar className="h-4 w-4" />
                  {filters.fromDate 
                    ? format(new Date(filters.fromDate), 'PP') 
                    : t('admin.audit.fromDate')
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.fromDate ? new Date(filters.fromDate) : undefined}
                  onSelect={(date) => handleDateSelect('fromDate', date)}
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`flex items-center gap-2 ${filters.toDate ? 'border-emerald text-emerald' : ''}`}
                >
                  <Calendar className="h-4 w-4" />
                  {filters.toDate 
                    ? format(new Date(filters.toDate), 'PP') 
                    : t('admin.audit.toDate')
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.toDate ? new Date(filters.toDate) : undefined}
                  onSelect={(date) => handleDateSelect('toDate', date)}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" onClick={() => setFilters({})}>
              {t('admin.audit.clearFilters')}
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#081624] hover:bg-[#081624]">
                  <TableHead>{t('admin.audit.timestamp')}</TableHead>
                  <TableHead>{t('admin.audit.user')}</TableHead>
                  <TableHead>{t('admin.audit.action')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('admin.audit.description')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="hover:bg-[#0e2337] cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {log.user_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full bg-emerald/10 text-emerald text-xs">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {log.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">{t('admin.audit.noLogs')}</h3>
            <p className="text-gray-400">{t('admin.audit.noLogsDescription')}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuditLogs;
