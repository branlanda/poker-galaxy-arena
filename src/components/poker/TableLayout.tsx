
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableLayoutProps {
  pot: number;
  children: ReactNode;
  phase?: string;
}

export function TableLayout({ pot, children, phase = 'WAITING' }: TableLayoutProps) {
  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
      {/* Ambient glow effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-30 pointer-events-none rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at center, #059669 0%, #1e293b 60%, #0f172a 100%)"
        }}
      />
      
      {/* Premium poker table */}
      <motion.div 
        className="relative w-full max-w-5xl h-[400px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 rounded-[50%] border-8 border-amber-900/60 shadow-[0_20px_80px_0_rgba(6,95,70,0.4)] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Felt texture overlay */}
        <div className="absolute inset-0 bg-[url('/felt-texture.png')] opacity-25 mix-blend-overlay"></div>
        
        {/* Table pattern with radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-emerald-800/30 to-emerald-900/60"></div>
        
        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-[50%] shadow-[inset_0_0_40px_0_rgba(16,185,129,0.3)]"></div>
        
        {/* Table rail effect */}
        <div className="absolute inset-0 rounded-[50%] border border-amber-700/40 shadow-[inset_0_-2px_8px_0_rgba(120,53,15,0.4)]"></div>
        
        {/* Table content container */}
        <div className="relative h-full flex items-center justify-center">
          {/* Enhanced pot display */}
          <AnimatePresence>
            {pot > 0 && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-12 z-20"
                initial={{ scale: 0, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0, y: -20, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
              >
                <div className="relative">
                  {/* Chip stack background */}
                  <div className="absolute -inset-2 bg-gradient-to-b from-amber-400/20 to-red-600/20 rounded-full blur-sm"></div>
                  
                  {/* Main pot container */}
                  <div className="relative bg-gradient-to-b from-black/80 to-black/90 px-6 py-3 rounded-full border border-gold/50 shadow-[0_0_20px_0_rgba(251,191,36,0.4)]">
                    <div className="flex items-center gap-2">
                      {/* Chip icon */}
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-amber-300 shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-200 rounded-full"></div>
                      </div>
                      <span className="text-gold font-bold text-xl tracking-wide">
                        ${pot.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Floating chips animation */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full"
                    animate={{ 
                      y: [0, -4, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full"
                    animate={{ 
                      y: [0, -3, 0],
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Game phase indicator */}
          <motion.div 
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald/30">
              <span className="text-emerald-300 font-semibold text-sm tracking-wide uppercase">
                {phase}
              </span>
            </div>
          </motion.div>
          
          {/* Table center logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-800/40 to-emerald-900/40 flex items-center justify-center pointer-events-none border border-emerald-700/30">
            <motion.div
              className="text-emerald-200/40 font-bold text-lg tracking-widest"
              animate={{ 
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              POKER
            </motion.div>
          </div>
          
          {/* Pass through all child elements (seats, cards, etc) */}
          {children}
        </div>
        
        {/* Ambient particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
