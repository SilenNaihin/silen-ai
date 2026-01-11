'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface VanishingGradientAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Vanishing/Exploding Gradient Animation
 *
 * Phase 1 (0-0.20): Show long sequence with many timesteps
 * Phase 2 (0.20-0.45): Gradients flow backward, getting exponentially smaller
 * Phase 3 (0.45-0.65): Show the math - product of Jacobians
 * Phase 4 (0.65-0.85): Exploding gradient demo
 * Phase 5 (0.85-1.0): Gradient clipping solution
 */
export function VanishingGradientAnimation({
  progress,
  className = '',
}: VanishingGradientAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const centerY = height * 0.5;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('The Vanishing Gradient Problem', width * 0.5, titleY);

    // Phase 1-2: Vanishing gradients
    if (progress < 0.65) {
      const numCells = 8;
      const spacing = (width - 80) / numCells;
      const baseX = 50;

      // Draw cells
      const cellAlpha = Math.min(1, progress / 0.15);
      drawCells(ctx, baseX, centerY, spacing, numCells, cellAlpha);

      // Phase 2: Vanishing gradients
      if (progress >= 0.20 && progress < 0.45) {
        const vanishProgress = (progress - 0.20) / 0.25;
        drawVanishingGradients(
          ctx,
          baseX,
          centerY,
          spacing,
          numCells,
          vanishProgress
        );
      }

      // Phase 3: Math explanation
      if (progress >= 0.45 && progress < 0.65) {
        const mathProgress = (progress - 0.45) / 0.2;
        drawMathExplanation(ctx, width, height, mathProgress);
      }
    }

    // Phase 4: Exploding gradients
    if (progress >= 0.65 && progress < 0.85) {
      const explodeProgress = (progress - 0.65) / 0.2;
      drawExplodingGradients(ctx, width, height, centerY, explodeProgress);
    }

    // Phase 5: Gradient clipping
    if (progress >= 0.85) {
      const clipProgress = (progress - 0.85) / 0.15;
      drawGradientClipping(ctx, width, height, centerY, clipProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  if (progress < 0.20) return 1;
  if (progress < 0.45) return 2;
  if (progress < 0.65) return 3;
  if (progress < 0.85) return 4;
  return 5;
}

function drawCells(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  alpha: number
) {
  const cellSize = 28;

  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;

    // Cell
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - cellSize / 2, centerY - cellSize / 2, cellSize, cellSize, 4);
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.03})`;
    ctx.fill();

    // Label
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.fillText(`h${t + 1}`, x, centerY);

    // Connection
    if (t < numCells - 1) {
      const nextX = baseX + (t + 1) * spacing;
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2 + 2, centerY);
      ctx.lineTo(nextX - cellSize / 2 - 2, centerY);
      ctx.stroke();
    }
  }
}

function drawVanishingGradients(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const barWidth = spacing * 0.6;
  const maxBarHeight = 60;
  const barY = centerY + 50;

  // Gradient magnitude bars (exponentially decreasing from right to left)
  for (let t = numCells - 1; t >= 0; t--) {
    const x = baseX + t * spacing;
    const stepsFromEnd = numCells - 1 - t;
    const gradientMagnitude = Math.pow(0.6, stepsFromEnd); // Decay factor

    // Animate appearance from right to left
    const appearProgress = progress * numCells - (numCells - 1 - t);
    const barAlpha = Math.min(1, Math.max(0, appearProgress));

    if (barAlpha > 0) {
      const barHeight = maxBarHeight * gradientMagnitude * barAlpha;

      // Bar
      ctx.fillStyle = `rgba(180, 60, 60, ${0.3 + gradientMagnitude * 0.5})`;
      ctx.beginPath();
      ctx.roundRect(
        x - barWidth / 2,
        barY - barHeight,
        barWidth,
        barHeight,
        3
      );
      ctx.fill();

      // Label
      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${barAlpha * 0.6})`;
      ctx.fillText(`${(gradientMagnitude * 100).toFixed(0)}%`, x, barY + 12);

      // Backward arrow above
      if (t < numCells - 1 && barAlpha > 0.5) {
        ctx.strokeStyle = `rgba(180, 60, 60, ${(barAlpha - 0.5) * 2 * 0.5})`;
        ctx.lineWidth = 1.5;
        const arrowY = centerY - 25;
        ctx.beginPath();
        ctx.moveTo(x + spacing / 2, arrowY);
        ctx.lineTo(x + 10, arrowY);
        ctx.stroke();

        ctx.fillStyle = `rgba(180, 60, 60, ${(barAlpha - 0.5) * 2 * 0.5})`;
        drawArrowhead(ctx, x + 10, arrowY, Math.PI, 4);
      }
    }
  }

  // "Vanishing" label
  if (progress > 0.5) {
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${(progress - 0.5) * 2 * 0.8})`;
    ctx.textAlign = 'left';
    ctx.fillText('Gradient vanishes!', baseX - 30, barY + 30);
  }
}

function drawMathExplanation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const mathY = height * 0.75;

  // Formula
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.8})`;
  ctx.textAlign = 'center';

  ctx.fillText(
    '∂L/∂h₁ = ∂L/∂hₜ × ∂hₜ/∂hₜ₋₁ × ... × ∂h₂/∂h₁',
    width * 0.5,
    mathY - 15
  );

  if (progress > 0.3) {
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${(progress - 0.3) / 0.7 * 0.8})`;
    ctx.fillText(
      'Each ∂hₜ/∂hₜ₋₁ is typically < 1, so the product shrinks exponentially',
      width * 0.5,
      mathY + 10
    );
  }

  if (progress > 0.6) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${(progress - 0.6) / 0.4 * 0.6})`;
    ctx.fillText(
      'After 100 steps: 0.9¹⁰⁰ ≈ 0.00003 (effectively zero!)',
      width * 0.5,
      mathY + 30
    );
  }
}

function drawExplodingGradients(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerY: number,
  progress: number
) {
  const numCells = 6;
  const spacing = (width - 100) / numCells;
  const baseX = 60;
  const barY = centerY + 50;
  const maxBarHeight = 100;

  // Title
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 100, 60, ${progress * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Exploding Gradients (when ∂h/∂h > 1)', width * 0.5, height * 0.18);

  // Draw cells
  drawCells(ctx, baseX, centerY, spacing, numCells, progress);

  // Growing gradient bars
  for (let t = numCells - 1; t >= 0; t--) {
    const x = baseX + t * spacing;
    const stepsFromEnd = numCells - 1 - t;
    const gradientMagnitude = Math.pow(1.5, stepsFromEnd); // Growth factor
    const clampedMag = Math.min(gradientMagnitude, 5); // Visual cap

    const appearProgress = progress * numCells - (numCells - 1 - t);
    const barAlpha = Math.min(1, Math.max(0, appearProgress));

    if (barAlpha > 0) {
      const barHeight = Math.min(maxBarHeight, maxBarHeight * (clampedMag / 5) * barAlpha);
      const barWidth = spacing * 0.5;

      // Bar (gets more intense as it grows)
      const intensity = Math.min(1, clampedMag / 3);
      ctx.fillStyle = `rgba(180, ${100 - intensity * 60}, 60, ${0.4 + intensity * 0.4})`;
      ctx.beginPath();
      ctx.roundRect(
        x - barWidth / 2,
        barY - barHeight,
        barWidth,
        barHeight,
        3
      );
      ctx.fill();

      // Label
      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${barAlpha * 0.6})`;
      const displayMag = gradientMagnitude > 10 ? 'NaN!' : `${(gradientMagnitude * 100).toFixed(0)}%`;
      ctx.fillText(displayMag, x, barY + 12);
    }
  }

  // Warning
  if (progress > 0.6) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${(progress - 0.6) / 0.4 * 0.8})`;
    ctx.textAlign = 'center';
    ctx.fillText('Gradients explode → NaN → training crashes!', width * 0.5, barY + 35);
  }
}

function drawGradientClipping(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerY: number,
  progress: number
) {
  const barY = centerY + 40;
  const clipThreshold = height * 0.12;

  // Title
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${progress * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Solution: Gradient Clipping', width * 0.5, height * 0.18);

  // Before/After comparison
  const leftX = width * 0.25;
  const rightX = width * 0.75;

  // Before (exploding)
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('Before', leftX, centerY - 60);

  const beforeHeights = [30, 50, 80, 140];
  const barWidth = 25;
  for (let i = 0; i < beforeHeights.length; i++) {
    const x = leftX - 60 + i * 40;
    const h = beforeHeights[i] * progress;

    ctx.fillStyle = `rgba(180, 60, 60, 0.6)`;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY - h, barWidth, h, 3);
    ctx.fill();
  }

  // Clip line
  ctx.strokeStyle = `rgba(60, 140, 80, ${progress * 0.8})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(leftX - 80, barY - clipThreshold);
  ctx.lineTo(rightX + 80, barY - clipThreshold);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${progress * 0.7})`;
  ctx.textAlign = 'right';
  ctx.fillText('max_norm', leftX - 85, barY - clipThreshold + 3);

  // After (clipped)
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('After', rightX, centerY - 60);

  const afterHeights = beforeHeights.map((h) => Math.min(h, clipThreshold / progress));
  for (let i = 0; i < afterHeights.length; i++) {
    const x = rightX - 60 + i * 40;
    const h = Math.min(afterHeights[i] * progress, clipThreshold);

    ctx.fillStyle = `rgba(60, 140, 80, 0.6)`;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY - h, barWidth, h, 3);
    ctx.fill();
  }

  // Formula
  if (progress > 0.5) {
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${(progress - 0.5) * 2 * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'if ||g|| > max_norm: g = g × (max_norm / ||g||)',
      width * 0.5,
      barY + 40
    );
  }
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number = 5
) {
  ctx.beginPath();
  ctx.moveTo(
    x + size * Math.cos(angle),
    y + size * Math.sin(angle)
  );
  ctx.lineTo(
    x + size * Math.cos(angle + (2.5 * Math.PI) / 3),
    y + size * Math.sin(angle + (2.5 * Math.PI) / 3)
  );
  ctx.lineTo(
    x + size * Math.cos(angle - (2.5 * Math.PI) / 3),
    y + size * Math.sin(angle - (2.5 * Math.PI) / 3)
  );
  ctx.closePath();
  ctx.fill();
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  let labelText = '';

  switch (phase) {
    case 1:
      labelText = 'Long sequence: many timesteps';
      break;
    case 2:
      labelText = 'Gradients shrink exponentially';
      break;
    case 3:
      labelText = 'Product of many small numbers → 0';
      break;
    case 4:
      labelText = 'Or gradients explode → NaN';
      break;
    case 5:
      labelText = 'Gradient clipping prevents explosion';
      break;
  }

  // Background pill
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 22;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(
    x - textWidth / 2 - pillPadding,
    y - pillHeight / 2,
    textWidth + pillPadding * 2,
    pillHeight,
    11
  );
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const color =
    phase <= 3
      ? 'rgba(180, 60, 60, 0.9)'
      : phase === 4
        ? 'rgba(180, 100, 60, 0.9)'
        : 'rgba(60, 140, 80, 0.9)';
  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}
