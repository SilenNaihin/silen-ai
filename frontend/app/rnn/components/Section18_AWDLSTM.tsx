'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section18_AWDLSTM = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50">
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
              AWD-LSTM
            </h2>
            <p className="text-2xl font-semibold text-purple-700">
              Averaging Weight-Dropped Long Short-Term Memory
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              The state-of-the-art (pre-Transformer) language model that combines <span className="font-semibold">all our regularization techniques</span>!
            </p>
          </motion.div>

          {/* AWD-LSTM Architecture Visualization */}
          <motion.div
            className="w-full bg-white p-8 rounded-lg shadow-xl border-2 border-purple-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Complete AWD-LSTM Architecture
            </h3>
            
            <svg width="800" height="500" className="mx-auto">
              {/* Input */}
              <motion.g
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <rect x={350} y={30} width={100} height={40} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                <text x={400} y={55} textAnchor="middle" className="text-sm fill-white font-semibold">
                  Input Tokens
                </text>
              </motion.g>
              
              {/* Embedding Layer */}
              <motion.g
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <path d="M 400 70 L 400 95" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                
                <rect x={330} y={95} width={140} height={50} fill="#22d3ee" stroke="#06b6d4" strokeWidth={3} rx={8} />
                <text x={400} y={115} textAnchor="middle" className="text-sm fill-white font-semibold">
                  Embedding Layer
                </text>
                <text x={400} y={132} textAnchor="middle" className="text-xs fill-white">
                  + Embedding Dropout
                </text>
                
                <text x={490} y={120} className="text-xs fill-red-600 font-bold">← Dropout</text>
              </motion.g>
              
              {/* LSTM Layers */}
              {[0, 1, 2].map((layer) => {
                const y = 180 + layer * 100;
                
                return (
                  <motion.g
                    key={layer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + layer * 0.2 }}
                  >
                    <path d={`M 400 ${y - 35} L 400 ${y - 10}`} stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                    
                    <rect x={310} y={y - 10} width={180} height={70} fill="#8b5cf6" stroke="#7c3aed" strokeWidth={3} rx={8} />
                    <text x={400} y={y + 15} textAnchor="middle" className="text-sm fill-white font-semibold">
                      LSTM Layer {layer + 1}
                    </text>
                    <text x={400} y={y + 35} textAnchor="middle" className="text-xs fill-white">
                      + Hidden Dropout
                    </text>
                    
                    {/* Regularization labels */}
                    <text x={510} y={y + 10} className="text-xs fill-red-600 font-bold">← Weight Drop</text>
                    <text x={510} y={y + 25} className="text-xs fill-pink-600 font-bold">← AR</text>
                    <text x={510} y={y + 40} className="text-xs fill-purple-600 font-bold">← TAR</text>
                  </motion.g>
                );
              })}
              
              {/* Output Layer */}
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <path d="M 400 450 L 400 475" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                
                <rect x={330} y={475} width={140} height={50} fill="#ef4444" stroke="#dc2626" strokeWidth={3} rx={8} />
                <text x={400} y={495} textAnchor="middle" className="text-sm fill-white font-semibold">
                  Output Layer
                </text>
                <text x={400} y={512} textAnchor="middle" className="text-xs fill-white">
                  + Weight Decay
                </text>
                
                <text x={490} y={500} className="text-xs fill-blue-600 font-bold">← Weight Decay</text>
              </motion.g>
              
              {/* Legend box */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <rect x={20} y={180} width={220} height={150} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} rx={5} />
                <text x={130} y={205} textAnchor="middle" className="text-sm font-bold fill-gray-800">
                  Regularization Used
                </text>
                
                <text x={30} y={230} className="text-xs fill-gray-700">• Dropout (embeddings, hidden)</text>
                <text x={30} y={250} className="text-xs fill-gray-700">• Weight Dropout</text>
                <text x={30} y={270} className="text-xs fill-gray-700">• Activation Reg (AR)</text>
                <text x={30} y={290} className="text-xs fill-gray-700">• Temporal AR (TAR)</text>
                <text x={30} y={310} className="text-xs fill-gray-700">• Weight Decay (L2)</text>
              </motion.g>
              
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#374151" />
                </marker>
              </defs>
            </svg>
          </motion.div>

          {/* Key innovations */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300">
              <h4 className="text-lg font-bold text-purple-800 mb-3">Weight Dropout</h4>
              <p className="text-sm text-gray-700">
                Instead of dropping activations, dropout is applied to the <span className="font-semibold">recurrent weights</span> themselves. 
                Same mask is used across all time steps.
              </p>
            </div>
            
            <div className="bg-indigo-100 p-6 rounded-lg border-2 border-indigo-300">
              <h4 className="text-lg font-bold text-indigo-800 mb-3">Multiple Dropouts</h4>
              <p className="text-sm text-gray-700">
                Different dropout rates at different places: embedding dropout, hidden-to-hidden dropout, 
                and output dropout—all tuned separately!
              </p>
            </div>
            
            <div className="bg-violet-100 p-6 rounded-lg border-2 border-violet-300">
              <h4 className="text-lg font-bold text-violet-800 mb-3">Combined Regularization</h4>
              <p className="text-sm text-gray-700">
                Uses AR, TAR, weight decay, and dropout together. Each targets a different aspect of overfitting, 
                making them complementary.
              </p>
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div
            className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg border-2 border-purple-300 max-w-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <h4 className="text-2xl font-bold text-purple-800 mb-4 text-center">The Result</h4>
            <p className="text-lg text-gray-700 text-center mb-4">
              AWD-LSTM achieved <span className="font-bold text-purple-700">state-of-the-art results</span> on language modeling 
              benchmarks before the Transformer era.
            </p>
            <p className="text-gray-600 text-center">
              It demonstrated that careful regularization and optimization of RNN architectures could achieve remarkable performance, 
              paving the way for modern language models.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

