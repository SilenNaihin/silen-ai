'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface OverfittingAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Overfitting Animation showing:
 * Phase 1 (0-0.35): Training vs validation loss divergence
 * Phase 2 (0.35-0.70): Dropout visualization with neurons turning off
 * Phase 3 (0.70-1.0): Regularization effects comparison
 */
export function OverfittingAnimation({ progress, className = '' }: OverfittingAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY, phase);

    // Phase 1: Training vs Validation loss curves (0-0.40)
    if (progress < 0.40) {
      const fadeOut = progress > 0.32 ? 1 - (progress - 0.32) / 0.08 : 1;
      const curveProgress = Math.min(1, progress / 0.30);
      drawLossCurves(ctx, width * 0.5, height * 0.52, width * 0.8, height * 0.65, curveProgress, fadeOut);
    }

    // Phase 2: Dropout visualization (0.35-0.75)
    if (progress >= 0.32 && progress < 0.75) {
      const fadeIn = progress < 0.38 ? (progress - 0.32) / 0.06 : 1;
      const fadeOut = progress > 0.67 ? 1 - (progress - 0.67) / 0.08 : 1;
      const dropoutProgress = Math.min(1, (progress - 0.35) / 0.35);
      drawDropoutVisualization(ctx, width * 0.5, height * 0.52, width * 0.85, height * 0.7, dropoutProgress, fadeIn * fadeOut);
    }

    // Phase 3: Regularization comparison (0.70-1.0)
    if (progress >= 0.67) {
      const fadeIn = progress < 0.73 ? (progress - 0.67) / 0.06 : 1;
      const regProgress = Math.min(1, (progress - 0.70) / 0.28);
      drawRegularizationComparison(ctx, width * 0.5, height * 0.52, width * 0.85, height * 0.7, regProgress, fadeIn);
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
    1: 'Overfitting: When Memorization Beats Learning',
    2: 'Dropout: Random Resilience',
    3: 'Regularization: The Cure',
  };
  ctx.fillText(titles[phase] || 'Overfitting', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: 'Training loss drops, validation loss rises',
    2: progress > 0.55 ? 'Forcing the network to be robust' : 'Randomly disabling neurons during training',
    3: progress > 0.85 ? 'Simpler models generalize better' : 'Multiple techniques work together',
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

function drawLossCurves(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const halfW = width / 2;
  const halfH = height / 2;
  const left = centerX - halfW;
  const top = centerY - halfH;
  const graphWidth = width * 0.85;
  const graphHeight = height * 0.7;
  const graphLeft = centerX - graphWidth / 2;
  const graphTop = top + 25;

  const baseAlpha = Math.min(1, progress) * alpha;

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${baseAlpha * 0.3})`;
  ctx.lineWidth = 1;

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
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${baseAlpha * 0.5})`;
  ctx.textAlign = 'center';
  ctx.fillText('Epochs', centerX, graphTop + graphHeight + 18);

  ctx.save();
  ctx.translate(graphLeft - 12, centerY - 10);
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
    const valLoss = 2.5 * Math.exp(-2.5 * t) + 0.3 + (t > 0.4 ? Math.pow(t - 0.4, 2) * 3 : 0);
    const valY = graphTop + (1 - valLoss / 3) * graphHeight;
    validationCurve.push([x, Math.max(graphTop, valY)]);
  }

  // Draw training curve
  if (trainingCurve.length > 1) {
    ctx.strokeStyle = `rgba(60, 140, 80, ${baseAlpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(trainingCurve[0][0], trainingCurve[0][1]);
    for (let i = 1; i < trainingCurve.length; i++) {
      ctx.lineTo(trainingCurve[i][0], trainingCurve[i][1]);
    }
    ctx.stroke();
  }

  // Draw validation curve
  if (validationCurve.length > 1) {
    ctx.strokeStyle = `rgba(200, 60, 60, ${baseAlpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(validationCurve[0][0], validationCurve[0][1]);
    for (let i = 1; i < validationCurve.length; i++) {
      ctx.lineTo(validationCurve[i][0], validationCurve[i][1]);
    }
    ctx.stroke();
  }

  // Legend
  if (progress > 0.3) {
    const legendAlpha = Math.min(1, (progress - 0.3) / 0.2) * alpha;
    const legendX = graphLeft + graphWidth - 90;
    const legendY = graphTop + 15;

    // Training legend
    ctx.fillStyle = `rgba(60, 140, 80, ${legendAlpha})`;
    ctx.beginPath();
    ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.8})`;
    ctx.textAlign = 'left';
    ctx.fillText('Training', legendX + 10, legendY + 3);

    // Validation legend
    ctx.fillStyle = `rgba(200, 60, 60, ${legendAlpha})`;
    ctx.beginPath();
    ctx.arc(legendX, legendY + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.8})`;
    ctx.fillText('Validation', legendX + 10, legendY + 21);
  }

  // Overfitting zone indicator
  if (progress > 0.6) {
    const zoneAlpha = Math.min(1, (progress - 0.6) / 0.2) * alpha;
    const overfitStartX = graphLeft + 0.4 * graphWidth;

    ctx.fillStyle = `rgba(200, 60, 60, ${zoneAlpha * 0.1})`;
    ctx.fillRect(overfitStartX, graphTop, graphWidth - (overfitStartX - graphLeft), graphHeight);

    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(200, 60, 60, ${zoneAlpha * 0.7})`;
    ctx.fillText('Overfitting Zone', overfitStartX + (graphWidth - (overfitStartX - graphLeft)) / 2, graphTop + 30);
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
  const neuronRadius = 12;
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
    const layerHeight = (numNeurons - 1) * (neuronRadius * 2 + 10);
    const startY = centerY - layerHeight / 2;

    // Draw connections first (behind neurons)
    if (layer < layerSizes.length - 1) {
      const nextLayerX = centerX - width / 2 + (layer + 1.5) * layerGap;
      const nextNumNeurons = layerSizes[layer + 1];
      const nextLayerHeight = (nextNumNeurons - 1) * (neuronRadius * 2 + 10);
      const nextStartY = centerY - nextLayerHeight / 2;

      for (let i = 0; i < numNeurons; i++) {
        const fromY = startY + i * (neuronRadius * 2 + 10);
        const fromDropped = droppedNeurons.has(`${layer}-${i}`);

        for (let j = 0; j < nextNumNeurons; j++) {
          const toY = nextStartY + j * (neuronRadius * 2 + 10);
          const toDropped = droppedNeurons.has(`${layer + 1}-${j}`);

          // Fade connections if either end is dropped
          const connectionAlpha = (fromDropped || toDropped) ? 0.1 : 0.3;

          ctx.strokeStyle = `rgba(100, 100, 100, ${connectionAlpha * alpha})`;
          ctx.lineWidth = fromDropped || toDropped ? 0.5 : 1;
          ctx.beginPath();
          ctx.moveTo(layerX + neuronRadius, fromY);
          ctx.lineTo(nextLayerX - neuronRadius, toY);
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    for (let i = 0; i < numNeurons; i++) {
      const y = startY + i * (neuronRadius * 2 + 10);
      const isDropped = droppedNeurons.has(`${layer}-${i}`);
      const isInputOrOutput = layer === 0 || layer === layerSizes.length - 1;

      // Neuron circle
      if (isDropped && !isInputOrOutput) {
        // Dropped neuron - X mark
        ctx.strokeStyle = `rgba(200, 60, 60, ${alpha * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(layerX, y, neuronRadius, 0, Math.PI * 2);
        ctx.stroke();

        // X mark
        const xSize = neuronRadius * 0.6;
        ctx.beginPath();
        ctx.moveTo(layerX - xSize, y - xSize);
        ctx.lineTo(layerX + xSize, y + xSize);
        ctx.moveTo(layerX + xSize, y - xSize);
        ctx.lineTo(layerX - xSize, y + xSize);
        ctx.stroke();
      } else {
        // Active neuron
        const color = isInputOrOutput ? 'rgba(100, 100, 200, ' : 'rgba(60, 140, 80, ';
        ctx.fillStyle = color + (alpha * 0.7) + ')';
        ctx.beginPath();
        ctx.arc(layerX, y, neuronRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color + alpha + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Layer labels
    const labelY = centerY + height / 2 - 25;
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;

    const labels = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
    ctx.fillText(labels[layer], layerX, labelY);
  }

  // Dropout label with rate
  if (progress > 0.3) {
    const labelAlpha = Math.min(1, (progress - 0.3) / 0.2) * alpha;

    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(200, 60, 60, ${labelAlpha * 0.8})`;
    ctx.fillText('Dropout Rate: 50%', centerX, centerY - height / 2 + 30);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.6})`;
    ctx.fillText('Dropped neurons change each batch', centerX, centerY - height / 2 + 45);
  }
}

function drawRegularizationComparison(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const techniques = [
    { name: 'Dropout', effect: 'Randomly disables neurons', icon: '⊗' },
    { name: 'Weight Decay', effect: 'Penalizes large weights', icon: 'λ' },
    { name: 'Early Stopping', effect: 'Stops before overfitting', icon: '⏹' },
    { name: 'Data Augmentation', effect: 'More training variety', icon: '✚' },
  ];

  const cardWidth = width / 4 - 15;
  const cardHeight = height * 0.55;
  const startX = centerX - width / 2 + 10;
  const cardY = centerY - cardHeight / 2;

  techniques.forEach((tech, i) => {
    const delay = i * 0.15;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.3));

    if (itemProgress > 0) {
      const cardX = startX + i * (cardWidth + 10);
      const itemAlpha = itemProgress * alpha;

      // Card background
      ctx.fillStyle = `rgba(245, 245, 245, ${itemAlpha})`;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 8);
      ctx.fill();

      ctx.strokeStyle = `rgba(200, 200, 200, ${itemAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Icon
      ctx.font = '24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(60, 140, 80, ${itemAlpha})`;
      ctx.fillText(tech.icon, cardX + cardWidth / 2, cardY + 35);

      // Name
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.9})`;
      ctx.fillText(tech.name, cardX + cardWidth / 2, cardY + 60);

      // Effect (wrapped text)
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemAlpha * 0.6})`;
      const words = tech.effect.split(' ');
      let line = '';
      let lineY = cardY + 78;

      words.forEach((word) => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > cardWidth - 10) {
          ctx.fillText(line.trim(), cardX + cardWidth / 2, lineY);
          line = word + ' ';
          lineY += 12;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line.trim(), cardX + cardWidth / 2, lineY);
    }
  });

  // Summary insight
  if (progress > 0.7) {
    const insightAlpha = Math.min(1, (progress - 0.7) / 0.2) * alpha;
    const insightY = cardY + cardHeight + 25;

    ctx.fillStyle = `rgba(60, 140, 80, ${insightAlpha * 0.1})`;
    ctx.beginPath();
    ctx.roundRect(centerX - width * 0.4, insightY, width * 0.8, 40, 8);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${insightAlpha * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${insightAlpha * 0.8})`;
    ctx.fillText('All techniques share a goal: prevent the network from', centerX, insightY + 15);
    ctx.fillText('memorizing training data instead of learning patterns', centerX, insightY + 28);
  }
}
