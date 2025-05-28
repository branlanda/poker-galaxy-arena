
import React from 'react';
import { useParticles } from './useParticles';
import { ParticleRenderer } from './ParticleRenderer';
import { GalacticBackground } from './GalacticBackground';

const StarfallEffect: React.FC = () => {
  const particles = useParticles();

  return (
    <>
      {/* Gradiente de fondo galáctico sutil */}
      <GalacticBackground />

      {/* Partículas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(particle => (
          <ParticleRenderer key={particle.id} particle={particle} />
        ))}
      </div>

      {/* CSS personalizado para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            opacity: 0.9;
          }
        }
        .starfall-nebula .w-full {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default StarfallEffect;
