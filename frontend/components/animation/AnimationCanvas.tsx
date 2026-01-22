'use client';

import { useRef, useEffect, useCallback } from 'react';

interface AnimationCanvasProps {
  children: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  progress: number;
  className?: string;
  /** When true, continuously re-renders for time-based animations */
  animating?: boolean;
}

/**
 * A canvas wrapper that handles resize and provides rendering context
 * Re-renders when progress changes, or continuously when animating=true
 */
export function AnimationCanvas({
  children,
  progress,
  className = '',
  animating = false
}: AnimationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const render = useCallback(() => {
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
  }, [children]);

  // Progress-based rendering
  useEffect(() => {
    if (!animating) {
      render();
    }
  }, [progress, render, animating]);

  // Continuous animation loop
  useEffect(() => {
    if (!animating) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const animate = () => {
      render();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [animating, render]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return <canvas ref={canvasRef} className={className} />;
}

