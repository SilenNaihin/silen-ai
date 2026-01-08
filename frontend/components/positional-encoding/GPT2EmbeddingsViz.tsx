'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface GPT2EmbeddingsVizProps {
  className?: string;
}

/**
 * Visualization of GPT-2 learned positional embeddings.
 *
 * Shows:
 * 1. A conceptual lookup table diagram
 * 2. A heatmap of the actual embedding matrix (simulated)
 * 3. How position lookup works in a transformer
 */
export function GPT2EmbeddingsViz({ className = '' }: GPT2EmbeddingsVizProps) {
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<'lookup' | 'heatmap'>('lookup');

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* View toggle */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setSelectedView('lookup')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            selectedView === 'lookup'
              ? 'bg-neutral-100 text-black'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          Lookup Table
        </button>
        <button
          onClick={() => setSelectedView('heatmap')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            selectedView === 'heatmap'
              ? 'bg-neutral-100 text-black'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          Embedding Matrix
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {selectedView === 'lookup' ? (
          <LookupTableView
            hoveredPosition={hoveredPosition}
            setHoveredPosition={setHoveredPosition}
          />
        ) : (
          <HeatmapView
            hoveredPosition={hoveredPosition}
            setHoveredPosition={setHoveredPosition}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Conceptual lookup table view
 */
function LookupTableView({
  hoveredPosition,
  setHoveredPosition,
}: {
  hoveredPosition: number | null;
  setHoveredPosition: (pos: number | null) => void;
}) {
  const positions = [0, 1, 2, 3, '...', 1021, 1022, 1023];

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        GPT-2 uses a simple lookup table with 1024 learned position embeddings.
      </p>

      {/* Lookup table diagram */}
      <div className="flex items-center gap-4">
        {/* Position index */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-neutral-500 mb-2">Position</span>
          <div className="flex flex-col gap-1">
            {positions.map((pos, i) => (
              <motion.div
                key={i}
                className={`w-12 h-8 flex items-center justify-center text-sm font-mono rounded transition-colors ${
                  hoveredPosition === pos
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
                onMouseEnter={() => typeof pos === 'number' && setHoveredPosition(pos)}
                onMouseLeave={() => setHoveredPosition(null)}
              >
                {pos}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-neutral-400 text-2xl">→</span>
          <span className="text-xs text-neutral-400">lookup</span>
        </div>

        {/* Embedding vectors */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-neutral-500 mb-2">Embedding (768-dim)</span>
          <div className="flex flex-col gap-1">
            {positions.map((pos, i) => (
              <motion.div
                key={i}
                className={`h-8 flex items-center gap-0.5 rounded px-2 transition-colors ${
                  hoveredPosition === pos
                    ? 'bg-purple-50'
                    : 'bg-neutral-50'
                }`}
                onMouseEnter={() => typeof pos === 'number' && setHoveredPosition(pos)}
                onMouseLeave={() => setHoveredPosition(null)}
              >
                {pos === '...' ? (
                  <span className="text-neutral-400">...</span>
                ) : (
                  <>
                    {[0, 1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className={`w-4 h-4 rounded-sm ${
                          hoveredPosition === pos
                            ? 'bg-purple-300'
                            : 'bg-neutral-200'
                        }`}
                        style={{
                          opacity: 0.4 + Math.random() * 0.6,
                        }}
                      />
                    ))}
                    <span className="text-neutral-400 text-xs ml-1">...</span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Code example */}
      <div className="bg-neutral-50 rounded p-3 font-mono text-xs">
        <span className="text-purple-600">class</span>{' '}
        <span className="text-amber-600">GPT2PositionalEmbedding</span>
        <span className="text-neutral-600">(nn.Module):</span>
        <br />
        <span className="text-neutral-400 ml-4"># Learned lookup table</span>
        <br />
        <span className="text-neutral-600 ml-4">self.wpe = nn.Embedding(</span>
        <span className="text-blue-600">1024</span>
        <span className="text-neutral-600">, </span>
        <span className="text-blue-600">768</span>
        <span className="text-neutral-600">)</span>
      </div>

      <p className="text-xs text-neutral-500">
        Limitation: Cannot handle sequences longer than 1024 tokens
      </p>
    </div>
  );
}

/**
 * Heatmap view of the embedding matrix
 */
function HeatmapView({
  hoveredPosition,
  setHoveredPosition,
}: {
  hoveredPosition: number | null;
  setHoveredPosition: (pos: number | null) => void;
}) {
  // Generate simulated embedding data (in reality, this would be actual GPT-2 weights)
  const embeddingData = useMemo(() => {
    const data: number[][] = [];
    const positions = 50; // Show first 50 positions
    const dims = 32; // Show first 32 dimensions

    for (let pos = 0; pos < positions; pos++) {
      const row: number[] = [];
      for (let dim = 0; dim < dims; dim++) {
        // Create smooth, position-dependent patterns (simulating learned embeddings)
        const value =
          Math.sin(pos * 0.1 + dim * 0.2) * 0.5 +
          Math.cos(pos * 0.05 - dim * 0.1) * 0.3 +
          (Math.random() - 0.5) * 0.2;
        row.push(value);
      }
      data.push(row);
    }
    return data;
  }, []);

  const getColor = (value: number) => {
    // Blue for negative, white for zero, red for positive
    const normalized = (value + 1) / 2; // Map [-1, 1] to [0, 1]
    if (normalized < 0.5) {
      const intensity = Math.floor((0.5 - normalized) * 2 * 255);
      return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
    } else {
      const intensity = Math.floor((normalized - 0.5) * 2 * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Visualization of learned position embeddings (first 50 positions, 32 dims).
      </p>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Dimension labels */}
          <div className="flex ml-8 mb-1">
            <span className="text-[10px] text-neutral-400">Dimension →</span>
          </div>

          <div className="flex">
            {/* Position labels */}
            <div className="flex flex-col mr-1">
              <span className="text-[10px] text-neutral-400 -rotate-90 translate-y-8">
                Position ↓
              </span>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-px">
              {embeddingData.map((row, pos) => (
                <div
                  key={pos}
                  className="flex gap-px"
                  onMouseEnter={() => setHoveredPosition(pos)}
                  onMouseLeave={() => setHoveredPosition(null)}
                >
                  {row.map((value, dim) => (
                    <div
                      key={dim}
                      className={`w-2 h-2 rounded-sm transition-all ${
                        hoveredPosition === pos ? 'ring-1 ring-purple-400' : ''
                      }`}
                      style={{ backgroundColor: getColor(value) }}
                      title={`pos=${pos}, dim=${dim}, val=${value.toFixed(3)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color scale */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span>-1</span>
        <div className="w-32 h-3 rounded" style={{
          background: 'linear-gradient(to right, rgb(0,0,255), rgb(255,255,255), rgb(255,0,0))'
        }} />
        <span>+1</span>
      </div>

      {/* Hover info */}
      {hoveredPosition !== null && (
        <div className="text-sm text-neutral-600">
          Position <span className="font-mono font-semibold">{hoveredPosition}</span>
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Note: Actual GPT-2 embeddings are 768-dimensional. This is a simplified visualization.
      </p>
    </div>
  );
}

/**
 * Transformer implementation code snippet
 */
export function GPT2ImplementationCode() {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-xs overflow-x-auto">
      <pre className="text-neutral-800">
{`class GPT2Model(nn.Module):
    def __init__(self, config):
        super().__init__()
        # Token embeddings
        self.wte = nn.Embedding(config.vocab_size, config.n_embd)
        # Position embeddings (learned!)
        self.wpe = nn.Embedding(config.n_positions, config.n_embd)

    def forward(self, input_ids):
        # Get token embeddings
        token_emb = self.wte(input_ids)

        # Get position embeddings
        positions = torch.arange(input_ids.size(1))
        pos_emb = self.wpe(positions)

        # Add them together
        hidden = token_emb + pos_emb
        return hidden`}
      </pre>
    </div>
  );
}
