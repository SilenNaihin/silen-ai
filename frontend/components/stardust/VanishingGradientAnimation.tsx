'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface VanishingGradientAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Vanishing Gradient Animation
 *
 * Phase 1 (0-0.33): Setup - show a chain of timesteps
 * Phase 2 (0.33-0.66): Show gradient signal starting strong at the end
 * Phase 3 (0.66-1.0): Show exponential decay as gradient flows backward - KEY visual
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

    const centerY = height * 0.40;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('The Vanishing Gradient Problem', width * 0.5, titleY);

    // Vanishing gradients visualization - 3 phases covering full range
    const numCells = 10;
    const spacing = (width - 60) / numCells;
    const baseX = 40;

    // Phase 1: Build up the chain
    if (progress < 0.33) {
      const setupProgress = progress / 0.33;
      drawTimestepChain(ctx, baseX, centerY, spacing, numCells, setupProgress);
    }

    // Phase 2: Show gradient starting strong at the end
    if (progress >= 0.33 && progress < 0.66) {
      // Keep chain visible
      drawTimestepChain(ctx, baseX, centerY, spacing, numCells, 1);

      const gradientStartProgress = (progress - 0.33) / 0.33;
      drawGradientStart(ctx, baseX, centerY, spacing, numCells, gradientStartProgress, width);
    }

    // Phase 3: The KEY visual - exponential decay
    if (progress >= 0.66) {
      // Keep chain visible
      drawTimestepChain(ctx, baseX, centerY, spacing, numCells, 1);

      const decayProgress = (progress - 0.66) / 0.34;
      drawExponentialDecay(ctx, baseX, centerY, spacing, numCells, decayProgress, width, height);
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
  if (progress < 0.33) return 1;
  if (progress < 0.66) return 2;
  return 3;
}

function drawTimestepChain(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const cellSize = 28;

  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;
    const tDelay = t * 0.08;
    const tAlpha = Math.min(1, Math.max(0, (progress - tDelay) / 0.15));

    if (tAlpha <= 0) continue;

    // Cell box
    ctx.strokeStyle = `rgba(0, 0, 0, ${tAlpha * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - cellSize / 2, centerY - cellSize / 2, cellSize, cellSize, 4);
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.03})`;
    ctx.fill();

    // Label
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.6})`;
    ctx.fillText(`t${t + 1}`, x, centerY);

    // Connection to next cell
    if (t < numCells - 1 && tAlpha > 0.5) {
      const nextX = baseX + (t + 1) * spacing;
      const connAlpha = (tAlpha - 0.5) * 2;

      ctx.strokeStyle = `rgba(0, 0, 0, ${connAlpha * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2 + 2, centerY);
      ctx.lineTo(nextX - cellSize / 2 - 6, centerY);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = `rgba(0, 0, 0, ${connAlpha * 0.3})`;
      drawArrowhead(ctx, nextX - cellSize / 2 - 6, centerY, 0, 4);
    }
  }

  // Show "100 timesteps" indication
  if (progress > 0.8) {
    const labelAlpha = (progress - 0.8) / 0.2;
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.5})`;
    ctx.textAlign = 'center';
    ctx.fillText('... imagine 100 of these ...', baseX + (numCells * spacing) / 2, centerY + 35);
  }
}

function drawGradientStart(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number,
  width: number
) {
  const lastCellX = baseX + (numCells - 1) * spacing;
  const barMaxHeight = 80;
  const barY = centerY + 55;

  // Show "Loss" label at the end
  const lossAlpha = Math.min(1, progress * 3);
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 60, 60, ${lossAlpha * 0.9})`;
  ctx.textAlign = 'center';
  ctx.fillText('Loss', lastCellX, centerY - 25);

  // Draw gradient magnitude bar at the last cell (starts at 100%)
  if (progress > 0.2) {
    const barAlpha = Math.min(1, (progress - 0.2) / 0.3);
    const barHeight = barMaxHeight * barAlpha;
    const barWidth = 20;

    // Gradient bar
    ctx.fillStyle = `rgba(180, 60, 60, ${barAlpha * 0.7})`;
    ctx.beginPath();
    ctx.roundRect(lastCellX - barWidth / 2, barY - barHeight, barWidth, barHeight, 3);
    ctx.fill();

    // Label
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${barAlpha * 0.9})`;
    ctx.fillText('100%', lastCellX, barY + 15);

    // "Gradient signal" label
    if (progress > 0.5) {
      const labelAlpha = (progress - 0.5) / 0.5;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(180, 60, 60, ${labelAlpha * 0.8})`;
      ctx.textAlign = 'center';
      ctx.fillText('Gradient signal: strong!', width * 0.5, barY + 40);
    }
  }

  // Backward arrow indicating direction
  if (progress > 0.6) {
    const arrowAlpha = (progress - 0.6) / 0.4;
    ctx.strokeStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(lastCellX - 25, centerY - 40);
    ctx.lineTo(baseX + 25, centerY - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    drawArrowhead(ctx, baseX + 25, centerY - 40, Math.PI, 6);

    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    ctx.fillText('Backpropagation', width * 0.5, centerY - 50);
  }
}

function drawExponentialDecay(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number,
  width: number,
  height: number
) {
  const barMaxHeight = 80;
  const barY = centerY + 55;
  const barWidth = 18;

  // The decay factor (0.9 is typical for many RNNs)
  const decayFactor = 0.9;

  // How many cells to show gradient for (animated)
  const cellsWithGradient = Math.floor(progress * numCells) + 1;

  // Draw gradient bars flowing backward from the end
  for (let i = 0; i < Math.min(cellsWithGradient, numCells); i++) {
    const cellIndex = numCells - 1 - i; // Start from the end
    const x = baseX + cellIndex * spacing;

    // Calculate gradient magnitude: decayFactor^stepsFromEnd
    const stepsFromEnd = i;
    const gradientMagnitude = Math.pow(decayFactor, stepsFromEnd);
    const barHeight = barMaxHeight * gradientMagnitude;

    // Animate bar appearance
    const barProgress = Math.min(1, (progress * numCells - i) / 1);
    if (barProgress <= 0) continue;

    // Color intensity based on magnitude
    const intensity = gradientMagnitude;
    ctx.fillStyle = `rgba(180, 60, 60, ${0.3 + intensity * 0.5})`;
    ctx.beginPath();
    ctx.roundRect(
      x - barWidth / 2,
      barY - barHeight * barProgress,
      barWidth,
      barHeight * barProgress,
      3
    );
    ctx.fill();

    // Percentage label
    const percentage = gradientMagnitude * 100;
    ctx.font = '8px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${barProgress * 0.7})`;
    if (percentage >= 1) {
      ctx.fillText(`${percentage.toFixed(0)}%`, x, barY + 12);
    } else if (percentage >= 0.01) {
      ctx.fillText(`${percentage.toFixed(1)}%`, x, barY + 12);
    } else {
      ctx.fillText('~0%', x, barY + 12);
    }
  }

  // THE KEY INSIGHT: Show the math
  const mathY = height * 0.78;

  if (progress > 0.3) {
    const mathAlpha = Math.min(1, (progress - 0.3) / 0.2);

    // Show the multiplication
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${mathAlpha * 0.8})`;
    ctx.textAlign = 'center';

    // How many steps shown
    const stepsShown = Math.min(cellsWithGradient - 1, numCells - 1);

    if (stepsShown >= 2) {
      // Build the multiplication string dynamically
      const factors = [];
      for (let i = 0; i < Math.min(stepsShown, 5); i++) {
        factors.push('0.9');
      }
      if (stepsShown > 5) {
        factors.push('...');
      }

      const result = Math.pow(0.9, stepsShown);
      const resultStr = result >= 0.01 ? result.toFixed(2) : result.toExponential(1);

      ctx.fillText(`${factors.join(' x ')} = ${resultStr}`, width * 0.5, mathY);
    }
  }

  // The punch line - show what 100 steps looks like
  if (progress > 0.7) {
    const punchAlpha = Math.min(1, (progress - 0.7) / 0.2);

    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${punchAlpha * 0.95})`;
    ctx.textAlign = 'center';
    ctx.fillText('0.9^100 = 0.000027 (basically zero!)', width * 0.5, mathY + 25);

    // Add emphasis
    if (progress > 0.85) {
      const emphasisAlpha = (progress - 0.85) / 0.15;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(180, 60, 60, ${emphasisAlpha * 0.8})`;
      ctx.fillText('Gradient vanishes completely - early layers never learn!', width * 0.5, mathY + 45);
    }
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
      labelText = 'RNN: A chain of timesteps';
      break;
    case 2:
      labelText = 'Gradient starts strong at the loss';
      break;
    case 3:
      labelText = '0.9 x 0.9 x 0.9 ... approaches zero';
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
  ctx.fillStyle = 'rgba(180, 60, 60, 0.9)';
  ctx.fillText(labelText, x, y);
}
