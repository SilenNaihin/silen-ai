'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface GateState {
  forget: boolean;
  input: boolean;
  output: boolean;
}

interface TimeStep {
  x: number;
  f: number;
  i: number;
  g: number;
  o: number;
  c: number;
  h: number;
  cPrev: number;
  hPrev: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_SEQUENCE = [0.5, -0.3, 0.8, -0.1];

// Simplified LSTM weights for demonstration
const WEIGHTS = {
  Wf: 0.5,  // forget gate weight for x
  Uf: 0.3,  // forget gate weight for h
  bf: 0.1,  // forget gate bias
  Wi: 0.6,  // input gate weight for x
  Ui: 0.4,  // input gate weight for h
  bi: 0.0,  // input gate bias
  Wg: 0.7,  // candidate weight for x
  Ug: 0.5,  // candidate weight for h
  bg: 0.0,  // candidate bias
  Wo: 0.4,  // output gate weight for x
  Uo: 0.3,  // output gate weight for h
  bo: 0.2,  // output gate bias
};

// ============================================================================
// ACTIVATION FUNCTIONS
// ============================================================================

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.min(Math.max(x, -500), 500)));
}

function tanh(x: number): number {
  return Math.tanh(x);
}

// ============================================================================
// LSTM COMPUTATION
// ============================================================================

function computeLSTMStep(
  x: number,
  hPrev: number,
  cPrev: number,
  gates: GateState
): TimeStep {
  // Forget gate: f_t = sigmoid(Wf * x + Uf * h + bf)
  // When OFF: f_t = 1 (keep everything)
  const f_raw = sigmoid(WEIGHTS.Wf * x + WEIGHTS.Uf * hPrev + WEIGHTS.bf);
  const f = gates.forget ? f_raw : 1.0;

  // Input gate: i_t = sigmoid(Wi * x + Ui * h + bi)
  // When OFF: i_t = 0 (add nothing new)
  const i_raw = sigmoid(WEIGHTS.Wi * x + WEIGHTS.Ui * hPrev + WEIGHTS.bi);
  const i = gates.input ? i_raw : 0.0;

  // Candidate: g_t = tanh(Wg * x + Ug * h + bg)
  const g = tanh(WEIGHTS.Wg * x + WEIGHTS.Ug * hPrev + WEIGHTS.bg);

  // Output gate: o_t = sigmoid(Wo * x + Uo * h + bo)
  // When OFF: o_t = 1 (output everything)
  const o_raw = sigmoid(WEIGHTS.Wo * x + WEIGHTS.Uo * hPrev + WEIGHTS.bo);
  const o = gates.output ? o_raw : 1.0;

  // Cell state: c_t = f_t * c_{t-1} + i_t * g_t
  const c = f * cPrev + i * g;

  // Hidden state: h_t = o_t * tanh(c_t)
  const h = o * tanh(c);

  return { x, f, i, g, o, c, h, cPrev, hPrev };
}

function runLSTMSequence(sequence: number[], gates: GateState): TimeStep[] {
  const steps: TimeStep[] = [];
  let h = 0;
  let c = 0;

  for (const x of sequence) {
    const step = computeLSTMStep(x, h, c, gates);
    steps.push(step);
    h = step.h;
    c = step.c;
  }

  return steps;
}

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  color: string;
  description: string;
  offEffect: string;
}

function ToggleSwitch({ enabled, onChange, label, color, description, offEffect }: ToggleSwitchProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          enabled ? color : 'bg-neutral-300'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ left: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${enabled ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'}`}>
            {enabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="text-xs text-neutral-600 mt-0.5">{description}</p>
        {!enabled && (
          <p className="text-xs text-neutral-500 mt-1 italic">{offEffect}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MINI LINE CHART COMPONENT
// ============================================================================

interface MiniLineChartProps {
  data: number[];
  color: string;
  label: string;
  height?: number;
  showPoints?: boolean;
}

function MiniLineChart({ data, color, label, height = 60, showPoints = true }: MiniLineChartProps) {
  const width = 200;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  if (data.length === 0) return null;

  const min = Math.min(...data, -1);
  const max = Math.max(...data, 1);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = height - padding - ((v - min) / range) * chartHeight;
    return { x, y, value: v };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-medium text-neutral-500 mb-1">{label}</span>
      <svg width={width} height={height} className="bg-white rounded border border-neutral-200">
        {/* Grid lines */}
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e5e5e5" strokeDasharray="2,2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e5e5" />

        {/* Zero label */}
        <text x={padding - 8} y={height / 2 + 3} className="text-[8px] fill-neutral-400">0</text>

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {showPoints && points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={color} />
            <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[8px] fill-neutral-600 font-mono">
              {p.value.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Time step labels */}
        {points.map((p, i) => (
          <text key={`t${i}`} x={p.x} y={height - 5} textAnchor="middle" className="text-[8px] fill-neutral-400">
            t{i + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// LSTM CELL DIAGRAM COMPONENT
// ============================================================================

interface LSTMCellDiagramProps {
  step: TimeStep | null;
  gates: GateState;
  stepIndex: number;
}

function LSTMCellDiagram({ step, gates, stepIndex }: LSTMCellDiagramProps) {
  const width = 320;
  const height = 200;
  const centerX = width / 2;
  const centerY = height / 2;

  // Layout positions
  const cellStateY = 40;
  const hiddenStateY = 160;
  const gateY = 90;

  const forgetX = 60;
  const inputX = 130;
  const candidateX = 190;
  const outputX = 260;

  return (
    <svg width={width} height={height} className="bg-white">
      {/* Cell State Line (the highway) */}
      <g>
        <line x1={10} y1={cellStateY} x2={310} y2={cellStateY} stroke="#6366f1" strokeWidth="3" />
        {/* Arrow */}
        <polygon points={`310,${cellStateY} 302,${cellStateY - 5} 302,${cellStateY + 5}`} fill="#6366f1" />
        <text x={15} y={cellStateY - 10} className="text-[9px] fill-indigo-600 font-medium">Cell State</text>
        <text x={10} y={cellStateY + 15} className="text-[8px] fill-neutral-500">C_{stepIndex}</text>
        <text x={280} y={cellStateY + 15} className="text-[8px] fill-neutral-500">C_{stepIndex + 1}</text>
      </g>

      {/* Hidden State Line */}
      <g>
        <line x1={10} y1={hiddenStateY} x2={310} y2={hiddenStateY} stroke="#374151" strokeWidth="2" />
        <polygon points={`310,${hiddenStateY} 302,${hiddenStateY - 4} 302,${hiddenStateY + 4}`} fill="#374151" />
        <text x={15} y={hiddenStateY - 8} className="text-[9px] fill-neutral-600 font-medium">Hidden State</text>
      </g>

      {/* Input x_t */}
      <g>
        <text x={centerX} y={height - 5} textAnchor="middle" className="text-[10px] fill-neutral-600 font-mono">
          x = {step?.x.toFixed(2) ?? '?'}
        </text>
        <line x1={centerX} y1={height - 15} x2={centerX} y2={130} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
      </g>

      {/* Forget Gate */}
      <g>
        <rect
          x={forgetX - 20}
          y={gateY - 18}
          width={40}
          height={36}
          rx={4}
          fill={gates.forget ? '#fef2f2' : '#f5f5f5'}
          stroke={gates.forget ? '#ef4444' : '#d4d4d4'}
          strokeWidth={gates.forget ? 2 : 1}
        />
        <text x={forgetX} y={gateY - 3} textAnchor="middle" className="text-[10px] fill-neutral-800 font-medium">Forget</text>
        <text x={forgetX} y={gateY + 10} textAnchor="middle" className={`text-[9px] font-mono ${gates.forget ? 'fill-red-600' : 'fill-neutral-400'}`}>
          f={step?.f.toFixed(2) ?? '?'}
        </text>
        {/* Connection to cell state */}
        <line x1={forgetX} y1={gateY - 18} x2={forgetX} y2={cellStateY + 8} stroke={gates.forget ? '#ef4444' : '#d4d4d4'} strokeWidth="1.5" />
        <circle cx={forgetX} cy={cellStateY} r={8} fill="white" stroke={gates.forget ? '#ef4444' : '#d4d4d4'} strokeWidth="1.5" />
        <text x={forgetX} y={cellStateY + 4} textAnchor="middle" className="text-[10px] fill-neutral-600">x</text>
      </g>

      {/* Input Gate */}
      <g>
        <rect
          x={inputX - 20}
          y={gateY - 18}
          width={40}
          height={36}
          rx={4}
          fill={gates.input ? '#f0fdf4' : '#f5f5f5'}
          stroke={gates.input ? '#22c55e' : '#d4d4d4'}
          strokeWidth={gates.input ? 2 : 1}
        />
        <text x={inputX} y={gateY - 3} textAnchor="middle" className="text-[10px] fill-neutral-800 font-medium">Input</text>
        <text x={inputX} y={gateY + 10} textAnchor="middle" className={`text-[9px] font-mono ${gates.input ? 'fill-green-600' : 'fill-neutral-400'}`}>
          i={step?.i.toFixed(2) ?? '?'}
        </text>
      </g>

      {/* Candidate (always computed, but scaled by input gate) */}
      <g>
        <rect
          x={candidateX - 20}
          y={gateY - 18}
          width={40}
          height={36}
          rx={4}
          fill={gates.input ? '#fefce8' : '#f5f5f5'}
          stroke={gates.input ? '#eab308' : '#d4d4d4'}
          strokeWidth={gates.input ? 2 : 1}
        />
        <text x={candidateX} y={gateY - 3} textAnchor="middle" className="text-[10px] fill-neutral-800 font-medium">Cand.</text>
        <text x={candidateX} y={gateY + 10} textAnchor="middle" className={`text-[9px] font-mono ${gates.input ? 'fill-yellow-600' : 'fill-neutral-400'}`}>
          g={step?.g.toFixed(2) ?? '?'}
        </text>
        {/* Connection lines for input gate * candidate */}
        <line x1={inputX + 20} y1={gateY} x2={inputX + 30} y2={gateY} stroke={gates.input ? '#22c55e' : '#d4d4d4'} strokeWidth="1" />
        <line x1={inputX + 30} y1={gateY} x2={inputX + 30} y2={cellStateY + 20} stroke={gates.input ? '#22c55e' : '#d4d4d4'} strokeWidth="1" />
        <line x1={candidateX} y1={gateY - 18} x2={candidateX} y2={cellStateY + 20} stroke={gates.input ? '#eab308' : '#d4d4d4'} strokeWidth="1" />
        {/* Add circle on cell state */}
        <circle cx={(inputX + candidateX) / 2 + 15} cy={cellStateY} r={8} fill="white" stroke={gates.input ? '#22c55e' : '#d4d4d4'} strokeWidth="1.5" />
        <text x={(inputX + candidateX) / 2 + 15} y={cellStateY + 4} textAnchor="middle" className="text-[10px] fill-neutral-600">+</text>
      </g>

      {/* Output Gate */}
      <g>
        <rect
          x={outputX - 20}
          y={gateY - 18}
          width={40}
          height={36}
          rx={4}
          fill={gates.output ? '#eff6ff' : '#f5f5f5'}
          stroke={gates.output ? '#3b82f6' : '#d4d4d4'}
          strokeWidth={gates.output ? 2 : 1}
        />
        <text x={outputX} y={gateY - 3} textAnchor="middle" className="text-[10px] fill-neutral-800 font-medium">Output</text>
        <text x={outputX} y={gateY + 10} textAnchor="middle" className={`text-[9px] font-mono ${gates.output ? 'fill-blue-600' : 'fill-neutral-400'}`}>
          o={step?.o.toFixed(2) ?? '?'}
        </text>
        {/* Connection from cell state through tanh to output */}
        <line x1={outputX - 30} y1={cellStateY} x2={outputX - 30} y2={hiddenStateY - 25} stroke="#6366f1" strokeWidth="1.5" />
        <rect x={outputX - 45} y={hiddenStateY - 45} width={30} height={18} rx={3} fill="#f5f5f5" stroke="#9ca3af" />
        <text x={outputX - 30} y={hiddenStateY - 32} textAnchor="middle" className="text-[8px] fill-neutral-600">tanh</text>
        <line x1={outputX - 30} y1={hiddenStateY - 27} x2={outputX - 30} y2={hiddenStateY - 10} stroke="#9ca3af" strokeWidth="1" />
        <line x1={outputX} y1={gateY + 18} x2={outputX} y2={hiddenStateY - 10} stroke={gates.output ? '#3b82f6' : '#d4d4d4'} strokeWidth="1.5" />
        {/* Multiply circle */}
        <circle cx={outputX - 15} cy={hiddenStateY - 10} r={8} fill="white" stroke={gates.output ? '#3b82f6' : '#d4d4d4'} strokeWidth="1.5" />
        <text x={outputX - 15} y={hiddenStateY - 6} textAnchor="middle" className="text-[10px] fill-neutral-600">x</text>
      </g>

      {/* Current cell and hidden state values */}
      {step && (
        <g>
          <rect x={270} y={cellStateY - 12} width={35} height={18} rx={3} fill="#eef2ff" stroke="#6366f1" />
          <text x={287} y={cellStateY + 1} textAnchor="middle" className="text-[9px] fill-indigo-700 font-mono font-medium">
            {step.c.toFixed(2)}
          </text>

          <rect x={270} y={hiddenStateY - 20} width={35} height={18} rx={3} fill="#f3f4f6" stroke="#374151" />
          <text x={287} y={hiddenStateY - 7} textAnchor="middle" className="text-[9px] fill-neutral-700 font-mono font-medium">
            {step.h.toFixed(2)}
          </text>
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// COMPARISON DISPLAY COMPONENT
// ============================================================================

interface ComparisonProps {
  beforeSteps: TimeStep[];
  afterSteps: TimeStep[];
  changedGate: keyof GateState | null;
}

function ComparisonDisplay({ beforeSteps, afterSteps, changedGate }: ComparisonProps) {
  if (!changedGate || beforeSteps.length === 0 || afterSteps.length === 0) return null;

  const gateLabels: Record<keyof GateState, string> = {
    forget: 'Forget Gate',
    input: 'Input Gate',
    output: 'Output Gate',
  };

  const gateColors: Record<keyof GateState, string> = {
    forget: '#ef4444',
    input: '#22c55e',
    output: '#3b82f6',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
    >
      <div className="text-xs font-medium text-neutral-600 mb-2">
        Effect of toggling <span style={{ color: gateColors[changedGate] }}>{gateLabels[changedGate]}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-[10px]">
        <div>
          <div className="font-medium text-neutral-500 mb-1">Before</div>
          <div className="space-y-1 font-mono">
            {beforeSteps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-neutral-400">t{i + 1}:</span>
                <span className="text-indigo-600">c={s.c.toFixed(3)}</span>
                <span className="text-neutral-600">h={s.h.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium text-neutral-500 mb-1">After</div>
          <div className="space-y-1 font-mono">
            {afterSteps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-neutral-400">t{i + 1}:</span>
                <span className="text-indigo-600">c={s.c.toFixed(3)}</span>
                <span className="text-neutral-600">h={s.h.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LSTMBuildupInteractive({ className = '' }: { className?: string }) {
  // Gate states
  const [gates, setGates] = useState<GateState>({
    forget: true,
    input: true,
    output: true,
  });

  // For before/after comparison
  const [previousSteps, setPreviousSteps] = useState<TimeStep[]>([]);
  const [changedGate, setChangedGate] = useState<keyof GateState | null>(null);

  // Current step being viewed
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Compute LSTM outputs
  const steps = useMemo(() => runLSTMSequence(DEFAULT_SEQUENCE, gates), [gates]);

  // Extract data for charts
  const cellStates = useMemo(() => steps.map(s => s.c), [steps]);
  const hiddenStates = useMemo(() => steps.map(s => s.h), [steps]);

  // Gate toggle handler with comparison tracking
  const handleGateToggle = useCallback((gate: keyof GateState, enabled: boolean) => {
    setPreviousSteps(steps);
    setChangedGate(gate);
    setGates(prev => ({ ...prev, [gate]: enabled }));

    // Clear comparison after a few seconds
    setTimeout(() => {
      setChangedGate(null);
      setPreviousSteps([]);
    }, 5000);
  }, [steps]);

  const currentStep = steps[currentStepIndex] ?? null;

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2">
        <h3 className="text-sm font-bold">LSTM Gate Explorer</h3>
        <p className="text-[10px] text-neutral-500">
          Toggle gates ON/OFF to see how they control information flow
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Input Sequence Display */}
        <div className="bg-neutral-50 rounded-lg p-3">
          <div className="text-xs font-medium text-neutral-600 mb-2">Input Sequence</div>
          <div className="flex gap-2 items-center">
            {DEFAULT_SEQUENCE.map((x, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-all ${
                  currentStepIndex === i
                    ? 'bg-black text-white'
                    : 'bg-white border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                x<sub>{i + 1}</sub> = {x}
              </button>
            ))}
          </div>
        </div>

        {/* Gate Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ToggleSwitch
            enabled={gates.forget}
            onChange={(v) => handleGateToggle('forget', v)}
            label="Forget Gate"
            color="bg-red-500"
            description="Controls what to remove from cell state"
            offEffect="f=1: Keeps everything (no forgetting)"
          />
          <ToggleSwitch
            enabled={gates.input}
            onChange={(v) => handleGateToggle('input', v)}
            label="Input Gate"
            color="bg-green-500"
            description="Controls what new info to add to cell state"
            offEffect="i=0: Adds nothing new"
          />
          <ToggleSwitch
            enabled={gates.output}
            onChange={(v) => handleGateToggle('output', v)}
            label="Output Gate"
            color="bg-blue-500"
            description="Controls what to output from cell state"
            offEffect="o=1: Outputs everything (no filtering)"
          />
        </div>

        {/* LSTM Cell Diagram */}
        <div className="flex justify-center">
          <LSTMCellDiagram
            step={currentStep}
            gates={gates}
            stepIndex={currentStepIndex}
          />
        </div>

        {/* State Evolution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiniLineChart
            data={cellStates}
            color="#6366f1"
            label="Cell State (C) Evolution"
          />
          <MiniLineChart
            data={hiddenStates}
            color="#374151"
            label="Hidden State (h) Evolution"
          />
        </div>

        {/* Before/After Comparison */}
        <AnimatePresence>
          {changedGate && (
            <ComparisonDisplay
              beforeSteps={previousSteps}
              afterSteps={steps}
              changedGate={changedGate}
            />
          )}
        </AnimatePresence>

        {/* Detailed Step Values */}
        <div className="bg-neutral-50 rounded-lg p-3">
          <div className="text-xs font-medium text-neutral-600 mb-2">
            Step-by-Step Values
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="text-neutral-500">
                  <th className="text-left px-2 py-1">Step</th>
                  <th className="text-left px-2 py-1">x</th>
                  <th className="text-left px-2 py-1 text-red-600">f</th>
                  <th className="text-left px-2 py-1 text-green-600">i</th>
                  <th className="text-left px-2 py-1 text-yellow-600">g</th>
                  <th className="text-left px-2 py-1 text-blue-600">o</th>
                  <th className="text-left px-2 py-1 text-indigo-600">C</th>
                  <th className="text-left px-2 py-1">h</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, i) => (
                  <tr
                    key={i}
                    className={`${currentStepIndex === i ? 'bg-blue-50' : ''} hover:bg-neutral-100 cursor-pointer`}
                    onClick={() => setCurrentStepIndex(i)}
                  >
                    <td className="px-2 py-1 font-semibold">t{i + 1}</td>
                    <td className="px-2 py-1">{step.x.toFixed(2)}</td>
                    <td className={`px-2 py-1 ${gates.forget ? 'text-red-600' : 'text-neutral-400'}`}>
                      {step.f.toFixed(3)}
                    </td>
                    <td className={`px-2 py-1 ${gates.input ? 'text-green-600' : 'text-neutral-400'}`}>
                      {step.i.toFixed(3)}
                    </td>
                    <td className={`px-2 py-1 ${gates.input ? 'text-yellow-600' : 'text-neutral-400'}`}>
                      {step.g.toFixed(3)}
                    </td>
                    <td className={`px-2 py-1 ${gates.output ? 'text-blue-600' : 'text-neutral-400'}`}>
                      {step.o.toFixed(3)}
                    </td>
                    <td className="px-2 py-1 text-indigo-600 font-semibold">{step.c.toFixed(3)}</td>
                    <td className="px-2 py-1 font-semibold">{step.h.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="text-xs text-neutral-600 space-y-2 bg-neutral-50 rounded-lg p-3">
          <p className="font-medium">How LSTM Gates Work:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>
              <span className="text-red-600 font-medium">Forget Gate (f)</span>: Decides what to throw away from the cell state.
              C<sub>new</sub> = f * C<sub>old</sub> + ...
            </li>
            <li>
              <span className="text-green-600 font-medium">Input Gate (i)</span>: Decides what new information to store.
              Combined with candidate (g) to update cell state: ... + i * g
            </li>
            <li>
              <span className="text-blue-600 font-medium">Output Gate (o)</span>: Decides what parts of the cell state to output.
              h = o * tanh(C)
            </li>
          </ul>
          <p className="text-neutral-500 italic mt-2">
            Toggle gates OFF to see their effect. The cell state acts as a "memory highway" that can
            carry information across many time steps without degradation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LSTMBuildupInteractive;
