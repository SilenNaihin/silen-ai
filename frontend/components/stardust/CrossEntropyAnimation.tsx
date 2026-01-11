'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface CrossEntropyAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Cross-Entropy Animation showing the loss function and gradient
 *
 * Phase 1 (0-0.25): The -log(p) curve appears with "surprise" label
 * Phase 2 (0.25-0.50): Three prediction scenarios appear as bars
 * Phase 3 (0.50-0.75): Gradient visualization (p - y)
 * Phase 4 (0.75-1.0): Show gradient strength relationship
 */
export function CrossEntropyAnimation({ progress, className = '' }: CrossEntropyAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const phaseLabelY = height * 0.94;

    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Phase 1: The -log(p) curve
    if (progress < 0.50) {
      const curveProgress = Math.min(1, progress / 0.20);
      drawLogCurve(ctx, width * 0.5, height * 0.52, width * 0.75, height * 0.65, curveProgress, progress);
    }

    // Phase 2: Prediction scenarios
    if (progress >= 0.25 && progress < 0.75) {
      const scenarioProgress = Math.min(1, (progress - 0.25) / 0.20);
      drawScenarios(ctx, width * 0.5, height * 0.52, width * 0.75, height * 0.65, scenarioProgress);
    }

    // Phase 3-4: Gradient visualization
    if (progress >= 0.50) {
      const gradientProgress = Math.min(1, (progress - 0.50) / 0.25);
      const strengthProgress = progress >= 0.75 ? Math.min(1, (progress - 0.75) / 0.25) : 0;
      drawGradientVisualization(ctx, width * 0.5, height * 0.52, width * 0.8, height * 0.7, gradientProgress, strengthProgress);
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
  if (progress < 0.25) return 1;
  if (progress < 0.50) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Cross-Entropy Loss', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: 'The Surprise Function',
    2: 'Comparing Predictions',
    3: 'The Gradient: p - y',
    4: progress >= 0.9 ? 'Automatic Error Correction!' : 'Gradient Strength',
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
  ctx.fillStyle = phase === 4 && progress >= 0.9 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawLogCurve(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  totalProgress: number
) {
  const halfW = width / 2;
  const halfH = height / 2;
  const left = centerX - halfW;
  const top = centerY - halfH;

  const alpha = Math.min(1, progress);

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
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
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
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
    const p = 0.01 + (i / 100) * 0.98; // p from 0.01 to 0.99
    const loss = -Math.log(p);

    // Scale to canvas
    const x = left + 20 + p * (width - 40);
    const y = top + halfH * 1.6 - (loss / 5) * halfH * 1.4; // Scale loss (max ~4.6 at p=0.01)

    curvePoints.push([x, Math.max(top, y)]);
  }

  if (curvePoints.length > 1) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(curvePoints[0][0], curvePoints[0][1]);
    for (let i = 1; i < curvePoints.length; i++) {
      ctx.lineTo(curvePoints[i][0], curvePoints[i][1]);
    }
    ctx.stroke();
  }

  // Annotate key points after curve is drawn
  if (progress > 0.5) {
    const annotationAlpha = (progress - 0.5) * 2;

    const annotations = [
      { p: 0.9, label: 'Confident\ncorrect', color: 'rgba(60, 140, 80, ' },
      { p: 0.5, label: 'Uncertain', color: 'rgba(100, 100, 100, ' },
      { p: 0.1, label: 'Confident\nwrong', color: 'rgba(200, 60, 60, ' },
    ];

    annotations.forEach(({ p, label, color }) => {
      const loss = -Math.log(p);
      const x = left + 20 + p * (width - 40);
      const y = top + halfH * 1.6 - (loss / 5) * halfH * 1.4;

      // Point
      ctx.fillStyle = color + annotationAlpha * 0.9 + ')';
      ctx.beginPath();
      ctx.arc(x, Math.max(top + 10, y), 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.font = '9px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${annotationAlpha * 0.7})`;
      const lines = label.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, x, Math.max(top + 25, y) + 15 + i * 11);
      });
    });
  }

  // Formula
  if (progress > 0.3) {
    const formulaAlpha = Math.min(1, (progress - 0.3) / 0.2);
    ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.8})`;
    ctx.fillText('Loss = -log(p)', centerX, top + 15);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha * 0.5})`;
    ctx.fillText('"surprise" when seeing the true outcome', centerX, top + 32);
  }
}

function drawScenarios(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number
) {
  const scenarios = [
    { label: 'Wrong', p: 0.1, loss: 2.30, color: '#cc3333' },
    { label: 'Uncertain', p: 0.5, loss: 0.69, color: '#666666' },
    { label: 'Correct', p: 0.9, loss: 0.11, color: '#339933' },
  ];

  const barWidth = 60;
  const maxBarHeight = height * 0.5;
  const gap = 30;
  const totalWidth = scenarios.length * barWidth + (scenarios.length - 1) * gap;
  let x = centerX - totalWidth / 2;

  scenarios.forEach((scenario, i) => {
    const delay = i * 0.2;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.4));

    if (itemProgress > 0) {
      const barHeight = (scenario.loss / 2.5) * maxBarHeight * easeOutCubic(itemProgress);
      const barY = centerY + height * 0.25 - barHeight;

      // Bar
      ctx.fillStyle = scenario.color;
      ctx.globalAlpha = itemProgress * 0.8;
      ctx.fillRect(x, barY, barWidth, barHeight);
      ctx.globalAlpha = 1;

      // Border
      ctx.strokeStyle = scenario.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, barY, barWidth, barHeight);

      // Loss value
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * 0.9})`;
      ctx.fillText(`${scenario.loss.toFixed(2)}`, x + barWidth / 2, barY - 8);

      // Label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * 0.7})`;
      ctx.fillText(scenario.label, x + barWidth / 2, centerY + height * 0.25 + 15);
      ctx.fillText(`p=${scenario.p}`, x + barWidth / 2, centerY + height * 0.25 + 28);
    }

    x += barWidth + gap;
  });

  // Title for this view
  if (progress > 0.3) {
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (progress - 0.3) / 0.2) * 0.6})`;
    ctx.fillText('Higher loss = worse prediction', centerX, centerY - height * 0.35);
  }
}

function drawGradientVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number,
  strengthProgress: number
) {
  const alpha = Math.min(1, progress);

  // Title
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
  ctx.fillText('The Gradient: p - y', centerX, centerY - height * 0.4);

  // Subtitle
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('predicted minus actual', centerX, centerY - height * 0.4 + 15);

  // Three class visualization
  const classes = [
    { name: 'Class 0', p: 0.65, y: 1, isCorrect: true },
    { name: 'Class 1', p: 0.25, y: 0, isCorrect: false },
    { name: 'Class 2', p: 0.10, y: 0, isCorrect: false },
  ];

  const barWidth = 50;
  const barMaxHeight = height * 0.25;
  const gap = 25;
  const totalWidth = classes.length * barWidth + (classes.length - 1) * gap;
  let x = centerX - totalWidth / 2;
  const baseY = centerY + height * 0.05;

  classes.forEach((cls, i) => {
    const delay = i * 0.15;
    const itemProgress = Math.min(1, Math.max(0, (progress - delay) / 0.3));

    if (itemProgress > 0) {
      // Predicted probability bar
      const pBarHeight = cls.p * barMaxHeight * itemProgress;
      ctx.fillStyle = `rgba(100, 100, 100, ${itemProgress * 0.3})`;
      ctx.fillRect(x, baseY - pBarHeight, barWidth, pBarHeight);
      ctx.strokeStyle = `rgba(0, 0, 0, ${itemProgress * 0.5})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, baseY - pBarHeight, barWidth, pBarHeight);

      // Probability label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * 0.8})`;
      ctx.fillText(`p=${cls.p.toFixed(2)}`, x + barWidth / 2, baseY - pBarHeight - 8);

      // Class name
      ctx.fillStyle = `rgba(0, 0, 0, ${itemProgress * 0.6})`;
      ctx.fillText(cls.name, x + barWidth / 2, baseY + 15);
      if (cls.isCorrect) {
        ctx.fillStyle = `rgba(60, 140, 80, ${itemProgress * 0.8})`;
        ctx.fillText('(correct)', x + barWidth / 2, baseY + 27);
      }

      // Gradient arrow (after bars appear)
      if (progress > 0.4) {
        const arrowProgress = Math.min(1, (progress - 0.4) / 0.2);
        const gradient = cls.p - cls.y;
        const arrowY = baseY + 45;
        const arrowLength = Math.abs(gradient) * 60 * arrowProgress;
        const arrowColor = gradient < 0 ? 'rgba(60, 140, 80, ' : 'rgba(200, 60, 60, ';

        ctx.strokeStyle = arrowColor + arrowProgress * 0.8 + ')';
        ctx.fillStyle = arrowColor + arrowProgress * 0.8 + ')';
        ctx.lineWidth = 2;

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
          ctx.lineTo(arrowX + (arrowLength - 6) * direction, arrowY - 4);
          ctx.lineTo(arrowX + (arrowLength - 6) * direction, arrowY + 4);
          ctx.closePath();
          ctx.fill();
        }

        // Gradient value
        ctx.font = '9px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = arrowColor + arrowProgress * 0.9 + ')';
        ctx.fillText(`${gradient >= 0 ? '+' : ''}${gradient.toFixed(2)}`, arrowX, arrowY + 18);
      }
    }

    x += barWidth + gap;
  });

  // Phase 4: Gradient strength explanation
  if (strengthProgress > 0) {
    const boxY = centerY + height * 0.32;
    const boxWidth = width * 0.8;
    const boxHeight = 50;

    // Background box
    ctx.fillStyle = `rgba(60, 140, 80, ${strengthProgress * 0.1})`;
    ctx.beginPath();
    ctx.roundRect(centerX - boxWidth / 2, boxY, boxWidth, boxHeight, 8);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${strengthProgress * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${strengthProgress * 0.8})`;
    ctx.fillText('Wrong predictions → larger gradients → faster learning', centerX, boxY + 20);
    ctx.fillStyle = `rgba(0, 0, 0, ${strengthProgress * 0.6})`;
    ctx.fillText('The network automatically focuses on its mistakes!', centerX, boxY + 36);
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
