'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { useState, useEffect } from 'react';

export const Section3_Loss = () => {
  const { ref } = useScrollProgress();
  const [actualY] = useState(5);
  const [predictedY, setPredictedY] = useState(2);
  
  const mse = Math.pow(actualY - predictedY, 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictedY((prev) => {
        if (prev < actualY) return Math.min(prev + 0.5, actualY);
        return prev;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [actualY]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-yellow-50">
      <div className="max-w-5xl mx-auto px-8">
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
              The Loss Function
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              How do we know if our predictions are good? We need to <span className="font-semibold text-green-700">measure the error</span>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              <span className="font-semibold">Mean Squared Error (MSE)</span> is one of the simplest loss functions. 
              It measures the average squared difference between predicted and actual values.
            </p>
            
            <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
              <p className="text-2xl font-mono text-center mb-4">
                MSE = (ŷ - y)²
              </p>
              <p className="text-sm text-gray-600 text-center">
                ŷ = predicted value, y = actual value
              </p>
            </div>
            
            <p className="text-gray-600">
              The goal of training is to <span className="font-semibold text-green-700">minimize this loss</span> by adjusting the weights.
            </p>
          </motion.div>

          {/* Visualization */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="400" height="400" viewBox="0 0 400 400">
              {/* Axes */}
              <line x1={50} y1={350} x2={350} y2={350} stroke="#374151" strokeWidth={2} />
              <line x1={50} y1={350} x2={50} y2={50} stroke="#374151" strokeWidth={2} />
              
              {/* Labels */}
              <text x={200} y={385} textAnchor="middle" className="text-sm fill-gray-700">
                Sample
              </text>
              <text x={20} y={200} textAnchor="middle" className="text-sm fill-gray-700" transform="rotate(-90, 20, 200)">
                Value
              </text>
              
              {/* Actual value (constant line) */}
              <line 
                x1={50} 
                y1={350 - actualY * 40} 
                x2={350} 
                y2={350 - actualY * 40} 
                stroke="#10b981" 
                strokeWidth={3}
                strokeDasharray="5,5"
              />
              <text x={360} y={350 - actualY * 40 + 5} className="text-sm fill-green-600 font-semibold">
                y (actual)
              </text>
              
              {/* Predicted value (animating) */}
              <motion.line 
                x1={50} 
                y1={350 - predictedY * 40} 
                x2={350} 
                y2={350 - predictedY * 40} 
                stroke="#3b82f6" 
                strokeWidth={3}
                animate={{ y1: 350 - predictedY * 40, y2: 350 - predictedY * 40 }}
              />
              <motion.text 
                x={360} 
                y={350 - predictedY * 40 + 5} 
                className="text-sm fill-blue-600 font-semibold"
                animate={{ y: 350 - predictedY * 40 + 5 }}
              >
                ŷ (predicted)
              </motion.text>
              
              {/* Error visualization */}
              <motion.rect
                x={180}
                y={Math.min(350 - actualY * 40, 350 - predictedY * 40)}
                width={40}
                height={Math.abs(actualY - predictedY) * 40}
                fill="#ef4444"
                opacity={0.3}
                animate={{ 
                  y: Math.min(350 - actualY * 40, 350 - predictedY * 40),
                  height: Math.abs(actualY - predictedY) * 40 
                }}
              />
              
              {/* MSE value display */}
              <motion.text
                x={200}
                y={150}
                textAnchor="middle"
                className="text-2xl font-bold fill-red-600"
                animate={{ opacity: mse > 0.1 ? 1 : 0 }}
              >
                MSE = {mse.toFixed(2)}
              </motion.text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

