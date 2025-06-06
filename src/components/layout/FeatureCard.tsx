
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon
}) => {
  return (
    <motion.div 
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-4 text-center">{icon}</div>
      <h3 className="text-xl font-bold text-emerald-400 mb-3 text-center">
        {title}
      </h3>
      <p className="text-gray-300 text-center leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
