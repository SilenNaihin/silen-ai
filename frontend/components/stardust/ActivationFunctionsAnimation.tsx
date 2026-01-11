'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ActivationFunctionsAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Activation Functions Animation comparing ReLU, Sigmoid, and Tanh
 *
 * Phase 1 (0-0.25): ReLU graph and properties
 * Phase 2 (0.25-0.50): Sigmoid graph and why it's used for gates
 * Phase 3 (0.50-0.75): Tanh graph and why it's used for cell state
 * Phase 4 (0.75-1.0): Comparison - why LSTM uses sigmoid for gates, tanh for values
 */
export function ActivationFunctionsAnimation({
  progress,
  className = '',
}: ActivationFunctionsAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Activation Functions', width * 0.5, titleY);

    // Phase 1: ReLU
    if (phase === 1) {
      const alpha = Math.min(1, progress / 0.2);
      drawReLU(ctx, width * 0.5, height * 0.5, alpha);
    }

    // Phase 2: Sigmoid
    if (phase === 2) {
      const alpha = Math.min(1, (progress - 0.25) / 0.2);
      drawSigmoid(ctx, width * 0.5, height * 0.5, alpha);
    }

    // Phase 3: Tanh
    if (phase === 3) {
      const alpha = Math.min(1, (progress - 0.5) / 0.2);
      drawTanh(ctx, width * 0.5, height * 0.5, alpha);
    }

    // Phase 4: Comparison
    if (phase === 4) {
      const alpha = Math.min(1, (progress - 0.75) / 0.2);
      drawComparison(ctx, width, height, alpha);
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
  if (progress < 0.50) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

function drawReLU(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  alpha: number
) {
  const graphWidth = 200;
  const graphHeight = 120;
  const left = centerX - graphWidth / 2;
  const right = centerX + graphWidth / 2;
  const top = centerY - graphHeight / 2;
  const bottom = centerY + graphHeight / 2;

  // Axes
  drawAxes(ctx, left, right, top, bottom, centerX, centerY, alpha);

  // ReLU function
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Flat part (x < 0 -> y = 0)
  ctx.moveTo(left, centerY);
  ctx.lineTo(centerX, centerY);
  // Linear part (x > 0 -> y = x)
  ctx.lineTo(right, top + 20);
  ctx.stroke();

  // Formula
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('ReLU(x) = max(0, x)', centerX, bottom + 35);

  // Properties
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'left';
  const propX = centerX + graphWidth / 2 + 30;
  ctx.fillText('Range: [0, ∞)', propX, centerY - 30);
  ctx.fillText('Fast to compute', propX, centerY - 10);
  ctx.fillText('No saturation for x > 0', propX, centerY + 10);
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.6})`;
  ctx.fillText('Can "die" if x < 0', propX, centerY + 30);
}

function drawSigmoid(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  alpha: number
) {
  const graphWidth = 200;
  const graphHeight = 120;
  const left = centerX - graphWidth / 2;
  const right = centerX + graphWidth / 2;
  const top = centerY - graphHeight / 2;
  const bottom = centerY + graphHeight / 2;

  // Axes
  drawAxes(ctx, left, right, top, bottom, centerX, centerY, alpha);

  // Sigmoid function
  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = left; px <= right; px += 2) {
    const x = (px - centerX) / (graphWidth / 6); // Scale to [-3, 3]
    const y = 1 / (1 + Math.exp(-x));
    const py = bottom - y * graphHeight;
    if (px === left) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // 0 and 1 lines
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.moveTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels for 0 and 1
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'right';
  ctx.fillText('1', left - 5, top + 4);
  ctx.fillText('0', left - 5, bottom + 4);

  // Formula
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('σ(x) = 1 / (1 + e⁻ˣ)', centerX, bottom + 35);

  // Properties
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'left';
  const propX = centerX + graphWidth / 2 + 30;
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.fillText('Range: [0, 1]', propX, centerY - 30);
  ctx.fillText('Perfect for "gates"', propX, centerY - 10);
  ctx.fillText('0 = fully closed', propX, centerY + 10);
  ctx.fillText('1 = fully open', propX, centerY + 30);
}

function drawTanh(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  alpha: number
) {
  const graphWidth = 200;
  const graphHeight = 120;
  const left = centerX - graphWidth / 2;
  const right = centerX + graphWidth / 2;
  const top = centerY - graphHeight / 2;
  const bottom = centerY + graphHeight / 2;

  // Axes
  drawAxes(ctx, left, right, top, bottom, centerX, centerY, alpha);

  // Tanh function
  ctx.strokeStyle = `rgba(180, 100, 60, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = left; px <= right; px += 2) {
    const x = (px - centerX) / (graphWidth / 6); // Scale to [-3, 3]
    const y = Math.tanh(x);
    const py = centerY - y * (graphHeight / 2);
    if (px === left) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // -1 and 1 lines
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.moveTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'right';
  ctx.fillText('+1', left - 5, top + 4);
  ctx.fillText('-1', left - 5, bottom + 4);

  // Formula
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('tanh(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)', centerX, bottom + 35);

  // Properties
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'left';
  const propX = centerX + graphWidth / 2 + 30;
  ctx.fillStyle = `rgba(180, 100, 60, ${alpha * 0.7})`;
  ctx.fillText('Range: [-1, 1]', propX, centerY - 30);
  ctx.fillText('Zero-centered', propX, centerY - 10);
  ctx.fillText('Good for cell values', propX, centerY + 10);
  ctx.fillText('Can be + or -', propX, centerY + 30);
}

function drawComparison(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha: number
) {
  const centerY = height * 0.45;

  // LSTM uses both
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('Why LSTM Uses Both', width * 0.5, height * 0.2);

  // Sigmoid for gates
  const leftX = width * 0.3;
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.9})`;
  ctx.textAlign = 'center';
  ctx.fillText('Sigmoid σ for Gates', leftX, centerY - 40);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText('Output in [0, 1]', leftX, centerY - 15);
  ctx.fillText('Acts as a "dial"', leftX, centerY + 5);
  ctx.fillText('0 = block everything', leftX, centerY + 25);
  ctx.fillText('1 = pass everything', leftX, centerY + 45);

  // Tanh for values
  const rightX = width * 0.7;
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 100, 60, ${alpha * 0.9})`;
  ctx.textAlign = 'center';
  ctx.fillText('Tanh for Values', rightX, centerY - 40);

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText('Output in [-1, 1]', rightX, centerY - 15);
  ctx.fillText('Zero-centered', rightX, centerY + 5);
  ctx.fillText('Can increase or', rightX, centerY + 25);
  ctx.fillText('decrease cell state', rightX, centerY + 45);

  // Visual: gate × value
  if (alpha > 0.5) {
    const vizY = height * 0.75;
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${(alpha - 0.5) * 2 * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText('gate (σ) × value (tanh) = controlled update', width * 0.5, vizY);
  }
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  top: number,
  bottom: number,
  centerX: number,
  centerY: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1;

  // X axis
  ctx.beginPath();
  ctx.moveTo(left, centerY);
  ctx.lineTo(right, centerY);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(centerX, top - 10);
  ctx.lineTo(centerX, bottom + 10);
  ctx.stroke();

  // Axis labels
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.textAlign = 'center';
  ctx.fillText('x', right + 10, centerY + 4);
  ctx.textAlign = 'right';
  ctx.fillText('y', centerX - 5, top - 15);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const labels = [
    '',
    'ReLU: fast, but can die',
    'Sigmoid: perfect for gates [0,1]',
    'Tanh: good for values [-1,1]',
    'LSTM uses both strategically',
  ];

  const labelText = labels[phase] || '';

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
  const colors = [
    '',
    'rgba(60, 140, 80, 0.9)',
    'rgba(100, 100, 180, 0.9)',
    'rgba(180, 100, 60, 0.9)',
    'rgba(0, 0, 0, 0.7)',
  ];
  ctx.fillStyle = colors[phase] || 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}
