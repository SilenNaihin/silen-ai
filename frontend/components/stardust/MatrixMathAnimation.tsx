'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

interface MatrixMathAnimationProps {
  progress: number;
  className?: string;
}

/**
 * Matrix Math Animation showing the mathematics of neural network training
 *
 * Phase 1 (0-0.15): Embedding lookup - selecting a row from matrix
 * Phase 2 (0.15-0.30): Dot product visualization - two vectors aligning
 * Phase 3 (0.30-0.45): Matrix multiplication - many dot products
 * Phase 4 (0.45-0.70): Forward pass through network layers
 * Phase 5 (0.70-0.85): Loss computation
 * Phase 6 (0.85-1.0): Backprop gradient flow
 */
export function MatrixMathAnimation({
  progress,
  className = '',
}: MatrixMathAnimationProps) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const centerX = width / 2;
    const centerY = height / 2;

    // Determine phase
    const phase = getPhase(progress);

    // Draw title
    drawTitle(ctx, centerX, height * 0.08, phase);

    // Phase 1: Embedding Lookup
    if (progress < 0.18) {
      const phaseProgress = progress / 0.15;
      drawEmbeddingLookup(ctx, centerX, centerY, phaseProgress, width, height);
    }
    // Phase 2: Dot Product
    else if (progress < 0.33) {
      const phaseProgress = (progress - 0.15) / 0.15;
      drawDotProduct(ctx, centerX, centerY, phaseProgress, width, height);
    }
    // Phase 3: Matrix Multiplication
    else if (progress < 0.48) {
      const phaseProgress = (progress - 0.30) / 0.15;
      drawMatrixMultiplication(ctx, centerX, centerY, phaseProgress, width, height);
    }
    // Phase 4: Forward Pass
    else if (progress < 0.73) {
      const phaseProgress = (progress - 0.45) / 0.25;
      drawForwardPassMath(ctx, centerX, centerY, phaseProgress, width, height);
    }
    // Phase 5: Loss
    else if (progress < 0.88) {
      const phaseProgress = (progress - 0.70) / 0.15;
      drawLossComputation(ctx, centerX, centerY, phaseProgress, width, height);
    }
    // Phase 6: Backprop
    else {
      const phaseProgress = (progress - 0.85) / 0.15;
      drawBackpropFlow(ctx, centerX, centerY, phaseProgress, width, height);
    }

    // Draw phase indicator
    drawPhaseIndicator(ctx, width * 0.9, height * 0.12, phase);
  };

  return (
    <AnimationCanvas progress={progress} className={`w-full h-full ${className}`}>
      {renderAnimation}
    </AnimationCanvas>
  );
}

function getPhase(progress: number): number {
  if (progress < 0.15) return 1;
  if (progress < 0.30) return 2;
  if (progress < 0.45) return 3;
  if (progress < 0.70) return 4;
  if (progress < 0.85) return 5;
  return 6;
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const titles = [
    'Embedding Lookup',
    'The Dot Product',
    'Matrix Multiplication',
    'Forward Pass',
    'Loss Computation',
    'Backpropagation',
  ];

  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillText(titles[phase - 1], x, y);
}

function drawPhaseIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: number
) {
  const labels = ['E', 'D', 'M', 'F', 'L', 'B'];

  labels.forEach((label, i) => {
    const isActive = i + 1 === phase;
    const dotX = x - (labels.length - 1 - i) * 20;

    ctx.beginPath();
    ctx.arc(dotX, y, isActive ? 10 : 6, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    if (isActive) {
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(label, dotX, y);
    }
  });
}

// Phase 1: Embedding Lookup
function drawEmbeddingLookup(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  const matrixX = centerX - 100;
  const matrixY = centerY - 80;
  const cellSize = 36;
  const rows = 5;
  const cols = 4;

  // Draw embedding matrix E
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText('Embedding Matrix E', matrixX + (cols * cellSize) / 2, matrixY - 20);

  // Draw vocabulary labels
  const vocabLabels = ['the', 'cat', 'sat', 'on', 'mat'];
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';

  vocabLabels.forEach((label, i) => {
    const isSelected = i === 1; // "cat" is selected
    ctx.fillStyle = isSelected
      ? `rgba(40, 120, 60, ${Math.min(1, progress * 2)})`
      : 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(label, matrixX - 10, matrixY + i * cellSize + cellSize / 2 + 4);
  });

  // Draw matrix cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = matrixX + c * cellSize;
      const y = matrixY + r * cellSize;
      const isSelectedRow = r === 1;

      // Cell highlight for selected row
      if (isSelectedRow && progress > 0.3) {
        const highlightAlpha = Math.min(1, (progress - 0.3) * 3);
        ctx.fillStyle = `rgba(40, 120, 60, ${highlightAlpha * 0.3})`;
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      // Cell border
      ctx.strokeStyle = isSelectedRow && progress > 0.3
        ? `rgba(40, 120, 60, ${Math.min(1, (progress - 0.3) * 3)})`
        : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = isSelectedRow && progress > 0.3 ? 3 : 1;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Cell value
      const value = (Math.sin(r * 3 + c * 7) * 0.5 + 0.5).toFixed(1);
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isSelectedRow && progress > 0.3
        ? 'rgba(40, 120, 60, 1)'
        : 'rgba(0, 0, 0, 0.7)';
      ctx.fillText(value, x + cellSize / 2, y + cellSize / 2);
    }
  }

  // Draw token ID selector
  if (progress > 0.1) {
    const selectorAlpha = Math.min(1, (progress - 0.1) * 5);
    const tokenX = matrixX - 70;
    const tokenY = centerY - 10;

    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${selectorAlpha * 0.7})`;
    ctx.fillText('token_id', tokenX, tokenY - 25);

    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(40, 120, 60, ${selectorAlpha})`;
    ctx.fillText('1', tokenX, tokenY + 5);

    // Arrow to row
    if (progress > 0.4) {
      const arrowAlpha = Math.min(1, (progress - 0.4) * 3);
      ctx.strokeStyle = `rgba(40, 120, 60, ${arrowAlpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(tokenX + 20, tokenY);
      ctx.lineTo(matrixX - 15, matrixY + cellSize * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw output vector
  if (progress > 0.6) {
    const outputAlpha = Math.min(1, (progress - 0.6) * 2.5);
    const outputX = matrixX + cols * cellSize + 50;
    const outputY = matrixY + cellSize;

    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${outputAlpha * 0.7})`;
    ctx.fillText('E[1] = "cat"', outputX + 40, outputY - 20);

    // Output vector
    for (let c = 0; c < cols; c++) {
      const x = outputX + c * cellSize;
      const value = (Math.sin(1 * 3 + c * 7) * 0.5 + 0.5).toFixed(1);

      ctx.fillStyle = `rgba(40, 120, 60, ${outputAlpha * 0.25})`;
      ctx.fillRect(x, outputY, cellSize, cellSize);

      ctx.strokeStyle = `rgba(40, 120, 60, ${outputAlpha})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, outputY, cellSize, cellSize);

      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(40, 120, 60, ${outputAlpha})`;
      ctx.fillText(value, x + cellSize / 2, outputY + cellSize / 2);
    }

    // Equals sign
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${outputAlpha * 0.8})`;
    ctx.fillText('=', matrixX + cols * cellSize + 25, outputY + cellSize / 2);
  }
}

// Phase 2: Dot Product
function drawDotProduct(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  // Draw two vectors
  const origin = { x: centerX - 40, y: centerY + 50 };
  const scale = 110;

  // Vector a (query/pattern)
  const aAngle = -Math.PI / 6;
  const aEnd = {
    x: origin.x + Math.cos(aAngle) * scale,
    y: origin.y + Math.sin(aAngle) * scale,
  };

  // Vector b (rotates based on progress to show alignment)
  const bAngleStart = Math.PI / 3;
  const bAngleEnd = aAngle + 0.1; // Nearly aligned
  const bAngle = bAngleStart + (bAngleEnd - bAngleStart) * Math.min(1, progress * 1.5);
  const bEnd = {
    x: origin.x + Math.cos(bAngle) * scale * 0.9,
    y: origin.y + Math.sin(bAngle) * scale * 0.9,
  };

  // Draw vectors
  drawArrow(ctx, origin.x, origin.y, aEnd.x, aEnd.y, 'rgba(40, 120, 60, 1)', 4);
  drawArrow(ctx, origin.x, origin.y, bEnd.x, bEnd.y, 'rgba(60, 100, 180, 1)', 4);

  // Labels
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(40, 120, 60, 1)';
  ctx.fillText('a', aEnd.x + 15, aEnd.y - 8);
  ctx.fillStyle = 'rgba(60, 100, 180, 1)';
  ctx.fillText('b', bEnd.x + 15, bEnd.y - 8);

  // Draw angle arc
  const angleSize = 35;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, angleSize, Math.min(aAngle, bAngle), Math.max(aAngle, bAngle));
  ctx.stroke();

  // Angle label
  const angleDeg = Math.abs(bAngle - aAngle) * (180 / Math.PI);
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  const midAngle = (aAngle + bAngle) / 2;
  ctx.fillText(
    `θ = ${angleDeg.toFixed(0)}°`,
    origin.x + Math.cos(midAngle) * 55,
    origin.y + Math.sin(midAngle) * 55
  );

  // Dot product formula and result
  const dotProduct = Math.cos(bAngle - aAngle) * scale * scale * 0.9;
  const normalizedDot = dotProduct / (scale * scale);

  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillText('a · b = |a||b|cos(θ)', centerX, centerY - 80);

  // Result box
  const resultY = centerY - 45;
  ctx.fillStyle = normalizedDot > 0.5 ? 'rgba(40, 120, 60, 0.15)' : 'rgba(180, 80, 60, 0.15)';
  ctx.fillRect(centerX - 60, resultY - 16, 120, 32);
  ctx.strokeStyle = normalizedDot > 0.5 ? 'rgba(40, 120, 60, 0.8)' : 'rgba(180, 80, 60, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - 60, resultY - 16, 120, 32);

  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = normalizedDot > 0.5 ? 'rgba(40, 120, 60, 1)' : 'rgba(180, 80, 60, 1)';
  ctx.fillText(`= ${normalizedDot.toFixed(2)}`, centerX, resultY + 2);

  // Similarity interpretation
  if (progress > 0.6) {
    const alpha = Math.min(1, (progress - 0.6) * 2.5);
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
    const interpretation = normalizedDot > 0.7 ? 'Similar!' : normalizedDot > 0.3 ? 'Somewhat similar' : 'Different';
    ctx.fillText(interpretation, centerX, resultY + 35);
  }
}

// Phase 3: Matrix Multiplication
function drawMatrixMultiplication(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  const cellSize = 32;
  const matrixW = { rows: 3, cols: 4, x: centerX - 140, y: centerY - 60 };
  const vectorX = { rows: 4, x: centerX + 30, y: centerY - 60 };
  const resultY = { rows: 3, x: centerX + 120, y: centerY - 60 };

  // Label
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText('W', matrixW.x + (matrixW.cols * cellSize) / 2, matrixW.y - 15);
  ctx.fillText('x', vectorX.x + cellSize / 2, vectorX.y - 15);
  ctx.fillText('y', resultY.x + cellSize / 2, resultY.y - 15);

  // Draw W matrix
  for (let r = 0; r < matrixW.rows; r++) {
    for (let c = 0; c < matrixW.cols; c++) {
      const x = matrixW.x + c * cellSize;
      const y = matrixW.y + r * cellSize;

      // Highlight row being computed
      const highlightRow = Math.floor(progress * 4);
      const isActive = r === highlightRow && progress < 0.9;

      ctx.fillStyle = isActive ? 'rgba(40, 120, 60, 0.25)' : 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(x, y, cellSize, cellSize);

      ctx.strokeStyle = isActive ? 'rgba(40, 120, 60, 0.9)' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = isActive ? 2.5 : 1;
      ctx.strokeRect(x, y, cellSize, cellSize);

      const value = (Math.sin(r * 5 + c * 3) * 0.5).toFixed(1);
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isActive ? 'rgba(40, 120, 60, 1)' : 'rgba(0, 0, 0, 0.6)';
      ctx.fillText(value, x + cellSize / 2, y + cellSize / 2);
    }
  }

  // Draw x vector
  for (let r = 0; r < vectorX.rows; r++) {
    const x = vectorX.x;
    const y = vectorX.y + r * cellSize;

    const highlightRow = Math.floor(progress * 4);
    const isActive = highlightRow < 3 && progress < 0.9;

    ctx.fillStyle = isActive ? 'rgba(60, 100, 180, 0.25)' : 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(x, y, cellSize, cellSize);

    ctx.strokeStyle = isActive ? 'rgba(60, 100, 180, 0.9)' : 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = isActive ? 2.5 : 1;
    ctx.strokeRect(x, y, cellSize, cellSize);

    const value = (Math.cos(r * 4) * 0.5).toFixed(1);
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isActive ? 'rgba(60, 100, 180, 1)' : 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(value, x + cellSize / 2, y + cellSize / 2);
  }

  // Draw result vector (progressively fills)
  for (let r = 0; r < resultY.rows; r++) {
    const x = resultY.x;
    const y = resultY.y + r * cellSize;

    const rowProgress = progress * 4;
    const isComputed = r < rowProgress;
    const isComputing = r >= rowProgress - 1 && r < rowProgress;

    if (isComputed || isComputing) {
      const alpha = isComputing ? (rowProgress - r) : 1;

      ctx.fillStyle = `rgba(40, 120, 60, ${alpha * 0.3})`;
      ctx.fillRect(x, y, cellSize, cellSize);

      ctx.strokeStyle = `rgba(40, 120, 60, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Compute dot product result
      let dotResult = 0;
      for (let c = 0; c < 4; c++) {
        dotResult += Math.sin(r * 5 + c * 3) * 0.5 * Math.cos(c * 4) * 0.5;
      }

      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = `rgba(40, 120, 60, ${alpha})`;
      ctx.fillText(dotResult.toFixed(1), x + cellSize / 2, y + cellSize / 2);
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillText('?', x + cellSize / 2, y + cellSize / 2);
    }
  }

  // Operators
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText('×', vectorX.x - 15, centerY);
  ctx.fillText('=', resultY.x - 18, centerY);

  // "Each row is a dot product" label
  if (progress > 0.3) {
    const alpha = Math.min(1, (progress - 0.3) * 2);
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
    ctx.textAlign = 'center';
    ctx.fillText('Each output = row · x (dot product)', centerX, centerY + 75);
  }
}

// Phase 4: Forward Pass
function drawForwardPassMath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  // Network layers
  const layers = [
    { label: 'x', neurons: 3, x: centerX - 130 },
    { label: 'h', neurons: 4, x: centerX - 35 },
    { label: 'z', neurons: 2, x: centerX + 60 },
    { label: 'p', neurons: 2, x: centerX + 140 },
  ];

  const neuronSpacing = 36;
  const neuronRadius = 14;

  // Draw connections and neurons
  layers.forEach((layer, layerIdx) => {
    const startY = centerY - ((layer.neurons - 1) * neuronSpacing) / 2;

    // Draw connections to next layer
    if (layerIdx < layers.length - 1) {
      const nextLayer = layers[layerIdx + 1];
      const nextStartY = centerY - ((nextLayer.neurons - 1) * neuronSpacing) / 2;

      const layerProgress = progress * 4;
      const isActive = layerIdx < layerProgress && layerIdx + 1 <= layerProgress;

      for (let i = 0; i < layer.neurons; i++) {
        for (let j = 0; j < nextLayer.neurons; j++) {
          const fromY = startY + i * neuronSpacing;
          const toY = nextStartY + j * neuronSpacing;

          ctx.strokeStyle = isActive
            ? `rgba(40, 120, 60, ${0.5 + Math.sin(i + j) * 0.2})`
            : 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = isActive ? 2.5 : 1;

          ctx.beginPath();
          ctx.moveTo(layer.x + neuronRadius, fromY);
          ctx.lineTo(nextLayer.x - neuronRadius, toY);
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    for (let i = 0; i < layer.neurons; i++) {
      const y = startY + i * neuronSpacing;
      const layerProgress = progress * 4;
      const isActive = layerIdx < layerProgress;

      ctx.beginPath();
      ctx.arc(layer.x, y, neuronRadius, 0, Math.PI * 2);

      if (isActive) {
        ctx.fillStyle = 'rgba(40, 120, 60, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(40, 120, 60, 1)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      }
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Layer label
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(layer.label, layer.x, startY + layer.neurons * neuronSpacing + 28);
  });

  // Operation labels
  const ops = [
    { x: centerX - 82, label: 'W₁x + b₁' },
    { x: centerX + 12, label: 'W₂h + b₂' },
    { x: centerX + 100, label: 'softmax' },
  ];

  ops.forEach((op, i) => {
    const opProgress = progress * 4;
    const isActive = i < opProgress - 0.5;
    const alpha = isActive ? 0.9 : 0.4;

    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillText(op.label, op.x, centerY - 70);
  });

  // ReLU indicator
  if (progress > 0.3 && progress < 0.6) {
    const alpha = Math.min(1, (progress - 0.3) * 3);
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(40, 120, 60, ${alpha})`;
    ctx.fillText('ReLU', centerX - 82, centerY + 70);
  }
}

// Phase 5: Loss Computation
function drawLossComputation(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  const barWidth = 45;
  const barMaxHeight = 90;
  const barGap = 10;
  const groupGap = 50;

  // Calculate total width to center everything
  const predGroupWidth = 2 * barWidth + barGap;
  const targetGroupWidth = 2 * barWidth + barGap;
  const totalWidth = predGroupWidth + groupGap + targetGroupWidth;
  const startX = centerX - totalWidth / 2;

  const predX = startX;
  const targetX = startX + predGroupWidth + groupGap;
  const barY = centerY + 20;

  const predValues = [0.7, 0.3];
  const targetValues = [1.0, 0.0];
  const classes = ['pos', 'neg'];

  // Labels
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText('Prediction', predX + predGroupWidth / 2, barY - barMaxHeight - 20);
  ctx.fillText('Target', targetX + targetGroupWidth / 2, barY - barMaxHeight - 20);

  classes.forEach((cls, i) => {
    const pX = predX + i * (barWidth + barGap);
    const tX = targetX + i * (barWidth + barGap);
    const predHeight = predValues[i] * barMaxHeight * Math.min(1, progress * 2);
    const targetHeight = targetValues[i] * barMaxHeight * Math.min(1, progress * 2);

    // Prediction bar
    ctx.fillStyle = 'rgba(60, 100, 180, 0.4)';
    ctx.fillRect(pX, barY - predHeight, barWidth, predHeight);
    ctx.strokeStyle = 'rgba(60, 100, 180, 1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(pX, barY - predHeight, barWidth, predHeight);

    // Target bar
    ctx.fillStyle = 'rgba(40, 120, 60, 0.4)';
    ctx.fillRect(tX, barY - targetHeight, barWidth, targetHeight);
    ctx.strokeStyle = 'rgba(40, 120, 60, 1)';
    ctx.strokeRect(tX, barY - targetHeight, barWidth, targetHeight);

    // Class labels
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(cls, pX + barWidth / 2, barY + 15);
    ctx.fillText(cls, tX + barWidth / 2, barY + 15);

    // Values
    if (progress > 0.3) {
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(60, 100, 180, 1)';
      ctx.fillText(predValues[i].toFixed(1), pX + barWidth / 2, barY - predHeight - 6);
      ctx.fillStyle = 'rgba(40, 120, 60, 1)';
      ctx.fillText(targetValues[i].toFixed(1), tX + barWidth / 2, barY - targetHeight - 6);
    }
  });

  // Loss formula and value
  if (progress > 0.5) {
    const alpha = Math.min(1, (progress - 0.5) * 2);
    const loss = -Math.log(0.7);

    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
    ctx.fillText('L = -log(p_true)', centerX, barY + 40);

    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(180, 50, 50, ${alpha})`;
    ctx.fillText(`= ${loss.toFixed(2)}`, centerX, barY + 65);
  }
}

// Phase 6: Backpropagation - Wheel/Gear Chain Rule Visualization
function drawBackpropFlow(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  progress: number,
  width: number,
  height: number
) {
  // Three connected wheels showing chain rule
  // x-wheel drives u-wheel drives y-wheel
  // du/dx and dy/du are the "gear ratios"

  const wheelSpacing = 100;
  const wheels = [
    { label: 'x', radius: 40, x: centerX - wheelSpacing, color: '#3b82f6', derivative: 'dx' },
    { label: 'u', radius: 30, x: centerX, color: '#22c55e', derivative: 'du' },
    { label: 'y', radius: 25, x: centerX + wheelSpacing * 0.85, color: '#f59e0b', derivative: 'dy' },
  ];

  const wheelY = centerY - 10;
  const baseRotation = progress * Math.PI * 4; // Rotate with progress

  // Gear ratios (derivatives)
  const du_dx = 2; // u changes 2x as fast as x
  const dy_du = 0.5; // y changes 0.5x as fast as u

  // Draw connecting "belts" between wheels
  if (progress > 0.2) {
    const beltAlpha = Math.min(1, (progress - 0.2) * 3);

    // Belt from x to u
    ctx.strokeStyle = `rgba(0, 0, 0, ${beltAlpha * 0.3})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(wheels[0].x + wheels[0].radius, wheelY);
    ctx.lineTo(wheels[1].x - wheels[1].radius, wheelY);
    ctx.stroke();

    // Belt from u to y
    ctx.beginPath();
    ctx.moveTo(wheels[1].x + wheels[1].radius, wheelY);
    ctx.lineTo(wheels[2].x - wheels[2].radius, wheelY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw wheels
  wheels.forEach((wheel, i) => {
    const rotation = i === 0
      ? baseRotation
      : i === 1
        ? baseRotation * du_dx
        : baseRotation * du_dx * dy_du;

    // Wheel circle
    ctx.beginPath();
    ctx.arc(wheel.x, wheelY, wheel.radius, 0, Math.PI * 2);
    ctx.strokeStyle = wheel.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();

    // Spoke showing rotation
    ctx.beginPath();
    ctx.moveTo(wheel.x, wheelY);
    ctx.lineTo(
      wheel.x + Math.cos(rotation) * wheel.radius * 0.85,
      wheelY + Math.sin(rotation) * wheel.radius * 0.85
    );
    ctx.strokeStyle = wheel.color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(wheel.x, wheelY, 4, 0, Math.PI * 2);
    ctx.fillStyle = wheel.color;
    ctx.fill();

    // Wheel label
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(`${wheel.label}-wheel`, wheel.x, wheelY + wheel.radius + 20);
  });

  // Draw derivative labels between wheels
  if (progress > 0.4) {
    const labelAlpha = Math.min(1, (progress - 0.4) * 2);
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    // du/dx
    const midX1 = (wheels[0].x + wheels[1].x) / 2;
    ctx.fillStyle = `rgba(34, 197, 94, ${labelAlpha})`;
    ctx.fillText('du/dx = 2', midX1, wheelY - 55);
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.6})`;
    ctx.fillText('u spins 2× faster', midX1, wheelY - 40);

    // dy/du
    const midX2 = (wheels[1].x + wheels[2].x) / 2;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(245, 158, 11, ${labelAlpha})`;
    ctx.fillText('dy/du = 0.5', midX2, wheelY - 55);
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${labelAlpha * 0.6})`;
    ctx.fillText('y spins 0.5× as fast', midX2, wheelY - 40);
  }

  // Chain rule result
  if (progress > 0.7) {
    const resultAlpha = Math.min(1, (progress - 0.7) * 3);

    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(180, 50, 50, ${resultAlpha})`;
    ctx.fillText('dy/dx = du/dx × dy/du = 2 × 0.5 = 1', centerX, wheelY + 70);

    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = `rgba(0, 0, 0, ${resultAlpha * 0.7})`;
    ctx.fillText('Chain rule: multiply the gear ratios!', centerX, wheelY + 90);
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  width: number
) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';

  // Line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}
