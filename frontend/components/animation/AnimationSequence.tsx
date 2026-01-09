'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';

/**
 * A milestone within an animation that pins progress to a specific element
 */
export interface AnimationMilestone {
  /** Element ID that triggers this milestone */
  elementId: string;
  /** Progress value (0-1) that the animation should be at when this element is in view */
  progress: number;
}

/**
 * Configuration for a single animation in the sequence
 */
export interface AnimationConfig {
  /**
   * Render function that receives normalized progress (0-1) for this animation
   */
  render: (progress: number) => ReactNode;

  /**
   * Element ID that triggers this animation to start.
   * When provided, the animation begins when this element reaches the viewport center.
   * This takes precedence over duration-based positioning.
   */
  startElementId?: string;

  /**
   * Milestones allow you to pin specific progress values to specific elements.
   * Progress is interpolated linearly between milestones.
   *
   * @example
   * ```tsx
   * {
   *   render: (p) => <BrainAnimation progress={p} />,
   *   startElementId: 'intro',
   *   milestones: [
   *     { elementId: 'brain-formed', progress: 0.5 },  // At this element, animation is 50% done
   *     { elementId: 'brain-active', progress: 0.8 },  // At this element, animation is 80% done
   *   ]
   * }
   * ```
   */
  milestones?: AnimationMilestone[];

  /**
   * Duration can be:
   * - number: weight relative to other animations (default: 1)
   * - string ending in 'px': pixel amount (e.g., '500px')
   * - string ending in '%': percentage of total scroll (e.g., '30%')
   *
   * When startElementId is used, duration controls how long (in scroll distance)
   * this animation plays before transitioning to the next.
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
 * - Element-based triggers via startElementId for precise content synchronization
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
 *       render: (p) => <IntroAnimation progress={p} />,
 *       startElementId: 'intro-section', // Starts when #intro-section is in view
 *     },
 *     {
 *       render: (p) => <SummaryAnimation progress={p} />,
 *       startElementId: 'summary-section', // Starts when #summary-section is in view
 *     }
 *   ]}
 * />
 * ```
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
  // Track element positions for element-based triggers (including milestones)
  const [elementPositions, setElementPositions] = useState<Map<string, number>>(new Map());

  // Calculate element positions on mount and scroll
  const updateElementPositions = useCallback(() => {
    const positions = new Map<string, number>();

    // Get the article container to calculate relative positions
    const articleElement = document.querySelector('[class*="min-h-screen"]');
    if (!articleElement) return;

    const articleRect = articleElement.getBoundingClientRect();
    const articleTop = window.scrollY + articleRect.top;
    const articleHeight = articleRect.height;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = Math.max(1, articleHeight - viewportHeight);

    // Helper to get normalized position for an element
    const getElementPosition = (elementId: string): number | null => {
      const element = document.getElementById(elementId);
      if (!element) return null;
      const elementRect = element.getBoundingClientRect();
      const elementTop = window.scrollY + elementRect.top - articleTop;
      const triggerPoint = elementTop - viewportHeight / 2;
      return Math.max(0, Math.min(1, triggerPoint / scrollableDistance));
    };

    animations.forEach((anim) => {
      // Track startElementId
      if (anim.startElementId) {
        const pos = getElementPosition(anim.startElementId);
        if (pos !== null) {
          positions.set(anim.startElementId, pos);
        }
      }

      // Track milestone element IDs
      if (anim.milestones) {
        anim.milestones.forEach((milestone) => {
          const pos = getElementPosition(milestone.elementId);
          if (pos !== null) {
            positions.set(milestone.elementId, pos);
          }
        });
      }
    });

    setElementPositions(positions);
  }, [animations]);

  useEffect(() => {
    updateElementPositions();

    // Update on resize (element positions may change)
    window.addEventListener('resize', updateElementPositions);

    // Initial delay to ensure elements are rendered
    const timeout = setTimeout(updateElementPositions, 100);

    return () => {
      window.removeEventListener('resize', updateElementPositions);
      clearTimeout(timeout);
    };
  }, [updateElementPositions]);

  // Calculate normalized ranges for each animation
  const animationRanges = calculateAnimationRanges(
    animations,
    scrollableHeight,
    elementPositions
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
        // Use milestones if available for more precise control
        const normalizedProgress = animation.milestones && animation.milestones.length > 0
          ? calculateProgressWithMilestones(
              scrollProgress,
              range,
              animation.milestones,
              elementPositions
            )
          : calculateNormalizedProgress(scrollProgress, range);

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
 * Uses element positions when startElementId is provided
 */
function calculateAnimationRanges(
  animations: AnimationConfig[],
  scrollableHeight?: number,
  elementPositions?: Map<string, number>
): AnimationRange[] {
  const ranges: AnimationRange[] = [];

  // Check if any animations use element-based positioning
  const hasElementBasedAnimations = animations.some(
    (a) => a.startElementId && elementPositions?.has(a.startElementId)
  );

  if (hasElementBasedAnimations && elementPositions && elementPositions.size > 0) {
    // Element-based positioning: use element positions to determine ranges
    // First, collect all animations with their start positions
    const animationsWithPositions: Array<{
      index: number;
      startPosition: number;
      animation: AnimationConfig;
    }> = [];

    let lastKnownPosition = 0;

    animations.forEach((animation, index) => {
      let startPosition: number;

      if (animation.startElementId && elementPositions.has(animation.startElementId)) {
        // Use element position
        startPosition = elementPositions.get(animation.startElementId)!;
        lastKnownPosition = startPosition;
      } else if (index === 0) {
        // First animation starts at 0
        startPosition = 0;
      } else {
        // No element ID - this animation will be positioned after the previous one
        // Use a small increment from last known position
        startPosition = lastKnownPosition;
      }

      animationsWithPositions.push({
        index,
        startPosition,
        animation,
      });
    });

    // Sort by start position to handle any out-of-order element positions
    animationsWithPositions.sort((a, b) => a.startPosition - b.startPosition);

    // Calculate ranges based on sorted positions
    animationsWithPositions.forEach((item, sortedIndex) => {
      const { animation, startPosition } = item;
      const overlap = animation.overlap ?? 0;

      // End position is either the next animation's start or 1.0
      let endPosition: number;
      if (sortedIndex < animationsWithPositions.length - 1) {
        endPosition = animationsWithPositions[sortedIndex + 1].startPosition;
      } else {
        endPosition = 1.0;
      }

      // Ensure minimum duration
      const duration = Math.max(0.02, endPosition - startPosition);
      const actualEnd = startPosition + duration;

      // Calculate overlap
      const overlapDuration = sortedIndex < animationsWithPositions.length - 1
        ? duration * overlap
        : 0;
      const fadeOutStart = actualEnd - overlapDuration;

      // Fade in over first 15% of animation
      const fadeInDuration = Math.min(duration * 0.15, 0.05);
      const peak = startPosition + fadeInDuration;

      // Store range at original index position
      ranges[item.index] = {
        start: startPosition,
        peak: peak,
        end: actualEnd,
        fadeOut: fadeOutStart,
      };
    });

    return ranges;
  }

  // Fallback: Duration-based positioning (original behavior)
  const weights = animations.map((anim) => {
    const duration = anim.duration ?? 1;

    if (typeof duration === 'number') {
      return duration;
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

    return 1;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let currentStart = 0;

  animations.forEach((animation, index) => {
    const weight = weights[index];
    const duration = weight / totalWeight;
    const overlap = animation.overlap ?? 0;

    const overlapDuration =
      index < animations.length - 1 ? duration * overlap : 0;

    const fadeOutStart = currentStart + duration - overlapDuration;
    const end = currentStart + duration;

    const fadeInDuration = Math.min(duration * 0.2, 0.1);
    const peak = currentStart + fadeInDuration;

    ranges.push({
      start: currentStart,
      peak: peak,
      end: end,
      fadeOut: fadeOutStart,
    });

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

/**
 * Calculate progress using milestones for more precise control.
 * Interpolates linearly between milestone points.
 *
 * @example
 * If animation starts at scroll 0.2 and ends at 0.6, with milestone at 0.4 = 50%:
 * - At scroll 0.2: progress = 0
 * - At scroll 0.4: progress = 0.5
 * - At scroll 0.6: progress = 1.0
 */
function calculateProgressWithMilestones(
  scrollProgress: number,
  range: AnimationRange,
  milestones: AnimationMilestone[],
  elementPositions: Map<string, number>
): number {
  // Build sorted list of progress points: start (0), milestones, end (1)
  const points: Array<{ scrollPos: number; animProgress: number }> = [
    { scrollPos: range.start, animProgress: 0 },
  ];

  // Add milestone points
  milestones.forEach((milestone) => {
    const scrollPos = elementPositions.get(milestone.elementId);
    if (scrollPos !== undefined) {
      points.push({ scrollPos, animProgress: milestone.progress });
    }
  });

  // Add end point
  points.push({ scrollPos: range.end, animProgress: 1 });

  // Sort by scroll position
  points.sort((a, b) => a.scrollPos - b.scrollPos);

  // Find which segment we're in and interpolate
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    if (scrollProgress <= next.scrollPos) {
      // We're in this segment - interpolate
      const segmentScrollRange = next.scrollPos - current.scrollPos;
      if (segmentScrollRange <= 0) return current.animProgress;

      const scrollInSegment = scrollProgress - current.scrollPos;
      const segmentProgress = scrollInSegment / segmentScrollRange;

      const animProgressRange = next.animProgress - current.animProgress;
      return current.animProgress + segmentProgress * animProgressRange;
    }
  }

  // Past all points - return 1
  return 1;
}
