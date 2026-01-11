'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface BPTTAnimationProps {
  progress: number;
  className?: string;
}

/**
 * BPTT (Backpropagation Through Time) Animation
 *
 * Phase 1 (0-0.18): Forward pass through unrolled network
 * Phase 2 (0.18-0.35): Loss computed at each timestep
 * Phase 3 (0.35-0.55): Full BPTT - gradients flow backward
 * Phase 4 (0.55-0.75): TBPTT - truncated gradient flow
 * Phase 5 (0.75-1.0): Compare full vs truncated
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

    const centerY = height * 0.55;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);
    const numCells = 5;
    const spacing = (width - 100) / numCells;
    const baseX = 60;

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Backpropagation Through Time', width * 0.5, titleY);

    // Phase 1: Forward pass
    const forwardAlpha = Math.min(1, progress / 0.15);
    drawUnrolledCells(ctx, baseX, centerY, spacing, numCells, forwardAlpha, false);

    // Forward pass animation
    if (progress < 0.18) {
      const forwardProgress = progress / 0.18;
      drawForwardPass(ctx, baseX, centerY, spacing, numCells, forwardProgress);
    }

    // Phase 2: Loss at each timestep
    if (progress >= 0.18) {
      const lossAlpha = Math.min(1, (progress - 0.18) / 0.12);
      drawLossNodes(ctx, baseX, centerY - 70, spacing, numCells, lossAlpha);
    }

    // Phase 3: Full BPTT gradients
    if (progress >= 0.35 && progress < 0.55) {
      const bpttProgress = (progress - 0.35) / 0.2;
      drawFullBPTT(ctx, baseX, centerY, spacing, numCells, bpttProgress);
    }

    // Phase 4: Truncated BPTT
    if (progress >= 0.55 && progress < 0.75) {
      const tbpttProgress = (progress - 0.55) / 0.2;
      drawTruncatedBPTT(ctx, baseX, centerY, spacing, numCells, tbpttProgress);
    }

    // Phase 5: Comparison
    if (progress >= 0.75) {
      const compareProgress = (progress - 0.75) / 0.25;
      drawComparison(ctx, width, height, compareProgress);
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
  if (progress < 0.18) return 1;
  if (progress < 0.35) return 2;
  if (progress < 0.55) return 3;
  if (progress < 0.75) return 4;
  return 5;
}

function drawUnrolledCells(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  alpha: number,
  highlight: boolean
) {
  const cellSize = 35;

  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;
    const tDelay = t * 0.1;
    const tAlpha = Math.min(1, (alpha - tDelay) / 0.3);

    if (tAlpha > 0) {
      // Cell box
      ctx.strokeStyle = highlight
        ? `rgba(60, 140, 80, ${tAlpha * 0.8})`
        : `rgba(0, 0, 0, ${tAlpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x - cellSize / 2, centerY - cellSize / 2, cellSize, cellSize, 6);
      ctx.stroke();

      ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.05})`;
      ctx.fill();

      // Cell label
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.8})`;
      ctx.fillText(`h${t + 1}`, x, centerY);

      // Timestep label
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.5})`;
      ctx.fillText(`t=${t + 1}`, x, centerY + cellSize / 2 + 12);

      // Input arrow
      ctx.strokeStyle = `rgba(0, 0, 0, ${tAlpha * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, centerY + cellSize / 2 + 25);
      ctx.lineTo(x, centerY + cellSize / 2 + 5);
      ctx.stroke();

      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.5})`;
      ctx.fillText(`x${t + 1}`, x, centerY + cellSize / 2 + 35);

      // Connection to next cell
      if (t < numCells - 1) {
        const nextX = baseX + (t + 1) * spacing;
        ctx.strokeStyle = `rgba(0, 0, 0, ${tAlpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + cellSize / 2 + 3, centerY);
        ctx.lineTo(nextX - cellSize / 2 - 8, centerY);
        ctx.stroke();

        // Arrow
        ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.4})`;
        drawArrowhead(ctx, nextX - cellSize / 2 - 8, centerY, 0);
      }
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
  // Animated pulse traveling forward
  const pulsePosition = progress * numCells;
  const currentCell = Math.floor(pulsePosition);
  const withinCell = pulsePosition - currentCell;

  if (currentCell < numCells) {
    const x = baseX + currentCell * spacing;

    // Glow on current cell
    const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, 35);
    gradient.addColorStop(0, 'rgba(60, 140, 80, 0.4)');
    gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, centerY, 35, 0, Math.PI * 2);
    ctx.fill();

    // Pulse between cells
    if (currentCell < numCells - 1 && withinCell > 0.3) {
      const fromX = baseX + currentCell * spacing + 20;
      const toX = baseX + (currentCell + 1) * spacing - 20;
      const pulseX = fromX + (toX - fromX) * ((withinCell - 0.3) / 0.7);

      ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
      ctx.beginPath();
      ctx.arc(pulseX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.textAlign = 'left';
  ctx.fillText('Forward pass', 10, centerY - 50);
}

function drawLossNodes(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  lossY: number,
  spacing: number,
  numCells: number,
  alpha: number
) {
  for (let t = 0; t < numCells; t++) {
    const x = baseX + t * spacing;
    const tDelay = t * 0.1;
    const tAlpha = Math.min(1, (alpha - tDelay) / 0.3);

    if (tAlpha > 0) {
      // Loss node
      ctx.strokeStyle = `rgba(180, 60, 60, ${tAlpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, lossY, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = `rgba(180, 60, 60, ${tAlpha * 0.1})`;
      ctx.fill();

      // L label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(180, 60, 60, ${tAlpha * 0.9})`;
      ctx.fillText(`L${t + 1}`, x, lossY);

      // Connection from h to L
      const centerY = lossY + 70;
      ctx.strokeStyle = `rgba(0, 0, 0, ${tAlpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, centerY - 35 / 2 - 3);
      ctx.lineTo(x, lossY + 12);
      ctx.stroke();
    }
  }
}

function drawFullBPTT(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  // Gradients flow backward from each loss
  const lossY = centerY - 70;

  for (let startCell = numCells - 1; startCell >= 0; startCell--) {
    const startProgress = 1 - startCell / numCells;
    if (progress < startProgress * 0.5) continue;

    const localProgress = (progress - startProgress * 0.5) / (1 - startProgress * 0.5);
    const reachCell = Math.max(0, startCell - Math.floor(localProgress * startCell));

    // Draw gradient path from startCell back to reachCell
    for (let t = startCell; t > reachCell; t--) {
      const x = baseX + t * spacing;
      const prevX = baseX + (t - 1) * spacing;
      const gradientAlpha = Math.pow(0.8, startCell - t); // Decay

      ctx.strokeStyle = `rgba(180, 60, 60, ${gradientAlpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 20, centerY - 5);
      ctx.lineTo(prevX + 20, centerY - 5);
      ctx.stroke();

      // Backward arrow
      ctx.fillStyle = `rgba(180, 60, 60, ${gradientAlpha * 0.6})`;
      drawArrowhead(ctx, prevX + 20, centerY - 5, Math.PI);
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(180, 60, 60, 0.8)';
  ctx.textAlign = 'left';
  ctx.fillText('Gradients flow back through ALL timesteps', 10, lossY - 20);

  // Highlight: gradients multiply
  if (progress > 0.5) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 60, 60, ${(progress - 0.5) * 2 * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText('Each step multiplies gradients!', baseX + spacing * 2, centerY + 50);
  }
}

function drawTruncatedBPTT(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const lossY = centerY - 70;
  const truncateLength = 2; // Only go back 2 steps

  // Draw cutoff visualization
  for (let t = numCells - 1; t >= 0; t--) {
    const x = baseX + t * spacing;

    // Only show gradient flow for truncateLength steps back
    for (let back = 0; back < Math.min(truncateLength, t); back++) {
      const fromX = baseX + (t - back) * spacing;
      const toX = baseX + (t - back - 1) * spacing;

      const tAlpha = Math.min(1, progress * 2 - (numCells - t) * 0.1);
      if (tAlpha > 0) {
        ctx.strokeStyle = `rgba(60, 140, 80, ${tAlpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromX - 20, centerY - 5);
        ctx.lineTo(toX + 20, centerY - 5);
        ctx.stroke();

        ctx.fillStyle = `rgba(60, 140, 80, ${tAlpha * 0.7})`;
        drawArrowhead(ctx, toX + 20, centerY - 5, Math.PI);
      }
    }

    // Draw cutoff marker
    if (t > truncateLength) {
      const cutoffX = baseX + (t - truncateLength) * spacing + spacing / 2;
      const cutoffAlpha = Math.min(1, progress * 2 - 0.5);

      if (cutoffAlpha > 0) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${cutoffAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cutoffX, centerY - 40);
        ctx.lineTo(cutoffX, centerY + 40);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '8px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = `rgba(0, 0, 0, ${cutoffAlpha * 0.5})`;
        ctx.textAlign = 'center';
        ctx.fillText('stop', cutoffX, centerY + 48);
      }
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.textAlign = 'left';
  ctx.fillText(`TBPTT: Only backprop ${truncateLength} steps`, 10, lossY - 20);
}

function drawComparison(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const y1 = height * 0.2;
  const y2 = height * 0.35;

  // Full BPTT
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 60, 60, ${progress * 0.8})`;
  ctx.textAlign = 'left';
  ctx.fillText('Full BPTT:', 15, y1);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.6})`;
  ctx.fillText('Memory: O(T), captures long-range dependencies', 90, y1);

  // TBPTT
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${progress * 0.8})`;
  ctx.fillText('TBPTT (k):', 15, y2);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.6})`;
  ctx.fillText('Memory: O(k), faster but misses long-range', 90, y2);
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
) {
  const arrowSize = 5;
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
      labelText = 'Compute loss at each timestep';
      break;
    case 3:
      labelText = 'Full BPTT: gradients flow all the way back';
      break;
    case 4:
      labelText = 'Truncated BPTT: limit backward steps';
      break;
    case 5:
      labelText = 'Trade-off: memory vs long-range learning';
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
    phase === 3
      ? 'rgba(180, 60, 60, 0.9)'
      : phase === 4
        ? 'rgba(60, 140, 80, 0.9)'
        : 'rgba(0, 0, 0, 0.7)';
  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}
