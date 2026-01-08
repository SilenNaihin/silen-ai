'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface SinusoidalPEAnimationProps {
  progress: number;
  startOffset?: number;
}

/**
 * Scroll-synced animation visualizing sinusoidal positional encoding.
 *
 * Phase 1 (0-25%): Floating tokens showing permutation problem
 * Phase 2 (25-50%): Single sine wave with collision highlighting
 * Phase 3 (50-75%): Multiple frequency waves
 * Phase 4 (75-100%): Circle tracer with sin/cos
 */
export function SinusoidalPEAnimation({
  progress,
  startOffset = 0,
}: SinusoidalPEAnimationProps) {
  const adjustedProgress = Math.min(1, progress + startOffset);

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Determine which phase we're in
    const phase = Math.floor(adjustedProgress * 4);
    const phaseProgress = (adjustedProgress * 4) % 1;

    if (phase === 0 || (phase === 1 && phaseProgress < 0.1)) {
      // Phase 1: Floating tokens
      drawFloatingTokens(ctx, centerX, centerY, phaseProgress);
    } else if (phase === 1 || (phase === 2 && phaseProgress < 0.1)) {
      // Phase 2: Single sine wave
      drawSingleSine(ctx, width, height, phaseProgress);
    } else if (phase === 2 || (phase === 3 && phaseProgress < 0.1)) {
      // Phase 3: Multiple frequencies
      drawMultipleFrequencies(ctx, width, height, phaseProgress);
    } else {
      // Phase 4: Circle tracer
      drawCircleTracer(ctx, centerX, centerY, width, height, phaseProgress);
    }
  };

  return (
    <AnimationCanvas
      progress={adjustedProgress}
      className="w-full h-full bg-white rounded-lg"
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Phase 1: Show floating tokens that can be reordered
 */
function drawFloatingTokens(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number
) {
  const tokens = ['The', 'cat', 'sat', 'on', 'mat'];
  const radius = 80;

  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  tokens.forEach((token, i) => {
    // Animate tokens floating and rearranging
    const baseAngle = (i / tokens.length) * Math.PI * 2;
    const wobble = Math.sin(progress * Math.PI * 2 + i) * 0.2;
    const angle = baseAngle + wobble;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    // Draw token
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(token, x, y);
  });

  // Draw center text
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.fillText('No order info!', centerX, centerY);
}

/**
 * Phase 2: Single sine wave with period collisions
 */
function drawSingleSine(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const marginX = 40;
  const marginY = 60;
  const graphWidth = width - marginX * 2;
  const graphHeight = height - marginY * 2;
  const centerY = height / 2;

  // Draw axis
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(marginX, centerY);
  ctx.lineTo(width - marginX, centerY);
  ctx.stroke();

  // Draw sine wave
  ctx.strokeStyle = '#8b5cf6'; // Purple
  ctx.lineWidth = 2;
  ctx.beginPath();

  const numPoints = Math.floor(progress * 100) + 10;
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / 100) * Math.PI * 4; // Two full periods
    const x = marginX + (i / 100) * graphWidth;
    const y = centerY - Math.sin(t) * (graphHeight / 3);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Highlight collision points
  if (progress > 0.5) {
    const collisionOpacity = Math.min(1, (progress - 0.5) * 2);
    ctx.fillStyle = `rgba(239, 68, 68, ${collisionOpacity})`; // Red

    // Draw collision dots at sin(0) = sin(2π)
    const positions = [0, 0.5, 1];
    positions.forEach((pos) => {
      const x = marginX + pos * graphWidth;
      ctx.beginPath();
      ctx.arc(x, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Label
    ctx.fillStyle = `rgba(239, 68, 68, ${collisionOpacity})`;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Same encoding!', width / 2, height - 20);
  }

  // Title
  ctx.fillStyle = '#374151';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('sin(position)', width / 2, 30);
}

/**
 * Phase 3: Multiple frequency sine waves
 */
function drawMultipleFrequencies(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const marginX = 40;
  const graphWidth = width - marginX * 2;
  const numFreqs = 4;
  const rowHeight = height / (numFreqs + 1);

  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']; // Purple, Blue, Green, Orange

  for (let f = 0; f < numFreqs; f++) {
    const freq = Math.pow(2, f); // 1, 2, 4, 8
    const y = rowHeight * (f + 1);
    const amplitude = rowHeight * 0.3;

    // Animate appearance
    const freqProgress = Math.max(0, Math.min(1, progress * numFreqs - f));
    if (freqProgress <= 0) continue;

    ctx.globalAlpha = freqProgress;

    // Draw sine wave
    ctx.strokeStyle = colors[f];
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 4 * freq;
      const x = marginX + (i / 100) * graphWidth;
      const yPos = y - Math.sin(t) * amplitude;

      if (i === 0) {
        ctx.moveTo(x, yPos);
      } else {
        ctx.lineTo(x, yPos);
      }
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = colors[f];
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ω = ${freq}`, 10, y - amplitude - 5);

    ctx.globalAlpha = 1;
  }

  // Title
  ctx.fillStyle = '#374151';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Multiple Frequencies', width / 2, 20);
}

/**
 * Phase 4: Circle tracer showing sin/cos relationship
 */
function drawCircleTracer(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number
) {
  const radius = Math.min(width, height) * 0.25;

  // Draw unit circle
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(centerX - radius - 20, centerY);
  ctx.lineTo(centerX + radius + 20, centerY);
  ctx.moveTo(centerX, centerY - radius - 20);
  ctx.lineTo(centerX, centerY + radius + 20);
  ctx.stroke();

  // Animate point around circle
  const angle = progress * Math.PI * 4; // Two rotations
  const pointX = centerX + Math.cos(angle) * radius;
  const pointY = centerY - Math.sin(angle) * radius; // Flip for screen coords

  // Draw trailing path
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * angle;
    const x = centerX + Math.cos(t) * radius;
    const y = centerY - Math.sin(t) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw current point
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw projections
  ctx.strokeStyle = '#ef4444'; // Red for sin
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pointX, pointY);
  ctx.lineTo(centerX, pointY);
  ctx.stroke();

  ctx.strokeStyle = '#3b82f6'; // Blue for cos
  ctx.beginPath();
  ctx.moveTo(pointX, pointY);
  ctx.lineTo(pointX, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'right';
  ctx.fillText(`sin: ${Math.sin(angle).toFixed(2)}`, centerX - radius - 30, pointY);

  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText(`cos: ${Math.cos(angle).toFixed(2)}`, pointX, centerY + radius + 30);

  // Position label
  ctx.fillStyle = '#374151';
  ctx.textAlign = 'center';
  ctx.fillText(`Position: ${Math.floor(angle / (Math.PI / 8))}`, centerX, 30);
}
