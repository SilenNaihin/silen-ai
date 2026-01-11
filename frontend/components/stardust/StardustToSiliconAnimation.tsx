'use client';

import { useMemo } from 'react';
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

// Deterministic "random" for render-safe star initialization
function pseudoRandom01(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
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
  // Make this animation reach its final state slightly before progress=1
  const finishBy = 0.9;
  const t = Math.min(1, Math.max(0, progress / finishBy));

  // Initialize stars once (render-safe & deterministic)
  const stars = useMemo<Star[]>(() => {
    const next: Star[] = [];
    const gridSize = 5;
    const gridSpacing = 0.12;
    const gridOffset = 0.5 - ((gridSize - 1) * gridSpacing) / 2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Random starting position (scattered)
        const base = 1 + i * gridSize + j;
        const startX = pseudoRandom01(base * 11.1);
        const startY = pseudoRandom01(base * 17.7);

        // Target position in grid
        const targetX = gridOffset + j * gridSpacing;
        const targetY = gridOffset + i * gridSpacing;

        next.push({
          x: startX,
          y: startY,
          size: 2 + pseudoRandom01(base * 29.3) * 2,
          targetX,
          targetY,
        });
      }
    }

    // Add some extra background stars that fade out
    for (let i = 0; i < 50; i++) {
      const base = 1000 + i;
      next.push({
        x: pseudoRandom01(base * 13.13),
        y: pseudoRandom01(base * 19.19),
        size: 1 + pseudoRandom01(base * 23.23) * 1.5,
        targetX: -1, // Off-screen target = fade out
        targetY: -1,
      });
    }
    return next;
  }, []);

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const gridStarCount = 25; // First 25 stars form the grid

    // Draw grid connections (appear as stars coalesce)
    if (t > 0.5) {
      const connectionAlpha = Math.min(1, (t - 0.5) * 2);
      ctx.strokeStyle = `rgba(0, 0, 0, ${connectionAlpha * 0.3})`;
      ctx.lineWidth = 1;

      const gridSize = 5;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const idx = i * gridSize + j;
          const star = stars[idx];
          const x = lerp(star.x, star.targetX, easeInOut(t)) * width;
          const y = lerp(star.y, star.targetY, easeInOut(t)) * height;

          // Connect to right neighbor
          if (j < gridSize - 1) {
            const rightIdx = i * gridSize + (j + 1);
            const rightStar = stars[rightIdx];
            const rx =
              lerp(rightStar.x, rightStar.targetX, easeInOut(t)) * width;
            const ry =
              lerp(rightStar.y, rightStar.targetY, easeInOut(t)) * height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(rx, ry);
            ctx.stroke();
          }

          // Connect to bottom neighbor
          if (i < gridSize - 1) {
            const bottomIdx = (i + 1) * gridSize + j;
            const bottomStar = stars[bottomIdx];
            const bx =
              lerp(bottomStar.x, bottomStar.targetX, easeInOut(t)) * width;
            const by =
              lerp(bottomStar.y, bottomStar.targetY, easeInOut(t)) * height;
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
        const x = lerp(star.x, star.targetX, easeInOut(t)) * width;
        const y = lerp(star.y, star.targetY, easeInOut(t)) * height;

        // Size grows slightly as they settle
        const size = star.size * (1 + t * 0.3);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
      } else {
        // Background stars: fade out as grid forms
        const alpha = Math.max(0, 1 - t * 1.5);
        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }
    });
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
