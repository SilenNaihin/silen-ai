'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface PerceptronAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Perceptron Animation showing a single artificial neuron processing inputs
 *
 * Phase 1 (0-0.20): Input nodes appear with values
 * Phase 2 (0.20-0.40): Weights appear on connections
 * Phase 3 (0.40-0.55): Weighted sum calculation (values flow to center)
 * Phase 4 (0.55-0.70): Bias addition
 * Phase 5 (0.70-0.85): Activation function visualization
 * Phase 6 (0.85-1.0): Output produced, comparison to biological neuron shown
 */
export function PerceptronAnimation({ progress, className = '' }: PerceptronAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const centerY = height * 0.50;
    const phaseLabelY = height * 0.94;

    const inputX = width * 0.15;
    const sumX = width * 0.45;
    const activationX = width * 0.65;
    const outputX = width * 0.85;

    // Input values (deterministic)
    const inputs = [0.7, -0.3, 0.5];
    const weights = [0.4, 0.8, -0.6];
    const bias = 0.2;

    // Calculate weighted sum
    const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], 0) + bias;
    const output = relu(weightedSum);

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Phase 1: Input nodes
    drawInputNodes(ctx, inputX, centerY, inputs, progress);

    // Phase 2+: Connections with weights
    if (progress >= 0.20) {
      const weightAlpha = Math.min(1, (progress - 0.20) / 0.10);
      drawConnections(ctx, inputX, centerY, sumX, centerY, weights, weightAlpha, progress);
    }

    // Phase 3+: Summation node
    if (progress >= 0.40) {
      const sumProgress = Math.min(1, (progress - 0.40) / 0.15);
      drawSummationNode(ctx, sumX, centerY, inputs, weights, bias, sumProgress, progress);
    }

    // Phase 4+: Bias indicator
    if (progress >= 0.55) {
      const biasAlpha = Math.min(1, (progress - 0.55) / 0.10);
      drawBiasIndicator(ctx, sumX, centerY - 50, bias, biasAlpha);
    }

    // Phase 5+: Activation function
    if (progress >= 0.70) {
      const activationProgress = Math.min(1, (progress - 0.70) / 0.15);
      drawActivationFunction(ctx, activationX, centerY, weightedSum, output, activationProgress);
    }

    // Phase 6+: Output
    if (progress >= 0.85) {
      const outputAlpha = Math.min(1, (progress - 0.85) / 0.10);
      drawOutputNode(ctx, outputX, centerY, output, outputAlpha);
    }

    // Connection from sum to activation
    if (progress >= 0.70) {
      const alpha = Math.min(1, (progress - 0.70) / 0.05);
      drawArrowConnection(ctx, sumX + 25, centerY, activationX - 30, centerY, alpha);
    }

    // Connection from activation to output
    if (progress >= 0.85) {
      const alpha = Math.min(1, (progress - 0.85) / 0.05);
      drawArrowConnection(ctx, activationX + 30, centerY, outputX - 25, centerY, alpha);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress, weightedSum, output);

    // Draw formula at bottom
    if (progress >= 0.40) {
      drawFormula(ctx, width * 0.5, height * 0.85, progress);
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

function relu(x: number): number {
  return Math.max(0, x);
}

function getPhase(progress: number): number {
  if (progress < 0.20) return 1;
  if (progress < 0.40) return 2;
  if (progress < 0.55) return 3;
  if (progress < 0.70) return 4;
  if (progress < 0.85) return 5;
  return 6;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('The Perceptron', x, y);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number,
  progress: number,
  weightedSum: number,
  output: number
) {
  let labelText = '';

  switch (phase) {
    case 1:
      labelText = 'Inputs: x\u2081, x\u2082, x\u2083';
      break;
    case 2:
      labelText = 'Weights: w\u2081, w\u2082, w\u2083';
      break;
    case 3:
      labelText = 'Weighted Sum: \u03A3(w\u1d62 \u00b7 x\u1d62)';
      break;
    case 4:
      labelText = 'Add Bias: sum + b';
      break;
    case 5:
      labelText = 'Activation: ReLU(z)';
      break;
    case 6:
      labelText = `Output: ${output.toFixed(2)}`;
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
  ctx.fillStyle = phase === 6 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawInputNodes(
  ctx: CanvasRenderingContext2D,
  x: number,
  centerY: number,
  inputs: number[],
  progress: number
) {
  const nodeSpacing = 50;
  const startY = centerY - ((inputs.length - 1) * nodeSpacing) / 2;
  const alpha = Math.min(1, progress / 0.15);

  inputs.forEach((value, i) => {
    const y = startY + i * nodeSpacing;
    const nodeDelay = i * 0.03;
    const nodeAlpha = Math.min(1, (progress - nodeDelay) / 0.10);

    if (nodeAlpha > 0) {
      // Node circle
      ctx.strokeStyle = `rgba(0, 0, 0, ${nodeAlpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Fill based on value (positive = darker)
      const fillIntensity = Math.abs(value) * 0.3;
      ctx.fillStyle = value >= 0
        ? `rgba(0, 0, 0, ${nodeAlpha * fillIntensity})`
        : `rgba(180, 60, 60, ${nodeAlpha * fillIntensity})`;
      ctx.fill();

      // Value label
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(0, 0, 0, ${nodeAlpha * 0.9})`;
      ctx.fillText(value.toFixed(1), x, y);

      // Input label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${nodeAlpha * 0.5})`;
      ctx.fillText(`x${i + 1}`, x, y + 30);
    }
  });
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromCenterY: number,
  toX: number,
  toY: number,
  weights: number[],
  alpha: number,
  progress: number
) {
  const nodeSpacing = 50;
  const startY = fromCenterY - ((weights.length - 1) * nodeSpacing) / 2;

  weights.forEach((weight, i) => {
    const fromY = startY + i * nodeSpacing;

    // Line thickness based on weight magnitude
    const thickness = 1 + Math.abs(weight) * 2;

    // Color based on sign
    const color = weight >= 0 ? '0, 0, 0' : '180, 60, 60';

    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.5})`;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX + 20, fromY);
    ctx.lineTo(toX - 25, toY);
    ctx.stroke();

    // Weight label on connection
    const labelX = (fromX + toX) / 2;
    const labelY = (fromY + toY) / 2 - 8;

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(${color}, ${alpha * 0.7})`;
    ctx.fillText(`w${i + 1}=${weight.toFixed(1)}`, labelX, labelY - i * 3);

    // Animated pulse along connection during weighted sum phase
    if (progress >= 0.40 && progress < 0.55) {
      const pulseProgress = ((progress - 0.40) / 0.15 + i * 0.2) % 1;
      const pulseX = fromX + 20 + (toX - 25 - fromX - 20) * pulseProgress;
      const pulseY = fromY + (toY - fromY) * pulseProgress;

      ctx.fillStyle = `rgba(60, 140, 80, ${(1 - pulseProgress) * 0.8})`;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawSummationNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  inputs: number[],
  weights: number[],
  bias: number,
  sumProgress: number,
  totalProgress: number
) {
  const alpha = sumProgress;

  // Node circle (larger for summation)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.stroke();

  // Light fill
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.05})`;
  ctx.fill();

  // Sigma symbol
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
  ctx.fillText('\u03A3', x, y);

  // Show running sum when in phase 3
  if (totalProgress >= 0.40 && totalProgress < 0.70) {
    const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], 0);
    const displaySum = totalProgress >= 0.55 ? weightedSum + bias : weightedSum;

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.fillText(`= ${displaySum.toFixed(2)}`, x, y + 38);
  }
}

function drawBiasIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bias: number,
  alpha: number
) {
  // Bias node (smaller, coming from above)
  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.8})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y - 20, 15, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.1})`;
  ctx.fill();

  // Bias value
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.9})`;
  ctx.fillText(`+${bias}`, x, y - 20);

  // Label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.6})`;
  ctx.fillText('bias', x, y - 40);

  // Connection line
  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.5})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x, y + 25);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawActivationFunction(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  input: number,
  output: number,
  progress: number
) {
  const alpha = progress;
  const boxWidth = 50;
  const boxHeight = 60;

  // Activation function box
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 6);
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.03})`;
  ctx.fill();

  // ReLU visualization inside box
  const reluWidth = 30;
  const reluHeight = 30;
  const reluX = x - reluWidth / 2;
  const reluY = y - reluHeight / 2;

  // Draw ReLU graph
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Flat part (negative inputs -> 0)
  ctx.beginPath();
  ctx.moveTo(reluX, reluY + reluHeight / 2);
  ctx.lineTo(reluX + reluWidth / 2, reluY + reluHeight / 2);
  // Diagonal part (positive inputs -> linear)
  ctx.lineTo(reluX + reluWidth, reluY);
  ctx.stroke();

  // Label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.fillText('ReLU', x, y + boxHeight / 2 + 10);

  // Show input -> output transformation
  if (progress > 0.5) {
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
    ctx.textAlign = 'right';
    ctx.fillText(`${input.toFixed(2)}`, x - boxWidth / 2 - 5, y);

    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
    ctx.fillText(`${output.toFixed(2)}`, x + boxWidth / 2 + 5, y);
  }
}

function drawOutputNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  output: number,
  alpha: number
) {
  // Output node with emphasis
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.stroke();

  // Fill
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.15})`;
  ctx.fill();

  // Output value
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha})`;
  ctx.fillText(output.toFixed(2), x, y);

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('output', x, y + 35);
}

function drawArrowConnection(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - 6, toY);
  ctx.stroke();

  // Arrowhead
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize, toY - arrowSize / 2);
  ctx.lineTo(toX - arrowSize, toY + arrowSize / 2);
  ctx.closePath();
  ctx.fill();
}

function drawFormula(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) {
  const alpha = Math.min(1, (progress - 0.40) / 0.1) * 0.6;

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillText('y = \u03C3(w \u00b7 x + b)', x, y);
}
