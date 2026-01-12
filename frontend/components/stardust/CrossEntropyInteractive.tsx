'use client';

import { useState, useMemo } from 'react';

interface CrossEntropyInteractiveProps {
  className?: string;
}

/**
 * Interactive visualization for cross-entropy loss.
 * Users can adjust predicted probabilities and see how the loss changes.
 */
export function CrossEntropyInteractive({ className = '' }: CrossEntropyInteractiveProps) {
  // True distribution: one-hot (which class is correct)
  const [trueClass, setTrueClass] = useState(1);

  // Predicted probabilities (must sum to 1)
  const [predLogits, setPredLogits] = useState([1, 2, 1]); // Raw logits, softmax to get probs

  // Calculate softmax probabilities from logits
  const predProbs = useMemo(() => {
    const maxLogit = Math.max(...predLogits);
    const expLogits = predLogits.map(l => Math.exp(l - maxLogit));
    const sum = expLogits.reduce((a, b) => a + b, 0);
    return expLogits.map(e => e / sum);
  }, [predLogits]);

  // True distribution (one-hot)
  const trueProbs = [0, 1, 2].map(i => (i === trueClass ? 1 : 0));

  // Calculate cross-entropy
  const crossEntropy = useMemo(() => {
    let ce = 0;
    for (let i = 0; i < 3; i++) {
      if (trueProbs[i] > 0) {
        ce -= trueProbs[i] * Math.log(predProbs[i] + 1e-10);
      }
    }
    return ce;
  }, [predProbs, trueProbs]);

  // Calculate gradient for each class
  const gradients = predProbs.map((p, i) => p - trueProbs[i]);

  // Handle slider change
  const handleLogitChange = (index: number, value: number) => {
    const newLogits = [...predLogits];
    newLogits[index] = value;
    setPredLogits(newLogits);
  };

  // Get color based on cross-entropy value
  const getLossColor = (ce: number) => {
    if (ce < 0.3) return 'text-green-600';
    if (ce < 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get background color for bars
  const getBarColor = (isTrue: boolean, prob: number) => {
    if (isTrue) {
      return prob > 0.7 ? 'bg-green-500' : prob > 0.3 ? 'bg-yellow-500' : 'bg-red-500';
    }
    return 'bg-neutral-400';
  };

  return (
    <div className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 ${className}`}>
      <div className="text-sm font-bold mb-3">Cross-Entropy: Distribution Distance</div>

      {/* Distributions side by side */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* True Distribution */}
        <div>
          <div className="text-xs font-semibold text-neutral-600 mb-2 text-center">
            True Distribution (y)
          </div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setTrueClass(i)}
                className={`flex flex-col items-center transition-all ${
                  trueClass === i ? 'scale-105' : 'opacity-60'
                }`}
              >
                <div
                  className={`w-10 transition-all ${
                    trueClass === i ? 'bg-green-500 h-20' : 'bg-neutral-300 h-2'
                  } rounded-t`}
                />
                <div className="text-[10px] mt-1 text-neutral-600">
                  {trueClass === i ? '1.0' : '0.0'}
                </div>
                <div className="text-[9px] text-neutral-500">c{i}</div>
              </button>
            ))}
          </div>
          <div className="text-[10px] text-neutral-500 text-center mt-2">
            Click to change true class
          </div>
        </div>

        {/* Predicted Distribution */}
        <div>
          <div className="text-xs font-semibold text-neutral-600 mb-2 text-center">
            Predicted Distribution (p)
          </div>
          <div className="flex justify-center gap-2">
            {predProbs.map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-10 rounded-t transition-all ${getBarColor(i === trueClass, p)}`}
                  style={{ height: `${Math.max(8, p * 80)}px` }}
                />
                <div className="text-[10px] mt-1 text-neutral-700 font-mono">
                  {p.toFixed(2)}
                </div>
                <div className="text-[9px] text-neutral-500">c{i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders for adjusting logits */}
      <div className="border-t border-neutral-200 pt-3 mb-4">
        <div className="text-xs font-semibold text-neutral-600 mb-2">
          Adjust Prediction Confidence
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <input
                type="range"
                min="-3"
                max="5"
                step="0.1"
                value={predLogits[i]}
                onChange={(e) => handleLogitChange(i, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-600"
              />
              <div className="text-[10px] text-neutral-500 mt-1">
                Class {i} {i === trueClass && <span className="text-green-600">(true)</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Entropy Result */}
      <div className="bg-white border border-neutral-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-neutral-600">
            Cross-Entropy Loss = -log(p<sub>true</sub>)
          </div>
          <div className={`text-lg font-bold font-mono ${getLossColor(crossEntropy)}`}>
            {crossEntropy.toFixed(3)}
          </div>
        </div>
        <div className="text-[10px] text-neutral-500">
          = -log({predProbs[trueClass].toFixed(3)}) = {crossEntropy.toFixed(3)}
        </div>

        {/* Visual loss bar */}
        <div className="mt-2 h-2 bg-neutral-100 rounded overflow-hidden">
          <div
            className={`h-full transition-all ${
              crossEntropy < 0.3 ? 'bg-green-500' : crossEntropy < 1.0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, crossEntropy * 25)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-neutral-400 mt-1">
          <span>0 (perfect)</span>
          <span>4+ (very wrong)</span>
        </div>
      </div>

      {/* Gradients */}
      <div className="border-t border-neutral-200 pt-3">
        <div className="text-xs font-semibold text-neutral-600 mb-2">
          Gradient = p - y (how to update)
        </div>
        <div className="flex justify-center gap-4">
          {gradients.map((g, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`text-sm font-mono font-bold ${
                  g < -0.01 ? 'text-green-600' : g > 0.01 ? 'text-red-600' : 'text-neutral-400'
                }`}
              >
                {g >= 0 ? '+' : ''}{g.toFixed(2)}
              </div>
              <div className="text-[9px] text-neutral-500">
                {g < -0.01 ? '↑ increase' : g > 0.01 ? '↓ decrease' : 'keep'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video link */}
      <div className="mt-4 pt-3 border-t border-neutral-200">
        <a
          href="https://www.youtube.com/watch?v=KHVR587oW8I&t=833s"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:text-blue-800 flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          Visual guide to cross-entropy (3Blue1Brown)
        </a>
      </div>
    </div>
  );
}
