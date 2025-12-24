'use client';

import { ReactNode } from 'react';

/**
 * Configuration for a single animation in the sequence
 */
export interface AnimationConfig {
  /**
   * Render function that receives normalized progress (0-1) for this animation
   */
  render: (progress: number) => ReactNode;

  /**
   * Duration can be:
   * - number: weight relative to other animations (default: 1)
   * - string ending in 'px': pixel amount (e.g., '500px')
   * - string ending in '%': percentage of total scroll (e.g., '30%')
   */
  duration?: number | string;

  /**
   * Overlap with next animation (0-1, where 0.2 = 20% overlap)
   * Default: 0 (no overlap)
   */
  overlap?: number;
}

/**
 * Orchestrates multiple animations in sequence based on scroll progress
 *
 * Features:
 * - Automatic distribution of scroll progress across animations
 * - Pixel-based or percentage-based duration control
 * - Smooth transitions with configurable overlap
 * - Each animation receives normalized progress (0-1)
 *
 * @example
 * ```tsx
 * <AnimationSequence
 *   scrollProgress={scrollProgress}
 *   animations={[
 *     {
 *       render: (p) => <SpiralAnimation progress={p} startOffset={0.15} />,
 *       duration: 2, // Weighted 2x relative to others
 *       overlap: 0.2 // 20% overlap with next animation
 *     },
 *     {
 *       render: (p) => <NetworkAnimation progress={p} />,
 *       duration: 1 // Default weight
 *     }
 *   ]}
 * />
 * ```
 *
 * Note: Pixel-based durations ('500px') require passing scrollableHeight prop,
 * which should be the article's scrollable range (elementHeight - viewportHeight)
 */
export function AnimationSequence({
  scrollProgress,
  scrollableHeight,
  animations,
}: {
  scrollProgress: number;
  scrollableHeight?: number;
  animations: AnimationConfig[];
}) {
  // Calculate normalized ranges for each animation
  const animationRanges = calculateAnimationRanges(
    animations,
    scrollableHeight
  );

  // Find which animation(s) should be rendered based on current progress
  return (
    <>
      {animations.map((animation, index) => {
        const range = animationRanges[index];
        const isFirst = index === 0;
        const isLast = index === animations.length - 1;

        // Calculate opacity for smooth transitions
        const opacity = calculateOpacity(
          scrollProgress,
          range,
          isFirst,
          isLast
        );

        if (opacity <= 0) return null;

        // Calculate normalized progress within this animation's range
        const normalizedProgress = calculateNormalizedProgress(
          scrollProgress,
          range
        );

        // Render with opacity wrapper
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity,
              transition: 'opacity 0.1s ease-out',
            }}
          >
            {animation.render(normalizedProgress)}
          </div>
        );
      })}
    </>
  );
}

interface AnimationRange {
  start: number; // 0-1, where this animation starts
  peak: number; // 0-1, where this animation reaches full opacity
  end: number; // 0-1, where this animation ends
  fadeOut: number; // 0-1, where fade out begins
}

/**
 * Calculate the scroll progress ranges for each animation
 */
function calculateAnimationRanges(
  animations: AnimationConfig[],
  scrollableHeight?: number
): AnimationRange[] {
  // First, normalize all durations to weights
  const weights = animations.map((anim) => {
    const duration = anim.duration ?? 1;

    if (typeof duration === 'number') {
      return duration; // Already a weight
    }

    if (typeof duration === 'string') {
      if (duration.endsWith('px')) {
        if (!scrollableHeight) {
          console.warn(
            'Pixel-based duration requires scrollableHeight. Falling back to weight 1.'
          );
          return 1;
        }
        const pixels = parseFloat(duration);
        return pixels / scrollableHeight;
      }

      if (duration.endsWith('%')) {
        const percentage = parseFloat(duration);
        return percentage / 100;
      }
    }

    return 1; // Default weight
  });

  // Calculate total weight
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Calculate ranges for each animation
  const ranges: AnimationRange[] = [];
  let currentStart = 0;

  animations.forEach((animation, index) => {
    const weight = weights[index];
    const duration = weight / totalWeight;
    const overlap = animation.overlap ?? 0;

    // Calculate the overlap duration with next animation
    const overlapDuration =
      index < animations.length - 1 ? duration * overlap : 0;

    // Start fading out before the end if there's overlap
    const fadeOutStart = currentStart + duration - overlapDuration;
    const end = currentStart + duration;

    // Fade in over first 20% of animation (or less if animation is short)
    const fadeInDuration = Math.min(duration * 0.2, 0.1);
    const peak = currentStart + fadeInDuration;

    ranges.push({
      start: currentStart,
      peak: peak,
      end: end,
      fadeOut: fadeOutStart,
    });

    // Next animation starts where overlap begins
    currentStart = fadeOutStart;
  });

  return ranges;
}

/**
 * Calculate opacity for smooth fade in/out
 */
function calculateOpacity(
  progress: number,
  range: AnimationRange,
  isFirst: boolean,
  isLast: boolean
): number {
  // First animation: visible from the start (no fade in)
  if (isFirst && progress < range.start) return 1;

  // Before animation starts
  if (progress < range.start) return 0;

  // Fade in (skip for first animation)
  if (progress < range.peak) {
    if (isFirst) return 1; // First animation is already visible
    return (progress - range.start) / (range.peak - range.start);
  }

  // Full opacity
  if (progress < range.fadeOut) return 1;

  // Fade out (skip for last animation)
  if (progress < range.end) {
    if (isLast) return 1; // Last animation stays visible
    return 1 - (progress - range.fadeOut) / (range.end - range.fadeOut);
  }

  // After animation ends: last animation stays visible
  if (isLast) return 1;

  return 0;
}

/**
 * Calculate normalized progress (0-1) within animation's active range
 */
function calculateNormalizedProgress(
  progress: number,
  range: AnimationRange
): number {
  const duration = range.end - range.start;
  const currentProgress = Math.max(
    0,
    Math.min(duration, progress - range.start)
  );
  return currentProgress / duration;
}
