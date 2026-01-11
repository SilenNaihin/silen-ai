'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface NetworkConfig {
  inputDim: number;
  hiddenDim: number;
  outputDim: number;
  learningRate: number;
  activation: 'relu' | 'sigmoid' | 'tanh';
}

interface NetworkWeights {
  embeddings: number[][]; // vocab_size x embed_dim
  hidden: number[][];
  output: number[][];
  hiddenBias: number[];
  outputBias: number[];
}

interface ForwardResult {
  inputs: number[];
  hiddenPre: number[];
  hiddenAct: number[];
  outputPre: number[];
  probs: number[];
}

interface Gradients {
  dEmbeddings: Map<number, number[]>; // token_id -> gradient for that embedding
  dHidden: number[][];
  dOutput: number[][];
  dHiddenBias: number[];
  dOutputBias: number[];
}

interface TokenInfo {
  text: string;
  id: number;
  isUnknown: boolean;
}

interface TokenEmbedding {
  tokenId: number;
  embedding: number[];
}

interface TrainingLogEntry {
  step: number;
  loss: number;
  accuracy: number;
  predicted: string;
  actual: string;
  correct: boolean;
}

type TrainingStage =
  | 'idle'
  | 'tokenizing'
  | 'numericalizing'
  | 'embedding'
  | 'forward-input'
  | 'forward-hidden'
  | 'forward-output'
  | 'loss'
  | 'backward-output'
  | 'backward-hidden'
  | 'update'
  | 'complete';

type Mode = 'train' | 'guess';

// ============================================================================
// CONSTANTS
// ============================================================================

const VOCAB: Record<string, number> = {
  '<PAD>': 0, '<UNK>': 1,
  'love': 2, 'great': 3, 'amazing': 4, 'good': 5, 'excellent': 6,
  'hate': 7, 'terrible': 8, 'bad': 9, 'awful': 10, 'boring': 11,
  'i': 12, 'this': 13, 'movie': 14, 'is': 15, 'was': 16, 'the': 17,
  'it': 18, 'really': 19, 'very': 20, 'so': 21, 'not': 22, 'film': 23,
  'a': 24, 'and': 25, 'but': 26, 'best': 27, 'worst': 28,
};

const POSITIVE_WORDS = new Set(['love', 'great', 'amazing', 'good', 'excellent', 'best']);
const NEGATIVE_WORDS = new Set(['hate', 'terrible', 'bad', 'awful', 'boring', 'worst']);

const TRAINING_SET = [
  { text: 'I love this movie', label: 1 },
  { text: 'This is terrible', label: 0 },
  { text: 'Really great film', label: 1 },
  { text: 'So bad and boring', label: 0 },
  { text: 'The best movie', label: 1 },
  { text: 'Awful and terrible', label: 0 },
  { text: 'I love it', label: 1 },
  { text: 'Really bad film', label: 0 },
];

const EMBED_DIM = 2; // Small embedding dimension for visualization
const VOCAB_SIZE = Object.keys(VOCAB).length;

const DEFAULT_CONFIG: NetworkConfig = {
  inputDim: EMBED_DIM,
  hiddenDim: 3,
  outputDim: 2,
  learningRate: 0.5,
  activation: 'relu',
};

// ============================================================================
// ACTIVATION FUNCTIONS
// ============================================================================

function applyActivation(x: number, type: NetworkConfig['activation']): number {
  switch (type) {
    case 'relu': return Math.max(0, x);
    case 'sigmoid': return 1 / (1 + Math.exp(-Math.min(Math.max(x, -500), 500)));
    case 'tanh': return Math.tanh(x);
  }
}

function activationDeriv(x: number, type: NetworkConfig['activation']): number {
  switch (type) {
    case 'relu': return x > 0 ? 1 : 0;
    case 'sigmoid': {
      const s = 1 / (1 + Math.exp(-Math.min(Math.max(x, -500), 500)));
      return s * (1 - s);
    }
    case 'tanh': {
      const t = Math.tanh(x);
      return 1 - t * t;
    }
  }
}

function activationName(type: NetworkConfig['activation']): string {
  switch (type) {
    case 'relu': return 'ReLU';
    case 'sigmoid': return 'σ';
    case 'tanh': return 'tanh';
  }
}

// ============================================================================
// NEURAL NETWORK FUNCTIONS
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

function initializeWeights(config: NetworkConfig, seed: number = 42): NetworkWeights {
  const { inputDim, hiddenDim, outputDim } = config;
  const random = mulberry32(seed);
  const randInit = () => (random() - 0.5) * 0.8;

  return {
    embeddings: Array(VOCAB_SIZE).fill(0).map(() => Array(EMBED_DIM).fill(0).map(randInit)),
    hidden: Array(inputDim).fill(0).map(() => Array(hiddenDim).fill(0).map(randInit)),
    output: Array(hiddenDim).fill(0).map(() => Array(outputDim).fill(0).map(randInit)),
    hiddenBias: Array(hiddenDim).fill(0).map(randInit),
    outputBias: Array(outputDim).fill(0).map(randInit),
  };
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exp = logits.map(l => Math.exp(l - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(e => e / sum);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
}

function tokensToIds(tokens: string[]): TokenInfo[] {
  return tokens.map(token => {
    const id = VOCAB[token];
    return id !== undefined
      ? { text: token, id, isUnknown: false }
      : { text: token, id: VOCAB['<UNK>'], isUnknown: true };
  });
}

// Look up embeddings from learned embedding table
function getEmbeddings(tokenIds: TokenInfo[], weights: NetworkWeights): TokenEmbedding[] {
  return tokenIds.map(t => ({
    tokenId: t.id,
    embedding: [...weights.embeddings[t.id]], // Copy the embedding vector
  }));
}

// Pool embeddings by averaging to get fixed-size input
function poolEmbeddings(embeddings: TokenEmbedding[]): number[] {
  if (embeddings.length === 0) return Array(EMBED_DIM).fill(0);

  const sum = Array(EMBED_DIM).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < EMBED_DIM; i++) {
      sum[i] += emb.embedding[i];
    }
  }
  return sum.map(s => s / embeddings.length);
}

function forwardPass(inputs: number[], weights: NetworkWeights, config: NetworkConfig): ForwardResult {
  const { hiddenDim, outputDim, activation } = config;

  const hiddenPre: number[] = [];
  const hiddenAct: number[] = [];
  for (let j = 0; j < hiddenDim; j++) {
    let sum = weights.hiddenBias[j];
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * weights.hidden[i][j];
    }
    hiddenPre.push(sum);
    hiddenAct.push(applyActivation(sum, activation));
  }

  const outputPre: number[] = [];
  for (let j = 0; j < outputDim; j++) {
    let sum = weights.outputBias[j];
    for (let i = 0; i < hiddenDim; i++) {
      sum += hiddenAct[i] * weights.output[i][j];
    }
    outputPre.push(sum);
  }

  return { inputs, hiddenPre, hiddenAct, outputPre, probs: softmax(outputPre) };
}

function computeLoss(probs: number[], label: number): number {
  return -Math.log(Math.max(probs[label], 1e-10));
}

function backwardPass(
  forward: ForwardResult,
  label: number,
  weights: NetworkWeights,
  config: NetworkConfig,
  tokenIds: TokenInfo[]
): Gradients {
  const { hiddenDim, outputDim, activation } = config;
  const { inputs, hiddenPre, hiddenAct, probs } = forward;

  const dLogits = [...probs];
  dLogits[label] -= 1;

  const dOutput: number[][] = [];
  for (let i = 0; i < hiddenDim; i++) {
    dOutput[i] = [];
    for (let j = 0; j < outputDim; j++) {
      dOutput[i][j] = hiddenAct[i] * dLogits[j];
    }
  }
  const dOutputBias = [...dLogits];

  const dHiddenAct: number[] = [];
  for (let i = 0; i < hiddenDim; i++) {
    let sum = 0;
    for (let j = 0; j < outputDim; j++) {
      sum += dLogits[j] * weights.output[i][j];
    }
    dHiddenAct.push(sum * activationDeriv(hiddenPre[i], activation));
  }

  const dHidden: number[][] = [];
  for (let i = 0; i < inputs.length; i++) {
    dHidden[i] = [];
    for (let j = 0; j < hiddenDim; j++) {
      dHidden[i][j] = inputs[i] * dHiddenAct[j];
    }
  }
  const dHiddenBias = [...dHiddenAct];

  // Compute gradient w.r.t. inputs (for embeddings)
  const dInputs: number[] = [];
  for (let i = 0; i < inputs.length; i++) {
    let sum = 0;
    for (let j = 0; j < hiddenDim; j++) {
      sum += dHiddenAct[j] * weights.hidden[i][j];
    }
    dInputs.push(sum);
  }

  // Distribute input gradients back to embeddings (averaged pooling gradient)
  const dEmbeddings = new Map<number, number[]>();
  const numTokens = tokenIds.length || 1;
  for (const t of tokenIds) {
    // Each embedding gets dInput / numTokens (chain rule for average pooling)
    dEmbeddings.set(t.id, dInputs.map(d => d / numTokens));
  }

  return { dEmbeddings, dHidden, dOutput, dHiddenBias, dOutputBias };
}

function applyGradients(
  weights: NetworkWeights,
  gradients: Gradients,
  lr: number
): NetworkWeights {
  // Update embeddings for tokens that have gradients
  const newEmbeddings = weights.embeddings.map((emb, i) => {
    const grad = gradients.dEmbeddings.get(i);
    if (grad) {
      return emb.map((e, j) => e - lr * grad[j]);
    }
    return emb;
  });

  return {
    embeddings: newEmbeddings,
    hidden: weights.hidden.map((row, i) =>
      row.map((w, j) => w - lr * gradients.dHidden[i][j])
    ),
    output: weights.output.map((row, i) =>
      row.map((w, j) => w - lr * gradients.dOutput[i][j])
    ),
    hiddenBias: weights.hiddenBias.map((b, i) => b - lr * gradients.dHiddenBias[i]),
    outputBias: weights.outputBias.map((b, i) => b - lr * gradients.dOutputBias[i]),
  };
}

// ============================================================================
// TOKENIZATION FLOW COMPONENT
// ============================================================================

interface TokenFlowProps {
  text: string;
  tokens: string[];
  tokenIds: TokenInfo[];
  embeddings: TokenEmbedding[];
  features: number[];
  stage: TrainingStage;
}

function TokenFlow({ text, tokens, tokenIds, embeddings, features, stage }: TokenFlowProps) {
  const stageOrder = ['idle', 'tokenizing', 'numericalizing', 'embedding', 'forward-input', 'forward-hidden', 'forward-output', 'loss', 'backward-output', 'backward-hidden', 'update', 'complete'];
  const stageIdx = stageOrder.indexOf(stage);

  const showTokens = stageIdx >= 1;
  const showIds = stageIdx >= 2;
  const showEmbeddings = stageIdx >= 3;
  // Features shown once we're past embedding stage (in the network input)
  const showFeatures = stageIdx >= 4;

  return (
    <div className="flex items-center gap-2 text-xs overflow-x-auto py-2 px-1 bg-neutral-50 rounded-lg">
      <div className="flex-shrink-0 px-2 py-1 bg-white border border-neutral-200 rounded font-mono text-[11px] truncate max-w-[100px]">
        &quot;{text.slice(0, 15)}{text.length > 15 ? '…' : ''}&quot;
      </div>

      {showTokens && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-400 text-[10px]">→</motion.span>
          <div className="flex gap-1 flex-shrink-0">
            {tokens.slice(0, 3).map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-700 font-mono"
              >
                {t}
              </motion.span>
            ))}
            {tokens.length > 3 && <span className="text-neutral-400 text-[10px]">+{tokens.length - 3}</span>}
          </div>
        </>
      )}

      {showIds && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-400 text-[10px]">→</motion.span>
          <div className="flex gap-1 flex-shrink-0">
            {tokenIds.slice(0, 3).map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  t.isUnknown ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-neutral-100 border border-neutral-300'
                }`}
              >
                {t.id}
              </motion.span>
            ))}
            {tokenIds.length > 3 && <span className="text-neutral-400 text-[10px]">+{tokenIds.length - 3}</span>}
          </div>
        </>
      )}

      {showEmbeddings && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-400 text-[10px]">→</motion.span>
          <div className="flex gap-1 flex-shrink-0">
            {embeddings.slice(0, 2).map((emb, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-[9px] font-mono text-purple-700"
                title={`Token ${emb.tokenId}: [${emb.embedding.map(v => v.toFixed(3)).join(', ')}]`}
              >
                [{emb.embedding.map(v => v.toFixed(2)).join(', ')}]
              </motion.div>
            ))}
            {embeddings.length > 2 && <span className="text-neutral-400 text-[10px]">+{embeddings.length - 2}</span>}
          </div>
        </>
      )}

      {showFeatures && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-400 text-[10px]">→</motion.span>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-shrink-0">
            <span className="px-1.5 py-0.5 bg-green-50 border border-green-200 rounded text-[9px] font-mono text-green-700">
              pool: [{features.map(f => f.toFixed(2)).join(', ')}]
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// NETWORK DIAGRAM COMPONENT (with weight labels)
// ============================================================================

interface NetworkDiagramProps {
  config: NetworkConfig;
  weights: NetworkWeights;
  forward: ForwardResult | null;
  gradients: Gradients | null;
  stage: TrainingStage;
  highlightWeight: { layer: 'hidden' | 'output'; from: number; to: number } | null;
  updatingWeight: { layer: 'hidden' | 'output'; from: number; to: number } | null;
}

function NetworkDiagram({
  config,
  weights,
  forward,
  gradients,
  stage,
  highlightWeight,
  updatingWeight,
}: NetworkDiagramProps) {
  const { inputDim, hiddenDim, outputDim } = config;

  const width = 480;
  const height = 220;
  const padding = 40;
  const layerX = [padding + 30, width / 2, width - padding - 40];

  const getNodeY = (count: number, index: number) => {
    const spacing = Math.min(45, (height - padding * 2) / (count + 1));
    const totalHeight = spacing * (count - 1);
    const startY = (height - totalHeight) / 2;
    return startY + index * spacing;
  };

  // Compute max weight magnitude for thickness scaling
  const allWeights = [
    ...weights.hidden.flat(),
    ...weights.output.flat(),
  ];
  const maxWeight = Math.max(...allWeights.map(Math.abs), 0.1);

  const inputLabels = ['e₁', 'e₂']; // Embedding dimensions
  const inputNodes = Array(inputDim).fill(0).map((_, i) => ({
    x: layerX[0],
    y: getNodeY(inputDim, i),
    value: forward?.inputs[i] ?? 0,
    label: inputLabels[i] || `e${i+1}`,
  }));

  const hiddenNodes = Array(hiddenDim).fill(0).map((_, i) => ({
    x: layerX[1],
    y: getNodeY(hiddenDim, i),
    value: forward?.hiddenAct[i] ?? 0,
    pre: forward?.hiddenPre[i] ?? 0,
  }));

  const outputNodes = [
    { x: layerX[2], y: getNodeY(2, 0), value: forward?.probs[0] ?? 0.5, label: 'Neg' },
    { x: layerX[2], y: getNodeY(2, 1), value: forward?.probs[1] ?? 0.5, label: 'Pos' },
  ];

  const isForwardStage = stage.startsWith('forward');
  const isBackwardStage = stage.startsWith('backward');
  const isUpdateStage = stage === 'update';

  return (
    <svg width={width} height={height} className="bg-white rounded-lg border border-neutral-200">
      {/* Hidden layer connections with weight labels */}
      {inputNodes.map((inp, i) =>
        hiddenNodes.map((hid, j) => {
          const w = weights.hidden[i]?.[j] ?? 0;
          const grad = gradients?.dHidden[i]?.[j] ?? 0;
          const isHighlighted = highlightWeight?.layer === 'hidden' &&
            highlightWeight.from === i && highlightWeight.to === j;
          const isUpdating = updatingWeight?.layer === 'hidden' &&
            updatingWeight.from === i && updatingWeight.to === j;

          // Line thickness proportional to weight magnitude (0.5-2px range)
          const baseThickness = 0.5 + (Math.abs(w) / maxWeight) * 1.5;
          let strokeColor = w >= 0 ? '#3b82f6' : '#ef4444'; // Blue for positive, red for negative
          let strokeWidth = baseThickness;
          let strokeOpacity = 0.5 + Math.min(Math.abs(w) / maxWeight, 1) * 0.4;

          if (isBackwardStage && isHighlighted) {
            strokeColor = '#dc2626';
            strokeWidth = Math.max(baseThickness, 2);
            strokeOpacity = 1;
          } else if (isUpdateStage && isUpdating) {
            strokeColor = '#16a34a';
            strokeWidth = Math.max(baseThickness, 2);
            strokeOpacity = 1;
          } else if (isForwardStage && stage !== 'forward-input') {
            strokeOpacity = 0.6 + Math.min(Math.abs(w) / maxWeight, 1) * 0.3;
          }

          const midX = (inp.x + hid.x) / 2;
          const midY = (inp.y + hid.y) / 2;

          return (
            <g key={`h-${i}-${j}`}>
              <line
                x1={inp.x + 16} y1={inp.y}
                x2={hid.x - 16} y2={hid.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
              />
              {/* Weight label on line */}
              <text
                x={midX}
                y={midY - 3}
                textAnchor="middle"
                className="text-[8px] font-mono fill-neutral-500"
              >
                {w.toFixed(2)}
              </text>
              {/* Gradient label during backward */}
              {isBackwardStage && isHighlighted && (
                <text
                  x={midX}
                  y={midY + 9}
                  textAnchor="middle"
                  className="text-[8px] font-mono fill-red-600 font-bold"
                >
                  ∇{grad.toFixed(3)}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Output layer connections with weight labels */}
      {hiddenNodes.map((hid, i) =>
        outputNodes.map((out, j) => {
          const w = weights.output[i]?.[j] ?? 0;
          const grad = gradients?.dOutput[i]?.[j] ?? 0;
          const isHighlighted = highlightWeight?.layer === 'output' &&
            highlightWeight.from === i && highlightWeight.to === j;
          const isUpdating = updatingWeight?.layer === 'output' &&
            updatingWeight.from === i && updatingWeight.to === j;

          // Line thickness proportional to weight magnitude (0.5-2px range)
          const baseThickness = 0.5 + (Math.abs(w) / maxWeight) * 1.5;
          let strokeColor = w >= 0 ? '#3b82f6' : '#ef4444'; // Blue for positive, red for negative
          let strokeWidth = baseThickness;
          let strokeOpacity = 0.5 + Math.min(Math.abs(w) / maxWeight, 1) * 0.4;

          if (isBackwardStage && isHighlighted) {
            strokeColor = '#dc2626';
            strokeWidth = Math.max(baseThickness, 2);
            strokeOpacity = 1;
          } else if (isUpdateStage && isUpdating) {
            strokeColor = '#16a34a';
            strokeWidth = Math.max(baseThickness, 2);
            strokeOpacity = 1;
          } else if (stage === 'forward-output') {
            strokeOpacity = 0.6 + Math.min(Math.abs(w) / maxWeight, 1) * 0.3;
          }

          const midX = (hid.x + out.x) / 2;
          const midY = (hid.y + out.y) / 2;

          return (
            <g key={`o-${i}-${j}`}>
              <line
                x1={hid.x + 16} y1={hid.y}
                x2={out.x - 20} y2={out.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
              />
              <text
                x={midX}
                y={midY - 3}
                textAnchor="middle"
                className="text-[8px] font-mono fill-neutral-500"
              >
                {w.toFixed(2)}
              </text>
              {isBackwardStage && isHighlighted && (
                <text
                  x={midX}
                  y={midY + 9}
                  textAnchor="middle"
                  className="text-[8px] font-mono fill-red-600 font-bold"
                >
                  ∇{grad.toFixed(3)}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Input nodes */}
      {inputNodes.map((node, i) => (
        <g key={`in-${i}`}>
          <motion.circle
            cx={node.x} cy={node.y} r={16}
            fill={stage === 'forward-input' ? '#dbeafe' : 'white'}
            stroke={stage === 'forward-input' ? '#3b82f6' : '#666'}
            strokeWidth={stage === 'forward-input' ? 2.5 : 1.5}
            animate={{ scale: stage === 'forward-input' ? 1.08 : 1 }}
          />
          <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] font-mono font-bold fill-neutral-800">
            {node.value.toFixed(2)}
          </text>
          <text x={node.x - 24} y={node.y} textAnchor="end" dominantBaseline="middle"
            className="text-[9px] fill-neutral-500">
            {node.label}
          </text>
        </g>
      ))}

      {/* Hidden nodes */}
      {hiddenNodes.map((node, i) => (
        <g key={`hid-${i}`}>
          <motion.circle
            cx={node.x} cy={node.y} r={16}
            fill={
              stage === 'forward-hidden' ? '#dbeafe' :
              stage === 'backward-hidden' ? '#fef2f2' : 'white'
            }
            stroke={
              stage === 'backward-hidden' ? '#dc2626' :
              stage === 'forward-hidden' ? '#3b82f6' : '#666'
            }
            strokeWidth={
              stage === 'forward-hidden' || stage === 'backward-hidden' ? 2.5 : 1.5
            }
            animate={{
              scale: stage === 'forward-hidden' || stage === 'backward-hidden' ? 1.08 : 1
            }}
          />
          <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] font-mono font-bold fill-neutral-800">
            {node.value.toFixed(2)}
          </text>
        </g>
      ))}

      {/* Output nodes */}
      {outputNodes.map((node, i) => (
        <g key={`out-${i}`}>
          <motion.circle
            cx={node.x} cy={node.y} r={20}
            fill={
              stage === 'forward-output' || stage === 'loss' ?
                (i === 0 ? '#fef2f2' : '#f0fdf4') : 'white'
            }
            stroke={
              stage === 'backward-output' ? '#dc2626' :
              (i === 0 ? '#dc2626' : '#16a34a')
            }
            strokeWidth={
              stage === 'forward-output' || stage === 'loss' || stage === 'backward-output'
                ? 2.5 : 1.5
            }
            animate={{
              scale: stage === 'forward-output' || stage === 'loss' || stage === 'backward-output'
                ? 1.08 : 1
            }}
          />
          <text x={node.x} y={node.y - 3} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] font-mono font-bold fill-neutral-800">
            {(node.value * 100).toFixed(0)}%
          </text>
          <text x={node.x} y={node.y + 9} textAnchor="middle" dominantBaseline="middle"
            className="text-[7px] fill-neutral-500">
            {node.label}
          </text>
        </g>
      ))}

      {/* Layer labels */}
      <text x={layerX[0]} y={height - 10} textAnchor="middle" className="text-[9px] fill-neutral-400">
        Input
      </text>
      <text x={layerX[1]} y={height - 10} textAnchor="middle" className="text-[9px] fill-neutral-400">
        Hidden ({activationName(config.activation)})
      </text>
      <text x={layerX[2]} y={height - 10} textAnchor="middle" className="text-[9px] fill-neutral-400">
        Output
      </text>
    </svg>
  );
}

// ============================================================================
// DETAIL PANEL COMPONENT (shows math at each stage)
// ============================================================================

interface DetailPanelProps {
  stage: TrainingStage;
  forward: ForwardResult | null;
  gradients: Gradients | null;
  loss: number | null;
  label: number;
  highlightWeight: { layer: 'hidden' | 'output'; from: number; to: number } | null;
  updatingWeight: { layer: 'hidden' | 'output'; from: number; to: number } | null;
  weights: NetworkWeights;
  oldWeightValue: number | null;
  newWeightValue: number | null;
  config: NetworkConfig;
  tokens: string[];
  tokenIds: TokenInfo[];
}

function DetailPanel({
  stage,
  forward,
  gradients,
  loss,
  label,
  highlightWeight,
  updatingWeight,
  weights,
  oldWeightValue,
  newWeightValue,
  config,
  tokens,
  tokenIds,
}: DetailPanelProps) {
  const actName = activationName(config.activation);

  if (stage === 'idle') {
    return (
      <div className="text-neutral-400 text-sm">
        Click &quot;Step&quot; to begin the training process
      </div>
    );
  }

  if (stage === 'tokenizing') {
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Tokenization</div>
        <div className="font-mono text-sm">
          Breaking text into tokens: [{tokens.map(t => `"${t}"`).join(', ')}]
        </div>
      </div>
    );
  }

  if (stage === 'numericalizing') {
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Numericalization</div>
        <div className="font-mono text-sm">
          {tokenIds.map((t, i) => (
            <span key={i}>
              &quot;{t.text}&quot; → <span className={t.isUnknown ? 'text-amber-600' : ''}>{t.id}</span>
              {i < tokenIds.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'embedding') {
    const firstToken = tokenIds[0];
    const firstEmb = firstToken ? weights.embeddings[firstToken.id] : null;
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Embedding Lookup (Trainable)</div>
        <div className="font-mono text-sm">
          {firstToken && firstEmb && (
            <div className="text-purple-700">
              &quot;{firstToken.text}&quot; (ID {firstToken.id}) → [{firstEmb.map(v => v.toFixed(3)).join(', ')}]
            </div>
          )}
          <div className="text-xs text-neutral-500 mt-1">
            Each token looks up its learned embedding vector. These vectors are trained with backprop.
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'forward-input' && forward) {
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Input Layer</div>
        <div className="font-mono text-sm">
          x = [{forward.inputs.map(v => v.toFixed(2)).join(', ')}]
        </div>
        <div className="text-xs text-neutral-500">Features entering the network</div>
      </div>
    );
  }

  if (stage === 'forward-hidden' && forward) {
    const { hiddenDim } = config;
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Hidden Layer Computation</div>
        <div className="font-mono text-[11px] space-y-0.5 max-h-24 overflow-y-auto">
          {Array(hiddenDim).fill(0).map((_, j) => {
            const terms = forward.inputs.map((inp, i) =>
              `${inp.toFixed(2)}×${weights.hidden[i][j].toFixed(2)}`
            ).join(' + ');
            return (
              <div key={j}>
                h{j+1} = {actName}({terms} + {weights.hiddenBias[j].toFixed(2)}) =
                <span className="font-bold text-black"> {forward.hiddenAct[j].toFixed(3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (stage === 'forward-output' && forward) {
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Output Layer + Softmax</div>
        <div className="font-mono text-[11px] space-y-0.5">
          {[0, 1].map(j => {
            const terms = forward.hiddenAct.map((h, i) =>
              `${h.toFixed(2)}×${weights.output[i][j].toFixed(2)}`
            ).join(' + ');
            return (
              <div key={j}>
                o{j+1} = {terms} + {weights.outputBias[j].toFixed(2)} = {forward.outputPre[j].toFixed(3)}
              </div>
            );
          })}
          <div className="mt-1 pt-1 border-t border-neutral-200">
            softmax → [<span className="text-red-600">{(forward.probs[0]*100).toFixed(1)}%</span>,
             <span className="text-green-600">{(forward.probs[1]*100).toFixed(1)}%</span>]
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'loss' && forward && loss !== null) {
    const predicted = forward.probs[1] > forward.probs[0] ? 1 : 0;
    const correct = predicted === label;
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Loss Computation</div>
        <div className="font-mono text-sm">
          <div>True: <span className={label === 1 ? 'text-green-600' : 'text-red-600'}>
            {label === 1 ? 'Positive' : 'Negative'}
          </span> | Predicted: <span className={predicted === 1 ? 'text-green-600' : 'text-red-600'}>
            {predicted === 1 ? 'Positive' : 'Negative'}
          </span></div>
          <div className="mt-1">
            Loss = -log(p[{label}]) = -log({forward.probs[label].toFixed(4)}) =
            <span className="font-bold"> {loss.toFixed(4)}</span>
          </div>
          <div className={`mt-1 font-bold ${correct ? 'text-green-600' : 'text-red-600'}`}>
            {correct ? '✓ Correct' : '✗ Wrong - need to learn!'}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'backward-output' && gradients && highlightWeight?.layer === 'output') {
    const { from, to } = highlightWeight;
    const grad = gradients.dOutput[from][to];
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Backward Pass - Output Layer</div>
        <div className="font-mono text-sm">
          <div className="text-red-600">
            Gradient for h{from+1} → o{to+1}: <span className="font-bold">{grad.toFixed(4)}</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {grad > 0 ? '↓ Weight should decrease' : grad < 0 ? '↑ Weight should increase' : 'No change needed'}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'backward-hidden' && gradients && highlightWeight?.layer === 'hidden') {
    const { from, to } = highlightWeight;
    const grad = gradients.dHidden[from][to];
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Backward Pass - Hidden Layer</div>
        <div className="font-mono text-sm">
          <div className="text-red-600">
            Gradient for x{from+1} → h{to+1}: <span className="font-bold">{grad.toFixed(4)}</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {grad > 0 ? '↓ Weight should decrease' : grad < 0 ? '↑ Weight should increase' : 'No change needed'}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'update' && updatingWeight && oldWeightValue !== null && newWeightValue !== null) {
    const { layer, from, to } = updatingWeight;
    const grad = layer === 'hidden'
      ? gradients?.dHidden[from][to] ?? 0
      : gradients?.dOutput[from][to] ?? 0;
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Weight Update</div>
        <div className="font-mono text-sm">
          <div className="text-green-600 font-bold">
            Updating {layer === 'hidden' ? `x${from+1} → h${to+1}` : `h${from+1} → o${to+1}`}
          </div>
          <div>
            W_new = {oldWeightValue.toFixed(4)} - {config.learningRate} × {grad.toFixed(4)} =
            <span className="text-green-700 font-bold"> {newWeightValue.toFixed(4)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="space-y-1">
        <div className="text-xs text-neutral-500 uppercase font-medium">Step Complete</div>
        <div className="text-sm">
          All weights updated. Click &quot;Step&quot; to train another example.
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// TRAINING LOG COMPONENT
// ============================================================================

function TrainingLog({ logs }: { logs: TrainingLogEntry[] }) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logRef}
      className="h-20 overflow-y-auto font-mono text-[10px] bg-neutral-900 text-neutral-300 rounded-lg p-2 space-y-0.5"
    >
      {logs.length === 0 ? (
        <div className="text-neutral-500">$ awaiting training...</div>
      ) : (
        logs.slice(-15).map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-neutral-500">[{log.step.toString().padStart(3, '0')}]</span>
            <span className="text-amber-400">L:{log.loss.toFixed(3)}</span>
            <span className="text-blue-400">A:{(log.accuracy * 100).toFixed(0)}%</span>
            <span className={log.correct ? 'text-green-400' : 'text-red-400'}>
              {log.predicted}→{log.actual} {log.correct ? '✓' : '✗'}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ============================================================================
// MINI CHART COMPONENT
// ============================================================================

function MiniChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  if (data.length < 2) return null;

  const width = 100;
  const height = 32;
  const padding = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.slice(-30).map((v, i, arr) => {
    const x = padding + (i / Math.max(arr.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - ((v - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-neutral-500 w-8">{label}</span>
      <svg width={width} height={height} className="bg-neutral-50 rounded border border-neutral-200">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[10px] font-mono w-10 text-right">
        {data[data.length - 1]?.toFixed(3)}
      </span>
    </div>
  );
}

// ============================================================================
// EMBEDDING HISTORY COMPONENT
// ============================================================================

interface EmbeddingHistoryProps {
  word: string;
  history: number[][];
  currentValue: number[];
}

function EmbeddingHistory({ word, history, currentValue }: EmbeddingHistoryProps) {
  const width = 120;
  const height = 50;
  const padding = 8;

  // Get all values for scaling
  const allValues = [...history.flat(), ...currentValue];
  if (allValues.length === 0) return null;

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const colors = ['#8b5cf6', '#06b6d4']; // Purple and cyan for 2D embeddings

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
      <div className="text-[9px] text-purple-600 font-medium mb-1">
        Embedding: &quot;{word}&quot;
      </div>
      <svg width={width} height={height} className="bg-white rounded">
        {[0, 1].map(dim => {
          const data = history.map(h => h[dim]);
          if (data.length < 2) return null;

          const points = data.slice(-20).map((v, i, arr) => {
            const x = padding + (i / Math.max(arr.length - 1, 1)) * (width - 2 * padding);
            const y = height - padding - ((v - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polyline
              key={dim}
              points={points}
              fill="none"
              stroke={colors[dim]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
      <div className="flex gap-2 mt-1 text-[9px] font-mono">
        <span className="text-purple-600">e₁: {currentValue[0]?.toFixed(2)}</span>
        <span className="text-cyan-600">e₂: {currentValue[1]?.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TrainingInteractive({ className = '' }: { className?: string }) {
  // Configuration
  const [config, setConfig] = useState<NetworkConfig>(DEFAULT_CONFIG);

  // State
  const [weights, setWeights] = useState<NetworkWeights>(() => initializeWeights(DEFAULT_CONFIG));
  const [inputText, setInputText] = useState('I love this movie');
  const [label, setLabel] = useState<0 | 1>(1);
  const [mode, setMode] = useState<Mode>('train');

  // Tokenization state
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenIds, setTokenIds] = useState<TokenInfo[]>([]);
  const [embeddings, setEmbeddings] = useState<TokenEmbedding[]>([]);
  const [features, setFeatures] = useState<number[]>([0, 0]);

  // Network state
  const [forward, setForward] = useState<ForwardResult | null>(null);
  const [gradients, setGradients] = useState<Gradients | null>(null);
  const [loss, setLoss] = useState<number | null>(null);

  // Training state
  const [stage, setStage] = useState<TrainingStage>('idle');
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<TrainingLogEntry[]>([]);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [accHistory, setAccHistory] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<{ predicted: number; actual: number }[]>([]);
  const [embeddingHistory, setEmbeddingHistory] = useState<{ word: string; id: number; values: number[][] }>({ word: 'love', id: VOCAB['love'], values: [] });

  // Animation state
  const [highlightWeight, setHighlightWeight] = useState<{
    layer: 'hidden' | 'output';
    from: number;
    to: number;
  } | null>(null);
  const [updatingWeight, setUpdatingWeight] = useState<{
    layer: 'hidden' | 'output';
    from: number;
    to: number;
  } | null>(null);
  const [oldWeightValue, setOldWeightValue] = useState<number | null>(null);
  const [newWeightValue, setNewWeightValue] = useState<number | null>(null);

  // Refs
  const stageRef = useRef<TrainingStage>('idle');
  const weightsRef = useRef(weights);
  const configRef = useRef(config);

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { weightsRef.current = weights; }, [weights]);
  useEffect(() => { configRef.current = config; }, [config]);

  // Reset when config changes
  const handleConfigChange = useCallback((newConfig: NetworkConfig) => {
    setConfig(newConfig);
    const newWeights = initializeWeights(newConfig, Date.now());
    setWeights(newWeights);
    setForward(null);
    setGradients(null);
    setLoss(null);
    setStage('idle');
    setStep(0);
    setLogs([]);
    setLossHistory([]);
    setAccHistory([]);
    setPredictions([]);
    setEmbeddingHistory({ word: 'love', id: VOCAB['love'], values: [[...newWeights.embeddings[VOCAB['love']]]] });
    setHighlightWeight(null);
    setUpdatingWeight(null);
    setTokens([]);
    setTokenIds([]);
    setEmbeddings([]);
    setFeatures([0, 0]);
  }, []);

  // Step function - advances one stage at a time
  const doStep = useCallback(() => {
    const currentStage = stageRef.current;
    const currentWeights = weightsRef.current;
    const currentConfig = configRef.current;

    // Start: tokenize
    if (currentStage === 'idle' || currentStage === 'complete') {
      const toks = tokenize(inputText);
      setTokens(toks);
      setStage('tokenizing');
      return;
    }

    // Numericalize
    if (currentStage === 'tokenizing') {
      const ids = tokensToIds(tokens);
      setTokenIds(ids);
      setStage('numericalizing');
      return;
    }

    // Embedding lookup
    if (currentStage === 'numericalizing') {
      const embs = getEmbeddings(tokenIds, currentWeights);
      setEmbeddings(embs);
      setStage('embedding');
      return;
    }

    // Embedding → Forward input (pool embeddings and start forward pass)
    if (currentStage === 'embedding') {
      const embs = getEmbeddings(tokenIds, currentWeights);
      const feats = poolEmbeddings(embs);
      setFeatures(feats);
      const fwd = forwardPass(feats, currentWeights, currentConfig);
      setForward(fwd);
      setStage('forward-input');
      return;
    }

    // Forward hidden
    if (currentStage === 'forward-input') {
      setStage('forward-hidden');
      return;
    }

    // Forward output
    if (currentStage === 'forward-hidden') {
      setStage('forward-output');
      return;
    }

    // Loss
    if (currentStage === 'forward-output') {
      if (forward) {
        setLoss(computeLoss(forward.probs, label));
      }
      setStage('loss');
      return;
    }

    // Backward output
    if (currentStage === 'loss') {
      if (forward) {
        const grads = backwardPass(forward, label, currentWeights, currentConfig, tokenIds);
        setGradients(grads);
        setHighlightWeight({ layer: 'output', from: 0, to: 0 });
      }
      setStage('backward-output');
      return;
    }

    // Continue backward output
    if (currentStage === 'backward-output') {
      if (highlightWeight?.layer === 'output') {
        const { from, to } = highlightWeight;
        const nextTo = to + 1;
        if (nextTo < currentConfig.outputDim) {
          setHighlightWeight({ layer: 'output', from, to: nextTo });
        } else {
          const nextFrom = from + 1;
          if (nextFrom < currentConfig.hiddenDim) {
            setHighlightWeight({ layer: 'output', from: nextFrom, to: 0 });
          } else {
            setHighlightWeight({ layer: 'hidden', from: 0, to: 0 });
            setStage('backward-hidden');
          }
        }
      }
      return;
    }

    // Continue backward hidden
    if (currentStage === 'backward-hidden') {
      if (highlightWeight?.layer === 'hidden') {
        const { from, to } = highlightWeight;
        const nextTo = to + 1;
        if (nextTo < currentConfig.hiddenDim) {
          setHighlightWeight({ layer: 'hidden', from, to: nextTo });
        } else {
          const nextFrom = from + 1;
          if (nextFrom < currentConfig.inputDim) {
            setHighlightWeight({ layer: 'hidden', from: nextFrom, to: 0 });
          } else {
            // Move to update
            setHighlightWeight(null);
            const oldVal = currentWeights.output[0][0];
            const newVal = oldVal - currentConfig.learningRate * (gradients?.dOutput[0][0] ?? 0);
            setOldWeightValue(oldVal);
            setNewWeightValue(newVal);
            setUpdatingWeight({ layer: 'output', from: 0, to: 0 });
            setStage('update');
          }
        }
      }
      return;
    }

    // Update
    if (currentStage === 'update') {
      if (gradients) {
        const newWeights = applyGradients(currentWeights, gradients, currentConfig.learningRate);
        setWeights(newWeights);

        // Track embedding history for watched word
        setEmbeddingHistory(h => ({
          ...h,
          values: [...h.values, [...newWeights.embeddings[h.id]]],
        }));

        const predicted = forward!.probs[1] > forward!.probs[0] ? 1 : 0;
        const correct = predicted === label;
        const newStep = step + 1;
        setStep(newStep);

        setPredictions(p => [...p, { predicted, actual: label }]);
        setLossHistory(h => [...h, loss!]);

        const totalCorrect = predictions.filter(p => p.predicted === p.actual).length + (correct ? 1 : 0);
        const accuracy = totalCorrect / (predictions.length + 1);
        setAccHistory(h => [...h, accuracy]);

        setLogs(logs => [...logs, {
          step: newStep,
          loss: loss!,
          accuracy,
          predicted: predicted === 1 ? 'Pos' : 'Neg',
          actual: label === 1 ? 'Pos' : 'Neg',
          correct,
        }]);
      }
      setUpdatingWeight(null);
      setOldWeightValue(null);
      setNewWeightValue(null);
      setStage('complete');
    }
  }, [inputText, label, forward, gradients, highlightWeight, tokens, step, predictions, loss]);

  // Train full step (fast)
  const trainFullStep = useCallback(() => {
    const toks = tokenize(inputText);
    const ids = tokensToIds(toks);
    const embs = getEmbeddings(ids, weights);
    const feats = poolEmbeddings(embs);
    const fwd = forwardPass(feats, weights, config);
    const l = computeLoss(fwd.probs, label);
    const grads = backwardPass(fwd, label, weights, config, ids);
    const newWeights = applyGradients(weights, grads, config.learningRate);
    setWeights(newWeights);

    // Track embedding history
    setEmbeddingHistory(h => ({
      ...h,
      values: [...h.values, [...newWeights.embeddings[h.id]]],
    }));

    const predicted = fwd.probs[1] > fwd.probs[0] ? 1 : 0;
    const correct = predicted === label;
    const newStep = step + 1;
    setStep(newStep);

    setPredictions(p => [...p, { predicted, actual: label }]);
    setLossHistory(h => [...h, l]);

    const totalCorrect = predictions.filter(p => p.predicted === p.actual).length + (correct ? 1 : 0);
    const accuracy = totalCorrect / (predictions.length + 1);
    setAccHistory(h => [...h, accuracy]);

    setLogs(logs => [...logs, {
      step: newStep,
      loss: l,
      accuracy,
      predicted: predicted === 1 ? 'Pos' : 'Neg',
      actual: label === 1 ? 'Pos' : 'Neg',
      correct,
    }]);

    setForward(fwd);
    setGradients(grads);
    setLoss(l);
    setTokens(toks);
    setTokenIds(ids);
    setEmbeddings(getEmbeddings(ids, newWeights));
    setFeatures(feats);
    setStage('complete');
  }, [inputText, label, weights, config, step, predictions]);

  // Train 10x
  const train10Steps = useCallback(() => {
    let currentWeights = weights;

    for (let i = 0; i < 10; i++) {
      const example = TRAINING_SET[i % TRAINING_SET.length];
      const exToks = tokenize(example.text);
      const exIds = tokensToIds(exToks);
      const exEmbs = getEmbeddings(exIds, currentWeights);
      const feats = poolEmbeddings(exEmbs);
      const fwd = forwardPass(feats, currentWeights, config);
      const l = computeLoss(fwd.probs, example.label);
      const grads = backwardPass(fwd, example.label, currentWeights, config, exIds);
      currentWeights = applyGradients(currentWeights, grads, config.learningRate);

      // Track embedding history
      setEmbeddingHistory(h => ({
        ...h,
        values: [...h.values, [...currentWeights.embeddings[h.id]]],
      }));

      const predicted = fwd.probs[1] > fwd.probs[0] ? 1 : 0;
      const correct = predicted === example.label;
      const newStep = step + i + 1;

      setPredictions(p => [...p, { predicted, actual: example.label }]);
      setLossHistory(h => [...h, l]);

      const totalCorrect = predictions.filter(p => p.predicted === p.actual).length + (correct ? 1 : 0);
      const accuracy = totalCorrect / (predictions.length + i + 1);
      setAccHistory(h => [...h, accuracy]);

      setLogs(logs => [...logs, {
        step: newStep,
        loss: l,
        accuracy,
        predicted: predicted === 1 ? 'Pos' : 'Neg',
        actual: example.label === 1 ? 'Pos' : 'Neg',
        correct,
      }]);
    }

    setWeights(currentWeights);
    setStep(s => s + 10);

    // Update display with current input
    const toks = tokenize(inputText);
    const ids = tokensToIds(toks);
    const embs = getEmbeddings(ids, currentWeights);
    const feats = poolEmbeddings(embs);
    const fwd = forwardPass(feats, currentWeights, config);
    setForward(fwd);
    setLoss(computeLoss(fwd.probs, label));
    setTokens(toks);
    setTokenIds(ids);
    setEmbeddings(embs);
    setFeatures(feats);
    setStage('complete');
  }, [weights, config, step, predictions, inputText, label]);

  // Guess (inference only)
  const runGuess = useCallback(() => {
    setMode('guess');
    const toks = tokenize(inputText);
    const ids = tokensToIds(toks);
    const embs = getEmbeddings(ids, weights);
    const feats = poolEmbeddings(embs);
    const fwd = forwardPass(feats, weights, config);

    setTokens(toks);
    setTokenIds(ids);
    setEmbeddings(embs);
    setFeatures(feats);
    setForward(fwd);
    setStage('complete');
  }, [inputText, weights, config]);

  // Reset
  const reset = useCallback(() => {
    const newWeights = initializeWeights(config, Date.now());
    setWeights(newWeights);
    setForward(null);
    setGradients(null);
    setLoss(null);
    setStage('idle');
    setStep(0);
    setLogs([]);
    setLossHistory([]);
    setAccHistory([]);
    setPredictions([]);
    setEmbeddingHistory({ word: 'love', id: VOCAB['love'], values: [[...newWeights.embeddings[VOCAB['love']]]] });
    setHighlightWeight(null);
    setUpdatingWeight(null);
    setTokens([]);
    setTokenIds([]);
    setEmbeddings([]);
    setFeatures([0, 0]);
    setMode('train');
  }, [config]);

  const isRunning = !['idle', 'complete'].includes(stage);

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Neural Network Training</h3>
          <p className="text-[10px] text-neutral-500">A tiny 2-layer network. Real models have billions of parameters!</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-neutral-500">Step: <span className="font-bold text-black">{step}</span></span>
          {loss !== null && (
            <span className="text-neutral-500">Loss: <span className="font-bold text-black">{loss.toFixed(3)}</span></span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Input Row */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 50))}
            disabled={isRunning}
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black disabled:bg-neutral-100"
            placeholder="Enter text..."
          />
          <div className="flex gap-1">
            <button
              onClick={() => setLabel(0)}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                label === 0
                  ? 'bg-red-100 border-2 border-red-400 text-red-700'
                  : 'border border-neutral-300 hover:bg-neutral-50'
              } disabled:opacity-50`}
            >
              Neg
            </button>
            <button
              onClick={() => setLabel(1)}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                label === 1
                  ? 'bg-green-100 border-2 border-green-400 text-green-700'
                  : 'border border-neutral-300 hover:bg-neutral-50'
              } disabled:opacity-50`}
            >
              Pos
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="flex gap-1 flex-wrap">
          {TRAINING_SET.slice(0, 4).map((ex, i) => (
            <button
              key={i}
              onClick={() => { setInputText(ex.text); setLabel(ex.label as 0 | 1); }}
              disabled={isRunning}
              className="text-xs px-2 py-1 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {ex.text}
            </button>
          ))}
        </div>

        {/* Tokenization Flow */}
        <TokenFlow
          text={inputText}
          tokens={tokens}
          tokenIds={tokenIds}
          embeddings={embeddings}
          features={features}
          stage={stage}
        />

        {/* Network Diagram */}
        <div className="flex justify-center">
          <NetworkDiagram
            config={config}
            weights={weights}
            forward={forward}
            gradients={gradients}
            stage={stage}
            highlightWeight={highlightWeight}
            updatingWeight={updatingWeight}
          />
        </div>

        {/* Detail Panel - shows math */}
        <div className="bg-neutral-50 rounded-lg p-3 min-h-[70px]">
          <DetailPanel
            stage={stage}
            forward={forward}
            gradients={gradients}
            loss={loss}
            label={label}
            highlightWeight={highlightWeight}
            updatingWeight={updatingWeight}
            weights={weights}
            oldWeightValue={oldWeightValue}
            newWeightValue={newWeightValue}
            config={config}
            tokens={tokens}
            tokenIds={tokenIds}
          />
        </div>

        {/* Charts */}
        <div className="flex gap-4 flex-wrap">
          <MiniChart data={lossHistory} color="#f59e0b" label="Loss" />
          <MiniChart data={accHistory} color="#3b82f6" label="Acc" />
        </div>

        {/* Training Log */}
        <TrainingLog logs={logs} />

        {/* Stage Indicator */}
        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1">
          {['tokenizing', 'numericalizing', 'embedding', 'forward-input', 'forward-hidden', 'forward-output', 'loss', 'backward-output', 'backward-hidden', 'update'].map((s, i) => {
            const stages: TrainingStage[] = ['tokenizing', 'numericalizing', 'embedding', 'forward-input', 'forward-hidden', 'forward-output', 'loss', 'backward-output', 'backward-hidden', 'update'];
            const currentIdx = stages.indexOf(stage);
            const thisIdx = stages.indexOf(s as TrainingStage);
            const isActive = s === stage;
            const isPast = thisIdx < currentIdx;
            const labels = ['Tok', 'Num', 'Emb', 'In', 'Hid', 'Out', 'Loss', '∇Out', '∇Hid', 'Upd'];

            return (
              <div key={s} className="flex items-center">
                <div className={`px-1.5 py-0.5 rounded text-[9px] font-medium whitespace-nowrap ${
                  isActive ? 'bg-black text-white' :
                  isPast ? 'bg-neutral-300 text-neutral-700' :
                  'bg-neutral-100 text-neutral-400'
                }`}>
                  {labels[i]}
                </div>
                {i < 9 && <div className={`w-1.5 h-0.5 ${isPast ? 'bg-neutral-400' : 'bg-neutral-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap pt-2 border-t border-neutral-200">
          <button
            onClick={() => { setMode('train'); doStep(); }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Step
          </button>
          <button
            onClick={() => { setMode('train'); trainFullStep(); }}
            disabled={isRunning}
            className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg text-sm font-semibold hover:bg-neutral-300 transition-colors disabled:opacity-50"
          >
            Train Full Step
          </button>
          <button
            onClick={train10Steps}
            disabled={isRunning}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            10x
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            Reset
          </button>
          <div className="w-px h-6 bg-neutral-300" />
          <button
            onClick={runGuess}
            disabled={isRunning}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Guess
          </button>

          {/* Config */}
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs">
            <label className="text-neutral-500">LR:</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.learningRate}
              onChange={(e) => handleConfigChange({ ...config, learningRate: parseFloat(e.target.value) })}
              disabled={isRunning}
              className="w-16"
            />
            <span className="font-mono w-6">{config.learningRate.toFixed(1)}</span>
          </div>
          <select
            value={config.activation}
            onChange={(e) => handleConfigChange({ ...config, activation: e.target.value as NetworkConfig['activation'] })}
            disabled={isRunning}
            className="text-xs px-2 py-1 border border-neutral-300 rounded bg-white"
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
          </select>
          <select
            value={config.hiddenDim}
            onChange={(e) => handleConfigChange({ ...config, hiddenDim: parseInt(e.target.value) })}
            disabled={isRunning}
            className="text-xs px-2 py-1 border border-neutral-300 rounded bg-white"
          >
            {[2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}h</option>
            ))}
          </select>
        </div>

        {/* Guess result */}
        {mode === 'guess' && forward && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-3 text-center ${
              forward.probs[1] > forward.probs[0]
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="text-sm">
              <span className="font-mono">&quot;{inputText.slice(0, 20)}{inputText.length > 20 ? '...' : ''}&quot;</span>
              {' '}guessed{' '}
              <span className={`font-bold ${forward.probs[1] > forward.probs[0] ? 'text-green-600' : 'text-red-600'}`}>
                {forward.probs[1] > forward.probs[0] ? 'positive' : 'negative'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function TrainingInteractiveMini({ className = '' }: { className?: string }) {
  return <TrainingInteractive className={className} />;
}
