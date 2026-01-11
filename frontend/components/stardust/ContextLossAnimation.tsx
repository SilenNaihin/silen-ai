'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ContextLossAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Context Loss Animation demonstrating long-term context loss in RNNs
 *
 * Phase 1 (0-0.25): Show sentence with "cat" highlighted as the subject
 * Phase 2 (0.25-0.50): RNN processing, hidden state updating at each word
 * Phase 3 (0.50-0.70): Information about "cat" fading as more tokens are processed
 * Phase 4 (0.70-0.85): Final prediction fails - network "forgot" about "cat"
 * Phase 5 (0.85-1.0): LSTM comparison - cell state maintains "cat" information
 */
export function ContextLossAnimation({
  progress,
  className = '',
}: ContextLossAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const sentenceY = height * 0.18;
    const rnnY = height * 0.42;
    const memoryBarY = height * 0.62;
    const lstmY = height * 0.78;
    const phaseLabelY = height * 0.94;

    // Sentence tokens
    const tokens = ['The', 'cat', ',', 'which', 'sat', 'on', 'the', 'mat', 'and', 'ate', 'the', 'fish', ',', '___'];

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Phase 1+: Show sentence
    drawSentence(ctx, width * 0.5, sentenceY, tokens, progress, phase);

    // Phase 2+: RNN processing visualization
    if (progress >= 0.25) {
      const rnnProgress = Math.min(1, (progress - 0.25) / 0.25);
      drawRNNProcessing(ctx, width, rnnY, tokens, rnnProgress, phase, progress);
    }

    // Phase 3+: Memory fade visualization
    if (progress >= 0.50) {
      const fadeProgress = Math.min(1, (progress - 0.50) / 0.20);
      drawMemoryFade(ctx, width, memoryBarY, fadeProgress, phase);
    }

    // Phase 4+: Prediction failure
    if (progress >= 0.70 && progress < 0.85) {
      const failProgress = Math.min(1, (progress - 0.70) / 0.15);
      drawPredictionFailure(ctx, width, rnnY + 30, failProgress);
    }

    // Phase 5: LSTM comparison
    if (progress >= 0.85) {
      const lstmProgress = Math.min(1, (progress - 0.85) / 0.15);
      drawLSTMComparison(ctx, width, lstmY, lstmProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);
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
  if (progress < 0.70) return 3;
  if (progress < 0.85) return 4;
  return 5;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Long-Term Context Loss in RNNs', x, y);
}

function drawSentence(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  tokens: string[],
  progress: number,
  phase: number
) {
  const alpha = Math.min(1, progress / 0.15);

  // Calculate total width for centering
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  let totalWidth = 0;
  const tokenWidths: number[] = [];

  tokens.forEach((token, i) => {
    const w = ctx.measureText(token).width + (i < tokens.length - 1 ? 6 : 0);
    tokenWidths.push(w);
    totalWidth += w;
  });

  let currentX = centerX - totalWidth / 2;

  tokens.forEach((token, i) => {
    const isCat = token === 'cat';
    const isBlank = token === '___';

    // Highlight "cat" in all phases
    if (isCat) {
      ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';

      // Draw highlight background
      const tokenW = ctx.measureText(token).width;
      ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.15})`;
      ctx.beginPath();
      ctx.roundRect(currentX - 3, y - 10, tokenW + 6, 20, 4);
      ctx.fill();

      ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
    } else if (isBlank) {
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      if (phase >= 4 && phase < 5) {
        ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.9})`;
      } else if (phase >= 5) {
        ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
      }
    } else {
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(token, currentX, y);

    currentX += tokenWidths[i];
  });

  // Draw annotation for "cat"
  if (progress > 0.1 && phase < 5) {
    const annotationAlpha = Math.min(1, (progress - 0.1) / 0.1);
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(60, 140, 80, ${annotationAlpha * 0.7})`;
    ctx.textAlign = 'center';
    ctx.fillText('subject', centerX - totalWidth / 2 + tokenWidths[0] + tokenWidths[1] / 2, y + 18);
  }
}

function drawRNNProcessing(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  tokens: string[],
  rnnProgress: number,
  phase: number,
  totalProgress: number
) {
  // Show RNN cells processing the sequence
  const cellCount = 8;
  const cellWidth = 35;
  const cellSpacing = 45;
  const startX = (width - (cellCount - 1) * cellSpacing) / 2;

  // Calculate how many cells to show based on progress
  const cellsToShow = Math.floor(rnnProgress * cellCount) + 1;

  for (let i = 0; i < Math.min(cellsToShow, cellCount); i++) {
    const x = startX + i * cellSpacing;
    const cellProgress = Math.min(1, (rnnProgress * cellCount - i));

    if (cellProgress <= 0) continue;

    // Draw RNN cell
    const cellAlpha = cellProgress;

    ctx.strokeStyle = `rgba(0, 0, 0, ${cellAlpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - cellWidth / 2, y - 18, cellWidth, 36, 6);
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${cellAlpha * 0.03})`;
    ctx.fill();

    // Hidden state indicator inside cell
    const hiddenIntensity = getHiddenIntensity(i, phase, totalProgress);
    ctx.fillStyle = `rgba(60, 140, 80, ${cellAlpha * hiddenIntensity * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${cellAlpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(0, 0, 0, ${cellAlpha * 0.6})`;
    ctx.fillText(`h${i + 1}`, x, y);

    // Connection to next cell
    if (i < cellCount - 1 && cellProgress > 0.5) {
      const connAlpha = (cellProgress - 0.5) * 2;
      ctx.strokeStyle = `rgba(0, 0, 0, ${connAlpha * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + cellWidth / 2, y);
      ctx.lineTo(x + cellSpacing - cellWidth / 2, y);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = `rgba(0, 0, 0, ${connAlpha * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(x + cellSpacing - cellWidth / 2, y);
      ctx.lineTo(x + cellSpacing - cellWidth / 2 - 5, y - 3);
      ctx.lineTo(x + cellSpacing - cellWidth / 2 - 5, y + 3);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillText('RNN Hidden States', width / 2, y + 35);
}

function getHiddenIntensity(cellIndex: number, phase: number, progress: number): number {
  // The "cat" information starts strong and fades
  // Cell 0 is "The", Cell 1 is "cat"
  if (phase < 2) return 0.3;

  // After seeing "cat", intensity starts high
  if (cellIndex <= 1) {
    if (phase >= 3) {
      // Start fading based on how far we are
      const fadeAmount = (progress - 0.50) / 0.35;
      return Math.max(0.1, 1 - fadeAmount * 0.8);
    }
    return cellIndex === 1 ? 0.9 : 0.3;
  }

  // Later cells have progressively less "cat" memory
  const baseFade = 1 - (cellIndex - 1) * 0.12;
  if (phase >= 3) {
    const additionalFade = (progress - 0.50) / 0.35;
    return Math.max(0.05, baseFade - additionalFade * 0.7);
  }
  return baseFade;
}

function drawMemoryFade(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  fadeProgress: number,
  phase: number
) {
  const barWidth = 280;
  const barHeight = 25;
  const startX = (width - barWidth) / 2;

  // Background bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.beginPath();
  ctx.roundRect(startX, y, barWidth, barHeight, 6);
  ctx.fill();

  // Memory level - starts full, decreases
  const memoryLevel = Math.max(0.08, 1 - fadeProgress * 0.92);
  const filledWidth = barWidth * memoryLevel;

  // Color transitions from green to red as memory fades
  const r = Math.floor(60 + (180 - 60) * (1 - memoryLevel));
  const g = Math.floor(140 - 80 * (1 - memoryLevel));
  const b = Math.floor(80 - 20 * (1 - memoryLevel));

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
  ctx.beginPath();
  ctx.roundRect(startX, y, filledWidth, barHeight, 6);
  ctx.fill();

  // Label
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillText(`"cat" memory: ${Math.round(memoryLevel * 100)}%`, width / 2, y + barHeight / 2);

  // Title above bar
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillText('Subject Information in Hidden State', width / 2, y - 12);

  // Show tokens being processed
  if (phase >= 3) {
    const tokensProcessed = Math.floor(fadeProgress * 6) + 7;
    ctx.font = '9px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(`Tokens processed: ${tokensProcessed}+`, width / 2, y + barHeight + 15);
  }
}

function drawPredictionFailure(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  failProgress: number
) {
  const alpha = failProgress;

  // Draw failure message
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.9})`;
  ctx.fillText('Prediction: "it" or "they"?', width / 2, y + 60);

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.7})`;
  ctx.fillText('RNN forgot the subject was "cat" (singular)', width / 2, y + 78);

  // X mark
  if (failProgress > 0.5) {
    const xAlpha = (failProgress - 0.5) * 2;
    const xSize = 12;
    const xX = width / 2 - 120;
    const xY = y + 68;

    ctx.strokeStyle = `rgba(180, 60, 60, ${xAlpha * 0.8})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(xX - xSize / 2, xY - xSize / 2);
    ctx.lineTo(xX + xSize / 2, xY + xSize / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xX + xSize / 2, xY - xSize / 2);
    ctx.lineTo(xX - xSize / 2, xY + xSize / 2);
    ctx.stroke();
  }
}

function drawLSTMComparison(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  lstmProgress: number
) {
  const alpha = lstmProgress;

  // LSTM title
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
  ctx.fillText('LSTM Solution: Cell State', width / 2, y - 25);

  // Draw cell state as a highway
  const highwayWidth = 300;
  const startX = (width - highwayWidth) / 2;

  // Cell state highway (top line)
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(startX + highwayWidth, y);
  ctx.stroke();

  // Arrow at end
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.beginPath();
  ctx.moveTo(startX + highwayWidth, y);
  ctx.lineTo(startX + highwayWidth - 8, y - 5);
  ctx.lineTo(startX + highwayWidth - 8, y + 5);
  ctx.closePath();
  ctx.fill();

  // "cat" information bubble traveling along
  if (lstmProgress > 0.3) {
    const bubbleProgress = (lstmProgress - 0.3) / 0.7;
    const bubbleX = startX + 30 + bubbleProgress * (highwayWidth - 60);

    ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(bubbleX, y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText('cat', bubbleX, y);
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.textAlign = 'center';
  ctx.fillText('Cell state preserves long-term dependencies', width / 2, y + 22);

  // Checkmark
  if (lstmProgress > 0.6) {
    const checkAlpha = (lstmProgress - 0.6) / 0.4;

    ctx.strokeStyle = `rgba(60, 140, 80, ${checkAlpha * 0.9})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const checkX = width / 2 + 155;
    const checkY = y + 22;

    ctx.beginPath();
    ctx.moveTo(checkX - 6, checkY);
    ctx.lineTo(checkX - 2, checkY + 5);
    ctx.lineTo(checkX + 6, checkY - 5);
    ctx.stroke();
  }
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  let labelText = '';

  switch (phase) {
    case 1:
      labelText = 'Long sentence with distant subject';
      break;
    case 2:
      labelText = 'RNN processes tokens sequentially';
      break;
    case 3:
      labelText = 'Subject "cat" fading from memory';
      break;
    case 4:
      labelText = 'Prediction fails - context lost';
      break;
    case 5:
      labelText = 'LSTM: Cell state retains context';
      break;
  }

  // Background pill
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

  // Color based on phase
  if (phase === 4) {
    ctx.fillStyle = 'rgba(180, 60, 60, 0.9)';
  } else if (phase === 5) {
    ctx.fillStyle = 'rgba(60, 140, 80, 0.9)';
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  }

  ctx.fillText(labelText, x, y);
}
