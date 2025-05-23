
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface HotTableIndicatorProps {
  isNew?: boolean;
}

export function HotTableIndicator({ isNew = false }: HotTableIndicatorProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      className={`absolute -top-3 -right-3 z-10 px-2 py-1 rounded-full shadow-lg flex items-center 
                 ${isNew ? 'bg-amber-500' : 'bg-emerald-500'}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
    >
      {isNew ? (
        <span className="text-xs font-bold text-white">
          {t('new', 'NUEVA')}
        </span>
      ) : (
        <>
          <Flame className="h-3 w-3 text-white mr-1" />
          <span className="text-xs font-bold text-white">
            {t('hot', 'HOT')}
          </span>
        </>
      )}
    </motion.div>
  );
}
