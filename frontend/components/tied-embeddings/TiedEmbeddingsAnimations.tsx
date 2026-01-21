'use client';

import { AnimationCanvas } from '@/components/animation/AnimationCanvas';

/**
 * Intro Animation - simple orbiting dots that respond to scroll
 * Shows this is a scroll-synced animation from the start
 */
export function IntroAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Central dot
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting dots - positions based on scroll progress
    const numDots = 8;
    const baseRadius = 60 + progress * 40;

    for (let i = 0; i < numDots; i++) {
      const angle = (i / numDots) * Math.PI * 2 + progress * Math.PI * 2;
      const x = cx + Math.cos(angle) * baseRadius;
      const y = cy + Math.sin(angle) * baseRadius;
      const dotSize = 3 + (i % 3);

      ctx.globalAlpha = 0.3 + (i / numDots) * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
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
 * Two Matrices Animation - sequential walkthrough of embedding/unembedding
 * Matches article values: 3 tokens × 2 embedding dimensions
 * 1. Empty W_E and W_U matrices with arrow
 * 2. Token labels fade in (New, York, City)
 * 3. W_E fills in with numbers
 * 4. York row gets outlined
 * 5. W_U fills in
 * 6. City column in W_U gets outlined with percentages
 */
export function TwoMatricesAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const fadeIn = (start: number, end: number) => {
      if (progress < start) return 0;
      if (progress > end) return 1;
      return ease((progress - start) / (end - start));
    };

    const tokens = ['New', 'York', 'City'];
    const cellW = 44;
    const cellH = 36;

    // W_E: 3 rows × 2 cols (left side) - matches article
    const gap = 50; // gap between matrices
    const weWidth = cellW * 2;
    const wuWidth = cellW * 3;
    const totalWidth = weWidth + gap + wuWidth;

    const weX = cx - totalWidth / 2;
    const weY = cy - (cellH * 3) / 2 + 10;

    // W_U: 2 rows × 3 cols (right side) - W_E transposed
    const wuX = weX + weWidth + gap;
    const wuY = cy - (cellH * 2) / 2 + 10;

    // Embedding values from the article
    const W_E = [
      [1.0, 0.5],  // "New"
      [0.8, 0.9],  // "York"
      [0.3, 1.2],  // "City"
    ];

    // ========================================
    // STEP 1: Empty matrices + arrow (0 - 0.15)
    // ========================================
    const boxAlpha = fadeIn(0, 0.08);
    ctx.globalAlpha = boxAlpha;

    // W_E outline
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(weX, weY, cellW * 2, cellH * 3);

    // W_U outline
    ctx.strokeRect(wuX, wuY, cellW * 3, cellH * 2);

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('W_E', weX + cellW, weY - 14);
    ctx.fillText('W_U', wuX + (cellW * 3) / 2, wuY - 14);

    // Arrow between matrices
    const arrowY = cy + 10;
    const arrowStartX = weX + cellW * 2 + 10;
    const arrowEndX = wuX - 10;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowY);
    ctx.lineTo(arrowEndX - 8, arrowY);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowY);
    ctx.lineTo(arrowEndX - 8, arrowY - 5);
    ctx.lineTo(arrowEndX - 8, arrowY + 5);
    ctx.closePath();
    ctx.fill();

    // ========================================
    // STEP 2: Token labels fade in (0.12 - 0.28)
    // ========================================
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    tokens.forEach((token, i) => {
      const alpha = fadeIn(0.12 + i * 0.04, 0.2 + i * 0.04);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#000';
      ctx.fillText(token, weX - 10, weY + i * cellH + cellH / 2 + 4);
    });

    // Column labels for W_U (same tokens)
    ctx.textAlign = 'center';
    tokens.forEach((token, i) => {
      const alpha = fadeIn(0.12 + i * 0.04, 0.2 + i * 0.04);
      ctx.globalAlpha = alpha;
      ctx.fillText(token, wuX + i * cellW + cellW / 2, wuY + cellH * 2 + 16);
    });

    // ========================================
    // STEP 3: W_E fills in (0.25 - 0.45)
    // ========================================
    W_E.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const alpha = fadeIn(0.25 + ri * 0.05 + ci * 0.02, 0.35 + ri * 0.05 + ci * 0.02);
        if (alpha <= 0) return;

        ctx.globalAlpha = alpha;
        const x = weX + ci * cellW;
        const y = weY + ri * cellH;
        const norm = val / 1.2; // normalize to max value
        const gray = Math.round(220 - norm * 140);

        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

        ctx.fillStyle = norm > 0.5 ? '#fff' : '#000';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(1), x + cellW / 2, y + cellH / 2 + 4);
      });
    });

    // ========================================
    // STEP 4: York row outlined (0.45 - 0.55)
    // ========================================
    const yorkAlpha = fadeIn(0.45, 0.52);
    if (yorkAlpha > 0) {
      ctx.globalAlpha = yorkAlpha;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(weX - 1, weY + cellH - 1, cellW * 2 + 2, cellH + 2);
    }

    // ========================================
    // STEP 5: W_U fills in (0.52 - 0.72)
    // ========================================
    for (let ri = 0; ri < 2; ri++) {
      for (let ci = 0; ci < 3; ci++) {
        const val = W_E[ci][ri]; // transposed
        const alpha = fadeIn(0.52 + ri * 0.05 + ci * 0.02, 0.62 + ri * 0.05 + ci * 0.02);
        if (alpha <= 0) continue;

        ctx.globalAlpha = alpha;
        const x = wuX + ci * cellW;
        const y = wuY + ri * cellH;
        const norm = val / 1.2;
        const gray = Math.round(220 - norm * 140);

        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

        ctx.fillStyle = norm > 0.5 ? '#fff' : '#000';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(1), x + cellW / 2, y + cellH / 2 + 4);
      }
    }

    // ========================================
    // STEP 6: City column outlined + percentages (0.75 - 1.0)
    // ========================================
    const cityAlpha = fadeIn(0.75, 0.82);
    if (cityAlpha > 0) {
      ctx.globalAlpha = cityAlpha;

      // Outline City column (column 2)
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(wuX + cellW * 2 - 1, wuY - 1, cellW + 2, cellH * 2 + 2);

      // Percentages below each column (from article: 13%, 32%, 55%)
      const percentages = ['13%', '32%', '55%'];
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666';

      percentages.forEach((pct, i) => {
        const pctAlpha = fadeIn(0.82 + i * 0.03, 0.9 + i * 0.03);
        ctx.globalAlpha = pctAlpha;
        ctx.fillText(pct, wuX + i * cellW + cellW / 2, wuY + cellH * 2 + 30);
      });
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
 * Direct path matrix animation - shows actual W_E @ W_E^T values
 * Matrix builds up as you scroll, highlighting rows progressively
 */
export function DirectPathMatrixAnimation({ progress }: { progress: number }) {
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
    const result = [
      [1.25, 1.25, 0.90],
      [1.25, 1.45, 1.32],
      [0.90, 1.32, 1.53],
    ];

    const cellSize = 55;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 50;

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('W_E @ W_E^T', width / 2, 30);

    // Draw cells - reveal based on progress
    const cellsToShow = Math.floor(progress * 12); // 9 cells + some buffer

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellIndex = i * 3 + j;
        const cellX = matrixX + j * cellSize;
        const cellY = matrixY + i * cellSize;

        if (cellIndex < cellsToShow) {
          const val = result[i][j];
          const normalized = val / 1.53;
          const grayVal = Math.round(255 - normalized * 180);

          // Cell background
          ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
          ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);

          // Value text
          ctx.fillStyle = normalized > 0.5 ? '#fff' : '#000';
          ctx.font = '13px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(val.toFixed(2), cellX + cellSize / 2, cellY + cellSize / 2 + 5);
        } else {
          // Empty cell placeholder
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Row labels (left)
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    tokens.forEach((label, i) => {
      ctx.fillText(label, matrixX - 8, matrixY + i * cellSize + cellSize / 2 + 4);
    });

    // Column labels (bottom)
    ctx.textAlign = 'center';
    tokens.forEach((label, j) => {
      ctx.fillText(label, matrixX + j * cellSize + cellSize / 2, matrixY + cellSize * 3 + 18);
    });

    // Highlight diagonal (symmetry indicator) at high progress
    if (progress > 0.8) {
      const highlightAlpha = (progress - 0.8) / 0.2;
      ctx.globalAlpha = highlightAlpha;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;

      // Highlight symmetric pairs [0,1] and [1,0]
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(matrixX + cellSize, matrixY, cellSize - 2, cellSize - 2);
      ctx.strokeRect(matrixX, matrixY + cellSize, cellSize - 2, cellSize - 2);
      ctx.setLineDash([]);
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
 * Bigram directionality - shows asymmetric flow between tokens
 * Arrow weights change with scroll to emphasize the asymmetry
 */
export function BigramDirectionalityAnimation({ progress }: { progress: number }) {
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

    // Two token circles
    const leftX = width * 0.28;
    const rightX = width * 0.72;
    const tokenRadius = 28;

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('New', leftX, centerY + tokenRadius + 22);
    ctx.fillText('York', rightX, centerY + tokenRadius + 22);

    // Draw tokens
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(leftX, centerY, tokenRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rightX, centerY, tokenRadius, 0, Math.PI * 2);
    ctx.fill();

    // White centers
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftX, centerY, tokenRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rightX, centerY, tokenRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    const arrowGap = 42;
    const arrowY1 = centerY - 16;
    const arrowY2 = centerY + 16;

    // Strong arrow: New → York (top) - grows with progress
    const strongWeight = 2 + progress * 5;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = strongWeight;
    ctx.beginPath();
    ctx.moveTo(leftX + arrowGap, arrowY1);
    ctx.lineTo(rightX - arrowGap - 14, arrowY1);
    ctx.stroke();

    // Strong arrowhead
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(rightX - arrowGap, arrowY1);
    ctx.lineTo(rightX - arrowGap - 14, arrowY1 - 8);
    ctx.lineTo(rightX - arrowGap - 14, arrowY1 + 8);
    ctx.closePath();
    ctx.fill();

    // Weak arrow: York → New (bottom) - appears after 30% progress
    if (progress > 0.3) {
      const weakAlpha = Math.min(1, (progress - 0.3) / 0.3);
      const weakWeight = 1.5;

      ctx.globalAlpha = weakAlpha * 0.4;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = weakWeight;
      ctx.beginPath();
      ctx.moveTo(rightX - arrowGap, arrowY2);
      ctx.lineTo(leftX + arrowGap + 10, arrowY2);
      ctx.stroke();

      // Weak arrowhead
      ctx.beginPath();
      ctx.moveTo(leftX + arrowGap, arrowY2);
      ctx.lineTo(leftX + arrowGap + 10, arrowY2 - 5);
      ctx.lineTo(leftX + arrowGap + 10, arrowY2 + 5);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
    }

    // Probability labels at high progress
    if (progress > 0.6) {
      const labelAlpha = (progress - 0.6) / 0.4;
      ctx.globalAlpha = labelAlpha;
      ctx.fillStyle = '#000';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('P = 0.85', width / 2, arrowY1 - 12);

      ctx.globalAlpha = labelAlpha * 0.5;
      ctx.fillText('P = 0.10', width / 2, arrowY2 + 20);
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
 * Symmetry constraint - side by side comparison
 * Target (asymmetric) vs Tied (symmetric) with actual values
 */
export function SymmetryConstraintAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const cellSize = 38;
    const tokens = ['N', 'Y', 'C'];

    // Target bigrams (asymmetric) - what we want
    const target = [
      [0.05, 0.85, 0.10],
      [0.10, 0.05, 0.85],
      [0.60, 0.30, 0.10],
    ];

    // Tied result (symmetric) - what we get
    const tied = [
      [1.25, 1.25, 0.90],
      [1.25, 1.45, 1.32],
      [0.90, 1.32, 1.53],
    ];

    const leftX = width * 0.22 - (cellSize * 3) / 2;
    const rightX = width * 0.78 - (cellSize * 3) / 2;
    const matrixY = 55;

    // Reveal based on progress
    const revealCells = Math.floor(progress * 12);

    // Helper to draw matrix
    const drawMatrix = (
      x: number,
      values: number[][],
      maxVal: number,
      title: string
    ) => {
      // Title
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, x + (cellSize * 3) / 2, matrixY - 12);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const cellIndex = i * 3 + j;
          const cellX = x + j * cellSize;
          const cellY = matrixY + i * cellSize;

          if (cellIndex < revealCells) {
            const val = values[i][j];
            const normalized = maxVal > 0 ? val / maxVal : 0;
            const grayVal = Math.round(255 - normalized * 180);

            ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
            ctx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);

            ctx.fillStyle = normalized > 0.5 ? '#fff' : '#000';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(val.toFixed(2), cellX + cellSize / 2, cellY + cellSize / 2 + 3);
          } else {
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);
          }
        }
      }

      // Labels
      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      tokens.forEach((label, i) => {
        ctx.fillText(label, x - 5, matrixY + i * cellSize + cellSize / 2 + 3);
      });
    };

    // Draw both matrices
    drawMatrix(leftX, target, 0.85, 'Target (bigrams)');
    drawMatrix(rightX, tied, 1.53, 'Tied result');

    // Highlight asymmetric vs symmetric pairs at high progress
    if (progress > 0.7) {
      const highlightAlpha = (progress - 0.7) / 0.3;
      ctx.globalAlpha = highlightAlpha;

      // Left matrix: highlight [0,1]=0.85 vs [1,0]=0.10 (different!)
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(leftX + cellSize, matrixY, cellSize - 1, cellSize - 1);
      ctx.strokeRect(leftX, matrixY + cellSize, cellSize - 1, cellSize - 1);

      // Right matrix: highlight [0,1]=1.25 vs [1,0]=1.25 (same!)
      ctx.strokeRect(rightX + cellSize, matrixY, cellSize - 1, cellSize - 1);
      ctx.strokeRect(rightX, matrixY + cellSize, cellSize - 1, cellSize - 1);
      ctx.setLineDash([]);

      // Labels
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText('≠', leftX + (cellSize * 3) / 2, matrixY + cellSize * 3 + 22);
      ctx.fillText('=', rightX + (cellSize * 3) / 2, matrixY + cellSize * 3 + 22);

      ctx.globalAlpha = 1;
    }

    // Center divider
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 30);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * SGD can't fix - shows multiple random W_E all producing symmetric results
 * Cycles through configurations as you scroll, all symmetric
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

    // Progress determines which random seed we show
    const trial = Math.floor(progress * 6);

    // Seeded random
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + trial * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    // Generate W_E (3x2)
    const W_E: number[][] = [];
    for (let i = 0; i < 3; i++) {
      W_E[i] = [];
      for (let j = 0; j < 2; j++) {
        W_E[i][j] = Math.round((seededRandom(i * 10 + j) - 0.5) * 20) / 10;
      }
    }

    // Compute W_E @ W_E^T (always symmetric!)
    const result: number[][] = [];
    for (let i = 0; i < 3; i++) {
      result[i] = [];
      for (let j = 0; j < 3; j++) {
        result[i][j] = Math.round((W_E[i][0] * W_E[j][0] + W_E[i][1] * W_E[j][1]) * 100) / 100;
      }
    }

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Random W_E #${trial + 1}`, width / 2, 25);

    // Draw result matrix
    const cellSize = 50;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 45;
    const maxVal = Math.max(...result.flat().map(Math.abs)) || 1;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const val = result[i][j];
        const normalized = Math.abs(val) / maxVal;
        const grayVal = Math.round(255 - normalized * 180);
        const cellX = matrixX + j * cellSize;
        const cellY = matrixY + i * cellSize;

        ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
        ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);

        ctx.fillStyle = normalized > 0.5 ? '#fff' : '#000';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(2), cellX + cellSize / 2, cellY + cellSize / 2 + 4);
      }
    }

    // Highlight symmetric pair
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(matrixX + cellSize, matrixY, cellSize - 2, cellSize - 2);
    ctx.strokeRect(matrixX, matrixY + cellSize, cellSize - 2, cellSize - 2);
    ctx.setLineDash([]);

    // Symmetry check
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `[0,1] = ${result[0][1].toFixed(2)}  =  [1,0] = ${result[1][0].toFixed(2)}`,
      width / 2,
      matrixY + cellSize * 3 + 25
    );

    ctx.font = '13px sans-serif';
    ctx.fillText('Always symmetric', width / 2, height - 15);
  };

  return (
    <AnimationCanvas progress={progress} className="w-full h-full bg-white rounded-lg">
      {renderAnimation}
    </AnimationCanvas>
  );
}

/**
 * Untied solution - shows W_E @ W_U can be asymmetric
 * Matrix appears and highlights the asymmetric values
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
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('W_E @ W_U (untied)', width / 2, 28);

    const tokens = ['New', 'York', 'City'];

    // Untied can match the target bigrams!
    const untied = [
      [0.04, 0.82, 0.14],
      [0.12, 0.08, 0.80],
      [0.55, 0.28, 0.17],
    ];

    const cellSize = 52;
    const matrixX = width / 2 - (cellSize * 3) / 2;
    const matrixY = 50;

    // Reveal based on progress
    const revealCells = Math.floor(progress * 12);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellIndex = i * 3 + j;
        const cellX = matrixX + j * cellSize;
        const cellY = matrixY + i * cellSize;

        if (cellIndex < revealCells) {
          const val = untied[i][j];
          const normalized = val / 0.82;
          const grayVal = Math.round(255 - normalized * 180);

          ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
          ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);

          ctx.fillStyle = normalized > 0.5 ? '#fff' : '#000';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(val.toFixed(2), cellX + cellSize / 2, cellY + cellSize / 2 + 4);
        } else {
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Row labels
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    tokens.forEach((label, i) => {
      ctx.fillText(label, matrixX - 8, matrixY + i * cellSize + cellSize / 2 + 4);
    });

    // Column labels
    ctx.textAlign = 'center';
    tokens.forEach((label, j) => {
      ctx.fillText(label, matrixX + j * cellSize + cellSize / 2, matrixY + cellSize * 3 + 16);
    });

    // Highlight asymmetric pair at high progress
    if (progress > 0.6) {
      const highlightAlpha = (progress - 0.6) / 0.4;
      ctx.globalAlpha = highlightAlpha;

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(matrixX + cellSize, matrixY, cellSize - 2, cellSize - 2);
      ctx.strokeRect(matrixX, matrixY + cellSize, cellSize - 2, cellSize - 2);
      ctx.setLineDash([]);

      // Show they're different
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `[New,York] = 0.82  ≠  [York,New] = 0.12`,
        width / 2,
        matrixY + cellSize * 3 + 38
      );

      ctx.font = '13px sans-serif';
      ctx.fillText('Can represent asymmetry', width / 2, height - 12);

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
 * MLP workaround - shows how MLP₀ breaks symmetry
 * Flow diagram with progress-based reveal
 */
export function MLPWorkaroundAnimation({ progress }: { progress: number }) {
  const renderAnimation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerY = height / 2 - 10;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MLP Breaks Symmetry', width / 2, 25);

    const boxW = 55;
    const boxH = 45;

    // Three stages
    const stages = [
      { x: width * 0.18, label: 'W_E' },
      { x: width * 0.5, label: 'MLP₀' },
      { x: width * 0.82, label: 'W_E^T' },
    ];

    // Reveal stages based on progress
    const stagesRevealed = Math.floor(progress * 4) + 1;

    stages.forEach((stage, i) => {
      if (i >= stagesRevealed) return;

      const isMLP = i === 1;
      const revealProgress = Math.min(1, (progress * 4 - i));

      ctx.globalAlpha = revealProgress;

      // Box
      ctx.fillStyle = '#fff';
      ctx.fillRect(stage.x - boxW / 2, centerY - boxH / 2, boxW, boxH);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = isMLP ? 2.5 : 1.5;
      ctx.strokeRect(stage.x - boxW / 2, centerY - boxH / 2, boxW, boxH);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = isMLP ? 'bold 13px sans-serif' : '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(stage.label, stage.x, centerY + 5);

      // Arrow to next
      if (i < stages.length - 1 && i + 1 < stagesRevealed) {
        const nextStage = stages[i + 1];
        const arrowStart = stage.x + boxW / 2 + 8;
        const arrowEnd = nextStage.x - boxW / 2 - 8;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(arrowStart, centerY);
        ctx.lineTo(arrowEnd - 8, centerY);
        ctx.stroke();

        // Arrowhead
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(arrowEnd, centerY);
        ctx.lineTo(arrowEnd - 10, centerY - 6);
        ctx.lineTo(arrowEnd - 10, centerY + 6);
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });

    // Formula and explanation at high progress
    if (progress > 0.5) {
      const textAlpha = (progress - 0.5) / 0.5;
      ctx.globalAlpha = textAlpha;

      ctx.fillStyle = '#000';
      ctx.font = '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('W_E @ M @ W_E^T', width / 2, centerY + boxH / 2 + 30);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('M is learnable → can be asymmetric', width / 2, centerY + boxH / 2 + 50);

      ctx.fillStyle = '#000';
      ctx.fillText('Trade-off: uses MLP capacity', width / 2, height - 15);

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
 * Blank animation placeholder
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
