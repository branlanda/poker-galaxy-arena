
import { LobbyTable } from '@/types/lobby';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Card, CardFooter } from "@/components/ui/card";
import { HotTableIndicator } from './table-card/HotTableIndicator';
import { TableCardHeader } from './table-card/TableCardHeader';
import { TableInfoGrid } from './table-card/TableInfoGrid';
import { JoinTableDialog } from './table-card/JoinTableDialog';
import { TableFillIndicator } from './table-card/TableFillIndicator';
import { useTranslation } from '@/hooks/useTranslation';

interface TableCardProps {
  table: LobbyTable;
  isNew?: boolean;
}

export function TableCard({ table, isNew = false }: TableCardProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : undefined;
  
  // Format creation time
  const createdTime = formatDistanceToNow(new Date(table.created_at), { 
    addSuffix: true,
    locale 
  });

  // Format activity time
  const lastActivityTime = table.last_activity ? 
    formatDistanceToNow(new Date(table.last_activity), {
      addSuffix: true,
      locale
    }) :
    createdTime;

  // Determine table activity status
  const getActivityStatus = () => {
    if (!table.last_activity) return 'idle';
    
    const lastActivity = new Date(table.last_activity).getTime();
    const now = new Date().getTime();
    const minutes = (now - lastActivity) / (1000 * 60);
    
    if (minutes < 5) return 'active';
    if (minutes < 30) return 'idle';
    return 'inactive';
  };
  
  const activityStatus = getActivityStatus();
  const activePlayerCount = table.active_players || 0;
  const isHot = activePlayerCount >= 3 || (table.current_players > 0 && table.current_players >= table.max_players * 0.7);
  
  // Calculate fill percentage for visual indicator
  const fillPercentage = Math.min(100, Math.round((table.current_players / table.max_players) * 100));

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
      layout
    >
      <Card className={`bg-slate-800/90 border ${isNew ? 'border-amber-500/50' : isHot ? 'border-emerald/50' : 'border-emerald/20'} h-full relative overflow-hidden backdrop-blur-sm hover:border-emerald/40 transition-all duration-300`}>
        {isNew && <HotTableIndicator isNew={true} />}
        {isHot && !isNew && <HotTableIndicator />}
        <TableFillIndicator fillPercentage={fillPercentage} />
        
        <TableCardHeader 
          table={table} 
          createdTime={createdTime} 
          isNew={isNew}
        />
        
        <TableInfoGrid 
          table={table} 
          lastActivityTime={lastActivityTime} 
          activityStatus={activityStatus} 
          activePlayerCount={activePlayerCount} 
        />
        
        <CardFooter>
          <JoinTableDialog table={table} />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
