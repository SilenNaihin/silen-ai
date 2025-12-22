'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Section15_Generalization = () => {
  const { ref } = useScrollProgress();

  // Sample data showing overfitting
  const data = [
    { epoch: 0, train: 2.5, test: 2.5 },
    { epoch: 10, train: 1.8, test: 1.9 },
    { epoch: 20, train: 1.2, test: 1.3 },
    { epoch: 30, train: 0.8, test: 1.0 },
    { epoch: 40, train: 0.5, test: 1.1 },
    { epoch: 50, train: 0.3, test: 1.3 },
    { epoch: 60, train: 0.15, test: 1.5 },
    { epoch: 70, train: 0.08, test: 1.7 },
  ];

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-cyan-50">
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
              The Generalization Problem
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              LSTMs solve the vanishing gradient problem, but we still have a challenge: <span className="font-semibold text-cyan-700">overfitting</span>.
            </p>
            <p className="text-lg text-gray-600">
              The model memorizes the training data but fails to generalize to new examples.
            </p>
          </motion.div>

          {/* Loss curve visualization */}
          <motion.div
            className="w-full bg-white p-8 rounded-lg shadow-lg border-2 border-cyan-200"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Training vs Test Loss
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="epoch" 
                    label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="train" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Training Loss"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="test" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Test Loss"
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Training loss keeps decreasing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">Test loss starts increasing (overfitting!)</span>
              </div>
            </div>
          </motion.div>

          {/* Problem explanation */}
          <motion.div
            className="grid md:grid-cols-2 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
              <h4 className="text-xl font-bold text-red-800 mb-3">❌ The Problem</h4>
              <p className="text-gray-700 mb-3">
                The model has too much capacity and memorizes training examples instead of learning general patterns.
              </p>
              <p className="text-gray-700">
                It performs great on training data but poorly on new, unseen test data.
              </p>
            </div>
            
            <div className="bg-cyan-100 p-6 rounded-lg border-2 border-cyan-300">
              <h4 className="text-xl font-bold text-cyan-800 mb-3">✓ The Solution</h4>
              <p className="text-gray-700 mb-3">
                We need <span className="font-semibold">regularization techniques</span> to prevent overfitting 
                and improve generalization.
              </p>
              <p className="text-gray-700">
                This leads us to techniques like dropout, weight decay, and more...
              </p>
            </div>
          </motion.div>

          {/* Example */}
          <motion.div
            className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h4 className="text-lg font-bold text-blue-800 mb-3 text-center">Real-World Analogy</h4>
            <p className="text-gray-700">
              Imagine studying for an exam by <span className="font-semibold">memorizing</span> all the practice problems 
              without understanding the underlying concepts. You&apos;d ace questions identical to practice problems 
              but fail on slightly different ones. That&apos;s overfitting!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

