
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  isConnected: boolean;
  tableId: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  tableId
}) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-2"
      >
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Reconnecting...</span>
            <Loader2 className="h-3 w-3 animate-spin" />
          </>
        )}
      </Badge>
      
      {/* Table ID display */}
      <div className="text-xs text-gray-500 mt-1 text-right">
        Table: {tableId.slice(-8)}
      </div>
    </div>
  );
};
