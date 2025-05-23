
import { motion } from 'framer-motion';

interface TableFillIndicatorProps {
  fillPercentage: number;
}

export function TableFillIndicator({ fillPercentage }: TableFillIndicatorProps) {
  const getGradient = () => {
    if (fillPercentage < 30) return 'from-blue-500/50 to-blue-500/30'; // Almost empty
    if (fillPercentage < 70) return 'from-amber-500/50 to-amber-500/30'; // Half full
    return 'from-emerald-500/50 to-emerald-500/30'; // Almost full
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-700/50">
      <motion.div 
        className={`h-full bg-gradient-to-r ${getGradient()}`}
        initial={{ width: '0%' }}
        animate={{ width: `${fillPercentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
