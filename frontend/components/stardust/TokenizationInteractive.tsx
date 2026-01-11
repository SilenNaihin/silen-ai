'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface Token {
  text: string;
  id: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_CHAR_LENGTH = 50;

const EXAMPLE_SENTENCES = [
  'I love this movie!',
  'This is terrible',
  'The quick brown fox',
];

// ============================================================================
// TOKENIZATION
// ============================================================================

function tokenize(text: string): Token[] {
  // Word-level tokenization: split on spaces and punctuation
  const tokens: Token[] = [];
  const regex = /([a-zA-Z]+|[^\s\w])/g;
  let match;
  let id = 0;

  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      text: match[1],
      id: id++,
    });
  }

  return tokens;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TokenDisplayProps {
  tokens: Token[];
  visibleCount: number;
  isAnimating: boolean;
}

function TokenDisplay({ tokens, visibleCount, isAnimating }: TokenDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 min-h-[40px]">
      <AnimatePresence mode="popLayout">
        {tokens.slice(0, visibleCount).map((token, idx) => (
          <motion.div
            key={`${token.text}-${token.id}`}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              delay: isAnimating ? idx * 0.12 : 0,
              ease: 'easeOut'
            }}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-neutral-50 font-mono text-sm"
          >
            {token.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface TokenizationInteractiveProps {
  className?: string;
}

export function TokenizationInteractive({ className = '' }: TokenizationInteractiveProps) {
  const [inputText, setInputText] = useState('I love this movie!');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTokenized, setHasTokenized] = useState(false);

  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const runTokenization = useCallback(() => {
    // Clear previous animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    const newTokens = tokenize(inputText);
    setTokens(newTokens);
    setVisibleCount(0);
    setIsAnimating(true);
    setHasTokenized(true);

    // Animate tokens appearing one by one
    let count = 0;
    const animateNext = () => {
      if (count < newTokens.length) {
        count++;
        setVisibleCount(count);
        animationRef.current = setTimeout(animateNext, 120);
      } else {
        setIsAnimating(false);
      }
    };

    // Start animation after a brief delay
    animationRef.current = setTimeout(animateNext, 100);
  }, [inputText]);

  const handleExampleClick = useCallback((example: string) => {
    setInputText(example);
    setHasTokenized(false);
    setTokens([]);
    setVisibleCount(0);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_CHAR_LENGTH);
    setInputText(value);
    setHasTokenized(false);
    setTokens([]);
    setVisibleCount(0);
  }, []);

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-4">
        <h3 className="text-lg font-semibold">Tokenization</h3>
        <p className="text-sm text-neutral-500 mt-1">
          See how text gets broken down into tokens
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* Input Section */}
        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wide mb-2">
            Enter text to tokenize:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            disabled={isAnimating}
            maxLength={MAX_CHAR_LENGTH}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-neutral-100"
            placeholder="Enter a sentence..."
          />
          <div className="mt-1 text-xs text-neutral-400 text-right">
            {inputText.length}/{MAX_CHAR_LENGTH}
          </div>
        </div>

        {/* Example Sentences */}
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wide mr-2">
            Examples:
          </span>
          <div className="inline-flex flex-wrap gap-2 mt-1">
            {EXAMPLE_SENTENCES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                disabled={isAnimating}
                className="text-xs px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Tokenize Button */}
        <div className="flex justify-center">
          <button
            onClick={runTokenization}
            disabled={isAnimating || inputText.trim().length === 0}
            className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? 'Tokenizing...' : 'Tokenize'}
          </button>
        </div>

        {/* Tokens Display */}
        {hasTokenized && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
              Tokens:
            </div>
            <TokenDisplay
              tokens={tokens}
              visibleCount={visibleCount}
              isAnimating={isAnimating}
            />

            {/* Token Count */}
            <motion.div
              className="mt-4 text-sm text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: visibleCount === tokens.length && !isAnimating ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              Count: <span className="font-mono font-medium">{tokens.length}</span> token{tokens.length !== 1 ? 's' : ''}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
