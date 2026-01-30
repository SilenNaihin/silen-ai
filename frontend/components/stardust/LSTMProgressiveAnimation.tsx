'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface LSTMProgressiveAnimationProps {
  progress: number;
  className?: string;
}

/**
 * LSTM Progressive Build-up Animation
 *
 * Progressively builds the LSTM architecture as user scrolls through content.
 * Aligned with article milestones:
 *
 * Phase 1 (0.0-0.15): Introduction - show the cell state "conveyor belt" concept
 * Phase 2 (0.15-0.30): lstm-impl - cell state line established
 * Phase 3 (0.30-0.45): forget-gate - add forget gate
 * Phase 4 (0.45-0.60): input-gate - add input gate
 * Phase 5 (0.60-0.80): output-gate - add output gate
 * Phase 6 (0.80-1.0): visualize-gates - complete LSTM with all components
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
    const centerY = height * 0.5;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    const phase = getPhase(progress);

    // Draw title based on current phase
    const title = getTitleForPhase(phase);
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(title, centerX, titleY);

    // Draw LSTM cell progressively
    drawLSTMCell(ctx, centerX, centerY, width, height, progress, phase);

    // Draw phase label
    drawPhaseLabel(ctx, centerX, phaseLabelY, phase, progress);
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  // Aligned with milestones:
  // 0.15: lstm-impl, 0.30: forget-gate, 0.45: input-gate, 0.60: output-gate, 0.80: visualize-gates
  if (progress < 0.15) return 1;  // Introduction - cell state concept
  if (progress < 0.30) return 2;  // Cell state established
  if (progress < 0.45) return 3;  // Forget gate
  if (progress < 0.60) return 4;  // Input gate
  if (progress < 0.80) return 5;  // Output gate
  return 6;                        // Complete LSTM
}

function getTitleForPhase(phase: number): string {
  switch (phase) {
    case 1:
      return 'The Cell State: A Conveyor Belt';
    case 2:
      return 'Cell State: Information Highway';
    case 3:
      return 'Adding the Forget Gate';
    case 4:
      return 'Adding the Input Gate';
    case 5:
      return 'Adding the Output Gate';
    case 6:
      return 'The Complete LSTM Cell';
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
  const cellWidth = Math.min(280, width * 0.7);
  const cellHeight = 160;
  const left = centerX - cellWidth / 2;
  const right = centerX + cellWidth / 2;
  const top = centerY - cellHeight / 2;
  const bottom = centerY + cellHeight / 2;

  // Cell state line Y position (the "conveyor belt")
  const cellStateY = top + 30;
  // Hidden state Y position
  const hiddenY = bottom - 35;

  // Phase 1: Introduce the cell state concept (conveyor belt)
  if (phase === 1) {
    const introAlpha = Math.min(1, progress / 0.10);
    drawCellStateConcept(ctx, centerX, centerY, width, height, introAlpha, progress);
    return;
  }

  // Phase 2+: Draw cell outline
  const outlineAlpha = smoothStep(progress, 0.15, 0.20);
  if (outlineAlpha > 0) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${outlineAlpha * 0.25})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.roundRect(left - 15, top - 15, cellWidth + 30, cellHeight + 30, 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Cell state line (always visible from phase 2+)
  const cellStateAlpha = smoothStep(progress, 0.15, 0.22);
  if (cellStateAlpha > 0) {
    drawCellStateLine(ctx, left - 25, right + 25, cellStateY, cellStateAlpha, phase === 6);
  }

  // Hidden state line
  const hiddenAlpha = smoothStep(progress, 0.18, 0.25);
  if (hiddenAlpha > 0) {
    drawHiddenStateLine(ctx, left - 25, right + 25, hiddenY, hiddenAlpha);
  }

  // Input arrow (x_t)
  const inputAlpha = smoothStep(progress, 0.20, 0.28);
  if (inputAlpha > 0) {
    drawInputArrow(ctx, centerX, bottom, inputAlpha);
  }

  // Forget gate (phase 3+)
  const forgetAlpha = smoothStep(progress, 0.30, 0.40);
  if (forgetAlpha > 0) {
    const forgetX = left + cellWidth * 0.2;
    const isHighlighted = phase === 3;

    // Forget gate
    drawGate(ctx, forgetX, cellStateY + 45, 'f', 'Forget', forgetAlpha, isHighlighted);

    // Connection from gate to cell state (multiply operation)
    drawGateConnection(ctx, forgetX, cellStateY + 45 - 14, forgetX, cellStateY + 12, forgetAlpha);
    drawPointwiseOp(ctx, forgetX, cellStateY + 12, '\u00D7', forgetAlpha, isHighlighted);

    // Connection from hidden state to forget gate
    drawGateConnection(ctx, forgetX, hiddenY - 10, forgetX, cellStateY + 45 + 14, forgetAlpha * 0.6);
  }

  // Input gate (phase 4+)
  const inputGateAlpha = smoothStep(progress, 0.45, 0.55);
  if (inputGateAlpha > 0) {
    const inputX = centerX - 20;
    const candidateX = centerX + 20;
    const isHighlighted = phase === 4;

    // Input gate (i) and candidate gate (g)
    drawGate(ctx, inputX, cellStateY + 55, 'i', 'Input', inputGateAlpha, isHighlighted);
    drawGate(ctx, candidateX, cellStateY + 55, 'g', 'Candidate', inputGateAlpha, isHighlighted, true);

    // Multiply i and g
    const mulX = centerX;
    const mulY = cellStateY + 35;
    drawPointwiseOp(ctx, mulX, mulY, '\u00D7', inputGateAlpha, isHighlighted);

    // Add to cell state
    const addX = centerX;
    drawPointwiseOp(ctx, addX, cellStateY + 12, '+', inputGateAlpha, isHighlighted);

    // Connections
    drawGateConnection(ctx, inputX, cellStateY + 55 - 14, mulX - 8, mulY + 8, inputGateAlpha * 0.6);
    drawGateConnection(ctx, candidateX, cellStateY + 55 - 14, mulX + 8, mulY + 8, inputGateAlpha * 0.6);
    drawGateConnection(ctx, mulX, mulY - 9, addX, cellStateY + 21, inputGateAlpha * 0.6);
  }

  // Output gate (phase 5+)
  const outputAlpha = smoothStep(progress, 0.60, 0.70);
  if (outputAlpha > 0) {
    const outputX = right - cellWidth * 0.2;
    const isHighlighted = phase === 5;

    // Output gate
    drawGate(ctx, outputX, cellStateY + 45, 'o', 'Output', outputAlpha, isHighlighted);

    // Tanh on cell state
    const tanhY = hiddenY - 20;
    drawActivation(ctx, outputX - 35, tanhY, 'tanh', outputAlpha);

    // Multiply with tanh output
    drawPointwiseOp(ctx, outputX, hiddenY, '\u00D7', outputAlpha, isHighlighted);

    // Connections
    drawGateConnection(ctx, outputX, cellStateY + 45 + 14, outputX, hiddenY - 9, outputAlpha * 0.6);
    drawGateConnection(ctx, outputX - 35, tanhY + 10, outputX - 9, hiddenY, outputAlpha * 0.6);

    // Cell state to tanh
    ctx.strokeStyle = `rgba(100, 100, 180, ${outputAlpha * 0.4})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(outputX - 35, cellStateY);
    ctx.lineTo(outputX - 35, tanhY - 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Phase 6: Complete LSTM - show gradient flow animation
  if (phase === 6) {
    const gradientProgress = smoothStep(progress, 0.80, 0.95);
    if (gradientProgress > 0) {
      drawGradientFlow(ctx, left - 25, right + 25, cellStateY, gradientProgress);
    }
  }
}

function drawCellStateConcept(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  alpha: number,
  progress: number
) {
  // Draw a simple conveyor belt concept
  const beltWidth = Math.min(300, width * 0.75);
  const beltLeft = centerX - beltWidth / 2;
  const beltRight = centerX + beltWidth / 2;
  const beltY = centerY - 10;

  // The belt line
  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.7})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(beltLeft, beltY);
  ctx.lineTo(beltRight, beltY);
  ctx.stroke();

  // Arrows showing flow
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.7})`;
  drawArrowhead(ctx, beltRight - 5, beltY, 0);

  // Moving "information packets" on the belt
  const time = progress * 10;
  const packetSpacing = 60;
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.3})`;

  for (let i = 0; i < 6; i++) {
    const baseX = beltLeft + (i * packetSpacing);
    const animOffset = (time * 30) % packetSpacing;
    const x = baseX + animOffset;

    if (x > beltLeft && x < beltRight - 10) {
      ctx.beginPath();
      ctx.roundRect(x - 15, beltY - 8, 30, 16, 4);
      ctx.fill();
    }
  }

  // Labels
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'left';
  ctx.fillText('C\u209C\u208B\u2081', beltLeft - 30, beltY + 4);
  ctx.textAlign = 'right';
  ctx.fillText('C\u209C', beltRight + 25, beltY + 4);

  // Explanation text
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.textAlign = 'center';
  ctx.fillText('Information flows straight through', centerX, beltY + 50);

  if (progress > 0.08) {
    const subAlpha = smoothStep(progress, 0.08, 0.12);
    ctx.fillStyle = `rgba(60, 140, 80, ${subAlpha * 0.8})`;
    ctx.fillText('Only minor modifications along the way', centerX, beltY + 70);
  }
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
  const color = showGradient ? '60, 140, 80' : '100, 100, 180';
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.7})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  // Arrow
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.7})`;
  drawArrowhead(ctx, right - 5, y, 0);

  // Labels
  if (!showGradient) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(${color}, ${alpha * 0.8})`;
    ctx.textAlign = 'left';
    ctx.fillText('C\u209C\u208B\u2081', left - 8, y - 12);
    ctx.textAlign = 'right';
    ctx.fillText('C\u209C', right + 8, y - 12);
  }
}

function drawHiddenStateLine(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  y: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
  drawArrowhead(ctx, right - 5, y, 0);

  // Labels
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'left';
  ctx.fillText('h\u209C\u208B\u2081', left - 8, y - 10);
  ctx.textAlign = 'right';
  ctx.fillText('h\u209C', right + 8, y - 10);
}

function drawInputArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottom: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, bottom + 35);
  ctx.lineTo(x, bottom + 8);
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.45})`;
  drawArrowhead(ctx, x, bottom + 8, -Math.PI / 2);

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('x\u209C', x, bottom + 48);
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
      ? '160, 100, 80'
      : '80, 80, 80';

  // Gate box
  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.9})`;
  ctx.lineWidth = highlight ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(x - size / 2, y - size / 2, size, size, 5);
  ctx.stroke();

  // Fill
  ctx.fillStyle = `rgba(${color}, ${alpha * (highlight ? 0.15 : 0.08)})`;
  ctx.fill();

  // Symbol (sigma for gates, tanh for candidate)
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.95})`;
  ctx.fillText(isCandidate ? 'tanh' : '\u03C3', x, y);

  // Label below (only when highlighted)
  if (highlight) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(${color}, ${alpha * 0.85})`;
    ctx.fillText(label, x, y + size / 2 + 12);
  }
}

function drawGateConnection(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

function drawPointwiseOp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  op: string,
  alpha: number,
  highlight: boolean = false
) {
  const size = 18;
  const color = highlight ? '60, 140, 80' : '0, 0, 0';

  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.7})`;
  ctx.lineWidth = highlight ? 2 : 1.5;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(${color}, ${alpha * 0.08})`;
  ctx.fill();

  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.85})`;
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

  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.65})`;
  ctx.fillText(name, x, y);
}

function drawGradientFlow(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  cellStateY: number,
  progress: number
) {
  // Animated gradient pulse flowing through cell state
  const pulseX = right - (right - left) * progress;

  // Gradient glow
  const gradient = ctx.createRadialGradient(pulseX, cellStateY, 0, pulseX, cellStateY, 35);
  gradient.addColorStop(0, 'rgba(60, 140, 80, 0.7)');
  gradient.addColorStop(0.5, 'rgba(60, 140, 80, 0.3)');
  gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(pulseX, cellStateY, 35, 0, Math.PI * 2);
  ctx.fill();

  // Trail behind the pulse
  ctx.strokeStyle = 'rgba(60, 140, 80, 0.4)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(right, cellStateY);
  ctx.lineTo(pulseX + 10, cellStateY);
  ctx.stroke();

  // Label
  if (progress > 0.3) {
    const labelAlpha = smoothStep(progress, 0.3, 0.5);
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(60, 140, 80, ${labelAlpha * 0.9})`;
    ctx.textAlign = 'center';
    ctx.fillText('Gradients flow unimpeded!', (left + right) / 2, cellStateY - 45);
  }
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
  phase: number,
  progress: number
) {
  const labels: Record<number, string> = {
    1: 'Cell state: direct path for information',
    2: 'The information highway is established',
    3: 'Forget gate: what to discard',
    4: 'Input gate: what to add',
    5: 'Output gate: what to output',
    6: 'Complete LSTM: gradients flow through!',
  };

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

  // Color based on phase
  let color = 'rgba(0, 0, 0, 0.7)';
  if (phase >= 3 && phase <= 5) {
    color = 'rgba(60, 140, 80, 0.9)';
  } else if (phase === 6) {
    color = 'rgba(60, 140, 80, 0.95)';
  }

  ctx.fillStyle = color;
  ctx.fillText(labelText, x, y);
}

/**
 * Smooth step function for transitions
 * Returns 0 when progress < start, 1 when progress > end, smooth interpolation between
 */
function smoothStep(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return t * t * (3 - 2 * t); // Smooth Hermite interpolation
}
