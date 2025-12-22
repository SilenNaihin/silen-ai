'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section11_TBPTT = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-fuchsia-50 to-rose-50">
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
              TBPTT & Cross-Entropy Loss
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              <span className="font-semibold text-rose-700">Truncated Backpropagation Through Time (TBPTT)</span> solves 
              a practical problem: we can&apos;t unroll sequences forever.
            </p>
            <p className="text-lg text-gray-600">
              We break long sequences into chunks and backpropagate through each chunk separately.
            </p>
          </motion.div>

          {/* TBPTT Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="800" height="400" className="mx-auto">
              {/* Full sequence */}
              <text x={400} y={40} textAnchor="middle" className="text-lg font-bold fill-gray-700">
                Long Sequence (e.g., 1000 tokens)
              </text>
              
              <rect x={50} y={60} width={700} height={40} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} rx={5} />
              
              {/* Chunks */}
              <text x={400} y={140} textAnchor="middle" className="text-lg font-bold fill-gray-700">
                Split into Chunks
              </text>
              
              {[0, 1, 2, 3, 4].map((chunk) => {
                const x = 60 + chunk * 145;
                
                return (
                  <motion.g
                    key={chunk}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + chunk * 0.15 }}
                  >
                    <rect
                      x={x}
                      y={160}
                      width={130}
                      height={60}
                      fill="#3b82f6"
                      stroke="#2563eb"
                      strokeWidth={2}
                      rx={5}
                    />
                    <text x={x + 65} y={185} textAnchor="middle" className="text-sm fill-white font-semibold">
                      Chunk {chunk + 1}
                    </text>
                    <text x={x + 65} y={205} textAnchor="middle" className="text-xs fill-white">
                      (e.g., 200 tokens)
                    </text>
                    
                    {/* Backprop arrow */}
                    <motion.path
                      d={`M ${x + 65} 220 L ${x + 65} 280`}
                      stroke="#ef4444"
                      strokeWidth={3}
                      markerEnd="url(#arrowRed)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.2 + chunk * 0.15, duration: 0.5 }}
                    />
                    
                    <motion.text
                      x={x + 65}
                      y={300}
                      textAnchor="middle"
                      className="text-xs fill-red-600 font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 + chunk * 0.15 }}
                    >
                      backprop
                    </motion.text>
                  </motion.g>
                );
              })}
              
              <defs>
                <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
              </defs>
            </svg>
          </motion.div>

          {/* Cross-Entropy */}
          <motion.div
            className="w-full max-w-4xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Cross-Entropy Loss</h3>
              <p className="text-lg text-gray-700">
                For classification tasks (like predicting the next word), we use <span className="font-semibold text-rose-700">cross-entropy loss</span> 
                instead of MSE.
              </p>
            </div>
            
            <div className="bg-rose-100 p-6 rounded-lg border-2 border-rose-300">
              <p className="text-2xl font-mono text-center mb-4">
                L = -Σ y_i log(ŷ_i)
              </p>
              <p className="text-sm text-gray-600 text-center">
                where y_i is the true label (one-hot) and ŷ_i is the predicted probability
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Example:</span> If the correct next word is &quot;cat&quot; (index 42), 
                  and our model predicts P(&quot;cat&quot;) = 0.8, the loss is -log(0.8) ≈ 0.22
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Lower is better:</span> If P(&quot;cat&quot;) = 0.1, 
                  the loss is -log(0.1) ≈ 2.3 — much higher!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

