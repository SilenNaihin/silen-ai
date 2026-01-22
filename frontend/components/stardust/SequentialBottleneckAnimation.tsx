'use client';

import { useRef, useEffect } from 'react';

interface SequentialBottleneckAnimationProps {
  progress: number;
}

export function SequentialBottleneckAnimation({
  progress,
}: SequentialBottleneckAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Animation phases:
    // 0.0 - 0.3: Show sequential processing (tokens waiting in line)
    // 0.3 - 0.6: Show long-range dependency problem
    // 0.6 - 1.0: Teaser - parallel attention concept

    const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat', '.'];
    const numTokens = tokens.length;
    const tokenWidth = 50;
    const tokenHeight = 30;
    const startX = 60;
    const tokenY = height / 2 - 60;

    // Draw title based on phase
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';

    if (progress < 0.3) {
      ctx.fillText('Sequential Processing', width / 2, 30);
    } else if (progress < 0.6) {
      ctx.fillText('Long-Range Dependencies', width / 2, 30);
    } else {
      ctx.fillText('What If We Could See Everything At Once?', width / 2, 30);
    }

    // Phase 1: Sequential processing bottleneck
    if (progress < 0.3) {
      const localProgress = progress / 0.3;
      const currentTokenIdx = Math.floor(localProgress * numTokens);

      // Draw tokens
      for (let i = 0; i < numTokens; i++) {
        const x = startX + i * (tokenWidth + 20);

        // Token box
        ctx.fillStyle = i <= currentTokenIdx ? '#000' : '#e5e5e5';
        ctx.fillRect(x, tokenY, tokenWidth, tokenHeight);

        // Token text
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = i <= currentTokenIdx ? '#fff' : '#999';
        ctx.fillText(tokens[i], x + tokenWidth / 2, tokenY + tokenHeight / 2 + 4);

        // Processing arrow
        if (i < numTokens - 1 && i < currentTokenIdx) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + tokenWidth + 5, tokenY + tokenHeight / 2);
          ctx.lineTo(x + tokenWidth + 15, tokenY + tokenHeight / 2);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(x + tokenWidth + 15, tokenY + tokenHeight / 2);
          ctx.lineTo(x + tokenWidth + 10, tokenY + tokenHeight / 2 - 4);
          ctx.lineTo(x + tokenWidth + 10, tokenY + tokenHeight / 2 + 4);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Show "waiting" indicator
      ctx.font = '14px system-ui';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Processing token ${currentTokenIdx + 1} of ${numTokens}...`,
        startX,
        tokenY + tokenHeight + 40
      );
      ctx.fillText('Each token must wait for the previous one.', startX, tokenY + tokenHeight + 60);
    }

    // Phase 2: Long-range dependency problem
    else if (progress < 0.6) {
      const localProgress = (progress - 0.3) / 0.3;

      // Draw all tokens
      for (let i = 0; i < numTokens; i++) {
        const x = startX + i * (tokenWidth + 20);

        ctx.fillStyle = i === 0 || i === numTokens - 1 ? '#000' : '#e5e5e5';
        ctx.fillRect(x, tokenY, tokenWidth, tokenHeight);

        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = i === 0 || i === numTokens - 1 ? '#fff' : '#666';
        ctx.fillText(tokens[i], x + tokenWidth / 2, tokenY + tokenHeight / 2 + 4);
      }

      // Draw fading signal line from first to last
      const startTokenX = startX + tokenWidth;
      const endTokenX = startX + (numTokens - 1) * (tokenWidth + 20);
      const lineY = tokenY + tokenHeight + 30;

      // Gradient line showing signal decay
      const gradient = ctx.createLinearGradient(startTokenX, lineY, endTokenX, lineY);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(Math.min(1, localProgress * 1.5), 'rgba(0, 0, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(startTokenX, lineY);
      ctx.lineTo(endTokenX, lineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.font = '12px system-ui';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText('Strong signal', startTokenX + 30, lineY + 20);

      ctx.fillStyle = '#999';
      ctx.fillText('Weak signal', endTokenX - 30, lineY + 20);

      // Explanation
      ctx.font = '14px system-ui';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'left';
      ctx.fillText(
        'Information from "The" fades by the time we reach "."',
        startX,
        height - 50
      );
    }

    // Phase 3: Attention teaser
    else {
      const localProgress = (progress - 0.6) / 0.4;

      // Draw tokens in a circle
      const centerX = width / 2;
      const centerY = height / 2 + 20;
      const radius = 100;

      for (let i = 0; i < numTokens; i++) {
        const angle = (i / numTokens) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius - tokenWidth / 2;
        const y = centerY + Math.sin(angle) * radius - tokenHeight / 2;

        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, tokenWidth, tokenHeight);

        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(tokens[i], x + tokenWidth / 2, y + tokenHeight / 2 + 4);
      }

      // Draw attention lines between tokens
      const numLines = Math.floor(localProgress * numTokens * (numTokens - 1));
      let lineCount = 0;

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < numTokens && lineCount < numLines; i++) {
        for (let j = i + 1; j < numTokens && lineCount < numLines; j++) {
          const angle1 = (i / numTokens) * Math.PI * 2 - Math.PI / 2;
          const angle2 = (j / numTokens) * Math.PI * 2 - Math.PI / 2;

          const x1 = centerX + Math.cos(angle1) * radius;
          const y1 = centerY + Math.sin(angle1) * radius;
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          lineCount++;
        }
      }

      // "Attention" text in center
      if (localProgress > 0.5) {
        const textOpacity = Math.min(1, (localProgress - 0.5) * 2);
        ctx.font = 'bold 18px system-ui';
        ctx.fillStyle = `rgba(0, 0, 0, ${textOpacity})`;
        ctx.textAlign = 'center';
        ctx.fillText('Attention', centerX, centerY + 5);
      }

      // Bottom text
      ctx.font = '14px system-ui';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Every token can see every other token. Instantly.',
        width / 2,
        height - 30
      );
    }
  }, [progress]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        className="max-w-full"
      />
    </div>
  );
}
