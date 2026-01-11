'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

type NetworkMode = 'RNN' | 'LSTM';

interface GradientData {
  timestep: number;
  magnitude: number;
  isVanishing: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RNN_DECAY_FACTOR = 0.8;
const LSTM_DECAY_FACTOR = 0.98;
const VANISHING_THRESHOLD = 0.01;
const MIN_SEQUENCE_LENGTH = 5;
const MAX_SEQUENCE_LENGTH = 50;

// ============================================================================
// GRADIENT COMPUTATION
// ============================================================================

function computeGradients(sequenceLength: number, mode: NetworkMode): GradientData[] {
  const decayFactor = mode === 'RNN' ? RNN_DECAY_FACTOR : LSTM_DECAY_FACTOR;
  const gradients: GradientData[] = [];

  for (let t = 0; t < sequenceLength; t++) {
    // Gradient at timestep t when backpropagating from the end (T-1)
    // gradient[t] = decay_factor^(T - 1 - t)
    const stepsBack = sequenceLength - 1 - t;
    const magnitude = Math.pow(decayFactor, stepsBack);

    gradients.push({
      timestep: t,
      magnitude,
      isVanishing: magnitude < VANISHING_THRESHOLD,
    });
  }

  return gradients;
}

// ============================================================================
// NETWORK DIAGRAM COMPONENT
// ============================================================================

interface NetworkDiagramProps {
  sequenceLength: number;
  mode: NetworkMode;
  gradients: GradientData[];
  animationKey: number;
}

function NetworkDiagram({ sequenceLength, mode, gradients, animationKey }: NetworkDiagramProps) {
  // Limit displayed timesteps for visual clarity
  const maxDisplayedSteps = Math.min(sequenceLength, 20);
  const displayedGradients = gradients.slice(0, maxDisplayedSteps);
  const hasMoreSteps = sequenceLength > maxDisplayedSteps;

  const width = 600;
  const height = 100;
  const padding = 30;
  const availableWidth = width - 2 * padding;

  const boxWidth = Math.min(24, availableWidth / maxDisplayedSteps - 4);
  const boxHeight = 32;
  const spacing = availableWidth / maxDisplayedSteps;

  return (
    <svg width={width} height={height} className="bg-white rounded-lg border border-neutral-200">
      {/* Timestep boxes */}
      {displayedGradients.map((grad, i) => {
        const x = padding + i * spacing;
        const y = (height - boxHeight) / 2;

        // Color based on gradient health
        const fillColor = grad.isVanishing
          ? '#fef2f2' // Red tint for vanishing
          : '#f0fdf4'; // Green tint for healthy

        const strokeColor = grad.isVanishing
          ? '#dc2626' // Red border
          : '#16a34a'; // Green border

        const opacity = Math.max(0.3, grad.magnitude);

        return (
          <g key={i}>
            {/* Connection line to next box */}
            {i < displayedGradients.length - 1 && (
              <motion.line
                x1={x + boxWidth}
                y1={height / 2}
                x2={x + spacing}
                y2={height / 2}
                stroke={mode === 'RNN' ? '#94a3b8' : '#60a5fa'}
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.02, duration: 0.1 }}
              />
            )}

            {/* Timestep box */}
            <motion.rect
              x={x}
              y={y}
              width={boxWidth}
              height={boxHeight}
              rx={4}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={1.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity }}
              transition={{ delay: i * 0.02, duration: 0.15 }}
            />

            {/* Timestep label */}
            <text
              x={x + boxWidth / 2}
              y={y + boxHeight / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-mono fill-neutral-600"
            >
              t{i}
            </text>

            {/* Hidden state indicator */}
            <motion.circle
              cx={x + boxWidth / 2}
              cy={y - 6}
              r={3}
              fill={mode === 'LSTM' ? '#3b82f6' : '#9ca3af'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 + 0.05 }}
            />
          </g>
        );
      })}

      {/* Ellipsis for truncated sequences */}
      {hasMoreSteps && (
        <text
          x={width - padding + 10}
          y={height / 2}
          textAnchor="start"
          dominantBaseline="middle"
          className="text-sm fill-neutral-400"
        >
          ...+{sequenceLength - maxDisplayedSteps}
        </text>
      )}

      {/* Labels */}
      <text x={padding} y={height - 8} className="text-[10px] fill-neutral-400">
        Input (t=0)
      </text>
      <text x={width - padding} y={height - 8} textAnchor="end" className="text-[10px] fill-neutral-400">
        Output (t={sequenceLength - 1})
      </text>
    </svg>
  );
}

// ============================================================================
// GRADIENT BAR CHART COMPONENT
// ============================================================================

interface GradientBarChartProps {
  gradients: GradientData[];
  mode: NetworkMode;
  animationKey: number;
}

function GradientBarChart({ gradients, mode, animationKey }: GradientBarChartProps) {
  // Limit displayed bars for visual clarity
  const maxDisplayedBars = Math.min(gradients.length, 30);
  const displayedGradients = gradients.slice(0, maxDisplayedBars);
  const hasMoreBars = gradients.length > maxDisplayedBars;

  const width = 600;
  const height = 160;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barWidth = Math.min(16, chartWidth / maxDisplayedBars - 2);
  const barSpacing = chartWidth / maxDisplayedBars;

  // Find first vanishing gradient for annotation
  const firstVanishingIdx = displayedGradients.findIndex(g => g.isVanishing);

  return (
    <svg width={width} height={height} className="bg-white rounded-lg border border-neutral-200">
      {/* Y-axis */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
        strokeWidth={1}
      />

      {/* X-axis */}
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
        strokeWidth={1}
      />

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((val, i) => (
        <g key={i}>
          <text
            x={padding.left - 8}
            y={height - padding.bottom - val * chartHeight}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-[9px] font-mono fill-neutral-400"
          >
            {val.toFixed(2)}
          </text>
          <line
            x1={padding.left}
            y1={height - padding.bottom - val * chartHeight}
            x2={width - padding.right}
            y2={height - padding.bottom - val * chartHeight}
            stroke="#f3f4f6"
            strokeWidth={1}
            strokeDasharray={val === 0 ? '' : '2,2'}
          />
        </g>
      ))}

      {/* Vanishing threshold line */}
      <line
        x1={padding.left}
        y1={height - padding.bottom - VANISHING_THRESHOLD * chartHeight}
        x2={width - padding.right}
        y2={height - padding.bottom - VANISHING_THRESHOLD * chartHeight}
        stroke="#dc2626"
        strokeWidth={1}
        strokeDasharray="4,4"
      />
      <text
        x={width - padding.right + 4}
        y={height - padding.bottom - VANISHING_THRESHOLD * chartHeight}
        dominantBaseline="middle"
        className="text-[8px] fill-red-500"
      >
        0.01
      </text>

      {/* Gradient bars */}
      {displayedGradients.map((grad, i) => {
        const x = Math.round(padding.left + i * barSpacing + (barSpacing - barWidth) / 2);
        const barHeight = Math.round(grad.magnitude * chartHeight * 100) / 100;
        const y = Math.round((height - padding.bottom - barHeight) * 100) / 100;

        // Color gradient from green to red
        const fillColor = grad.isVanishing
          ? '#dc2626' // Red for vanishing
          : grad.magnitude > 0.5
          ? '#16a34a' // Green for healthy
          : '#f59e0b'; // Amber for degraded

        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill={fillColor}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.015, duration: 0.2, ease: 'easeOut' }}
              style={{ transformOrigin: `${x + barWidth / 2}px ${height - padding.bottom}px` }}
            />

            {/* X-axis label (show every few) */}
            {(i % Math.ceil(maxDisplayedBars / 10) === 0 || i === displayedGradients.length - 1) && (
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 12}
                textAnchor="middle"
                className="text-[8px] font-mono fill-neutral-400"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}

      {/* Annotation for first vanishing gradient */}
      {firstVanishingIdx !== -1 && firstVanishingIdx < maxDisplayedBars && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <line
            x1={padding.left + firstVanishingIdx * barSpacing + barWidth / 2}
            y1={padding.top}
            x2={padding.left + firstVanishingIdx * barSpacing + barWidth / 2}
            y2={padding.top + 15}
            stroke="#dc2626"
            strokeWidth={1}
          />
          <text
            x={padding.left + firstVanishingIdx * barSpacing + barWidth / 2}
            y={padding.top - 4}
            textAnchor="middle"
            className="text-[9px] fill-red-600 font-medium"
          >
            Vanishing at t={firstVanishingIdx}
          </text>
        </motion.g>
      )}

      {/* Ellipsis indicator */}
      {hasMoreBars && (
        <text
          x={width - padding.right - 5}
          y={height - padding.bottom - 20}
          textAnchor="end"
          className="text-[10px] fill-neutral-400"
        >
          ...
        </text>
      )}

      {/* Axis labels */}
      <text
        x={padding.left - 35}
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90, ${padding.left - 35}, ${height / 2})`}
        className="text-[10px] fill-neutral-500"
      >
        Gradient Magnitude
      </text>
      <text
        x={width / 2}
        y={height - 8}
        textAnchor="middle"
        className="text-[10px] fill-neutral-500"
      >
        Timestep (backpropagating from end)
      </text>
    </svg>
  );
}

// ============================================================================
// MODE TOGGLE COMPONENT
// ============================================================================

interface ModeToggleProps {
  mode: NetworkMode;
  onChange: (mode: NetworkMode) => void;
}

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 p-1 bg-neutral-50">
      <button
        onClick={() => onChange('RNN')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          mode === 'RNN'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        RNN
      </button>
      <button
        onClick={() => onChange('LSTM')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          mode === 'LSTM'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        LSTM
      </button>
    </div>
  );
}

// ============================================================================
// STATS DISPLAY COMPONENT
// ============================================================================

interface StatsDisplayProps {
  gradients: GradientData[];
  mode: NetworkMode;
  sequenceLength: number;
}

function StatsDisplay({ gradients, mode, sequenceLength }: StatsDisplayProps) {
  const firstGradient = gradients[0]?.magnitude ?? 1;
  const lastGradient = gradients[gradients.length - 1]?.magnitude ?? 1;
  const vanishingCount = gradients.filter(g => g.isVanishing).length;
  const firstVanishingIdx = gradients.findIndex(g => g.isVanishing);

  const isHealthy = vanishingCount === 0;
  const ratio = firstGradient / lastGradient;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Gradient at first timestep */}
      <div className={`rounded-lg p-3 ${
        firstGradient < VANISHING_THRESHOLD ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="text-[10px] uppercase font-medium text-neutral-500 mb-1">
          Gradient at t=0
        </div>
        <div className={`text-lg font-mono font-bold ${
          firstGradient < VANISHING_THRESHOLD ? 'text-red-600' : 'text-green-600'
        }`}>
          {firstGradient < 0.0001 ? firstGradient.toExponential(2) : firstGradient.toFixed(4)}
        </div>
        {firstGradient < VANISHING_THRESHOLD && (
          <div className="text-[10px] text-red-600 mt-1 font-medium">
            Effectively zero!
          </div>
        )}
      </div>

      {/* Decay ratio */}
      <div className="rounded-lg p-3 bg-neutral-50 border border-neutral-200">
        <div className="text-[10px] uppercase font-medium text-neutral-500 mb-1">
          Signal Ratio
        </div>
        <div className="text-lg font-mono font-bold text-neutral-800">
          {ratio > 1000 ? ratio.toExponential(1) : ratio.toFixed(1)}x
        </div>
        <div className="text-[10px] text-neutral-500 mt-1">
          loss to start
        </div>
      </div>

      {/* Vanishing timesteps */}
      <div className={`rounded-lg p-3 ${
        vanishingCount > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="text-[10px] uppercase font-medium text-neutral-500 mb-1">
          Vanishing Timesteps
        </div>
        <div className={`text-lg font-mono font-bold ${
          vanishingCount > 0 ? 'text-amber-600' : 'text-green-600'
        }`}>
          {vanishingCount} / {sequenceLength}
        </div>
        {firstVanishingIdx !== -1 && (
          <div className="text-[10px] text-amber-600 mt-1">
            First at t={firstVanishingIdx}
          </div>
        )}
      </div>

      {/* Health status */}
      <div className={`rounded-lg p-3 ${
        isHealthy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="text-[10px] uppercase font-medium text-neutral-500 mb-1">
          Gradient Health
        </div>
        <div className={`text-lg font-bold ${
          isHealthy ? 'text-green-600' : 'text-red-600'
        }`}>
          {isHealthy ? 'Healthy' : 'Vanishing'}
        </div>
        <div className="text-[10px] text-neutral-500 mt-1">
          decay: {mode === 'RNN' ? RNN_DECAY_FACTOR : LSTM_DECAY_FACTOR}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPLANATION PANEL
// ============================================================================

interface ExplanationPanelProps {
  mode: NetworkMode;
  sequenceLength: number;
  firstGradient: number;
}

function ExplanationPanel({ mode, sequenceLength, firstGradient }: ExplanationPanelProps) {
  const decayFactor = mode === 'RNN' ? RNN_DECAY_FACTOR : LSTM_DECAY_FACTOR;
  const stepsBack = sequenceLength - 1;

  return (
    <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
      <div className="text-xs text-neutral-500 uppercase font-medium">
        Gradient Computation
      </div>
      <div className="font-mono text-sm space-y-1">
        <div>
          <span className="text-neutral-500">Mode:</span>{' '}
          <span className="font-bold">{mode}</span>
          {' '}(decay factor = {decayFactor})
        </div>
        <div>
          <span className="text-neutral-500">Gradient at t=0:</span>{' '}
          {decayFactor}<sup>{stepsBack}</sup> ={' '}
          <span className={`font-bold ${firstGradient < VANISHING_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
            {firstGradient < 0.0001 ? firstGradient.toExponential(3) : firstGradient.toFixed(6)}
          </span>
        </div>
      </div>
      <div className="text-xs text-neutral-500 mt-2">
        {mode === 'RNN' ? (
          <>
            In vanilla RNNs, gradients multiply by ~{RNN_DECAY_FACTOR} at each timestep during backprop.
            Over {sequenceLength} steps, the gradient shrinks to {decayFactor}<sup>{stepsBack}</sup>,
            making it nearly impossible to learn long-range dependencies.
          </>
        ) : (
          <>
            LSTMs use gating mechanisms (forget, input, output gates) that allow gradients to flow
            with minimal decay (~{LSTM_DECAY_FACTOR} per step). This preserves gradient signal
            even over {sequenceLength} timesteps, enabling learning of long-range patterns.
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GradientFlowInteractive({ className = '' }: { className?: string }) {
  const [sequenceLength, setSequenceLength] = useState(20);
  const [mode, setMode] = useState<NetworkMode>('RNN');
  const [animationKey, setAnimationKey] = useState(0);

  // Compute gradients
  const gradients = useMemo(() => {
    return computeGradients(sequenceLength, mode);
  }, [sequenceLength, mode]);

  // Trigger animation on parameter change
  useEffect(() => {
    setAnimationKey(k => k + 1);
  }, [sequenceLength, mode]);

  const firstGradient = gradients[0]?.magnitude ?? 1;
  const hasVanishing = gradients.some(g => g.isVanishing);

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Gradient Flow: RNN vs LSTM</h3>
          <p className="text-[10px] text-neutral-500">
            See how gradients vanish in RNNs but persist in LSTMs
          </p>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="p-4 space-y-4">
        {/* Sequence Length Slider */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-neutral-700 w-32">
            Sequence Length:
          </label>
          <input
            type="range"
            min={MIN_SEQUENCE_LENGTH}
            max={MAX_SEQUENCE_LENGTH}
            value={sequenceLength}
            onChange={(e) => setSequenceLength(parseInt(e.target.value))}
            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="w-16 text-right">
            <span className="font-mono font-bold text-lg">{sequenceLength}</span>
            <span className="text-xs text-neutral-500 ml-1">steps</span>
          </div>
        </div>

        {/* Warning Banner */}
        <AnimatePresence mode="wait">
          {hasVanishing && mode === 'RNN' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-lg font-bold">!</span>
              </div>
              <div>
                <div className="text-sm font-medium text-red-800">
                  Vanishing Gradient Problem Detected
                </div>
                <div className="text-xs text-red-600">
                  Gradients at early timesteps are below 0.01, making learning nearly impossible.
                  Try switching to LSTM to see the difference.
                </div>
              </div>
            </motion.div>
          )}
          {!hasVanishing && mode === 'LSTM' && sequenceLength >= 20 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-lg font-bold">+</span>
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">
                  Healthy Gradient Flow
                </div>
                <div className="text-xs text-green-600">
                  LSTM gates preserve gradient signal even over {sequenceLength} timesteps.
                  The network can learn long-range dependencies.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network Diagram */}
        <div>
          <div className="text-xs font-medium text-neutral-500 mb-2 uppercase">
            Network Architecture (Unrolled)
          </div>
          <div className="flex justify-center overflow-x-auto">
            <NetworkDiagram
              sequenceLength={sequenceLength}
              mode={mode}
              gradients={gradients}
              animationKey={animationKey}
            />
          </div>
        </div>

        {/* Gradient Bar Chart */}
        <div>
          <div className="text-xs font-medium text-neutral-500 mb-2 uppercase">
            Gradient Magnitude at Each Timestep
          </div>
          <div className="flex justify-center overflow-x-auto">
            <GradientBarChart
              gradients={gradients}
              mode={mode}
              animationKey={animationKey}
            />
          </div>
        </div>

        {/* Stats Display */}
        <StatsDisplay
          gradients={gradients}
          mode={mode}
          sequenceLength={sequenceLength}
        />

        {/* Explanation Panel */}
        <ExplanationPanel
          mode={mode}
          sequenceLength={sequenceLength}
          firstGradient={firstGradient}
        />

        {/* Mode Comparison */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
          <div className={`rounded-lg p-3 ${mode === 'RNN' ? 'ring-2 ring-black' : 'bg-neutral-50'}`}>
            <div className="text-sm font-bold mb-1">Vanilla RNN</div>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>- Simple hidden state: h = tanh(Wx + Uh_prev)</li>
              <li>- Gradient multiplied by ~0.8 per step</li>
              <li>- Vanishes exponentially with sequence length</li>
              <li>- Struggles with dependencies beyond ~10 steps</li>
            </ul>
          </div>
          <div className={`rounded-lg p-3 ${mode === 'LSTM' ? 'ring-2 ring-black' : 'bg-neutral-50'}`}>
            <div className="text-sm font-bold mb-1">LSTM</div>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>- Cell state with additive updates</li>
              <li>- Forget gate controls information flow</li>
              <li>- Gradient multiplied by ~0.98 per step</li>
              <li>- Can learn dependencies over 100+ steps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradientFlowInteractive;
