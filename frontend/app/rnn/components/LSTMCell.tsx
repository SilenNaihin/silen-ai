'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface LSTMCellProps {
  x: number;
  y: number;
  progress: MotionValue<number>;
  showForgetGate?: boolean;
  showInputGate?: boolean;
  showOutputGate?: boolean;
  showCellState?: boolean;
}

export const LSTMCell = ({
  x,
  y,
  progress,
  showForgetGate = true,
  showInputGate = true,
  showOutputGate = true,
  showCellState = true,
}: LSTMCellProps) => {
  const forgetGateOpacity = useTransform(progress, [0, 0.25], [0, 1]);
  const inputGateOpacity = useTransform(progress, [0.25, 0.5], [0, 1]);
  const outputGateOpacity = useTransform(progress, [0.5, 0.75], [0, 1]);
  const cellStateOpacity = useTransform(progress, [0.75, 1], [0, 1]);

  const size = 120;
  const gateSize = 30;

  return (
    <g>
      {/* Main cell container */}
      <motion.rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        fill="white"
        stroke="#3b82f6"
        strokeWidth={3}
        rx={8}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      />

      {/* Cell state line (horizontal through top) */}
      {showCellState && (
        <motion.line
          x1={x - size / 2 - 40}
          y1={y - size / 2 + 20}
          x2={x + size / 2 + 40}
          y2={y - size / 2 + 20}
          stroke="#8b5cf6"
          strokeWidth={4}
          style={{ opacity: cellStateOpacity }}
        />
      )}

      {/* Forget gate (σ) */}
      {showForgetGate && (
        <motion.g style={{ opacity: forgetGateOpacity }}>
          <circle
            cx={x - 30}
            cy={y}
            r={gateSize / 2}
            fill="#ef4444"
            stroke="#991b1b"
            strokeWidth={2}
          />
          <text
            x={x - 30}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold fill-white"
          >
            σ
          </text>
          <text
            x={x - 30}
            y={y + 35}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            forget
          </text>
        </motion.g>
      )}

      {/* Input gate (σ) */}
      {showInputGate && (
        <motion.g style={{ opacity: inputGateOpacity }}>
          <circle
            cx={x}
            cy={y}
            r={gateSize / 2}
            fill="#10b981"
            stroke="#065f46"
            strokeWidth={2}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold fill-white"
          >
            σ
          </text>
          <text
            x={x}
            y={y + 35}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            input
          </text>
        </motion.g>
      )}

      {/* Output gate (σ) */}
      {showOutputGate && (
        <motion.g style={{ opacity: outputGateOpacity }}>
          <circle
            cx={x + 30}
            cy={y}
            r={gateSize / 2}
            fill="#f59e0b"
            stroke="#92400e"
            strokeWidth={2}
          />
          <text
            x={x + 30}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold fill-white"
          >
            σ
          </text>
          <text
            x={x + 30}
            y={y + 35}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            output
          </text>
        </motion.g>
      )}

      {/* Label */}
      <text
        x={x}
        y={y - size / 2 - 15}
        textAnchor="middle"
        className="text-lg font-bold fill-blue-600"
      >
        LSTM Cell
      </text>
    </g>
  );
};

