'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { NeuralNode } from './NeuralNode';

export const Section4_Backprop = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const forwardOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const backwardOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Text Content */}
          <motion.div 
            className="text-center space-y-4 max-w-3xl"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800">
              Backpropagation
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              To minimize the loss, we need to adjust the weights. <span className="font-semibold text-orange-700">Backpropagation</span> uses 
              the chain rule to calculate how each weight contributed to the error.
            </p>
            <p className="text-lg text-gray-600">
              Gradients flow backward through the network, telling us how to update each weight to reduce the loss.
            </p>
          </motion.div>

          {/* Backprop Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="700" height="400" className="mx-auto">
              {/* Network structure */}
              <NeuralNode x={100} y={200} label="x" color="#10b981" />
              <NeuralNode x={250} y={150} label="h₁" color="#3b82f6" />
              <NeuralNode x={250} y={250} label="h₂" color="#3b82f6" />
              <NeuralNode x={400} y={200} label="ŷ" color="#ef4444" />
              
              {/* Forward pass (blue arrows) */}
              <motion.g style={{ opacity: forwardOpacity }}>
                <path d="M 140 200 L 210 160" stroke="#3b82f6" strokeWidth={3} markerEnd="url(#arrowBlue)" />
                <path d="M 140 200 L 210 240" stroke="#3b82f6" strokeWidth={3} markerEnd="url(#arrowBlue)" />
                <path d="M 290 150 L 360 190" stroke="#3b82f6" strokeWidth={3} markerEnd="url(#arrowBlue)" />
                <path d="M 290 250 L 360 210" stroke="#3b82f6" strokeWidth={3} markerEnd="url(#arrowBlue)" />
                
                <text x={175} y={165} className="text-sm fill-blue-600 font-semibold">forward</text>
              </motion.g>
              
              {/* Backward pass (orange arrows) */}
              <motion.g style={{ opacity: backwardOpacity }}>
                <path d="M 360 210 L 290 255" stroke="#f97316" strokeWidth={3} markerEnd="url(#arrowOrange)" />
                <path d="M 360 190 L 290 155" stroke="#f97316" strokeWidth={3} markerEnd="url(#arrowOrange)" />
                <path d="M 210 240 L 140 205" stroke="#f97316" strokeWidth={3} markerEnd="url(#arrowOrange)" />
                <path d="M 210 160 L 140 195" stroke="#f97316" strokeWidth={3} markerEnd="url(#arrowOrange)" />
                
                <text x={470} y={225} className="text-sm fill-orange-600 font-semibold">backward (gradients)</text>
              </motion.g>
              
              {/* Loss node */}
              <NeuralNode x={550} y={200} label="L" color="#9333ea" />
              <motion.path 
                d="M 440 200 L 510 200" 
                stroke="#9333ea" 
                strokeWidth={3} 
                markerEnd="url(#arrowPurple)"
                style={{ opacity: forwardOpacity }}
              />
              
              {/* Arrow definitions */}
              <defs>
                <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                </marker>
                <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
                </marker>
                <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#9333ea" />
                </marker>
              </defs>
            </svg>
          </motion.div>

          {/* Formula */}
          <motion.div
            className="bg-orange-100 p-6 rounded-lg border-2 border-orange-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-xl font-mono text-center mb-2">
              w_new = w_old - η × ∂L/∂w
            </p>
            <p className="text-sm text-gray-600 text-center">
              η = learning rate, ∂L/∂w = gradient of loss with respect to weight
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

