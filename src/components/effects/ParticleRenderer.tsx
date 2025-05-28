
import React from 'react';
import { StarParticle } from './types';
import { StarParticleRenderer } from './particles/StarParticle';
import { CometParticleRenderer } from './particles/CometParticle';
import { SparkleParticleRenderer } from './particles/SparkleParticle';
import { NebulaParticleRenderer } from './particles/NebulaParticle';

interface ParticleRendererProps {
  particle: StarParticle;
}

export const ParticleRenderer: React.FC<ParticleRendererProps> = ({ particle }) => {
  switch (particle.type) {
    case 'star':
      return <StarParticleRenderer particle={particle} />;
    case 'comet':
      return <CometParticleRenderer particle={particle} />;
    case 'sparkle':
      return <SparkleParticleRenderer particle={particle} />;
    case 'nebula':
      return <NebulaParticleRenderer particle={particle} />;
    default:
      return null;
  }
};
