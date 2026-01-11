'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface HyperparametersAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Hyperparameters Animation showing:
 * Phase 1 (0-0.35): Learning rate comparison (too high, too low, just right)
 * Phase 2 (0.35-0.70): Batch size effects visualization
 * Phase 3 (0.70-1.0): Architecture capacity comparison
 */
export function HyperparametersAnimation({ progress, className = '' }: HyperparametersAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY, phase);

    // Phase 1: Learning rate comparison (0-0.40)
    if (progress < 0.40) {
      const fadeOut = progress > 0.32 ? 1 - (progress - 0.32) / 0.08 : 1;
      const lrProgress = Math.min(1, progress / 0.30);
      drawLearningRateComparison(ctx, width * 0.5, height * 0.52, width * 0.9, height * 0.68, lrProgress, fadeOut);
    }

    // Phase 2: Batch size effects (0.35-0.75)
    if (progress >= 0.32 && progress < 0.75) {
      const fadeIn = progress < 0.38 ? (progress - 0.32) / 0.06 : 1;
      const fadeOut = progress > 0.67 ? 1 - (progress - 0.67) / 0.08 : 1;
      const batchProgress = Math.min(1, (progress - 0.35) / 0.35);
      drawBatchSizeEffects(ctx, width * 0.5, height * 0.52, width * 0.9, height * 0.68, batchProgress, fadeIn * fadeOut);
    }

    // Phase 3: Architecture capacity (0.70-1.0)
    if (progress >= 0.67) {
      const fadeIn = progress < 0.73 ? (progress - 0.67) / 0.06 : 1;
      const archProgress = Math.min(1, (progress - 0.70) / 0.28);
      drawArchitectureCapacity(ctx, width * 0.5, height * 0.52, width * 0.9, height * 0.68, archProgress, fadeIn);
    }

    // Phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress);
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
  if (progress < 0.35) return 1;
  if (progress < 0.70) return 2;
  return 3;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';

  const titles: Record<number, string> = {
    1: 'Learning Rate: The Step Size',
    2: 'Batch Size: Stability vs Speed',
    3: 'Architecture: Capacity and Depth',
  };
  ctx.fillText(titles[phase] || 'Hyperparameters', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: progress > 0.25 ? 'Finding the sweet spot' : 'How big a step do we take?',
    2: progress > 0.55 ? 'Trade-off: speed vs gradient quality' : 'How many examples per update?',
    3: progress > 0.85 ? 'Match capacity to problem complexity' : 'How many neurons and layers?',
  };

  const labelText = labels[phase] || '';

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
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawLearningRateComparison(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  // Ensure positive dimensions
  const safeWidth = Math.max(150, width);
  const safeHeight = Math.max(100, height);

  const scenarios = [
    { lr: 'η = 0.001', label: 'Too Low', color: 'rgba(100, 100, 200, ', trajectory: 'slow' },
    { lr: 'η = 0.1', label: 'Just Right', color: 'rgba(60, 140, 80, ', trajectory: 'good' },
    { lr: 'η = 1.0', label: 'Too High', color: 'rgba(200, 60, 60, ', trajectory: 'diverge' },
  ];

  const graphWidth = Math.max(30, (safeWidth - 40) / 3);
  const graphHeight = Math.max(30, safeHeight * 0.65);
  const startX = centerX - safeWidth / 2 + 10;
  const graphTop = centerY - safeHeight / 2 + 40;

  scenarios.forEach((scenario, i) => {
    const graphX = startX + i * (graphWidth + 15);

    // Draw loss surface (bowl shape)
    drawLossSurface(ctx, graphX + graphWidth / 2, graphTop + graphHeight / 2, graphWidth * 0.8, graphHeight * 0.7, alpha);

    // Draw trajectory
    const trajectoryProgress = Math.min(1, progress * 1.2);
    drawTrajectory(ctx, graphX + graphWidth / 2, graphTop + graphHeight / 2, graphWidth * 0.35, scenario.trajectory, trajectoryProgress, scenario.color, alpha);

    // Labels
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = scenario.color + (alpha * 0.9) + ')';
    ctx.fillText(scenario.label, graphX + graphWidth / 2, graphTop - 5);

    ctx.font = '10px monospace';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.fillText(scenario.lr, graphX + graphWidth / 2, graphTop + graphHeight + 15);
  });
}

function drawLossSurface(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  alpha: number
) {
  // Ensure positive dimensions
  const safeWidth = Math.max(10, Math.abs(width));
  const safeHeight = Math.max(10, Math.abs(height));

  // Draw contour lines (concentric ellipses)
  const numContours = 5;
  for (let i = numContours; i >= 1; i--) {
    const scale = i / numContours;
    ctx.strokeStyle = `rgba(150, 150, 150, ${alpha * (0.1 + scale * 0.15)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, safeWidth * scale / 2, safeHeight * scale / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Minimum point
  ctx.fillStyle = `rgba(60, 60, 60, ${alpha * 0.5})`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawTrajectory(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  type: string,
  progress: number,
  color: string,
  alpha: number
) {
  const safeRadius = Math.max(10, Math.abs(radius));
  const numPoints = Math.floor(20 * progress);
  if (numPoints < 2) return;

  const points: [number, number][] = [];
  const startX = centerX - safeRadius * 0.9;
  const startY = centerY - safeRadius * 0.7;

  if (type === 'slow') {
    // Very slow convergence
    for (let i = 0; i < numPoints; i++) {
      const t = i / 20;
      const x = startX + (centerX - startX) * (1 - Math.exp(-t * 0.8));
      const y = startY + (centerY - startY) * (1 - Math.exp(-t * 0.8));
      points.push([x, y]);
    }
  } else if (type === 'good') {
    // Nice convergence with some oscillation
    for (let i = 0; i < numPoints; i++) {
      const t = i / 20;
      const decay = Math.exp(-t * 3);
      const x = centerX + (startX - centerX) * decay * Math.cos(t * 8);
      const y = centerY + (startY - centerY) * decay * Math.cos(t * 8 + 0.5);
      points.push([x, y]);
    }
  } else if (type === 'diverge') {
    // Diverging/oscillating wildly
    for (let i = 0; i < numPoints; i++) {
      const t = i / 20;
      const x = centerX + Math.sin(t * 15) * safeRadius * (0.3 + t * 0.7);
      const y = centerY + Math.cos(t * 15 + 1) * safeRadius * (0.3 + t * 0.5);
      points.push([x, Math.min(centerY + safeRadius, Math.max(centerY - safeRadius, y))]);
    }
  }

  // Draw path
  ctx.strokeStyle = color + (alpha * 0.7) + ')';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();

  // Draw current point
  if (points.length > 0) {
    const lastPoint = points[points.length - 1];
    ctx.fillStyle = color + alpha + ')';
    ctx.beginPath();
    ctx.arc(lastPoint[0], lastPoint[1], 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Start point
  ctx.fillStyle = `rgba(100, 100, 100, ${alpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(points[0][0], points[0][1], 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBatchSizeEffects(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const batchSizes = [
    { size: 1, label: 'Batch=1', gradient: 'noisy', color: 'rgba(200, 60, 60, ' },
    { size: 32, label: 'Batch=32', gradient: 'balanced', color: 'rgba(60, 140, 80, ' },
    { size: 1024, label: 'Batch=1024', gradient: 'smooth', color: 'rgba(100, 100, 200, ' },
  ];

  const graphWidth = (width - 40) / 3;
  const graphHeight = height * 0.55;
  const startX = centerX - width / 2 + 10;
  const graphTop = centerY - height / 2 + 35;

  batchSizes.forEach((batch, i) => {
    const graphX = startX + i * (graphWidth + 15);
    const graphCenterX = graphX + graphWidth / 2;

    // Draw gradient direction visualization
    drawGradientArrows(ctx, graphCenterX, graphTop + graphHeight / 2, graphWidth * 0.4, batch.gradient, progress, batch.color, alpha);

    // Labels
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = batch.color + (alpha * 0.9) + ')';
    ctx.fillText(batch.label, graphCenterX, graphTop - 8);

    // Description
    const descriptions: Record<string, string[]> = {
      noisy: ['Very noisy', 'Fast updates'],
      balanced: ['Good balance', 'Stable learning'],
      smooth: ['Very smooth', 'Slow updates'],
    };

    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    descriptions[batch.gradient].forEach((line, j) => {
      ctx.fillText(line, graphCenterX, graphTop + graphHeight + 10 + j * 12);
    });
  });

  // Summary comparison bar
  if (progress > 0.5) {
    const barAlpha = Math.min(1, (progress - 0.5) / 0.3) * alpha;
    const barY = centerY + height / 2 - 35;
    const barWidth = width * 0.8;
    const barX = centerX - barWidth / 2;

    // Labels
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(0, 0, 0, ${barAlpha * 0.6})`;
    ctx.fillText('Noisy gradients', barX, barY - 5);
    ctx.textAlign = 'right';
    ctx.fillText('Smooth gradients', barX + barWidth, barY - 5);

    // Gradient bar
    const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    gradient.addColorStop(0, `rgba(200, 60, 60, ${barAlpha * 0.5})`);
    gradient.addColorStop(0.5, `rgba(60, 140, 80, ${barAlpha * 0.5})`);
    gradient.addColorStop(1, `rgba(100, 100, 200, ${barAlpha * 0.5})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, 8, 4);
    ctx.fill();
  }
}

function drawGradientArrows(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  type: string,
  progress: number,
  color: string,
  alpha: number
) {
  const numArrows = 8;
  const time = progress * 3;

  for (let i = 0; i < numArrows; i++) {
    const baseAngle = (i / numArrows) * Math.PI * 2 - Math.PI / 2;
    let angle = baseAngle;
    let length = radius * 0.6;

    if (type === 'noisy') {
      // Random-ish directions
      angle = baseAngle + Math.sin(time * 5 + i * 2) * 0.8;
      length = radius * (0.3 + Math.abs(Math.sin(time * 3 + i)) * 0.5);
    } else if (type === 'balanced') {
      // Mostly aligned with some variation
      angle = baseAngle + Math.sin(time * 2 + i) * 0.2;
      length = radius * (0.5 + Math.abs(Math.sin(time * 2 + i)) * 0.2);
    } else if (type === 'smooth') {
      // All pointing same direction
      angle = -Math.PI / 2 + Math.sin(time) * 0.1;
      length = radius * 0.65;
    }

    const startX = centerX + Math.cos(baseAngle + Math.PI) * radius * 0.2;
    const startY = centerY + Math.sin(baseAngle + Math.PI) * radius * 0.2;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    // Arrow line
    ctx.strokeStyle = color + (alpha * 0.6) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Arrow head
    const headLength = 6;
    const headAngle = 0.5;
    ctx.fillStyle = color + (alpha * 0.6) + ')';
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - headAngle),
      endY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + headAngle),
      endY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fill();
  }
}

function drawArchitectureCapacity(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const architectures = [
    { name: 'Tiny', layers: [2, 3, 2], capacity: 'Low', fit: 'Underfits' },
    { name: 'Medium', layers: [4, 6, 4, 2], capacity: 'Good', fit: 'Good fit' },
    { name: 'Large', layers: [4, 8, 8, 8, 4, 2], capacity: 'High', fit: 'May overfit' },
  ];

  const sectionWidth = (width - 30) / 3;
  const startX = centerX - width / 2 + 10;
  const netY = centerY - 15;

  architectures.forEach((arch, i) => {
    const delay = i * 0.15;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.4));

    if (itemProgress > 0) {
      const sectionX = startX + i * (sectionWidth + 10);
      const itemAlpha = itemProgress * alpha;

      // Draw mini network
      drawMiniNetwork(ctx, sectionX + sectionWidth / 2, netY, sectionWidth * 0.8, height * 0.45, arch.layers, itemAlpha);

      // Architecture name
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.9})`;
      ctx.fillText(arch.name, sectionX + sectionWidth / 2, netY - height * 0.3);

      // Capacity indicator
      const fitColor = arch.fit === 'Good fit' ? 'rgba(60, 140, 80, ' :
        arch.fit === 'Underfits' ? 'rgba(100, 100, 200, ' : 'rgba(200, 150, 60, ';

      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.6})`;
      ctx.fillText(`Capacity: ${arch.capacity}`, sectionX + sectionWidth / 2, netY + height * 0.32);

      ctx.fillStyle = fitColor + (itemAlpha * 0.8) + ')';
      ctx.fillText(arch.fit, sectionX + sectionWidth / 2, netY + height * 0.32 + 14);
    }
  });

  // Insight box
  if (progress > 0.7) {
    const insightAlpha = Math.min(1, (progress - 0.7) / 0.2) * alpha;
    const insightY = centerY + height / 2 - 40;

    ctx.fillStyle = `rgba(60, 140, 80, ${insightAlpha * 0.1})`;
    ctx.beginPath();
    ctx.roundRect(centerX - width * 0.4, insightY, width * 0.8, 32, 8);
    ctx.fill();

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${insightAlpha * 0.8})`;
    ctx.fillText('More capacity needs more data to avoid overfitting', centerX, insightY + 20);
  }
}

function drawMiniNetwork(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  layers: number[],
  alpha: number
) {
  const layerGap = width / (layers.length + 1);
  const neuronRadius = Math.min(6, 40 / Math.max(...layers));

  // Draw connections
  for (let l = 0; l < layers.length - 1; l++) {
    const fromX = centerX - width / 2 + (l + 1) * layerGap;
    const toX = centerX - width / 2 + (l + 2) * layerGap;
    const fromCount = layers[l];
    const toCount = layers[l + 1];

    for (let i = 0; i < fromCount; i++) {
      const fromY = centerY + (i - (fromCount - 1) / 2) * (neuronRadius * 2.5);
      for (let j = 0; j < toCount; j++) {
        const toY = centerY + (j - (toCount - 1) / 2) * (neuronRadius * 2.5);

        ctx.strokeStyle = `rgba(150, 150, 150, ${alpha * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    }
  }

  // Draw neurons
  for (let l = 0; l < layers.length; l++) {
    const x = centerX - width / 2 + (l + 1) * layerGap;
    const count = layers[l];

    for (let i = 0; i < count; i++) {
      const y = centerY + (i - (count - 1) / 2) * (neuronRadius * 2.5);

      ctx.fillStyle = `rgba(100, 100, 200, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(100, 100, 200, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
