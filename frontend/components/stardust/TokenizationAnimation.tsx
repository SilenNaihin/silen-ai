'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface TokenizationAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Tokenization Animation showing text being converted to numbers
 *
 * Phase 1 (0-0.20): Text appears character by character
 * Phase 2 (0.20-0.45): Boxes form around tokens (word/subword boundaries)
 * Phase 3 (0.45-0.70): Token IDs appear under each token
 * Phase 4 (0.70-1.0): Tokens flow down and arrange into a tensor/array visualization
 */
export function TokenizationAnimation({ progress, className = '' }: TokenizationAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const textY = height * 0.30;
    const tokensY = height * 0.45;
    const tensorY = height * 0.72;
    const phaseLabelY = height * 0.94;

    // Example text and tokens
    const text = 'Hello world!';
    const tokens = [
      { text: 'Hello', id: 15496 },
      { text: ' world', id: 995 },
      { text: '!', id: 0 },
    ];

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Phase 1: Text appearing
    drawText(ctx, width * 0.5, textY, text, progress);

    // Phase 2+: Token boxes
    if (progress >= 0.20) {
      const tokenProgress = Math.min(1, (progress - 0.20) / 0.25);
      drawTokenBoxes(ctx, width * 0.5, tokensY, tokens, tokenProgress, progress);
    }

    // Phase 3+: Token IDs
    if (progress >= 0.45) {
      const idProgress = Math.min(1, (progress - 0.45) / 0.20);
      drawTokenIds(ctx, width * 0.5, tokensY, tokens, idProgress);
    }

    // Phase 4: Tensor visualization
    if (progress >= 0.70) {
      const tensorProgress = Math.min(1, (progress - 0.70) / 0.30);
      drawTensorVisualization(ctx, width * 0.5, tensorY, tokens, tensorProgress);
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress);

    // Draw flow arrows between stages
    if (progress >= 0.20 && progress < 0.70) {
      const arrowAlpha = progress >= 0.45
        ? Math.min(1, (progress - 0.45) / 0.1)
        : Math.min(1, (progress - 0.20) / 0.1);
      drawFlowArrow(ctx, width * 0.5, textY + 25, width * 0.5, tokensY - 35, arrowAlpha * 0.4);
    }

    if (progress >= 0.70) {
      const arrowAlpha = Math.min(1, (progress - 0.70) / 0.1);
      drawFlowArrow(ctx, width * 0.5, tokensY + 55, width * 0.5, tensorY - 35, arrowAlpha * 0.4);
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
  if (progress < 0.20) return 1;
  if (progress < 0.45) return 2;
  if (progress < 0.70) return 3;
  return 4;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Tokenization', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  let labelText = '';

  switch (phase) {
    case 1:
      labelText = 'Raw Text Input';
      break;
    case 2:
      labelText = 'Splitting into Tokens';
      break;
    case 3:
      labelText = 'Assigning Token IDs';
      break;
    case 4:
      labelText = progress >= 0.9 ? 'Ready for Neural Network' : 'Building Input Tensor';
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
  ctx.fillStyle = phase === 4 && progress >= 0.9 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  progress: number
) {
  const alpha = Math.min(1, progress / 0.15);
  const visibleChars = Math.floor(text.length * Math.min(1, progress / 0.18));

  ctx.font = '20px "SF Mono", Monaco, "Cascadia Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;

  const displayText = text.slice(0, visibleChars);
  ctx.fillText(displayText, x, y);

  // Cursor blink at end during typing
  if (progress < 0.20 && visibleChars < text.length) {
    const cursorBlink = Math.sin(progress * 50) > 0;
    if (cursorBlink) {
      const textWidth = ctx.measureText(displayText).width;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
      ctx.fillRect(x + textWidth / 2 + 2, y - 12, 2, 24);
    }
  }

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.fillText('input string', x, y + 25);
}

interface Token {
  text: string;
  id: number;
}

function drawTokenBoxes(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  tokens: Token[],
  progress: number,
  totalProgress: number
) {
  ctx.font = '16px "SF Mono", Monaco, "Cascadia Code", monospace';

  // Calculate total width
  const padding = 12;
  const gap = 8;
  const tokenWidths = tokens.map(t => ctx.measureText(t.text).width + padding * 2);
  const totalWidth = tokenWidths.reduce((sum, w) => sum + w, 0) + gap * (tokens.length - 1);
  let currentX = centerX - totalWidth / 2;

  tokens.forEach((token, i) => {
    const tokenDelay = i * 0.15;
    const tokenProgress = Math.min(1, (progress - tokenDelay) / 0.3);

    if (tokenProgress > 0) {
      const boxWidth = tokenWidths[i];
      const boxHeight = 32;

      // Box animation: starts as line, expands to full box
      const boxExpand = easeOutCubic(tokenProgress);

      // Border
      ctx.strokeStyle = `rgba(0, 0, 0, ${tokenProgress * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Animated corner radius
      const cornerRadius = 4 * boxExpand;

      // Draw with expanding height
      const expandedHeight = boxHeight * boxExpand;
      ctx.roundRect(
        currentX,
        y - expandedHeight / 2,
        boxWidth,
        expandedHeight,
        cornerRadius
      );
      ctx.stroke();

      // Light fill
      ctx.fillStyle = `rgba(0, 0, 0, ${tokenProgress * 0.03})`;
      ctx.fill();

      // Token text (fade in after box forms)
      if (boxExpand > 0.5) {
        const textAlpha = (boxExpand - 0.5) * 2;
        ctx.font = '16px "SF Mono", Monaco, "Cascadia Code", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(0, 0, 0, ${textAlpha * 0.9})`;
        ctx.fillText(token.text, currentX + boxWidth / 2, y);
      }
    }

    currentX += tokenWidths[i] + gap;
  });
}

function drawTokenIds(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  tokens: Token[],
  progress: number
) {
  ctx.font = '16px "SF Mono", Monaco, "Cascadia Code", monospace';

  // Calculate positions (same as boxes)
  const padding = 12;
  const gap = 8;
  const tokenWidths = tokens.map(t => ctx.measureText(t.text).width + padding * 2);
  const totalWidth = tokenWidths.reduce((sum, w) => sum + w, 0) + gap * (tokens.length - 1);
  let currentX = centerX - totalWidth / 2;

  tokens.forEach((token, i) => {
    const idDelay = i * 0.15;
    const idProgress = Math.min(1, (progress - idDelay) / 0.25);

    if (idProgress > 0) {
      const boxWidth = tokenWidths[i];
      const idY = y + 28;

      // Animated arrow from token to ID
      const arrowProgress = Math.min(1, idProgress * 2);
      if (arrowProgress > 0 && arrowProgress < 1) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${arrowProgress * 0.3})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(currentX + boxWidth / 2, y + 16);
        ctx.lineTo(currentX + boxWidth / 2, idY - 8 + (1 - arrowProgress) * 10);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Token ID
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(60, 140, 80, ${idProgress * 0.9})`;
      ctx.fillText(token.id.toString(), currentX + boxWidth / 2, idY);
    }

    currentX += tokenWidths[i] + gap;
  });

  // "Token IDs" label
  if (progress > 0.5) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${(progress - 0.5) * 0.8})`;
    ctx.fillText('token IDs', centerX, y + 45);
  }
}

function drawTensorVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  tokens: Token[],
  progress: number
) {
  const cellWidth = 50;
  const cellHeight = 30;
  const totalWidth = tokens.length * cellWidth;
  const startX = centerX - totalWidth / 2;

  // Draw tensor bracket
  const bracketAlpha = Math.min(1, progress / 0.3);

  // Left bracket
  ctx.strokeStyle = `rgba(0, 0, 0, ${bracketAlpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX - 8, y - cellHeight / 2 - 5);
  ctx.lineTo(startX - 15, y - cellHeight / 2 - 5);
  ctx.lineTo(startX - 15, y + cellHeight / 2 + 5);
  ctx.lineTo(startX - 8, y + cellHeight / 2 + 5);
  ctx.stroke();

  // Right bracket
  ctx.beginPath();
  ctx.moveTo(startX + totalWidth + 8, y - cellHeight / 2 - 5);
  ctx.lineTo(startX + totalWidth + 15, y - cellHeight / 2 - 5);
  ctx.lineTo(startX + totalWidth + 15, y + cellHeight / 2 + 5);
  ctx.lineTo(startX + totalWidth + 8, y + cellHeight / 2 + 5);
  ctx.stroke();

  // Draw cells
  tokens.forEach((token, i) => {
    const cellDelay = i * 0.1;
    const cellProgress = Math.min(1, (progress - cellDelay) / 0.25);

    if (cellProgress > 0) {
      const cellX = startX + i * cellWidth;

      // Cell background
      ctx.fillStyle = `rgba(0, 0, 0, ${cellProgress * 0.04})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${cellProgress * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(cellX, y - cellHeight / 2, cellWidth, cellHeight);
      ctx.fill();
      ctx.stroke();

      // Cell value (token ID)
      const valueAlpha = Math.min(1, (cellProgress - 0.3) / 0.7);
      if (valueAlpha > 0) {
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(0, 0, 0, ${valueAlpha * 0.9})`;
        ctx.fillText(token.id.toString(), cellX + cellWidth / 2, y);
      }

      // Index below
      if (progress > 0.5) {
        const indexAlpha = Math.min(1, (progress - 0.5) / 0.3);
        ctx.font = '9px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = `rgba(0, 0, 0, ${indexAlpha * 0.4})`;
        ctx.fillText(`[${i}]`, cellX + cellWidth / 2, y + cellHeight / 2 + 12);
      }
    }
  });

  // Tensor label
  if (progress > 0.3) {
    const labelAlpha = Math.min(1, (progress - 0.3) / 0.3);
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.5})`;
    ctx.fillText('input_ids: Tensor[3]', centerX, y + cellHeight / 2 + 28);
  }

  // "Ready" indicator when complete
  if (progress > 0.9) {
    const readyAlpha = Math.min(1, (progress - 0.9) / 0.1);

    ctx.fillStyle = `rgba(60, 140, 80, ${readyAlpha * 0.15})`;
    ctx.beginPath();
    ctx.roundRect(startX - 20, y - cellHeight / 2 - 10, totalWidth + 40, cellHeight + 20, 8);
    ctx.fill();

    ctx.strokeStyle = `rgba(60, 140, 80, ${readyAlpha * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawFlowArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY - 8);
  ctx.stroke();

  ctx.setLineDash([]);

  // Arrow head
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize / 2, toY - arrowSize);
  ctx.lineTo(toX + arrowSize / 2, toY - arrowSize);
  ctx.closePath();
  ctx.fill();
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
