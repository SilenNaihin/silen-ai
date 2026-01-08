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
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Same attention scores!', centerX, height - 38);
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('Model cannot distinguish token order.', centerX, height - 18);
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
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Repeats every 2π positions!', width / 2, height - 18);
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
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fixed size! Cannot exceed max_position.', width / 2, height - 35);

    // Title annotation
    ctx.fillStyle = '#374151';
    ctx.font = '13px monospace';
    ctx.fillText('nn.Embedding(max_pos, d_model)', width / 2, height - 15);
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
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('|R(θ)v| = |v|  (magnitude preserved)', centerX, height - 15);

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
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#374151';
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
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Cross terms mix semantic content with position', centerX, height - 38);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.fillText('RoPE solves this via rotation instead of addition', centerX, height - 18);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing RoPE magnitude preservation property
 */
export function MagnitudePreservationAnimation({ progress }: { progress: number }) {
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

    // Title
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('RoPE Preserves Information', centerX, 25);

    const radius = Math.min(width, height) * 0.22;

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
    ctx.strokeStyle = '#d4d4d4';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Original vector (fixed)
    const originalAngle = Math.PI / 5;
    const vectorLength = radius * 0.8;
    const originalEndX = centerX + Math.cos(originalAngle) * vectorLength;
    const originalEndY = centerY - Math.sin(originalAngle) * vectorLength;

    // Draw original vector faded
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 2;
    drawArrow(ctx, centerX, centerY, originalEndX, originalEndY);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px sans-serif';
    ctx.fillText('original', originalEndX + 15, originalEndY - 5);

    // Animated rotation
    const rotationAngle = progress * Math.PI * 2;
    const rotatedAngle = originalAngle + rotationAngle;
    const rotatedEndX = centerX + Math.cos(rotatedAngle) * vectorLength;
    const rotatedEndY = centerY - Math.sin(rotatedAngle) * vectorLength;

    // Draw rotated vector
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    drawArrow(ctx, centerX, centerY, rotatedEndX, rotatedEndY);

    // Draw magnitude indicator
    const magX = width - 80;
    const barHeight = 100;
    const barY = centerY - barHeight / 2;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(magX, barY, 30, barHeight);

    // Magnitude bar (constant)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(magX, barY + 20, 30, barHeight - 40);

    ctx.fillStyle = '#374151';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|v|', magX + 15, barY - 5);
    ctx.fillText('const', magX + 15, barY + barHeight + 15);

    // Bottom text
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('Rotation changes direction, not magnitude', centerX, height - 32);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Semantic information is preserved!', centerX, height - 12);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing clean q·k computation with RoPE
 */
export function CleanAttentionAnimation({ progress }: { progress: number }) {
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

    // Title
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Clean Attention Computation', centerX, 25);

    // Phase 1: Show additive PE problem (0-0.4)
    if (progress < 0.4) {
      const phase = progress / 0.4;
      ctx.globalAlpha = phase;

      ctx.fillStyle = '#ef4444';
      ctx.font = '12px monospace';
      ctx.fillText('Additive: (q + pe) · (k + pe)', centerX, 60);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('= q·k + q·pe + pe·k + pe·pe', centerX, 85);

      ctx.fillStyle = '#ef4444';
      ctx.font = '11px sans-serif';
      ctx.fillText('4 terms! Content and position mixed', centerX, 110);

      ctx.globalAlpha = 1;
    }

    // Phase 2: Show RoPE solution (0.4-1.0)
    if (progress >= 0.4) {
      const phase = (progress - 0.4) / 0.6;

      // Fade out additive
      ctx.globalAlpha = 1 - phase * 0.7;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px monospace';
      ctx.fillText('Additive: 4 terms mixed', centerX, 60);
      ctx.globalAlpha = 1;

      // Show RoPE
      ctx.globalAlpha = Math.min(1, phase * 2);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('RoPE: R(θ_m)q · R(θ_n)k', centerX, 100);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('↓', centerX, 125);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('= q · R(θ_n - θ_m)k', centerX, 150);

      // Highlight the key insight
      if (phase > 0.5) {
        const highlightPhase = (phase - 0.5) / 0.5;
        ctx.globalAlpha = highlightPhase;

        // Draw highlight box
        ctx.fillStyle = '#dcfce7';
        ctx.fillRect(centerX - 120, 165, 240, 40);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 120, 165, 240, 40);

        ctx.fillStyle = '#166534';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Only 2 terms!', centerX, 182);
        ctx.font = '11px sans-serif';
        ctx.fillText('Depends only on (n - m) = relative position', centerX, 198);
      }

      ctx.globalAlpha = 1;
    }

    // Bottom comparison
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.fillText('No cross terms = cleaner gradients', centerX, height - 12);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Closing animation for RoPE section showing why rotation wins - improved version
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

    // Title with gradient effect
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#10b981';
    ctx.fillText('🏆 Why RoPE Wins', centerX, 28);

    // Animated advantages appearing one by one
    const advantages = [
      { icon: '🔄', label: 'Clean Separation', desc: 'q·k stays pure', color: '#8b5cf6' },
      { icon: '📏', label: 'Relative Position', desc: 'Built-in, not learned', color: '#3b82f6' },
      { icon: '📈', label: 'Extrapolation', desc: 'Works beyond training length', color: '#10b981' },
      { icon: '⚡', label: 'Zero Parameters', desc: 'Computed on the fly', color: '#f59e0b' },
    ];

    const startY = 55;
    const itemHeight = 42;

    advantages.forEach((item, i) => {
      const itemProgress = Math.max(0, Math.min(1, progress * 5 - i));
      if (itemProgress <= 0) return;

      const y = startY + i * itemHeight;

      // Slide in from left with fade
      const slideOffset = (1 - itemProgress) * 30;
      ctx.globalAlpha = itemProgress;

      // Background highlight
      ctx.fillStyle = item.color + '15';
      ctx.fillRect(centerX - 130 + slideOffset, y - 8, 260, 38);

      // Left border accent
      ctx.fillStyle = item.color;
      ctx.fillRect(centerX - 130 + slideOffset, y - 8, 4, 38);

      // Icon
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.icon, centerX - 115 + slideOffset, y + 12);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(item.label, centerX - 85 + slideOffset, y + 8);

      // Description
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(item.desc, centerX - 85 + slideOffset, y + 24);

      ctx.globalAlpha = 1;
    });

    // Final reveal: Model names
    if (progress > 0.8) {
      const finalPhase = (progress - 0.8) / 0.2;
      ctx.globalAlpha = finalPhase;

      // Models badge
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(centerX - 150, height - 48, 300, 38);
      ctx.strokeStyle = '#d4d4d4';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 150, height - 48, 300, 38);

      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Used by', centerX, height - 32);

      // Model logos/names
      const models = ['LLaMA', 'Mistral', 'Qwen', 'Gemma'];
      ctx.font = 'bold 12px monospace';
      models.forEach((model, i) => {
        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
        ctx.fillStyle = colors[i];
        ctx.fillText(model, centerX - 90 + i * 60, height - 17);
      });

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

/**
 * Animation showing uniqueness of PE - each position has a unique fingerprint
 */
export function UniquenessAnimation({ progress }: { progress: number }) {
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
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Unique Position Fingerprints', width / 2, 25);

    const numPositions = 8;
    const barHeight = 18;
    const barSpacing = 28;
    const startY = 55;
    const barMaxWidth = width * 0.6;
    const startX = width * 0.2;
    const dModel = 16;

    // Animate which positions are shown
    const visiblePositions = Math.min(numPositions, Math.ceil(progress * numPositions * 1.5));

    for (let pos = 0; pos < visiblePositions; pos++) {
      const y = startY + pos * barSpacing;

      // Position label
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`pos ${pos}`, startX - 10, y + barHeight / 2 + 4);

      // Draw PE fingerprint as colored bars
      for (let dim = 0; dim < dModel; dim++) {
        const dimIndex = Math.floor(dim / 2);
        const freq = 1 / Math.pow(10000, (2 * dimIndex) / dModel);
        const angle = pos * freq;
        const value = dim % 2 === 0 ? Math.sin(angle) : Math.cos(angle);

        const cellWidth = barMaxWidth / dModel;
        const x = startX + dim * cellWidth;

        // Color based on value
        const normalized = (value + 1) / 2;
        const hue = 240 - normalized * 240; // Blue to red
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(x, y, cellWidth - 1, barHeight);
      }
    }

    // Legend
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText('Each row is unique — no two positions have the same pattern', width / 2, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing smoothness - nearby positions have similar encodings
 */
export function SmoothnessAnimation({ progress }: { progress: number }) {
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
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Smoothness: Similar Positions → Similar Encodings', width / 2, 25);

    const dModel = 32;
    const centerY = height / 2;
    const graphWidth = width * 0.8;
    const startX = width * 0.1;

    // Compute PE for a reference position
    const refPos = 10;
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

    const cosineSimilarity = (a: number[], b: number[]) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (magA * magB);
    };

    const refPE = computePE(refPos);
    const numPoints = Math.floor(progress * 40);

    // Draw similarity curve
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const amplitude = height * 0.25;
    for (let i = 0; i <= numPoints; i++) {
      const pos = i;
      const similarity = cosineSimilarity(refPE, computePE(pos));
      const x = startX + (i / 40) * graphWidth;
      const y = centerY - similarity * amplitude;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Reference position marker
    if (progress > 0.25) {
      const refX = startX + (refPos / 40) * graphWidth;
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(refX, centerY - amplitude);
      ctx.lineTo(refX, centerY + amplitude * 0.3);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`ref=${refPos}`, refX, centerY + amplitude * 0.5);
    }

    // Axis
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    ctx.lineTo(startX + graphWidth, centerY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Position', startX, height - 15);
    ctx.save();
    ctx.translate(15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Similarity', 0, 0);
    ctx.restore();

    // Insight
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    ctx.fillText('Peak at reference, gradual decay with distance', width / 2, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing the geometric progression of wavelengths
 */
export function GeometricProgressionAnimation({ progress }: { progress: number }) {
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
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Geometric Progression of Wavelengths', width / 2, 25);

    const numDims = 6;
    const rowHeight = (height - 80) / numDims;
    const marginX = 60;
    const graphWidth = width - marginX * 2;

    // Each dimension pair has exponentially increasing wavelength
    for (let d = 0; d < numDims; d++) {
      const dimProgress = Math.max(0, Math.min(1, progress * (numDims + 1) - d));
      if (dimProgress <= 0) continue;

      const y = 50 + d * rowHeight + rowHeight / 2;
      const wavelength = Math.pow(2, d) * 6; // 6, 12, 24, 48, 96, 192
      const freq = 1 / wavelength;

      // Label
      ctx.globalAlpha = dimProgress;
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`dim ${d * 2}`, marginX - 8, y + 4);

      // Draw wave
      const amplitude = rowHeight * 0.35;
      const color = `hsl(${260 - d * 30}, 70%, 50%)`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x <= graphWidth; x++) {
        const t = (x / graphWidth) * 100;
        const val = Math.sin(t * freq * Math.PI * 2);
        const px = marginX + x;
        const py = y - val * amplitude;

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Wavelength label
      ctx.fillStyle = color;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`λ=${wavelength}`, width - marginX + 5, y + 4);

      ctx.globalAlpha = 1;
    }

    // Bottom text
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Low dimensions: fine detail | High dimensions: global structure', width / 2, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Animation showing the 4-term expansion problem visually
 */
export function FourTermsAnimation({ progress }: { progress: number }) {
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

    // Phase 1: Show original formula (0-0.2)
    const phase1 = Math.min(1, progress / 0.2);

    // Title
    ctx.globalAlpha = phase1;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('The Attention Score Expansion', centerX, 28);

    // Original formula with background
    const formulaY = 58;
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(centerX - 110, formulaY - 18, 220, 30);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('(q + pe) · (k + pe)', centerX, formulaY);
    ctx.globalAlpha = 1;

    // Phase 2: Arrow appears with "expands to" text (0.2-0.3)
    if (progress > 0.2) {
      const phase2 = Math.min(1, (progress - 0.2) / 0.1);
      ctx.globalAlpha = phase2;
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('↓', centerX, 95);
      ctx.globalAlpha = 1;
    }

    // Phase 3-6: Terms appear one by one (0.3-0.75)
    const terms = [
      { label: 'q · k', color: '#10b981', desc: 'semantic', startPhase: 0.3 },
      { label: 'q · pe', color: '#f59e0b', desc: 'mixed', startPhase: 0.4 },
      { label: 'pe · k', color: '#f59e0b', desc: 'mixed', startPhase: 0.5 },
      { label: 'pe · pe', color: '#3b82f6', desc: 'position', startPhase: 0.6 },
    ];

    const boxWidth = 72;
    const boxHeight = 52;
    const boxY = 115;
    const gap = 14;
    const totalWidth = boxWidth * 4 + gap * 3;
    const startX = centerX - totalWidth / 2;

    terms.forEach((term, i) => {
      if (progress < term.startPhase) return;

      const termProgress = Math.min(1, (progress - term.startPhase) / 0.1);
      const x = startX + i * (boxWidth + gap);

      // Animate box appearing with scale and slight bounce
      const scale = termProgress < 0.5
        ? 0.5 + termProgress * 1.1  // Overshoot
        : 1.05 - (termProgress - 0.5) * 0.1;  // Settle back
      const boxCenterX = x + boxWidth / 2;
      const boxCenterY = boxY + boxHeight / 2;

      ctx.save();
      ctx.translate(boxCenterX, boxCenterY);
      ctx.scale(scale, scale);
      ctx.translate(-boxCenterX, -boxCenterY);
      ctx.globalAlpha = Math.min(1, termProgress * 1.5);

      // Box shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(x + 3, boxY + 3, boxWidth, boxHeight);

      // Box background
      ctx.fillStyle = term.color + '25';
      ctx.fillRect(x, boxY, boxWidth, boxHeight);

      // Box border
      ctx.strokeStyle = term.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, boxY, boxWidth, boxHeight);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(term.label, boxCenterX, boxCenterY + 5);

      // Description badge
      ctx.fillStyle = term.color;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(term.desc, boxCenterX, boxY + boxHeight + 16);

      // Plus signs between boxes
      if (i < 3 && termProgress > 0.5) {
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('+', x + boxWidth + gap / 2, boxCenterY + 6);
      }

      ctx.restore();
    });

    // Phase 7: Highlight cross terms with animated glow (0.75-0.88)
    if (progress > 0.75) {
      const highlightProgress = Math.min(1, (progress - 0.75) / 0.13);
      const pulseIntensity = 0.5 + 0.5 * Math.sin(highlightProgress * Math.PI * 2);

      // Draw glowing brackets around cross terms
      ctx.globalAlpha = highlightProgress;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;

      const bracketX1 = startX + boxWidth + gap - 8;
      const bracketX2 = startX + boxWidth * 3 + gap * 2 + 8;
      const bracketY1 = boxY - 12;
      const bracketY2 = boxY + boxHeight + 12;

      // Glow effect
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8 * pulseIntensity;

      // Left bracket
      ctx.beginPath();
      ctx.moveTo(bracketX1 + 12, bracketY1);
      ctx.lineTo(bracketX1, bracketY1);
      ctx.lineTo(bracketX1, bracketY2);
      ctx.lineTo(bracketX1 + 12, bracketY2);
      ctx.stroke();

      // Right bracket
      ctx.beginPath();
      ctx.moveTo(bracketX2 - 12, bracketY1);
      ctx.lineTo(bracketX2, bracketY1);
      ctx.lineTo(bracketX2, bracketY2);
      ctx.lineTo(bracketX2 - 12, bracketY2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Phase 8: Problem text (0.88-1.0)
    if (progress > 0.88) {
      const textProgress = Math.min(1, (progress - 0.88) / 0.12);
      ctx.globalAlpha = textProgress;

      // Warning background
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(centerX - 160, height - 55, 320, 45);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 160, height - 55, 320, 45);

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ Cross terms mix content with position!', centerX, height - 35);

      ctx.fillStyle = '#78350f';
      ctx.font = '13px sans-serif';
      ctx.fillText('The model must learn to disentangle them', centerX, height - 17);

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
 * Animation comparing additive PE vs RoPE attention computation
 */
export function AdditivVsRoPEAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const leftX = width * 0.25;
    const rightX = width * 0.75;
    const startY = 60;

    // Title
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Additive PE', leftX, 30);
    ctx.fillText('RoPE', rightX, 30);

    // Left side: Additive PE formula
    ctx.font = '11px monospace';
    ctx.fillStyle = '#374151';
    ctx.fillText('(q + pe_i) · (k + pe_j)', leftX, startY);

    // Expansion arrow
    ctx.fillText('↓', leftX, startY + 20);

    // Four terms
    ctx.font = '10px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('q·k', leftX - 50, startY + 45);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('q·pe', leftX - 15, startY + 45);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('pe·k', leftX + 20, startY + 45);
    ctx.fillStyle = '#000';
    ctx.fillText('pe·pe', leftX + 55, startY + 45);

    // Labels
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('4 terms (mixed)', leftX, startY + 65);

    // Right side: RoPE formula
    ctx.font = '11px monospace';
    ctx.fillStyle = '#374151';
    ctx.fillText('R(θ_i)q · R(θ_j)k', rightX, startY);

    // Equals
    ctx.fillText('=', rightX, startY + 20);

    // Two terms
    ctx.font = '10px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('q · R(θ_j - θ_i)k', rightX, startY + 45);

    // Labels
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('2 terms (clean)', rightX, startY + 65);

    // Visual: show attention score pattern
    const matrixY = startY + 100;
    const gridSize = 20;
    const numCells = 5;

    // Draw simplified attention matrix for both
    for (let side = 0; side < 2; side++) {
      const centerX = side === 0 ? leftX : rightX;
      const startGridX = centerX - (numCells * gridSize) / 2;

      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Attention', centerX, matrixY - 10);

      for (let i = 0; i < numCells; i++) {
        for (let j = 0; j < numCells; j++) {
          const x = startGridX + j * gridSize;
          const y = matrixY + i * gridSize;

          // Generate attention pattern
          let intensity;
          if (side === 0) {
            // Additive: more diffuse pattern
            intensity = 0.3 + 0.4 * Math.exp(-Math.abs(i - j) * 0.5);
          } else {
            // RoPE: cleaner diagonal pattern
            intensity = 0.8 * Math.exp(-Math.abs(i - j) * 0.8);
          }

          ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
          ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        }
      }
    }

    // Bottom comparison
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Content/position mixed', leftX, height - 15);
    ctx.fillStyle = '#10b981';
    ctx.fillText('Pure relative distance', rightX, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Clock analogy animation for multi-frequency encoding
 */
export function ClockAnalogyAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const clockRadius = Math.min(width, height) * 0.18;
    const clocks = [
      { label: 'Hour', freq: 1 / 12, color: '#8b5cf6', x: width * 0.2 },
      { label: 'Minute', freq: 1, color: '#3b82f6', x: width * 0.5 },
      { label: 'Second', freq: 60, color: '#10b981', x: width * 0.8 },
    ];

    const centerY = height / 2;

    // Title
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#374151';
    ctx.fillText('Clock Analogy: Multiple Frequencies', width / 2, 25);

    // Draw each clock
    clocks.forEach(({ label, freq, color, x }) => {
      // Clock face
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, centerY, clockRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Hour marks
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const innerR = clockRadius * 0.85;
        const outerR = clockRadius * 0.95;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * innerR, centerY + Math.sin(angle) * innerR);
        ctx.lineTo(x + Math.cos(angle) * outerR, centerY + Math.sin(angle) * outerR);
        ctx.stroke();
      }

      // Hand - slower rotation
      const handAngle = progress * Math.PI * 0.8 * freq - Math.PI / 2;
      const handLength = clockRadius * 0.7;

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(
        x + Math.cos(handAngle) * handLength,
        centerY + Math.sin(handAngle) * handLength
      );
      ctx.stroke();

      // Center dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.font = '12px sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(label, x, centerY + clockRadius + 25);
    });

    // Explanation
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('Each "hand" (dimension) moves at different speed', width / 2, height - 32);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.fillText('Together they uniquely identify any position', width / 2, height - 14);
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
