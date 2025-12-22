'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';
import { useState, useEffect } from 'react';

export const Section13_LSTMBuildUp = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  const [step, setStep] = useState(0);
  
  const forgetGateOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const inputGateOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const outputGateOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-lime-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
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
              Building Up to LSTM
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              The <span className="font-semibold text-lime-700">Long Short-Term Memory (LSTM)</span> solves the vanishing gradient problem 
              with a clever gating mechanism.
            </p>
            <p className="text-lg text-gray-600">
              Let&apos;s add the components one by one to see how it works.
            </p>
          </motion.div>

          {/* LSTM Build-up Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-white p-8 rounded-lg shadow-lg border-2 border-lime-200"
          >
            <svg width="600" height="450" className="mx-auto">
              {/* Cell state (highway) */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={50} y1={100} x2={550} y2={100} stroke="#8b5cf6" strokeWidth={6} />
                <text x={300} y={85} textAnchor="middle" className="text-sm font-bold fill-purple-700">
                  Cell State (C_t) — the &quot;memory highway&quot;
                </text>
              </motion.g>
              
              {/* Main cell boundary */}
              <rect x={180} y={150} width={240} height={200} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5,5" rx={10} />
              
              {/* Forget gate */}
              <motion.g style={{ opacity: forgetGateOpacity }}>
                <circle cx={220} cy={250} r={35} fill="#ef4444" stroke="#991b1b" strokeWidth={3} />
                <text x={220} y={255} textAnchor="middle" className="text-2xl fill-white font-bold">
                  σ
                </text>
                <text x={220} y={310} textAnchor="middle" className="text-sm font-bold fill-red-700">
                  Forget Gate
                </text>
                <text x={220} y={330} textAnchor="middle" className="text-xs fill-gray-600">
                  What to forget?
                </text>
                
                {/* Connection to cell state */}
                <path d="M 220 215 L 220 100" stroke="#ef4444" strokeWidth={2} markerEnd="url(#arrowRed)" />
                <circle cx={220} cy={100} r={8} fill="#ef4444" />
                <text x={230} y={155} className="text-lg">×</text>
              </motion.g>
              
              {/* Input gate */}
              <motion.g style={{ opacity: inputGateOpacity }}>
                <circle cx={300} cy={250} r={35} fill="#10b981" stroke="#065f46" strokeWidth={3} />
                <text x={300} y={255} textAnchor="middle" className="text-2xl fill-white font-bold">
                  σ
                </text>
                <text x={300} y={310} textAnchor="middle" className="text-sm font-bold fill-green-700">
                  Input Gate
                </text>
                <text x={300} y={330} textAnchor="middle" className="text-xs fill-gray-600">
                  What to remember?
                </text>
                
                {/* Connection to cell state */}
                <path d="M 300 215 L 300 100" stroke="#10b981" strokeWidth={2} markerEnd="url(#arrowGreen)" />
                <circle cx={300} cy={100} r={8} fill="#10b981" />
                <text x={310} y={155} className="text-lg">+</text>
              </motion.g>
              
              {/* Output gate */}
              <motion.g style={{ opacity: outputGateOpacity }}>
                <circle cx={380} cy={250} r={35} fill="#f59e0b" stroke="#92400e" strokeWidth={3} />
                <text x={380} y={255} textAnchor="middle" className="text-2xl fill-white font-bold">
                  σ
                </text>
                <text x={380} y={310} textAnchor="middle" className="text-sm font-bold fill-amber-700">
                  Output Gate
                </text>
                <text x={380} y={330} textAnchor="middle" className="text-xs fill-gray-600">
                  What to output?
                </text>
                
                {/* Connection from cell state */}
                <path d="M 380 100 L 380 170" stroke="#f59e0b" strokeWidth={2} />
                <path d="M 380 170 L 380 215" stroke="#f59e0b" strokeWidth={2} markerEnd="url(#arrowOrange)" />
              </motion.g>
              
              {/* Input/Output arrows */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <path d="M 100 250 L 180 250" stroke="#64748b" strokeWidth={3} markerEnd="url(#arrowGray)" />
                <text x={90} y={245} textAnchor="end" className="text-sm fill-gray-700 font-semibold">
                  input
                </text>
                
                <path d="M 420 250 L 500 250" stroke="#64748b" strokeWidth={3} markerEnd="url(#arrowGray)" />
                <text x={510} y={255} textAnchor="start" className="text-sm fill-gray-700 font-semibold">
                  output (h_t)
                </text>
              </motion.g>
              
              {/* Arrow definitions */}
              <defs>
                <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
                <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                </marker>
                <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
                </marker>
                <marker id="arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                </marker>
              </defs>
            </svg>
          </motion.div>

          {/* Gate explanations */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="bg-red-50 p-5 rounded-lg border-2 border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-2">1. Forget Gate</h4>
              <p className="text-sm text-gray-700">
                Decides what information to throw away from the cell state. Outputs 0-1 for each number in cell state.
              </p>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="text-lg font-bold text-green-800 mb-2">2. Input Gate</h4>
              <p className="text-sm text-gray-700">
                Decides what new information to store in the cell state. Creates new candidate values to add.
              </p>
            </div>
            
            <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
              <h4 className="text-lg font-bold text-amber-800 mb-2">3. Output Gate</h4>
              <p className="text-sm text-gray-700">
                Decides what to output based on cell state. Filters the cell state to produce the hidden state.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

