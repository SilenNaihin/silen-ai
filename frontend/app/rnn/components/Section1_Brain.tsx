'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { FaBrain } from 'react-icons/fa';

export const Section1_Brain = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const neuronScale = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const connectionOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <FaBrain className="text-6xl text-purple-600" />
              <h2 className="text-5xl font-bold text-gray-800">
                The Human Brain
              </h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              In 1949, Donald Hebb proposed a theory: <span className="font-semibold text-purple-700">&quot;Neurons that fire together, wire together.&quot;</span>
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              When neurons activate simultaneously, the connections between them strengthen. 
              This biological principle of learning inspired artificial neural networks.
            </p>
            <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
              <p className="text-gray-700 italic">
                &quot;The general idea is an old one, that any two cells or systems of cells that are 
                repeatedly active at the same time will tend to become &apos;associated&apos;...&quot;
              </p>
              <p className="text-sm text-gray-600 mt-2">— Donald Hebb, 1949</p>
            </div>
          </motion.div>

          {/* Neuron Animation */}
          <motion.div className="flex-1">
            <svg width="400" height="400" viewBox="0 0 400 400" className="mx-auto">
              {/* Neurons */}
              <motion.circle
                cx={150}
                cy={200}
                r={40}
                fill="#9333ea"
                style={{ scale: neuronScale }}
              />
              <motion.circle
                cx={250}
                cy={200}
                r={40}
                fill="#3b82f6"
                style={{ scale: neuronScale }}
              />
              
              {/* Connection strengthening */}
              <motion.line
                x1={190}
                y1={200}
                x2={210}
                y2={200}
                stroke="#fbbf24"
                strokeWidth={8}
                style={{ opacity: connectionOpacity }}
              />
              
              {/* Activity pulses */}
              <motion.circle
                cx={150}
                cy={200}
                r={50}
                fill="none"
                stroke="#9333ea"
                strokeWidth={3}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx={250}
                cy={200}
                r={50}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={3}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
              />
              
              {/* Labels */}
              <text x={150} y={280} textAnchor="middle" className="text-sm fill-gray-700 font-semibold">
                Neuron 1
              </text>
              <text x={250} y={280} textAnchor="middle" className="text-sm fill-gray-700 font-semibold">
                Neuron 2
              </text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

