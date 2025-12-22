'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import { NeuralNode } from './NeuralNode';
import { Connection } from './Connection';

interface PerceptronProps {
  progress: MotionValue<number>;
  showWeights?: boolean;
}

export const Perceptron = ({ progress, showWeights = false }: PerceptronProps) => {
  const inputCount = 3;
  const centerX = 400;
  const centerY = 300;
  const inputX = 200;
  const outputX = 600;

  const connectionOpacity = useTransform(progress, [0, 0.3], [0, 1]);
  const weightsOpacity = useTransform(progress, [0.5, 0.8], [0, 1]);

  return (
    <svg width="800" height="600" className="mx-auto">
      {/* Input nodes */}
      {Array.from({ length: inputCount }).map((_, idx) => {
        const y = centerY - 80 + idx * 80;
        return (
          <g key={`input-${idx}`}>
            <Connection
              x1={inputX}
              y1={y}
              x2={centerX}
              y2={centerY}
              opacity={connectionOpacity}
              animated={false}
            />
            {showWeights && (
              <motion.text
                x={(inputX + centerX) / 2}
                y={y + (centerY - y) / 2 - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                style={{ opacity: weightsOpacity }}
              >
                w{idx + 1}
              </motion.text>
            )}
            <NeuralNode
              x={inputX}
              y={y}
              label={`x${idx + 1}`}
              color="#10b981"
            />
          </g>
        );
      })}

      {/* Output node */}
      <Connection
        x1={centerX}
        y1={centerY}
        x2={outputX}
        y2={centerY}
        opacity={connectionOpacity}
        animated={false}
      />
      <NeuralNode x={centerX} y={centerY} label="Σ" color="#3b82f6" />
      <NeuralNode x={outputX} y={centerY} label="y" color="#ef4444" />

      {/* Activation function label */}
      <motion.text
        x={centerX + 100}
        y={centerY - 40}
        textAnchor="middle"
        className="text-sm fill-gray-600"
        style={{ opacity: weightsOpacity }}
      >
        σ(activation)
      </motion.text>
    </svg>
  );
};

