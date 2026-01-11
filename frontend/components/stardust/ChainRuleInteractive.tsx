'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Interactive Chain Rule Visualization using connected wheels
 *
 * Inspired by the intuitive notion that derivatives are like gear ratios:
 * - Each wheel represents a variable (x, u, y)
 * - The "gear ratio" between wheels is the derivative
 * - When wheels are connected, turning x affects u affects y
 * - Total derivative dy/dx = du/dx × dy/du (multiply the ratios!)
 */
export function ChainRuleInteractive() {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [du_dx, setDu_dx] = useState(2);
  const [dy_du, setDy_du] = useState(0.5);
  const [connected, setConnected] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation((r) => r + 0.03);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Calculate wheel rotations based on gear ratios
  const xRotation = rotation;
  const uRotation = connected ? rotation * du_dx : 0;
  const yRotation = connected ? rotation * du_dx * dy_du : 0;

  // Total derivative
  const dy_dx = du_dx * dy_du;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="text-sm font-bold mb-4 text-center">
        The Chain Rule as Connected Wheels
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-neutral-600 block mb-1">
            du/dx (gear ratio) = <span className="font-bold text-green-600">{du_dx.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={du_dx}
            onChange={(e) => setDu_dx(parseFloat(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="text-[10px] text-neutral-400 mt-1">
            u spins {du_dx}× as fast as x
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-600 block mb-1">
            dy/du (gear ratio) = <span className="font-bold text-amber-600">{dy_du.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={dy_du}
            onChange={(e) => setDy_du(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="text-[10px] text-neutral-400 mt-1">
            y spins {dy_du}× as fast as u
          </div>
        </div>
      </div>

      {/* Wheel visualization */}
      <div className="relative h-52 mb-4">
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {/* Connection lines (belts) */}
          {connected && (
            <>
              <line
                x1="95"
                y1="80"
                x2="155"
                y2="80"
                stroke="#e5e5e5"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="205"
                y1="80"
                x2="265"
                y2="80"
                stroke="#e5e5e5"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </>
          )}

          {/* X-wheel (blue) */}
          <g transform="translate(60, 80)">
            <circle r="35" fill="white" stroke="#3b82f6" strokeWidth="3" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos(xRotation) * 30}
              y2={Math.sin(xRotation) * 30}
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle r="5" fill="#3b82f6" />
            <text y="55" textAnchor="middle" className="text-sm font-bold fill-neutral-700">
              x-wheel
            </text>
          </g>

          {/* U-wheel (green) */}
          <g transform="translate(180, 80)">
            <circle r="25" fill="white" stroke="#22c55e" strokeWidth="3" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos(uRotation) * 20}
              y2={Math.sin(uRotation) * 20}
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle r="4" fill="#22c55e" />
            <text y="45" textAnchor="middle" className="text-sm font-bold fill-neutral-700">
              u-wheel
            </text>
          </g>

          {/* Y-wheel (amber) */}
          <g transform="translate(300, 80)">
            <circle r="20" fill="white" stroke="#f59e0b" strokeWidth="3" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos(yRotation) * 15}
              y2={Math.sin(yRotation) * 15}
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle r="3" fill="#f59e0b" />
            <text y="40" textAnchor="middle" className="text-sm font-bold fill-neutral-700">
              y-wheel
            </text>
          </g>

          {/* Derivative labels */}
          <text x="120" y="35" textAnchor="middle" className="text-xs font-bold fill-green-600">
            du/dx = {du_dx}
          </text>
          <text x="240" y="35" textAnchor="middle" className="text-xs font-bold fill-amber-600">
            dy/du = {dy_du}
          </text>
        </svg>
      </div>

      {/* Controls row */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isAnimating
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isAnimating ? 'Stop' : 'Spin x-wheel'}
        </button>
        <button
          onClick={() => setConnected(!connected)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            connected
              ? 'bg-green-100 text-green-700'
              : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          {connected ? 'Connected' : 'Disconnected'}
        </button>
        <button
          onClick={() => setRotation(0)}
          className="px-4 py-2 rounded text-sm font-medium bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        >
          Reset
        </button>
      </div>

      {/* Chain rule result */}
      <div className="bg-neutral-50 rounded-lg p-4 text-center">
        <div className="text-sm text-neutral-600 mb-2">
          Chain Rule: dy/dx = du/dx × dy/du
        </div>
        <div className="text-lg font-mono">
          <span className="text-red-600 font-bold">dy/dx</span> ={' '}
          <span className="text-green-600">{du_dx}</span> ×{' '}
          <span className="text-amber-600">{dy_du}</span> ={' '}
          <span className="text-red-600 font-bold">{dy_dx}</span>
        </div>
        <div className="text-xs text-neutral-500 mt-2">
          When x completes 1 rotation, y completes {dy_dx} rotation{dy_dx !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

/**
 * Simplified backprop visualization showing gradient flow through neurons
 */
export function BackpropVisualization() {
  const [inputVals, setInputVals] = useState([0.8, 0.5]);
  const [step, setStep] = useState<'forward' | 'backward'>('forward');

  // Simple 2-2-1 network
  const w1 = [
    [0.5, -0.3],
    [0.2, 0.7],
  ];
  const w2 = [0.6, -0.4];
  const target = 1;

  // Forward pass
  const h = [
    Math.max(0, inputVals[0] * w1[0][0] + inputVals[1] * w1[0][1]),
    Math.max(0, inputVals[0] * w1[1][0] + inputVals[1] * w1[1][1]),
  ];
  const preAct = h[0] * w2[0] + h[1] * w2[1];
  const y = 1 / (1 + Math.exp(-preAct));
  const loss = Math.pow(y - target, 2);

  // Backward pass
  const dL_dy = 2 * (y - target);
  const dy_dpre = y * (1 - y);
  const dL_dpre = dL_dy * dy_dpre;
  const dL_dh = [dL_dpre * w2[0], dL_dpre * w2[1]];
  const dL_dpre1 = [h[0] > 0 ? dL_dh[0] : 0, h[1] > 0 ? dL_dh[1] : 0];

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-bold">Gradient Flow Through Neurons</div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('forward')}
            className={`px-3 py-1 text-xs rounded ${
              step === 'forward' ? 'bg-blue-600 text-white' : 'bg-neutral-100'
            }`}
          >
            Forward
          </button>
          <button
            onClick={() => setStep('backward')}
            className={`px-3 py-1 text-xs rounded ${
              step === 'backward' ? 'bg-red-600 text-white' : 'bg-neutral-100'
            }`}
          >
            Backward
          </button>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-neutral-500">
            x₁ = {inputVals[0].toFixed(2)}
          </label>
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
          <label className="text-xs text-neutral-500">
            x₂ = {inputVals[1].toFixed(2)}
          </label>
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

      {/* Network */}
      <div className="relative h-48">
        <svg viewBox="0 0 400 160" className="w-full h-full">
          {/* Connections */}
          <g opacity={step === 'forward' ? 1 : 0.3}>
            <line x1="60" y1="50" x2="150" y2="50" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="60" y1="50" x2="150" y2="110" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="60" y1="110" x2="150" y2="50" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="60" y1="110" x2="150" y2="110" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="190" y1="50" x2="280" y2="80" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="190" y1="110" x2="280" y2="80" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="320" y1="80" x2="360" y2="80" stroke="#a855f7" strokeWidth="1.5" />
          </g>

          {/* Backward arrows */}
          {step === 'backward' && (
            <g>
              <line x1="350" y1="95" x2="320" y2="95" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrowRed)" />
              <line x1="280" y1="90" x2="190" y2="55" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="280" y1="90" x2="190" y2="115" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 2" />
            </g>
          )}

          {/* Input neurons */}
          <circle cx="40" cy="50" r="18" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
          <text x="40" y="54" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">
            {inputVals[0].toFixed(1)}
          </text>
          <circle cx="40" cy="110" r="18" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
          <text x="40" y="114" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">
            {inputVals[1].toFixed(1)}
          </text>

          {/* Hidden neurons */}
          <circle cx="170" cy="50" r="18" fill={h[0] > 0 ? '#dcfce7' : '#f5f5f5'} stroke={h[0] > 0 ? '#22c55e' : '#a3a3a3'} strokeWidth="2" />
          <text x="170" y="54" textAnchor="middle" className="text-[10px] font-bold fill-green-700">
            {h[0].toFixed(2)}
          </text>
          {step === 'backward' && (
            <text x="170" y="30" textAnchor="middle" className="text-[9px] fill-red-600">
              ∇{dL_dpre1[0].toFixed(2)}
            </text>
          )}

          <circle cx="170" cy="110" r="18" fill={h[1] > 0 ? '#dcfce7' : '#f5f5f5'} stroke={h[1] > 0 ? '#22c55e' : '#a3a3a3'} strokeWidth="2" />
          <text x="170" y="114" textAnchor="middle" className="text-[10px] font-bold fill-green-700">
            {h[1].toFixed(2)}
          </text>
          {step === 'backward' && (
            <text x="170" y="135" textAnchor="middle" className="text-[9px] fill-red-600">
              ∇{dL_dpre1[1].toFixed(2)}
            </text>
          )}

          {/* Output */}
          <circle cx="300" cy="80" r="18" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
          <text x="300" y="84" textAnchor="middle" className="text-[10px] font-bold fill-purple-700">
            {y.toFixed(2)}
          </text>

          {/* Loss */}
          <circle cx="370" cy="80" r="16" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="370" y="84" textAnchor="middle" className="text-[9px] font-bold fill-red-700">
            {loss.toFixed(3)}
          </text>

          {/* Labels */}
          <text x="40" y="145" textAnchor="middle" className="text-[10px] fill-neutral-500">Input</text>
          <text x="170" y="145" textAnchor="middle" className="text-[10px] fill-neutral-500">Hidden</text>
          <text x="300" y="145" textAnchor="middle" className="text-[10px] fill-neutral-500">Output</text>
          <text x="370" y="145" textAnchor="middle" className="text-[10px] fill-neutral-500">Loss</text>
        </svg>
      </div>

      {/* Info */}
      <div className="bg-neutral-50 rounded p-3 text-xs">
        {step === 'forward' ? (
          <div className="text-blue-700">
            <span className="font-medium">Forward:</span> Data flows left→right through layers
          </div>
        ) : (
          <div className="text-red-700">
            <span className="font-medium">Backward:</span> Gradients flow right→left via chain rule
            {(h[0] === 0 || h[1] === 0) && (
              <span className="text-neutral-500 ml-2">
                (ReLU blocks gradient when h=0)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
