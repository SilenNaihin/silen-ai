'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ConvergenceAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Convergence Animation showing:
 * Phase 1 (0-0.35): Normal convergence pattern
 * Phase 2 (0.35-0.70): Loss landscape visualization (local minima)
 * Phase 3 (0.70-1.0): Grokking phenomenon - sudden generalization after plateau
 */
export function ConvergenceAnimation({ progress, className = '' }: ConvergenceAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY, phase);

    // Phase 1: Normal convergence (0-0.40)
    if (progress < 0.40) {
      const fadeOut = progress > 0.32 ? 1 - (progress - 0.32) / 0.08 : 1;
      const convProgress = Math.min(1, progress / 0.30);
      drawNormalConvergence(ctx, width * 0.5, height * 0.52, width * 0.85, height * 0.65, convProgress, fadeOut);
    }

    // Phase 2: Loss landscape (0.35-0.75)
    if (progress >= 0.32 && progress < 0.75) {
      const fadeIn = progress < 0.38 ? (progress - 0.32) / 0.06 : 1;
      const fadeOut = progress > 0.67 ? 1 - (progress - 0.67) / 0.08 : 1;
      const landscapeProgress = Math.min(1, (progress - 0.35) / 0.35);
      drawLossLandscape(ctx, width * 0.5, height * 0.52, width * 0.85, height * 0.68, landscapeProgress, fadeIn * fadeOut);
    }

    // Phase 3: Grokking (0.70-1.0)
    if (progress >= 0.67) {
      const fadeIn = progress < 0.73 ? (progress - 0.67) / 0.06 : 1;
      const grokkingProgress = Math.min(1, (progress - 0.70) / 0.28);
      drawGrokkingVisualization(ctx, width * 0.5, height * 0.52, width * 0.85, height * 0.68, grokkingProgress, fadeIn);
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
    1: 'Convergence: When Training Stops',
    2: 'The Loss Landscape',
    3: 'Grokking: Delayed Understanding',
  };
  ctx.fillText(titles[phase] || 'Convergence', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: progress > 0.25 ? 'Loss plateaus, gradient vanishes' : 'Loss decreases over epochs',
    2: progress > 0.55 ? 'Local minima can trap optimization' : 'The loss surface has many valleys',
    3: progress > 0.85 ? 'Sudden generalization after seeming convergence' : 'Flat loss, then breakthrough',
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
  ctx.fillStyle = phase === 3 && progress > 0.85 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawNormalConvergence(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const graphWidth = width * 0.85;
  const graphHeight = height * 0.7;
  const graphLeft = centerX - graphWidth / 2;
  const graphTop = centerY - height / 2 + 30;

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop);
  ctx.lineTo(graphLeft, graphTop + graphHeight);
  ctx.lineTo(graphLeft + graphWidth, graphTop + graphHeight);
  ctx.stroke();

  // Axis labels
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'center';
  ctx.fillText('Epochs', centerX, graphTop + graphHeight + 18);

  ctx.save();
  ctx.translate(graphLeft - 12, centerY - 5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss', 0, 0);
  ctx.restore();

  // Draw convergence curve
  const numPoints = Math.floor(100 * progress);
  const points: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = i / 100;
    const x = graphLeft + t * graphWidth;
    // Exponential decay with asymptote
    const loss = 2.0 * Math.exp(-4 * t) + 0.2;
    const y = graphTop + (1 - loss / 2.5) * graphHeight;
    points.push([x, y]);
  }

  if (points.length > 1) {
    ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();

    // Current point
    const lastPoint = points[points.length - 1];
    ctx.fillStyle = `rgba(60, 140, 80, ${alpha})`;
    ctx.beginPath();
    ctx.arc(lastPoint[0], lastPoint[1], 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Convergence zone
  if (progress > 0.6) {
    const zoneAlpha = Math.min(1, (progress - 0.6) / 0.2) * alpha;
    const zoneStartX = graphLeft + 0.6 * graphWidth;

    ctx.fillStyle = `rgba(60, 140, 80, ${zoneAlpha * 0.08})`;
    ctx.fillRect(zoneStartX, graphTop, graphWidth - (zoneStartX - graphLeft), graphHeight);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(60, 140, 80, ${zoneAlpha * 0.7})`;
    ctx.fillText('Converged', zoneStartX + (graphWidth - (zoneStartX - graphLeft)) / 2, graphTop + 20);

    // Asymptote line
    const asympY = graphTop + (1 - 0.2 / 2.5) * graphHeight;
    ctx.strokeStyle = `rgba(100, 100, 100, ${zoneAlpha * 0.4})`;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(graphLeft, asympY);
    ctx.lineTo(graphLeft + graphWidth, asympY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(100, 100, 100, ${zoneAlpha * 0.6})`;
    ctx.textAlign = 'right';
    ctx.fillText('minimum', graphLeft + graphWidth - 5, asympY - 5);
  }
}

function drawLossLandscape(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const landscapeWidth = width * 0.9;
  const landscapeHeight = height * 0.6;
  const left = centerX - landscapeWidth / 2;
  const top = centerY - landscapeHeight / 2;

  // Draw 3D-ish loss landscape
  const numXPoints = 60;
  const numYPoints = 30;

  // Generate landscape values
  const landscape: number[][] = [];
  for (let y = 0; y < numYPoints; y++) {
    landscape[y] = [];
    for (let x = 0; x < numXPoints; x++) {
      const nx = (x / numXPoints - 0.5) * 4;
      const ny = (y / numYPoints - 0.5) * 4;

      // Create a bumpy surface with multiple minima
      const globalMin = nx * nx + ny * ny;
      const localMin1 = 2 * Math.exp(-((nx + 1.5) ** 2 + (ny + 0.5) ** 2) * 2);
      const localMin2 = 1.5 * Math.exp(-((nx - 1) ** 2 + (ny - 1) ** 2) * 1.5);
      const noise = 0.3 * Math.sin(nx * 3) * Math.cos(ny * 3);

      landscape[y][x] = globalMin * 0.3 - localMin1 - localMin2 + noise + 2;
    }
  }

  // Draw surface lines (simplified wireframe)
  const drawProgress = Math.min(1, progress);

  // Draw horizontal lines
  for (let y = 0; y < numYPoints; y += 3) {
    const lineProgress = Math.min(1, (drawProgress * numYPoints - y) / 3);
    if (lineProgress <= 0) continue;

    ctx.strokeStyle = `rgba(100, 100, 150, ${alpha * lineProgress * 0.4})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();

    for (let x = 0; x < numXPoints; x++) {
      const px = left + (x / numXPoints) * landscapeWidth;
      const py = top + (y / numYPoints) * landscapeHeight * 0.7 + landscape[y][x] * 15;

      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Mark global minimum
  if (progress > 0.5) {
    const minAlpha = Math.min(1, (progress - 0.5) / 0.3) * alpha;
    const globalMinX = left + 0.5 * landscapeWidth;
    const globalMinY = top + 0.5 * landscapeHeight * 0.7 + landscape[Math.floor(numYPoints / 2)][Math.floor(numXPoints / 2)] * 15;

    ctx.fillStyle = `rgba(60, 140, 80, ${minAlpha})`;
    ctx.beginPath();
    ctx.arc(globalMinX, globalMinY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(60, 140, 80, ${minAlpha * 0.8})`;
    ctx.fillText('Global minimum', globalMinX, globalMinY + 18);
  }

  // Mark local minima
  if (progress > 0.6) {
    const localAlpha = Math.min(1, (progress - 0.6) / 0.3) * alpha;

    const localMins = [
      { x: 0.19, y: 0.4, label: 'Local' },
      { x: 0.7, y: 0.7, label: 'Local' },
    ];

    localMins.forEach((min) => {
      const px = left + min.x * landscapeWidth;
      const yi = Math.floor(min.y * numYPoints);
      const xi = Math.floor(min.x * numXPoints);
      const py = top + min.y * landscapeHeight * 0.7 + landscape[yi][xi] * 15;

      ctx.fillStyle = `rgba(200, 150, 60, ${localAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(200, 150, 60, ${localAlpha * 0.8})`;
      ctx.fillText(min.label, px, py + 14);
    });
  }

  // Legend
  if (progress > 0.7) {
    const legendAlpha = Math.min(1, (progress - 0.7) / 0.2) * alpha;
    const legendY = top + landscapeHeight + 25;

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.7})`;
    ctx.fillText('Optimization can get stuck in local minima', centerX, legendY);
  }
}

function drawGrokkingVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const graphWidth = width * 0.85;
  const graphHeight = height * 0.6;
  const graphLeft = centerX - graphWidth / 2;
  const graphTop = centerY - height / 2 + 25;

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop);
  ctx.lineTo(graphLeft, graphTop + graphHeight);
  ctx.lineTo(graphLeft + graphWidth, graphTop + graphHeight);
  ctx.stroke();

  // Axis labels
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.textAlign = 'center';
  ctx.fillText('Epochs (thousands)', centerX, graphTop + graphHeight + 18);

  ctx.save();
  ctx.translate(graphLeft - 12, centerY - 10);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Accuracy', 0, 0);
  ctx.restore();

  // Epoch markers
  ctx.font = '8px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  [0, 500, 1000, 1500, 2000].forEach((epoch, i) => {
    const x = graphLeft + (i / 4) * graphWidth;
    ctx.fillText(String(epoch), x, graphTop + graphHeight + 8);
  });

  // Draw training accuracy (quickly reaches ~100%)
  const trainCurve: [number, number][] = [];
  const testCurve: [number, number][] = [];
  const numPoints = Math.floor(100 * progress);

  for (let i = 0; i < numPoints; i++) {
    const t = i / 100;
    const x = graphLeft + t * graphWidth;

    // Training accuracy: quickly saturates
    const trainAcc = 1 - 0.8 * Math.exp(-t * 10);
    const trainY = graphTop + (1 - trainAcc) * graphHeight;
    trainCurve.push([x, trainY]);

    // Test accuracy: flat then suddenly jumps (grokking)
    let testAcc: number;
    if (t < 0.6) {
      // Flat memorization phase
      testAcc = 0.15 + 0.35 * (1 - Math.exp(-t * 5)) + Math.sin(t * 30) * 0.02;
    } else {
      // Grokking phase - sudden jump
      const grokkingT = (t - 0.6) / 0.4;
      const sigmoid = 1 / (1 + Math.exp(-15 * (grokkingT - 0.5)));
      testAcc = 0.5 + 0.48 * sigmoid;
    }
    const testY = graphTop + (1 - testAcc) * graphHeight;
    testCurve.push([x, testY]);
  }

  // Draw training curve
  if (trainCurve.length > 1) {
    ctx.strokeStyle = `rgba(100, 100, 200, ${alpha * 0.8})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trainCurve[0][0], trainCurve[0][1]);
    for (let i = 1; i < trainCurve.length; i++) {
      ctx.lineTo(trainCurve[i][0], trainCurve[i][1]);
    }
    ctx.stroke();
  }

  // Draw test curve
  if (testCurve.length > 1) {
    ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(testCurve[0][0], testCurve[0][1]);
    for (let i = 1; i < testCurve.length; i++) {
      ctx.lineTo(testCurve[i][0], testCurve[i][1]);
    }
    ctx.stroke();
  }

  // Legend
  const legendX = graphLeft + graphWidth - 80;
  const legendY = graphTop + 15;

  ctx.fillStyle = `rgba(100, 100, 200, ${alpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(legendX, legendY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.textAlign = 'left';
  ctx.fillText('Train', legendX + 8, legendY + 3);

  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(legendX, legendY + 14, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.fillText('Test', legendX + 8, legendY + 17);

  // Phase annotations
  if (progress > 0.3) {
    const phase1Alpha = Math.min(1, (progress - 0.3) / 0.2) * alpha;

    // Memorization phase
    ctx.fillStyle = `rgba(200, 150, 60, ${phase1Alpha * 0.1})`;
    ctx.fillRect(graphLeft, graphTop, graphWidth * 0.6, graphHeight);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(200, 150, 60, ${phase1Alpha * 0.7})`;
    ctx.fillText('Memorization', graphLeft + graphWidth * 0.3, graphTop + graphHeight - 20);
    ctx.font = '8px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${phase1Alpha * 0.5})`;
    ctx.fillText('(appears converged)', graphLeft + graphWidth * 0.3, graphTop + graphHeight - 8);
  }

  if (progress > 0.7) {
    const phase2Alpha = Math.min(1, (progress - 0.7) / 0.2) * alpha;

    // Grokking phase
    ctx.fillStyle = `rgba(60, 140, 80, ${phase2Alpha * 0.1})`;
    ctx.fillRect(graphLeft + graphWidth * 0.6, graphTop, graphWidth * 0.4, graphHeight);

    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(60, 140, 80, ${phase2Alpha * 0.8})`;
    ctx.fillText('Grokking!', graphLeft + graphWidth * 0.8, graphTop + 25);

    // Arrow pointing to the jump
    if (progress > 0.85 && testCurve.length > 70) {
      const arrowAlpha = Math.min(1, (progress - 0.85) / 0.1) * alpha;
      const jumpX = graphLeft + 0.7 * graphWidth;
      const jumpY = testCurve[70][1];

      ctx.strokeStyle = `rgba(60, 140, 80, ${arrowAlpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(jumpX - 30, jumpY - 40);
      ctx.lineTo(jumpX - 5, jumpY - 5);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = `rgba(60, 140, 80, ${arrowAlpha * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(jumpX - 5, jumpY - 5);
      ctx.lineTo(jumpX - 12, jumpY - 3);
      ctx.lineTo(jumpX - 8, jumpY - 12);
      ctx.closePath();
      ctx.fill();
    }
  }
}
