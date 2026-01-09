'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

/**
 * Shared helper to draw a 3x3 matrix with labels
 */
function drawMatrix(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  values: number[][],
  options: {
    cellSize?: number;
    labels?: string[];
    title?: string;
    highlightDiagonal?: boolean;
    highlightPair?: [number, number] | null;
    maxVal?: number;
    colorPositive?: string;
    colorNegative?: string;
  } = {}
) {
  const {
    cellSize = 50,
    labels = ['A', 'B', 'C'],
    title,
    highlightDiagonal = false,
    highlightPair = null,
    maxVal = Math.max(...values.flat().map(Math.abs)),
    colorPositive = '#000',
    colorNegative = '#000',
  } = options;

  const matrixSize = cellSize * 3;

  // Title
  if (title) {
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, x + matrixSize / 2, y - 12);
  }

  // Draw cells
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const val = values[i][j];
      const normalized = maxVal > 0 ? Math.abs(val) / maxVal : 0;
      const cellX = x + j * cellSize;
      const cellY = y + i * cellSize;

      // Background - grayscale intensity
      const grayVal = Math.round(255 - normalized * 180);
      ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
      ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);

      // Highlight diagonal
      if (highlightDiagonal && i === j) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX, cellY, cellSize - 2, cellSize - 2);
      }

      // Highlight symmetric pair
      if (highlightPair && ((i === highlightPair[0] && j === highlightPair[1]) ||
                            (i === highlightPair[1] && j === highlightPair[0]))) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeRect(cellX + 1, cellY + 1, cellSize - 4, cellSize - 4);
      }

      // Value text
      ctx.fillStyle = normalized > 0.5 ? '#fff' : '#000';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(val.toFixed(2), cellX + cellSize / 2, cellY + cellSize / 2 + 4);
    }
  }

  // Row labels (left)
  ctx.fillStyle = '#666';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  labels.forEach((label, i) => {
    ctx.fillText(label, x - 8, y + i * cellSize + cellSize / 2 + 4);
  });

  // Column labels (bottom)
  ctx.textAlign = 'center';
  labels.forEach((label, j) => {
    ctx.fillText(label, x + j * cellSize + cellSize / 2, y + matrixSize + 15);
  });
}

/**
 * Animation showing token flowing through embedding and unembedding matrices
 * Clean, minimalist design with clear visibility
 */
export function TokenFlowAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('The Direct Path', width / 2, 35);

    // Define stages with larger boxes
    const stages = [
      { label: 'token', x: width * 0.12 },
      { label: 'W_E', x: width * 0.32 },
      { label: 'residual', x: width * 0.52 },
      { label: 'W_U', x: width * 0.72 },
      { label: 'logits', x: width * 0.92 },
    ];

    const boxWidth = 70;
    const boxHeight = 45;

    // All elements visible after initial fade-in
    const fadeIn = Math.min(1, progress * 3);

    ctx.globalAlpha = fadeIn;

    stages.forEach((stage, i) => {
      const isMatrix = stage.label === 'W_E' || stage.label === 'W_U';

      // Draw box
      ctx.fillStyle = '#fff';
      ctx.fillRect(stage.x - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = isMatrix ? 2 : 1;
      ctx.strokeRect(stage.x - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = isMatrix ? 'bold 14px monospace' : '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stage.label, stage.x, centerY + 5);

      // Draw arrow to next stage
      if (i < stages.length - 1) {
        const nextStage = stages[i + 1];
        const arrowStart = stage.x + boxWidth / 2 + 8;
        const arrowEnd = nextStage.x - boxWidth / 2 - 8;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(arrowStart, centerY);
        ctx.lineTo(arrowEnd - 6, centerY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowEnd, centerY);
        ctx.lineTo(arrowEnd - 8, centerY - 5);
        ctx.lineTo(arrowEnd - 8, centerY + 5);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Show "tied" connection after full visibility
    if (progress > 0.3) {
      const tieOpacity = Math.min(1, (progress - 0.3) / 0.3);
      ctx.globalAlpha = tieOpacity;

      // Draw curved dashed line connecting W_E and W_U
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      const weX = width * 0.32;
      const wuX = width * 0.72;
      ctx.moveTo(weX, centerY - boxHeight / 2 - 8);
      ctx.quadraticCurveTo(width * 0.52, centerY - 90, wuX, centerY - boxHeight / 2 - 8);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label for tied connection
      ctx.fillStyle = '#000';
      ctx.font = '13px sans-serif';
      ctx.fillText('Tied: W_U = W_E^T', width * 0.52, centerY - 75);
    }

    ctx.globalAlpha = 1;

    // Subtitle
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('Same matrix used for input and output', width / 2, height - 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing the direct path matrix computation
 * Larger, cleaner visualization
 */
export function DirectPathAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('W_E @ W_E^T = Direct Path Matrix', width / 2, 30);

    const tokens = ['New', 'York', 'City'];
    const result = [
      [1.25, 1.25, 0.90],
      [1.25, 1.45, 1.32],
      [0.90, 1.32, 1.53],
    ];

    // Draw single large matrix in center
    const cellSize = 55;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 60;

    // Animate row highlight
    const highlightRow = Math.floor(progress * 4) % 3;

    drawMatrix(ctx, matrixX, matrixY, result, {
      cellSize,
      labels: tokens,
      maxVal: 1.53,
    });

    // Highlight current row
    if (progress > 0.1) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        matrixX,
        matrixY + highlightRow * cellSize,
        cellSize * 3 - 2,
        cellSize - 2
      );
    }

    // Explanation text
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    const explanations = [
      `Input "New" → logits for each output`,
      `Input "York" → logits for each output`,
      `Input "City" → logits for each output`,
    ];
    ctx.fillText(explanations[highlightRow], width / 2, height - 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Aesthetic animation - abstract wave patterns representing language flow
 * Replaces the confusing bigrams animation
 */
export function LanguageFlowAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Language Has Direction', width / 2, 30);

    // Draw flowing lines representing directional language
    const numLines = 5;
    const lineSpacing = (height - 100) / (numLines + 1);

    for (let i = 0; i < numLines; i++) {
      const y = 60 + lineSpacing * (i + 1);
      const phase = progress * Math.PI * 2 + i * 0.5;

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let x = 30; x < width - 30; x += 2) {
        const normalizedX = (x - 30) / (width - 60);
        const amplitude = 15 * Math.sin(normalizedX * Math.PI);
        const yOffset = Math.sin(normalizedX * Math.PI * 3 + phase) * amplitude;

        if (x === 30) {
          ctx.moveTo(x, y + yOffset);
        } else {
          ctx.lineTo(x, y + yOffset);
        }
      }
      ctx.stroke();

      // Arrow at end
      const arrowX = width - 35;
      ctx.beginPath();
      ctx.moveTo(arrowX, y);
      ctx.lineTo(arrowX - 10, y - 5);
      ctx.lineTo(arrowX - 10, y + 5);
      ctx.closePath();
      ctx.fillStyle = '#000';
      ctx.fill();
    }

    // Subtitle
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('"New → York" common, "York → New" rare', width / 2, height - 20);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing the symmetry problem - stacked matrices for visibility
 */
export function SymmetryProblemAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const tokens = ['New', 'York', 'City'];
    const cellSize = 45;
    const matrixWidth = cellSize * 3;

    // Target (asymmetric bigrams) - TOP
    const target = [
      [0.05, 0.85, 0.10],
      [0.10, 0.05, 0.85],
      [0.60, 0.30, 0.10],
    ];

    // Tied result (symmetric) - BOTTOM
    const tied = [
      [1.25, 1.25, 0.90],
      [1.25, 1.45, 1.32],
      [0.90, 1.32, 1.53],
    ];

    const topY = 35;
    const bottomY = height / 2 + 20;
    const matrixX = width / 2 - matrixWidth / 2;

    // Fade in based on progress
    const fadeIn = Math.min(1, progress * 2);
    ctx.globalAlpha = fadeIn;

    // Top matrix - Target
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Target: Bigram Probabilities (asymmetric)', width / 2, topY - 5);

    drawMatrix(ctx, matrixX, topY + 10, target, {
      cellSize,
      labels: tokens,
      maxVal: 0.85,
    });

    // Highlight asymmetric pair in target
    if (progress > 0.4) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      // [0,1] and [1,0] are different
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(matrixX + cellSize, topY + 10, cellSize - 2, cellSize - 2);
      ctx.strokeRect(matrixX, topY + 10 + cellSize, cellSize - 2, cellSize - 2);
      ctx.setLineDash([]);

      // Show values
      ctx.fillStyle = '#000';
      ctx.font = '11px sans-serif';
      ctx.fillText('0.85 ≠ 0.10', width / 2 + matrixWidth / 2 + 40, topY + 10 + cellSize / 2 + 4);
    }

    // Bottom matrix - Tied
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.fillText('Tied: W_E @ W_E^T (forced symmetric)', width / 2, bottomY - 5);

    drawMatrix(ctx, matrixX, bottomY + 10, tied, {
      cellSize,
      labels: tokens,
      maxVal: 1.53,
    });

    // Highlight symmetric pair in tied
    if (progress > 0.6) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(matrixX + cellSize, bottomY + 10, cellSize - 2, cellSize - 2);
      ctx.strokeRect(matrixX, bottomY + 10 + cellSize, cellSize - 2, cellSize - 2);
      ctx.setLineDash([]);

      // Show values are equal
      ctx.fillStyle = '#000';
      ctx.font = '11px sans-serif';
      ctx.fillText('1.25 = 1.25', width / 2 + matrixWidth / 2 + 40, bottomY + 10 + cellSize / 2 + 4);
    }

    // NOT EQUAL sign between matrices
    if (progress > 0.5) {
      ctx.globalAlpha = Math.min(1, (progress - 0.5) * 4);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('≠', width / 2, (topY + 10 + cellSize * 3 + bottomY) / 2 + 5);
      ctx.globalAlpha = fadeIn;
    }

    ctx.globalAlpha = 1;
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing random matrices all producing symmetric results
 */
export function SGDCantFixAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Any W_E Produces Symmetric W_E @ W_E^T', width / 2, 28);

    // Generate pseudo-random matrices based on progress
    const trial = Math.floor(progress * 6);

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    // Generate W_E for current trial
    const W_E: number[][] = [];
    for (let i = 0; i < 3; i++) {
      W_E[i] = [];
      for (let j = 0; j < 2; j++) {
        W_E[i][j] = Math.round((seededRandom(trial * 100 + i * 10 + j) - 0.5) * 20) / 10;
      }
    }

    // Compute W_E @ W_E^T
    const result: number[][] = [];
    for (let i = 0; i < 3; i++) {
      result[i] = [];
      for (let j = 0; j < 3; j++) {
        result[i][j] = Math.round((W_E[i][0] * W_E[j][0] + W_E[i][1] * W_E[j][1]) * 100) / 100;
      }
    }

    const cellSize = 50;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 55;

    // Draw result matrix
    drawMatrix(ctx, matrixX, matrixY, result, {
      cellSize,
      labels: ['A', 'B', 'C'],
      highlightPair: [0, 1],
    });

    // Trial counter
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Random W_E #${trial + 1}`, width / 2, matrixY + cellSize * 3 + 35);

    // Symmetry verification
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.fillText(
      `[A,B] = ${result[0][1].toFixed(2)}  =  [B,A] = ${result[1][0].toFixed(2)}`,
      width / 2,
      height - 25
    );

    // Checkmark
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('✓ Always symmetric', width / 2, height - 8);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing untied embeddings achieving asymmetry
 */
export function UntiedSolutionAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Untied: W_E @ W_U (separate matrices)', width / 2, 28);

    const tokens = ['New', 'York', 'City'];

    // Untied result - can be asymmetric
    const untied = [
      [0.04, 0.82, 0.14],
      [0.12, 0.08, 0.80],
      [0.55, 0.28, 0.17],
    ];

    const cellSize = 50;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 55;

    drawMatrix(ctx, matrixX, matrixY, untied, {
      cellSize,
      labels: tokens,
      maxVal: 0.82,
      highlightPair: [0, 1],
    });

    // Show asymmetry
    if (progress > 0.3) {
      const fadeIn = Math.min(1, (progress - 0.3) / 0.3);
      ctx.globalAlpha = fadeIn;

      ctx.fillStyle = '#000';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `[New,York] = 0.82  ≠  [York,New] = 0.12`,
        width / 2,
        matrixY + cellSize * 3 + 35
      );

      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Can represent asymmetric relationships', width / 2, height - 15);

      ctx.globalAlpha = 1;
    }
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing MLP0 breaking symmetry - cleaner, longer visibility
 */
export function MLPWorkaroundAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('MLP Breaks the Symmetry', width / 2, 30);

    const boxWidth = 60;
    const boxHeight = 40;

    // Show the path with MLP
    const stages = [
      { label: 'W_E', x: width * 0.2 },
      { label: 'MLP₀', x: width * 0.5 },
      { label: 'W_E^T', x: width * 0.8 },
    ];

    // All elements visible throughout
    stages.forEach((stage, i) => {
      const isMLP = stage.label === 'MLP₀';

      // Draw box
      ctx.fillStyle = '#fff';
      ctx.fillRect(stage.x - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = isMLP ? 2 : 1;
      ctx.strokeRect(stage.x - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(stage.label, stage.x, centerY + 5);

      // Draw arrow to next
      if (i < stages.length - 1) {
        const nextStage = stages[i + 1];
        const arrowStart = stage.x + boxWidth / 2 + 8;
        const arrowEnd = nextStage.x - boxWidth / 2 - 8;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(arrowStart, centerY);
        ctx.lineTo(arrowEnd - 6, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(arrowEnd, centerY);
        ctx.lineTo(arrowEnd - 8, centerY - 5);
        ctx.lineTo(arrowEnd - 8, centerY + 5);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Formula
    ctx.fillStyle = '#000';
    ctx.font = '14px monospace';
    ctx.fillText('W_E @ M @ W_E^T', width / 2, centerY + 55);

    // Explanation - visible throughout
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('M is learnable → product can be asymmetric', width / 2, centerY + 80);

    // Trade-off note
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.fillText('Trade-off: MLP capacity spent on this fix', width / 2, height - 20);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Blank animation for sections with interactive content
 */
export function BlankAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}
