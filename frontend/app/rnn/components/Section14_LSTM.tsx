'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { LSTMCell } from './LSTMCell';

export const Section14_LSTM = () => {
  const { ref, scrollYProgress } = useScrollProgress();

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lime-50 to-emerald-50">
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
              The Complete LSTM
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Now we have all the pieces! The <span className="font-semibold text-emerald-700">LSTM</span> maintains 
              a separate cell state that flows almost unchanged through time.
            </p>
            <p className="text-lg text-gray-600">
              This &quot;memory highway&quot; allows gradients to flow backward without vanishing, 
              enabling the network to learn long-term dependencies.
            </p>
          </motion.div>

          {/* LSTM Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <LSTMCell
              x={400}
              y={200}
              progress={scrollYProgress}
              showForgetGate={true}
              showInputGate={true}
              showOutputGate={true}
              showCellState={true}
            />
          </motion.div>

          {/* Key advantages */}
          <motion.div
            className="w-full max-w-5xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center text-gray-800">Why LSTMs Work</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-100 p-6 rounded-lg border-2 border-emerald-300">
                <h4 className="text-xl font-bold text-emerald-800 mb-3">✓ Long-Term Memory</h4>
                <p className="text-gray-700">
                  The cell state can carry information across hundreds of time steps without degradation, 
                  solving the vanishing gradient problem.
                </p>
              </div>
              
              <div className="bg-teal-100 p-6 rounded-lg border-2 border-teal-300">
                <h4 className="text-xl font-bold text-teal-800 mb-3">✓ Selective Memory</h4>
                <p className="text-gray-700">
                  The gates learn what&apos;s important to remember and what to forget, 
                  making the network more efficient than a simple RNN.
                </p>
              </div>
              
              <div className="bg-cyan-100 p-6 rounded-lg border-2 border-cyan-300">
                <h4 className="text-xl font-bold text-cyan-800 mb-3">✓ Gradient Flow</h4>
                <p className="text-gray-700">
                  The cell state provides a direct path for gradients to flow backward, 
                  with minimal multiplication operations that could cause vanishing.
                </p>
              </div>
              
              <div className="bg-sky-100 p-6 rounded-lg border-2 border-sky-300">
                <h4 className="text-xl font-bold text-sky-800 mb-3">✓ Learned Control</h4>
                <p className="text-gray-700">
                  All three gates are learned during training, allowing the network to discover 
                  what patterns of forgetting and remembering work best for the task.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mathematical overview */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg border-2 border-emerald-200 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">LSTM Equations</h4>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-gray-700">f_t = σ(W_f · [h_(t-1), x_t] + b_f)  <span className="text-red-600 font-sans text-xs ml-2">← forget gate</span></p>
              <p className="text-gray-700">i_t = σ(W_i · [h_(t-1), x_t] + b_i)  <span className="text-green-600 font-sans text-xs ml-2">← input gate</span></p>
              <p className="text-gray-700">C̃_t = tanh(W_C · [h_(t-1), x_t] + b_C)  <span className="text-blue-600 font-sans text-xs ml-2">← candidate</span></p>
              <p className="text-gray-700">C_t = f_t ⊙ C_(t-1) + i_t ⊙ C̃_t  <span className="text-purple-600 font-sans text-xs ml-2">← new cell state</span></p>
              <p className="text-gray-700">o_t = σ(W_o · [h_(t-1), x_t] + b_o)  <span className="text-orange-600 font-sans text-xs ml-2">← output gate</span></p>
              <p className="text-gray-700">h_t = o_t ⊙ tanh(C_t)  <span className="text-amber-600 font-sans text-xs ml-2">← hidden state</span></p>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">⊙ denotes element-wise multiplication</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

