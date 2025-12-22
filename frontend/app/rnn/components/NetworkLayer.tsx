'use client';

import { motion } from 'framer-motion';
import { NeuralNode } from './NeuralNode';
import { Connection } from './Connection';

interface NetworkLayerProps {
  x: number;
  y: number;
  nodeCount: number;
  label?: string;
  spacing?: number;
  nodeSize?: number;
  connectToPrevious?: boolean;
  previousLayer?: { x: number; y: number; nodeCount: number; spacing: number };
  activeNodes?: number[];
  activeConnections?: boolean;
}

export const NetworkLayer = ({
  x,
  y,
  nodeCount,
  label,
  spacing = 80,
  nodeSize = 40,
  connectToPrevious = false,
  previousLayer,
  activeNodes = [],
  activeConnections = false,
}: NetworkLayerProps) => {
  const totalHeight = (nodeCount - 1) * spacing;
  const startY = y - totalHeight / 2;

  return (
    <g>
      {/* Connections to previous layer */}
      {connectToPrevious && previousLayer && (
        <>
          {Array.from({ length: previousLayer.nodeCount }).map((_, prevIdx) => {
            const prevY =
              previousLayer.y -
              ((previousLayer.nodeCount - 1) * previousLayer.spacing) / 2 +
              prevIdx * previousLayer.spacing;
            
            return Array.from({ length: nodeCount }).map((_, currIdx) => {
              const currY = startY + currIdx * spacing;
              return (
                <Connection
                  key={`conn-${prevIdx}-${currIdx}`}
                  x1={previousLayer.x}
                  y1={prevY}
                  x2={x}
                  y2={currY}
                  active={activeConnections}
                  delay={prevIdx * 0.05 + currIdx * 0.05}
                />
              );
            });
          })}
        </>
      )}

      {/* Nodes */}
      {Array.from({ length: nodeCount }).map((_, idx) => {
        const nodeY = startY + idx * spacing;
        return (
          <NeuralNode
            key={`node-${idx}`}
            x={x}
            y={nodeY}
            size={nodeSize}
            active={activeNodes.includes(idx)}
          />
        );
      })}

      {/* Label */}
      {label && (
        <text
          x={x}
          y={y + totalHeight / 2 + 40}
          textAnchor="middle"
          className="text-sm font-medium fill-gray-600"
        >
          {label}
        </text>
      )}
    </g>
  );
};

