'use client';

import { useRef } from 'react';
import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface StardustToSiliconAnimationProps {
  progress: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  targetX: number;
  targetY: number;
}

/**
 * "From Stardust to Silicon" - Simple closing animation
 *
 * Black stars on white background.
 * Stars coalesce into a silicon crystalline grid.
 */
export function StardustToSiliconAnimation({
  progress,
  className = '',
}: StardustToSiliconAnimationProps) {
  const starsRef = useRef<Star[]>([]);

  // Initialize stars once - positioned to form silicon grid when coalesced
  if (starsRef.current.length === 0) {
    const gridSize = 5;
    const gridSpacing = 0.12;
    const gridOffset = 0.5 - ((gridSize - 1) * gridSpacing) / 2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Random starting position (scattered)
        const startX = Math.random();
        const startY = Math.random();

        // Target position in grid
        const targetX = gridOffset + j * gridSpacing;
        const targetY = gridOffset + i * gridSpacing;

        starsRef.current.push({
          x: startX,
          y: startY,
          size: 2 + Math.random() * 2,
          targetX,
          targetY,
        });
      }
    }

    // Add some extra background stars that fade out
    for (let i = 0; i < 50; i++) {
      starsRef.current.push({
        x: Math.random(),
        y: Math.random(),
        size: 1 + Math.random() * 1.5,
        targetX: -1, // Off-screen target = fade out
        targetY: -1,
      });
    }
  }

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const stars = starsRef.current;
    const gridStarCount = 25; // First 25 stars form the grid

    // Draw grid connections (appear as stars coalesce)
    if (progress > 0.5) {
      const connectionAlpha = Math.min(1, (progress - 0.5) * 2);
      ctx.strokeStyle = `rgba(0, 0, 0, ${connectionAlpha * 0.3})`;
      ctx.lineWidth = 1;

      const gridSize = 5;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const idx = i * gridSize + j;
          const star = stars[idx];
          const x = lerp(star.x, star.targetX, easeInOut(progress)) * width;
          const y = lerp(star.y, star.targetY, easeInOut(progress)) * height;

          // Connect to right neighbor
          if (j < gridSize - 1) {
            const rightIdx = i * gridSize + (j + 1);
            const rightStar = stars[rightIdx];
            const rx = lerp(rightStar.x, rightStar.targetX, easeInOut(progress)) * width;
            const ry = lerp(rightStar.y, rightStar.targetY, easeInOut(progress)) * height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(rx, ry);
            ctx.stroke();
          }

          // Connect to bottom neighbor
          if (i < gridSize - 1) {
            const bottomIdx = (i + 1) * gridSize + j;
            const bottomStar = stars[bottomIdx];
            const bx = lerp(bottomStar.x, bottomStar.targetX, easeInOut(progress)) * width;
            const by = lerp(bottomStar.y, bottomStar.targetY, easeInOut(progress)) * height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }
    }

    // Draw stars
    stars.forEach((star, i) => {
      const isGridStar = i < gridStarCount;

      if (isGridStar) {
        // Grid stars: move toward target position
        const x = lerp(star.x, star.targetX, easeInOut(progress)) * width;
        const y = lerp(star.y, star.targetY, easeInOut(progress)) * height;

        // Size grows slightly as they settle
        const size = star.size * (1 + progress * 0.3);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
      } else {
        // Background stars: fade out as grid forms
        const alpha = Math.max(0, 1 - progress * 1.5);
        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }
    });

    // "Si" label appears at end
    if (progress > 0.8) {
      const labelAlpha = (progress - 0.8) / 0.2;
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.6})`;
      ctx.fillText('Si', width / 2, height / 2 + height * 0.25);
    }
  };

  return (
    <AnimationCanvas
      progress={progress}
      className={`w-full h-full ${className}`}
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

// Linear interpolation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Ease in-out function for smooth animation
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
