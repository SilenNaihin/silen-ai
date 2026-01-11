'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ParabolaAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Parabola Animation demonstrating gradient descent learning
 *
 * Phase 1 (0-0.15): True parabola curve appears
 * Phase 2 (0.15-0.30): Noisy data points appear scattered around the curve
 * Phase 3 (0.30-0.50): Initial guess curve appears (wrong)
 * Phase 4 (0.50-0.70): Gradient arrows appear showing direction of improvement
 * Phase 5 (0.70-1.0): Guess curve animates toward true curve (convergence)
 */
export function ParabolaAnimation({ progress, className = '' }: ParabolaAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const graphCenterX = width * 0.5;
    const graphCenterY = height * 0.52;
    const graphWidth = width * 0.7;
    const graphHeight = height * 0.6;
    const phaseLabelY = height * 0.94;

    // True parabola parameters: y = 0.8x^2 - 0.2x - 1
    const trueA = 0.8;
    const trueB = -0.2;
    const trueC = -1;

    // Initial guess parameters
    const guessA0 = 0.3;
    const guessB0 = 0.5;
    const guessC0 = 0.5;

    // Calculate current guess parameters based on progress
    const convergenceProgress = Math.max(0, (progress - 0.70) / 0.30);
    const easeProgress = easeInOutCubic(convergenceProgress);

    const currentA = guessA0 + (trueA - guessA0) * easeProgress;
    const currentB = guessB0 + (trueB - guessB0) * easeProgress;
    const currentC = guessC0 + (trueC - guessC0) * easeProgress;

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Draw coordinate axes
    drawAxes(ctx, graphCenterX, graphCenterY, graphWidth, graphHeight, progress);

    // Phase 1: True parabola
    if (progress >= 0) {
      const curveAlpha = Math.min(1, progress / 0.15);
      drawParabola(ctx, graphCenterX, graphCenterY, graphWidth, graphHeight, trueA, trueB, trueC, curveAlpha, 'true');
    }

    // Phase 2: Noisy data points
    if (progress >= 0.15) {
      const pointsProgress = Math.min(1, (progress - 0.15) / 0.15);
      drawNoisyPoints(ctx, graphCenterX, graphCenterY, graphWidth, graphHeight, trueA, trueB, trueC, pointsProgress);
    }

    // Phase 3-5: Guess curve
    if (progress >= 0.30) {
      const guessAlpha = Math.min(1, (progress - 0.30) / 0.1);
      drawParabola(ctx, graphCenterX, graphCenterY, graphWidth, graphHeight, currentA, currentB, currentC, guessAlpha, 'guess');
    }

    // Phase 4: Gradient arrows
    if (progress >= 0.50 && progress < 0.85) {
      const arrowProgress = Math.min(1, (progress - 0.50) / 0.15);
      drawGradientArrows(ctx, graphCenterX, graphCenterY, graphWidth, graphHeight, currentA, currentB, trueA, trueB, arrowProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress);

    // Draw loss indicator
    if (progress >= 0.30) {
      const loss = calculateLoss(currentA, currentB, currentC, trueA, trueB, trueC);
      drawLossIndicator(ctx, width * 0.88, height * 0.15, loss, progress);
    }
  };

  return (
    <AnimationCanvas
      progress={progress}
      className={`w-full h-full ${className}`}
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  if (progress < 0.15) return 1;
  if (progress < 0.30) return 2;
  if (progress < 0.50) return 3;
  if (progress < 0.70) return 4;
  return 5;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Gradient Descent', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  let labelText = '';

  switch (phase) {
    case 1:
      labelText = 'True Function: y = ax\u00B2 + bx + c';
      break;
    case 2:
      labelText = 'Observing Noisy Data';
      break;
    case 3:
      labelText = 'Initial Guess (Wrong)';
      break;
    case 4:
      labelText = 'Computing Gradients';
      break;
    case 5:
      labelText = progress >= 0.95 ? 'Converged!' : 'Optimizing Parameters...';
      break;
  }

  // Background pill
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 22;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - pillPadding, y - pillHeight / 2, textWidth + pillPadding * 2, pillHeight, 11);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = phase === 5 && progress >= 0.95 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  graphWidth: number,
  graphHeight: number,
  progress: number
) {
  const alpha = Math.min(1, progress / 0.1) * 0.3;
  const left = cx - graphWidth / 2;
  const right = cx + graphWidth / 2;
  const top = cy - graphHeight / 2;
  const bottom = cy + graphHeight / 2;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 1;

  // X axis
  ctx.beginPath();
  ctx.moveTo(left, cy);
  ctx.lineTo(right, cy);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(cx, bottom);
  ctx.stroke();

  // Grid lines
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.setLineDash([2, 4]);

  const gridSpacing = graphWidth / 8;
  for (let i = 1; i <= 4; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(cx + i * gridSpacing, top);
    ctx.lineTo(cx + i * gridSpacing, bottom);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - i * gridSpacing, top);
    ctx.lineTo(cx - i * gridSpacing, bottom);
    ctx.stroke();
  }

  const vGridSpacing = graphHeight / 6;
  for (let i = 1; i <= 3; i++) {
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(left, cy + i * vGridSpacing);
    ctx.lineTo(right, cy + i * vGridSpacing);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(left, cy - i * vGridSpacing);
    ctx.lineTo(right, cy - i * vGridSpacing);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function drawParabola(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  graphWidth: number,
  graphHeight: number,
  a: number,
  b: number,
  c: number,
  alpha: number,
  type: 'true' | 'guess'
) {
  const xScale = graphWidth / 4; // -2 to 2 range
  const yScale = graphHeight / 6; // Scale for y values

  const isTrueParabola = type === 'true';

  ctx.strokeStyle = isTrueParabola
    ? `rgba(0, 0, 0, ${alpha * 0.9})`
    : `rgba(180, 100, 60, ${alpha * 0.8})`;
  ctx.lineWidth = isTrueParabola ? 2.5 : 2;

  if (!isTrueParabola) {
    ctx.setLineDash([6, 4]);
  }

  ctx.beginPath();
  let firstPoint = true;

  for (let px = -graphWidth / 2; px <= graphWidth / 2; px += 2) {
    const x = px / xScale; // Convert pixel to math coordinates
    const y = a * x * x + b * x + c;
    const screenX = cx + px;
    const screenY = cy - y * yScale; // Invert y for screen coordinates

    if (firstPoint) {
      ctx.moveTo(screenX, screenY);
      firstPoint = false;
    } else {
      ctx.lineTo(screenX, screenY);
    }
  }

  ctx.stroke();
  ctx.setLineDash([]);

  // Draw label
  if (alpha > 0.5) {
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isTrueParabola
      ? `rgba(0, 0, 0, ${alpha * 0.7})`
      : `rgba(180, 100, 60, ${alpha * 0.7})`;

    const labelX = cx + graphWidth * 0.35;
    const labelY = cy - (a * 1.5 * 1.5 + b * 1.5 + c) * yScale - 12;
    ctx.fillText(isTrueParabola ? 'True' : 'Guess', labelX, labelY);
  }
}

function drawNoisyPoints(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  graphWidth: number,
  graphHeight: number,
  a: number,
  b: number,
  c: number,
  progress: number
) {
  const xScale = graphWidth / 4;
  const yScale = graphHeight / 6;
  const numPoints = 20;
  const visiblePoints = Math.floor(numPoints * progress);

  // Deterministic random points
  for (let i = 0; i < visiblePoints; i++) {
    const seed = i * 2654435761;
    const x = ((seed % 1000) / 1000 - 0.5) * 3.5; // Range -1.75 to 1.75
    const trueY = a * x * x + b * x + c;
    const noise = (((seed * 3) % 1000) / 1000 - 0.5) * 0.8; // Noise range
    const y = trueY + noise;

    const screenX = cx + x * xScale;
    const screenY = cy - y * yScale;

    // Point appearance animation
    const pointDelay = i / numPoints;
    const pointAlpha = Math.min(1, (progress - pointDelay) / 0.1);

    if (pointAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${pointAlpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Subtle ring
      ctx.strokeStyle = `rgba(0, 0, 0, ${pointAlpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawGradientArrows(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  graphWidth: number,
  graphHeight: number,
  currentA: number,
  currentB: number,
  targetA: number,
  targetB: number,
  progress: number
) {
  const alpha = progress * 0.7;

  // Draw arrows indicating the gradient direction
  // These point "downhill" toward the optimal parameters
  const arrowStartX = cx + graphWidth * 0.25;
  const arrowStartY = cy + graphHeight * 0.35;

  // Direction vector pointing toward improvement
  const deltaA = targetA - currentA;
  const deltaB = targetB - currentB;
  const magnitude = Math.sqrt(deltaA * deltaA + deltaB * deltaB);

  if (magnitude > 0.01) {
    const arrowLength = 40;
    const normalizedDirX = deltaA / magnitude;
    const normalizedDirY = -deltaB / magnitude; // Flip for screen coords

    const arrowEndX = arrowStartX + normalizedDirX * arrowLength * progress;
    const arrowEndY = arrowStartY + normalizedDirY * arrowLength * progress;

    // Pulsing effect
    const pulse = Math.sin(progress * Math.PI * 4) * 0.2 + 0.8;

    ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * pulse})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowStartY);
    ctx.lineTo(arrowEndX, arrowEndY);
    ctx.stroke();

    // Arrow head
    const headSize = 8;
    const angle = Math.atan2(arrowEndY - arrowStartY, arrowEndX - arrowStartX);

    ctx.fillStyle = `rgba(60, 140, 80, ${alpha * pulse})`;
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
      arrowEndX - headSize * Math.cos(angle - Math.PI / 6),
      arrowEndY - headSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowEndX - headSize * Math.cos(angle + Math.PI / 6),
      arrowEndY - headSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(60, 140, 80, ${alpha})`;
    ctx.fillText('-\u2207L', arrowStartX - 15, arrowStartY + 5);
  }
}

function calculateLoss(
  currentA: number,
  currentB: number,
  currentC: number,
  trueA: number,
  trueB: number,
  trueC: number
): number {
  // Simple MSE-like loss between parameters
  const dA = currentA - trueA;
  const dB = currentB - trueB;
  const dC = currentC - trueC;
  return Math.sqrt(dA * dA + dB * dB + dC * dC);
}

function drawLossIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  loss: number,
  progress: number
) {
  const alpha = Math.min(1, (progress - 0.30) / 0.1);
  const displayLoss = loss.toFixed(2);

  // Background
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.05})`;
  ctx.beginPath();
  ctx.roundRect(x - 35, y - 15, 70, 40, 6);
  ctx.fill();

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('Loss', x, y - 5);

  // Value
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = loss < 0.1
    ? `rgba(60, 140, 80, ${alpha})`
    : `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.fillText(displayLoss, x, y + 12);
}
