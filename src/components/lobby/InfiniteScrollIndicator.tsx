
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface InfiniteScrollIndicatorProps {
  bottomRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  loading?: boolean;
}

export function InfiniteScrollIndicator({ 
  bottomRef, 
  hasMore,
  loading = false
}: InfiniteScrollIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div 
      ref={bottomRef} 
      className="py-8 flex justify-center items-center"
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-emerald animate-pulse"></div>
          <div className="h-4 w-4 rounded-full bg-emerald animate-pulse delay-150"></div>
          <div className="h-4 w-4 rounded-full bg-emerald animate-pulse delay-300"></div>
          <span className="ml-2 text-emerald">{t('loading', 'Cargando...')}</span>
        </div>
      ) : hasMore ? (
        <span className="text-gray-400 text-sm">
          {t('scrollForMore', 'Desplázate para ver más mesas')}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">
          {t('noMoreTables', 'Has llegado al final de la lista')}
        </span>
      )}
    </div>
  );
}
