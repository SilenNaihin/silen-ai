'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { TokenVisualization } from './TokenVisualization';
import { useState, useEffect } from 'react';

export const Section5_Tokenization = () => {
  const { ref } = useScrollProgress();
  const [showTokens, setShowTokens] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  
  const sampleText = "The cat sat on the mat";
  const tokens = ["The", "cat", "sat", "on", "the", "mat"];
  const tokenToNumber: Record<string, number> = {
    "The": 1,
    "cat": 2,
    "sat": 3,
    "on": 4,
    "the": 5,
    "mat": 6
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTokens(true), 500);
    const timer2 = setTimeout(() => setShowNumbers(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex flex-col items-center gap-12">
          {/* Text Content */}
          <motion.div 
            className="text-center space-y-6 max-w-3xl"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800">
              Tokenization & Numericalization
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Neural networks work with numbers, not text. We need to convert words into numbers.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Tokenization</h3>
                <p className="text-gray-700">
                  Breaking text into individual units (tokens)—typically words or subwords.
                </p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
                <h3 className="text-xl font-bold text-green-800 mb-2">Numericalization</h3>
                <p className="text-gray-700">
                  Mapping each unique token to a unique integer ID from a vocabulary.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visualization */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <TokenVisualization
              text={sampleText}
              tokens={tokens}
              showTokens={showTokens}
              showNumbers={showNumbers}
              tokenToNumber={tokenToNumber}
            />
          </motion.div>

          {/* Additional explanation */}
          <motion.div
            className="bg-pink-100 p-6 rounded-lg border-2 border-pink-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-gray-700 text-center">
              <span className="font-semibold">Why?</span> Neural networks process numerical tensors. 
              By converting text to numbers, we can feed language data into our models!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

