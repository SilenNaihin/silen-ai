'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section9_BatchPredictions = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-violet-50">
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
              More Data Per Batch
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Instead of predicting only the last token, why not predict <span className="font-semibold text-violet-700">after every word</span>?
            </p>
            <p className="text-lg text-gray-600">
              This gives us more training signal from each sequence!
            </p>
          </motion.div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="700" height="500" className="mx-auto">
              {/* Input sequence */}
              <text x={350} y={30} textAnchor="middle" className="text-lg font-bold fill-gray-700">
                Input: &quot;The cat sat on the mat&quot;
              </text>
              
              {/* Sequence visualization */}
              {["The", "cat", "sat", "on", "the"].map((word, idx) => {
                const x = 100 + idx * 120;
                const y = 100;
                
                return (
                  <motion.g
                    key={idx}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.2 }}
                  >
                    {/* Input word */}
                    <rect
                      x={x - 40}
                      y={y}
                      width={80}
                      height={40}
                      fill="#10b981"
                      stroke="#059669"
                      strokeWidth={2}
                      rx={5}
                    />
                    <text
                      x={x}
                      y={y + 25}
                      textAnchor="middle"
                      className="text-sm fill-white font-semibold"
                    >
                      {word}
                    </text>
                    
                    {/* Arrow */}
                    <path
                      d={`M ${x} ${y + 40} L ${x} ${y + 80}`}
                      stroke="#374151"
                      strokeWidth={2}
                      markerEnd="url(#arrow)"
                    />
                    
                    {/* RNN processing */}
                    <rect
                      x={x - 40}
                      y={y + 80}
                      width={80}
                      height={50}
                      fill="#3b82f6"
                      stroke="#2563eb"
                      strokeWidth={2}
                      rx={5}
                    />
                    <text
                      x={x}
                      y={y + 110}
                      textAnchor="middle"
                      className="text-sm fill-white font-semibold"
                    >
                      RNN
                    </text>
                    
                    {/* Arrow to prediction */}
                    <path
                      d={`M ${x} ${y + 130} L ${x} ${y + 170}`}
                      stroke="#374151"
                      strokeWidth={2}
                      markerEnd="url(#arrow)"
                    />
                    
                    {/* Prediction */}
                    <rect
                      x={x - 40}
                      y={y + 170}
                      width={80}
                      height={40}
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth={2}
                      rx={5}
                    />
                    <text
                      x={x}
                      y={y + 185}
                      textAnchor="middle"
                      className="text-xs fill-white"
                    >
                      predict:
                    </text>
                    <text
                      x={x}
                      y={y + 202}
                      textAnchor="middle"
                      className="text-sm fill-white font-semibold"
                    >
                      {["cat", "sat", "on", "the", "mat"][idx]}
                    </text>
                    
                    {/* Recurrent connection */}
                    {idx < 4 && (
                      <path
                        d={`M ${x + 40} ${y + 105} L ${x + 80} ${y + 105}`}
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        markerEnd="url(#arrowPurple)"
                      />
                    )}
                  </motion.g>
                );
              })}
              
              {/* Arrow definitions */}
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#374151" />
                </marker>
                <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                </marker>
              </defs>
              
              {/* Annotation */}
              <motion.text
                x={350}
                y={450}
                textAnchor="middle"
                className="text-lg font-semibold fill-violet-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                5 predictions from 1 sequence = 5× more training data!
              </motion.text>
            </svg>
          </motion.div>

          {/* Benefit callout */}
          <motion.div
            className="bg-violet-100 p-6 rounded-lg border-2 border-violet-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-lg text-gray-700 text-center">
              <span className="font-bold text-violet-800">Key insight:</span> Every position in the sequence 
              becomes a training example, dramatically improving data efficiency.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

