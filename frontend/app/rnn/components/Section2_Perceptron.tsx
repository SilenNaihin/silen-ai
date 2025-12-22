'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { Perceptron } from './Perceptron';

export const Section2_Perceptron = () => {
  const { ref, scrollYProgress } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50">
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
              The Perceptron
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Inspired by biological neurons, Frank Rosenblatt created the <span className="font-semibold text-blue-700">perceptron</span> in 1958—
              the first artificial neuron.
            </p>
            <p className="text-lg text-gray-600">
              It takes multiple inputs, multiplies each by a weight, sums them up, and applies an activation function.
            </p>
          </motion.div>

          {/* Perceptron Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Perceptron progress={scrollYProgress} showWeights={true} />
          </motion.div>

          {/* Formula */}
          <motion.div
            className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-2xl font-mono text-center">
              y = σ(w₁x₁ + w₂x₂ + w₃x₃ + b)
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              where σ is the activation function (e.g., sigmoid, ReLU)
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

