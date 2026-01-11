'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface LSTMProgressiveAnimationProps {
  progress: number;
  className?: string;
}

/**
 * LSTM Progressive Build-up Animation
 *
 * Progressively builds the LSTM architecture showing why each component exists
 *
 * Phase 1 (0-0.12): Simple RNN with vanishing gradient indicator
 * Phase 2 (0.12-0.25): Add cell state line (the highway)
 * Phase 3 (0.25-0.38): Add forget gate
 * Phase 4 (0.38-0.52): Add input gate
 * Phase 5 (0.52-0.68): Add output gate
 * Phase 6 (0.68-0.85): Full LSTM labeled
 * Phase 7 (0.85-1.0): Show gradient flow through cell state
 */
export function LSTMProgressiveAnimation({
  progress,
  className = '',
}: LSTMProgressiveAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Draw title
    const title = getTitleForPhase(phase);
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(title, centerX, titleY);

    // Draw LSTM cell progressively
    drawLSTMCell(ctx, centerX, centerY, width, height, progress, phase);

    // Draw phase label
    drawPhaseLabel(ctx, centerX, phaseLabelY, phase);
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  if (progress < 0.12) return 1;
  if (progress < 0.25) return 2;
  if (progress < 0.38) return 3;
  if (progress < 0.52) return 4;
  if (progress < 0.68) return 5;
  if (progress < 0.85) return 6;
  return 7;
}

function getTitleForPhase(phase: number): string {
  switch (phase) {
    case 1:
      return 'The Problem: Vanishing Gradients';
    case 2:
      return 'The Cell State: Information Highway';
    case 3:
      return 'The Forget Gate';
    case 4:
      return 'The Input Gate';
    case 5:
      return 'The Output Gate';
    case 6:
      return 'The Complete LSTM';
    case 7:
      return 'Gradient Flow';
    default:
      return 'LSTM';
  }
}

function drawLSTMCell(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  phase: number
) {
  const cellWidth = 200;
  const cellHeight = 140;
  const left = centerX - cellWidth / 2;
  const right = centerX + cellWidth / 2;
  const top = centerY - cellHeight / 2;
  const bottom = centerY + cellHeight / 2;

  // Cell state line Y position
  const cellStateY = top + 25;
  // Hidden state Y position
  const hiddenY = bottom - 30;

  // Phase 1: Show simple RNN problem
  if (phase === 1) {
    const alpha = Math.min(1, progress / 0.08);
    drawSimpleRNNProblem(ctx, centerX, centerY, alpha);
    return;
  }

  // Phase 2+: Cell outline
  const outlineAlpha = Math.min(1, (progress - 0.12) / 0.08);
  ctx.strokeStyle = `rgba(0, 0, 0, ${outlineAlpha * 0.3})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.roundRect(left - 10, top - 10, cellWidth + 20, cellHeight + 20, 8);
  ctx.stroke();
  ctx.setLineDash([]);

  // Cell state line (the highway)
  if (progress >= 0.12) {
    const cellStateAlpha = Math.min(1, (progress - 0.12) / 0.1);
    drawCellStateLine(ctx, left - 30, right + 30, cellStateY, cellStateAlpha, phase >= 7);
  }

  // Hidden state line
  if (progress >= 0.12) {
    const hiddenAlpha = Math.min(1, (progress - 0.15) / 0.08);
    drawHiddenStateLine(ctx, left - 30, right + 30, hiddenY, hiddenAlpha);
  }

  // Forget gate (phase 3+)
  if (progress >= 0.25) {
    const forgetAlpha = Math.min(1, (progress - 0.25) / 0.1);
    const forgetX = left + 40;
    drawGate(ctx, forgetX, cellStateY, 'f', 'Forget', forgetAlpha, phase === 3);
    // Pointwise multiply on cell state
    drawPointwiseOp(ctx, forgetX, cellStateY + 25, '×', forgetAlpha);
  }

  // Input gate (phase 4+)
  if (progress >= 0.38) {
    const inputAlpha = Math.min(1, (progress - 0.38) / 0.1);
    const inputX = centerX;
    drawGate(ctx, inputX - 25, cellStateY + 50, 'i', 'Input', inputAlpha, phase === 4);
    drawGate(ctx, inputX + 25, cellStateY + 50, 'g', 'Candidate', inputAlpha, phase === 4, true);
    // Pointwise multiply and add
    drawPointwiseOp(ctx, inputX, cellStateY + 25, '+', inputAlpha);
  }

  // Output gate (phase 5+)
  if (progress >= 0.52) {
    const outputAlpha = Math.min(1, (progress - 0.52) / 0.1);
    const outputX = right - 40;
    drawGate(ctx, outputX, hiddenY - 30, 'o', 'Output', outputAlpha, phase === 5);
    // Tanh on cell state
    drawActivation(ctx, outputX - 40, hiddenY - 10, 'tanh', outputAlpha);
    // Pointwise multiply for output
    drawPointwiseOp(ctx, outputX, hiddenY, '×', outputAlpha);
  }

  // Phase 6: Labels and connections
  if (progress >= 0.68) {
    const labelAlpha = Math.min(1, (progress - 0.68) / 0.1);
    drawLabels(ctx, left, right, top, bottom, cellStateY, hiddenY, labelAlpha);
  }

  // Phase 7: Gradient flow visualization
  if (progress >= 0.85) {
    const gradientProgress = (progress - 0.85) / 0.15;
    drawGradientFlow(ctx, left, right, cellStateY, gradientProgress);
  }

  // Input/output arrows
  if (progress >= 0.15) {
    const arrowAlpha = Math.min(1, (progress - 0.15) / 0.1);
    // Input x_t from below
    ctx.strokeStyle = `rgba(0, 0, 0, ${arrowAlpha * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, bottom + 40);
    ctx.lineTo(centerX, bottom + 5);
    ctx.stroke();
    drawArrowhead(ctx, centerX, bottom + 5, -Math.PI / 2, `rgba(0, 0, 0, ${arrowAlpha * 0.5})`);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${arrowAlpha * 0.6})`;
    ctx.textAlign = 'center';
    ctx.fillText('xₜ', centerX, bottom + 52);
  }
}

function drawSimpleRNNProblem(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  alpha: number
) {
  // Draw a simple RNN with gradient decay indicator
  const cellSize = 50;
  const numCells = 4;
  const spacing = 70;
  const startX = centerX - ((numCells - 1) * spacing) / 2;

  for (let i = 0; i < numCells; i++) {
    const x = startX + i * spacing;
    const gradientStrength = Math.pow(0.5, numCells - 1 - i);

    // Cell
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - cellSize / 2, centerY - cellSize / 2, cellSize, cellSize, 6);
    ctx.stroke();

    // Gradient indicator (bar below)
    const barHeight = 30 * gradientStrength;
    ctx.fillStyle = `rgba(180, 60, 60, ${alpha * (0.3 + gradientStrength * 0.5)})`;
    ctx.fillRect(x - 15, centerY + 45, 30, barHeight);

    // Connection
    if (i < numCells - 1) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2 + 3, centerY);
      ctx.lineTo(startX + (i + 1) * spacing - cellSize / 2 - 3, centerY);
      ctx.stroke();
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Gradient vanishes over time', centerX, centerY + 90);
}

function drawCellStateLine(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  y: number,
  alpha: number,
  showGradient: boolean
) {
  // The cell state line (highway)
  ctx.strokeStyle = showGradient
    ? `rgba(60, 140, 80, ${alpha * 0.8})`
    : `rgba(100, 100, 180, ${alpha * 0.7})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  // Arrows
  ctx.fillStyle = showGradient
    ? `rgba(60, 140, 80, ${alpha * 0.8})`
    : `rgba(100, 100, 180, ${alpha * 0.7})`;
  drawArrowhead(ctx, right - 5, y, 0);

  // Label
  if (!showGradient) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.7})`;
    ctx.textAlign = 'left';
    ctx.fillText('Cₜ₋₁', left - 25, y + 4);
    ctx.textAlign = 'right';
    ctx.fillText('Cₜ', right + 20, y + 4);
  }
}

function drawHiddenStateLine(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  y: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  drawArrowhead(ctx, right - 5, y, 0);

  // Label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'left';
  ctx.fillText('hₜ₋₁', left - 25, y + 4);
  ctx.textAlign = 'right';
  ctx.fillText('hₜ', right + 20, y + 4);
}

function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  symbol: string,
  label: string,
  alpha: number,
  highlight: boolean,
  isCandidate: boolean = false
) {
  const size = 28;
  const color = highlight
    ? isCandidate
      ? '180, 100, 60'
      : '60, 140, 80'
    : isCandidate
      ? '180, 100, 60'
      : '0, 0, 0';

  // Gate box
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`;
  ctx.lineWidth = highlight ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(x - size / 2, y - size / 2, size, size, 4);
  ctx.stroke();

  ctx.fillStyle = `rgba(${color}, ${alpha * 0.1})`;
  ctx.fill();

  // Symbol
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.9})`;
  ctx.fillText(isCandidate ? 'g' : `σ`, x, y);

  // Label below
  if (highlight) {
    ctx.font = '8px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(${color}, ${alpha * 0.7})`;
    ctx.fillText(label, x, y + size / 2 + 10);
  }
}

function drawPointwiseOp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  op: string,
  alpha: number
) {
  const size = 18;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.fillText(op, x, y);
}

function drawActivation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  alpha: number
) {
  const width = 35;
  const height = 20;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, 3);
  ctx.stroke();

  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText(name, x, y);
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  top: number,
  bottom: number,
  cellStateY: number,
  hiddenY: number,
  alpha: number
) {
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;

  // Cell state label
  ctx.textAlign = 'center';
  ctx.fillText('Cell State (memory highway)', (left + right) / 2, cellStateY - 35);

  // Hidden state label
  ctx.fillText('Hidden State (output)', (left + right) / 2, hiddenY + 45);
}

function drawGradientFlow(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  cellStateY: number,
  progress: number
) {
  // Animated gradient flowing through cell state
  const pulseX = right - (right - left) * progress;

  // Gradient glow
  const gradient = ctx.createRadialGradient(pulseX, cellStateY, 0, pulseX, cellStateY, 30);
  gradient.addColorStop(0, 'rgba(60, 140, 80, 0.6)');
  gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(pulseX, cellStateY, 30, 0, Math.PI * 2);
  ctx.fill();

  // Trail
  ctx.strokeStyle = 'rgba(60, 140, 80, 0.3)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(right, cellStateY);
  ctx.lineTo(pulseX, cellStateY);
  ctx.stroke();

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${progress * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Gradients flow unimpeded!', (left + right) / 2, cellStateY - 50);
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color?: string
) {
  const arrowSize = 6;
  if (color) ctx.fillStyle = color;
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
  const labels = [
    '',
    'RNN: gradients vanish through time',
    'Add cell state: direct path for information',
    'Forget gate: control what to discard',
    'Input gate: control what to add',
    'Output gate: control what to output',
    'Complete LSTM cell',
    'Gradients flow through cell state!',
  ];

  const labelText = labels[phase] || '';

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
    phase === 7
      ? 'rgba(60, 140, 80, 0.9)'
      : phase >= 3 && phase <= 5
        ? 'rgba(60, 140, 80, 0.9)'
        : 'rgba(0, 0, 0, 0.7)';
  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}
