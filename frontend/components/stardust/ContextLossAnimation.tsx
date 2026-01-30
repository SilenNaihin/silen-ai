'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface ContextLossAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Context Loss Animation - simplified visualization
 *
 * Shows a sequence of tokens flowing through an RNN where
 * information from early tokens fades over distance.
 *
 * Phase 1 (0-0.3): Tokens appear one by one
 * Phase 2 (0.3-0.8): Process through RNN, early token memory fades
 * Phase 3 (0.8-1.0): Show the result - early context lost
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

    const centerY = height * 0.5;
    const titleY = height * 0.1;
    const labelY = height * 0.9;

    // Tokens in sequence
    const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat', '...', '___'];
    const numTokens = tokens.length;
    const tokenSpacing = Math.min(50, (width - 80) / numTokens);
    const startX = (width - (numTokens - 1) * tokenSpacing) / 2;

    // Draw title
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText('Context Loss Over Distance', width * 0.5, titleY);

    // Calculate how many tokens have been "processed"
    const processedCount = Math.min(
      numTokens,
      Math.floor(progress * numTokens * 1.5) + 1
    );

    // Draw each token and its memory trace
    for (let i = 0; i < numTokens; i++) {
      const x = startX + i * tokenSpacing;
      const token = tokens[i];
      const isSubject = i === 1; // "cat" is the subject
      const isBlank = i === numTokens - 1;

      // Token visibility (appear sequentially)
      const appearProgress = Math.min(1, (progress * 3 - i * 0.15));
      if (appearProgress <= 0) continue;

      const alpha = Math.min(1, appearProgress);

      // Draw token box
      const boxSize = 36;
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize, 6);
      ctx.stroke();

      // Fill based on type
      if (isSubject) {
        ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.15})`;
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.03})`;
      }
      ctx.fill();

      // Token text
      ctx.font = isSubject ? 'bold 12px system-ui' : '12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (isBlank && progress > 0.8) {
        ctx.fillStyle = `rgba(180, 60, 60, ${alpha * 0.9})`;
        ctx.fillText('?', x, centerY);
      } else {
        ctx.fillStyle = isSubject
          ? `rgba(60, 140, 80, ${alpha * 0.9})`
          : `rgba(0, 0, 0, ${alpha * 0.8})`;
        ctx.fillText(token, x, centerY);
      }

      // Draw memory strength indicator below token
      if (progress > 0.3 && i < processedCount) {
        const memoryProgress = Math.min(1, (progress - 0.3) / 0.5);
        const distanceFromSubject = Math.abs(i - 1); // Distance from "cat"

        // Memory of "cat" fades with distance
        let memoryStrength: number;
        if (i <= 1) {
          // At or before "cat", memory is strong initially but fades
          memoryStrength = 1 - memoryProgress * 0.3;
        } else {
          // After "cat", memory decays exponentially with distance
          const decay = Math.pow(0.65, distanceFromSubject);
          memoryStrength = decay * (1 - memoryProgress * 0.7);
        }
        memoryStrength = Math.max(0.05, memoryStrength);

        // Memory bar
        const barWidth = 30;
        const maxBarHeight = 40;
        const barHeight = maxBarHeight * memoryStrength;
        const barY = centerY + boxSize / 2 + 15;

        // Color: green (strong) to red (weak)
        const r = Math.floor(60 + (180 - 60) * (1 - memoryStrength));
        const g = Math.floor(140 * memoryStrength);
        const b = Math.floor(80 * memoryStrength);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(
          x - barWidth / 2,
          barY + maxBarHeight - barHeight,
          barWidth,
          barHeight,
          3
        );
        ctx.fill();

        // Memory percentage
        ctx.font = '8px system-ui';
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
        ctx.fillText(
          `${Math.round(memoryStrength * 100)}%`,
          x,
          barY + maxBarHeight + 10
        );
      }

      // Connection arrow to next token
      if (i < numTokens - 1 && appearProgress > 0.5) {
        const arrowAlpha = (appearProgress - 0.5) * 2 * 0.4;
        ctx.strokeStyle = `rgba(0, 0, 0, ${arrowAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + boxSize / 2 + 3, centerY);
        ctx.lineTo(x + tokenSpacing - boxSize / 2 - 8, centerY);
        ctx.stroke();

        // Arrowhead
        ctx.fillStyle = `rgba(0, 0, 0, ${arrowAlpha})`;
        ctx.beginPath();
        const arrowX = x + tokenSpacing - boxSize / 2 - 3;
        ctx.moveTo(arrowX, centerY);
        ctx.lineTo(arrowX - 5, centerY - 3);
        ctx.lineTo(arrowX - 5, centerY + 3);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Label for "cat"
    if (progress > 0.15 && progress < 0.85) {
      const labelAlpha = Math.min(1, (progress - 0.15) / 0.1);
      ctx.font = '9px system-ui';
      ctx.fillStyle = `rgba(60, 140, 80, ${labelAlpha * 0.7})`;
      ctx.textAlign = 'center';
      ctx.fillText('subject', startX + tokenSpacing, centerY - 28);
    }

    // Memory legend
    if (progress > 0.4) {
      const legendAlpha = Math.min(1, (progress - 0.4) / 0.1);
      ctx.font = '9px system-ui';
      ctx.fillStyle = `rgba(0, 0, 0, ${legendAlpha * 0.5})`;
      ctx.textAlign = 'center';
      ctx.fillText('Memory of "cat"', width * 0.5, centerY + 95);
    }

    // Phase label at bottom
    let phaseText = '';
    if (progress < 0.3) {
      phaseText = 'Tokens enter the RNN sequentially';
    } else if (progress < 0.8) {
      phaseText = 'Memory of early tokens fades with distance';
    } else {
      phaseText = 'By the end, the subject is nearly forgotten';
    }

    // Draw phase label pill
    ctx.font = '11px system-ui';
    const textWidth = ctx.measureText(phaseText).width;
    const pillPadding = 12;
    const pillHeight = 22;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.beginPath();
    ctx.roundRect(
      width / 2 - textWidth / 2 - pillPadding,
      labelY - pillHeight / 2,
      textWidth + pillPadding * 2,
      pillHeight,
      11
    );
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = progress >= 0.8 ? 'rgba(180, 60, 60, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(phaseText, width / 2, labelY);
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
