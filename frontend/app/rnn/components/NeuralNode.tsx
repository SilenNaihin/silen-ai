'use client';

import { motion, MotionValue } from 'framer-motion';

interface NeuralNodeProps {
  x: number;
  y: number;
  label?: string;
  active?: boolean;
  color?: string;
  size?: number;
  opacity?: number | MotionValue<number>;
  scale?: number | MotionValue<number>;
}

export const NeuralNode = ({
  x,
  y,
  label,
  active = false,
  color = '#3b82f6',
  size = 40,
  opacity = 1,
  scale = 1,
}: NeuralNodeProps) => {
  return (
    <motion.g style={{ opacity, scale }}>
      <motion.circle
        cx={x}
        cy={y}
        r={size / 2}
        fill={active ? color : 'white'}
        stroke={color}
        strokeWidth={3}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      {label && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold"
          fill={active ? 'white' : color}
        >
          {label}
        </text>
      )}
    </motion.g>
  );
};

