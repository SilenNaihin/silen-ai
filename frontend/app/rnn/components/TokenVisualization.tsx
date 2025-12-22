'use client';

import { motion } from 'framer-motion';

interface TokenVisualizationProps {
  text: string;
  tokens?: string[];
  showTokens?: boolean;
  showNumbers?: boolean;
  tokenToNumber?: Record<string, number>;
}

export const TokenVisualization = ({
  text,
  tokens,
  showTokens = false,
  showNumbers = false,
  tokenToNumber = {},
}: TokenVisualizationProps) => {
  const displayTokens = tokens || text.split(' ');

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Original text */}
      <div className="text-2xl font-mono text-gray-800">
        &quot;{text}&quot;
      </div>

      {/* Tokenized view */}
      {showTokens && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {displayTokens.map((token, idx) => (
            <motion.div
              key={idx}
              className="px-4 py-2 bg-blue-100 border-2 border-blue-400 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <span className="font-mono text-lg">{token}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Numericalized view */}
      {showNumbers && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {displayTokens.map((token, idx) => (
            <motion.div
              key={idx}
              className="px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + idx * 0.1 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-xs text-gray-600">{token}</span>
                <span className="font-mono text-lg font-bold">
                  {tokenToNumber[token] ?? idx}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Arrow indicators */}
      {(showTokens || showNumbers) && (
        <div className="flex flex-col gap-2 text-center text-sm text-gray-600">
          {showTokens && !showNumbers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ↓ Tokenization
            </motion.div>
          )}
          {showNumbers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              ↓ Numericalization
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

