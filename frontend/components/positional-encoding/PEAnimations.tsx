'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

/**
 * Animation showing the permutation problem - attention matrix comparison
 * Shows everything at once, no progressive fade-in
 */
export function PermutationProblemAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const tokens = ['The', 'cat', 'sat'];
    const gridSize = 28;
    const matrixSize = gridSize * 3;

    // Position matrices closer together with = sign in center
    const gap = 50; // Gap between matrix and = sign
    const leftMatrixX = centerX - gap - matrixSize / 2;
    const rightMatrixX = centerX + gap + matrixSize / 2;

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('The Permutation Problem', centerX, 25);

    // Left side: Original order label
    ctx.fillStyle = '#000';
    ctx.font = '11px sans-serif';
    ctx.fillText('Original', leftMatrixX, 50);

    // Draw tokens in order above left matrix
    ctx.font = '10px monospace';
    tokens.forEach((token, i) => {
      const x = leftMatrixX - matrixSize / 2 + gridSize / 2 + i * gridSize;
      ctx.fillText(token, x, 70);
    });

    // Right side: Shuffled order label
    ctx.fillStyle = '#000';
    ctx.font = '11px sans-serif';
    ctx.fillText('Shuffled', rightMatrixX, 50);

    const shuffled = ['sat', 'The', 'cat'];
    ctx.font = '10px monospace';
    shuffled.forEach((token, i) => {
      const x = rightMatrixX - matrixSize / 2 + gridSize / 2 + i * gridSize;
      ctx.fillText(token, x, 70);
    });

    // Draw identical attention patterns
    const values = [
      [0.8, 0.4, 0.2],
      [0.4, 0.9, 0.3],
      [0.2, 0.3, 0.7],
    ];

    // Left matrix
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = leftMatrixX - matrixSize / 2 + j * gridSize;
        const y = centerY - matrixSize / 2 + i * gridSize;
        const val = values[i][j];
        ctx.fillStyle = `rgba(59, 130, 246, ${val})`;
        ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
      }
    }

    // Right matrix (same pattern)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = rightMatrixX - matrixSize / 2 + j * gridSize;
        const y = centerY - matrixSize / 2 + i * gridSize;
        const val = values[i][j];
        ctx.fillStyle = `rgba(59, 130, 246, ${val})`;
        ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
      }
    }

    // Equals sign (always visible, highlighted in red)
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('=', centerX, centerY + 5);

    // Bottom text
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText('Same attention scores!', centerX, height - 35);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.fillText('Model cannot distinguish token order.', centerX, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing integer positions exploding for large values
 */
export function IntegerExplosionAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const marginX = 50;
    const barWidth = 40;
    const maxBarHeight = height - 100;

    // Animate position from 0 to 9999
    const position = Math.floor(progress * 9999);
    const semanticValue = 1.5; // Fixed semantic embedding magnitude

    // Scale for visualization
    const scale = maxBarHeight / 10000;

    // Draw semantic embedding bar (fixed)
    const semanticHeight = semanticValue * scale * 1000;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(marginX, height - 50 - semanticHeight, barWidth, semanticHeight);

    // Draw position bar (growing)
    const posHeight = position * scale;
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(marginX + barWidth + 10, height - 50 - posHeight, barWidth, posHeight);

    // Draw combined bar
    const combinedHeight = Math.min(maxBarHeight, semanticHeight + posHeight);
    ctx.fillStyle = '#374151';
    ctx.fillRect(marginX + (barWidth + 10) * 2, height - 50 - combinedHeight, barWidth, combinedHeight);

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('semantic', marginX + barWidth / 2, height - 30);
    ctx.fillText('position', marginX + barWidth + 10 + barWidth / 2, height - 30);
    ctx.fillText('combined', marginX + (barWidth + 10) * 2 + barWidth / 2, height - 30);

    // Position value (highlighted)
    ctx.font = '16px monospace';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'left';
    ctx.fillText(`pos = ${position}`, width - 120, 50);

    // Warning text
    if (position > 100) {
      const opacity = Math.min(1, (position - 100) / 200);
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Position dominates!', width / 2, height - 10);
    }

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Integer Position Encoding', width / 2, 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing single sine wave with periodicity problem
 */
export function SingleSineAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const marginX = 40;
    const marginY = 50;
    const graphWidth = width - marginX * 2;
    const graphHeight = height - marginY * 2;
    const centerY = height / 2;

    // Draw axis
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, centerY);
    ctx.lineTo(width - marginX, centerY);
    ctx.stroke();

    // Draw sine wave progressively
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const numPoints = Math.floor(progress * 100);
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / 100) * Math.PI * 4;
      const x = marginX + (i / 100) * graphWidth;
      const y = centerY - Math.sin(t) * (graphHeight / 3);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mark collision points
    if (progress > 0.5) {
      const collisionOpacity = Math.min(1, (progress - 0.5) * 4);

      [0, 0.25, 0.5, 0.75, 1].forEach((pos) => {
        if (pos <= progress) {
          const x = marginX + pos * graphWidth;
          const y = centerY - Math.sin(pos * Math.PI * 4) * (graphHeight / 3);

          ctx.fillStyle = `rgba(0, 0, 0, ${collisionOpacity})`;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.fillStyle = `rgba(0, 0, 0, ${collisionOpacity})`;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Repeats every 2π positions!', width / 2, height - 20);
    }

    // Position markers
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', marginX, centerY + 20);
    ctx.fillText('2\u03C0', marginX + graphWidth * 0.25, centerY + 20);
    ctx.fillText('4\u03C0', marginX + graphWidth * 0.5, centerY + 20);
    ctx.fillText('6\u03C0', marginX + graphWidth * 0.75, centerY + 20);

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('sin(position)', width / 2, 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing multiple frequency waves
 */
export function MultiFrequencyAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const marginX = 40;
    const graphWidth = width - marginX * 2;
    const numFreqs = 4;
    const rowHeight = height / (numFreqs + 1);

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    const frequencies = [1, 0.5, 0.25, 0.125];

    for (let f = 0; f < numFreqs; f++) {
      const freq = frequencies[f];
      const y = rowHeight * (f + 1);
      const amplitude = rowHeight * 0.35;

      // Animate each frequency appearing
      const freqProgress = Math.max(0, Math.min(1, progress * (numFreqs + 0.5) - f));
      if (freqProgress <= 0) continue;

      ctx.globalAlpha = Math.min(1, freqProgress);

      // Draw wave
      ctx.strokeStyle = colors[f];
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * Math.PI * 4 * freq;
        const x = marginX + (i / 100) * graphWidth;
        const yPos = y - Math.sin(t) * amplitude;

        if (i === 0) ctx.moveTo(x, yPos);
        else ctx.lineTo(x, yPos);
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = colors[f];
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`\u03C9 = ${freq}`, 8, y - amplitude - 3);

      // Wavelength annotation
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`\u03BB = ${Math.round(2 * Math.PI / freq)}`, width - 10, y - amplitude - 3);

      ctx.globalAlpha = 1;
    }

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Multiple Frequencies', width / 2, 20);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing sin/cos circle tracer
 */
export function CircleTracerAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const radius = Math.min(width, height) * 0.28;

    // Draw unit circle
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();

    // Animate point
    const angle = progress * Math.PI * 3;
    const pointX = centerX + Math.cos(angle) * radius;
    const pointY = centerY - Math.sin(angle) * radius;

    // Draw trail
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * angle;
      const x = centerX + Math.cos(t) * radius;
      const y = centerY - Math.sin(t) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw projections
    ctx.setLineDash([4, 4]);

    // Sin projection (vertical)
    ctx.strokeStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(centerX, pointY);
    ctx.stroke();

    // Cos projection (horizontal)
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'right';
    ctx.fillText(`sin = ${Math.sin(angle).toFixed(2)}`, centerX - radius - 25, pointY + 4);

    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    ctx.fillText(`cos = ${Math.cos(angle).toFixed(2)}`, pointX, centerY + radius + 25);

    // Position label
    ctx.fillStyle = '#374151';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Position: ${Math.floor(angle * 10 / Math.PI)}`, centerX, 25);

    // Coordinates
    ctx.font = '11px monospace';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`(${Math.cos(angle).toFixed(2)}, ${Math.sin(angle).toFixed(2)})`, centerX, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing PE matrix heatmap building up
 */
export function PEMatrixAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const marginX = 50;
    const marginY = 50;
    const matrixWidth = width - marginX * 2;
    const matrixHeight = height - marginY * 2;

    const numPos = 40;
    const numDim = 32;
    const cellWidth = matrixWidth / numDim;
    const cellHeight = matrixHeight / numPos;
    const dModel = 64;

    // Draw matrix cells
    const visibleRows = Math.ceil(progress * numPos);

    for (let pos = 0; pos < visibleRows; pos++) {
      for (let dim = 0; dim < numDim; dim++) {
        const dimIndex = Math.floor(dim / 2);
        const freq = 1 / Math.pow(10000, (2 * dimIndex) / dModel);
        const angle = pos * freq;
        const value = dim % 2 === 0 ? Math.sin(angle) : Math.cos(angle);

        // Color: blue-white-red
        const normalized = (value + 1) / 2;
        let r, g, b;
        if (normalized < 0.5) {
          const intensity = (0.5 - normalized) * 2;
          r = Math.floor(255 - intensity * 155);
          g = Math.floor(255 - intensity * 155);
          b = 255;
        } else {
          const intensity = (normalized - 0.5) * 2;
          r = 255;
          g = Math.floor(255 - intensity * 155);
          b = Math.floor(255 - intensity * 155);
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(
          marginX + dim * cellWidth,
          marginY + pos * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    }

    // Axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dimension (i)', width / 2, height - 15);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Position', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Positional Encoding Matrix', width / 2, 25);

    // Color scale
    const scaleWidth = 80;
    const scaleHeight = 10;
    const scaleX = width - marginX - scaleWidth;
    const scaleY = 35;

    const gradient = ctx.createLinearGradient(scaleX, scaleY, scaleX + scaleWidth, scaleY);
    gradient.addColorStop(0, 'rgb(100,100,255)');
    gradient.addColorStop(0.5, 'rgb(255,255,255)');
    gradient.addColorStop(1, 'rgb(255,100,100)');
    ctx.fillStyle = gradient;
    ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('-1', scaleX, scaleY + scaleHeight + 10);
    ctx.textAlign = 'right';
    ctx.fillText('+1', scaleX + scaleWidth, scaleY + scaleHeight + 10);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing relative position dot products
 */
export function RelativePositionAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const marginX = 40;
    const marginY = 60;
    const graphWidth = width - marginX * 2;
    const graphHeight = height - marginY * 2;
    const centerY = marginY + graphHeight / 2;

    // Reference position moves across
    const refPos = Math.floor(progress * 30) + 10;
    const numPositions = 50;
    const dModel = 64;

    // Compute PE vectors
    const computePE = (pos: number) => {
      const pe: number[] = [];
      for (let i = 0; i < dModel; i++) {
        const dimIndex = Math.floor(i / 2);
        const freq = 1 / Math.pow(10000, (2 * dimIndex) / dModel);
        const angle = pos * freq;
        pe.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
      }
      return pe;
    };

    const dotProduct = (a: number[], b: number[]) => {
      return a.reduce((sum, val, i) => sum + val * b[i], 0);
    };

    const refPE = computePE(refPos);
    const dots: number[] = [];
    for (let i = 0; i < numPositions; i++) {
      dots.push(dotProduct(refPE, computePE(i)));
    }

    const maxDot = Math.max(...dots.map(Math.abs));
    const barWidth = graphWidth / numPositions;

    // Draw bars
    dots.forEach((dot, i) => {
      const normalizedDot = dot / maxDot;
      const barHeight = Math.abs(normalizedDot) * (graphHeight / 2 - 10);

      const isRef = i === refPos;
      ctx.fillStyle = isRef ? '#8b5cf6' : dot > 0 ? '#3b82f6' : '#ef4444';
      ctx.globalAlpha = isRef ? 1 : 0.7;

      const x = marginX + i * barWidth;
      const y = dot > 0 ? centerY - barHeight : centerY;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
    ctx.globalAlpha = 1;

    // Draw center line
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, centerY);
    ctx.lineTo(width - marginX, centerY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('0', marginX, height - 25);
    ctx.textAlign = 'right';
    ctx.fillText(`${numPositions - 1}`, width - marginX, height - 25);

    ctx.textAlign = 'center';
    ctx.fillText('Position', width / 2, height - 10);

    // Reference marker
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '11px sans-serif';
    const refX = marginX + refPos * barWidth + barWidth / 2;
    ctx.fillText(`ref=${refPos}`, refX, marginY - 5);

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText(`PE(${refPos}) \u00B7 PE(j) - Dot Product by Position`, width / 2, 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing learned embeddings lookup table
 */
export function LearnedEmbeddingsAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const numPositions = 8;
    const numDims = 6;
    const cellWidth = 35;
    const cellHeight = 28;
    const startX = width / 2 - (numDims * cellWidth) / 2;
    const startY = 70;

    // Draw lookup table
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Position Embedding Table', width / 2, 30);

    ctx.font = '10px sans-serif';
    ctx.fillText('(learned parameters)', width / 2, 45);

    // Animate which row is highlighted
    const highlightedRow = Math.floor(progress * numPositions * 2) % numPositions;

    for (let pos = 0; pos < numPositions; pos++) {
      const y = startY + pos * cellHeight;
      const isHighlighted = pos === highlightedRow;

      // Row label
      ctx.fillStyle = isHighlighted ? '#8b5cf6' : '#6b7280';
      ctx.font = isHighlighted ? 'bold 11px monospace' : '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`E[${pos}]`, startX - 10, y + cellHeight / 2 + 4);

      for (let dim = 0; dim < numDims; dim++) {
        const x = startX + dim * cellWidth;

        // Generate pseudo-random but consistent values
        const seed = pos * 100 + dim;
        const value = Math.sin(seed * 0.1) * 0.5;

        // Cell background
        const normalized = (value + 1) / 2;
        let r, g, b;
        if (normalized < 0.5) {
          const intensity = (0.5 - normalized) * 2;
          r = Math.floor(255 - intensity * 100);
          g = Math.floor(255 - intensity * 100);
          b = 255;
        } else {
          const intensity = (normalized - 0.5) * 2;
          r = 255;
          g = Math.floor(255 - intensity * 100);
          b = Math.floor(255 - intensity * 100);
        }

        ctx.fillStyle = isHighlighted ? `rgba(${r},${g},${b},1)` : `rgba(${r},${g},${b},0.5)`;
        ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);

        // Border for highlighted
        if (isHighlighted) {
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cellWidth - 2, cellHeight - 2);
        }
      }
    }

    // Arrow showing lookup
    if (progress > 0.1) {
      const arrowY = startY + highlightedRow * cellHeight + cellHeight / 2;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX - 50, arrowY);
      ctx.lineTo(startX - 15, arrowY);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(startX - 15, arrowY);
      ctx.lineTo(startX - 22, arrowY - 5);
      ctx.lineTo(startX - 22, arrowY + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#8b5cf6';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`pos=${highlightedRow}`, startX - 55, arrowY + 4);
    }

    // Limitation note
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fixed size! Cannot exceed max_position.', width / 2, height - 30);

    // Title annotation
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.fillText('nn.Embedding(max_pos, d_model)', width / 2, height - 10);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing 2D rotation
 */
export function RotationAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const radius = Math.min(width, height) * 0.3;

    // Draw coordinate system
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();

    // Unit circle
    ctx.strokeStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();

    // Original vector
    const originalAngle = Math.PI / 6;
    const originalEndX = centerX + Math.cos(originalAngle) * radius * 0.75;
    const originalEndY = centerY - Math.sin(originalAngle) * radius * 0.75;

    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 2;
    drawArrow(ctx, centerX, centerY, originalEndX, originalEndY);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('v', originalEndX + 8, originalEndY - 5);

    // Rotation angle
    const rotationAngle = progress * Math.PI * 1.5;
    const rotatedAngle = originalAngle + rotationAngle;
    const rotatedEndX = centerX + Math.cos(rotatedAngle) * radius * 0.75;
    const rotatedEndY = centerY - Math.sin(rotatedAngle) * radius * 0.75;

    // Draw arc showing rotation
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.35, -originalAngle, -rotatedAngle, true);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rotated vector
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    drawArrow(ctx, centerX, centerY, rotatedEndX, rotatedEndY);

    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('R(\u03B8)v', rotatedEndX + 8, rotatedEndY - 5);

    // Angle label
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`\u03B8 = ${Math.round((rotationAngle * 180) / Math.PI)}\u00B0`, centerX, height - 30);

    // Magnitude preservation
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('|R(\u03B8)v| = |v|  (magnitude preserved)', centerX, height - 12);

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('2D Rotation', centerX, 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing RoPE key insight - relative position
 */
export function RoPEInsightAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const leftCenterX = width * 0.25;
    const rightCenterX = width * 0.75;
    const centerY = height / 2;
    const radius = Math.min(width * 0.2, height * 0.3);

    // Draw two scenarios side by side

    // LEFT: Absolute positions
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(leftCenterX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    const qAngle1 = progress * Math.PI * 0.8;
    const kAngle1 = progress * Math.PI * 0.3;

    // Q vector
    const q1EndX = leftCenterX + Math.cos(qAngle1) * radius * 0.8;
    const q1EndY = centerY - Math.sin(qAngle1) * radius * 0.8;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    drawArrow(ctx, leftCenterX, centerY, q1EndX, q1EndY);

    // K vector
    const k1EndX = leftCenterX + Math.cos(kAngle1) * radius * 0.8;
    const k1EndY = centerY - Math.sin(kAngle1) * radius * 0.8;
    ctx.strokeStyle = '#3b82f6';
    drawArrow(ctx, leftCenterX, centerY, k1EndX, k1EndY);

    // RIGHT: Different absolute, same relative
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(rightCenterX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    const offset = Math.PI / 3;
    const qAngle2 = qAngle1 + offset;
    const kAngle2 = kAngle1 + offset;

    // Q vector
    const q2EndX = rightCenterX + Math.cos(qAngle2) * radius * 0.8;
    const q2EndY = centerY - Math.sin(qAngle2) * radius * 0.8;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    drawArrow(ctx, rightCenterX, centerY, q2EndX, q2EndY);

    // K vector
    const k2EndX = rightCenterX + Math.cos(kAngle2) * radius * 0.8;
    const k2EndY = centerY - Math.sin(kAngle2) * radius * 0.8;
    ctx.strokeStyle = '#3b82f6';
    drawArrow(ctx, rightCenterX, centerY, k2EndX, k2EndY);

    // Labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'center';
    ctx.fillText('q', leftCenterX, centerY - radius - 10);
    ctx.fillText('q', rightCenterX, centerY - radius - 10);

    ctx.fillStyle = '#3b82f6';
    ctx.fillText('k', leftCenterX, centerY + radius + 20);
    ctx.fillText('k', rightCenterX, centerY + radius + 20);

    // Dot product values (should be same!)
    const dot1 = Math.cos(qAngle1 - kAngle1);
    const dot2 = Math.cos(qAngle2 - kAngle2);

    ctx.fillStyle = '#10b981';
    ctx.font = '12px monospace';
    ctx.fillText(`q\u00B7k = ${dot1.toFixed(3)}`, leftCenterX, height - 40);
    ctx.fillText(`q\u00B7k = ${dot2.toFixed(3)}`, rightCenterX, height - 40);

    // Equals sign
    ctx.fillStyle = '#374151';
    ctx.font = '24px sans-serif';
    ctx.fillText('=', width / 2, centerY);

    // Title
    ctx.font = '14px sans-serif';
    ctx.fillText('Same Relative Angle = Same Dot Product', width / 2, 25);

    // Subtitle
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Different absolute positions, same relative distance', width / 2, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing the limitation of additive PE - the four-term expansion problem
 */
export function SummaryAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('The Additive PE Limitation', centerX, 30);

    // Show the attention score expansion
    ctx.font = '13px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('Attention score with additive PE:', centerX, 60);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('(q + pe) · (k + pe)', centerX, 90);

    // Arrow
    ctx.fillText('↓', centerX, 115);

    // Four terms
    ctx.fillText('q·k', centerX - 80, 145);
    ctx.fillText('+', centerX - 45, 145);
    ctx.fillStyle = '#8b5cf6'; // Highlight cross terms
    ctx.fillText('q·pe', centerX - 15, 145);
    ctx.fillStyle = '#000';
    ctx.fillText('+', centerX + 20, 145);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('pe·k', centerX + 50, 145);
    ctx.fillStyle = '#000';
    ctx.fillText('+', centerX + 85, 145);
    ctx.fillText('pe·pe', centerX + 120, 145);

    // Labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('content', centerX - 80, 165);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('cross terms mix', centerX + 15, 165);
    ctx.fillStyle = '#6b7280';
    ctx.fillText('position', centerX + 120, 165);

    // Explanation
    ctx.fillStyle = '#000';
    ctx.font = '11px sans-serif';
    ctx.fillText('Cross terms mix semantic content with position', centerX, height - 35);
    ctx.fillStyle = '#6b7280';
    ctx.fillText('RoPE solves this via rotation instead of addition', centerX, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Closing animation for RoPE section showing why rotation wins
 */
export function RoPEClosingAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Why Rotation Wins', centerX, 30);

    // Show advantages
    const advantages = [
      { label: 'Clean separation', desc: 'Position and content stay separate' },
      { label: 'Relative by design', desc: 'Dot product depends on distance only' },
      { label: 'No parameters', desc: 'Computed deterministically' },
      { label: 'Better extrapolation', desc: 'Works on longer sequences' },
    ];

    ctx.font = '11px sans-serif';
    advantages.forEach((item, i) => {
      const y = 65 + i * 40;

      // Checkmark
      ctx.fillStyle = '#10b981';
      ctx.font = '14px sans-serif';
      ctx.fillText('✓', centerX - 100, y);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, centerX - 80, y);

      // Description
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.fillText(item.desc, centerX - 80, y + 15);

      ctx.textAlign = 'center';
    });

    // Bottom note
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.fillText('Used by LLaMA, Mistral, Qwen, and most modern LLMs', centerX, height - 20);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Placeholder animation (blank) for sections with interactive content
 * Shows just a white background with no distracting content
 */
export function BlankAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Just white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing RoPE dimension pairs rotating at different frequencies
 */
export function RoPEDimensionPairsAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const numPairs = 4;
    const pairWidth = width / numPairs;
    const centerY = height / 2;
    const radius = Math.min(pairWidth * 0.35, height * 0.3);

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    const frequencies = [1, 0.5, 0.25, 0.125];

    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < numPairs; i++) {
      const centerX = pairWidth * (i + 0.5);
      const freq = frequencies[i];
      const color = colors[i];

      // Draw circle
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Animated point
      const angle = progress * Math.PI * 4 * freq;
      const px = centerX + Math.cos(angle) * radius;
      const py = centerY - Math.sin(angle) * radius;

      // Trail
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let t = 0; t <= 50; t++) {
        const trailAngle = (t / 50) * angle;
        const tx = centerX + Math.cos(trailAngle) * radius;
        const ty = centerY - Math.sin(trailAngle) * radius;
        if (t === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      // Point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = color;
      ctx.fillText(`dim ${i * 2}/${i * 2 + 1}`, centerX, height - 25);
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px sans-serif';
      ctx.fillText(`ω=${freq}`, centerX, height - 10);
      ctx.font = '11px sans-serif';
    }

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('RoPE: Different Frequencies per Dimension Pair', width / 2, 25);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

// Helper function for drawing arrows
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headLength = 8;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

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
