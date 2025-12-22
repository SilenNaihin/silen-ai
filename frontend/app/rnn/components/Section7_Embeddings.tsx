'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section7_Embeddings = () => {
  const { ref } = useScrollProgress();

  const words = [
    { word: "cat", vec: [0.8, 0.9, 0.1], color: "#ef4444" },
    { word: "dog", vec: [0.7, 0.85, 0.15], color: "#f97316" },
    { word: "car", vec: [0.2, 0.1, 0.9], color: "#3b82f6" },
  ];

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800">
              Embeddings
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Instead of using token IDs directly, we map each token to a <span className="font-semibold text-blue-700">dense vector</span> of real numbers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              These vectors capture semantic meaning—similar words have similar vectors!
            </p>
            
            <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300">
              <p className="text-lg font-mono mb-3">
                &quot;cat&quot; → [0.8, 0.9, 0.1, ...]
              </p>
              <p className="text-lg font-mono">
                &quot;dog&quot; → [0.7, 0.85, 0.15, ...]
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Notice how &quot;cat&quot; and &quot;dog&quot; have similar values!
              </p>
            </div>
            
            <p className="text-gray-600">
              The embedding layer is <span className="font-semibold">learned during training</span>, 
              allowing the model to discover meaningful representations.
            </p>
          </motion.div>

          {/* 3D Embedding Space Visualization */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="400" height="400" viewBox="0 0 400 400">
              {/* Axes */}
              <line x1={200} y1={300} x2={200} y2={100} stroke="#9ca3af" strokeWidth={2} />
              <line x1={50} y1={300} x2={350} y2={300} stroke="#9ca3af" strokeWidth={2} />
              <line x1={200} y1={300} x2={120} y2={350} stroke="#9ca3af" strokeWidth={2} />
              
              {/* Axis labels */}
              <text x={210} y={95} className="text-xs fill-gray-600">dim 1</text>
              <text x={355} y={305} className="text-xs fill-gray-600">dim 2</text>
              <text x={110} y={360} className="text-xs fill-gray-600">dim 3</text>
              
              {/* Plot words as points */}
              {words.map((item, idx) => {
                const x = 200 + item.vec[1] * 120;
                const y = 300 - item.vec[0] * 150;
                
                return (
                  <motion.g
                    key={item.word}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.2, type: 'spring' }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={12}
                      fill={item.color}
                      stroke="white"
                      strokeWidth={3}
                    />
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill={item.color}
                    >
                      {item.word}
                    </text>
                    
                    {/* Vector components */}
                    <text
                      x={x + 20}
                      y={y + 5}
                      className="text-xs fill-gray-600"
                    >
                      [{item.vec.join(', ')}]
                    </text>
                  </motion.g>
                );
              })}
              
              {/* Connection line between cat and dog */}
              <motion.line
                x1={200 + words[0].vec[1] * 120}
                y1={300 - words[0].vec[0] * 150}
                x2={200 + words[1].vec[1] * 120}
                y2={300 - words[1].vec[0] * 150}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
              
              <motion.text
                x={200}
                y={180}
                textAnchor="middle"
                className="text-xs fill-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                similar vectors
              </motion.text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

