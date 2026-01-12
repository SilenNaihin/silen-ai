'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface OverfittingAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Overfitting Animation showing:
 * Phase 1 (0-0.5): Training vs validation loss divergence
 * Phase 2 (0.5-1.0): Dropout visualization with neurons turning off
 */
export function OverfittingAnimation({
  progress,
  className = '',
}: OverfittingAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY, phase);

    // Phase 1: Training vs Validation loss curves (0-0.55)
    if (progress < 0.55) {
      const fadeOut = progress > 0.45 ? 1 - (progress - 0.45) / 0.1 : 1;
      const curveProgress = Math.min(1, progress / 0.45);
      drawLossCurves(
        ctx,
        width * 0.5,
        height * 0.52,
        width * 0.85,
        height * 0.7,
        curveProgress,
        fadeOut
      );
    }

    // Phase 2: Dropout visualization (0.45-1.0)
    if (progress >= 0.45) {
      const fadeIn = progress < 0.55 ? (progress - 0.45) / 0.1 : 1;
      const dropoutProgress = Math.min(1, (progress - 0.5) / 0.5);
      drawDropoutVisualization(
        ctx,
        width * 0.5,
        height * 0.52,
        width * 0.85,
        height * 0.7,
        dropoutProgress,
        fadeIn
      );
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
  if (progress < 0.5) return 1;
  return 2;
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';

  const titles: Record<number, string> = {
    1: 'Overfitting: When Memorization Beats Learning',
    2: 'Dropout: Random Resilience',
  };
  ctx.fillText(titles[phase] || 'Overfitting', x, y);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number,
  progress: number
) {
  const labels: Record<number, string> = {
    1:
      progress > 0.3
        ? 'Training loss drops while validation loss rises'
        : 'Watch the curves diverge',
    2:
      progress > 0.75
        ? 'The network cannot rely on any single neuron'
        : 'Randomly disabling neurons during training',
  };

  const labelText = labels[phase] || '';

  ctx.font = '13px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 14;
  const pillHeight = 26;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.beginPath();
  ctx.roundRect(
    x - textWidth / 2 - pillPadding,
    y - pillHeight / 2,
    textWidth + pillPadding * 2,
    pillHeight,
    13
  );
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillText(labelText, x, y);
}

function drawLossCurves(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const graphWidth = width * 0.9;
  const graphHeight = height * 0.75;
  const graphLeft = centerX - graphWidth / 2;
  const graphTop = centerY - graphHeight / 2;

  const baseAlpha = Math.min(1, progress) * alpha;

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${baseAlpha * 0.4})`;
  ctx.lineWidth = 1.5;

  // Y axis
  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop);
  ctx.lineTo(graphLeft, graphTop + graphHeight);
  ctx.stroke();

  // X axis
  ctx.beginPath();
  ctx.moveTo(graphLeft, graphTop + graphHeight);
  ctx.lineTo(graphLeft + graphWidth, graphTop + graphHeight);
  ctx.stroke();

  // Axis labels
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${baseAlpha * 0.6})`;
  ctx.textAlign = 'center';
  ctx.fillText('Epochs', centerX, graphTop + graphHeight + 22);

  ctx.save();
  ctx.translate(graphLeft - 18, centerY);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Loss', 0, 0);
  ctx.restore();

  // Generate curve points
  const numPoints = Math.floor(100 * progress);
  const trainingCurve: [number, number][] = [];
  const validationCurve: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = i / 100;
    const x = graphLeft + t * graphWidth;

    // Training loss: smooth decrease
    const trainLoss = 2.5 * Math.exp(-3 * t) + 0.1;
    const trainY = graphTop + (1 - trainLoss / 3) * graphHeight;
    trainingCurve.push([x, trainY]);

    // Validation loss: decreases then increases (overfitting)
    const valLoss =
      2.5 * Math.exp(-2.5 * t) + 0.3 + (t > 0.4 ? Math.pow(t - 0.4, 2) * 3 : 0);
    const valY = graphTop + (1 - valLoss / 3) * graphHeight;
    validationCurve.push([x, Math.max(graphTop, valY)]);
  }

  // Draw training curve
  if (trainingCurve.length > 1) {
    ctx.strokeStyle = `rgba(60, 140, 80, ${baseAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(trainingCurve[0][0], trainingCurve[0][1]);
    for (let i = 1; i < trainingCurve.length; i++) {
      ctx.lineTo(trainingCurve[i][0], trainingCurve[i][1]);
    }
    ctx.stroke();
  }

  // Draw validation curve
  if (validationCurve.length > 1) {
    ctx.strokeStyle = `rgba(200, 60, 60, ${baseAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(validationCurve[0][0], validationCurve[0][1]);
    for (let i = 1; i < validationCurve.length; i++) {
      ctx.lineTo(validationCurve[i][0], validationCurve[i][1]);
    }
    ctx.stroke();
  }

  // Legend
  if (progress > 0.2) {
    const legendAlpha = Math.min(1, (progress - 0.2) / 0.15) * alpha;
    const legendX = graphLeft + graphWidth - 100;
    const legendY = graphTop + 20;

    // Training legend
    ctx.fillStyle = `rgba(60, 140, 80, ${legendAlpha})`;
    ctx.beginPath();
    ctx.arc(legendX, legendY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.85})`;
    ctx.textAlign = 'left';
    ctx.fillText('Training', legendX + 12, legendY + 4);

    // Validation legend
    ctx.fillStyle = `rgba(200, 60, 60, ${legendAlpha})`;
    ctx.beginPath();
    ctx.arc(legendX, legendY + 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.85})`;
    ctx.fillText('Validation', legendX + 12, legendY + 26);
  }

  // Overfitting zone indicator
  if (progress > 0.5) {
    const zoneAlpha = Math.min(1, (progress - 0.5) / 0.2) * alpha;
    const overfitStartX = graphLeft + 0.4 * graphWidth;

    ctx.fillStyle = `rgba(200, 60, 60, ${zoneAlpha * 0.12})`;
    ctx.fillRect(
      overfitStartX,
      graphTop,
      graphWidth - (overfitStartX - graphLeft),
      graphHeight
    );

    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(200, 60, 60, ${zoneAlpha * 0.8})`;
    ctx.fillText(
      'Overfitting Zone',
      overfitStartX + (graphWidth - (overfitStartX - graphLeft)) / 2,
      graphTop + 35
    );
  }
}

function drawDropoutVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const layerGap = width / 4;
  const neuronRadius = 14;
  const layerSizes = [4, 6, 6, 2];

  // Determine which neurons are "dropped" based on progress
  const dropoutRate = 0.5;
  const seed = Math.floor(progress * 5); // Changes dropout pattern over time
  const droppedNeurons: Set<string> = new Set();

  // Generate dropout pattern (deterministic based on seed)
  for (let layer = 1; layer < layerSizes.length - 1; layer++) {
    for (let neuron = 0; neuron < layerSizes[layer]; neuron++) {
      const hash = (seed * 31 + layer * 17 + neuron * 13) % 100;
      if (hash < dropoutRate * 100) {
        droppedNeurons.add(`${layer}-${neuron}`);
      }
    }
  }

  // Draw layers
  for (let layer = 0; layer < layerSizes.length; layer++) {
    const layerX = centerX - width / 2 + (layer + 0.5) * layerGap;
    const numNeurons = layerSizes[layer];
    const layerHeight = (numNeurons - 1) * (neuronRadius * 2 + 12);
    const startY = centerY - layerHeight / 2;

    // Draw connections first (behind neurons)
    if (layer < layerSizes.length - 1) {
      const nextLayerX = centerX - width / 2 + (layer + 1.5) * layerGap;
      const nextNumNeurons = layerSizes[layer + 1];
      const nextLayerHeight = (nextNumNeurons - 1) * (neuronRadius * 2 + 12);
      const nextStartY = centerY - nextLayerHeight / 2;

      for (let i = 0; i < numNeurons; i++) {
        const fromY = startY + i * (neuronRadius * 2 + 12);
        const fromDropped = droppedNeurons.has(`${layer}-${i}`);

        for (let j = 0; j < nextNumNeurons; j++) {
          const toY = nextStartY + j * (neuronRadius * 2 + 12);
          const toDropped = droppedNeurons.has(`${layer + 1}-${j}`);

          // Fade connections if either end is dropped
          const connectionAlpha = fromDropped || toDropped ? 0.08 : 0.35;

          ctx.strokeStyle = `rgba(100, 100, 100, ${connectionAlpha * alpha})`;
          ctx.lineWidth = fromDropped || toDropped ? 0.5 : 1.5;
          ctx.beginPath();
          ctx.moveTo(layerX + neuronRadius, fromY);
          ctx.lineTo(nextLayerX - neuronRadius, toY);
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    for (let i = 0; i < numNeurons; i++) {
      const y = startY + i * (neuronRadius * 2 + 12);
      const isDropped = droppedNeurons.has(`${layer}-${i}`);
      const isInputOrOutput = layer === 0 || layer === layerSizes.length - 1;

      // Neuron circle
      if (isDropped && !isInputOrOutput) {
        // Dropped neuron - X mark
        ctx.strokeStyle = `rgba(200, 60, 60, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(layerX, y, neuronRadius, 0, Math.PI * 2);
        ctx.stroke();

        // X mark
        const xSize = neuronRadius * 0.6;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(layerX - xSize, y - xSize);
        ctx.lineTo(layerX + xSize, y + xSize);
        ctx.moveTo(layerX + xSize, y - xSize);
        ctx.lineTo(layerX - xSize, y + xSize);
        ctx.stroke();
      } else {
        // Active neuron
        const color = isInputOrOutput
          ? 'rgba(100, 100, 200, '
          : 'rgba(60, 140, 80, ';
        ctx.fillStyle = color + alpha * 0.75 + ')';
        ctx.beginPath();
        ctx.arc(layerX, y, neuronRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color + alpha + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Layer labels
    const labelY = centerY + height / 2 - 20;
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;

    const labels = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
    ctx.fillText(labels[layer], layerX, labelY);
  }

  // Dropout label with rate
  if (progress > 0.2) {
    const labelAlpha = Math.min(1, (progress - 0.2) / 0.15) * alpha;

    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(200, 60, 60, ${labelAlpha * 0.9})`;
    ctx.fillText('Dropout Rate: 50%', centerX, centerY - height / 2);

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.7})`;
    ctx.fillText(
      'Pattern changes each training batch',
      centerX,
      centerY - height / 2 + 20
    );
  }
}
