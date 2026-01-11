'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface UnrolledRNNAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Unrolled RNN Animation showing how RNN unfolds across time
 *
 * Phase 1 (0-0.20): Show compact RNN with loop notation
 * Phase 2 (0.20-0.45): Animate unrolling - copies expand horizontally
 * Phase 3 (0.45-0.65): Highlight identical weight matrices
 * Phase 4 (0.65-0.85): Data flowing through the unrolled network
 * Phase 5 (0.85-1.0): Show outputs at each timestep
 */
export function UnrolledRNNAnimation({
  progress,
  className = '',
}: UnrolledRNNAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const centerY = height * 0.52;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Unrolling the RNN', width * 0.5, titleY);

    // Phase 1-2: Compact vs unrolled
    if (progress < 0.45) {
      // Compact RNN on left
      const compactAlpha = progress < 0.20 ? 1 : Math.max(0, 1 - (progress - 0.20) / 0.15);
      if (compactAlpha > 0) {
        drawCompactRNN(ctx, width * 0.25, centerY, compactAlpha);
      }

      // Arrow indicating unfolding
      if (progress >= 0.20) {
        const arrowProgress = Math.min(1, (progress - 0.20) / 0.1);
        drawUnfoldArrow(ctx, width * 0.38, centerY, arrowProgress);
      }
    }

    // Phase 2+: Unrolled RNN
    if (progress >= 0.20) {
      const unrollProgress = Math.min(1, (progress - 0.20) / 0.25);
      const baseX = progress < 0.45 ? width * 0.55 : width * 0.18;
      const spacing = 120;

      // Draw 4 timesteps
      for (let t = 0; t < 4; t++) {
        const tDelay = t * 0.15;
        const tAlpha = Math.min(1, (unrollProgress - tDelay) / 0.3);

        if (tAlpha > 0) {
          const x = baseX + t * spacing;
          drawUnrolledCell(
            ctx,
            x,
            centerY,
            t,
            tAlpha,
            progress >= 0.45 && progress < 0.65, // highlight weights
            progress >= 0.65 && progress < 0.85, // data flowing
            progress >= 0.85 // show outputs
          );

          // Draw connections between cells
          if (t > 0 && tAlpha > 0.5) {
            const prevX = baseX + (t - 1) * spacing;
            drawCellConnection(
              ctx,
              prevX + 25,
              centerY,
              x - 25,
              centerY,
              (tAlpha - 0.5) * 2,
              progress >= 0.45 && progress < 0.65
            );
          }
        }
      }
    }

    // Phase 3: Weight sharing emphasis
    if (progress >= 0.45 && progress < 0.65) {
      const emphasisProgress = (progress - 0.45) / 0.2;
      drawWeightSharingEmphasis(ctx, width, height, emphasisProgress);
    }

    // Phase 4: Data flow animation
    if (progress >= 0.65 && progress < 0.85) {
      const flowProgress = (progress - 0.65) / 0.2;
      const baseX = width * 0.18;
      const spacing = 120;
      drawDataFlow(ctx, baseX, centerY, spacing, flowProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);

    // Draw formula
    if (progress >= 0.20) {
      const formulaAlpha = Math.min(1, (progress - 0.20) / 0.1) * 0.6;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha})`;
      ctx.textAlign = 'center';
      ctx.fillText(
        'Same W at every timestep: W shared across t = 1, 2, 3, ..., T',
        width * 0.5,
        height * 0.85
      );
    }
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

function drawCompactRNN(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number
) {
  // Main cell
  const cellSize = 50;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize, 8);
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.05})`;
  ctx.fill();

  // RNN label
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
  ctx.fillText('RNN', x, y);

  // Self-loop arrow (recurrence)
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 35, y, 15, -0.5 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Arrowhead on loop
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.beginPath();
  const arrowX = x + 35 + 15 * Math.cos(0.8 * Math.PI);
  const arrowY = y + 15 * Math.sin(0.8 * Math.PI);
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX + 5, arrowY - 3);
  ctx.lineTo(arrowX + 3, arrowY + 5);
  ctx.closePath();
  ctx.fill();

  // Input arrow
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.beginPath();
  ctx.moveTo(x, y + cellSize / 2 + 30);
  ctx.lineTo(x, y + cellSize / 2 + 5);
  ctx.stroke();
  drawArrowhead(ctx, x, y + cellSize / 2 + 5, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.5})`);

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText('xₜ', x, y + cellSize / 2 + 42);

  // Output arrow
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.beginPath();
  ctx.moveTo(x, y - cellSize / 2 - 5);
  ctx.lineTo(x, y - cellSize / 2 - 30);
  ctx.stroke();
  drawArrowhead(ctx, x, y - cellSize / 2 - 30, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.5})`);

  ctx.fillText('hₜ', x, y - cellSize / 2 - 42);

  // "Folded" label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('(folded)', x, y + cellSize / 2 + 65);
}

function drawUnfoldArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) {
  const alpha = progress;
  const length = 40 * progress;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();
  ctx.setLineDash([]);

  if (progress > 0.5) {
    drawArrowhead(ctx, x + length, y, 0, `rgba(0, 0, 0, ${(progress - 0.5) * 2 * 0.4})`);
  }

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'center';
  ctx.fillText('unfold', x + length / 2, y - 12);
}

function drawUnrolledCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestep: number,
  alpha: number,
  highlightWeights: boolean,
  dataFlowing: boolean,
  showOutput: boolean
) {
  const cellSize = 40;

  // Cell rectangle
  const strokeColor = highlightWeights ? '60, 140, 80' : '0, 0, 0';
  ctx.strokeStyle = `rgba(${strokeColor}, ${alpha * 0.8})`;
  ctx.lineWidth = highlightWeights ? 2.5 : 2;
  ctx.beginPath();
  ctx.roundRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize, 6);
  ctx.stroke();

  ctx.fillStyle = dataFlowing
    ? `rgba(60, 140, 80, ${alpha * 0.15})`
    : `rgba(0, 0, 0, ${alpha * 0.05})`;
  ctx.fill();

  // Cell label
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${strokeColor}, ${alpha * 0.9})`;
  ctx.fillText(`h${timestep + 1}`, x, y);

  // Input from below
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + cellSize / 2 + 25);
  ctx.lineTo(x, y + cellSize / 2 + 3);
  ctx.stroke();
  drawArrowhead(ctx, x, y + cellSize / 2 + 3, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.4})`);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText(`x${timestep + 1}`, x, y + cellSize / 2 + 38);

  // Output above (only in final phase)
  if (showOutput) {
    ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.6})`;
    ctx.beginPath();
    ctx.moveTo(x, y - cellSize / 2 - 3);
    ctx.lineTo(x, y - cellSize / 2 - 25);
    ctx.stroke();
    drawArrowhead(ctx, x, y - cellSize / 2 - 25, -Math.PI / 2, `rgba(100, 100, 180, ${alpha * 0.6})`);

    ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.7})`;
    ctx.fillText(`y${timestep + 1}`, x, y - cellSize / 2 - 38);
  }

  // Timestep label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.fillText(`t=${timestep + 1}`, x, y + cellSize / 2 + 55);
}

function drawCellConnection(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number,
  highlight: boolean
) {
  const color = highlight ? '60, 140, 80' : '0, 0, 0';
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.6})`;
  ctx.lineWidth = highlight ? 2.5 : 2;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  drawArrowhead(ctx, toX, toY, 0, `rgba(${color}, ${alpha * 0.6})`);

  // Weight label
  if (alpha > 0.5) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(${color}, ${(alpha - 0.5) * 2 * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText('Wₕₕ', (fromX + toX) / 2, fromY - 12);
  }
}

function drawWeightSharingEmphasis(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  // Draw dashed lines connecting identical weights
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = `rgba(60, 140, 80, ${progress * 0.3})`;
  ctx.lineWidth = 1;

  const baseX = width * 0.18;
  const spacing = 120;
  const y = height * 0.52 - 60;

  for (let i = 0; i < 3; i++) {
    const x1 = baseX + i * spacing + 20;
    const x2 = baseX + (i + 1) * spacing + 20;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  ctx.setLineDash([]);

  // "Same weights!" label
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${progress * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Same weights at every step!', width * 0.5, y - 15);
}

function drawDataFlow(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  progress: number
) {
  // Animated pulse traveling through the network
  const pulsePosition = progress * 4; // 0 to 4 (through 4 cells)
  const currentCell = Math.floor(pulsePosition);
  const withinCell = pulsePosition - currentCell;

  for (let t = 0; t <= Math.min(currentCell, 3); t++) {
    const x = baseX + t * spacing;

    // Glow effect on active cell
    if (t === currentCell && t < 4) {
      const glowRadius = 30 + Math.sin(withinCell * Math.PI) * 10;
      const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, glowRadius);
      gradient.addColorStop(0, 'rgba(60, 140, 80, 0.3)');
      gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Trail showing data has passed
    if (t < currentCell) {
      ctx.fillStyle = 'rgba(60, 140, 80, 0.15)';
      ctx.beginPath();
      ctx.arc(x, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pulse traveling between cells
  if (currentCell < 3 && withinCell > 0.3 && withinCell < 0.7) {
    const fromX = baseX + currentCell * spacing + 25;
    const toX = baseX + (currentCell + 1) * spacing - 25;
    const pulseX = fromX + (toX - fromX) * ((withinCell - 0.3) / 0.4);

    ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
    ctx.beginPath();
    ctx.arc(pulseX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
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
  ctx.moveTo(x + arrowSize * Math.cos(angle), y + arrowSize * Math.sin(angle));
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
      labelText = 'Compact RNN with self-loop';
      break;
    case 2:
      labelText = 'Unfolding across time';
      break;
    case 3:
      labelText = 'Same weights W at every step';
      break;
    case 4:
      labelText = 'Data flows left to right';
      break;
    case 5:
      labelText = 'Output at each timestep';
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
  ctx.fillStyle = phase === 3 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}
