'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface TrainingLoopAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Training Loop Animation showing the neural network training cycle
 *
 * Phase 1 (0-0.15): Data/input appearing
 * Phase 2 (0.15-0.35): Forward pass - data flows through network, activations light up left to right
 * Phase 3 (0.35-0.50): Output appears, compared to target (prediction vs actual)
 * Phase 4 (0.50-0.65): Loss/error calculation - show the difference
 * Phase 5 (0.65-0.80): Backward pass - error signal flows backward (red/orange)
 * Phase 6 (0.80-1.0): Weight update - connections pulse/change, show improvement
 */
export function TrainingLoopAnimation({ progress, className = '' }: TrainingLoopAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const networkY = height * 0.45;
    const phaseLabelY = height * 0.92;

    // Network layout
    const layers = [3, 4, 4, 2]; // Input, hidden1, hidden2, output
    const layerXPositions = [
      width * 0.15,
      width * 0.35,
      width * 0.55,
      width * 0.75,
    ];

    // Generate neuron positions
    const neurons = generateNeuronPositions(layers, layerXPositions, networkY, height * 0.5);

    // Generate connections
    const connections = generateConnections(neurons, layers);

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Draw cycle indicator
    drawCycleIndicator(ctx, width * 0.90, height * 0.15, progress, phase);

    // Phase 1: Input data appearing
    if (progress >= 0) {
      const inputAlpha = Math.min(1, progress / 0.10);
      drawInputData(ctx, width * 0.05, networkY, inputAlpha, progress);
    }

    // Draw network structure (always visible after phase 1)
    if (progress >= 0.05) {
      const networkAlpha = Math.min(1, (progress - 0.05) / 0.10);
      drawNetwork(ctx, neurons, connections, networkAlpha, progress, phase);
    }

    // Phase 2: Forward pass activation
    if (progress >= 0.15 && progress < 0.50) {
      const forwardProgress = (progress - 0.15) / 0.20;
      drawForwardPass(ctx, neurons, connections, layers, forwardProgress);
    }

    // Phase 3: Output and target comparison
    if (progress >= 0.35) {
      const outputAlpha = Math.min(1, (progress - 0.35) / 0.10);
      drawOutputComparison(ctx, width * 0.85, networkY, outputAlpha, progress);
    }

    // Phase 4: Loss calculation
    if (progress >= 0.50) {
      const lossAlpha = Math.min(1, (progress - 0.50) / 0.10);
      drawLossCalculation(ctx, width * 0.85, networkY + 60, lossAlpha, progress);
    }

    // Phase 5: Backward pass
    if (progress >= 0.65 && progress < 0.85) {
      const backwardProgress = (progress - 0.65) / 0.15;
      drawBackwardPass(ctx, neurons, connections, layers, backwardProgress);
    }

    // Phase 6: Weight update
    if (progress >= 0.80) {
      const updateProgress = (progress - 0.80) / 0.20;
      drawWeightUpdate(ctx, connections, neurons, updateProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);

    // Draw training loop arrows
    drawTrainingLoopFlow(ctx, width, height, progress, phase);
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

interface Neuron {
  x: number;
  y: number;
  layer: number;
  index: number;
}

interface Connection {
  from: Neuron;
  to: Neuron;
  weight: number;
}

function generateNeuronPositions(
  layers: number[],
  xPositions: number[],
  centerY: number,
  maxHeight: number
): Neuron[] {
  const neurons: Neuron[] = [];
  const spacing = 35;

  layers.forEach((count, layerIdx) => {
    const startY = centerY - ((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      neurons.push({
        x: xPositions[layerIdx],
        y: startY + i * spacing,
        layer: layerIdx,
        index: i,
      });
    }
  });

  return neurons;
}

function generateConnections(neurons: Neuron[], layers: number[]): Connection[] {
  const connections: Connection[] = [];
  let currentIdx = 0;

  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayerNeurons = neurons.filter(n => n.layer === l);
    const nextLayerNeurons = neurons.filter(n => n.layer === l + 1);

    currentLayerNeurons.forEach(from => {
      nextLayerNeurons.forEach(to => {
        // Deterministic pseudo-random weight
        const seed = from.index * 7 + to.index * 13 + l * 23;
        const weight = 0.3 + (Math.sin(seed) * 0.5 + 0.5) * 0.7;
        connections.push({ from, to, weight });
      });
    });
  }

  return connections;
}

function getPhase(progress: number): number {
  if (progress < 0.15) return 1;
  if (progress < 0.35) return 2;
  if (progress < 0.50) return 3;
  if (progress < 0.65) return 4;
  if (progress < 0.80) return 5;
  return 6;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('The Training Loop', x, y);
}

function drawCycleIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  phase: number
) {
  const radius = 20;
  const steps = ['F', 'L', 'B', 'U'];
  const stepLabels = ['Forward', 'Loss', 'Backward', 'Update'];

  // Draw circular path
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw step indicators
  steps.forEach((step, i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const stepX = x + Math.cos(angle) * radius;
    const stepY = y + Math.sin(angle) * radius;

    // Determine if this step is active
    let isActive = false;
    if (i === 0 && (phase === 1 || phase === 2)) isActive = true;
    if (i === 1 && (phase === 3 || phase === 4)) isActive = true;
    if (i === 2 && phase === 5) isActive = true;
    if (i === 3 && phase === 6) isActive = true;

    ctx.beginPath();
    ctx.arc(stepX, stepY, 6, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    ctx.font = 'bold 7px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(step, stepX, stepY);
  });

  // Draw rotating arrow
  const arrowAngle = progress * Math.PI * 2 - Math.PI / 2;
  const arrowX = x + Math.cos(arrowAngle) * (radius - 10);
  const arrowY = y + Math.sin(arrowAngle) * (radius - 10);

  ctx.fillStyle = 'rgba(60, 140, 80, 0.8)';
  ctx.beginPath();
  ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawInputData(
  ctx: CanvasRenderingContext2D,
  x: number,
  centerY: number,
  alpha: number,
  progress: number
) {
  const data = ['0.7', '0.3', '0.9'];
  const spacing = 35;
  const startY = centerY - ((data.length - 1) * spacing) / 2;

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('input', x + 15, startY - 25);

  data.forEach((val, i) => {
    const y = startY + i * spacing;
    const delay = i * 0.02;
    const itemAlpha = Math.min(1, (progress - delay) / 0.08) * alpha;

    if (itemAlpha > 0) {
      // Data box
      ctx.strokeStyle = `rgba(0, 0, 0, ${itemAlpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y - 10, 30, 20, 3);
      ctx.stroke();

      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.05})`;
      ctx.fill();

      // Value
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.8})`;
      ctx.fillText(val, x + 15, y);
    }
  });
}

function drawNetwork(
  ctx: CanvasRenderingContext2D,
  neurons: Neuron[],
  connections: Connection[],
  alpha: number,
  progress: number,
  phase: number
) {
  // Draw connections first (underneath neurons)
  connections.forEach(conn => {
    const thickness = 0.5 + conn.weight * 1.5;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2 * conn.weight})`;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(conn.from.x, conn.from.y);
    ctx.lineTo(conn.to.x, conn.to.y);
    ctx.stroke();
  });

  // Draw neurons
  neurons.forEach(neuron => {
    const isInputLayer = neuron.layer === 0;
    const isOutputLayer = neuron.layer === 3;

    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, isOutputLayer ? 14 : 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
  });

  // Layer labels
  const layerLabels = ['Input', 'Hidden', 'Hidden', 'Output'];
  const layerXs = [neurons[0].x, neurons[3].x, neurons[7].x, neurons[11].x];

  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;

  layerXs.forEach((x, i) => {
    if (i !== 1 && i !== 2) {
      ctx.fillText(layerLabels[i], x, neurons[0].y - 35);
    }
  });
}

function drawForwardPass(
  ctx: CanvasRenderingContext2D,
  neurons: Neuron[],
  connections: Connection[],
  layers: number[],
  progress: number
) {
  // Activations flowing left to right
  const totalLayers = layers.length;

  // Determine which layer is currently being activated
  const layerProgress = progress * (totalLayers + 1);

  neurons.forEach(neuron => {
    const layerActivationTime = neuron.layer;
    const activationStrength = Math.max(0, Math.min(1, layerProgress - layerActivationTime));

    if (activationStrength > 0) {
      // Glowing activation
      const glowRadius = 12 + activationStrength * 6;
      const gradient = ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, glowRadius
      );
      gradient.addColorStop(0, `rgba(60, 140, 80, ${activationStrength * 0.6})`);
      gradient.addColorStop(0.5, `rgba(60, 140, 80, ${activationStrength * 0.3})`);
      gradient.addColorStop(1, 'rgba(60, 140, 80, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Filled neuron
      ctx.fillStyle = `rgba(60, 140, 80, ${activationStrength * 0.4})`;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Animated pulses along connections
  connections.forEach((conn, idx) => {
    const connLayerProgress = layerProgress - conn.from.layer;

    if (connLayerProgress > 0 && connLayerProgress < 1.5) {
      const pulsePos = Math.min(1, connLayerProgress);
      const pulseX = conn.from.x + (conn.to.x - conn.from.x) * pulsePos;
      const pulseY = conn.from.y + (conn.to.y - conn.from.y) * pulsePos;

      ctx.fillStyle = `rgba(60, 140, 80, ${(1 - pulsePos * 0.7) * 0.8})`;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawOutputComparison(
  ctx: CanvasRenderingContext2D,
  x: number,
  centerY: number,
  alpha: number,
  progress: number
) {
  const predY = centerY - 20;
  const targetY = centerY + 20;

  // Prediction
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('pred:', x, predY - 5);

  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.fillText('0.65', x, predY + 10);

  // Target
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('target:', x, targetY - 5);

  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.fillText('1.00', x, targetY + 10);

  // Comparison arrow
  if (progress >= 0.40) {
    const arrowAlpha = Math.min(1, (progress - 0.40) / 0.05) * alpha;
    ctx.strokeStyle = `rgba(180, 60, 60, ${arrowAlpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(x + 25, predY + 15);
    ctx.lineTo(x + 25, targetY - 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawLossCalculation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  progress: number
) {
  // Loss box
  ctx.strokeStyle = `rgba(180, 60, 60, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - 5, y - 15, 50, 30, 4);
  ctx.stroke();

  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.08})`;
  ctx.fill();

  // Loss label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.6})`;
  ctx.fillText('loss', x + 20, y - 22);

  // Loss value (animated to show error)
  const lossValue = 0.35;
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.9})`;
  ctx.fillText(lossValue.toFixed(2), x + 20, y);

  // Pulsing effect for error emphasis
  if (progress >= 0.55 && progress < 0.65) {
    const pulsePhase = ((progress - 0.55) / 0.10) * Math.PI * 4;
    const pulseAlpha = Math.sin(pulsePhase) * 0.3 + 0.3;

    ctx.strokeStyle = `rgba(180, 60, 60, ${pulseAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 18, 56, 36, 6);
    ctx.stroke();
  }
}

function drawBackwardPass(
  ctx: CanvasRenderingContext2D,
  neurons: Neuron[],
  connections: Connection[],
  layers: number[],
  progress: number
) {
  const totalLayers = layers.length;

  // Error gradient flowing right to left
  const layerProgress = progress * (totalLayers + 1);

  // Reverse order - start from output
  neurons.forEach(neuron => {
    const reverseLayer = totalLayers - 1 - neuron.layer;
    const activationStrength = Math.max(0, Math.min(1, layerProgress - reverseLayer));

    if (activationStrength > 0) {
      // Red/orange gradient for error signal
      const glowRadius = 12 + activationStrength * 5;
      const gradient = ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, glowRadius
      );
      gradient.addColorStop(0, `rgba(200, 80, 60, ${activationStrength * 0.5})`);
      gradient.addColorStop(0.5, `rgba(200, 80, 60, ${activationStrength * 0.25})`);
      gradient.addColorStop(1, 'rgba(200, 80, 60, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Error signal pulses flowing backward
  connections.forEach((conn, idx) => {
    const reverseFromLayer = totalLayers - 1 - conn.to.layer;
    const connLayerProgress = layerProgress - reverseFromLayer;

    if (connLayerProgress > 0 && connLayerProgress < 1.5) {
      const pulsePos = Math.min(1, connLayerProgress);
      // Reverse direction - from to back to from
      const pulseX = conn.to.x + (conn.from.x - conn.to.x) * pulsePos;
      const pulseY = conn.to.y + (conn.from.y - conn.to.y) * pulsePos;

      ctx.fillStyle = `rgba(200, 80, 60, ${(1 - pulsePos * 0.7) * 0.8})`;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawWeightUpdate(
  ctx: CanvasRenderingContext2D,
  connections: Connection[],
  neurons: Neuron[],
  progress: number
) {
  // Connections pulsing/thickening to show weight updates
  connections.forEach((conn, idx) => {
    const updateDelay = (idx % 5) * 0.1;
    const updateProgress = Math.max(0, (progress - updateDelay) / 0.5);

    if (updateProgress > 0) {
      const pulsePhase = updateProgress * Math.PI * 2;
      const thickness = 1 + conn.weight * 2 + Math.sin(pulsePhase) * 1.5;
      const greenIntensity = Math.min(1, updateProgress);

      // Draw updated connection with green tint
      ctx.strokeStyle = `rgba(60, 140, 80, ${0.3 + greenIntensity * 0.4})`;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      ctx.stroke();
    }
  });

  // Show improvement indicator
  if (progress > 0.5) {
    const alpha = Math.min(1, (progress - 0.5) / 0.3);

    // Find center of network
    const centerX = neurons.reduce((sum, n) => sum + n.x, 0) / neurons.length;
    const minY = Math.min(...neurons.map(n => n.y));

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
    ctx.fillText('weights updated', centerX, minY - 50);

    // Checkmark
    ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX - 8, minY - 65);
    ctx.lineTo(centerX - 3, minY - 60);
    ctx.lineTo(centerX + 8, minY - 72);
    ctx.stroke();
  }
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const phaseLabels = [
    'Input Data',
    'Forward Pass',
    'Compare Output',
    'Calculate Loss',
    'Backward Pass',
    'Update Weights',
  ];

  const phaseColors = [
    'rgba(0, 0, 0, 0.7)',
    'rgba(60, 140, 80, 0.8)',
    'rgba(0, 0, 0, 0.7)',
    'rgba(180, 60, 60, 0.8)',
    'rgba(200, 80, 60, 0.8)',
    'rgba(60, 140, 80, 0.8)',
  ];

  const labelText = phaseLabels[phase - 1];
  const labelColor = phaseColors[phase - 1];

  // Background pill
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 14;
  const pillHeight = 24;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - pillPadding, y - pillHeight / 2, textWidth + pillPadding * 2, pillHeight, 12);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = labelColor;
  ctx.fillText(labelText, x, y);
}

function drawTrainingLoopFlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  phase: number
) {
  // Draw subtle flow indicators showing the loop concept
  const flowY = height * 0.78;

  const steps = [
    { label: 'Forward', x: width * 0.20, active: phase === 1 || phase === 2 },
    { label: 'Loss', x: width * 0.40, active: phase === 3 || phase === 4 },
    { label: 'Backward', x: width * 0.60, active: phase === 5 },
    { label: 'Update', x: width * 0.80, active: phase === 6 },
  ];

  // Draw connecting arrows
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1;

  for (let i = 0; i < steps.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(steps[i].x + 25, flowY);
    ctx.lineTo(steps[i + 1].x - 25, flowY);
    ctx.stroke();

    // Arrowhead
    const arrowX = steps[i + 1].x - 25;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.moveTo(arrowX, flowY);
    ctx.lineTo(arrowX - 5, flowY - 3);
    ctx.lineTo(arrowX - 5, flowY + 3);
    ctx.closePath();
    ctx.fill();
  }

  // Curved arrow from Update back to Forward (loop indicator)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(steps[3].x + 15, flowY - 8);
  ctx.quadraticCurveTo(width * 0.5, flowY - 30, steps[0].x - 15, flowY - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw step labels
  steps.forEach(step => {
    ctx.font = step.active ? 'bold 9px system-ui, -apple-system, sans-serif' : '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = step.active ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(step.label, step.x, flowY + 12);

    // Step indicator dot
    ctx.beginPath();
    ctx.arc(step.x, flowY, step.active ? 5 : 4, 0, Math.PI * 2);
    ctx.fillStyle = step.active ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
  });
}
