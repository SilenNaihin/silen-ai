'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface SimpleRecurrenceAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Simple Recurrence Animation showing the basic concept of RNN
 *
 * Phase 1 (0-0.15): Show sequence of input tokens
 * Phase 2 (0.15-0.35): Show hidden state being computed from first input
 * Phase 3 (0.35-0.55): Show recurrent connection - hidden state feeds back
 * Phase 4 (0.55-0.75): Process second token using same weights
 * Phase 5 (0.75-0.90): Process third token, emphasize weight sharing
 * Phase 6 (0.90-1.0): Show final output
 */
export function SimpleRecurrenceAnimation({
  progress,
  className = '',
}: SimpleRecurrenceAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout
    const centerY = height * 0.5;
    const titleY = height * 0.08;
    const phaseLabelY = height * 0.92;

    // Token positions
    const tokenY = centerY + 60;
    const hiddenY = centerY - 20;
    const outputY = centerY - 100;

    const startX = width * 0.2;
    const tokenSpacing = width * 0.25;

    // Sample tokens
    const tokens = ['The', 'cat', 'sat'];

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Simple Recurrence', width * 0.5, titleY);

    // Phase 1: Show input tokens
    const tokenAlpha = Math.min(1, progress / 0.12);
    drawInputTokens(ctx, tokens, startX, tokenY, tokenSpacing, tokenAlpha);

    // Phase 2: First hidden state
    if (progress >= 0.15) {
      const hiddenProgress = Math.min(1, (progress - 0.15) / 0.15);
      drawHiddenState(
        ctx,
        startX,
        hiddenY,
        'h₁',
        hiddenProgress,
        progress >= 0.35
      );
      // Connection from token to hidden
      drawConnection(
        ctx,
        startX,
        tokenY - 15,
        startX,
        hiddenY + 20,
        hiddenProgress,
        'Wₓₕ'
      );
    }

    // Phase 3: Recurrent connection visualization
    if (progress >= 0.35) {
      const recurrentProgress = Math.min(1, (progress - 0.35) / 0.15);
      // Draw the recurrent arrow (self-loop concept)
      drawRecurrentArrow(ctx, startX, hiddenY, recurrentProgress);
    }

    // Phase 4: Second hidden state
    if (progress >= 0.55) {
      const hidden2Progress = Math.min(1, (progress - 0.55) / 0.15);
      const x2 = startX + tokenSpacing;
      drawHiddenState(ctx, x2, hiddenY, 'h₂', hidden2Progress, true);
      // Connection from h1 to h2
      drawHorizontalConnection(
        ctx,
        startX + 25,
        hiddenY,
        x2 - 25,
        hiddenY,
        hidden2Progress,
        'Wₕₕ'
      );
      // Connection from token to hidden
      drawConnection(
        ctx,
        x2,
        tokenY - 15,
        x2,
        hiddenY + 20,
        hidden2Progress,
        ''
      );

      // Highlight "same weights" text
      if (hidden2Progress > 0.5) {
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = `rgba(60, 140, 80, ${(hidden2Progress - 0.5) * 2 * 0.8})`;
        ctx.textAlign = 'center';
        ctx.fillText('same Wₓₕ!', x2, tokenY - 35);
      }
    }

    // Phase 5: Third hidden state
    if (progress >= 0.75) {
      const hidden3Progress = Math.min(1, (progress - 0.75) / 0.12);
      const x2 = startX + tokenSpacing;
      const x3 = startX + tokenSpacing * 2;
      drawHiddenState(ctx, x3, hiddenY, 'h₃', hidden3Progress, true);
      // Connection from h2 to h3
      drawHorizontalConnection(
        ctx,
        x2 + 25,
        hiddenY,
        x3 - 25,
        hiddenY,
        hidden3Progress,
        ''
      );
      // Connection from token to hidden
      drawConnection(
        ctx,
        x3,
        tokenY - 15,
        x3,
        hiddenY + 20,
        hidden3Progress,
        ''
      );

      // Highlight "same weights" for Whh
      if (hidden3Progress > 0.5) {
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = `rgba(60, 140, 80, ${(hidden3Progress - 0.5) * 2 * 0.8})`;
        ctx.textAlign = 'center';
        ctx.fillText('same Wₕₕ!', (x2 + x3) / 2, hiddenY - 35);
      }
    }

    // Phase 6: Output
    if (progress >= 0.9) {
      const outputProgress = Math.min(1, (progress - 0.9) / 0.08);
      const x3 = startX + tokenSpacing * 2;
      drawOutput(ctx, x3, outputY, outputProgress);
      // Connection from h3 to output
      drawConnection(
        ctx,
        x3,
        hiddenY - 20,
        x3,
        outputY + 20,
        outputProgress,
        'Wₕᵧ'
      );
    }

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase);

    // Draw formula at the bottom
    if (progress >= 0.35) {
      const formulaAlpha = Math.min(1, (progress - 0.35) / 0.1) * 0.7;
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${formulaAlpha})`;
      ctx.textAlign = 'center';
      ctx.fillText('hₜ = tanh(Wₓₕ · xₜ + Wₕₕ · hₜ₋₁ + b)', width * 0.5, height * 0.85);
    }
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  if (progress < 0.15) return 1;
  if (progress < 0.35) return 2;
  if (progress < 0.55) return 3;
  if (progress < 0.75) return 4;
  if (progress < 0.9) return 5;
  return 6;
}

function drawInputTokens(
  ctx: CanvasRenderingContext2D,
  tokens: string[],
  startX: number,
  y: number,
  spacing: number,
  alpha: number
) {
  tokens.forEach((token, i) => {
    const x = startX + i * spacing;
    const tokenDelay = i * 0.05;
    const tokenAlpha = Math.min(1, alpha - tokenDelay);

    if (tokenAlpha > 0) {
      // Token box
      const boxWidth = 50;
      const boxHeight = 28;

      ctx.strokeStyle = `rgba(0, 0, 0, ${tokenAlpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 6);
      ctx.stroke();

      ctx.fillStyle = `rgba(0, 0, 0, ${tokenAlpha * 0.05})`;
      ctx.fill();

      // Token text
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(0, 0, 0, ${tokenAlpha * 0.9})`;
      ctx.fillText(token, x, y);

      // Index label
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(0, 0, 0, ${tokenAlpha * 0.5})`;
      ctx.fillText(`x${i + 1}`, x, y + 22);
    }
  });
}

function drawHiddenState(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  alpha: number,
  isRecurrent: boolean
) {
  // Hidden state circle
  const radius = 20;
  const color = isRecurrent ? '60, 140, 80' : '0, 0, 0';

  ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(${color}, ${alpha * 0.1})`;
  ctx.fill();

  // Label
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.9})`;
  ctx.fillText(label, x, y);
}

function drawConnection(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number,
  label: string
) {
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle - Math.PI / 6),
    toY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle + Math.PI / 6),
    toY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  if (label) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    ctx.textAlign = 'left';
    ctx.fillText(label, (fromX + toX) / 2 + 5, (fromY + toY) / 2);
  }
}

function drawHorizontalConnection(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number,
  label: string
) {
  // Curved arrow for recurrent connection
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  const cpY = fromY - 25;
  ctx.quadraticCurveTo((fromX + toX) / 2, cpY, toX, toY);
  ctx.stroke();

  // Arrowhead
  const arrowSize = 6;
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize, toY - arrowSize / 2);
  ctx.lineTo(toX - arrowSize, toY + arrowSize / 2);
  ctx.closePath();
  ctx.fill();

  // Label
  if (label) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
    ctx.textAlign = 'center';
    ctx.fillText(label, (fromX + toX) / 2, cpY - 5);
  }
}

function drawRecurrentArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number
) {
  // Draw a self-loop to indicate recurrence concept
  const radius = 20;

  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.6})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);

  // Arc above the hidden state
  ctx.beginPath();
  ctx.arc(x, y - radius - 15, 15, 0.3 * Math.PI, 0.7 * Math.PI);
  ctx.stroke();

  ctx.setLineDash([]);

  // Label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.8})`;
  ctx.textAlign = 'center';
  ctx.fillText('recurrent', x, y - radius - 35);
}

function drawOutput(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number
) {
  // Output node
  const radius = 18;

  ctx.strokeStyle = `rgba(100, 100, 180, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.15})`;
  ctx.fill();

  // Label
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(100, 100, 180, ${alpha * 0.9})`;
  ctx.fillText('y', x, y);

  // Output label
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('output', x, y - 28);
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
      labelText = 'Input sequence: x₁, x₂, x₃';
      break;
    case 2:
      labelText = 'Compute first hidden state h₁';
      break;
    case 3:
      labelText = 'Hidden state feeds forward';
      break;
    case 4:
      labelText = 'Same weights Wₓₕ, Wₕₕ for h₂';
      break;
    case 5:
      labelText = 'Continue with shared weights';
      break;
    case 6:
      labelText = 'Final output from h₃';
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
  ctx.fillStyle = phase >= 3 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}
