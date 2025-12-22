'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section17_ActivationReg = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex flex-col items-center gap-10">
          {/* Text Content */}
          <motion.div 
            className="text-center space-y-4 max-w-3xl"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800">
              Temporal & Activation Regularization
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Specialized regularization techniques for <span className="font-semibold text-indigo-700">sequence models</span>.
            </p>
            <p className="text-lg text-gray-600">
              These techniques specifically target the temporal nature of RNNs and LSTMs.
            </p>
          </motion.div>

          {/* TAR and AR Visualization */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Temporal Activation Regularization */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
                Temporal Activation Reg (TAR)
              </h3>
              
              <svg width="350" height="280" className="mx-auto mb-4">
                {/* Time steps */}
                {[0, 1, 2, 3].map((t) => {
                  const x = 60 + t * 80;
                  
                  return (
                    <g key={t}>
                      <motion.rect
                        x={x - 25}
                        y={100}
                        width={50}
                        height={60}
                        fill="#8b5cf6"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        rx={5}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + t * 0.15 }}
                      />
                      <text x={x} y={135} textAnchor="middle" className="text-sm fill-white font-semibold">
                        h_t{t + 1}
                      </text>
                      
                      {/* Arrow showing temporal difference */}
                      {t < 3 && (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + t * 0.15 }}
                        >
                          <path
                            d={`M ${x + 25} 130 L ${x + 55} 130`}
                            stroke="#ef4444"
                            strokeWidth={3}
                            strokeDasharray="5,5"
                            markerEnd="url(#arrowRed)"
                          />
                          <text
                            x={x + 40}
                            y={120}
                            textAnchor="middle"
                            className="text-xs fill-red-600 font-semibold"
                          >
                            Δ
                          </text>
                        </motion.g>
                      )}
                    </g>
                  );
                })}
                
                <text x={175} y={220} textAnchor="middle" className="text-sm fill-gray-600">
                  Penalize large changes between time steps
                </text>
                
                <defs>
                  <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2 font-mono text-center">
                  L_TAR = β × Σ ||h_t - h_(t-1)||²
                </p>
                <p className="text-xs text-gray-600 text-center">
                  Encourages smooth hidden state transitions
                </p>
              </div>
            </div>

            {/* Activation Regularization */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-pink-200">
              <h3 className="text-2xl font-bold text-pink-700 mb-6 text-center">
                Activation Reg (AR)
              </h3>
              
              <svg width="350" height="280" className="mx-auto mb-4">
                {/* Single time step with activations */}
                <motion.rect
                  x={150}
                  y={80}
                  width={70}
                  height={80}
                  fill="#ec4899"
                  stroke="#db2777"
                  strokeWidth={3}
                  rx={5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                />
                <text x={185} y={125} textAnchor="middle" className="text-lg fill-white font-bold">
                  h_t
                </text>
                
                {/* Activation values */}
                {[0, 1, 2, 3].map((i) => {
                  const y = 190 + i * 20;
                  const value = [0.8, 0.3, 0.6, 0.9][i];
                  
                  return (
                    <g key={i}>
                      <rect
                        x={100}
                        y={y}
                        width={value * 170}
                        height={12}
                        fill="#f472b6"
                        rx={2}
                      />
                      <text x={280} y={y + 9} className="text-xs fill-gray-600">
                        {value.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                
                {/* Arrow from hidden to activations */}
                <motion.path
                  d="M 185 160 L 185 185"
                  stroke="#64748b"
                  strokeWidth={2}
                  markerEnd="url(#arrowGray)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8 }}
                />
                
                <defs>
                  <marker id="arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                  </marker>
                </defs>
              </svg>
              
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2 font-mono text-center">
                  L_AR = α × Σ ||h_t||²
                </p>
                <p className="text-xs text-gray-600 text-center">
                  Penalizes large activation magnitudes
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why they work */}
          <motion.div
            className="w-full max-w-5xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center text-gray-800">Why These Work for RNNs</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300">
                <h4 className="text-lg font-bold text-purple-800 mb-3">TAR Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Prevents erratic hidden state changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Encourages smooth, meaningful transitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Helps with gradient stability</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-pink-100 p-6 rounded-lg border-2 border-pink-300">
                <h4 className="text-lg font-bold text-pink-800 mb-3">AR Benefits</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>Prevents activation explosion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>Keeps hidden states in reasonable range</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>Improves numerical stability</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Where they fit */}
          <motion.div
            className="bg-indigo-100 p-6 rounded-lg border-2 border-indigo-300 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h4 className="text-lg font-bold text-indigo-800 mb-3 text-center">Integration with Training</h4>
            <p className="text-gray-700 text-center">
              Both TAR and AR are added as additional loss terms during training, similar to weight decay. 
              The total loss becomes: <span className="font-mono">L_total = L_task + α·L_AR + β·L_TAR + λ·L_weight_decay</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

