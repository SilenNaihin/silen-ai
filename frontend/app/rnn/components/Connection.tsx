'use client';

import { motion, MotionValue } from 'framer-motion';

interface ConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  opacity?: number | MotionValue<number>;
  pathLength?: number | MotionValue<number>;
  animated?: boolean;
}

export const Connection = ({
  x1,
  y1,
  x2,
  y2,
  active = false,
  color = '#94a3b8',
  strokeWidth = 2,
  delay = 0,
  opacity = 1,
  pathLength = 1,
  animated = true,
}: ConnectionProps) => {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={active ? '#3b82f6' : color}
      strokeWidth={active ? strokeWidth + 1 : strokeWidth}
      style={{ opacity, pathLength }}
      initial={animated ? { pathLength: 0, opacity: 0 } : {}}
      animate={animated ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    />
  );
};

