'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ShapeRecognitionAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Shape Recognition Animation demonstrating how the brain learns
 *
 * Phase 1 (0-0.15): Shape appears (circle) - "Input: Circle"
 * Phase 2 (0.15-0.30): Light rays/sensing from shape to eye - "Sensing..."
 * Phase 3 (0.30-0.50): Brain processes the input - "Processing..."
 * Phase 4 (0.50-0.65): Wrong prediction ("Square" with X) - "Prediction: Square"
 * Phase 5 (0.65-0.80): Error signal & learning - "Error Signal -> Learning"
 * Phase 6 (0.80-0.90): Second attempt, correct prediction - "Prediction: Circle"
 * Phase 7 (0.90-1.0): Reinforcement, brain connections strengthen - "Prediction: Circle"
 */
export function ShapeRecognitionAnimation({ progress, className = '' }: ShapeRecognitionAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants - adjusted for title space at top
    const titleY = height * 0.08;
    const mainAreaTop = height * 0.18;
    const mainAreaHeight = height * 0.65;
    const mainAreaCenterY = mainAreaTop + mainAreaHeight * 0.5;

    const shapeX = width * 0.12;
    const shapeY = mainAreaCenterY;
    const shapeRadius = Math.min(width, height) * 0.10; // Larger circle

    const eyeX = width * 0.30;
    const eyeY = mainAreaCenterY;

    const networkCenterX = width * 0.54;
    const networkCenterY = mainAreaCenterY;

    const predictionX = width * 0.82;
    const predictionY = mainAreaCenterY;

    // Phase label area at bottom
    const phaseLabelY = height * 0.92;

    // Determine current phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Draw phase label at bottom
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress);

    // Draw components based on phase
    if (progress >= 0) {
      drawShape(ctx, shapeX, shapeY, shapeRadius, progress);
      // Label under shape
      if (progress >= 0.05) {
        drawComponentLabel(ctx, shapeX, shapeY + shapeRadius + 18, 'Input', progress, 0.05);
      }
    }

    // Draw data flow arrow: shape to eye
    if (progress >= 0.15) {
      drawSensingRays(ctx, shapeX, shapeY, eyeX, eyeY, shapeRadius, progress);
      drawEye(ctx, eyeX, eyeY, shapeRadius * 0.5, progress);
      drawFlowArrow(ctx, shapeX + shapeRadius + 8, shapeY, eyeX - shapeRadius * 0.5 - 8, eyeY, progress, 0.15);
      // Label under eye
      drawComponentLabel(ctx, eyeX, eyeY + shapeRadius * 0.5 + 18, 'Sensor', progress, 0.15);
    }

    // Draw data flow arrow: eye to brain
    if (progress >= 0.30) {
      const brainPhase = phase >= 5 ? 'backprop' : phase >= 7 ? 'reinforce' : 'forward';
      const isSecondAttempt = progress >= 0.80;
      drawBrain(ctx, networkCenterX, networkCenterY, width, height, progress, brainPhase, isSecondAttempt);
      drawFlowArrow(ctx, eyeX + shapeRadius * 0.5 + 8, eyeY, networkCenterX - width * 0.10, networkCenterY, progress, 0.30);
      // Label under brain
      drawComponentLabel(ctx, networkCenterX, networkCenterY + mainAreaHeight * 0.32, 'Brain', progress, 0.30);
    }

    // Draw data flow arrow: network to prediction
    if (progress >= 0.50) {
      drawFlowArrow(ctx, networkCenterX + width * 0.10, networkCenterY, predictionX - 35, predictionY, progress, 0.50);
    }

    // Draw prediction with colored indicator
    if (progress >= 0.50 && progress < 0.80) {
      drawPredictionLabel(ctx, predictionX, predictionY, 'Square', false, progress);
    }

    if (progress >= 0.80) {
      drawPredictionLabel(ctx, predictionX, predictionY, 'Circle', true, progress);
    }

    // Draw backprop arrow during error phase
    if (progress >= 0.65 && progress < 0.80) {
      drawBackpropArrow(ctx, predictionX - 35, predictionY - 30, networkCenterX + width * 0.10, networkCenterY - 30, progress);
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
  if (progress < 0.65) return 4;
  if (progress < 0.80) return 5;
  if (progress < 0.90) return 6;
  return 7;
}

// Draw the main title
function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Classification Sequence', x, y);
}

// Draw phase label at bottom
function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  let labelText = '';
  let labelColor = 'rgba(0, 0, 0, 0.7)';

  switch (phase) {
    case 1:
      labelText = 'Input: Circle';
      break;
    case 2:
      labelText = 'Sensing...';
      break;
    case 3:
      labelText = 'Processing...';
      break;
    case 4:
      labelText = 'Prediction: Square';
      labelColor = 'rgba(180, 60, 60, 0.9)'; // Red tint for wrong
      break;
    case 5:
      labelText = 'Error Signal \u2192 Learning';
      labelColor = 'rgba(180, 100, 60, 0.9)'; // Orange for learning
      break;
    case 6:
    case 7:
      labelText = 'Prediction: Circle';
      labelColor = 'rgba(60, 140, 80, 0.9)'; // Green for correct
      break;
  }

  // Background pill for the label
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 24;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - pillPadding, y - pillHeight / 2, textWidth + pillPadding * 2, pillHeight, 12);
  ctx.fill();

  // Label text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = labelColor;
  ctx.fillText(labelText, x, y);

  // Add checkmark or X next to prediction labels
  if (phase === 4) {
    // Red X
    const iconX = x + textWidth / 2 + 15;
    ctx.strokeStyle = 'rgba(180, 60, 60, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(iconX - 5, y - 5);
    ctx.lineTo(iconX + 5, y + 5);
    ctx.moveTo(iconX + 5, y - 5);
    ctx.lineTo(iconX - 5, y + 5);
    ctx.stroke();
  } else if (phase >= 6) {
    // Green checkmark
    const iconX = x + textWidth / 2 + 15;
    ctx.strokeStyle = 'rgba(60, 140, 80, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(iconX - 6, y);
    ctx.lineTo(iconX - 2, y + 4);
    ctx.lineTo(iconX + 6, y - 4);
    ctx.stroke();
  }
}

// Draw component labels
function drawComponentLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  progress: number,
  startProgress: number
) {
  const fadeIn = Math.min(1, (progress - startProgress) / 0.1);
  const alpha = fadeIn * 0.6;

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillText(text, x, y);
}

// Draw data flow arrow
function drawFlowArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  progress: number,
  startProgress: number
) {
  const fadeIn = Math.min(1, (progress - startProgress) / 0.08);
  const alpha = fadeIn * 0.4;

  // Arrow line
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - 6, toY);
  ctx.stroke();

  // Arrowhead
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize, toY - arrowSize * 0.5);
  ctx.lineTo(toX - arrowSize, toY + arrowSize * 0.5);
  ctx.closePath();
  ctx.fill();
}

// Draw backprop arrow (error signal flowing backward)
function drawBackpropArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  progress: number
) {
  const backpropProgress = (progress - 0.65) / 0.15;
  const pulse = Math.sin(backpropProgress * Math.PI * 6) * 0.5 + 0.5;
  const alpha = 0.4 + pulse * 0.4;

  // Curved arrow line going backward
  ctx.strokeStyle = `rgba(180, 100, 60, ${alpha})`;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);

  // Control point for curve
  const cpX = (fromX + toX) / 2;
  const cpY = fromY - 25;
  ctx.quadraticCurveTo(cpX, cpY, toX + 6, toY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrowhead pointing left
  const arrowSize = 7;
  ctx.fillStyle = `rgba(180, 100, 60, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX + arrowSize, toY - arrowSize * 0.5);
  ctx.lineTo(toX + arrowSize, toY + arrowSize * 0.5);
  ctx.closePath();
  ctx.fill();

  // "Error" label on the arrow
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = `rgba(180, 100, 60, ${alpha})`;
  ctx.fillText('error', cpX, cpY - 3);
}

// Draw the circle shape - simple and clear
function drawShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number
) {
  // Fade in during phase 1
  const fadeIn = Math.min(1, progress / 0.15);
  const alpha = fadeIn * 0.95;

  // Simple circle with stroke
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Light fill
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.06})`;
  ctx.fill();
}

// Draw sensing rays from shape to eye
function drawSensingRays(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  shapeRadius: number,
  progress: number
) {
  const rayProgress = Math.min(1, (progress - 0.15) / 0.15);
  const numRays = 5;

  for (let i = 0; i < numRays; i++) {
    const angleOffset = ((i - (numRays - 1) / 2) / numRays) * 0.5;

    // Start from shape edge
    const startX = fromX + shapeRadius * 1.1;
    const startY = fromY + angleOffset * shapeRadius * 1.8;

    // End at eye
    const endX = toX - 12;
    const endY = toY;

    // Animate the ray inward
    const rayLength = rayProgress;
    const currentX = startX + (endX - startX) * rayLength;
    const currentY = startY + (endY - startY) * rayLength;

    // Draw dashed ray - slightly thicker
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.35 * rayProgress})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.setLineDash([]);
  }
}

// Draw simplified eye/sensor - clearer
function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  progress: number
) {
  const fadeIn = Math.min(1, (progress - 0.15) / 0.1);
  const alpha = fadeIn * 0.9;

  // Outer eye shape (almond) - thicker stroke
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eye white fill
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
  ctx.fill();

  // Iris
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

// Draw brain shape outline
function drawBrainOutline(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  brainWidth: number,
  brainHeight: number,
  alpha: number
) {
  ctx.save();

  // Brain outline - two lobes with organic curves
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.04})`;

  ctx.beginPath();

  // Start from bottom center
  const startX = centerX;
  const startY = centerY + brainHeight * 0.35;

  ctx.moveTo(startX, startY);

  // Left side curves (left lobe)
  ctx.bezierCurveTo(
    centerX - brainWidth * 0.15, centerY + brainHeight * 0.4,  // control 1
    centerX - brainWidth * 0.45, centerY + brainHeight * 0.25,  // control 2
    centerX - brainWidth * 0.45, centerY  // end point
  );

  // Left lobe upper curve
  ctx.bezierCurveTo(
    centerX - brainWidth * 0.48, centerY - brainHeight * 0.35,  // control 1
    centerX - brainWidth * 0.35, centerY - brainHeight * 0.45,  // control 2
    centerX - brainWidth * 0.15, centerY - brainHeight * 0.38   // end point (top of left lobe)
  );

  // Dip between lobes
  ctx.bezierCurveTo(
    centerX - brainWidth * 0.05, centerY - brainHeight * 0.35,  // control 1
    centerX + brainWidth * 0.05, centerY - brainHeight * 0.35,  // control 2
    centerX + brainWidth * 0.15, centerY - brainHeight * 0.38   // end point (top of right lobe)
  );

  // Right lobe upper curve
  ctx.bezierCurveTo(
    centerX + brainWidth * 0.35, centerY - brainHeight * 0.45,  // control 1
    centerX + brainWidth * 0.48, centerY - brainHeight * 0.35,  // control 2
    centerX + brainWidth * 0.45, centerY  // end point
  );

  // Right side curves (right lobe) - back to start
  ctx.bezierCurveTo(
    centerX + brainWidth * 0.45, centerY + brainHeight * 0.25,  // control 1
    centerX + brainWidth * 0.15, centerY + brainHeight * 0.4,   // control 2
    startX, startY  // back to start
  );

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw center groove (corpus callosum hint)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - brainHeight * 0.35);
  ctx.quadraticCurveTo(centerX, centerY, centerX, centerY + brainHeight * 0.25);
  ctx.stroke();

  // Draw a few wrinkle/fold lines for brain texture
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
  ctx.lineWidth = 1;

  // Left lobe folds
  ctx.beginPath();
  ctx.moveTo(centerX - brainWidth * 0.35, centerY - brainHeight * 0.15);
  ctx.quadraticCurveTo(centerX - brainWidth * 0.25, centerY - brainHeight * 0.1, centerX - brainWidth * 0.15, centerY - brainHeight * 0.18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX - brainWidth * 0.38, centerY + brainHeight * 0.1);
  ctx.quadraticCurveTo(centerX - brainWidth * 0.28, centerY + brainHeight * 0.15, centerX - brainWidth * 0.18, centerY + brainHeight * 0.08);
  ctx.stroke();

  // Right lobe folds
  ctx.beginPath();
  ctx.moveTo(centerX + brainWidth * 0.35, centerY - brainHeight * 0.15);
  ctx.quadraticCurveTo(centerX + brainWidth * 0.25, centerY - brainHeight * 0.1, centerX + brainWidth * 0.15, centerY - brainHeight * 0.18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + brainWidth * 0.38, centerY + brainHeight * 0.1);
  ctx.quadraticCurveTo(centerX + brainWidth * 0.28, centerY + brainHeight * 0.15, centerX + brainWidth * 0.18, centerY + brainHeight * 0.08);
  ctx.stroke();

  ctx.restore();
}

// Draw brain with activation effects
function drawBrain(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  phase: 'forward' | 'backprop' | 'reinforce',
  isSecondAttempt: boolean
) {
  const brainWidth = width * 0.18;
  const brainHeight = height * 0.35;

  // Use deterministic synapse positions based on progress brackets
  // This avoids random jitter during animation
  const synapsePositions = [
    // Left lobe synapses
    { x: centerX - brainWidth * 0.32, y: centerY - brainHeight * 0.15, region: 'left' as const },
    { x: centerX - brainWidth * 0.28, y: centerY + brainHeight * 0.1, region: 'left' as const },
    { x: centerX - brainWidth * 0.35, y: centerY + brainHeight * 0.0, region: 'left' as const },
    { x: centerX - brainWidth * 0.22, y: centerY - brainHeight * 0.25, region: 'left' as const },
    { x: centerX - brainWidth * 0.18, y: centerY + brainHeight * 0.18, region: 'left' as const },
    // Right lobe synapses
    { x: centerX + brainWidth * 0.32, y: centerY - brainHeight * 0.15, region: 'right' as const },
    { x: centerX + brainWidth * 0.28, y: centerY + brainHeight * 0.1, region: 'right' as const },
    { x: centerX + brainWidth * 0.35, y: centerY + brainHeight * 0.0, region: 'right' as const },
    { x: centerX + brainWidth * 0.22, y: centerY - brainHeight * 0.25, region: 'right' as const },
    { x: centerX + brainWidth * 0.18, y: centerY + brainHeight * 0.18, region: 'right' as const },
    // Center synapses
    { x: centerX - brainWidth * 0.05, y: centerY - brainHeight * 0.08, region: 'center' as const },
    { x: centerX + brainWidth * 0.05, y: centerY + brainHeight * 0.08, region: 'center' as const },
    { x: centerX, y: centerY - brainHeight * 0.2, region: 'center' as const },
    { x: centerX, y: centerY + brainHeight * 0.15, region: 'center' as const },
  ];

  // Calculate activation timing
  let activationProgress = 0;
  if (progress >= 0.30 && progress < 0.50) {
    activationProgress = (progress - 0.30) / 0.20;
  } else if (progress >= 0.80 && progress < 0.90) {
    activationProgress = (progress - 0.80) / 0.10;
  } else if (progress >= 0.50) {
    activationProgress = 1;
  }

  // Backprop animation progress
  let backpropProgress = 0;
  if (progress >= 0.65 && progress < 0.80) {
    backpropProgress = (progress - 0.65) / 0.15;
  }

  // Reinforcement progress
  let reinforceProgress = 0;
  if (progress >= 0.90) {
    reinforceProgress = (progress - 0.90) / 0.10;
  }

  // Draw brain outline
  const fadeIn = Math.min(1, (progress - 0.30) / 0.1);
  drawBrainOutline(ctx, centerX, centerY, brainWidth, brainHeight, fadeIn);

  // Draw connections between synapses
  const leftSynapses = synapsePositions.filter(s => s.region === 'left');
  const rightSynapses = synapsePositions.filter(s => s.region === 'right');
  const centerSynapses = synapsePositions.filter(s => s.region === 'center');

  // Draw internal connections
  const drawConnection = (from: typeof synapsePositions[0], to: typeof synapsePositions[0], idx: number) => {
    const connectionDelay = idx * 0.1;
    const isActive = activationProgress > connectionDelay;
    const isBackprop = backpropProgress > 0 && backpropProgress > (1 - connectionDelay);
    const isReinforced = reinforceProgress > 0;

    let alpha = 0.1;
    let lineWidth = 1;

    if (isActive) {
      alpha = 0.3;
      lineWidth = 1.5;
    }

    if (isBackprop) {
      const pulse = Math.sin(backpropProgress * Math.PI * 6) * 0.5 + 0.5;
      alpha = 0.3 + pulse * 0.4;
      lineWidth = 1.5 + pulse * 1;
    }

    if (isReinforced) {
      alpha = Math.min(0.6, alpha + reinforceProgress * 0.3);
      lineWidth = lineWidth * (1 + reinforceProgress * 0.8);
    }

    let strokeColor = `rgba(0, 0, 0, ${alpha})`;
    if (isBackprop) {
      strokeColor = `rgba(180, 100, 60, ${alpha})`;
    } else if (isReinforced) {
      strokeColor = `rgba(60, 140, 80, ${alpha})`;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    // Use curved lines for more organic look - deterministic offset based on index
    const midX = (from.x + to.x) / 2;
    const offsetY = ((idx % 3) - 1) * 3; // Creates -3, 0, or 3 offset
    const midY = (from.y + to.y) / 2 + offsetY;
    ctx.quadraticCurveTo(midX, midY, to.x, to.y);
    ctx.stroke();
  };

  // Connect left to center
  leftSynapses.forEach((left, idx) => {
    if (idx < centerSynapses.length) {
      drawConnection(left, centerSynapses[idx % centerSynapses.length], idx);
    }
  });

  // Connect center to right
  centerSynapses.forEach((center, idx) => {
    if (idx < rightSynapses.length) {
      drawConnection(center, rightSynapses[idx % rightSynapses.length], idx + 4);
    }
  });

  // Some cross connections within lobes
  for (let i = 0; i < leftSynapses.length - 1; i++) {
    drawConnection(leftSynapses[i], leftSynapses[i + 1], i + 8);
  }
  for (let i = 0; i < rightSynapses.length - 1; i++) {
    drawConnection(rightSynapses[i], rightSynapses[i + 1], i + 12);
  }

  // Draw synapses as dots
  synapsePositions.forEach((synapse, idx) => {
    const regionDelay = synapse.region === 'left' ? 0 : synapse.region === 'center' ? 0.3 : 0.6;
    const isActive = activationProgress > regionDelay;
    const isBackprop = backpropProgress > 0 && backpropProgress > (1 - regionDelay);
    const isReinforced = reinforceProgress > 0;

    let fillAlpha = 0.15;
    let size = 3;

    if (isActive) {
      fillAlpha = 0.6;
      size = 4;
    }

    if (isBackprop) {
      const pulse = Math.sin(backpropProgress * Math.PI * 6 + idx * 0.5) * 0.5 + 0.5;
      fillAlpha = 0.4 + pulse * 0.5;
      size = 4 + pulse * 2;
    }

    if (isReinforced) {
      size = 4 + reinforceProgress * 3;
      fillAlpha = Math.min(0.9, fillAlpha + reinforceProgress * 0.3);
    }

    let fillColor = `rgba(0, 0, 0, ${fillAlpha})`;
    if (isBackprop) {
      fillColor = `rgba(180, 100, 60, ${fillAlpha})`;
    } else if (isReinforced) {
      fillColor = `rgba(60, 140, 80, ${fillAlpha})`;
    }

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(synapse.x, synapse.y, size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw activation wave during forward pass
  if (activationProgress > 0 && activationProgress < 1 && backpropProgress === 0) {
    const waveX = centerX - brainWidth * 0.4 + brainWidth * 0.8 * activationProgress;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(waveX, centerY - brainHeight * 0.35);
    ctx.lineTo(waveX, centerY + brainHeight * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw backprop wave
  if (backpropProgress > 0) {
    const waveX = centerX + brainWidth * 0.4 - brainWidth * 0.8 * backpropProgress;

    ctx.strokeStyle = 'rgba(180, 100, 60, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(waveX, centerY - brainHeight * 0.35);
    ctx.lineTo(waveX, centerY + brainHeight * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow pointing left
    const arrowSize = 6;
    ctx.fillStyle = 'rgba(180, 100, 60, 0.5)';
    ctx.beginPath();
    ctx.moveTo(waveX - arrowSize, centerY - brainHeight * 0.35);
    ctx.lineTo(waveX, centerY - brainHeight * 0.35 + arrowSize);
    ctx.lineTo(waveX, centerY - brainHeight * 0.35 - arrowSize);
    ctx.closePath();
    ctx.fill();
  }
}

// Draw prediction label with colored check or X
function drawPredictionLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  isCorrect: boolean,
  progress: number
) {
  let fadeIn = 1;
  if (progress < 0.55) {
    fadeIn = (progress - 0.50) / 0.05;
  } else if (progress >= 0.80 && progress < 0.85) {
    fadeIn = (progress - 0.80) / 0.05;
  }

  const alpha = Math.max(0, Math.min(1, fadeIn));

  // Background box
  const boxWidth = 60;
  const boxHeight = 50;
  const borderColor = isCorrect ? `rgba(60, 140, 80, ${alpha * 0.6})` : `rgba(180, 60, 60, ${alpha * 0.6})`;
  const bgColor = isCorrect ? `rgba(60, 140, 80, ${alpha * 0.08})` : `rgba(180, 60, 60, ${alpha * 0.08})`;

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 6);
  ctx.fill();
  ctx.stroke();

  // Draw text
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
  ctx.fillText(text, x, y - 8);

  // Draw indicator below text
  const indicatorY = y + 12;
  const indicatorSize = 10;

  if (isCorrect) {
    // Green checkmark
    ctx.strokeStyle = `rgba(60, 140, 80, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - indicatorSize, indicatorY);
    ctx.lineTo(x - indicatorSize * 0.3, indicatorY + indicatorSize * 0.6);
    ctx.lineTo(x + indicatorSize, indicatorY - indicatorSize * 0.5);
    ctx.stroke();
  } else {
    // Red X mark
    ctx.strokeStyle = `rgba(180, 60, 60, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - indicatorSize * 0.6, indicatorY - indicatorSize * 0.6);
    ctx.lineTo(x + indicatorSize * 0.6, indicatorY + indicatorSize * 0.6);
    ctx.moveTo(x + indicatorSize * 0.6, indicatorY - indicatorSize * 0.6);
    ctx.lineTo(x - indicatorSize * 0.6, indicatorY + indicatorSize * 0.6);
    ctx.stroke();
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('Output', x, y + boxHeight / 2 + 12);
}
