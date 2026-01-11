'use client';

import { useState, useMemo } from 'react';

interface WordEmbedding {
  word: string;
  vector: [number, number];
  category: 'animal' | 'emotion' | 'action' | 'neutral';
}

const WORDS: WordEmbedding[] = [
  { word: 'cat', vector: [0.9, 0.1], category: 'animal' },
  { word: 'dog', vector: [0.85, 0.25], category: 'animal' },
  { word: 'bird', vector: [0.75, 0.15], category: 'animal' },
  { word: 'happy', vector: [0.1, 0.9], category: 'emotion' },
  { word: 'sad', vector: [0.1, -0.8], category: 'emotion' },
  { word: 'angry', vector: [0.15, -0.6], category: 'emotion' },
  { word: 'runs', vector: [0.4, 0.35], category: 'action' },
  { word: 'sleeps', vector: [0.35, -0.1], category: 'action' },
  { word: 'the', vector: [0.0, 0.0], category: 'neutral' },
];

const CATEGORY_COLORS: Record<string, string> = {
  animal: '#2563eb',    // blue
  emotion: '#dc2626',   // red
  action: '#16a34a',    // green
  neutral: '#737373',   // gray
};

export function EmbeddingInteractive() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [showVectors, setShowVectors] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // SVG dimensions
  const width = 380;
  const height = 300;
  const padding = 50;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Scale functions
  const scaleX = (x: number) => padding + ((x + 0.2) / 1.3) * plotWidth;
  const scaleY = (y: number) => height - padding - ((y + 1) / 2) * plotHeight;

  const filteredWords = useMemo(() => {
    if (!selectedCategory) return WORDS;
    return WORDS.filter(w => w.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-neutral-50 rounded-lg p-4 my-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <button
          onClick={() => setShowVectors(!showVectors)}
          className={`px-2 py-1 rounded border transition-colors ${
            showVectors
              ? 'bg-neutral-800 text-white border-neutral-800'
              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
          }`}
        >
          {showVectors ? 'Hide' : 'Show'} Vectors
        </button>
        <div className="flex gap-1 ml-2">
          {['animal', 'emotion', 'action', 'neutral'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-2 py-1 rounded border transition-colors ${
                selectedCategory === cat
                  ? 'border-neutral-800 bg-neutral-100'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              style={{
                color: CATEGORY_COLORS[cat],
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Plot */}
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        <line
          x1={scaleX(0)} y1={padding}
          x2={scaleX(0)} y2={height - padding}
          stroke="#e5e5e5" strokeWidth={1}
        />
        <line
          x1={padding} y1={scaleY(0)}
          x2={width - padding} y2={scaleY(0)}
          stroke="#e5e5e5" strokeWidth={1}
        />

        {/* Axis labels */}
        <text x={width - padding + 5} y={scaleY(0) + 4} fontSize={10} fill="#737373">
          animal-ness
        </text>
        <text x={scaleX(0) + 5} y={padding - 5} fontSize={10} fill="#737373">
          sentiment
        </text>

        {/* Quadrant labels */}
        <text x={width - padding - 5} y={padding + 15} fontSize={9} fill="#a3a3a3" textAnchor="end">
          animals + positive
        </text>
        <text x={width - padding - 5} y={height - padding - 5} fontSize={9} fill="#a3a3a3" textAnchor="end">
          animals + negative
        </text>

        {/* Vectors from origin */}
        {showVectors && filteredWords.map(({ word, vector, category }) => {
          const isHovered = hoveredWord === word;
          const opacity = hoveredWord ? (isHovered ? 1 : 0.2) : 0.6;

          return (
            <g key={`vec-${word}`}>
              <line
                x1={scaleX(0)}
                y1={scaleY(0)}
                x2={scaleX(vector[0])}
                y2={scaleY(vector[1])}
                stroke={CATEGORY_COLORS[category]}
                strokeWidth={isHovered ? 2 : 1.5}
                opacity={opacity}
                markerEnd={`url(#arrow-${category})`}
              />
            </g>
          );
        })}

        {/* Arrow markers */}
        <defs>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <marker
              key={cat}
              id={`arrow-${cat}`}
              markerWidth={6}
              markerHeight={6}
              refX={5}
              refY={3}
              orient="auto"
            >
              <path d="M0,0 L0,6 L6,3 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* Points */}
        {filteredWords.map(({ word, vector, category }) => {
          const isHovered = hoveredWord === word;
          const x = scaleX(vector[0]);
          const y = scaleY(vector[1]);
          const opacity = hoveredWord ? (isHovered ? 1 : 0.3) : 1;

          return (
            <g
              key={word}
              onMouseEnter={() => setHoveredWord(word)}
              onMouseLeave={() => setHoveredWord(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : 5}
                fill={CATEGORY_COLORS[category]}
                opacity={opacity}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize={isHovered ? 12 : 10}
                fontWeight={isHovered ? 600 : 400}
                fill={CATEGORY_COLORS[category]}
                opacity={opacity}
              >
                {word}
              </text>
            </g>
          );
        })}

        {/* Origin point */}
        <circle cx={scaleX(0)} cy={scaleY(0)} r={3} fill="#525252" />
      </svg>

      {/* Info panel */}
      <div className="mt-3 text-xs text-neutral-500 text-center">
        {hoveredWord ? (
          <span>
            <strong className="text-neutral-700">&quot;{hoveredWord}&quot;</strong>
            {' → '}
            [{WORDS.find(w => w.word === hoveredWord)?.vector.map(v => v.toFixed(2)).join(', ')}]
          </span>
        ) : (
          <span>Hover over words to see their embedding vectors</span>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex justify-center gap-4 text-xs">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-neutral-500">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
