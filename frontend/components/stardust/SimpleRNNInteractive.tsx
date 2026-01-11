'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// CONSTANTS
// ============================================================================

const HIDDEN_DIM = 6; // Number of hidden units
const CHARS = 'abcdefghijklmnopqrstuvwxyz '; // lowercase letters + space
const VOCAB_SIZE = CHARS.length;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Seeded PRNG for deterministic initialization (avoids hydration mismatch)
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function charToIndex(char: string): number {
  const idx = CHARS.indexOf(char.toLowerCase());
  return idx >= 0 ? idx : VOCAB_SIZE - 1; // Default to space for unknown chars
}

function indexToChar(idx: number): string {
  return CHARS[idx] || ' ';
}

// One-hot encoding
function oneHot(idx: number, size: number): number[] {
  const vec = Array(size).fill(0);
  if (idx >= 0 && idx < size) {
    vec[idx] = 1;
  }
  return vec;
}

// Initialize weights with Xavier/Glorot initialization
function initializeWeights(seed: number = 42): {
  W_xh: number[][];  // Input to hidden: VOCAB_SIZE x HIDDEN_DIM
  W_hh: number[][];  // Hidden to hidden: HIDDEN_DIM x HIDDEN_DIM
  W_hy: number[][];  // Hidden to output: HIDDEN_DIM x VOCAB_SIZE
  b_h: number[];     // Hidden bias: HIDDEN_DIM
  b_y: number[];     // Output bias: VOCAB_SIZE
} {
  const random = mulberry32(seed);

  // Xavier initialization scale
  const xhScale = Math.sqrt(2 / (VOCAB_SIZE + HIDDEN_DIM));
  const hhScale = Math.sqrt(2 / (HIDDEN_DIM + HIDDEN_DIM));
  const hyScale = Math.sqrt(2 / (HIDDEN_DIM + VOCAB_SIZE));

  const randInit = (scale: number) => () => (random() - 0.5) * 2 * scale;

  return {
    W_xh: Array(VOCAB_SIZE).fill(0).map(() => Array(HIDDEN_DIM).fill(0).map(randInit(xhScale))),
    W_hh: Array(HIDDEN_DIM).fill(0).map(() => Array(HIDDEN_DIM).fill(0).map(randInit(hhScale))),
    W_hy: Array(HIDDEN_DIM).fill(0).map(() => Array(VOCAB_SIZE).fill(0).map(randInit(hyScale))),
    b_h: Array(HIDDEN_DIM).fill(0).map(randInit(0.1)),
    b_y: Array(VOCAB_SIZE).fill(0).map(randInit(0.1)),
  };
}

// Matrix-vector multiplication
function matVec(mat: number[][], vec: number[]): number[] {
  const result: number[] = [];
  for (let j = 0; j < mat[0].length; j++) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += mat[i][j] * vec[i];
    }
    result.push(sum);
  }
  return result;
}

// Element-wise addition
function vecAdd(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

// Tanh activation
function tanh(x: number): number {
  return Math.tanh(x);
}

// Softmax
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exp = logits.map(l => Math.exp(l - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(e => e / sum);
}

// RNN forward step: h_t = tanh(W_xh * x_t + W_hh * h_{t-1} + b_h)
function rnnStep(
  x: number[],
  h_prev: number[],
  weights: ReturnType<typeof initializeWeights>
): { h: number[]; y: number[] } {
  // Compute new hidden state
  const xh = matVec(weights.W_xh, x);
  const hh = matVec(weights.W_hh, h_prev);
  const h_pre = vecAdd(vecAdd(xh, hh), weights.b_h);
  const h = h_pre.map(tanh);

  // Compute output logits and probabilities
  const y_logits = vecAdd(matVec(weights.W_hy, h), weights.b_y);
  const y = softmax(y_logits);

  return { h, y };
}

// ============================================================================
// HIDDEN STATE VISUALIZATION COMPONENT
// ============================================================================

interface HiddenStateVizProps {
  hidden: number[];
  label?: string;
}

function HiddenStateViz({ hidden, label = 'Hidden State' }: HiddenStateVizProps) {
  const maxAbs = Math.max(...hidden.map(Math.abs), 0.01);

  return (
    <div className="bg-neutral-50 rounded-lg p-3">
      <div className="text-[10px] text-neutral-500 uppercase font-medium mb-2">{label}</div>
      <div className="flex gap-1.5 items-end justify-center h-16">
        {hidden.map((val, i) => {
          const normalized = val / maxAbs;
          const height = Math.abs(normalized) * 100;
          const isPositive = val >= 0;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="relative w-6 h-12 flex items-end">
                <motion.div
                  className={`w-full rounded-t ${isPositive ? 'bg-blue-500' : 'bg-red-500'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    bottom: isPositive ? '50%' : 'auto',
                    top: isPositive ? 'auto' : '50%',
                    transform: isPositive ? 'none' : 'scaleY(-1)',
                    transformOrigin: 'top',
                  }}
                />
                <div className="absolute w-full h-px bg-neutral-300 top-1/2" />
              </div>
              <span className="text-[8px] font-mono text-neutral-500">h{i + 1}</span>
              <span className="text-[9px] font-mono text-neutral-600">{val.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PREDICTION BAR CHART COMPONENT
// ============================================================================

interface PredictionVizProps {
  predictions: number[];
  topK?: number;
}

function PredictionViz({ predictions, topK = 5 }: PredictionVizProps) {
  if (predictions.length === 0) return null;

  // Get top K predictions
  const indexed = predictions.map((prob, idx) => ({ prob, idx, char: indexToChar(idx) }));
  const sorted = [...indexed].sort((a, b) => b.prob - a.prob);
  const top = sorted.slice(0, topK);

  return (
    <div className="bg-neutral-50 rounded-lg p-3">
      <div className="text-[10px] text-neutral-500 uppercase font-medium mb-2">
        Next Character Prediction
      </div>
      <div className="space-y-1.5">
        {top.map((item, i) => (
          <div key={item.idx} className="flex items-center gap-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold ${
              i === 0 ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {item.char === ' ' ? '\u2423' : item.char}
            </span>
            <div className="flex-1 h-4 bg-neutral-200 rounded overflow-hidden">
              <motion.div
                className={`h-full ${i === 0 ? 'bg-green-500' : 'bg-neutral-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.prob * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-mono w-12 text-right text-neutral-600">
              {(item.prob * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CHARACTER DISPLAY COMPONENT
// ============================================================================

interface CharacterDisplayProps {
  text: string;
  position: number;
}

function CharacterDisplay({ text, position }: CharacterDisplayProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-3">
      <div className="text-[10px] text-neutral-500 uppercase font-medium mb-2">
        Input Sequence
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {text.split('').map((char, i) => {
          const isPast = i < position;
          const isCurrent = i === position;

          return (
            <motion.div
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono font-bold transition-all ${
                isCurrent
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300 scale-110'
                  : isPast
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-200 text-neutral-400'
              }`}
              initial={isCurrent ? { scale: 1 } : {}}
              animate={isCurrent ? { scale: 1.1 } : { scale: 1 }}
            >
              {char === ' ' ? '\u2423' : char}
            </motion.div>
          );
        })}
      </div>
      {position >= 0 && position < text.length && (
        <div className="mt-2 text-center">
          <span className="text-xs text-neutral-500">
            Processing: <span className="font-mono font-bold text-blue-600">
              {text[position] === ' ' ? 'space' : `'${text[position]}'`}
            </span>
            {' '}(position {position + 1} of {text.length})
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROCESSING HISTORY COMPONENT
// ============================================================================

interface HistoryEntry {
  char: string;
  position: number;
  hidden: number[];
  topPrediction: string;
  confidence: number;
}

interface ProcessingHistoryProps {
  history: HistoryEntry[];
}

function ProcessingHistory({ history }: ProcessingHistoryProps) {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={historyRef}
      className="h-24 overflow-y-auto font-mono text-[10px] bg-neutral-900 text-neutral-300 rounded-lg p-2 space-y-0.5"
    >
      {history.length === 0 ? (
        <div className="text-neutral-500">$ awaiting input...</div>
      ) : (
        history.slice(-10).map((entry, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-neutral-500">[{(entry.position + 1).toString().padStart(2, '0')}]</span>
            <span className="text-blue-400">in:{entry.char === ' ' ? '_' : entry.char}</span>
            <span className="text-amber-400">
              h:[{entry.hidden.slice(0, 3).map(v => v.toFixed(1)).join(',')}...]
            </span>
            <span className="text-green-400">
              pred:{entry.topPrediction === ' ' ? '_' : entry.topPrediction} ({(entry.confidence * 100).toFixed(0)}%)
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SimpleRNNInteractive({ className = '' }: { className?: string }) {
  // State
  const [text, setText] = useState('hello world');
  const [position, setPosition] = useState(-1);
  const [hiddenState, setHiddenState] = useState<number[]>(() => Array(HIDDEN_DIM).fill(0));
  const [predictions, setPredictions] = useState<number[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Weights (initialized once with seed for consistency)
  const [weights] = useState(() => initializeWeights(42));

  // Refs for auto-play
  const autoPlayRef = useRef(false);
  const positionRef = useRef(position);
  const hiddenStateRef = useRef(hiddenState);

  useEffect(() => {
    autoPlayRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    hiddenStateRef.current = hiddenState;
  }, [hiddenState]);

  // Process one character
  const step = useCallback(() => {
    const currentPos = positionRef.current;
    const nextPos = currentPos + 1;

    if (nextPos >= text.length) {
      setIsAutoPlaying(false);
      return false;
    }

    const char = text[nextPos];
    const charIdx = charToIndex(char);
    const x = oneHot(charIdx, VOCAB_SIZE);
    const h_prev = hiddenStateRef.current;

    const { h, y } = rnnStep(x, h_prev, weights);

    // Find top prediction
    const maxIdx = y.indexOf(Math.max(...y));
    const topChar = indexToChar(maxIdx);

    setPosition(nextPos);
    setHiddenState(h);
    setPredictions(y);
    setHistory(prev => [...prev, {
      char,
      position: nextPos,
      hidden: [...h],
      topPrediction: topChar,
      confidence: y[maxIdx],
    }]);

    return true;
  }, [text, weights]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (!autoPlayRef.current) {
        clearInterval(interval);
        return;
      }

      const continued = step();
      if (!continued) {
        clearInterval(interval);
        setIsAutoPlaying(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, step]);

  // Reset
  const reset = useCallback(() => {
    setPosition(-1);
    setHiddenState(Array(HIDDEN_DIM).fill(0));
    setPredictions([]);
    setIsAutoPlaying(false);
    setHistory([]);
  }, []);

  // Handle text change
  const handleTextChange = useCallback((newText: string) => {
    // Filter to only allowed characters
    const filtered = newText.toLowerCase().replace(/[^a-z ]/g, '').slice(0, 30);
    setText(filtered);
    reset();
  }, [reset]);

  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    if (position >= text.length - 1) {
      reset();
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying(prev => !prev);
    }
  }, [position, text.length, reset]);

  const isComplete = position >= text.length - 1;
  const hasStarted = position >= 0;

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Simple RNN Character Processor</h3>
          <p className="text-[10px] text-neutral-500">
            Watch how an RNN processes text character by character, maintaining hidden state
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-neutral-500">
            Position: <span className="font-bold text-black">{position + 1}/{text.length}</span>
          </span>
          <span className="text-neutral-500">
            Hidden: <span className="font-bold text-black">{HIDDEN_DIM} units</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input field */}
        <div className="flex gap-2 items-center">
          <label className="text-xs font-medium text-neutral-500">Input Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={isAutoPlaying}
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black disabled:bg-neutral-100"
            placeholder="Enter text (a-z, space only)"
          />
        </div>

        {/* Character display */}
        <CharacterDisplay text={text} position={position} />

        {/* Main visualization area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hidden state */}
          <HiddenStateViz hidden={hiddenState} />

          {/* Predictions */}
          <PredictionViz predictions={predictions} />
        </div>

        {/* RNN equation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-[10px] text-blue-600 uppercase font-medium mb-1">RNN Update Equation</div>
          <div className="font-mono text-sm text-blue-800">
            h<sub>t</sub> = tanh(W<sub>xh</sub> * x<sub>t</sub> + W<sub>hh</sub> * h<sub>t-1</sub> + b)
          </div>
          <div className="text-[10px] text-blue-600 mt-1">
            The hidden state h<sub>t</sub> depends on current input x<sub>t</sub> and previous hidden state h<sub>t-1</sub>
          </div>
        </div>

        {/* Processing history */}
        <ProcessingHistory history={history} />

        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap pt-2 border-t border-neutral-200">
          <button
            onClick={step}
            disabled={isAutoPlaying || isComplete}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Step
          </button>
          <button
            onClick={toggleAutoPlay}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isAutoPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isAutoPlaying ? 'Pause' : isComplete ? 'Replay' : 'Auto-play'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Reset
          </button>

          <div className="flex-1" />

          {/* Status indicator */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              Complete! Processed all {text.length} characters
            </motion.div>
          )}
        </div>

        {/* Current character info */}
        {hasStarted && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-50 rounded-lg p-3"
          >
            <div className="text-xs">
              <span className="text-neutral-500">Current input:</span>{' '}
              <span className="font-mono font-bold text-blue-600">
                {text[position] === ' ' ? 'space' : `'${text[position]}'`}
              </span>
              <span className="text-neutral-500 ml-4">One-hot index:</span>{' '}
              <span className="font-mono font-bold">{charToIndex(text[position])}</span>
              {predictions.length > 0 && (
                <>
                  <span className="text-neutral-500 ml-4">Top prediction:</span>{' '}
                  <span className="font-mono font-bold text-green-600">
                    {indexToChar(predictions.indexOf(Math.max(...predictions))) === ' '
                      ? 'space'
                      : `'${indexToChar(predictions.indexOf(Math.max(...predictions)))}'`}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SimpleRNNInteractive;
