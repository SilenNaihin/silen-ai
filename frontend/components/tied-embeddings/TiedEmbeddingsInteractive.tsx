'use client';

import { useState, useMemo, useCallback } from 'react';

/**
 * Interactive parameter calculator showing tied vs untied savings
 */
export function ParameterCalculator({ className = '' }: { className?: string }) {
  const [vocabSize, setVocabSize] = useState(50000);
  const [embeddingDim, setEmbeddingDim] = useState(4096);

  const calculations = useMemo(() => {
    const tiedParams = vocabSize * embeddingDim;
    const untiedParams = 2 * vocabSize * embeddingDim;
    const savings = untiedParams - tiedParams;
    const savingsPercent = (savings / untiedParams) * 100;

    // Compare to typical model sizes
    const modelSizes = [
      { name: '1B model', params: 1_000_000_000 },
      { name: '7B model', params: 7_000_000_000 },
      { name: '70B model', params: 70_000_000_000 },
    ];

    const percentOfModels = modelSizes.map((model) => ({
      name: model.name,
      percent: (savings / model.params) * 100,
    }));

    return {
      tiedParams,
      untiedParams,
      savings,
      savingsPercent,
      percentOfModels,
    };
  }, [vocabSize, embeddingDim]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold text-sm mb-3 text-neutral-800">Parameter Calculator</h4>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-neutral-600 mb-1">Vocabulary Size</label>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={vocabSize}
            onChange={(e) => setVocabSize(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm font-mono text-neutral-700 mt-1">{vocabSize.toLocaleString()}</div>
        </div>

        <div>
          <label className="block text-xs text-neutral-600 mb-1">Embedding Dimension</label>
          <input
            type="range"
            min="256"
            max="8192"
            step="256"
            value={embeddingDim}
            onChange={(e) => setEmbeddingDim(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm font-mono text-neutral-700 mt-1">{embeddingDim.toLocaleString()}</div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1 border-b border-neutral-200">
          <span className="text-neutral-600">Tied parameters (W_E only):</span>
          <span className="font-mono font-medium text-neutral-800">{formatNumber(calculations.tiedParams)}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-neutral-200">
          <span className="text-neutral-600">Untied parameters (W_E + W_U):</span>
          <span className="font-mono font-medium text-neutral-800">{formatNumber(calculations.untiedParams)}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-neutral-200 bg-neutral-100 -mx-2 px-2">
          <span className="text-neutral-800 font-medium">Savings from tying:</span>
          <span className="font-mono font-bold text-neutral-900">
            {formatNumber(calculations.savings)} ({calculations.savingsPercent.toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Context */}
      <div className="mt-3 pt-3 border-t border-neutral-200">
        <div className="text-xs text-neutral-500 mb-2">As percentage of total model:</div>
        <div className="flex gap-3 text-xs">
          {calculations.percentOfModels.map((model) => (
            <div key={model.name} className="text-center">
              <div className="font-mono text-neutral-700">{model.percent.toFixed(1)}%</div>
              <div className="text-neutral-500">{model.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive symmetry explorer showing W_E @ W_E^T is always symmetric
 */
export function SymmetryExplorer({ className = '' }: { className?: string }) {
  // 3x2 embedding matrix (3 tokens, 2 dimensions)
  const [W_E, setW_E] = useState([
    [1.0, 0.5],
    [0.8, 0.9],
    [0.3, 1.2],
  ]);

  const tokens = ['New', 'York', 'City'];

  // Compute W_E @ W_E^T
  const result = useMemo(() => {
    const res: number[][] = [];
    for (let i = 0; i < 3; i++) {
      res[i] = [];
      for (let j = 0; j < 3; j++) {
        res[i][j] = W_E[i][0] * W_E[j][0] + W_E[i][1] * W_E[j][1];
      }
    }
    return res;
  }, [W_E]);

  // Check symmetry
  const symmetryCheck = useMemo(() => {
    const pairs = [
      { i: 0, j: 1, label: '[New,York] vs [York,New]' },
      { i: 0, j: 2, label: '[New,City] vs [City,New]' },
      { i: 1, j: 2, label: '[York,City] vs [City,York]' },
    ];

    return pairs.map((pair) => ({
      ...pair,
      val1: result[pair.i][pair.j],
      val2: result[pair.j][pair.i],
      isEqual: Math.abs(result[pair.i][pair.j] - result[pair.j][pair.i]) < 0.0001,
    }));
  }, [result]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newW_E = W_E.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? numValue : c)) : r
    );
    setW_E(newW_E);
  };

  const randomize = useCallback(() => {
    const newW_E = Array.from({ length: 3 }, () =>
      Array.from({ length: 2 }, () => Math.round((Math.random() * 2 - 1) * 10) / 10)
    );
    setW_E(newW_E);
  }, []);

  return (
    <div className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-sm text-neutral-800">Symmetry Explorer</h4>
        <button
          onClick={randomize}
          className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors"
        >
          Randomize W_E
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* W_E input */}
        <div>
          <div className="text-xs text-neutral-600 mb-2 font-medium">W_E (embedding matrix)</div>
          <div className="inline-block">
            <div className="text-xs text-neutral-400 mb-1 pl-10">dim 0 &nbsp; dim 1</div>
            {W_E.map((row, i) => (
              <div key={i} className="flex items-center gap-1 mb-1">
                <span className="text-xs text-neutral-500 w-8">{tokens[i]}</span>
                {row.map((val, j) => (
                  <input
                    key={j}
                    type="number"
                    step="0.1"
                    value={val}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                    className="w-14 px-1 py-0.5 text-xs font-mono border border-neutral-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Result matrix */}
        <div>
          <div className="text-xs text-neutral-600 mb-2 font-medium">W_E @ W_E^T (result)</div>
          <div className="inline-block">
            <div className="text-xs text-neutral-400 mb-1 pl-10">
              {tokens.map((t) => (
                <span key={t} className="inline-block w-12 text-center">{t}</span>
              ))}
            </div>
            {result.map((row, i) => (
              <div key={i} className="flex items-center gap-1 mb-1">
                <span className="text-xs text-neutral-500 w-8">{tokens[i]}</span>
                {row.map((val, j) => {
                  const isOffDiagonal = i !== j;
                  const pairIdx = symmetryCheck.findIndex(
                    (p) => (p.i === i && p.j === j) || (p.i === j && p.j === i)
                  );
                  const highlightColor = isOffDiagonal
                    ? ['bg-neutral-200', 'bg-neutral-300', 'bg-neutral-200'][pairIdx]
                    : 'bg-neutral-100';

                  return (
                    <div
                      key={j}
                      className={`w-12 px-1 py-0.5 text-xs font-mono rounded text-center ${highlightColor}`}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Symmetry verification */}
      <div className="mt-4 pt-3 border-t border-neutral-200">
        <div className="text-xs text-neutral-600 mb-2 font-medium">Symmetry Check</div>
        <div className="space-y-1">
          {symmetryCheck.map((check, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                ['bg-neutral-100', 'bg-neutral-150', 'bg-neutral-100'][idx]
              }`}
            >
              <span className="text-neutral-600">{check.label}:</span>
              <span className="font-mono">
                {check.val1.toFixed(3)} = {check.val2.toFixed(3)}
                <span className="ml-2 text-neutral-800 font-bold">✓</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-neutral-500 italic">
          No matter what values you enter, W_E @ W_E^T is always symmetric.
        </div>
      </div>
    </div>
  );
}

/**
 * Visual comparison of what embeddings encode vs what logits need
 */
export function EmbeddingVsLogitBox({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold text-sm mb-3 text-neutral-800">Different Purposes, Same Weights?</h4>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-neutral-100 border border-neutral-300 rounded p-3">
          <div className="font-semibold text-neutral-800 mb-2">Token Embedding (W_E)</div>
          <div className="text-neutral-600">Needs to encode:</div>
          <ul className="list-disc list-inside text-neutral-700 mt-1 space-y-0.5">
            <li>Syntactic type (noun/verb/etc)</li>
            <li>Morphology</li>
            <li>Semantic meaning</li>
            <li>Style and register</li>
            <li>Attentional compatibility</li>
          </ul>
        </div>

        <div className="bg-neutral-100 border border-neutral-300 rounded p-3">
          <div className="font-semibold text-neutral-800 mb-2">Logit Vector (W_U)</div>
          <div className="text-neutral-600">Needs to encode:</div>
          <ul className="list-disc list-inside text-neutral-700 mt-1 space-y-0.5">
            <li>Predictive distribution</li>
            <li>Context-dependent likelihood</li>
            <li>Grammar constraints</li>
            <li>Topic flow</li>
            <li>Memorized facts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
