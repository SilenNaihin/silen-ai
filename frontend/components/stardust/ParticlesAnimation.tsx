'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ParticlesAnimationProps {
  progress: number;
  startOffset?: number; // Internal offset to start animation partway through
  className?: string;
}

/**
 * Particle spiral animation that fills from center outward
 * Progress 0-1 controls the filling of particles in concentric layers
 */
export function ParticlesAnimation({ 
  progress, 
  startOffset = 0, 
  className = '' 
}: ParticlesAnimationProps) {
  // Apply internal offset
  const adjustedProgress = Math.min(1, progress + startOffset);
  
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const centerX = width / 2;
    const centerY = height / 2;
    
    drawParticlesFilling(ctx, centerX, centerY, width, height, adjustedProgress);
  };

  return (
    <AnimationCanvas 
      progress={adjustedProgress} 
      className={`w-full h-full ${className}`}
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

// Particles filling in from sparse to dense
function drawParticlesFilling(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  progress: number
) {
  const maxParticles = 400;
  const particleCount = Math.floor(maxParticles * progress);

  // Create deterministic particle positions
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 2654435761;
    const angle = ((seed % 1000) / 1000) * Math.PI * 2;
    const radiusFactor = (seed % 500) / 500;

    // Distribute in 5 concentric layers
    const layer = Math.floor((i / maxParticles) * 5);
    const baseRadius = 20 + layer * 35 + radiusFactor * 30;

    const angleOffset = Math.sin(i * 0.5) * 0.3;
    const finalAngle = angle + angleOffset;

    const x = cx + Math.cos(finalAngle) * baseRadius;
    const y = cy + Math.sin(finalAngle) * baseRadius;

    // Particles appear layer by layer from center outward
    const layerStartProgress = layer * 0.15;
    const particleIndexInLayer = i % 80;
    const particleDelayInLayer = (particleIndexInLayer / 80) * 0.15;

    const appearProgress = Math.max(
      0,
      Math.min(1, (progress - layerStartProgress - particleDelayInLayer) / 0.1)
    );

    if (appearProgress > 0) {
      const size = (1.5 + (seed % 10) / 10) * appearProgress;
      const alpha = appearProgress * 0.7;

      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

