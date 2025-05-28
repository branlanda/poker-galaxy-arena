
import React from 'react';
import { StarParticle } from '../types';

interface SparkleParticleProps {
  particle: StarParticle;
}

export const SparkleParticleRenderer: React.FC<SparkleParticleProps> = ({ particle }) => {
  const pulseSize = particle.size * (1 + Math.sin(particle.pulsePhase) * 0.3);

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
        className="w-full h-full"
        style={{
          background: `conic-gradient(from ${particle.rotation}deg, transparent, ${particle.color}, transparent, ${particle.color}, transparent)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${pulseSize * 2}px ${particle.color}80`,
        }}
      />
    </div>
  );
};
