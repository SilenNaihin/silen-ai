'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollSection';

export const Section8_SimpleRecurrence = () => {
  const { ref, scrollYProgress } = useScrollProgress();
  
  const recurrenceOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
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
              Adding Simple Recurrence
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Our feedforward network has no memory! Each word is processed independently.
            </p>
            <p className="text-lg text-gray-600">
              Let&apos;s add <span className="font-semibold text-indigo-700">recurrence</span>—
              feeding the hidden state back into the network for the next word.
            </p>
          </motion.div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="700" height="450" className="mx-auto">
              {/* Time step 1 */}
              <g>
                <text x={150} y={50} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  t=1
                </text>
                
                {/* Input */}
                <rect x={110} y={80} width={80} height={50} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                <text x={150} y={110} textAnchor="middle" className="text-sm fill-white font-semibold">
                  &quot;The&quot;
                </text>
                
                {/* Hidden state */}
                <rect x={110} y={170} width={80} height={50} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} rx={5} />
                <text x={150} y={200} textAnchor="middle" className="text-sm fill-white font-semibold">
                  h₁
                </text>
                
                {/* Output */}
                <rect x={110} y={260} width={80} height={50} fill="#ef4444" stroke="#dc2626" strokeWidth={2} rx={5} />
                <text x={150} y={290} textAnchor="middle" className="text-sm fill-white font-semibold">
                  out₁
                </text>
                
                {/* Arrows */}
                <path d="M 150 130 L 150 170" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                <path d="M 150 220 L 150 260" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
              </g>
              
              {/* Time step 2 */}
              <g>
                <text x={350} y={50} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  t=2
                </text>
                
                {/* Input */}
                <rect x={310} y={80} width={80} height={50} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                <text x={350} y={110} textAnchor="middle" className="text-sm fill-white font-semibold">
                  &quot;cat&quot;
                </text>
                
                {/* Hidden state */}
                <rect x={310} y={170} width={80} height={50} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} rx={5} />
                <text x={350} y={200} textAnchor="middle" className="text-sm fill-white font-semibold">
                  h₂
                </text>
                
                {/* Output */}
                <rect x={310} y={260} width={80} height={50} fill="#ef4444" stroke="#dc2626" strokeWidth={2} rx={5} />
                <text x={350} y={290} textAnchor="middle" className="text-sm fill-white font-semibold">
                  out₂
                </text>
                
                {/* Arrows */}
                <path d="M 350 130 L 350 170" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                <path d="M 350 220 L 350 260" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
              </g>
              
              {/* Time step 3 */}
              <g>
                <text x={550} y={50} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  t=3
                </text>
                
                {/* Input */}
                <rect x={510} y={80} width={80} height={50} fill="#10b981" stroke="#059669" strokeWidth={2} rx={5} />
                <text x={550} y={110} textAnchor="middle" className="text-sm fill-white font-semibold">
                  &quot;sat&quot;
                </text>
                
                {/* Hidden state */}
                <rect x={510} y={170} width={80} height={50} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} rx={5} />
                <text x={550} y={200} textAnchor="middle" className="text-sm fill-white font-semibold">
                  h₃
                </text>
                
                {/* Output */}
                <rect x={510} y={260} width={80} height={50} fill="#ef4444" stroke="#dc2626" strokeWidth={2} rx={5} />
                <text x={550} y={290} textAnchor="middle" className="text-sm fill-white font-semibold">
                  out₃
                </text>
                
                {/* Arrows */}
                <path d="M 550 130 L 550 170" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
                <path d="M 550 220 L 550 260" stroke="#374151" strokeWidth={2} markerEnd="url(#arrow)" />
              </g>
              
              {/* Recurrent connections (the key addition!) */}
              <motion.g style={{ opacity: recurrenceOpacity }}>
                <path 
                  d="M 190 195 L 310 195" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  markerEnd="url(#arrowPurple)"
                />
                <path 
                  d="M 390 195 L 510 195" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  markerEnd="url(#arrowPurple)"
                />
                
                <text x={250} y={185} textAnchor="middle" className="text-sm font-bold fill-purple-700">
                  memory!
                </text>
                <text x={450} y={185} textAnchor="middle" className="text-sm font-bold fill-purple-700">
                  memory!
                </text>
              </motion.g>
              
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

          {/* Explanation */}
          <motion.div
            className="bg-indigo-100 p-6 rounded-lg border-2 border-indigo-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-lg text-gray-700 text-center">
              The hidden state <span className="font-bold">h</span> carries information from previous words, 
              giving the network <span className="font-semibold text-indigo-700">memory</span>!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

