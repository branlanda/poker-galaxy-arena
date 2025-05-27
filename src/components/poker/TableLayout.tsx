
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableLayoutProps {
  pot: number;
  children: ReactNode;
  phase?: string;
}

export function TableLayout({ pot, children, phase = 'WAITING' }: TableLayoutProps) {
  return (
    <div className="relative w-full min-h-[700px] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 overflow-hidden">
      {/* Ambient glow effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-40 pointer-events-none rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at center, #22c55e 0%, #16a34a 30%, #1e293b 70%, #0f172a 100%)"
        }}
      />
      
      {/* Premium poker table with enhanced green felt gradient */}
      <motion.div 
        className="relative w-full max-w-6xl h-[500px] rounded-[50%] border-8 border-amber-900/60 shadow-[0_20px_80px_0_rgba(34,197,94,0.4)] overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              #15803d 0%, 
              #166534 15%, 
              #14532d 30%, 
              #0f4c1a 45%, 
              #0a3d14 60%, 
              #052e10 75%, 
              #041f0c 90%, 
              #021008 100%
            )
          `
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Felt texture overlay with enhanced grass-like pattern */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(34, 197, 94, 0.1) 0px,
                rgba(34, 197, 94, 0.05) 1px,
                transparent 1px,
                transparent 8px
              ),
              repeating-linear-gradient(
                -45deg,
                rgba(16, 185, 129, 0.08) 0px,
                rgba(16, 185, 129, 0.04) 1px,
                transparent 1px,
                transparent 12px
              )
            `
          }}>
        </div>
        
        {/* Inner premium felt gradient */}
        <div className="absolute inset-0 rounded-[50%]"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(21, 128, 61, 0.6) 0%, 
                rgba(22, 101, 52, 0.4) 30%, 
                rgba(20, 83, 45, 0.3) 50%, 
                rgba(15, 76, 26, 0.2) 70%, 
                transparent 90%
              )
            `
          }}>
        </div>
        
        {/* Inner glow effect for depth */}
        <div className="absolute inset-4 rounded-[50%] shadow-[inset_0_0_60px_0_rgba(34,197,94,0.3)]"></div>
        
        {/* Premium table rail effect */}
        <div className="absolute inset-0 rounded-[50%] border-2 border-amber-700/50 shadow-[inset_0_-4px_12px_0_rgba(120,53,15,0.6)]"></div>
        
        {/* Table content container */}
        <div className="relative h-full flex items-center justify-center">
          {/* Enhanced pot display */}
          <AnimatePresence>
            {pot > 0 && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-16 z-20"
                initial={{ scale: 0, y: -30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0, y: -30, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
              >
                <div className="relative">
                  {/* Enhanced chip stack background */}
                  <div className="absolute -inset-4 bg-gradient-to-b from-amber-400/30 to-red-600/30 rounded-full blur-lg"></div>
                  
                  {/* Main pot container with premium styling */}
                  <div className="relative bg-gradient-to-b from-black/90 to-black/95 px-8 py-4 rounded-full border-2 border-gold/60 shadow-[0_0_30px_0_rgba(251,191,36,0.6)]">
                    <div className="flex items-center gap-3">
                      {/* Enhanced chip icon */}
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-3 border-amber-300 shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-amber-200 rounded-full"></div>
                      </div>
                      <span className="text-gold font-bold text-2xl tracking-wide">
                        ${pot.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Floating chips animation */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full border border-red-300"
                    animate={{ 
                      y: [0, -6, 0],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border border-blue-300"
                    animate={{ 
                      y: [0, -4, 0],
                      rotate: [0, -15, 15, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Game phase indicator */}
          <motion.div 
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-emerald/40 shadow-lg">
              <span className="text-emerald-300 font-semibold text-sm tracking-wide uppercase">
                {phase}
              </span>
            </div>
          </motion.div>
          
          {/* Enhanced table center logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full flex items-center justify-center pointer-events-none border-2 border-emerald-700/30"
            style={{
              background: `
                radial-gradient(circle at center, 
                  rgba(21, 128, 61, 0.3) 0%, 
                  rgba(22, 101, 52, 0.2) 30%, 
                  rgba(20, 83, 45, 0.1) 60%, 
                  transparent 80%
                )
              `
            }}>
            <motion.div
              className="text-emerald-200/50 font-bold text-xl tracking-widest"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              POKER GALAXY
            </motion.div>
          </div>
          
          {/* Pass through all child elements (seats, cards, etc) */}
          {children}
        </div>
        
        {/* Enhanced ambient particles effect */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
