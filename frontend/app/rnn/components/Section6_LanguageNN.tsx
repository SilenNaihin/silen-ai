'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { NetworkLayer } from './NetworkLayer';

export const Section6_LanguageNN = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const layerOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
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
              Simple Language Neural Network
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Let&apos;s build a simple network for language. We feed in token IDs and predict the next token.
            </p>
            <p className="text-lg text-gray-600">
              This is a basic <span className="font-semibold text-purple-700">feedforward network</span>—
              it processes each input independently without any memory.
            </p>
          </motion.div>

          {/* Network Visualization */}
          <motion.div
            style={{ opacity: layerOpacity }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="700" height="500" className="mx-auto">
              <NetworkLayer
                x={150}
                y={250}
                nodeCount={3}
                label="Input (Token IDs)"
                nodeSize={35}
              />
              <NetworkLayer
                x={350}
                y={250}
                nodeCount={4}
                label="Hidden Layer"
                connectToPrevious={true}
                previousLayer={{ x: 150, y: 250, nodeCount: 3, spacing: 80 }}
                nodeSize={35}
              />
              <NetworkLayer
                x={550}
                y={250}
                nodeCount={3}
                label="Output (Probabilities)"
                connectToPrevious={true}
                previousLayer={{ x: 350, y: 250, nodeCount: 4, spacing: 80 }}
                nodeSize={35}
              />
            </svg>
          </motion.div>

          {/* Problem callout */}
          <motion.div
            className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-bold text-purple-800">Problem:</span> Each token ID is just a number (1, 2, 3...).
            </p>
            <p className="text-gray-600">
              The model might think token 3 is &quot;closer&quot; to token 2 than token 1, but that&apos;s just arbitrary! 
              We need a better representation.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

