
import { StarParticle, GALAXY_COLORS } from './types';

export const createParticle = (): StarParticle => {
  const types: StarParticle['type'][] = ['star', 'comet', 'sparkle', 'nebula'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: -20,
    size: type === 'comet' ? Math.random() * 4 + 2 : 
          type === 'nebula' ? Math.random() * 8 + 4 :
          Math.random() * 3 + 1,
    speed: type === 'comet' ? Math.random() * 4 + 3 :
           type === 'sparkle' ? Math.random() * 2 + 1 :
           Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    type,
    color: GALAXY_COLORS[Math.floor(Math.random() * GALAXY_COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    trail: type === 'comet' ? [] : undefined,
    pulsePhase: Math.random() * Math.PI * 2,
  };
};
