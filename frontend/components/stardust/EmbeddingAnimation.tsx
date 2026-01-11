'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface EmbeddingAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Embedding Animation showing embeddings being TRAINED
 *
 * Phase 1 (0-0.20): Words start at random positions in vector space
 * Phase 2 (0.20-0.50): Training begins - words start moving
 * Phase 3 (0.50-0.80): Words converge - similar words cluster together
 * Phase 4 (0.80-1.0): Final learned embeddings with clusters highlighted
 */
export function EmbeddingAnimation({ progress, className = '' }: EmbeddingAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const titleY = height * 0.08;
    const centerX = width * 0.5;
    const centerY = height * 0.50;
    const phaseLabelY = height * 0.94;

    // Words with random start positions and learned final positions
    const words = [
      { word: 'cat', random: [-0.3, 0.7], learned: [0.9, 0.15], color: '#2563eb', category: 'animal' },
      { word: 'dog', random: [0.6, -0.4], learned: [0.85, 0.25], color: '#2563eb', category: 'animal' },
      { word: 'bird', random: [-0.7, -0.2], learned: [0.75, 0.05], color: '#2563eb', category: 'animal' },
      { word: 'happy', random: [0.4, 0.3], learned: [0.1, 0.9], color: '#16a34a', category: 'positive' },
      { word: 'great', random: [-0.5, 0.5], learned: [0.15, 0.8], color: '#16a34a', category: 'positive' },
      { word: 'sad', random: [0.2, -0.6], learned: [0.1, -0.75], color: '#dc2626', category: 'negative' },
      { word: 'angry', random: [0.8, 0.1], learned: [0.2, -0.65], color: '#dc2626', category: 'negative' },
    ];

    // Calculate training progress (0 = random, 1 = learned)
    const trainingProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.60));
    const easeProgress = easeInOutCubic(trainingProgress);

    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Draw vector space with training words
    drawVectorSpace(ctx, centerX, centerY, width * 0.75, height * 0.70, words, easeProgress, progress);

    // Draw training progress indicator
    if (progress >= 0.20 && progress < 0.80) {
      drawTrainingIndicator(ctx, centerX, height * 0.18, trainingProgress);
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

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getPhase(progress: number): number {
  if (progress < 0.20) return 1;
  if (progress < 0.50) return 2;
  if (progress < 0.80) return 3;
  return 4;
}

function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Learning Embeddings', x, y);
}

function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  const labels: Record<number, string> = {
    1: 'Random Initialization',
    2: 'Training...',
    3: 'Similar Words Clustering',
    4: progress >= 0.95 ? 'Learned Representations!' : 'Embeddings Learned',
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
  ctx.fillStyle = phase === 4 && progress >= 0.95 ? 'rgba(60, 140, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
  ctx.fillText(labelText, x, y);
}

function drawTrainingIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) {
  const barWidth = 120;
  const barHeight = 6;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.roundRect(x - barWidth / 2, y - barHeight / 2, barWidth, barHeight, 3);
  ctx.fill();

  // Progress fill
  ctx.fillStyle = 'rgba(60, 140, 80, 0.7)';
  ctx.beginPath();
  ctx.roundRect(x - barWidth / 2, y - barHeight / 2, barWidth * progress, barHeight, 3);
  ctx.fill();

  // Label
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillText(`Training: ${Math.round(progress * 100)}%`, x, y + 12);
}

interface WordData {
  word: string;
  random: number[];
  learned: number[];
  color: string;
  category: string;
}

function drawVectorSpace(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  words: WordData[],
  trainingProgress: number,
  totalProgress: number
) {
  const halfW = width / 2;
  const halfH = height / 2;

  const alpha = Math.min(1, totalProgress / 0.15);

  // Draw axes
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
  ctx.lineWidth = 1;

  // X axis
  ctx.beginPath();
  ctx.moveTo(centerX - halfW, centerY);
  ctx.lineTo(centerX + halfW, centerY);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - halfH);
  ctx.lineTo(centerX, centerY + halfH);
  ctx.stroke();

  // Axis labels
  ctx.font = '9px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.textAlign = 'center';
  ctx.fillText('dimension 0', centerX + halfW - 30, centerY + 15);
  ctx.fillText('dimension 1', centerX + 35, centerY - halfH + 10);

  // Scale functions
  const scaleX = (v: number) => centerX + v * halfW * 0.85;
  const scaleY = (v: number) => centerY - v * halfH * 0.85;

  // Draw cluster regions when trained
  if (trainingProgress > 0.7) {
    const clusterAlpha = (trainingProgress - 0.7) / 0.3;

    // Animal cluster (top right)
    ctx.fillStyle = `rgba(37, 99, 235, ${clusterAlpha * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(scaleX(0.83), scaleY(0.15), 50, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Positive cluster (top)
    ctx.fillStyle = `rgba(22, 163, 74, ${clusterAlpha * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(scaleX(0.125), scaleY(0.85), 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Negative cluster (bottom)
    ctx.fillStyle = `rgba(220, 38, 38, ${clusterAlpha * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(scaleX(0.15), scaleY(-0.7), 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cluster labels
    if (clusterAlpha > 0.5) {
      const labelAlpha = (clusterAlpha - 0.5) * 2;
      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';

      ctx.fillStyle = `rgba(37, 99, 235, ${labelAlpha * 0.7})`;
      ctx.fillText('animals', scaleX(0.83), scaleY(0.15) + 45);

      ctx.fillStyle = `rgba(22, 163, 74, ${labelAlpha * 0.7})`;
      ctx.fillText('positive', scaleX(0.125), scaleY(0.85) + 40);

      ctx.fillStyle = `rgba(220, 38, 38, ${labelAlpha * 0.7})`;
      ctx.fillText('negative', scaleX(0.15), scaleY(-0.7) + 40);
    }
  }

  // Draw words with interpolated positions
  words.forEach((word, i) => {
    const appearDelay = i * 0.02;
    const wordAlpha = Math.min(1, (totalProgress - appearDelay) / 0.12);

    if (wordAlpha > 0) {
      // Interpolate between random and learned positions
      const x = word.random[0] + (word.learned[0] - word.random[0]) * trainingProgress;
      const y = word.random[1] + (word.learned[1] - word.random[1]) * trainingProgress;

      const screenX = scaleX(x);
      const screenY = scaleY(y);

      // Motion trail during training
      if (trainingProgress > 0 && trainingProgress < 1) {
        const trailLength = 5;
        for (let t = 0; t < trailLength; t++) {
          const trailProgress = Math.max(0, trainingProgress - t * 0.05);
          const tx = word.random[0] + (word.learned[0] - word.random[0]) * trailProgress;
          const ty = word.random[1] + (word.learned[1] - word.random[1]) * trailProgress;
          const trailAlpha = (1 - t / trailLength) * 0.15 * wordAlpha;

          ctx.fillStyle = word.color;
          ctx.globalAlpha = trailAlpha;
          ctx.beginPath();
          ctx.arc(scaleX(tx), scaleY(ty), 3 - t * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Point
      ctx.fillStyle = word.color;
      ctx.globalAlpha = wordAlpha;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
      ctx.fill();

      // White border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = word.color;
      ctx.fillText(word.word, screenX, screenY - 12);

      ctx.globalAlpha = 1;
    }
  });
}
