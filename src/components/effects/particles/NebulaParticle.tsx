
import React from 'react';
import { StarParticle } from '../types';

interface NebulaParticleProps {
  particle: StarParticle;
}

export const NebulaParticleRenderer: React.FC<NebulaParticleProps> = ({ particle }) => {
  const baseStyle = {
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity,
    transform: `rotate(${particle.rotation}deg)`,
  };

  return (
    <div
      className="absolute pointer-events-none starfall-nebula"
      style={baseStyle}
    >
      <div
        className="w-full h-full"
        style={{
          background: `radial-gradient(ellipse, ${particle.color}30 0%, ${particle.color}10 50%, transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
};
