
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

export function LoadingState() {
  const { t } = useTranslation();
  
  // Skeleton card animation
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { 
      opacity: 0.7,
      transition: { 
        repeat: Infinity, 
        repeatType: 'reverse' as const,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };
  
  // Generate a specific number of skeleton cards
  const renderSkeletonCards = (count: number = 6) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <motion.div
          key={index}
          className="bg-navy/50 border border-emerald/10 rounded-lg h-64 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={shimmer}
        >
          <div className="p-5 border-b border-emerald/10">
            <div className="h-6 w-3/4 bg-navy-700/70 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-navy-700/70 rounded"></div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-1/3 bg-navy-700/70 rounded mb-2"></div>
                <div className="h-5 w-2/3 bg-navy-700/70 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-navy-700/70 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-1/3 bg-navy-700/70 rounded mb-2"></div>
                <div className="h-5 w-2/3 bg-navy-700/70 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-navy-700/70 rounded"></div>
              </div>
            </div>
          </div>
          <div className="p-5 pt-0">
            <div className="h-10 w-full bg-navy-700/70 rounded"></div>
          </div>
        </motion.div>
      ));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="h-6 w-32 bg-navy-700/70 rounded"></div>
        <div className="ml-2 h-5 w-8 bg-navy-700/70 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderSkeletonCards()}
      </div>
      
      <div className="flex justify-center">
        <div className="h-10 w-40 bg-navy-700/70 rounded"></div>
      </div>
    </div>
  );
}
