'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section12_RNNIssues = () => {
  const { ref } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
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
              Problems with RNNs
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              RNNs have a critical flaw: they <span className="font-semibold text-amber-700">struggle with long-term dependencies</span>.
            </p>
          </motion.div>

          {/* Visualization of vanishing gradients */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Vanishing Gradient Problem</h3>
              
              <svg width="750" height="300" className="mx-auto">
                {/* Time steps */}
                {[0, 1, 2, 3, 4, 5, 6].map((t) => {
                  const x = 80 + t * 100;
                  const opacity = Math.max(0.1, 1 - t * 0.15);
                  
                  return (
                    <motion.g
                      key={t}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + t * 0.1 }}
                    >
                      {/* Cell */}
                      <rect
                        x={x - 25}
                        y={120}
                        width={50}
                        height={50}
                        fill="#3b82f6"
                        stroke="#2563eb"
                        strokeWidth={2}
                        rx={5}
                        opacity={opacity}
                      />
                      <text
                        x={x}
                        y={150}
                        textAnchor="middle"
                        className="text-xs fill-white font-semibold"
                        opacity={opacity}
                      >
                        h_{t}
                      </text>
                      
                      {/* Gradient strength indicator */}
                      <motion.rect
                        x={x - 15}
                        y={200}
                        width={30}
                        height={60}
                        fill="#ef4444"
                        opacity={opacity * 0.7}
                        rx={3}
                      />
                      <text
                        x={x}
                        y={285}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                      >
                        {(opacity * 100).toFixed(0)}%
                      </text>
                      
                      {/* Connection */}
                      {t < 6 && (
                        <path
                          d={`M ${x + 25} 145 L ${x + 75} 145`}
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          opacity={opacity}
                          markerEnd="url(#arrowPurple)"
                        />
                      )}
                    </motion.g>
                  );
                })}
                
                {/* Labels */}
                <text x={80} y={50} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  Recent
                </text>
                <text x={680} y={50} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  Long ago
                </text>
                
                {/* Gradient label */}
                <text x={375} y={25} textAnchor="middle" className="text-base font-bold fill-red-600">
                  Gradient Strength →
                </text>
                
                <defs>
                  <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                  </marker>
                </defs>
              </svg>
            </div>
          </motion.div>

          {/* Problem examples */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
              <h3 className="text-xl font-bold text-red-800 mb-3">Vanishing Gradients</h3>
              <p className="text-gray-700">
                As gradients flow backward through many time steps, they get multiplied repeatedly, 
                becoming exponentially smaller. The network &quot;forgets&quot; earlier tokens.
              </p>
            </div>
            
            <div className="bg-orange-100 p-6 rounded-lg border-2 border-orange-300">
              <h3 className="text-xl font-bold text-orange-800 mb-3">Exploding Gradients</h3>
              <p className="text-gray-700">
                Sometimes gradients can also explode, becoming so large they cause numerical instability. 
                (Often solved with gradient clipping.)
              </p>
            </div>
          </motion.div>

          {/* Example sentence */}
          <motion.div
            className="bg-amber-100 p-6 rounded-lg border-2 border-amber-300 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <p className="text-lg text-gray-700 mb-3">
              <span className="font-bold text-amber-800">Example:</span> Consider the sentence:
            </p>
            <p className="text-xl font-mono text-center bg-white p-4 rounded">
              &quot;The <span className="text-blue-600 font-bold">cat</span>, which was very fluffy and loved to play, 
              <span className="text-red-600 font-bold">was</span> sleeping.&quot;
            </p>
            <p className="text-gray-700 mt-3">
              The RNN needs to remember that &quot;cat&quot; is singular to correctly use &quot;was&quot; instead of &quot;were&quot;, 
              but by the time it gets there, that information has faded!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

