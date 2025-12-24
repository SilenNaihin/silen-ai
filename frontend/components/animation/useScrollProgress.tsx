'use client';

import { useEffect, useState, RefObject } from 'react';

/**
 * Hook to track scroll progress of an element relative to the viewport
 * Returns a value between 0 and 1
 * - 0: element just entered viewport from bottom
 * - 1: element completely scrolled past viewport
 */
export function useScrollProgress(ref: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate progress accounting for viewport visibility
      // When element top is at viewport top: progress = 0
      // When element bottom is at viewport bottom: progress = 1
      // The scrollable range is elementHeight - viewportHeight
      const scrollDistance = Math.max(1, elementHeight - viewportHeight);
      const currentScroll = -rect.top; // How far we've scrolled from top
      const scrollProgress = Math.max(
        0,
        Math.min(1, currentScroll / scrollDistance)
      );

      setProgress(scrollProgress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref]);

  return progress;
}
