'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Interactive Chain Rule Visualization using connected wheels
 *
 * Black and white design per style guide.
 * Wheels represent variables connected by derivatives (gear ratios).
 * When x turns, u turns at rate du/dx, y turns at rate dy/du.
 * Total: dy/dx = du/dx × dy/du
 */
export function ChainRuleInteractive() {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [du_dx, setDu_dx] = useState(2);
  const [dy_du, setDy_du] = useState(0.5);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation((r) => r + 0.02);
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

  const xRotation = rotation;
  const uRotation = rotation * du_dx;
  const yRotation = rotation * du_dx * dy_du;
  const dy_dx = du_dx * dy_du;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            du/dx = <span className="font-mono font-bold text-black">{du_dx.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={du_dx}
            onChange={(e) => setDu_dx(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            dy/du = <span className="font-mono font-bold text-black">{dy_du.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={dy_du}
            onChange={(e) => setDy_du(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Wheel visualization */}
      <div className="relative h-44 mb-4">
        <svg viewBox="0 0 360 140" className="w-full h-full">
          {/* Connection lines */}
          <line x1="80" y1="70" x2="140" y2="70" stroke="#e5e5e5" strokeWidth="6" />
          <line x1="190" y1="70" x2="250" y2="70" stroke="#e5e5e5" strokeWidth="6" />

          {/* X-wheel */}
          <g transform="translate(55, 70)">
            <circle r="30" fill="white" stroke="black" strokeWidth="2" />
            <line
              x1="0" y1="0"
              x2={Math.cos(xRotation) * 24}
              y2={Math.sin(xRotation) * 24}
              stroke="black" strokeWidth="3" strokeLinecap="round"
            />
            <circle r="4" fill="black" />
            <text y="48" textAnchor="middle" className="text-xs font-medium fill-neutral-600">x</text>
          </g>

          {/* U-wheel */}
          <g transform="translate(165, 70)">
            <circle r="24" fill="white" stroke="black" strokeWidth="2" />
            <line
              x1="0" y1="0"
              x2={Math.cos(uRotation) * 18}
              y2={Math.sin(uRotation) * 18}
              stroke="black" strokeWidth="3" strokeLinecap="round"
            />
            <circle r="3" fill="black" />
            <text y="42" textAnchor="middle" className="text-xs font-medium fill-neutral-600">u</text>
          </g>

          {/* Y-wheel */}
          <g transform="translate(275, 70)">
            <circle r="20" fill="white" stroke="black" strokeWidth="2" />
            <line
              x1="0" y1="0"
              x2={Math.cos(yRotation) * 14}
              y2={Math.sin(yRotation) * 14}
              stroke="black" strokeWidth="3" strokeLinecap="round"
            />
            <circle r="3" fill="black" />
            <text y="38" textAnchor="middle" className="text-xs font-medium fill-neutral-600">y</text>
          </g>

          {/* Derivative labels */}
          <text x="110" y="30" textAnchor="middle" className="text-[11px] font-mono fill-neutral-500">
            ×{du_dx.toFixed(2)}
          </text>
          <text x="220" y="30" textAnchor="middle" className="text-[11px] font-mono fill-neutral-500">
            ×{dy_du.toFixed(2)}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
            isAnimating
              ? 'bg-neutral-100 border-neutral-300 text-neutral-700'
              : 'bg-black text-white border-black'
          }`}
        >
          {isAnimating ? 'Stop' : 'Spin'}
        </button>
        <button
          onClick={() => setRotation(0)}
          className="px-4 py-1.5 rounded text-sm font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
        >
          Reset
        </button>
      </div>

      {/* Result */}
      <div className="text-center border-t border-neutral-100 pt-4">
        <div className="text-sm text-neutral-500 mb-1">Chain Rule</div>
        <div className="font-mono text-lg">
          dy/dx = {du_dx.toFixed(2)} × {dy_du.toFixed(2)} = <span className="font-bold">{dy_dx.toFixed(2)}</span>
        </div>
        <div className="text-xs text-neutral-400 mt-1">
          1 turn of x → {dy_dx.toFixed(2)} turns of y
        </div>
      </div>
    </div>
  );
}
