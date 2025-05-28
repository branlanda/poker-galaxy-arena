
import { useTranslation } from '@/hooks/useTranslation';
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface InfiniteScrollIndicatorProps {
  bottomRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  loading: boolean;
  onLoadMore?: () => void;
}

export function InfiniteScrollIndicator({ 
  bottomRef, 
  hasMore, 
  loading,
  onLoadMore
}: InfiniteScrollIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div ref={bottomRef} className="flex justify-center py-8">
      {loading ? (
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <LoaderCircle className="h-5 w-5 text-emerald" />
          </motion.div>
          <p className="text-emerald">{t('common.loading')}</p>
        </div>
      ) : hasMore ? (
        <Button 
          variant="outline" 
          onClick={onLoadMore}
          className="border-emerald/30 hover:border-emerald/50 text-white hover:text-white"
        >
          {t('lobby.loadMore')}
        </Button>
      ) : (
        <p className="text-gray-400 text-sm">{t('lobby.noMoreTables')}</p>
      )}
    </div>
  );
}
