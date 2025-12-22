'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section10_FullRNN = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const unrollProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col items-center gap-12">
          {/* Text Content */}
          <motion.div 
            className="text-center space-y-4 max-w-3xl"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800">
              Full RNN Architecture
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Let&apos;s see the complete picture: <span className="font-semibold text-fuchsia-700">unrolling the RNN through time</span>.
            </p>
            <p className="text-lg text-gray-600">
              Each time step uses the <span className="font-semibold">same weight matrices</span> (shown as shared connections), 
              creating a deep network through time!
            </p>
          </motion.div>

          {/* Full RNN Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full overflow-x-auto"
          >
            <svg width="900" height="550" className="mx-auto">
              {/* Layer labels */}
              <text x={30} y={150} className="text-sm font-bold fill-gray-600">Embedding</text>
              <text x={30} y={280} className="text-sm font-bold fill-gray-600">RNN Layer</text>
              <text x={30} y={410} className="text-sm font-bold fill-gray-600">Output</text>
              
              {/* Time steps */}
              {[0, 1, 2, 3].map((t) => {
                const x = 200 + t * 180;
                
                return (
                  <motion.g
                    key={t}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + t * 0.2, duration: 0.6 }}
                  >
                    {/* Time label */}
                    <text x={x} y={50} textAnchor="middle" className="text-lg font-bold fill-gray-700">
                      t = {t + 1}
                    </text>
                    
                    {/* Input token */}
                    <rect x={x - 35} y={80} width={70} height={35} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                    <text x={x} y={102} textAnchor="middle" className="text-sm fill-white font-semibold">
                      x_{t + 1}
                    </text>
                    
                    {/* Embedding */}
                    <rect x={x - 35} y={140} width={70} height={35} fill="#22d3ee" stroke="#06b6d4" strokeWidth={2} rx={5} />
                    <text x={x} y={162} textAnchor="middle" className="text-sm fill-white font-semibold">
                      E(x_{t + 1})
                    </text>
                    
                    {/* RNN cell */}
                    <rect x={x - 40} y={240} width={80} height={60} fill="#3b82f6" stroke="#2563eb" strokeWidth={3} rx={8} />
                    <text x={x} y={265} textAnchor="middle" className="text-xs fill-white">RNN</text>
                    <text x={x} y={282} textAnchor="middle" className="text-sm fill-white font-semibold">
                      h_{t + 1}
                    </text>
                    
                    {/* Output/Linear layer */}
                    <rect x={x - 35} y={370} width={70} height={35} fill="#ef4444" stroke="#dc2626" strokeWidth={2} rx={5} />
                    <text x={x} y={392} textAnchor="middle" className="text-sm fill-white font-semibold">
                      ŷ_{t + 1}
                    </text>
                    
                    {/* Vertical connections */}
                    <path d={`M ${x} 115 L ${x} 140`} stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                    <path d={`M ${x} 175 L ${x} 240`} stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                    <path d={`M ${x} 300 L ${x} 370`} stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                    
                    {/* Recurrent connections */}
                    {t < 3 && (
                      <motion.g style={{ opacity: unrollProgress }}>
                        <path
                          d={`M ${x + 40} 270 L ${x + 140} 270`}
                          stroke="#8b5cf6"
                          strokeWidth={4}
                          markerEnd="url(#arrowPurple)"
                        />
                        <text
                          x={x + 90}
                          y={260}
                          textAnchor="middle"
                          className="text-xs fill-purple-700 font-semibold"
                        >
                          same W
                        </text>
                      </motion.g>
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
            </svg>
          </motion.div>

          {/* Key points */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Weight Sharing</h3>
              <p className="text-gray-700">
                The same weight matrix <strong>W</strong> is used at every time step, 
                making the model efficient and able to handle sequences of any length.
              </p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Hidden State Flow</h3>
              <p className="text-gray-700">
                Information flows from h₁ → h₂ → h₃ → h₄, allowing the network 
                to build up context and remember earlier tokens.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

