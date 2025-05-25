
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const StarfallEffect: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const createStar = () => {
      return {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -10,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      };
    };

    const initializeStars = () => {
      const initialStars: Star[] = [];
      for (let i = 0; i < 50; i++) {
        initialStars.push({
          ...createStar(),
          y: Math.random() * window.innerHeight,
        });
      }
      setStars(initialStars);
    };

    const animateStars = () => {
      setStars(prevStars => {
        return prevStars.map(star => {
          const newY = star.y + star.speed;
          
          if (newY > window.innerHeight + 10) {
            return createStar();
          }
          
          return {
            ...star,
            y: newY,
          };
        });
      });
    };

    initializeStars();
    const interval = setInterval(animateStars, 50);

    const handleResize = () => {
      initializeStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}
    </div>
  );
};

export default StarfallEffect;
