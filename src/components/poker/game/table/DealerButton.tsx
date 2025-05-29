
import React from 'react';
import { motion } from 'framer-motion';

interface DealerButtonProps {
  position: {
    top: string;
    left: string;
    transform: string;
  };
}

export const DealerButton: React.FC<DealerButtonProps> = ({ position }) => {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-20px, -80px)'
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 10 }}
    >
      <div className="bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-black shadow-lg">
        D
      </div>
    </motion.div>
  );
};
