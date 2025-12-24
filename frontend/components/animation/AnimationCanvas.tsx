'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface AnimationCanvasProps {
  children: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  progress: number;
  className?: string;
}

/**
 * A canvas wrapper that handles resize and provides rendering context
 * Re-renders when progress changes
 */
export function AnimationCanvas({ children, progress, className = '' }: AnimationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Call render function
    children(ctx, canvas);
  }, [progress, children]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      children(ctx, canvas);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  return <canvas ref={canvasRef} className={className} />;
}

