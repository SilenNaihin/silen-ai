'use client';

import { motion, MotionValue } from 'framer-motion';

interface RNNCellProps {
  x: number;
  y: number;
  label?: string;
  showRecurrence?: boolean;
  progress?: MotionValue<number>;
  size?: number;
}

export const RNNCell = ({
  x,
  y,
  label = 'RNN',
  showRecurrence = true,
  size = 80,
}: RNNCellProps) => {
  return (
    <g>
      {/* Recurrent connection (loop back) */}
      {showRecurrence && (
        <motion.path
          d={`M ${x + size / 2} ${y - size / 2} 
              Q ${x + size / 2 + 40} ${y - size / 2 - 40} ${x} ${y - size / 2}
              L ${x} ${y - size / 2}`}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={3}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      )}

      {/* Main cell */}
      <motion.rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        fill="white"
        stroke="#3b82f6"
        strokeWidth={3}
        rx={8}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />

      {/* Label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-bold fill-blue-600"
      >
        {label}
      </text>

      {/* Input arrow */}
      <motion.path
        d={`M ${x - size / 2 - 40} ${y} L ${x - size / 2} ${y}`}
        stroke="#64748b"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Output arrow */}
      <motion.path
        d={`M ${x + size / 2} ${y} L ${x + size / 2 + 40} ${y}`}
        stroke="#64748b"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </g>
  );
};

