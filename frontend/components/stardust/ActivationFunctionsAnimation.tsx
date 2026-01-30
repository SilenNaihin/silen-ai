'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ActivationFunctionsAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Activation Functions Animation - Why LSTMs use sigmoid for gates and tanh for values
 *
 * Phase 1 (0-0.33): Sigmoid function - outputs [0,1] - "how much to let through"
 * Phase 2 (0.33-0.66): Tanh function - outputs [-1,1] - "positive or negative values"
 * Phase 3 (0.66-1.0): Both together - gates need sigmoid, values need tanh
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
    const titles = [
      '',
      'Sigmoid: The Gate Function',
      'Tanh: The Value Function',
      'Why Different Functions?',
    ];
    ctx.fillText(titles[phase] || 'Activation Functions', width * 0.5, titleY);

    // Phase 1: Sigmoid - for gates
    if (phase === 1) {
      const phaseProgress = progress / 0.33;
      drawSigmoidPhase(ctx, width, height, phaseProgress);
    }

    // Phase 2: Tanh - for values
    if (phase === 2) {
      const phaseProgress = (progress - 0.33) / 0.33;
      drawTanhPhase(ctx, width, height, phaseProgress);
    }

    // Phase 3: Comparison - why different
    if (phase === 3) {
      const phaseProgress = (progress - 0.66) / 0.34;
      drawComparisonPhase(ctx, width, height, phaseProgress);
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

function drawSigmoidPhase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width * 0.35;
  const centerY = height * 0.45;
  const graphWidth = 180;
  const graphHeight = 100;

  // Fade in graph
  const graphAlpha = Math.min(1, progress * 2);

  // Draw sigmoid graph
  drawSigmoidGraph(ctx, centerX, centerY, graphWidth, graphHeight, graphAlpha);

  // Properties on the right
  const propX = width * 0.65;
  const propStartY = height * 0.28;
  const lineHeight = 28;

  // Animate properties appearing one by one
  const propDelay = 0.2;
  const properties = [
    { text: 'Output range: [0, 1]', color: '100, 100, 180', bold: true },
    { text: 'Perfect for "gates"', color: '0, 0, 0', bold: false },
    { text: '0 = completely closed', color: '180, 60, 60', bold: false },
    { text: '1 = completely open', color: '60, 140, 80', bold: false },
    { text: 'Controls how much flows through', color: '0, 0, 0', bold: false },
  ];

  properties.forEach((prop, i) => {
    const propProgress = Math.max(0, Math.min(1, (progress - propDelay - i * 0.12) * 3));
    if (propProgress > 0) {
      ctx.font = prop.bold ? 'bold 12px system-ui, -apple-system, sans-serif' : '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(${prop.color}, ${propProgress * 0.85})`;
      ctx.textAlign = 'left';
      ctx.fillText(prop.text, propX, propStartY + i * lineHeight);
    }
  });

  // Visual gate metaphor below
  if (progress > 0.5) {
    const gateAlpha = (progress - 0.5) * 2;
    drawGateMetaphor(ctx, width * 0.5, height * 0.78, gateAlpha);
  }
}

function drawTanhPhase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width * 0.35;
  const centerY = height * 0.45;
  const graphWidth = 180;
  const graphHeight = 100;

  // Fade in graph
  const graphAlpha = Math.min(1, progress * 2);

  // Draw tanh graph
  drawTanhGraph(ctx, centerX, centerY, graphWidth, graphHeight, graphAlpha);

  // Properties on the right
  const propX = width * 0.65;
  const propStartY = height * 0.28;
  const lineHeight = 28;

  const propDelay = 0.2;
  const properties = [
    { text: 'Output range: [-1, 1]', color: '180, 100, 60', bold: true },
    { text: 'Zero-centered', color: '0, 0, 0', bold: false },
    { text: 'Negative = decrease', color: '100, 100, 180', bold: false },
    { text: 'Positive = increase', color: '60, 140, 80', bold: false },
    { text: 'Controls value magnitude & sign', color: '0, 0, 0', bold: false },
  ];

  properties.forEach((prop, i) => {
    const propProgress = Math.max(0, Math.min(1, (progress - propDelay - i * 0.12) * 3));
    if (propProgress > 0) {
      ctx.font = prop.bold ? 'bold 12px system-ui, -apple-system, sans-serif' : '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(${prop.color}, ${propProgress * 0.85})`;
      ctx.textAlign = 'left';
      ctx.fillText(prop.text, propX, propStartY + i * lineHeight);
    }
  });

  // Visual value metaphor below
  if (progress > 0.5) {
    const valueAlpha = (progress - 0.5) * 2;
    drawValueMetaphor(ctx, width * 0.5, height * 0.78, valueAlpha);
  }
}

function drawComparisonPhase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const graphY = height * 0.4;
  const graphWidth = 140;
  const graphHeight = 80;

  // Left: Sigmoid
  const sigmoidX = width * 0.28;
  const sigmoidAlpha = Math.min(1, progress * 2);
  drawSigmoidGraph(ctx, sigmoidX, graphY, graphWidth, graphHeight, sigmoidAlpha);

  // Right: Tanh
  const tanhX = width * 0.72;
  const tanhAlpha = Math.min(1, progress * 2);
  drawTanhGraph(ctx, tanhX, graphY, graphWidth, graphHeight, tanhAlpha);

  // Labels above graphs
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(100, 100, 180, ${sigmoidAlpha * 0.9})`;
  ctx.fillText('Sigmoid (Gates)', sigmoidX, graphY - graphHeight / 2 - 20);

  ctx.fillStyle = `rgba(180, 100, 60, ${tanhAlpha * 0.9})`;
  ctx.fillText('Tanh (Values)', tanhX, graphY - graphHeight / 2 - 20);

  // Comparison explanation below
  const explainY = height * 0.68;
  if (progress > 0.3) {
    const explainAlpha = (progress - 0.3) / 0.7;

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    ctx.fillStyle = `rgba(100, 100, 180, ${explainAlpha * 0.8})`;
    ctx.fillText('"How much to let through"', sigmoidX, explainY);
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${explainAlpha * 0.6})`;
    ctx.fillText('[0, 1] = 0% to 100%', sigmoidX, explainY + 18);

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 100, 60, ${explainAlpha * 0.8})`;
    ctx.fillText('"What value to use"', tanhX, explainY);
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${explainAlpha * 0.6})`;
    ctx.fillText('[-1, 1] = add or subtract', tanhX, explainY + 18);
  }

  // Gate * Value example
  if (progress > 0.6) {
    const formulaAlpha = (progress - 0.6) / 0.4;
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.85})`;
    ctx.textAlign = 'center';
    ctx.fillText('gate(σ) × value(tanh) = controlled update', width * 0.5, height * 0.82);
  }
}

function drawSigmoidGraph(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  graphWidth: number,
  graphHeight: number,
  alpha: number
) {
  const left = centerX - graphWidth / 2;
  const right = centerX + graphWidth / 2;
  const top = centerY - graphHeight / 2;
  const bottom = centerY + graphHeight / 2;

  // Axes
  drawAxes(ctx, left, right, top, bottom, centerX, bottom, alpha); // Y axis at bottom for sigmoid

  // 0 and 1 reference lines
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
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
  ctx.fillText('1', left - 5, top + 4);
  ctx.fillText('0', left - 5, bottom + 4);

  // Sigmoid curve
  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = left; px <= right; px += 2) {
    const x = (px - centerX) / (graphWidth / 6);
    const y = 1 / (1 + Math.exp(-x));
    const py = bottom - y * graphHeight;
    if (px === left) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Formula below
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('σ(x) = 1 / (1 + e⁻ˣ)', centerX, bottom + 25);
}

function drawTanhGraph(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  graphWidth: number,
  graphHeight: number,
  alpha: number
) {
  const left = centerX - graphWidth / 2;
  const right = centerX + graphWidth / 2;
  const top = centerY - graphHeight / 2;
  const bottom = centerY + graphHeight / 2;

  // Axes - Y axis in center for tanh
  drawAxes(ctx, left, right, top, bottom, centerX, centerY, alpha);

  // -1 and +1 reference lines
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
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

  // Tanh curve
  ctx.strokeStyle = `rgba(180, 100, 60, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = left; px <= right; px += 2) {
    const x = (px - centerX) / (graphWidth / 6);
    const y = Math.tanh(x);
    const py = centerY - y * (graphHeight / 2);
    if (px === left) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Formula below
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 100, 60, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('tanh(x)', centerX, bottom + 25);
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
  ctx.moveTo(left - 5, centerY);
  ctx.lineTo(right + 5, centerY);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(centerX, top - 5);
  ctx.lineTo(centerX, bottom + 5);
  ctx.stroke();

  // Small arrowhead on X axis
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.beginPath();
  ctx.moveTo(right + 5, centerY);
  ctx.lineTo(right - 2, centerY - 3);
  ctx.lineTo(right - 2, centerY + 3);
  ctx.closePath();
  ctx.fill();
}

function drawGateMetaphor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number
) {
  // Draw a visual gate/valve metaphor
  const gateWidth = 60;
  const gateHeight = 30;

  // Closed gate (left)
  ctx.strokeStyle = `rgba(180, 60, 60, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - 80 - gateWidth / 2, y - gateHeight / 2, gateWidth, gateHeight, 4);
  ctx.stroke();

  // Filled (blocked)
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.2})`;
  ctx.fill();

  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('σ = 0', x - 80, y + gateHeight / 2 + 12);
  ctx.fillText('blocked', x - 80, y);

  // Open gate (right)
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x + 80 - gateWidth / 2, y - gateHeight / 2, gateWidth, gateHeight, 4);
  ctx.stroke();

  // Arrow through
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.moveTo(x + 80 - 20, y);
  ctx.lineTo(x + 80 + 20, y);
  ctx.stroke();
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.moveTo(x + 80 + 20, y);
  ctx.lineTo(x + 80 + 14, y - 4);
  ctx.lineTo(x + 80 + 14, y + 4);
  ctx.closePath();
  ctx.fill();

  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('σ = 1', x + 80, y + gateHeight / 2 + 12);
  ctx.fillText('flows', x + 80, y);
}

function drawValueMetaphor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number
) {
  // Draw a value scale metaphor (-1 to +1)
  const scaleWidth = 180;
  const scaleHeight = 8;

  // Scale bar
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.1})`;
  ctx.beginPath();
  ctx.roundRect(x - scaleWidth / 2, y - scaleHeight / 2, scaleWidth, scaleHeight, 4);
  ctx.fill();

  // Gradient from blue (-) to orange (+)
  const gradient = ctx.createLinearGradient(x - scaleWidth / 2, y, x + scaleWidth / 2, y);
  gradient.addColorStop(0, `rgba(100, 100, 180, ${alpha * 0.6})`);
  gradient.addColorStop(0.5, `rgba(200, 200, 200, ${alpha * 0.3})`);
  gradient.addColorStop(1, `rgba(60, 140, 80, ${alpha * 0.6})`);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Labels
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('-1', x - scaleWidth / 2, y + 18);
  ctx.fillText('decrease', x - scaleWidth / 2, y + 30);

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('0', x, y + 18);

  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.fillText('+1', x + scaleWidth / 2, y + 18);
  ctx.fillText('increase', x + scaleWidth / 2, y + 30);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const labels = [
    '',
    'Sigmoid: [0,1] range for controlling flow',
    'Tanh: [-1,1] range for positive/negative values',
    'Gates need sigmoid, values need tanh',
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
    'rgba(100, 100, 180, 0.9)',
    'rgba(180, 100, 60, 0.9)',
    'rgba(0, 0, 0, 0.7)',
  ];
  ctx.fillStyle = colors[phase] || 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}
