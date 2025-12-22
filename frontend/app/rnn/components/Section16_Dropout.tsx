'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section16_Dropout = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const dropoutOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-sky-50">
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
              Dropout & Weight Decay
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Two powerful regularization techniques to combat overfitting.
            </p>
          </motion.div>

          {/* Dropout Visualization */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Without Dropout */}
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4 text-center">Without Dropout</h3>
                <svg width="300" height="300" className="mx-auto">
                  {/* Layer 1 */}
                  {[0, 1, 2, 3].map((i) => {
                    const y = 50 + i * 60;
                    return (
                      <g key={`l1-${i}`}>
                        <circle cx={80} cy={y} r={20} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} />
                        
                        {/* Connections to next layer */}
                        {[0, 1, 2].map((j) => {
                          const targetY = 80 + j * 70;
                          return (
                            <line
                              key={`c-${i}-${j}`}
                              x1={100}
                              y1={y}
                              x2={200}
                              y2={targetY}
                              stroke="#94a3b8"
                              strokeWidth={1}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                  
                  {/* Layer 2 */}
                  {[0, 1, 2].map((i) => {
                    const y = 80 + i * 70;
                    return (
                      <circle
                        key={`l2-${i}`}
                        cx={220}
                        cy={y}
                        r={20}
                        fill="#3b82f6"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>
                <p className="text-sm text-gray-600 text-center mt-2">
                  All neurons active—risk of co-adaptation
                </p>
              </div>

              {/* With Dropout */}
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-700 mb-4 text-center">With Dropout (50%)</h3>
                <motion.svg width="300" height="300" className="mx-auto" style={{ opacity: dropoutOpacity }}>
                  {/* Layer 1 */}
                  {[0, 1, 2, 3].map((i) => {
                    const y = 50 + i * 60;
                    const dropped = i === 1 || i === 3;
                    
                    return (
                      <g key={`l1-${i}`}>
                        <motion.circle
                          cx={80}
                          cy={y}
                          r={20}
                          fill={dropped ? "#e5e7eb" : "#10b981"}
                          stroke={dropped ? "#9ca3af" : "#059669"}
                          strokeWidth={2}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: dropped ? 0.3 : 1 }}
                        />
                        
                        {/* Connections to next layer */}
                        {!dropped && [0, 2].map((j) => {
                          const targetY = 80 + j * 70;
                          return (
                            <line
                              key={`c-${i}-${j}`}
                              x1={100}
                              y1={y}
                              x2={200}
                              y2={targetY}
                              stroke="#94a3b8"
                              strokeWidth={1}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                  
                  {/* Layer 2 */}
                  {[0, 1, 2].map((i) => {
                    const y = 80 + i * 70;
                    const dropped = i === 1;
                    
                    return (
                      <motion.circle
                        key={`l2-${i}`}
                        cx={220}
                        cy={y}
                        r={20}
                        fill={dropped ? "#e5e7eb" : "#10b981"}
                        stroke={dropped ? "#9ca3af" : "#059669"}
                        strokeWidth={2}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: dropped ? 0.3 : 1 }}
                      />
                    );
                  })}
                </motion.svg>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Random neurons dropped each batch—forces robustness
                </p>
              </div>
            </div>
          </motion.div>

          {/* Explanations */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
              <h4 className="text-xl font-bold text-green-800 mb-3">Dropout</h4>
              <p className="text-gray-700 mb-3">
                During training, randomly &quot;drop&quot; (set to zero) a fraction of neuron activations.
              </p>
              <p className="text-gray-700 mb-3">
                <span className="font-semibold">Why it works:</span> Prevents neurons from co-adapting too much, 
                forcing the network to learn more robust features.
              </p>
              <p className="text-sm text-gray-600 italic">
                Like training an ensemble of networks that share weights!
              </p>
            </div>
            
            <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300">
              <h4 className="text-xl font-bold text-blue-800 mb-3">Weight Decay (L2 Regularization)</h4>
              <p className="text-gray-700 mb-3">
                Add a penalty term to the loss function that punishes large weights.
              </p>
              <div className="bg-white p-3 rounded font-mono text-sm mb-3">
                L_total = L_original + λ × Σw²
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Why it works:</span> Encourages the model to use simpler, 
                smaller weights, reducing overfitting.
              </p>
            </div>
          </motion.div>

          {/* Where they slot in */}
          <motion.div
            className="bg-sky-100 p-6 rounded-lg border-2 border-sky-300 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h4 className="text-lg font-bold text-sky-800 mb-3 text-center">Where They Fit in the Network</h4>
            <p className="text-gray-700 text-center mb-2">
              <span className="font-semibold">Dropout:</span> Applied between layers (especially after embeddings and hidden states)
            </p>
            <p className="text-gray-700 text-center">
              <span className="font-semibold">Weight Decay:</span> Applied during optimization (affects all weight updates)
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

