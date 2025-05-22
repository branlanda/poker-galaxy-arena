
import { Loader2 } from 'lucide-react';
import React from 'react';

interface InfiniteScrollIndicatorProps {
  bottomRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
}

export function InfiniteScrollIndicator({ bottomRef, hasMore }: InfiniteScrollIndicatorProps) {
  return (
    <>
      {hasMore && (
        <div className="w-full flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-emerald" />
        </div>
      )}
      
      {/* Invisible element for infinite scroll detection */}
      <div ref={bottomRef} className="h-4" />
    </>
  );
}
