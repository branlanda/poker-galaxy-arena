
import React from 'react';
import { StarParticle } from '../types';

interface StarParticleProps {
  particle: StarParticle;
}

export const StarParticleRenderer: React.FC<StarParticleProps> = ({ particle }) => {
  const pulseSize = particle.type === 'sparkle' 
    ? particle.size * (1 + Math.sin(particle.pulsePhase) * 0.3)
    : particle.size;

  const baseStyle = {
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${pulseSize}px`,
    height: `${pulseSize}px`,
    opacity: particle.opacity,
    transform: `rotate(${particle.rotation}deg)`,
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={baseStyle}
    >
      <div
        className="w-full h-full relative"
        style={{
          background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}80 50%, transparent 100%)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size * 3}px ${particle.color}40, 0 0 ${particle.size * 6}px ${particle.color}20`,
        }}
      />
      {/* Cruz de estrella */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `linear-gradient(0deg, transparent 45%, ${particle.color} 50%, transparent 55%), linear-gradient(90deg, transparent 45%, ${particle.color} 50%, transparent 55%)`,
        }}
      />
    </div>
  );
};
