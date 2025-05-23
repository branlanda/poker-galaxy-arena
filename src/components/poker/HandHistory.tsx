
import React from 'react';

interface HandHistoryProps {
  tableId: string;
}

export function HandHistory({ tableId }: HandHistoryProps) {
  return (
    <div className="flex flex-col h-[400px] bg-navy/20 rounded-md border border-emerald/10 p-4">
      <p className="text-center text-muted-foreground">
        Hand history will be available soon.
      </p>
    </div>
  );
}
