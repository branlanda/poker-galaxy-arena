
import React from 'react';
import { StarParticle } from '../types';

interface CometParticleProps {
  particle: StarParticle;
}

export const CometParticleRenderer: React.FC<CometParticleProps> = ({ particle }) => {
  const baseStyle = {
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity,
    transform: `rotate(${particle.rotation}deg)`,
  };

  return (
    <div className="absolute pointer-events-none">
      {/* Trail del cometa */}
      {particle.trail?.map((point, index) => (
        <div
          key={`${particle.id}-trail-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${particle.size * (1 - index * 0.1)}px`,
            height: `${particle.size * (1 - index * 0.1)}px`,
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            opacity: point.opacity * 0.6,
          }}
        />
      ))}
      {/* Cabeza del cometa */}
      <div
        className="absolute rounded-full"
        style={{
          ...baseStyle,
          background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}90 40%, transparent 80%)`,
          boxShadow: `0 0 ${particle.size * 4}px ${particle.color}60, 0 0 ${particle.size * 8}px ${particle.color}30`,
        }}
      />
    </div>
  );
};
