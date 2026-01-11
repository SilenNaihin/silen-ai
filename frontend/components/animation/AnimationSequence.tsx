'use client';

import { ReactNode, useEffect, useState, useCallback, createContext, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';

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

  /**
   * Controls mobile inline rendering behavior.
   * - true (default for animations with startElementId): renders at 100% progress inline
   *   below the startElementId element on mobile, pushing content down
   * - false: animation is hidden on mobile (not shown in background or inline)
   *
   * Animations without startElementId cannot render inline and this prop is ignored.
   */
  mobileInline?: boolean;
}


/**
 * Context to share animation configurations for mobile inline rendering
 */
interface AnimationContextValue {
  animations: AnimationConfig[];
  isMobile: boolean;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

/**
 * Provider to share animation configurations between AnimationSequence and MobileInlineAnimation.
 * Wrap your ArticleLayout with this provider when using mobileInline animations.
 *
 * @example
 * ```tsx
 * <AnimationsProvider animations={myAnimations}>
 *   <ArticleLayout
 *     leftContent={(scrollProgress) => (
 *       <AnimationSequence scrollProgress={scrollProgress} />
 *     )}
 *   >
 *     <h2 id="intro">Intro</h2>
 *     <MobileInlineAnimation startElementId="intro" />
 *   </ArticleLayout>
 * </AnimationsProvider>
 * ```
 */
export function AnimationsProvider({
  animations,
  children,
}: {
  animations: AnimationConfig[];
  children: ReactNode;
}) {
  // Track mobile viewport (matches xl breakpoint where sticky panel shows)
  // Always start false to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile(); // Check immediately after mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimationContext.Provider value={{ animations, isMobile }}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to access animation context
 */
export function useAnimations() {
  return useContext(AnimationContext);
}

/**
 * Component to render a specific animation inline at 100% progress.
 * Use this in your article content to show animations inline on mobile.
 * Place it right after the element you want the animation to appear below.
 * Must be used within an AnimationsProvider.
 *
 * @example
 * ```tsx
 * <h2 id="my-section">Section Title</h2>
 * <MobileInlineAnimation startElementId="my-section" />
 * <p>Content continues here...</p>
 * ```
 */
export function MobileInlineAnimation({
  startElementId,
  className = '',
}: {
  /** The startElementId of the animation to render */
  startElementId: string;
  className?: string;
}) {
  const context = useContext(AnimationContext);

  if (!context) {
    // Not within AnimationsProvider - render nothing
    return null;
  }

  const { animations, isMobile } = context;

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  // Find the animation with matching startElementId and mobileInline: true
  const animation = animations.find(
    (a) => a.startElementId === startElementId && a.mobileInline
  );

  if (!animation) {
    return null;
  }

  return (
    <div className={`my-6 w-full ${className}`}>
      <div className="aspect-[4/3] relative">
        {animation.render(1)} {/* Render at 100% progress */}
      </div>
    </div>
  );
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
 * - Animations finish slightly early (at 90% of scroll range) for smoother transitions
 * - Mobile inline mode: render animations at 100% below their start element on mobile
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
 *       mobileInline: true, // Shows at 100% inline on mobile
 *     }
 *   ]}
 * />
 * ```
 */
export function AnimationSequence({
  scrollProgress,
  scrollableHeight,
  animations: animationsProp,
}: {
  scrollProgress: number;
  scrollableHeight?: number;
  /** Animations config - can also be provided via AnimationsProvider context */
  animations?: AnimationConfig[];
}) {
  // Get animations from context or props
  const context = useContext(AnimationContext);
  const animations = animationsProp ?? context?.animations ?? [];

  // Track mobile viewport (use context if available, otherwise detect locally)
  // Always start false to avoid hydration mismatch, then update in effect
  const [localIsMobile, setLocalIsMobile] = useState(false);
  useEffect(() => {
    if (context) return; // Use context value instead
    const checkMobile = () => setLocalIsMobile(window.innerWidth < 1280);
    checkMobile(); // Check immediately after mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [context]);
  const isMobile = context?.isMobile ?? localIsMobile;

  // Track element positions for element-based triggers (including milestones)
  const [elementPositions, setElementPositions] = useState<Map<string, number>>(new Map());

  // Store animations in a ref to avoid dependency issues
  const animationsRef = useRef(animations);
  animationsRef.current = animations;

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

    // Use ref to avoid dependency on animations array
    animationsRef.current.forEach((anim) => {
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
  }, []); // No dependencies - uses ref

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

  // Track if we've set up mobile containers
  // Use ref for flag (no re-render on change) and state counter to force re-render after setup
  const mobileSetupDone = useRef(false);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const ownedContainers = useRef<Set<string>>(new Set()); // Containers we created (not reused)
  const [, forceUpdate] = useState(0);

  // Create containers for mobile inline animations - only once on mount when mobile
  useEffect(() => {
    // Only run setup once when mobile is detected
    if (!isMobile || mobileSetupDone.current) return;

    // Get all startElementIds that should render inline
    const inlineElementIds = animations
      .filter((a) => a.startElementId && a.mobileInline !== false)
      .map((a) => a.startElementId!);

    // Create containers (skip if already exists from another AnimationSequence instance)
    inlineElementIds.forEach((elementId) => {
      if (containerRefs.current.has(elementId)) return;

      // Check if container already exists in DOM (from another instance)
      const existingContainer = document.querySelector(`[data-animation-id="${elementId}"]`);
      if (existingContainer) {
        // Another instance owns this container, skip
        return;
      }

      const targetElement = document.getElementById(elementId);
      if (!targetElement) return;

      // Create container
      const container = document.createElement('div');
      container.className = 'mobile-inline-animation';
      container.style.cssText = 'display:block;width:100%;margin:1rem 0;';
      container.setAttribute('data-animation-id', elementId);

      // Insert after the target element's parent (usually the heading wrapper)
      // This ensures we don't break the heading structure
      const insertTarget = targetElement.parentElement?.tagName === 'DIV'
        ? targetElement.parentElement
        : targetElement;
      insertTarget.parentNode?.insertBefore(container, insertTarget.nextSibling);
      containerRefs.current.set(elementId, container);
      ownedContainers.current.add(elementId); // Mark as owned by this instance
    });

    mobileSetupDone.current = true;
    forceUpdate(n => n + 1); // Force re-render to show portals

    // Cleanup only on unmount - only remove containers we created
    return () => {
      ownedContainers.current.forEach((elementId) => {
        const container = containerRefs.current.get(elementId);
        if (container) container.remove();
      });
      containerRefs.current.clear();
      ownedContainers.current.clear();
      mobileSetupDone.current = false;
    };
  }, [isMobile]); // Only depend on isMobile

  // Render mobile inline animations via portals (smaller size than sidebar)
  // Only render for containers this instance owns (created, not reused)
  const mobileInlinePortals = isMobile && mobileSetupDone.current
    ? animations
        .filter((a) => a.startElementId && a.mobileInline !== false && ownedContainers.current.has(a.startElementId))
        .map((animation) => {
          const container = containerRefs.current.get(animation.startElementId!);
          if (!container) return null;

          return createPortal(
            <div
              key={`mobile-${animation.startElementId}`}
              className="w-full max-w-md mx-auto aspect-video"
            >
              {animation.render(1)}
            </div>,
            container
          );
        })
        .filter(Boolean)
    : [];

  // Find which animation(s) should be rendered based on current progress
  return (
    <>
      {/* Mobile inline animations rendered via portals */}
      {mobileInlinePortals}

      {animations.map((animation, index) => {
        // On mobile, skip animations that should render inline (via portals)
        // Don't depend on container existence - just skip if it should be inline
        const shouldBeInline = animation.startElementId && animation.mobileInline !== false;
        if (isMobile && shouldBeInline) return null;

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
        // Progress reaches 100% at fadeOut point (before the animation starts fading)
        let normalizedProgress: number;

        if (animation.milestones && animation.milestones.length > 0) {
          // For milestone animations, use fadeOut as the endpoint
          normalizedProgress = calculateProgressWithMilestones(
            scrollProgress,
            range,
            animation.milestones,
            elementPositions
          );
        } else {
          // For non-milestone animations, scale to reach 100% at fadeOut
          normalizedProgress = calculateNormalizedProgress(scrollProgress, range);
        }

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
 * Calculate normalized progress (0-1) within animation's active range.
 * Progress reaches 100% at 80% of the way to fadeOut, giving buffer before fading.
 */
function calculateNormalizedProgress(
  progress: number,
  range: AnimationRange
): number {
  // Calculate effective end at 80% of the way to fadeOut
  // This ensures animation completes before fading starts (20% buffer)
  const durationToFadeOut = range.fadeOut - range.start;
  const effectiveEnd = range.start + durationToFadeOut * 0.8;
  const effectiveDuration = effectiveEnd - range.start;
  if (effectiveDuration <= 0) return 1;

  const currentProgress = Math.max(0, progress - range.start);
  return Math.min(1, currentProgress / effectiveDuration);
}

/**
 * Calculate progress using milestones for more precise control.
 * Interpolates linearly between milestone points.
 *
 * NOTE: Milestone-based animations do NOT use early finish because the author
 * explicitly defined when progress should reach certain values. The animation
 * completes at fadeOut, not before.
 *
 * @example
 * If animation starts at scroll 0.2 and fadeOut at 0.55:
 * - At scroll 0.2: progress = 0
 * - At scroll 0.4: progress = 0.5 (if milestone defines this)
 * - At scroll 0.55: progress = 1.0 (completes at fadeOut)
 */
function calculateProgressWithMilestones(
  scrollProgress: number,
  range: AnimationRange,
  milestones: AnimationMilestone[],
  elementPositions: Map<string, number>
): number {
  // For milestone animations, use fadeOut as the endpoint (no early finish)
  // Authors have explicitly defined milestone timing, so we respect that
  const effectiveEnd = range.fadeOut;

  // Build sorted list of progress points: start (0), milestones, effectiveEnd (1)
  const points: Array<{ scrollPos: number; animProgress: number }> = [
    { scrollPos: range.start, animProgress: 0 },
  ];

  // Add all milestone points
  milestones.forEach((milestone) => {
    const scrollPos = elementPositions.get(milestone.elementId);
    if (scrollPos !== undefined) {
      points.push({ scrollPos, animProgress: milestone.progress });
    }
  });

  // Add end point at fadeOut (where animation should complete)
  points.push({ scrollPos: effectiveEnd, animProgress: 1 });

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
