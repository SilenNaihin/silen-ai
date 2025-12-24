# Animation System

This directory contains a powerful, flexible system for creating scroll-linked, performant animations using HTML5 Canvas.

## Components & Hooks

### `useScrollProgress`

A React hook that tracks scroll progress of an element relative to the viewport, accounting for viewport height.

**Usage:**

```tsx
const articleRef = useRef<HTMLDivElement>(null);
const scrollProgress = useScrollProgress(articleRef);
// scrollProgress ranges from 0 to 1
```

**Returns:**

- `number` - Progress value between 0 and 1
  - `0`: Element top is at viewport top
  - `1`: Element bottom is at viewport bottom
  - Accounts for viewport height: scrollable range = elementHeight - viewportHeight

**How it works:**

- Calculates element position relative to viewport
- Correctly handles viewport visibility (you can't scroll the last viewport height)
- Updates on scroll and window resize
- Provides smooth, normalized progress value
- Automatically cleans up event listeners

### `AnimationCanvas`

A canvas wrapper component that handles retina displays and automatic resizing.

**Usage:**

```tsx
<AnimationCanvas progress={scrollProgress} className="w-full h-full">
  {(ctx, canvas) => {
    // Your drawing code here
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
  }}
</AnimationCanvas>
```

**Props:**

- `children`: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void - Render function
- `progress`: number - Progress value that triggers re-render
- `className`: string - Optional CSS classes

**Important Notes:**

- Canvas dimensions are scaled for retina displays automatically
- Context is already scaled - use logical pixels in your drawing code
- Keep drawing operations efficient - they run on every progress change

### `AnimationSequence`

**NEW**: A powerful orchestrator that manages multiple animations in sequence with automatic timing distribution, smooth transitions, and flexible duration control.

**Usage:**

```tsx
<AnimationSequence
  scrollProgress={scrollProgress}
  animations={[
    {
      render: (progress) => (
        <ParticlesAnimation progress={progress} startOffset={0.15} />
      ),
      duration: 2, // Weighted 2x relative to other animations
      overlap: 0.2, // 20% overlap with next animation
    },
    {
      render: (progress) => <NetworkAnimation progress={progress} />,
      duration: 1, // Default weight
    },
  ]}
/>
```

**Props:**

- `scrollProgress`: number (0-1) - Current scroll progress from `useScrollProgress`
- `scrollableHeight`: number (optional) - For pixel-based durations
- `animations`: AnimationConfig[] - Array of animation configurations

**AnimationConfig:**

```tsx
{
  render: (progress: number) => ReactNode;
  duration?: number | string; // See duration types below
  overlap?: number; // 0-1, overlap with next animation
}
```

**Duration Types:**

1. **Weight (number)**: `duration: 2` - Takes 2x scroll space relative to others
2. **Pixels (string)**: `duration: '500px'` - Exactly 500px of scroll (requires `scrollableHeight`)
3. **Percentage (string)**: `duration: '30%'` - 30% of total scroll range
4. **Default**: `1` if not specified

**Features:**

- **Automatic distribution**: Calculates scroll ranges automatically
- **Smooth transitions**: Configurable overlap between animations
- **Normalized progress**: Each animation receives 0-1 progress
- **First animation**: Visible from start (no fade-in)
- **Last animation**: Stays visible at end (no fade-out)
- **Middle animations**: Smooth fade in/out with overlap

## Creating Scroll-Synced Animations

### Recommended Pattern: AnimationSequence

The modern approach uses `AnimationSequence` to manage multiple animations:

```tsx
// In your article page
<ArticleLayout
  leftContent={(scrollProgress) => (
    <AnimationSequence
      scrollProgress={scrollProgress}
      animations={[
        {
          render: (progress) => <ParticlesAnimation progress={progress} />,
          duration: 2,
          overlap: 0.2,
        },
        {
          render: (progress) => <NetworkAnimation progress={progress} />,
          duration: 1,
        },
      ]}
    />
  )}
>
  {/* Your article content */}
</ArticleLayout>
```

### Creating Individual Animations

Each animation component receives normalized progress (0-1):

```tsx
// components/myarticle/MyAnimation.tsx
export function MyAnimation({ progress }: { progress: number }) {
  const renderScene = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const centerX = width / 2;
    const centerY = height / 2;

    // Use progress (0-1) to control your animation
    drawMyScene(ctx, centerX, centerY, width, height, progress);
  };

  return <AnimationCanvas progress={progress}>{renderScene}</AnimationCanvas>;
}
```

### Internal Animation Offsets

Use `startOffset` prop to start animations partway through:

```tsx
export function ParticlesAnimation({
  progress,
  startOffset = 0,
}: {
  progress: number;
  startOffset?: number;
}) {
  const adjustedProgress = Math.min(1, progress + startOffset);

  return (
    <AnimationCanvas progress={adjustedProgress}>
      {(ctx, canvas) => drawParticles(ctx, canvas, adjustedProgress)}
    </AnimationCanvas>
  );
}

// Usage
<ParticlesAnimation progress={progress} startOffset={0.15} />;
```

### Animation Principles

1. **Single Responsibility**: Each animation component handles one visual concept
2. **Normalized Progress**: Always work with 0-1 progress internally
3. **Smooth Motion**: Avoid sudden jumps or jarring transitions
4. **Performance**: Keep drawing operations efficient (< 500 particles)
5. **Deterministic**: Use consistent random seeds for reproducible animations

### Example: Complete Animation Component

```tsx
'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface MyAnimationProps {
  progress: number;
  startOffset?: number;
  className?: string;
}

export function MyAnimation({
  progress,
  startOffset = 0,
  className = '',
}: MyAnimationProps) {
  const adjustedProgress = Math.min(1, progress + startOffset);

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const centerX = width / 2;
    const centerY = height / 2;

    // Your drawing logic using adjustedProgress
    const particleCount = Math.floor(200 * adjustedProgress);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / 200) * Math.PI * 2;
      const radius = 50 + adjustedProgress * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.fillStyle = `rgba(0, 0, 0, ${0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
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
```

## Complete Example: Multi-Animation Article

```tsx
// app/myarticle/page.tsx
'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import { IntroAnimation } from '@/components/myarticle/IntroAnimation';
import { DetailAnimation } from '@/components/myarticle/DetailAnimation';
import { ConclusionAnimation } from '@/components/myarticle/ConclusionAnimation';

export default function MyArticle() {
  return (
    <ArticleLayout
      leftContent={(scrollProgress) => (
        <AnimationSequence
          scrollProgress={scrollProgress}
          animations={[
            {
              render: (p) => <IntroAnimation progress={p} />,
              duration: 1.5, // Takes 1.5x space
              overlap: 0.15, // 15% overlap with next
            },
            {
              render: (p) => <DetailAnimation progress={p} />,
              duration: 2, // Takes 2x space (main focus)
              overlap: 0.2,
            },
            {
              render: (p) => <ConclusionAnimation progress={p} />,
              duration: 1, // Default space
              // No overlap - stays visible at end
            },
          ]}
        />
      )}
      className="bg-white"
    >
      <h1>My Article Title</h1>

      <ArticleSection>
        <p>Your content here...</p>
      </ArticleSection>
    </ArticleLayout>
  );
}
```

## Performance Tips

1. **Particle Limits**: Keep particle counts under 500 for smooth performance
2. **Canvas Size**: Reasonable dimensions (320-400px is usually plenty)
3. **Drawing Efficiency**: Minimize ctx state changes (strokeStyle, fillStyle, etc.)
4. **Deterministic Randomness**: Use seeded random for consistent appearance
5. **Test on Lower-End Devices**: Ensure smooth scrolling on slower hardware
6. **Avoid Memory Leaks**: AnimationCanvas handles cleanup automatically

## Easing Functions

```tsx
// Common easing functions for smooth animations
const ease = {
  linear: (t: number) => t,
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
};

// Usage
const smoothProgress = ease.easeInOut(sceneProgress);
```

## Animation Timing & Transitions

### First Animation

- Visible immediately (progress = 0)
- No fade-in at start
- Fades out when transitioning to next

### Middle Animations

- Fade in smoothly based on overlap setting
- Full opacity during their duration
- Fade out when transitioning to next

### Last Animation

- Fades in smoothly from previous
- Stays fully visible at end (progress = 1)
- No fade-out

### Overlap Behavior

```
Animation 1 (duration: 2, overlap: 0.2):
[████████████████████░░░░]  <- Fades out in last 20%

Animation 2 (duration: 1):
      [░░░░████████████████]  <- Fades in during first 20%
```

## Advanced: Pixel-Based Durations

For precise control over scroll distances:

```tsx
<AnimationSequence
  scrollProgress={scrollProgress}
  scrollableHeight={articleHeight - viewportHeight} // Pass scrollable range
  animations={[
    {
      render: (p) => <MyAnimation progress={p} />,
      duration: '800px', // Exactly 800px of scroll
    },
  ]}
/>
```

**Note**: Pixel-based durations require the `scrollableHeight` prop, which should be the article's height minus the viewport height.
