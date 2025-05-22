
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  PlayCircle, 
  PauseCircle,
  XCircle,
  Settings,
  MessageSquare,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock table data
const mockTables = [
  { 
    id: '1',
    name: 'Texas Hold\'em - $1/$2',
    variant: 'HOLD_EM',
    players: '6/9',
    status: 'ACTIVE',
    handsPlayed: 42,
    blinds: '$1/$2',
    rake: '$35.50',
    createdAt: '2025-05-21 09:30',
  },
  { 
    id: '2',
    name: 'Omaha Hi - $2/$5',
    variant: 'OMAHA',
    players: '4/6',
    status: 'ACTIVE',
    handsPlayed: 21,
    blinds: '$2/$5',
    rake: '$102.75',
    createdAt: '2025-05-21 10:15',
  },
  { 
    id: '3',
    name: 'Texas Hold\'em - $5/$10',
    variant: 'HOLD_EM',
    players: '0/6',
    status: 'PAUSED',
    handsPlayed: 0,
    blinds: '$5/$10',
    rake: '$0.00',
    createdAt: '2025-05-21 11:00',
  },
  { 
    id: '4',
    name: 'Omaha Hi/Lo - $1/$3',
    variant: 'OMAHA_HILO',
    players: '2/8',
    status: 'ACTIVE',
    handsPlayed: 15,
    blinds: '$1/$3',
    rake: '$28.25',
    createdAt: '2025-05-21 08:45',
  },
  { 
    id: '5',
    name: 'Seven Card Stud - $1/$2',
    variant: 'STUD',
    players: '0/8',
    status: 'INACTIVE',
    handsPlayed: 0,
    blinds: '$1/$2',
    rake: '$0.00',
    createdAt: '2025-05-20 22:30',
  },
];

const Tables: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  const filteredTables = mockTables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterActive === null) return matchesSearch;
    if (filterActive) return matchesSearch && table.status === 'ACTIVE';
    return matchesSearch && table.status !== 'ACTIVE';
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald/20 text-emerald';
      case 'PAUSED':
        return 'bg-amber-500/20 text-amber-500';
      case 'INACTIVE':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const handleTableAction = (action: string, tableId: string) => {
    const table = mockTables.find(t => t.id === tableId);
    
    if (!table) return;
    
    switch (action) {
      case 'pause':
        toast({
          title: 'Table paused',
          description: `${table.name} has been paused`,
        });
        break;
      case 'resume':
        toast({
          title: 'Table resumed',
          description: `${table.name} has been resumed`,
        });
        break;
      case 'close':
        setSelectedTable(tableId);
        setShowCloseDialog(true);
        break;
      case 'edit':
        toast({
          title: 'Edit table',
          description: `Editing ${table.name}`,
        });
        break;
      case 'chat':
        toast({
          title: 'Chat logs',
          description: `Viewing chat logs for ${table.name}`,
        });
        break;
      case 'export':
        toast({
          title: 'Exporting hands',
          description: `Exporting hand history for ${table.name}`,
        });
        break;
    }
  };
  
  const confirmCloseTable = () => {
    if (!selectedTable) return;
    
    const table = mockTables.find(t => t.id === selectedTable);
    
    toast({
      title: 'Table closed',
      description: `${table?.name} has been closed`,
    });
    
    setShowCloseDialog(false);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('admin.tables.title')}</h2>
      
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.tables.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterActive === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(filterActive === true ? null : true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('admin.tables.activeOnly')}
            </Button>
            <Button
              variant={filterActive === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(filterActive === false ? null : false)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('admin.tables.inactiveOnly')}
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border border-emerald/10 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#081624]">
                <TableHead>{t('admin.tables.name')}</TableHead>
                <TableHead>{t('admin.tables.variant')}</TableHead>
                <TableHead>{t('admin.tables.players')}</TableHead>
                <TableHead>{t('admin.tables.status')}</TableHead>
                <TableHead>{t('admin.tables.handsPlayed')}</TableHead>
                <TableHead>{t('admin.tables.blinds')}</TableHead>
                <TableHead>{t('admin.tables.rake')}</TableHead>
                <TableHead>{t('admin.tables.createdAt')}</TableHead>
                <TableHead className="text-right">{t('admin.tables.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map(table => (
                <TableRow key={table.id} className="hover:bg-[#0e2337]">
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.variant}</TableCell>
                  <TableCell>{table.players}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(table.status)}`}>
                      {table.status}
                    </span>
                  </TableCell>
                  <TableCell>{table.handsPlayed}</TableCell>
                  <TableCell>{table.blinds}</TableCell>
                  <TableCell className="font-mono">{table.rake}</TableCell>
                  <TableCell>{table.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {table.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleTableAction('pause', table.id)}>
                            <PauseCircle className="h-4 w-4 mr-2" />
                            {t('admin.tables.pauseTable')}
                          </DropdownMenuItem>
                        ) : table.status !== 'INACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleTableAction('resume', table.id)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {t('admin.tables.resumeTable')}
                          </DropdownMenuItem>
                        ) : null}
                        
                        <DropdownMenuItem onClick={() => handleTableAction('close', table.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          {t('admin.tables.closeTable')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => handleTableAction('edit', table.id)}>
                          <Settings className="h-4 w-4 mr-2" />
                          {t('admin.tables.editSettings')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleTableAction('chat', table.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t('admin.tables.viewChat')}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleTableAction('export', table.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          {t('admin.tables.exportHands')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredTables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {t('admin.tables.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.tables.confirmClose')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.tables.confirmCloseDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.tables.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseTable} className="bg-red-500 hover:bg-red-600">
              {t('admin.tables.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tables;
