
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import KycBadge from '@/components/admin/KycBadge';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define table interface
interface GameTable {
  id: string;
  code: string;
  smallBlind: number;
  bigBlind: number;
  players: number;
  maxPlayers: number;
  state: 'WAITING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
}

const Tables = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Mock data for tables
  const mockTables: GameTable[] = [
    { id: 'T1', code: 'NL5-001', smallBlind: 0.05, bigBlind: 0.10, players: 4, maxPlayers: 6, state: 'ACTIVE' },
    { id: 'T2', code: 'NL10-002', smallBlind: 0.10, bigBlind: 0.20, players: 6, maxPlayers: 9, state: 'ACTIVE' },
    { id: 'T3', code: 'NL25-003', smallBlind: 0.25, bigBlind: 0.50, players: 2, maxPlayers: 6, state: 'WAITING' },
    { id: 'T4', code: 'NL50-004', smallBlind: 0.50, bigBlind: 1.00, players: 0, maxPlayers: 6, state: 'CLOSED' },
    { id: 'T5', code: 'NL100-005', smallBlind: 1, bigBlind: 2, players: 5, maxPlayers: 9, state: 'PAUSED' },
  ];

  const filteredTables = filter 
    ? mockTables.filter(table => table.state === filter)
    : mockTables;

  const getStateColor = (state: GameTable['state']) => {
    switch(state) {
      case 'ACTIVE': return 'bg-emerald-700/20 text-emerald-400';
      case 'WAITING': return 'bg-amber-700/20 text-amber-400';
      case 'PAUSED': return 'bg-blue-700/20 text-blue-400';
      case 'CLOSED': return 'bg-gray-700/20 text-gray-400';
    }
  };

  const handleAction = (tableId: string, action: 'close' | 'pause' | 'resume') => {
    console.log(`Table ${tableId}: ${action}`);
    // In a real app, this would call an API endpoint
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.sidebar.tables')}</h2>
        <Button 
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('admin.users.create')}
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <select 
          className="bg-[#0e2337] border border-emerald/10 rounded px-4 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{t('admin.users.allStatus')}</option>
          <option value="WAITING">Waiting</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="rounded-md border border-emerald/10 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>SB/BB</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map(table => (
              <TableRow key={table.id} className="hover:bg-[#0e2337]">
                <TableCell>{table.id}</TableCell>
                <TableCell>{table.code}</TableCell>
                <TableCell>${table.smallBlind}/${table.bigBlind}</TableCell>
                <TableCell>{table.players}/{table.maxPlayers}</TableCell>
                <TableCell>
                  <Badge className={getStateColor(table.state)}>
                    {table.state}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {table.state !== 'CLOSED' && (
                    <Button 
                      variant="accent" 
                      size="sm"
                      onClick={() => handleAction(table.id, 'close')}
                    >
                      Close
                    </Button>
                  )}
                  {table.state === 'ACTIVE' && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleAction(table.id, 'pause')}
                    >
                      Pause
                    </Button>
                  )}
                  {table.state === 'PAUSED' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAction(table.id, 'resume')}
                    >
                      Resume
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Table Modal */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="bg-[#081624] border-l border-emerald/10">
          <SheetHeader>
            <SheetTitle className="text-xl text-white">Create New Table</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Small Blind</label>
              <input 
                type="number"
                min="0.01"
                step="0.01"
                defaultValue="0.05"
                className="w-full bg-[#0e2337] border border-emerald/10 rounded px-3 py-2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Big Blind</label>
              <input 
                type="number"
                min="0.02"
                step="0.01"
                defaultValue="0.10"
                className="w-full bg-[#0e2337] border border-emerald/10 rounded px-3 py-2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Players</label>
              <select 
                defaultValue="6"
                className="w-full bg-[#0e2337] border border-emerald/10 rounded px-3 py-2"
              >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => {
                console.log('Table created');
                setIsCreateModalOpen(false);
              }}
            >
              Create Table
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Tables;
