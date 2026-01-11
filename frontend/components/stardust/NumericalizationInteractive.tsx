'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface VocabEntry {
  token: string;
  id: number;
}

interface TokenMapping {
  token: string;
  id: number;
  isUnknown: boolean;
}

type AnimationPhase = 'idle' | 'tokenizing' | 'looking-up' | 'complete';

// ============================================================================
// CONSTANTS
// ============================================================================

const VOCABULARY: Record<string, number> = {
  '<PAD>': 0,
  '<UNK>': 1,
  'hello': 2,
  'world': 3,
  'i': 4,
  'love': 5,
  'this': 6,
  'movie': 7,
  'the': 8,
  'is': 9,
  'great': 10,
  'terrible': 11,
  'good': 12,
  'bad': 13,
  'amazing': 14,
};

const EXAMPLE_SENTENCES = [
  'hello world',
  'i love this movie',
  'the movie is great',
  'this is bad',
  'hello amazing world',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function getTokenId(token: string): { id: number; isUnknown: boolean } {
  const id = VOCABULARY[token];
  if (id !== undefined) {
    return { id, isUnknown: false };
  }
  return { id: VOCABULARY['<UNK>'], isUnknown: true };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface VocabularyDisplayProps {
  highlightedToken: string | null;
}

function VocabularyDisplay({ highlightedToken }: VocabularyDisplayProps) {
  const vocabEntries = Object.entries(VOCABULARY);

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
      <div className="text-xs text-neutral-500 uppercase tracking-wide mb-3">
        Vocabulary (partial)
      </div>
      <div className="flex flex-wrap gap-2">
        {vocabEntries.map(([token, id]) => (
          <motion.div
            key={token}
            className={`px-2 py-1 rounded border text-xs font-mono transition-colors ${
              highlightedToken === token
                ? 'bg-black text-white border-black'
                : 'bg-white border-neutral-300 text-neutral-700'
            }`}
            animate={{
              scale: highlightedToken === token ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {token}: {id}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface TokenLookupAnimationProps {
  mappings: TokenMapping[];
  currentIndex: number;
  phase: AnimationPhase;
}

function TokenLookupAnimation({ mappings, currentIndex, phase }: TokenLookupAnimationProps) {
  if (mappings.length === 0 || phase === 'idle') return null;

  return (
    <div className="space-y-3">
      <div className="text-xs text-neutral-500 uppercase tracking-wide">
        Token to ID Mapping
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {mappings.map((mapping, idx) => {
            const isActive = idx === currentIndex && phase === 'looking-up';
            const isCompleted = idx < currentIndex || phase === 'complete';
            const isVisible = idx <= currentIndex || phase === 'complete';

            if (!isVisible) return null;

            return (
              <motion.div
                key={`${mapping.token}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-neutral-100 border-black'
                    : isCompleted
                    ? 'bg-white border-neutral-200'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                {/* Token */}
                <div className="flex items-center gap-2 min-w-[100px]">
                  <motion.span
                    className="px-3 py-1 bg-neutral-100 border border-neutral-300 rounded font-mono text-sm"
                    animate={{
                      backgroundColor: isActive ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 245)',
                      color: isActive ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    &quot;{mapping.token}&quot;
                  </motion.span>
                </div>

                {/* Arrow */}
                <motion.div
                  className="text-neutral-400"
                  animate={{
                    scale: isActive ? [1, 1.3, 1] : 1,
                    color: isActive ? 'rgb(0, 0, 0)' : 'rgb(163, 163, 163)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>

                {/* ID */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: isCompleted || isActive ? 1 : 0,
                    scale: 1,
                  }}
                  transition={{ duration: 0.3, delay: isActive ? 0.3 : 0 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`px-3 py-1 rounded font-mono text-sm font-bold ${
                      mapping.isUnknown
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-black text-white'
                    }`}
                  >
                    {mapping.id}
                  </span>
                  {mapping.isUnknown && (
                    <span className="text-xs text-amber-600">(unknown)</span>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface FinalTensorDisplayProps {
  mappings: TokenMapping[];
  show: boolean;
}

function FinalTensorDisplay({ mappings, show }: FinalTensorDisplayProps) {
  if (!show || mappings.length === 0) return null;

  const ids = mappings.map((m) => m.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-neutral-900 text-white rounded-lg p-4"
    >
      <div className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
        Final Tensor
      </div>
      <div className="font-mono text-lg">
        <span className="text-neutral-500">[</span>
        {ids.map((id, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span className="text-white">{id}</span>
            {idx < ids.length - 1 && <span className="text-neutral-500">, </span>}
          </motion.span>
        ))}
        <span className="text-neutral-500">]</span>
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        Shape: ({ids.length},)
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface NumericalizationInteractiveProps {
  className?: string;
  initialText?: string;
}

export function NumericalizationInteractive({
  className = '',
  initialText = 'hello world',
}: NumericalizationInteractiveProps) {
  // State
  const [inputText, setInputText] = useState(initialText);
  const [mappings, setMappings] = useState<TokenMapping[]>([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(-1);
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [highlightedVocabToken, setHighlightedVocabToken] = useState<string | null>(null);

  // Ref for animation cleanup
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Convert text to IDs with animation
  const convertToIds = useCallback(async () => {
    // Reset state
    setMappings([]);
    setCurrentTokenIndex(-1);
    setHighlightedVocabToken(null);

    // Tokenize
    setPhase('tokenizing');
    const tokens = tokenizeText(inputText);

    if (tokens.length === 0) {
      setPhase('idle');
      return;
    }

    // Create mappings
    const newMappings: TokenMapping[] = tokens.map((token) => {
      const { id, isUnknown } = getTokenId(token);
      return { token, id, isUnknown };
    });

    setMappings(newMappings);
    await new Promise((r) => {
      animationRef.current = setTimeout(r, 300);
    });

    // Animate lookup for each token
    setPhase('looking-up');
    for (let i = 0; i < newMappings.length; i++) {
      setCurrentTokenIndex(i);
      setHighlightedVocabToken(
        newMappings[i].isUnknown ? '<UNK>' : newMappings[i].token
      );

      await new Promise((r) => {
        animationRef.current = setTimeout(r, 800);
      });
    }

    // Complete
    setHighlightedVocabToken(null);
    setPhase('complete');
  }, [inputText]);

  // Reset
  const reset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setMappings([]);
    setCurrentTokenIndex(-1);
    setPhase('idle');
    setHighlightedVocabToken(null);
  }, []);

  const isRunning = phase === 'tokenizing' || phase === 'looking-up';

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-4">
        <h3 className="text-lg font-semibold">Numericalization</h3>
        <p className="text-sm text-neutral-500 mt-1">
          Convert tokens to numeric IDs using a vocabulary lookup
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wide mb-2">
            Enter text
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 100))}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-neutral-100"
            placeholder="Enter text to convert..."
          />

          {/* Example sentences */}
          <div className="mt-3">
            <div className="text-xs text-neutral-500 mb-2">Try an example:</div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_SENTENCES.map((sentence, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    reset();
                    setInputText(sentence);
                  }}
                  disabled={isRunning}
                  className="text-xs px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex gap-2">
          <button
            onClick={convertToIds}
            disabled={isRunning || inputText.trim().length === 0}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Converting...' : 'Convert to IDs'}
          </button>
          {phase !== 'idle' && (
            <button
              onClick={reset}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Token Lookup Animation */}
        <TokenLookupAnimation
          mappings={mappings}
          currentIndex={currentTokenIndex}
          phase={phase}
        />

        {/* Final Tensor */}
        <FinalTensorDisplay mappings={mappings} show={phase === 'complete'} />

        {/* Vocabulary Display */}
        <VocabularyDisplay highlightedToken={highlightedVocabToken} />
      </div>
    </div>
  );
}
