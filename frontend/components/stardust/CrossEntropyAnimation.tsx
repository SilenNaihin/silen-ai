'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface CrossEntropyAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Cross-Entropy Animation showing the loss function and gradient
 *
 * Phase 1 (0-0.35): The -log(p) curve with key points
 * Phase 2 (0.35-0.65): Distribution comparison visualization
 * Phase 3 (0.65-1.0): Gradient visualization (p - y)
 */
export function CrossEntropyAnimation({ progress, className = '' }: CrossEntropyAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;

    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY, phase);

    // Phase 1: The -log(p) curve (0-0.35)
    if (progress < 0.40) {
      const fadeOut = progress > 0.32 ? 1 - (progress - 0.32) / 0.08 : 1;
      const curveProgress = Math.min(1, progress / 0.25);
      drawLogCurve(ctx, width * 0.5, height * 0.52, width * 0.75, height * 0.65, curveProgress, progress, fadeOut);
    }

    // Phase 2: Distribution comparison (0.35-0.65)
    if (progress >= 0.32 && progress < 0.70) {
      const fadeIn = progress < 0.38 ? (progress - 0.32) / 0.06 : 1;
      const fadeOut = progress > 0.62 ? 1 - (progress - 0.62) / 0.08 : 1;
      const distProgress = Math.min(1, (progress - 0.35) / 0.25);
      drawDistributionComparison(ctx, width * 0.5, height * 0.52, width * 0.8, height * 0.7, distProgress, fadeIn * fadeOut);
    }

    // Phase 3: Gradient visualization (0.65-1.0)
    if (progress >= 0.62) {
      const fadeIn = progress < 0.68 ? (progress - 0.62) / 0.06 : 1;
      const gradientProgress = Math.min(1, (progress - 0.65) / 0.30);
      drawGradientVisualization(ctx, width * 0.5, height * 0.52, width * 0.8, height * 0.7, gradientProgress, fadeIn);
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
  if (progress < 0.65) return 2;
  return 3;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';

  const titles: Record<number, string> = {
    1: 'Cross-Entropy: Surprise',
    2: 'Cross-Entropy: Distribution Distance',
    3: 'Cross-Entropy: The Gradient',
  };
  ctx.fillText(titles[phase] || 'Cross-Entropy Loss', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: 'Loss = -log(p) measures surprise',
    2: 'How different are these distributions?',
    3: progress >= 0.9 ? 'Gradient = predicted - actual' : 'The gradient pushes toward truth',
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
  ctx.fillStyle = phase === 3 && progress >= 0.9 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawLogCurve(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  totalProgress: number,
  alpha: number
) {
  const halfW = width / 2;
  const halfH = height / 2;
  const left = centerX - halfW;
  const top = centerY - halfH;

  const baseAlpha = Math.min(1, progress) * alpha;

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${baseAlpha * 0.2})`;
  ctx.lineWidth = 1;

  // X axis
  ctx.beginPath();
  ctx.moveTo(left, top + halfH * 1.6);
  ctx.lineTo(left + width, top + halfH * 1.6);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(left + 20, top);
  ctx.lineTo(left + 20, top + halfH * 1.6);
  ctx.stroke();

  // Axis labels
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${baseAlpha * 0.5})`;
  ctx.textAlign = 'center';
  ctx.fillText('probability (p)', centerX, top + halfH * 1.6 + 18);

  ctx.save();
  ctx.translate(left + 8, centerY - 10);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('loss = -log(p)', 0, 0);
  ctx.restore();

  // Draw the -log(p) curve
  const curvePoints: [number, number][] = [];
  const numPoints = Math.floor(100 * progress);

  for (let i = 0; i < numPoints; i++) {
    const p = 0.01 + (i / 100) * 0.98;
    const loss = -Math.log(p);
    const x = left + 20 + p * (width - 40);
    const y = top + halfH * 1.6 - (loss / 5) * halfH * 1.4;
    curvePoints.push([x, Math.max(top, y)]);
  }

  if (curvePoints.length > 1) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${baseAlpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(curvePoints[0][0], curvePoints[0][1]);
    for (let i = 1; i < curvePoints.length; i++) {
      ctx.lineTo(curvePoints[i][0], curvePoints[i][1]);
    }
    ctx.stroke();
  }

  // Annotate key points
  if (progress > 0.5) {
    const annotationAlpha = Math.min(1, (progress - 0.5) * 2) * alpha;

    const annotations = [
      { p: 0.9, label: 'Low loss', sublabel: 'p=0.9', color: 'rgba(60, 140, 80, ' },
      { p: 0.5, label: 'Medium', sublabel: 'p=0.5', color: 'rgba(100, 100, 100, ' },
      { p: 0.1, label: 'High loss', sublabel: 'p=0.1', color: 'rgba(200, 60, 60, ' },
    ];

    annotations.forEach(({ p, label, sublabel, color }) => {
      const loss = -Math.log(p);
      const x = left + 20 + p * (width - 40);
      const y = top + halfH * 1.6 - (loss / 5) * halfH * 1.4;

      ctx.fillStyle = color + annotationAlpha * 0.9 + ')';
      ctx.beginPath();
      ctx.arc(x, Math.max(top + 10, y), 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${annotationAlpha * 0.7})`;
      ctx.fillText(label, x, Math.max(top + 25, y) + 15);
      ctx.fillText(sublabel, x, Math.max(top + 25, y) + 26);
    });
  }

  // Formula
  if (progress > 0.3) {
    const formulaAlpha = Math.min(1, (progress - 0.3) / 0.2) * alpha;
    ctx.font = 'italic 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.8})`;
    ctx.fillText('Loss = -log(p)', centerX, top + 15);
  }
}

function drawDistributionComparison(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const barWidth = 45;
  const maxBarHeight = height * 0.35;
  const gap = 15;
  const groupGap = 50;

  // True distribution (one-hot: class 1 is correct)
  const trueProbs = [0, 1, 0];
  // Predicted distribution (softmax output)
  const predProbs = [0.2, 0.6, 0.2];

  const numClasses = 3;
  const singleGroupWidth = numClasses * barWidth + (numClasses - 1) * gap;
  const totalWidth = singleGroupWidth * 2 + groupGap;
  const startX = centerX - totalWidth / 2;

  // Draw "True" distribution
  const trueStartX = startX;
  drawDistributionBars(ctx, trueStartX, centerY, barWidth, maxBarHeight, gap, trueProbs, 'True (y)', progress, alpha, '#339933');

  // Draw "Predicted" distribution
  const predStartX = startX + singleGroupWidth + groupGap;
  drawDistributionBars(ctx, predStartX, centerY, barWidth, maxBarHeight, gap, predProbs, 'Predicted (p)', progress, alpha, '#3366cc');

  // Cross-entropy formula and value
  if (progress > 0.4) {
    const formulaAlpha = Math.min(1, (progress - 0.4) / 0.2) * alpha;

    // Calculate cross-entropy
    let ce = 0;
    for (let i = 0; i < trueProbs.length; i++) {
      if (trueProbs[i] > 0) {
        ce -= trueProbs[i] * Math.log(predProbs[i] + 1e-10);
      }
    }

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.7})`;
    ctx.fillText('H(true, pred) = -Σ yᵢ log(pᵢ)', centerX, centerY + height * 0.32);

    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.9})`;
    ctx.fillText(`= ${ce.toFixed(3)}`, centerX, centerY + height * 0.32 + 18);
  }

  // Arrow between distributions
  if (progress > 0.2) {
    const arrowAlpha = Math.min(1, (progress - 0.2) / 0.2) * alpha;
    const arrowY = centerY - height * 0.1;
    const arrowStartX = trueStartX + singleGroupWidth + 8;
    const arrowEndX = predStartX - 8;

    ctx.strokeStyle = `rgba(0, 0, 0, ${arrowAlpha * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowY);
    ctx.lineTo(arrowEndX - 6, arrowY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow head
    ctx.fillStyle = `rgba(0, 0, 0, ${arrowAlpha * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowY);
    ctx.lineTo(arrowEndX - 8, arrowY - 4);
    ctx.lineTo(arrowEndX - 8, arrowY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${arrowAlpha * 0.5})`;
    ctx.fillText('distance?', (arrowStartX + arrowEndX) / 2, arrowY - 10);
  }
}

function drawDistributionBars(
  ctx: CanvasRenderingContext2D,
  startX: number,
  centerY: number,
  barWidth: number,
  maxHeight: number,
  gap: number,
  probs: number[],
  label: string,
  progress: number,
  alpha: number,
  color: string
) {
  const baseY = centerY + maxHeight * 0.3;

  // Label
  const groupWidth = probs.length * barWidth + (probs.length - 1) * gap;
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.fillText(label, startX + groupWidth / 2, centerY - maxHeight * 0.55);

  probs.forEach((p, i) => {
    const delay = i * 0.1;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.3));
    const x = startX + i * (barWidth + gap);

    if (itemProgress > 0) {
      const barHeight = p * maxHeight * easeOutCubic(itemProgress);

      // Bar
      ctx.fillStyle = color;
      ctx.globalAlpha = itemProgress * alpha * 0.7;
      ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);
      ctx.globalAlpha = 1;

      // Border
      ctx.strokeStyle = color;
      ctx.globalAlpha = itemProgress * alpha;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, baseY - barHeight, barWidth, barHeight);
      ctx.globalAlpha = 1;

      // Probability value
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * alpha * 0.8})`;
      ctx.fillText(p.toFixed(1), x + barWidth / 2, baseY - barHeight - 6);

      // Class label
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * alpha * 0.6})`;
      ctx.fillText(`c${i}`, x + barWidth / 2, baseY + 12);
    }
  });
}

function drawGradientVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  alpha: number
) {
  const baseAlpha = alpha;

  // Three class visualization
  const classes = [
    { name: 'Class 0', p: 0.20, y: 0, isCorrect: false },
    { name: 'Class 1', p: 0.60, y: 1, isCorrect: true },
    { name: 'Class 2', p: 0.20, y: 0, isCorrect: false },
  ];

  const barWidth = 55;
  const barMaxHeight = height * 0.28;
  const gap = 20;
  const totalWidth = classes.length * barWidth + (classes.length - 1) * gap;
  let x = centerX - totalWidth / 2;
  const baseY = centerY + height * 0.08;

  // Subtitle
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${baseAlpha * 0.6})`;
  ctx.fillText('Gradient = p - y  (predicted minus actual)', centerX, centerY - height * 0.38);

  classes.forEach((cls, i) => {
    const delay = i * 0.12;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.25));

    if (itemProgress > 0) {
      // Predicted probability bar
      const pBarHeight = cls.p * barMaxHeight * itemProgress;
      ctx.fillStyle = `rgba(100, 100, 100, ${itemProgress * baseAlpha * 0.3})`;
      ctx.fillRect(x, baseY - pBarHeight, barWidth, pBarHeight);
      ctx.strokeStyle = `rgba(0, 0, 0, ${itemProgress * baseAlpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, baseY - pBarHeight, barWidth, pBarHeight);

      // Probability label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * baseAlpha * 0.8})`;
      ctx.fillText(`p=${cls.p.toFixed(2)}`, x + barWidth / 2, baseY - pBarHeight - 8);

      // Class name
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * baseAlpha * 0.6})`;
      ctx.fillText(cls.name, x + barWidth / 2, baseY + 14);

      // True label indicator
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      if (cls.isCorrect) {
        ctx.fillStyle = `rgba(60, 140, 80, ${itemProgress * baseAlpha * 0.9})`;
        ctx.fillText('y=1 (true)', x + barWidth / 2, baseY + 26);
      } else {
        ctx.fillStyle = `rgba(150, 150, 150, ${itemProgress * baseAlpha * 0.6})`;
        ctx.fillText('y=0', x + barWidth / 2, baseY + 26);
      }

      // Gradient arrow
      if (progress > 0.35) {
        const arrowProgress = Math.min(1, (progress - 0.35) / 0.25);
        const gradient = cls.p - cls.y;
        const arrowY = baseY + 45;
        const arrowLength = Math.abs(gradient) * 70 * arrowProgress;
        const arrowColor = gradient < 0 ? 'rgba(60, 140, 80, ' : 'rgba(200, 60, 60, ';

        ctx.strokeStyle = arrowColor + arrowProgress * baseAlpha * 0.8 + ')';
        ctx.fillStyle = arrowColor + arrowProgress * baseAlpha * 0.8 + ')';
        ctx.lineWidth = 2.5;

        const arrowX = x + barWidth / 2;
        const direction = gradient < 0 ? -1 : 1;

        // Arrow line
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + arrowLength * direction, arrowY);
        ctx.stroke();

        // Arrow head
        if (arrowLength > 5) {
          ctx.beginPath();
          ctx.moveTo(arrowX + arrowLength * direction, arrowY);
          ctx.lineTo(arrowX + (arrowLength - 7) * direction, arrowY - 5);
          ctx.lineTo(arrowX + (arrowLength - 7) * direction, arrowY + 5);
          ctx.closePath();
          ctx.fill();
        }

        // Gradient value
        ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = arrowColor + arrowProgress * baseAlpha * 0.9 + ')';
        ctx.fillText(`${gradient >= 0 ? '+' : ''}${gradient.toFixed(2)}`, arrowX, arrowY + 18);
      }
    }

    x += barWidth + gap;
  });

  // Insight box
  if (progress > 0.7) {
    const boxAlpha = Math.min(1, (progress - 0.7) / 0.2) * baseAlpha;
    const boxY = centerY + height * 0.35;
    const boxWidth = width * 0.85;
    const boxHeight = 45;

    ctx.fillStyle = `rgba(60, 140, 80, ${boxAlpha * 0.1})`;
    ctx.beginPath();
    ctx.roundRect(centerX - boxWidth / 2, boxY, boxWidth, boxHeight, 8);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${boxAlpha * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${boxAlpha * 0.8})`;
    ctx.fillText('Negative gradient → increase this probability', centerX, boxY + 16);
    ctx.fillStyle = `rgba(0, 0, 0, ${boxAlpha * 0.6})`;
    ctx.fillText('Positive gradient → decrease this probability', centerX, boxY + 32);
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
