'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface BPTTAnimationProps {
  progress: number;
  className?: string;
}

/**
 * BPTT (Backpropagation Through Time) Animation
 *
 * Phase 1 (0-0.25): Forward pass through unrolled network (left to right)
 * Phase 2 (0.25-0.45): Loss computed at final timestep, then backward pass begins
 * Phase 3 (0.45-0.75): Full backward pass - gradients flow right to left, accumulating
 * Phase 4 (0.75-1.0): Show gradient accumulation visualization
 */
export function BPTTAnimation({
  progress,
  className = '',
}: BPTTAnimationProps) {
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
    const numCells = 5;
    const cellWidth = Math.min(70, (width - 120) / numCells);
    const spacing = cellWidth + 15;
    const baseX = (width - (numCells - 1) * spacing) / 2;

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Backpropagation Through Time', width * 0.5, titleY);

    // Always draw the network structure (fades in during phase 1)
    const structureAlpha = Math.min(1, progress / 0.1);
    drawNetworkStructure(ctx, baseX, centerY, spacing, numCells, structureAlpha);

    // Phase 1: Forward pass animation
    if (progress < 0.25) {
      const forwardProgress = progress / 0.25;
      drawForwardPass(ctx, baseX, centerY, spacing, numCells, forwardProgress);
    }

    // Phase 2: Loss appears and backward pass starts
    if (progress >= 0.25 && progress < 0.45) {
      const lossProgress = (progress - 0.25) / 0.20;
      drawLossAppearing(ctx, baseX, centerY, spacing, numCells, lossProgress);
    }

    // Phase 3: Full backward pass with gradient accumulation
    if (progress >= 0.45 && progress < 0.75) {
      const backwardProgress = (progress - 0.45) / 0.30;
      drawBackwardPass(ctx, baseX, centerY, spacing, numCells, backwardProgress);
    }

    // Phase 4: Gradient accumulation summary
    if (progress >= 0.75) {
      const summaryProgress = (progress - 0.75) / 0.25;
      drawGradientAccumulation(ctx, baseX, centerY, spacing, numCells, summaryProgress);
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
  if (progress < 0.25) return 1;
  if (progress < 0.45) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

function drawNetworkStructure(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  alpha: number
) {
  const cellSize = 38;

  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;

    // Cell box
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - cellSize / 2, centerY - cellSize / 2, cellSize, cellSize, 6);
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.03})`;
    ctx.fill();

    // Cell label
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
    ctx.fillText(`h${t + 1}`, x, centerY);

    // Timestep label below
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
    ctx.fillText(`t=${t + 1}`, x, centerY + cellSize / 2 + 14);

    // Input arrow from below
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.35})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, centerY + cellSize / 2 + 30);
    ctx.lineTo(x, centerY + cellSize / 2 + 5);
    ctx.stroke();
    drawArrowhead(ctx, x, centerY + cellSize / 2 + 5, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.35})`);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
    ctx.fillText(`x${t + 1}`, x, centerY + cellSize / 2 + 42);

    // Connection to next cell (horizontal arrow)
    if (t < numCells - 1) {
      const nextX = baseX + (t + 1) * spacing;
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2 + 3, centerY);
      ctx.lineTo(nextX - cellSize / 2 - 8, centerY);
      ctx.stroke();

      drawArrowhead(ctx, nextX - cellSize / 2 - 8, centerY, 0, `rgba(0, 0, 0, ${alpha * 0.4})`);
    }
  }
}

function drawForwardPass(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const cellSize = 38;

  // Calculate which cell the pulse is at
  const pulsePosition = progress * numCells;
  const currentCell = Math.floor(pulsePosition);
  const withinCell = pulsePosition - currentCell;

  // Draw activated cells (trail)
  for (let t = 0; t < Math.min(currentCell + 1, numCells); t++) {
    const x = baseX + t * spacing;
    const isCurrentCell = t === currentCell;
    const activationStrength = isCurrentCell ? withinCell : 1;

    // Glow effect on activated cells
    const glowRadius = 30 + (isCurrentCell ? Math.sin(withinCell * Math.PI) * 8 : 0);
    const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, glowRadius);
    gradient.addColorStop(0, `rgba(60, 140, 80, ${activationStrength * 0.4})`);
    gradient.addColorStop(0.6, `rgba(60, 140, 80, ${activationStrength * 0.15})`);
    gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, centerY, glowRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Animated pulse traveling between cells
  if (currentCell < numCells - 1 && withinCell > 0.3) {
    const fromX = baseX + currentCell * spacing + cellSize / 2 + 5;
    const toX = baseX + (currentCell + 1) * spacing - cellSize / 2 - 10;
    const pulseX = fromX + (toX - fromX) * ((withinCell - 0.3) / 0.7);

    ctx.fillStyle = 'rgba(60, 140, 80, 0.9)';
    ctx.beginPath();
    ctx.arc(pulseX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Forward pass label
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.textAlign = 'left';
  ctx.fillText('Forward pass', baseX - cellSize / 2, centerY - 55);

  // Arrow indicating direction
  const arrowStartX = baseX - cellSize / 2 + 80;
  ctx.strokeStyle = 'rgba(60, 140, 80, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(arrowStartX, centerY - 55);
  ctx.lineTo(arrowStartX + 25, centerY - 55);
  ctx.stroke();
  drawArrowhead(ctx, arrowStartX + 25, centerY - 55, 0, 'rgba(60, 140, 80, 0.6)');
}

function drawLossAppearing(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const cellSize = 38;
  const lossY = centerY - 65;

  // Show all cells as activated
  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;
    const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, 28);
    gradient.addColorStop(0, 'rgba(60, 140, 80, 0.3)');
    gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, centerY, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  // Loss node appears at final timestep
  const lastX = baseX + (numCells - 1) * spacing;
  const lossAlpha = Math.min(1, progress * 2);

  // Connection from h to L
  ctx.strokeStyle = `rgba(180, 60, 60, ${lossAlpha * 0.5})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lastX, centerY - cellSize / 2 - 3);
  ctx.lineTo(lastX, lossY + 14);
  ctx.stroke();

  // Loss node
  ctx.strokeStyle = `rgba(180, 60, 60, ${lossAlpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(lastX, lossY, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(180, 60, 60, ${lossAlpha * 0.1})`;
  ctx.fill();

  // L label
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(180, 60, 60, ${lossAlpha * 0.9})`;
  ctx.fillText('L', lastX, lossY);

  // "Compute loss" label
  if (progress < 0.5) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${lossAlpha * 0.7})`;
    ctx.fillText('Loss', lastX, lossY - 22);
  }

  // Start showing gradient arrow hint
  if (progress > 0.5) {
    const gradientAlpha = (progress - 0.5) * 2;

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${gradientAlpha * 0.8})`;
    ctx.textAlign = 'right';
    ctx.fillText('Backward pass begins', lastX + cellSize / 2, centerY - 55);

    // Arrow indicating backward direction
    const arrowEndX = lastX + cellSize / 2 - 120;
    ctx.strokeStyle = `rgba(180, 60, 60, ${gradientAlpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lastX + cellSize / 2 - 95, centerY - 55);
    ctx.lineTo(arrowEndX, centerY - 55);
    ctx.stroke();
    drawArrowhead(ctx, arrowEndX, centerY - 55, Math.PI, `rgba(180, 60, 60, ${gradientAlpha * 0.6})`);
  }
}

function drawBackwardPass(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const cellSize = 38;
  const lossY = centerY - 65;
  const gradientY = centerY + 70;

  // Keep showing the loss node
  const lastX = baseX + (numCells - 1) * spacing;
  ctx.strokeStyle = 'rgba(180, 60, 60, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(lastX, lossY, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(180, 60, 60, 0.1)';
  ctx.fill();
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(180, 60, 60, 0.9)';
  ctx.fillText('L', lastX, lossY);

  // Connection from L to h_T
  ctx.strokeStyle = 'rgba(180, 60, 60, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lastX, centerY - cellSize / 2 - 3);
  ctx.lineTo(lastX, lossY + 14);
  ctx.stroke();

  // Calculate how far the gradient has propagated (right to left)
  const gradientReach = Math.floor(progress * numCells);
  const withinStep = (progress * numCells) - gradientReach;

  // Gradient magnitude bars accumulating at each timestep
  const maxBarHeight = 45;
  const barWidth = spacing * 0.4;

  // Draw gradient flow and accumulation
  for (let t = numCells - 1; t >= 0; t--) {
    const x = baseX + t * spacing;
    const stepsFromEnd = numCells - 1 - t;

    // Has the gradient reached this cell?
    const hasReached = stepsFromEnd <= gradientReach;
    const isCurrentlyReaching = stepsFromEnd === gradientReach;

    if (hasReached) {
      // Calculate gradient magnitude (sum of contributions from all later timesteps)
      // Each step adds a contribution that decays as it propagates
      let totalGradient = 0;
      for (let source = numCells - 1; source >= t; source--) {
        const distance = source - t;
        // Each source contributes 1, decayed by 0.85^distance
        totalGradient += Math.pow(0.85, distance);
      }
      // Normalize to max expected value
      const normalizedGradient = totalGradient / numCells;
      const gradientIntensity = Math.min(1, normalizedGradient * 1.5);

      // Glow effect showing gradient at this cell
      const glowAlpha = isCurrentlyReaching ? withinStep : 1;
      const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, 30);
      gradient.addColorStop(0, `rgba(180, 60, 60, ${glowAlpha * gradientIntensity * 0.4})`);
      gradient.addColorStop(0.6, `rgba(180, 60, 60, ${glowAlpha * gradientIntensity * 0.15})`);
      gradient.addColorStop(1, 'rgba(180, 60, 60, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Gradient magnitude bar below
      const barHeight = maxBarHeight * gradientIntensity * glowAlpha;
      const barAlpha = 0.3 + gradientIntensity * 0.5;

      ctx.fillStyle = `rgba(180, 60, 60, ${barAlpha * glowAlpha})`;
      ctx.beginPath();
      ctx.roundRect(
        x - barWidth / 2,
        gradientY,
        barWidth,
        barHeight,
        3
      );
      ctx.fill();

      // Gradient label
      if (glowAlpha > 0.5) {
        ctx.font = '9px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(0, 0, 0, ${(glowAlpha - 0.5) * 2 * 0.6})`;
        ctx.fillText(`${(gradientIntensity * 100).toFixed(0)}%`, x, gradientY + barHeight + 12);
      }

      // Backward arrow above the cell (showing gradient flowing from right)
      if (t < numCells - 1 && glowAlpha > 0.3) {
        const nextX = baseX + (t + 1) * spacing;
        const arrowY = centerY - 8;

        ctx.strokeStyle = `rgba(180, 60, 60, ${glowAlpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nextX - cellSize / 2 - 5, arrowY);
        ctx.lineTo(x + cellSize / 2 + 10, arrowY);
        ctx.stroke();
        drawArrowhead(ctx, x + cellSize / 2 + 10, arrowY, Math.PI, `rgba(180, 60, 60, ${glowAlpha * 0.5})`);
      }
    }
  }

  // Traveling pulse for current gradient propagation
  if (gradientReach < numCells - 1) {
    const fromCell = numCells - 1 - gradientReach;
    const toCell = fromCell - 1;

    if (toCell >= 0 && withinStep > 0.2) {
      const fromX = baseX + fromCell * spacing - cellSize / 2 - 5;
      const toX = baseX + toCell * spacing + cellSize / 2 + 10;
      const pulseX = fromX + (toX - fromX) * ((withinStep - 0.2) / 0.8);

      ctx.fillStyle = 'rgba(180, 60, 60, 0.9)';
      ctx.beginPath();
      ctx.arc(pulseX, centerY - 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Label explaining gradient accumulation
  if (progress > 0.3) {
    const labelAlpha = Math.min(1, (progress - 0.3) / 0.2);
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${labelAlpha * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText('Gradients accumulate at each timestep', baseX + spacing * 2, gradientY + maxBarHeight + 28);
  }
}

function drawGradientAccumulation(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const cellSize = 38;
  const gradientY = centerY + 70;
  const maxBarHeight = 45;
  const barWidth = spacing * 0.4;

  // Draw all cells with final gradient accumulation
  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;

    // Calculate accumulated gradient at this timestep
    let totalGradient = 0;
    for (let source = numCells - 1; source >= t; source--) {
      const distance = source - t;
      totalGradient += Math.pow(0.85, distance);
    }
    const normalizedGradient = totalGradient / numCells;
    const gradientIntensity = Math.min(1, normalizedGradient * 1.5);

    // Stable glow showing final gradient
    const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, 28);
    gradient.addColorStop(0, `rgba(180, 60, 60, ${gradientIntensity * 0.35})`);
    gradient.addColorStop(1, 'rgba(180, 60, 60, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, centerY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Final gradient bar
    const barHeight = maxBarHeight * gradientIntensity;
    const barAlpha = 0.3 + gradientIntensity * 0.5;

    ctx.fillStyle = `rgba(180, 60, 60, ${barAlpha})`;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, gradientY, barWidth, barHeight, 3);
    ctx.fill();

    // Gradient percentage
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(`${(gradientIntensity * 100).toFixed(0)}%`, x, gradientY + barHeight + 12);

    // Show contribution arrows from later timesteps
    if (progress > 0.3 && t < numCells - 1) {
      const arrowAlpha = Math.min(1, (progress - 0.3) / 0.3) * 0.3;

      for (let source = t + 1; source < numCells; source++) {
        const sourceX = baseX + source * spacing;
        const decay = Math.pow(0.85, source - t);

        // Curved arrow showing contribution
        ctx.strokeStyle = `rgba(180, 60, 60, ${arrowAlpha * decay})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(sourceX, centerY - cellSize / 2 - 20);
        ctx.quadraticCurveTo(
          (sourceX + x) / 2,
          centerY - cellSize / 2 - 35 - (source - t) * 8,
          x,
          centerY - cellSize / 2 - 20
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  // Key insight text
  if (progress > 0.5) {
    const textAlpha = Math.min(1, (progress - 0.5) / 0.3);

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${textAlpha * 0.8})`;
    ctx.textAlign = 'center';
    ctx.fillText(
      'Earlier timesteps receive more gradient contributions',
      baseX + spacing * 2,
      centerY - 75
    );

    // Draw equation
    if (progress > 0.7) {
      const eqAlpha = Math.min(1, (progress - 0.7) / 0.2);
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${eqAlpha * 0.6})`;
      ctx.fillText(
        'dL/dh_t = Sum of gradients from t to T (each decayed by chain rule)',
        baseX + spacing * 2,
        centerY - 58
      );
    }
  }
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string
) {
  const arrowSize = 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(
    x + arrowSize * Math.cos(angle),
    y + arrowSize * Math.sin(angle)
  );
  ctx.lineTo(
    x + arrowSize * Math.cos(angle + (2.5 * Math.PI) / 3),
    y + arrowSize * Math.sin(angle + (2.5 * Math.PI) / 3)
  );
  ctx.lineTo(
    x + arrowSize * Math.cos(angle - (2.5 * Math.PI) / 3),
    y + arrowSize * Math.sin(angle - (2.5 * Math.PI) / 3)
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
      labelText = 'Forward pass: compute hidden states';
      break;
    case 2:
      labelText = 'Compute loss at final timestep';
      break;
    case 3:
      labelText = 'Backward pass: gradients flow right to left';
      break;
    case 4:
      labelText = 'Each timestep accumulates gradients from all later steps';
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
    phase === 1
      ? 'rgba(60, 140, 80, 0.9)'
      : phase >= 2
        ? 'rgba(180, 60, 60, 0.9)'
        : 'rgba(0, 0, 0, 0.7)';
  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}
