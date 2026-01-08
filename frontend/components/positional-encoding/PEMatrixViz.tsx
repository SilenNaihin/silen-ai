'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface PEMatrixVizProps {
  className?: string;
  defaultMaxLen?: number;
  defaultDModel?: number;
}

/**
 * Interactive visualization of the positional encoding matrix.
 * Shows the full PE(pos, dim) heatmap with adjustable parameters.
 */
export function PEMatrixViz({
  className = '',
  defaultMaxLen = 100,
  defaultDModel = 64,
}: PEMatrixVizProps) {
  const [maxLen, setMaxLen] = useState(defaultMaxLen);
  const [dModel, setDModel] = useState(defaultDModel);
  const [hoveredCell, setHoveredCell] = useState<{ pos: number; dim: number } | null>(null);

  // Compute positional encoding matrix
  const peMatrix = useMemo(() => {
    const matrix: number[][] = [];

    for (let pos = 0; pos < maxLen; pos++) {
      const row: number[] = [];
      for (let i = 0; i < dModel; i++) {
        const dimIndex = Math.floor(i / 2);
        const freq = 1 / Math.pow(10000, (2 * dimIndex) / dModel);
        const angle = pos * freq;

        // Even indices get sin, odd indices get cos
        const value = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
        row.push(value);
      }
      matrix.push(row);
    }

    return matrix;
  }, [maxLen, dModel]);

  // Color scale: blue-white-red diverging
  const getColor = (value: number) => {
    const normalized = (value + 1) / 2;
    if (normalized < 0.5) {
      const intensity = Math.floor((0.5 - normalized) * 2 * 255);
      return `rgb(${255 - intensity * 0.3}, ${255 - intensity * 0.3}, 255)`;
    } else {
      const intensity = Math.floor((normalized - 0.5) * 2 * 255);
      return `rgb(255, ${255 - intensity * 0.3}, ${255 - intensity * 0.3})`;
    }
  };

  const hoveredValue = hoveredCell
    ? peMatrix[hoveredCell.pos]?.[hoveredCell.dim]
    : null;

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Controls */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Sequence Length: {maxLen}
            </label>
            <input
              type="range"
              min="20"
              max="200"
              value={maxLen}
              onChange={(e) => setMaxLen(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Model Dimension: {dModel}
            </label>
            <input
              type="range"
              min="16"
              max="128"
              step="8"
              value={dModel}
              onChange={(e) => setDModel(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Matrix visualization */}
      <div className="p-4 overflow-x-auto">
        <div className="inline-block">
          {/* Axis labels */}
          <div className="flex items-end mb-2">
            <div className="w-12" />
            <div className="text-xs text-neutral-500">
              Dimension (i) → [sin/cos pairs at different frequencies]
            </div>
          </div>

          <div className="flex">
            {/* Y-axis label */}
            <div className="w-12 flex flex-col justify-center">
              <span className="text-xs text-neutral-500 -rotate-90 whitespace-nowrap">
                Position ↓
              </span>
            </div>

            {/* Matrix grid */}
            <div className="flex flex-col">
              {peMatrix.slice(0, Math.min(100, maxLen)).map((row, pos) => (
                <div key={pos} className="flex">
                  {row.slice(0, Math.min(64, dModel)).map((value, dim) => (
                    <div
                      key={dim}
                      className="w-1.5 h-1.5 cursor-crosshair"
                      style={{ backgroundColor: getColor(value) }}
                      onMouseEnter={() => setHoveredCell({ pos, dim })}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between">
          {/* Color scale */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>-1</span>
            <div
              className="w-24 h-3 rounded"
              style={{
                background: 'linear-gradient(to right, rgb(100,100,255), rgb(255,255,255), rgb(255,100,100))',
              }}
            />
            <span>+1</span>
          </div>

          {/* Hover info */}
          {hoveredCell && hoveredValue !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-mono"
            >
              PE({hoveredCell.pos}, {hoveredCell.dim}) ={' '}
              <span className="font-semibold">{hoveredValue.toFixed(4)}</span>
              <span className="text-neutral-400 ml-2">
                ({hoveredCell.dim % 2 === 0 ? 'sin' : 'cos'}, freq={
                  (1 / Math.pow(10000, (2 * Math.floor(hoveredCell.dim / 2)) / dModel)).toExponential(2)
                })
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Shows dimension-by-dimension analysis of PE
 */
export function PEDimensionAnalysis({ className = '' }: { className?: string }) {
  const [selectedDim, setSelectedDim] = useState(0);
  const maxLen = 50;
  const dModel = 64;

  const dimPairs = useMemo(() => {
    const pairs: { dimIndex: number; freq: number; sinVals: number[]; cosVals: number[] }[] = [];

    for (let i = 0; i < Math.min(8, dModel / 2); i++) {
      const freq = 1 / Math.pow(10000, (2 * i) / dModel);
      const sinVals: number[] = [];
      const cosVals: number[] = [];

      for (let pos = 0; pos < maxLen; pos++) {
        sinVals.push(Math.sin(pos * freq));
        cosVals.push(Math.cos(pos * freq));
      }

      pairs.push({ dimIndex: i, freq, sinVals, cosVals });
    }

    return pairs;
  }, [dModel]);

  const selectedPair = dimPairs[selectedDim];

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">Dimension pair:</span>
          <div className="flex gap-1">
            {dimPairs.map((pair, i) => (
              <button
                key={i}
                onClick={() => setSelectedDim(i)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  i === selectedDim
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {2 * i}/{2 * i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {selectedPair && (
          <>
            <div className="text-sm text-neutral-600 mb-4">
              Frequency: <span className="font-mono">{selectedPair.freq.toExponential(3)}</span>
              <span className="text-neutral-400 ml-2">
                (wavelength: {Math.round(2 * Math.PI / selectedPair.freq)} positions)
              </span>
            </div>

            {/* Simple line visualization */}
            <div className="space-y-4">
              <div>
                <div className="text-xs text-purple-600 mb-1">sin (dim {2 * selectedDim})</div>
                <div className="h-16 bg-neutral-50 rounded flex items-end">
                  {selectedPair.sinVals.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-purple-400 opacity-70"
                      style={{
                        height: `${Math.round(((v + 1) / 2) * 1000) / 10}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-600 mb-1">cos (dim {2 * selectedDim + 1})</div>
                <div className="h-16 bg-neutral-50 rounded flex items-end">
                  {selectedPair.cosVals.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-400 opacity-70"
                      style={{
                        height: `${Math.round(((v + 1) / 2) * 1000) / 10}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-neutral-500">
              {selectedDim === 0 && (
                <p>High frequency: Changes rapidly. Good for distinguishing nearby positions.</p>
              )}
              {selectedDim === dimPairs.length - 1 && (
                <p>Low frequency: Changes slowly. Good for distinguishing distant positions.</p>
              )}
              {selectedDim > 0 && selectedDim < dimPairs.length - 1 && (
                <p>Medium frequency: Balances local and global position information.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Interactive relative position dot product visualization
 */
export function RelativePositionViz({ className = '' }: { className?: string }) {
  const [referencePos, setReferencePos] = useState(25);
  const maxLen = 50;
  const dModel = 64;

  // Compute PE matrix
  const peMatrix = useMemo(() => {
    const matrix: number[][] = [];
    for (let pos = 0; pos < maxLen; pos++) {
      const row: number[] = [];
      for (let i = 0; i < dModel; i++) {
        const dimIndex = Math.floor(i / 2);
        const freq = 1 / Math.pow(10000, (2 * dimIndex) / dModel);
        const angle = pos * freq;
        const value = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
        row.push(value);
      }
      matrix.push(row);
    }
    return matrix;
  }, []);

  // Compute dot products with reference position
  const dotProducts = useMemo(() => {
    const refVec = peMatrix[referencePos];
    return peMatrix.map((vec) => {
      let dot = 0;
      for (let i = 0; i < dModel; i++) {
        dot += refVec[i] * vec[i];
      }
      return dot;
    });
  }, [peMatrix, referencePos]);

  const maxDot = Math.max(...dotProducts.map(Math.abs));

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">Reference position:</span>
          <input
            type="range"
            min="0"
            max={maxLen - 1}
            value={referencePos}
            onChange={(e) => setReferencePos(Number(e.target.value))}
            className="w-32"
          />
          <span className="font-mono text-sm">{referencePos}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-neutral-600 mb-4">
          PE({referencePos}) · PE(j) for all positions j:
        </div>

        {/* Bar chart */}
        <div className="h-32 flex items-end gap-px">
          {dotProducts.map((dot, i) => {
            const height = Math.round((Math.abs(dot) / maxDot) * 1000) / 10;
            const isRef = i === referencePos;
            return (
              <div
                key={i}
                className={`flex-1 transition-colors ${
                  isRef ? 'bg-purple-500' : dot > 0 ? 'bg-blue-400 opacity-70' : 'bg-red-400 opacity-70'
                }`}
                style={{ height: `${height}%` }}
                title={`PE(${referencePos}) · PE(${i}) = ${dot.toFixed(2)}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>pos 0</span>
          <span>pos {maxLen - 1}</span>
        </div>

        <div className="mt-4 text-xs text-neutral-500">
          <p>
            Notice: The dot product is highest at the reference position (purple) and decays
            smoothly with distance. Positions at equal distance from the reference have
            similar dot products.
          </p>
        </div>
      </div>
    </div>
  );
}
