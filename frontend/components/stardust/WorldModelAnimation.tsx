'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface WorldModelAnimationProps {
  progress: number;
  className?: string;
}

/**
 * World Model Animation - visualizing thinking as world modeling and prediction
 *
 * Phase 1 (0-0.25): A simple scene with objects (sun, tree, ground) - "The World"
 * Phase 2 (0.25-0.50): A thought bubble/brain outline appears with simplified internal model
 * Phase 3 (0.50-0.75): Show prediction - arrow pointing forward, predicted future state
 * Phase 4 (0.75-1.0): Reality matches prediction (checkmark) or differs (X with update)
 */
export function WorldModelAnimation({ progress, className = '' }: WorldModelAnimationProps) {
  const renderAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Layout constants
    const titleY = height * 0.08;
    const mainAreaTop = height * 0.15;
    const mainAreaHeight = height * 0.70;
    const phaseLabelY = height * 0.93;

    // Scene positions
    const worldSceneX = width * 0.20;
    const worldSceneY = mainAreaTop + mainAreaHeight * 0.5;

    const mindX = width * 0.50;
    const mindY = mainAreaTop + mainAreaHeight * 0.5;

    const predictionX = width * 0.80;
    const predictionY = mainAreaTop + mainAreaHeight * 0.5;

    // Get current phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, width * 0.5, titleY);

    // Draw phase label
    drawPhaseLabel(ctx, width * 0.5, phaseLabelY, phase, progress);

    // Phase 1: Draw the world scene
    if (progress >= 0) {
      const sceneAlpha = Math.min(1, progress / 0.15);
      drawWorldScene(ctx, worldSceneX, worldSceneY, width * 0.25, height * 0.45, sceneAlpha, 0);

      // Label
      if (progress >= 0.05) {
        drawComponentLabel(ctx, worldSceneX, worldSceneY + height * 0.28, 'Reality', progress, 0.05);
      }
    }

    // Phase 2: Mind/thought bubble with internal model
    if (progress >= 0.25) {
      const mindAlpha = Math.min(1, (progress - 0.25) / 0.1);
      drawMind(ctx, mindX, mindY, width * 0.22, height * 0.40, mindAlpha, progress);

      // Arrow from world to mind
      drawFlowArrow(ctx, worldSceneX + width * 0.13, worldSceneY - height * 0.12, mindX - width * 0.11, mindY - height * 0.12, progress, 0.25);

      // Label
      drawComponentLabel(ctx, mindX, mindY + height * 0.26, 'Internal Model', progress, 0.25);
    }

    // Phase 3: Prediction arrow and future state
    if (progress >= 0.50) {
      const predictionAlpha = Math.min(1, (progress - 0.50) / 0.1);

      // Arrow from mind to prediction
      drawFlowArrow(ctx, mindX + width * 0.11, mindY - height * 0.05, predictionX - width * 0.11, predictionY - height * 0.05, progress, 0.50);

      // Draw time arrow
      drawTimeArrow(ctx, mindX + width * 0.03, mindY - height * 0.22, predictionX - width * 0.03, predictionY - height * 0.22, predictionAlpha);

      // Draw predicted scene (sun moved)
      drawWorldScene(ctx, predictionX, predictionY, width * 0.22, height * 0.40, predictionAlpha, 1);

      // Label
      drawComponentLabel(ctx, predictionX, predictionY + height * 0.26, 'Prediction', progress, 0.50);
    }

    // Phase 4: Verification - reality matches or differs
    if (progress >= 0.75) {
      const verifyAlpha = Math.min(1, (progress - 0.75) / 0.1);
      drawVerification(ctx, predictionX, predictionY + height * 0.15, verifyAlpha, progress);
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
  if (progress < 0.25) return 1;
  if (progress < 0.50) return 2;
  if (progress < 0.75) return 3;
  return 4;
}

// Draw the main title
function drawTitle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('Thinking as World Modeling', x, y);
}

// Draw phase label at bottom
function drawPhaseLabel(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, progress: number) {
  let labelText = '';
  let labelColor = 'rgba(0, 0, 0, 0.7)';

  switch (phase) {
    case 1:
      labelText = 'Observing the World';
      break;
    case 2:
      labelText = 'Building Internal Model';
      break;
    case 3:
      labelText = 'Predicting Future State';
      break;
    case 4:
      labelText = 'Verifying Prediction';
      labelColor = 'rgba(60, 140, 80, 0.9)';
      break;
  }

  // Background pill
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const pillPadding = 12;
  const pillHeight = 24;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - pillPadding, y - pillHeight / 2, textWidth + pillPadding * 2, pillHeight, 12);
  ctx.fill();

  // Label text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = labelColor;
  ctx.fillText(labelText, x, y);
}

// Draw component labels
function drawComponentLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  progress: number,
  startProgress: number
) {
  const fadeIn = Math.min(1, (progress - startProgress) / 0.1);
  const alpha = fadeIn * 0.6;

  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillText(text, x, y);
}

// Draw data flow arrow
function drawFlowArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  progress: number,
  startProgress: number
) {
  const fadeIn = Math.min(1, (progress - startProgress) / 0.08);
  const alpha = fadeIn * 0.4;

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - 6, toY);
  ctx.stroke();

  // Arrowhead
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize, toY - arrowSize * 0.5);
  ctx.lineTo(toX - arrowSize, toY + arrowSize * 0.5);
  ctx.closePath();
  ctx.fill();
}

// Draw a simplified world scene (sun, tree, ground)
function drawWorldScene(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sceneWidth: number,
  sceneHeight: number,
  alpha: number,
  timeOffset: number // 0 = present, 1 = future
) {
  ctx.save();

  // Scene boundary (subtle rounded rect)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(
    centerX - sceneWidth / 2,
    centerY - sceneHeight / 2,
    sceneWidth,
    sceneHeight,
    8
  );
  ctx.stroke();

  // Ground line
  const groundY = centerY + sceneHeight * 0.25;
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - sceneWidth / 2 + 10, groundY);
  ctx.lineTo(centerX + sceneWidth / 2 - 10, groundY);
  ctx.stroke();

  // Sun position (moves with timeOffset)
  const sunBaseX = centerX - sceneWidth * 0.15;
  const sunBaseY = centerY - sceneHeight * 0.25;
  const sunX = sunBaseX + timeOffset * sceneWidth * 0.3;
  const sunY = sunBaseY - timeOffset * sceneHeight * 0.05;
  const sunRadius = sceneWidth * 0.08;

  // Draw sun
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Sun rays
  const rayCount = 8;
  const rayInner = sunRadius + 3;
  const rayOuter = sunRadius + 8;
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.lineWidth = 1.5;

  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(angle) * rayInner, sunY + Math.sin(angle) * rayInner);
    ctx.lineTo(sunX + Math.cos(angle) * rayOuter, sunY + Math.sin(angle) * rayOuter);
    ctx.stroke();
  }

  // Tree (simple)
  const treeX = centerX + sceneWidth * 0.1;
  const treeBaseY = groundY;
  const trunkHeight = sceneHeight * 0.2;
  const trunkWidth = sceneWidth * 0.04;

  // Trunk
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
  ctx.fillRect(treeX - trunkWidth / 2, treeBaseY - trunkHeight, trunkWidth, trunkHeight);

  // Foliage (triangular)
  const foliageHeight = sceneHeight * 0.22;
  const foliageWidth = sceneWidth * 0.18;

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.15})`;
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(treeX, treeBaseY - trunkHeight - foliageHeight);
  ctx.lineTo(treeX - foliageWidth / 2, treeBaseY - trunkHeight + 5);
  ctx.lineTo(treeX + foliageWidth / 2, treeBaseY - trunkHeight + 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shadow from tree (changes with sun position)
  const shadowLength = sceneWidth * 0.15 + timeOffset * sceneWidth * 0.1;
  const shadowDirection = timeOffset > 0 ? -1 : 1; // Shadow moves opposite to sun

  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.25})`;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(treeX, treeBaseY);
  ctx.lineTo(treeX + shadowDirection * shadowLength * (1 - timeOffset * 0.3), treeBaseY);
  ctx.stroke();

  ctx.restore();
}

// Draw the mind/thought bubble with internal model
function drawMind(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  mindWidth: number,
  mindHeight: number,
  alpha: number,
  progress: number
) {
  ctx.save();

  // Brain outline (thought bubble style)
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
  ctx.lineWidth = 2;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.03})`;

  // Main brain shape
  ctx.beginPath();

  const startX = centerX;
  const startY = centerY + mindHeight * 0.4;

  ctx.moveTo(startX, startY);

  // Left side
  ctx.bezierCurveTo(
    centerX - mindWidth * 0.15, centerY + mindHeight * 0.45,
    centerX - mindWidth * 0.48, centerY + mindHeight * 0.25,
    centerX - mindWidth * 0.48, centerY
  );

  // Left lobe upper curve
  ctx.bezierCurveTo(
    centerX - mindWidth * 0.5, centerY - mindHeight * 0.35,
    centerX - mindWidth * 0.35, centerY - mindHeight * 0.45,
    centerX - mindWidth * 0.15, centerY - mindHeight * 0.4
  );

  // Top dip
  ctx.bezierCurveTo(
    centerX - mindWidth * 0.05, centerY - mindHeight * 0.38,
    centerX + mindWidth * 0.05, centerY - mindHeight * 0.38,
    centerX + mindWidth * 0.15, centerY - mindHeight * 0.4
  );

  // Right lobe upper curve
  ctx.bezierCurveTo(
    centerX + mindWidth * 0.35, centerY - mindHeight * 0.45,
    centerX + mindWidth * 0.5, centerY - mindHeight * 0.35,
    centerX + mindWidth * 0.48, centerY
  );

  // Right side back to start
  ctx.bezierCurveTo(
    centerX + mindWidth * 0.48, centerY + mindHeight * 0.25,
    centerX + mindWidth * 0.15, centerY + mindHeight * 0.45,
    startX, startY
  );

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Internal model visualization (simplified/abstract version of scene)
  const modelAlpha = Math.min(1, (progress - 0.30) / 0.15) * alpha;

  if (modelAlpha > 0) {
    // Abstract representation - simplified geometric shapes
    const innerCenterY = centerY - mindHeight * 0.05;

    // Abstract sun (small circle)
    const abstractSunX = centerX - mindWidth * 0.15;
    const abstractSunY = innerCenterY - mindHeight * 0.15;
    const abstractSunR = mindWidth * 0.06;

    ctx.strokeStyle = `rgba(0, 0, 0, ${modelAlpha * 0.5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(abstractSunX, abstractSunY, abstractSunR, 0, Math.PI * 2);
    ctx.stroke();

    // Abstract tree (simple triangle + line)
    const abstractTreeX = centerX + mindWidth * 0.1;
    const abstractTreeY = innerCenterY + mindHeight * 0.1;

    ctx.strokeStyle = `rgba(0, 0, 0, ${modelAlpha * 0.5})`;
    ctx.lineWidth = 1.5;

    // Trunk (line)
    ctx.beginPath();
    ctx.moveTo(abstractTreeX, abstractTreeY);
    ctx.lineTo(abstractTreeX, abstractTreeY - mindHeight * 0.12);
    ctx.stroke();

    // Foliage (triangle)
    ctx.beginPath();
    ctx.moveTo(abstractTreeX, abstractTreeY - mindHeight * 0.22);
    ctx.lineTo(abstractTreeX - mindWidth * 0.08, abstractTreeY - mindHeight * 0.1);
    ctx.lineTo(abstractTreeX + mindWidth * 0.08, abstractTreeY - mindHeight * 0.1);
    ctx.closePath();
    ctx.stroke();

    // Ground line (abstract)
    ctx.beginPath();
    ctx.moveTo(centerX - mindWidth * 0.25, innerCenterY + mindHeight * 0.15);
    ctx.lineTo(centerX + mindWidth * 0.25, innerCenterY + mindHeight * 0.15);
    ctx.stroke();

    // Connection lines (showing relationships in the model)
    ctx.strokeStyle = `rgba(0, 0, 0, ${modelAlpha * 0.2})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Sun to tree shadow relationship
    ctx.beginPath();
    ctx.moveTo(abstractSunX, abstractSunY);
    ctx.lineTo(abstractTreeX, abstractTreeY);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  // Brain wrinkles/folds
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.2})`;
  ctx.lineWidth = 1;

  // Left fold
  ctx.beginPath();
  ctx.moveTo(centerX - mindWidth * 0.35, centerY - mindHeight * 0.1);
  ctx.quadraticCurveTo(centerX - mindWidth * 0.25, centerY - mindHeight * 0.05, centerX - mindWidth * 0.15, centerY - mindHeight * 0.12);
  ctx.stroke();

  // Right fold
  ctx.beginPath();
  ctx.moveTo(centerX + mindWidth * 0.35, centerY - mindHeight * 0.1);
  ctx.quadraticCurveTo(centerX + mindWidth * 0.25, centerY - mindHeight * 0.05, centerX + mindWidth * 0.15, centerY - mindHeight * 0.12);
  ctx.stroke();

  // Center groove
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - mindHeight * 0.38);
  ctx.quadraticCurveTo(centerX, centerY - mindHeight * 0.1, centerX, centerY + mindHeight * 0.2);
  ctx.stroke();

  ctx.restore();
}

// Draw time arrow (indicating prediction into future)
function drawTimeArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  alpha: number
) {
  ctx.save();

  // Dashed arrow line
  ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - 8, toY);
  ctx.stroke();

  ctx.setLineDash([]);

  // Arrowhead
  const arrowSize = 6;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize, toY - arrowSize * 0.5);
  ctx.lineTo(toX - arrowSize, toY + arrowSize * 0.5);
  ctx.closePath();
  ctx.fill();

  // "t + 1" label
  ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`;
  ctx.fillText('t + 1', (fromX + toX) / 2, fromY - 4);

  ctx.restore();
}

// Draw verification result (checkmark for match)
function drawVerification(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  progress: number
) {
  ctx.save();

  // Success case (prediction matches reality)
  const verifyProgress = Math.min(1, (progress - 0.75) / 0.15);

  // Background circle
  ctx.fillStyle = `rgba(60, 140, 80, ${alpha * 0.1})`;
  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.6})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Animated checkmark
  const checkProgress = Math.min(1, verifyProgress * 2);

  ctx.strokeStyle = `rgba(60, 140, 80, ${alpha * 0.9})`;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();

  // First part of checkmark
  const check1EndX = x - 2;
  const check1EndY = y + 4;
  const check1StartX = x - 8;
  const check1StartY = y;

  if (checkProgress > 0) {
    const p1 = Math.min(1, checkProgress * 2);
    ctx.moveTo(check1StartX, check1StartY);
    ctx.lineTo(
      check1StartX + (check1EndX - check1StartX) * p1,
      check1StartY + (check1EndY - check1StartY) * p1
    );
  }

  // Second part of checkmark
  if (checkProgress > 0.5) {
    const p2 = (checkProgress - 0.5) * 2;
    const check2EndX = x + 8;
    const check2EndY = y - 6;
    ctx.moveTo(check1EndX, check1EndY);
    ctx.lineTo(
      check1EndX + (check2EndX - check1EndX) * p2,
      check1EndY + (check2EndY - check1EndY) * p2
    );
  }

  ctx.stroke();

  // Label
  if (verifyProgress > 0.5) {
    const labelAlpha = Math.min(1, (verifyProgress - 0.5) * 2) * alpha;
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = `rgba(60, 140, 80, ${labelAlpha * 0.8})`;
    ctx.fillText('Model Validated', x, y + 25);
  }

  ctx.restore();
}
