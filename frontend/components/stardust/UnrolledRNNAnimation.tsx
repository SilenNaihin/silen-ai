'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface UnrolledRNNAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Unrolled RNN Animation showing how RNN unfolds across time
 *
 * Phase 1 (0-0.25): Show compact RNN with self-loop notation, emphasize the loop
 * Phase 2 (0.25-0.55): Animate unrolling - cells appear one by one with clear staging
 * Phase 3 (0.55-0.75): Highlight weight sharing with visual connections
 * Phase 4 (0.75-0.90): Data flows through the network sequentially
 * Phase 5 (0.90-1.0): Show outputs at each timestep
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

    const centerY = height * 0.5;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;

    const phase = getPhase(progress);

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Unrolling the RNN', width * 0.5, titleY);

    // Phase 1: Compact RNN (0-0.25)
    if (progress < 0.35) {
      const compactAlpha = progress < 0.25 ? 1 : Math.max(0, 1 - (progress - 0.25) / 0.1);
      if (compactAlpha > 0) {
        drawCompactRNN(ctx, width * 0.5, centerY, compactAlpha, progress);
      }
    }

    // Transition: Unfold arrow appears (0.20-0.30)
    if (progress >= 0.20 && progress < 0.35) {
      const arrowProgress = Math.min(1, (progress - 0.20) / 0.1);
      drawUnfoldIndicator(ctx, width * 0.5, centerY + 85, arrowProgress);
    }

    // Phase 2+: Unrolled RNN cells appear one by one
    if (progress >= 0.25) {
      const numCells = 4;
      const spacing = Math.min(110, (width - 80) / numCells);
      const baseX = width * 0.5 - (spacing * (numCells - 1)) / 2;

      // Calculate how many cells should be visible
      const unrollProgress = (progress - 0.25) / 0.30; // 0 to 1 over phase 2

      for (let t = 0; t < numCells; t++) {
        // Each cell appears with a delay
        const cellStartProgress = t * 0.25; // Stagger each cell
        const cellProgress = Math.max(0, (unrollProgress - cellStartProgress) / 0.25);
        const cellAlpha = easeOutCubic(Math.min(1, cellProgress));

        if (cellAlpha > 0) {
          const x = baseX + t * spacing;

          // Scale animation for dramatic appearance
          const scale = 0.5 + 0.5 * easeOutBack(Math.min(1, cellProgress));

          drawUnrolledCell(
            ctx,
            x,
            centerY,
            t,
            cellAlpha,
            scale,
            progress >= 0.55 && progress < 0.75, // highlight weights
            progress >= 0.75 && progress < 0.90, // data flowing
            progress >= 0.90, // show outputs
            progress
          );

          // Draw connections between cells
          if (t > 0 && cellAlpha > 0.3) {
            const prevX = baseX + (t - 1) * spacing;
            const connectionAlpha = Math.min(1, (cellAlpha - 0.3) / 0.5);
            drawCellConnection(
              ctx,
              prevX + 22,
              centerY,
              x - 22,
              centerY,
              connectionAlpha,
              progress >= 0.55 && progress < 0.75,
              t - 1
            );
          }
        }
      }

      // Phase 3: Weight sharing visualization
      if (progress >= 0.55 && progress < 0.75) {
        const emphasisProgress = (progress - 0.55) / 0.20;
        drawWeightSharingVisualization(ctx, baseX, centerY, spacing, numCells, emphasisProgress);
      }

      // Phase 4: Data flow animation
      if (progress >= 0.75 && progress < 0.90) {
        const flowProgress = (progress - 0.75) / 0.15;
        drawDataFlow(ctx, baseX, centerY, spacing, numCells, flowProgress);
      }
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);

    // Draw formula (appears after unrolling starts)
    if (progress >= 0.35) {
      const formulaAlpha = easeOutCubic(Math.min(1, (progress - 0.35) / 0.15)) * 0.7;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha})`;
      ctx.textAlign = 'center';
      ctx.fillText(
        'Same weights W shared: h_t = f(W_xh * x_t + W_hh * h_{t-1})',
        width * 0.5,
        height * 0.86
      );
    }
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function getPhase(progress: number): number {
  if (progress < 0.25) return 1;
  if (progress < 0.55) return 2;
  if (progress < 0.75) return 3;
  if (progress < 0.90) return 4;
  return 5;
}

function drawCompactRNN(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  progress: number
) {
  const cellSize = 60;

  // Main cell with subtle glow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize, 10);
  ctx.stroke();

  ctx.fillStyle = `rgba(245, 245, 245, ${alpha})`;
  ctx.fill();

  ctx.shadowBlur = 0;

  // RNN label
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
  ctx.fillText('RNN', x, y);

  // Animated self-loop arrow (recurrence) - pulsing effect
  const pulsePhase = (Math.sin(progress * Math.PI * 8) + 1) / 2;
  const loopAlpha = alpha * (0.6 + 0.3 * pulsePhase);

  ctx.strokeStyle = `rgba(60, 140, 80, ${loopAlpha})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Draw loop on the right side
  ctx.arc(x + cellSize / 2 + 12, y, 18, -0.6 * Math.PI, 0.6 * Math.PI);
  ctx.stroke();

  // Arrowhead on loop
  ctx.fillStyle = `rgba(60, 140, 80, ${loopAlpha})`;
  const arrowAngle = 0.6 * Math.PI;
  const arrowX = x + cellSize / 2 + 12 + 18 * Math.cos(arrowAngle);
  const arrowY = y + 18 * Math.sin(arrowAngle);
  drawArrowhead(ctx, arrowX, arrowY, arrowAngle + Math.PI / 2, `rgba(60, 140, 80, ${loopAlpha})`, 7);

  // "Recurrence" label near loop
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.textAlign = 'left';
  ctx.fillText('recurrence', x + cellSize / 2 + 35, y);

  // Input arrow (from below)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + cellSize / 2 + 35);
  ctx.lineTo(x, y + cellSize / 2 + 5);
  ctx.stroke();
  drawArrowhead(ctx, x, y + cellSize / 2 + 5, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.5})`, 6);

  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.textAlign = 'center';
  ctx.fillText('x_t', x, y + cellSize / 2 + 50);

  // Output arrow (upward)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.beginPath();
  ctx.moveTo(x, y - cellSize / 2 - 5);
  ctx.lineTo(x, y - cellSize / 2 - 35);
  ctx.stroke();
  drawArrowhead(ctx, x, y - cellSize / 2 - 35, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.5})`, 6);

  ctx.fillText('h_t', x, y - cellSize / 2 - 50);

  // "Compact form" annotation
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('Compact (folded) form', x, y + cellSize / 2 + 75);
}

function drawUnfoldIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) {
  const alpha = easeOutCubic(progress);

  // Downward arrow indicating transformation
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.fillText('\u2193', x, y);

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('unfold across time', x, y + 20);
}

function drawUnrolledCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestep: number,
  alpha: number,
  scale: number,
  highlightWeights: boolean,
  dataFlowing: boolean,
  showOutput: boolean,
  globalProgress: number
) {
  const baseSize = 38;
  const cellSize = baseSize * scale;

  ctx.save();

  // Apply scale transformation
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-x, -y);

  // Cell glow when data is flowing through it
  if (dataFlowing) {
    const flowPosition = ((globalProgress - 0.75) / 0.15) * 4;
    const isActive = Math.abs(flowPosition - timestep) < 0.8;
    if (isActive) {
      const glowIntensity = 1 - Math.abs(flowPosition - timestep) / 0.8;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, cellSize + 15);
      gradient.addColorStop(0, `rgba(60, 140, 80, ${0.3 * glowIntensity * alpha})`);
      gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, cellSize + 15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cell rectangle
  const strokeColor = highlightWeights ? '60, 140, 80' : '0, 0, 0';
  ctx.strokeStyle = `rgba(${strokeColor}, ${alpha * 0.8})`;
  ctx.lineWidth = highlightWeights ? 2.5 : 2;
  ctx.beginPath();
  ctx.roundRect(x - baseSize / 2, y - baseSize / 2, baseSize, baseSize, 6);
  ctx.stroke();

  // Fill
  const fillColor = dataFlowing ? '60, 140, 80' : '0, 0, 0';
  ctx.fillStyle = `rgba(${fillColor}, ${alpha * 0.08})`;
  ctx.fill();

  // Cell label
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${strokeColor}, ${alpha * 0.9})`;
  ctx.fillText(`h${timestep + 1}`, x, y);

  ctx.restore();

  // Input from below (outside scale transform)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + cellSize / 2 + 28);
  ctx.lineTo(x, y + cellSize / 2 + 5);
  ctx.stroke();
  drawArrowhead(ctx, x, y + cellSize / 2 + 5, -Math.PI / 2, `rgba(0, 0, 0, ${alpha * 0.4})`, 5);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText(`x${timestep + 1}`, x, y + cellSize / 2 + 40);

  // Output above (only in final phase)
  if (showOutput) {
    const outputProgress = Math.min(1, (globalProgress - 0.90) / 0.08);
    const outputAlpha = alpha * easeOutCubic(outputProgress);

    ctx.strokeStyle = `rgba(100, 100, 180, ${outputAlpha * 0.7})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - cellSize / 2 - 5);
    ctx.lineTo(x, y - cellSize / 2 - 28);
    ctx.stroke();
    drawArrowhead(ctx, x, y - cellSize / 2 - 28, -Math.PI / 2, `rgba(100, 100, 180, ${outputAlpha * 0.7})`, 5);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(100, 100, 180, ${outputAlpha * 0.8})`;
    ctx.fillText(`y${timestep + 1}`, x, y - cellSize / 2 - 40);
  }

  // Timestep label at bottom
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
  highlight: boolean,
  connectionIndex: number
) {
  const color = highlight ? '60, 140, 80' : '100, 100, 100';
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.6})`;
  ctx.lineWidth = highlight ? 2.5 : 2;

  // Slight curve for visual interest
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  const cpY = fromY - 8;
  ctx.quadraticCurveTo((fromX + toX) / 2, cpY, toX, toY);
  ctx.stroke();

  drawArrowhead(ctx, toX, toY, 0, `rgba(${color}, ${alpha * 0.6})`, 5);

  // Weight label (only show a few to avoid clutter)
  if (alpha > 0.5 && connectionIndex < 2) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(${color}, ${(alpha - 0.3) * 0.9})`;
    ctx.textAlign = 'center';
    ctx.fillText('W_hh', (fromX + toX) / 2, cpY - 8);
  }
}

function drawWeightSharingVisualization(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  const alpha = easeOutCubic(progress);

  // Draw bracket above all cells to show weight sharing
  const bracketY = centerY - 55;
  const leftX = baseX - 15;
  const rightX = baseX + (numCells - 1) * spacing + 15;

  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.5})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);

  // Top bracket line
  ctx.beginPath();
  ctx.moveTo(leftX, bracketY + 10);
  ctx.lineTo(leftX, bracketY);
  ctx.lineTo(rightX, bracketY);
  ctx.lineTo(rightX, bracketY + 10);
  ctx.stroke();

  ctx.setLineDash([]);

  // "Same W_hh everywhere!" label
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
  ctx.textAlign = 'center';
  ctx.fillText('Same weights W_hh everywhere!', (leftX + rightX) / 2, bracketY - 12);

  // Draw small "=" signs between connections to emphasize equality
  if (progress > 0.3) {
    const eqAlpha = (progress - 0.3) / 0.7;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(60, 140, 80, ${eqAlpha * alpha * 0.7})`;

    for (let i = 0; i < numCells - 2; i++) {
      const eqX = baseX + (i + 0.5) * spacing;
      ctx.fillText('=', eqX, centerY - 28);
    }
  }
}

function drawDataFlow(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  centerY: number,
  spacing: number,
  numCells: number,
  progress: number
) {
  // Animated pulse traveling through the network
  const pulsePosition = progress * numCells;
  const currentCell = Math.floor(pulsePosition);
  const withinCell = pulsePosition - currentCell;

  // Draw trail showing where data has been
  for (let t = 0; t < Math.min(currentCell, numCells); t++) {
    const x = baseX + t * spacing;
    ctx.fillStyle = 'rgba(60, 140, 80, 0.15)';
    ctx.beginPath();
    ctx.arc(x, centerY, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pulse traveling between cells
  if (currentCell < numCells - 1 && withinCell > 0.2 && withinCell < 0.8) {
    const fromX = baseX + currentCell * spacing + 20;
    const toX = baseX + (currentCell + 1) * spacing - 20;
    const pulseX = fromX + (toX - fromX) * ((withinCell - 0.2) / 0.6);

    // Pulse glow
    const gradient = ctx.createRadialGradient(pulseX, centerY, 0, pulseX, centerY, 12);
    gradient.addColorStop(0, 'rgba(60, 140, 80, 0.8)');
    gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pulseX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pulse core
    ctx.fillStyle = 'rgba(60, 140, 80, 1)';
    ctx.beginPath();
    ctx.arc(pulseX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // "Information flows left to right" annotation
  if (progress > 0.3) {
    const labelAlpha = Math.min(1, (progress - 0.3) / 0.3) * 0.6;
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(60, 140, 80, ${labelAlpha})`;
    ctx.textAlign = 'center';
    ctx.fillText('h_t carries information from all previous steps', baseX + ((numCells - 1) * spacing) / 2, centerY + 70);
  }
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
  size: number = 6
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
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
      labelText = 'Compact RNN: self-loop represents recurrence';
      break;
    case 2:
      labelText = 'Unfolding: one copy per timestep';
      break;
    case 3:
      labelText = 'Key insight: same W at every step!';
      break;
    case 4:
      labelText = 'Hidden state carries forward in time';
      break;
    case 5:
      labelText = 'Outputs available at each timestep';
      break;
  }

  // Background pill
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 22;

  ctx.fillStyle = phase === 3 ? 'rgba(60, 140, 80, 0.1)' : 'rgba(0, 0, 0, 0.05)';
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
  ctx.fillStyle = phase === 3 ? 'rgba(60, 140, 80, 0.95)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}
