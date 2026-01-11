'use client';

import { useState, useMemo } from 'react';

interface NodeValue {
  value: number;
  gradient: number;
}

/**
 * Interactive Chain Rule Visualization
 *
 * Shows a simple 3-layer computation graph where users can adjust
 * input values and see how gradients flow backwards via chain rule.
 *
 * Computation: x → h = wx → y = sigmoid(h) → L = (y - target)²
 */
export function ChainRuleInteractive() {
  const [x, setX] = useState(2.0);
  const [w, setW] = useState(0.5);
  const [target] = useState(0.8);

  // Forward pass
  const h = x * w;
  const y = 1 / (1 + Math.exp(-h)); // sigmoid
  const loss = Math.pow(y - target, 2);

  // Backward pass - chain rule
  const dL_dy = 2 * (y - target); // ∂L/∂y
  const dy_dh = y * (1 - y); // ∂y/∂h (sigmoid derivative)
  const dh_dw = x; // ∂h/∂w
  const dh_dx = w; // ∂h/∂x

  // Chain rule: ∂L/∂w = ∂L/∂y × ∂y/∂h × ∂h/∂w
  const dL_dh = dL_dy * dy_dh;
  const dL_dw = dL_dh * dh_dw;
  const dL_dx = dL_dh * dh_dx;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="text-sm font-bold mb-4 text-center">
        Interactive Chain Rule
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Input x = {x.toFixed(2)}
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={x}
            onChange={(e) => setX(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Weight w = {w.toFixed(2)}
          </label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>
      </div>

      {/* Computation Graph */}
      <div className="relative h-48 mb-6">
        <svg viewBox="0 0 400 160" className="w-full h-full">
          {/* Forward pass arrows */}
          <defs>
            <marker
              id="arrow-forward"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            <marker
              id="arrow-backward"
              markerWidth="10"
              markerHeight="7"
              refX="1"
              refY="3.5"
              orient="auto"
            >
              <polygon points="10 0, 0 3.5, 10 7" fill="#dc2626" />
            </marker>
          </defs>

          {/* Nodes */}
          {/* x node */}
          <circle cx="50" cy="60" r="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" className="text-sm font-bold fill-blue-700">x</text>
          <text x="50" y="72" textAnchor="middle" className="text-xs fill-blue-600">{x.toFixed(2)}</text>

          {/* w label */}
          <text x="105" y="45" textAnchor="middle" className="text-xs fill-green-700 font-medium">×w={w.toFixed(2)}</text>

          {/* h node */}
          <circle cx="160" cy="60" r="25" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
          <text x="160" y="55" textAnchor="middle" className="text-sm font-bold fill-green-700">h</text>
          <text x="160" y="72" textAnchor="middle" className="text-xs fill-green-600">{h.toFixed(2)}</text>

          {/* sigmoid label */}
          <text x="215" y="45" textAnchor="middle" className="text-xs fill-purple-700 font-medium">σ(h)</text>

          {/* y node */}
          <circle cx="270" cy="60" r="25" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
          <text x="270" y="55" textAnchor="middle" className="text-sm font-bold fill-purple-700">y</text>
          <text x="270" y="72" textAnchor="middle" className="text-xs fill-purple-600">{y.toFixed(3)}</text>

          {/* L node */}
          <circle cx="350" cy="60" r="25" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="350" y="55" textAnchor="middle" className="text-sm font-bold fill-red-700">L</text>
          <text x="350" y="72" textAnchor="middle" className="text-xs fill-red-600">{loss.toFixed(4)}</text>

          {/* Forward arrows */}
          <line x1="75" y1="60" x2="130" y2="60" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-forward)" />
          <line x1="185" y1="60" x2="240" y2="60" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-forward)" />
          <line x1="295" y1="60" x2="320" y2="60" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-forward)" />

          {/* Backward arrows (below) */}
          <line x1="320" y1="95" x2="295" y2="95" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow-backward)" strokeDasharray="4 2" />
          <line x1="240" y1="95" x2="185" y2="95" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow-backward)" strokeDasharray="4 2" />
          <line x1="130" y1="95" x2="75" y2="95" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow-backward)" strokeDasharray="4 2" />

          {/* Gradient labels */}
          <text x="307" y="110" textAnchor="middle" className="text-[10px] fill-red-600">∂L/∂y</text>
          <text x="307" y="122" textAnchor="middle" className="text-[10px] fill-red-700 font-medium">{dL_dy.toFixed(3)}</text>

          <text x="212" y="110" textAnchor="middle" className="text-[10px] fill-red-600">∂L/∂h</text>
          <text x="212" y="122" textAnchor="middle" className="text-[10px] fill-red-700 font-medium">{dL_dh.toFixed(3)}</text>

          <text x="102" y="110" textAnchor="middle" className="text-[10px] fill-red-600">∂L/∂x</text>
          <text x="102" y="122" textAnchor="middle" className="text-[10px] fill-red-700 font-medium">{dL_dx.toFixed(3)}</text>

          {/* Target indicator */}
          <text x="350" y="20" textAnchor="middle" className="text-xs fill-neutral-500">target: {target}</text>
        </svg>
      </div>

      {/* Chain Rule Breakdown */}
      <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
        <div className="text-xs font-bold text-neutral-700 mb-2">
          Chain Rule Step by Step:
        </div>

        {/* Step 1: dL/dy */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 w-16">∂L/∂y =</span>
          <span className="text-neutral-600">2(y - target) =</span>
          <span className="text-neutral-600">2({y.toFixed(3)} - {target}) =</span>
          <span className="text-red-600 font-bold">{dL_dy.toFixed(3)}</span>
        </div>

        {/* Step 2: dL/dh via chain rule */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 w-16">∂L/∂h =</span>
          <span className="text-neutral-600">∂L/∂y × ∂y/∂h =</span>
          <span className="text-red-600">{dL_dy.toFixed(3)}</span>
          <span className="text-neutral-400">×</span>
          <span className="text-purple-600">{dy_dh.toFixed(3)}</span>
          <span className="text-neutral-400">=</span>
          <span className="text-red-600 font-bold">{dL_dh.toFixed(3)}</span>
        </div>

        {/* Step 3: dL/dw via chain rule */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 w-16">∂L/∂w =</span>
          <span className="text-neutral-600">∂L/∂h × ∂h/∂w =</span>
          <span className="text-red-600">{dL_dh.toFixed(3)}</span>
          <span className="text-neutral-400">×</span>
          <span className="text-blue-600">{dh_dw.toFixed(3)}</span>
          <span className="text-neutral-400">=</span>
          <span className="text-green-600 font-bold">{dL_dw.toFixed(3)}</span>
        </div>

        {/* Step 4: dL/dx */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 w-16">∂L/∂x =</span>
          <span className="text-neutral-600">∂L/∂h × ∂h/∂x =</span>
          <span className="text-red-600">{dL_dh.toFixed(3)}</span>
          <span className="text-neutral-400">×</span>
          <span className="text-green-600">{dh_dx.toFixed(3)}</span>
          <span className="text-neutral-400">=</span>
          <span className="text-blue-600 font-bold">{dL_dx.toFixed(3)}</span>
        </div>

        {/* Weight update preview */}
        <div className="pt-3 border-t border-neutral-200 mt-3">
          <div className="text-xs text-neutral-600">
            <span className="font-medium">Weight update (lr=0.1):</span>{' '}
            w_new = {w.toFixed(2)} - 0.1 × {dL_dw.toFixed(3)} ={' '}
            <span className="font-bold text-green-700">{(w - 0.1 * dL_dw).toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 text-xs text-neutral-600 text-center">
        <span className="font-medium">Key insight:</span> Gradients are{' '}
        <span className="text-red-600">multiplied</span> at each step.
        This is why gradients can vanish (small × small × small → tiny)
        or explode (large × large → huge).
      </div>
    </div>
  );
}

/**
 * A more detailed visualization showing gradients flowing through
 * actual neurons with numerical values
 */
export function BackpropVisualization() {
  const [inputVals, setInputVals] = useState([0.8, 0.5]);
  const [step, setStep] = useState<'forward' | 'backward'>('forward');

  // Simple 2-2-1 network for sentiment
  const w1 = [
    [0.5, -0.3],
    [0.2, 0.7],
  ];
  const w2 = [0.6, -0.4];
  const target = 1;

  // Forward pass
  const h = [
    Math.max(0, inputVals[0] * w1[0][0] + inputVals[1] * w1[0][1]), // ReLU
    Math.max(0, inputVals[0] * w1[1][0] + inputVals[1] * w1[1][1]),
  ];
  const preAct = h[0] * w2[0] + h[1] * w2[1];
  const y = 1 / (1 + Math.exp(-preAct)); // sigmoid
  const loss = Math.pow(y - target, 2);

  // Backward pass
  const dL_dy = 2 * (y - target);
  const dy_dpre = y * (1 - y);
  const dL_dpre = dL_dy * dy_dpre;

  const dL_dh = [dL_dpre * w2[0], dL_dpre * w2[1]];

  // Through ReLU (gradient is 1 if h > 0, else 0)
  const dL_dpre1 = [
    h[0] > 0 ? dL_dh[0] : 0,
    h[1] > 0 ? dL_dh[1] : 0,
  ];

  const dL_dw1 = [
    [dL_dpre1[0] * inputVals[0], dL_dpre1[0] * inputVals[1]],
    [dL_dpre1[1] * inputVals[0], dL_dpre1[1] * inputVals[1]],
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-bold">Gradient Flow Through Neurons</div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('forward')}
            className={`px-3 py-1 text-xs rounded ${
              step === 'forward'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            Forward
          </button>
          <button
            onClick={() => setStep('backward')}
            className={`px-3 py-1 text-xs rounded ${
              step === 'backward'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            Backward
          </button>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-neutral-500">x₁ = {inputVals[0].toFixed(2)}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={inputVals[0]}
            onChange={(e) =>
              setInputVals([parseFloat(e.target.value), inputVals[1]])
            }
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500">x₂ = {inputVals[1].toFixed(2)}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={inputVals[1]}
            onChange={(e) =>
              setInputVals([inputVals[0], parseFloat(e.target.value)])
            }
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Network visualization */}
      <div className="relative h-56">
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {/* Connections with weights */}
          {/* Input to hidden */}
          <g opacity={step === 'forward' ? 1 : 0.3}>
            {/* x1 to h1 */}
            <line x1="70" y1="50" x2="150" y2="50" stroke="#3b82f6" strokeWidth="2" />
            <text x="110" y="42" textAnchor="middle" className="text-[9px] fill-blue-600">{w1[0][0].toFixed(1)}</text>
            {/* x1 to h2 */}
            <line x1="70" y1="50" x2="150" y2="130" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="100" y="95" textAnchor="middle" className="text-[9px] fill-blue-600">{w1[1][0].toFixed(1)}</text>
            {/* x2 to h1 */}
            <line x1="70" y1="130" x2="150" y2="50" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="100" y="75" textAnchor="middle" className="text-[9px] fill-blue-600">{w1[0][1].toFixed(1)}</text>
            {/* x2 to h2 */}
            <line x1="70" y1="130" x2="150" y2="130" stroke="#3b82f6" strokeWidth="2" />
            <text x="110" y="142" textAnchor="middle" className="text-[9px] fill-blue-600">{w1[1][1].toFixed(1)}</text>
          </g>

          {/* Hidden to output */}
          <g opacity={step === 'forward' ? 1 : 0.3}>
            <line x1="190" y1="50" x2="270" y2="90" stroke="#22c55e" strokeWidth="2" />
            <text x="225" y="60" textAnchor="middle" className="text-[9px] fill-green-600">{w2[0].toFixed(1)}</text>
            <line x1="190" y1="130" x2="270" y2="90" stroke="#22c55e" strokeWidth="2" />
            <text x="225" y="125" textAnchor="middle" className="text-[9px] fill-green-600">{w2[1].toFixed(1)}</text>
          </g>

          {/* Output to loss */}
          <g opacity={step === 'forward' ? 1 : 0.3}>
            <line x1="310" y1="90" x2="350" y2="90" stroke="#a855f7" strokeWidth="2" />
          </g>

          {/* Backward flow (dashed red) */}
          {step === 'backward' && (
            <g>
              {/* Loss to output */}
              <line x1="350" y1="105" x2="310" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
              <text x="330" y="120" textAnchor="middle" className="text-[8px] fill-red-600">{dL_dy.toFixed(2)}</text>

              {/* Output to hidden */}
              <line x1="270" y1="100" x2="190" y2="60" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="270" y1="100" x2="190" y2="140" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="230" y="75" textAnchor="middle" className="text-[8px] fill-red-600">{dL_dh[0].toFixed(2)}</text>
              <text x="230" y="135" textAnchor="middle" className="text-[8px] fill-red-600">{dL_dh[1].toFixed(2)}</text>
            </g>
          )}

          {/* Nodes */}
          {/* Input layer */}
          <circle cx="50" cy="50" r="20" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
          <text x="50" y="46" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">x₁</text>
          <text x="50" y="58" textAnchor="middle" className="text-[9px] fill-blue-600">{inputVals[0].toFixed(2)}</text>

          <circle cx="50" cy="130" r="20" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
          <text x="50" y="126" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">x₂</text>
          <text x="50" y="138" textAnchor="middle" className="text-[9px] fill-blue-600">{inputVals[1].toFixed(2)}</text>

          {/* Hidden layer */}
          <circle cx="170" cy="50" r="20" fill={h[0] > 0 ? '#dcfce7' : '#f5f5f5'} stroke={h[0] > 0 ? '#22c55e' : '#a3a3a3'} strokeWidth="2" />
          <text x="170" y="46" textAnchor="middle" className="text-[10px] font-bold fill-green-700">h₁</text>
          <text x="170" y="58" textAnchor="middle" className="text-[9px] fill-green-600">{h[0].toFixed(2)}</text>
          {step === 'backward' && (
            <text x="170" y="25" textAnchor="middle" className="text-[8px] fill-red-600 font-medium">
              ∇{dL_dpre1[0].toFixed(2)}
            </text>
          )}

          <circle cx="170" cy="130" r="20" fill={h[1] > 0 ? '#dcfce7' : '#f5f5f5'} stroke={h[1] > 0 ? '#22c55e' : '#a3a3a3'} strokeWidth="2" />
          <text x="170" y="126" textAnchor="middle" className="text-[10px] font-bold fill-green-700">h₂</text>
          <text x="170" y="138" textAnchor="middle" className="text-[9px] fill-green-600">{h[1].toFixed(2)}</text>
          {step === 'backward' && (
            <text x="170" y="155" textAnchor="middle" className="text-[8px] fill-red-600 font-medium">
              ∇{dL_dpre1[1].toFixed(2)}
            </text>
          )}

          {/* Output */}
          <circle cx="290" cy="90" r="20" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
          <text x="290" y="86" textAnchor="middle" className="text-[10px] font-bold fill-purple-700">y</text>
          <text x="290" y="98" textAnchor="middle" className="text-[9px] fill-purple-600">{y.toFixed(2)}</text>

          {/* Loss */}
          <circle cx="370" cy="90" r="20" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="370" y="86" textAnchor="middle" className="text-[10px] font-bold fill-red-700">L</text>
          <text x="370" y="98" textAnchor="middle" className="text-[9px] fill-red-600">{loss.toFixed(3)}</text>

          {/* Labels */}
          <text x="50" y="170" textAnchor="middle" className="text-[10px] fill-neutral-500">Input</text>
          <text x="170" y="170" textAnchor="middle" className="text-[10px] fill-neutral-500">Hidden</text>
          <text x="290" y="170" textAnchor="middle" className="text-[10px] fill-neutral-500">Output</text>
          <text x="370" y="170" textAnchor="middle" className="text-[10px] fill-neutral-500">Loss</text>
        </svg>
      </div>

      {/* Info panel */}
      <div className="bg-neutral-50 rounded p-3 mt-2 text-xs">
        {step === 'forward' ? (
          <div className="space-y-1">
            <div className="font-medium text-blue-700">Forward Pass:</div>
            <div className="font-mono text-neutral-600">
              h₁ = ReLU({inputVals[0].toFixed(2)}×{w1[0][0]} + {inputVals[1].toFixed(2)}×{w1[0][1]}) = {h[0].toFixed(2)}
            </div>
            <div className="font-mono text-neutral-600">
              h₂ = ReLU({inputVals[0].toFixed(2)}×{w1[1][0]} + {inputVals[1].toFixed(2)}×{w1[1][1]}) = {h[1].toFixed(2)}
            </div>
            <div className="font-mono text-neutral-600">
              y = σ({h[0].toFixed(2)}×{w2[0]} + {h[1].toFixed(2)}×{w2[1]}) = {y.toFixed(3)}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="font-medium text-red-700">Backward Pass (Chain Rule):</div>
            <div className="font-mono text-neutral-600">
              ∂L/∂y = 2({y.toFixed(2)} - {target}) = {dL_dy.toFixed(3)}
            </div>
            <div className="font-mono text-neutral-600">
              ∂L/∂h₁ = {dL_dy.toFixed(2)} × {dy_dpre.toFixed(2)} × {w2[0]} = {dL_dh[0].toFixed(3)}
            </div>
            <div className="font-mono text-neutral-600">
              ∂L/∂h₂ = {dL_dy.toFixed(2)} × {dy_dpre.toFixed(2)} × {w2[1]} = {dL_dh[1].toFixed(3)}
            </div>
            <div className="text-neutral-500 mt-2 italic">
              {h[0] === 0 && 'h₁ gradient blocked by ReLU (h₁ = 0). '}
              {h[1] === 0 && 'h₂ gradient blocked by ReLU (h₂ = 0).'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
