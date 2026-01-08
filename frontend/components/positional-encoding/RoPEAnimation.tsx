'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface RoPEAnimationProps {
  progress: number;
  startOffset?: number;
}

/**
 * Scroll-synced animation visualizing RoPE (Rotary Position Embedding).
 *
 * Phase 1 (0-33%): 2D vector rotation demonstration
 * Phase 2 (33-66%): Two vectors being rotated by different amounts
 * Phase 3 (66-100%): Showing dot product depends only on angle difference
 */
export function RoPEAnimation({
  progress,
  startOffset = 0,
}: RoPEAnimationProps) {
  const adjustedProgress = Math.min(1, progress + startOffset);

  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Determine which phase we're in
    const phase = Math.floor(adjustedProgress * 3);
    const phaseProgress = (adjustedProgress * 3) % 1;

    if (phase === 0) {
      // Phase 1: Single vector rotation
      drawSingleRotation(ctx, centerX, centerY, width, height, phaseProgress);
    } else if (phase === 1) {
      // Phase 2: Two vectors rotating
      drawTwoVectors(ctx, centerX, centerY, width, height, phaseProgress);
    } else {
      // Phase 3: Relative rotation insight
      drawRelativeRotation(ctx, centerX, centerY, width, height, phaseProgress);
    }
  };

  return (
    <AnimationCanvas
      progress={adjustedProgress}
      className="w-full h-full bg-white rounded-lg"
    >
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Phase 1: Show a single vector being rotated
 */
function drawSingleRotation(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number
) {
  const radius = Math.min(width, height) * 0.3;

  // Draw coordinate system
  drawCoordinateSystem(ctx, centerX, centerY, radius);

  // Original vector (fixed)
  const originalAngle = Math.PI / 6; // 30 degrees
  const originalEndX = centerX + Math.cos(originalAngle) * radius * 0.8;
  const originalEndY = centerY - Math.sin(originalAngle) * radius * 0.8;

  // Draw original vector (faded)
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth = 2;
  drawArrow(ctx, centerX, centerY, originalEndX, originalEndY);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('original', originalEndX + 10, originalEndY);

  // Rotated vector
  const rotationAngle = progress * Math.PI; // Rotate up to 180 degrees
  const rotatedAngle = originalAngle + rotationAngle;
  const rotatedEndX = centerX + Math.cos(rotatedAngle) * radius * 0.8;
  const rotatedEndY = centerY - Math.sin(rotatedAngle) * radius * 0.8;

  // Draw rotation arc
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.4, -originalAngle, -rotatedAngle, rotationAngle > 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw rotated vector
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 3;
  drawArrow(ctx, centerX, centerY, rotatedEndX, rotatedEndY);

  ctx.fillStyle = '#8b5cf6';
  ctx.fillText('R(θ)v', rotatedEndX + 10, rotatedEndY - 10);

  // Show rotation angle
  ctx.fillStyle = '#374151';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`θ = ${Math.round((rotationAngle * 180) / Math.PI)}°`, centerX, height - 30);

  // Title
  ctx.fillText('Vector Rotation', centerX, 25);

  // Show magnitude preservation
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('|R(θ)v| = |v|', centerX, height - 10);
}

/**
 * Phase 2: Two vectors (q and k) being rotated by different amounts
 */
function drawTwoVectors(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number
) {
  const radius = Math.min(width, height) * 0.3;

  // Draw coordinate system
  drawCoordinateSystem(ctx, centerX, centerY, radius);

  // Query vector q
  const qAngle = Math.PI / 4; // 45 degrees
  const qRotation = progress * Math.PI * 0.5; // Position m
  const qFinalAngle = qAngle + qRotation;

  // Key vector k
  const kAngle = -Math.PI / 6; // -30 degrees
  const kRotation = progress * Math.PI * 0.75; // Position n (different)
  const kFinalAngle = kAngle + kRotation;

  // Draw q vector
  const qEndX = centerX + Math.cos(qFinalAngle) * radius * 0.7;
  const qEndY = centerY - Math.sin(qFinalAngle) * radius * 0.7;

  ctx.strokeStyle = '#ef4444'; // Red
  ctx.lineWidth = 3;
  drawArrow(ctx, centerX, centerY, qEndX, qEndY);

  ctx.fillStyle = '#ef4444';
  ctx.font = '12px sans-serif';
  ctx.fillText('R(mθ)q', qEndX + 8, qEndY - 8);

  // Draw k vector
  const kEndX = centerX + Math.cos(kFinalAngle) * radius * 0.7;
  const kEndY = centerY - Math.sin(kFinalAngle) * radius * 0.7;

  ctx.strokeStyle = '#3b82f6'; // Blue
  ctx.lineWidth = 3;
  drawArrow(ctx, centerX, centerY, kEndX, kEndY);

  ctx.fillStyle = '#3b82f6';
  ctx.fillText('R(nθ)k', kEndX + 8, kEndY + 15);

  // Show position labels
  ctx.fillStyle = '#374151';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';

  const posM = Math.round((qRotation / Math.PI) * 10);
  const posN = Math.round((kRotation / Math.PI) * 10);

  ctx.fillStyle = '#ef4444';
  ctx.fillText(`m = ${posM}`, width * 0.2, height - 15);

  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`n = ${posN}`, width * 0.8, height - 15);

  // Title
  ctx.fillStyle = '#374151';
  ctx.textAlign = 'center';
  ctx.fillText('Query & Key Rotation', centerX, 25);
}

/**
 * Phase 3: Show that dot product depends only on angle difference
 */
function drawRelativeRotation(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  progress: number
) {
  const radius = Math.min(width, height) * 0.25;

  // Two side-by-side demonstrations
  const leftCenterX = width * 0.3;
  const rightCenterX = width * 0.7;

  // Left: Absolute rotations
  drawCoordinateSystem(ctx, leftCenterX, centerY, radius * 0.8);

  const absQAngle = Math.PI / 4 + progress * Math.PI * 0.3;
  const absKAngle = -Math.PI / 6 + progress * Math.PI * 0.5;

  // Draw q
  const absQEndX = leftCenterX + Math.cos(absQAngle) * radius * 0.6;
  const absQEndY = centerY - Math.sin(absQAngle) * radius * 0.6;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  drawArrow(ctx, leftCenterX, centerY, absQEndX, absQEndY);

  // Draw k
  const absKEndX = leftCenterX + Math.cos(absKAngle) * radius * 0.6;
  const absKEndY = centerY - Math.sin(absKAngle) * radius * 0.6;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  drawArrow(ctx, leftCenterX, centerY, absKEndX, absKEndY);

  // Right: Relative rotation (k rotated by difference)
  drawCoordinateSystem(ctx, rightCenterX, centerY, radius * 0.8);

  const relDiff = absQAngle - absKAngle; // Angle difference

  // Fixed q at original position
  const relQAngle = Math.PI / 4;
  const relQEndX = rightCenterX + Math.cos(relQAngle) * radius * 0.6;
  const relQEndY = centerY - Math.sin(relQAngle) * radius * 0.6;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  drawArrow(ctx, rightCenterX, centerY, relQEndX, relQEndY);

  // k rotated by relative difference
  const relKAngle = -Math.PI / 6 + relDiff - (Math.PI / 4 - (-Math.PI / 6)); // Maintain relative angle
  const relKEndX = rightCenterX + Math.cos(-Math.PI / 6 - (absKAngle - absQAngle)) * radius * 0.6;
  const relKEndY = centerY - Math.sin(-Math.PI / 6 - (absKAngle - absQAngle)) * radius * 0.6;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  drawArrow(ctx, rightCenterX, centerY, relKEndX, relKEndY);

  // Labels
  ctx.fillStyle = '#374151';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('R(mθ)q · R(nθ)k', leftCenterX, height - 40);
  ctx.fillText('q · R((m-n)θ)k', rightCenterX, height - 40);

  // Equals sign
  ctx.font = '20px sans-serif';
  ctx.fillText('=', centerX, centerY);

  // Dot product values (same!)
  const dotProduct = Math.cos(absQAngle) * Math.cos(absKAngle) + Math.sin(absQAngle) * Math.sin(absKAngle);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#10b981'; // Green
  ctx.fillText(`dot = ${dotProduct.toFixed(3)}`, leftCenterX, height - 20);
  ctx.fillText(`dot = ${dotProduct.toFixed(3)}`, rightCenterX, height - 20);

  // Title
  ctx.fillStyle = '#374151';
  ctx.font = '13px sans-serif';
  ctx.fillText('Relative Position Only Matters!', centerX, 25);
}

/**
 * Helper: Draw coordinate axes
 */
function drawCoordinateSystem(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  // X axis
  ctx.beginPath();
  ctx.moveTo(centerX - radius - 10, centerY);
  ctx.lineTo(centerX + radius + 10, centerY);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius - 10);
  ctx.lineTo(centerX, centerY + radius + 10);
  ctx.stroke();

  // Unit circle (faint)
  ctx.strokeStyle = '#f3f4f6';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Helper: Draw an arrow
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  // Line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}
