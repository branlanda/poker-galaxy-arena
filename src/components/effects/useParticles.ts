
import { useState, useEffect, useCallback } from 'react';
import { StarParticle } from './types';
import { createParticle } from './particleFactory';

export const useParticles = () => {
  const [particles, setParticles] = useState<StarParticle[]>([]);

  const initializeParticles = useCallback(() => {
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    const initialParticles: StarParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = createParticle();
      particle.y = Math.random() * window.innerHeight;
      initialParticles.push(particle);
    }
    
    setParticles(initialParticles);
  }, []);

  const animateParticles = useCallback(() => {
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        const newY = particle.y + particle.speed;
        const newRotation = particle.rotation + particle.rotationSpeed;
        const newPulsePhase = particle.pulsePhase + 0.1;
        
        // Si la partícula sale de la pantalla, crear una nueva
        if (newY > window.innerHeight + 20) {
          return createParticle();
        }
        
        // Actualizar trail para cometas
        let newTrail = particle.trail;
        if (particle.type === 'comet' && particle.trail) {
          newTrail = [
            { x: particle.x, y: particle.y, opacity: particle.opacity },
            ...particle.trail.slice(0, 8)
          ].map((point, index) => ({
            ...point,
            opacity: point.opacity * (1 - index * 0.15)
          }));
        }
        
        return {
          ...particle,
          y: newY,
          rotation: newRotation,
          pulsePhase: newPulsePhase,
          trail: newTrail,
          // Efecto de brillo pulsante
          opacity: particle.type === 'sparkle' 
            ? Math.abs(Math.sin(newPulsePhase)) * 0.8 + 0.2
            : particle.opacity,
        };
      });
    });
  }, []);

  useEffect(() => {
    initializeParticles();
    const interval = setInterval(animateParticles, 50);
    
    const handleResize = () => {
      initializeParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeParticles, animateParticles]);

  return particles;
};
