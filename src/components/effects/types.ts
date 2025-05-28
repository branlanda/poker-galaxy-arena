
export interface StarParticle {
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

export const GALAXY_COLORS = [
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
