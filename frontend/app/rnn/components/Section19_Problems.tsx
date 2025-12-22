'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { FaExclamationTriangle } from 'react-icons/fa';

export const Section19_Problems = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-gray-100">
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
            <div className="flex items-center justify-center gap-4">
              <FaExclamationTriangle className="text-5xl text-amber-600" />
              <h2 className="text-5xl font-bold text-gray-800">
                Remaining Problems
              </h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Even with all these improvements, AWD-LSTMs still have <span className="font-semibold text-amber-700">fundamental limitations</span>.
            </p>
            <p className="text-lg text-gray-600">
              These limitations led to the development of Transformers and attention mechanisms.
            </p>
          </motion.div>

          {/* Problems Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Sequential Processing */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-red-800">Sequential Processing</h3>
              </div>
              <p className="text-gray-700 mb-3">
                RNNs/LSTMs must process sequences one token at a time. You can&apos;t parallelize across time steps!
              </p>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Impact:</span> Very slow training and inference, especially for long sequences. 
                  Can&apos;t take advantage of modern GPU parallelism effectively.
                </p>
              </div>
            </motion.div>

            {/* Limited Context Window */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-orange-800">Limited Context Window</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Even with LSTMs, there&apos;s a practical limit to how far back the model can effectively &quot;remember.&quot;
              </p>
              <div className="bg-orange-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Impact:</span> Struggles with very long documents or texts requiring 
                  understanding of relationships spanning hundreds of tokens.
                </p>
              </div>
            </motion.div>

            {/* Difficulty with Long-Range Dependencies */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-yellow-800">Long-Range Dependencies</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Information must flow through every intermediate hidden state. The further apart two tokens are, 
                the harder it is to connect them.
              </p>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Impact:</span> Difficulty with tasks requiring understanding of 
                  relationships between distant parts of the input.
                </p>
              </div>
            </motion.div>

            {/* No Direct Token Interactions */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-xl font-bold text-amber-800">No Direct Interactions</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Every token can only &quot;see&quot; previous tokens through the hidden state bottleneck. 
                No direct token-to-token communication.
              </p>
              <div className="bg-amber-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Impact:</span> Information gets compressed and potentially lost as 
                  it passes through the sequential hidden states.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Comparison visualization */}
          <motion.div
            className="w-full bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Sequential Processing Bottleneck
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* LSTM Sequential */}
              <div className="flex-1">
                <h4 className="text-center font-bold text-red-700 mb-4">LSTM (Sequential)</h4>
                <svg width="300" height="150" className="mx-auto">
                  {[0, 1, 2, 3].map((i) => {
                    const x = 40 + i * 70;
                    return (
                      <g key={i}>
                        <rect x={x - 20} y={50} width={40} height={40} fill="#ef4444" stroke="#dc2626" strokeWidth={2} rx={5} />
                        <text x={x} y={75} textAnchor="middle" className="text-xs fill-white font-semibold">
                          t{i + 1}
                        </text>
                        {i < 3 && (
                          <path d={`M ${x + 20} 70 L ${x + 50} 70`} stroke="#64748b" strokeWidth={2} markerEnd="url(#arrow)" />
                        )}
                      </g>
                    );
                  })}
                  <text x={150} y={130} textAnchor="middle" className="text-sm fill-gray-600">
                    Must process in order →
                  </text>
                </svg>
              </div>
              
              {/* Transformer Parallel */}
              <div className="flex-1">
                <h4 className="text-center font-bold text-green-700 mb-4">Transformer (Parallel)</h4>
                <svg width="300" height="150" className="mx-auto">
                  {[0, 1, 2, 3].map((i) => {
                    const x = 40 + i * 70;
                    return (
                      <g key={i}>
                        <rect x={x - 20} y={50} width={40} height={40} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                        <text x={x} y={75} textAnchor="middle" className="text-xs fill-white font-semibold">
                          t{i + 1}
                        </text>
                        {/* Cross connections */}
                        {[0, 1, 2, 3].filter(j => j !== i).slice(0, 1).map((j) => {
                          const targetX = 40 + j * 70;
                          return (
                            <line
                              key={`${i}-${j}`}
                              x1={x}
                              y1={90}
                              x2={targetX}
                              y2={50}
                              stroke="#94a3b8"
                              strokeWidth={1}
                              opacity={0.3}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                  <text x={150} y={130} textAnchor="middle" className="text-sm fill-gray-600">
                    All tokens process together
                  </text>
                </svg>
              </div>
            </div>
            
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
              </marker>
            </defs>
          </motion.div>

          {/* What came next */}
          <motion.div
            className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg border-2 border-blue-300 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h4 className="text-2xl font-bold text-blue-800 mb-4 text-center">What Came Next?</h4>
            <p className="text-lg text-gray-700 text-center mb-3">
              These limitations led to the development of the <span className="font-bold text-blue-700">Transformer architecture</span> (2017).
            </p>
            <p className="text-gray-600 text-center">
              Transformers use <span className="font-semibold">self-attention</span> mechanisms to allow every token to directly 
              attend to every other token in parallel, solving all four problems above. This breakthrough enabled GPT, BERT, and modern LLMs.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

