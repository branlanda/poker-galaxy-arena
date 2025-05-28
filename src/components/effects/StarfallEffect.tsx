
import React, { useEffect, useState, useCallback } from 'react';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: 'star' | 'comet' | 'sparkle' | 'nebula';
  color: string;
  rotation: number;
  rotationSpeed: number;
  trail?: Array<{ x: number; y: number; opacity: number }>;
  pulsePhase: number;
}

const StarfallEffect: React.FC = () => {
  const [particles, setParticles] = useState<StarParticle[]>([]);

  // Colores galácticos premium
  const galaxyColors = [
    '#1CC29F', // Emerald
    '#E4C770', // Gold
    '#60A5FA', // Blue
    '#A78BFA', // Purple
    '#F472B6', // Pink
    '#34D399', // Teal
    '#FBBF24', // Amber
    '#FFFFFF', // White
    '#E5E7EB', // Light gray
  ];

  const createParticle = useCallback((): StarParticle => {
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
      color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      trail: type === 'comet' ? [] : undefined,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }, []);

  const initializeParticles = useCallback(() => {
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    const initialParticles: StarParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = createParticle();
      particle.y = Math.random() * window.innerHeight;
      initialParticles.push(particle);
    }
    
    setParticles(initialParticles);
  }, [createParticle]);

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
  }, [createParticle]);

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

  const renderParticle = (particle: StarParticle) => {
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

    switch (particle.type) {
      case 'star':
        return (
          <div
            key={particle.id}
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

      case 'comet':
        return (
          <div key={particle.id} className="absolute pointer-events-none">
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

      case 'sparkle':
        return (
          <div
            key={particle.id}
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

      case 'nebula':
        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={baseStyle}
          >
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(ellipse, ${particle.color}30 0%, ${particle.color}10 50%, transparent 100%)`,
                borderRadius: '50%',
                filter: 'blur(1px)',
                animation: `pulse 3s ease-in-out infinite`,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Gradiente de fondo galáctico sutil */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, #1CC29F20 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, #E4C77020 0%, transparent 50%),
              radial-gradient(ellipse at 50% 10%, #60A5FA15 0%, transparent 50%),
              radial-gradient(ellipse at 10% 80%, #A78BFA15 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Partículas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(renderParticle)}
      </div>

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default StarfallEffect;
