'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import { UseNotebook } from '@/contexts/NotebookContext';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import {
  TabsProvider,
  TabButtons,
  TabContent,
} from '@/components/navigation/Tabs';
import {
  TOCProvider,
  TOCHeading,
} from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import {
  PyodideProvider,
  InteractiveCode,
} from '@/components/interactive/PyodideRunner';
import { InlineCode } from '@/components/article/InlineCode';

// Visualization and article components
import {
  GPT2EmbeddingsViz,
  GPT2ImplementationCode,
} from '@/components/positional-encoding/GPT2EmbeddingsViz';
import {
  PEMatrixViz,
  PEDimensionAnalysis,
  RelativePositionViz,
} from '@/components/positional-encoding/PEMatrixViz';
import { Math, FormulaBox } from '@/components/article/Math';
import {
  Prose,
  InsightBox,
  QuoteBox,
  DataFlow,
  OrderedList,
  UnorderedList,
  MutedText,
} from '@/components/article/Callouts';
import {
  PermutationProblemAnimation,
  IntegerExplosionAnimation,
  SingleSineAnimation,
  MultiFrequencyAnimation,
  CircleTracerAnimation,
  SummaryAnimation,
  LearnedEmbeddingsAnimation,
  RotationAnimation,
  RoPEInsightAnimation,
  RoPEDimensionPairsAnimation,
  RoPEClosingAnimation,
  AdditivVsRoPEAnimation,
  ClockAnalogyAnimation,
  UniquenessAnimation,
  SmoothnessAnimation,
  FourTermsAnimation,
  GeometricProgressionAnimation,
  MagnitudePreservationAnimation,
  CleanAttentionAnimation,
} from '@/components/positional-encoding/PEAnimations';
import { TabSwitchButton } from '@/components/navigation/Tabs';

const TABS = [
  { id: 'sinusoidal', label: 'Sinusoidal PE' },
  { id: 'rope', label: 'RoPE' },
];

const NOTEBOOK_GITHUB_URL =
  'https://github.com/SilenNaihin/silen-ai/blob/main/projects/transformer/positional_emb.ipynb';

export default function PositionalEncodingArticle() {
  return (
    <TOCProvider>
      <TabsProvider tabs={TABS} defaultTab="sinusoidal">
        <PyodideProvider packages={['numpy']} autoLoad>
          <UseNotebook
            path="projects/transformer/positional_emb.ipynb"
            githubUrl={NOTEBOOK_GITHUB_URL}
          />

          <StickyHeader
            title="Positional Embeddings"
            tabs={<TabButtons variant="minimal" />}
          />

          {/* Add top padding for sticky header */}
          <div className="pt-14">
            <ArticleLayout
              leftContent={(scrollProgress) => (
                <>
                  <TabContent tabId="sinusoidal">
                    <AnimationSequence
                      scrollProgress={scrollProgress}
                      animations={[
                        {
                          // The Problem section
                          render: (p) => (
                            <PermutationProblemAnimation progress={p} />
                          ),
                          startElementId: 'the-problem',
                          overlap: 0.15,
                        },
                        {
                          // First Attempt section
                          render: (p) => (
                            <IntegerExplosionAnimation progress={p} />
                          ),
                          startElementId: 'first-attempt',
                          overlap: 0.15,
                        },
                        {
                          // Enter the Sine section
                          render: (p) => <SingleSineAnimation progress={p} />,
                          startElementId: 'enter-sine',
                          overlap: 0.15,
                        },
                        {
                          // Adjusting Frequency section
                          render: (p) => (
                            <MultiFrequencyAnimation progress={p} />
                          ),
                          startElementId: 'adjusting-frequency',
                          overlap: 0.15,
                        },
                        {
                          // Multiple Frequencies section
                          render: (p) => <ClockAnalogyAnimation progress={p} />,
                          startElementId: 'multiple-frequencies',
                          overlap: 0.15,
                        },
                        {
                          // Adding Cosine section
                          render: (p) => <CircleTracerAnimation progress={p} />,
                          startElementId: 'sin-cos',
                          overlap: 0.15,
                        },
                        {
                          // The Frequency Formula section
                          render: (p) => (
                            <GeometricProgressionAnimation progress={p} />
                          ),
                          startElementId: 'the-formula',
                          overlap: 0.15,
                        },
                        {
                          // Putting It All Together section
                          render: (p) => <UniquenessAnimation progress={p} />,
                          startElementId: 'full-implementation',
                          overlap: 0.15,
                        },
                        {
                          // PE Matrix + Verification sections
                          render: (p) => <SmoothnessAnimation progress={p} />,
                          startElementId: 'pe-matrix',
                          overlap: 0.15,
                        },
                        {
                          // PyTorch Implementation section
                          render: (p) => <FourTermsAnimation progress={p} />,
                          startElementId: 'pytorch-impl',
                          overlap: 0.15,
                        },
                        {
                          // Limitations of Additive PE section
                          render: (p) => <SummaryAnimation progress={p} />,
                          startElementId: 'limitations',
                          overlap: 0.1,
                        },
                      ]}
                    />
                  </TabContent>
                  <TabContent tabId="rope">
                    <AnimationSequence
                      scrollProgress={scrollProgress}
                      animations={[
                        {
                          // Learned Positional Embeddings section
                          render: (p) => (
                            <LearnedEmbeddingsAnimation progress={p} />
                          ),
                          startElementId: 'learned-embeddings',
                          overlap: 0.15,
                        },
                        {
                          // From Addition to Rotation section
                          render: (p) => <RotationAnimation progress={p} />,
                          startElementId: 'rotation-intro',
                          overlap: 0.15,
                        },
                        {
                          // The Magic Property section
                          render: (p) => <RoPEInsightAnimation progress={p} />,
                          startElementId: 'magic-property',
                          overlap: 0.15,
                        },
                        {
                          // RoPE Implementation section
                          render: (p) => (
                            <RoPEDimensionPairsAnimation progress={p} />
                          ),
                          startElementId: 'rope-impl',
                          overlap: 0.15,
                        },
                        {
                          // RoPE vs Additive PE section
                          render: (p) => (
                            <AdditivVsRoPEAnimation progress={p} />
                          ),
                          startElementId: 'comparison',
                          overlap: 0.15,
                        },
                        {
                          // Verifying RoPE Requirements section
                          render: (p) => (
                            <MagnitudePreservationAnimation progress={p} />
                          ),
                          startElementId: 'rope-verification',
                          overlap: 0.15,
                        },
                        {
                          // PyTorch RoPE Class section
                          render: (p) => (
                            <CleanAttentionAnimation progress={p} />
                          ),
                          startElementId: 'rope-pytorch',
                          overlap: 0.15,
                        },
                        {
                          // Summary: Why RoPE Won section
                          render: (p) => <RoPEClosingAnimation progress={p} />,
                          startElementId: 'summary',
                          overlap: 0.1,
                        },
                      ]}
                    />
                  </TabContent>
                </>
              )}
              className="bg-white"
            >
              {/* Article Title */}
              <h1 className="text-4xl font-bold mb-2 text-black">
                Positional Embeddings
              </h1>
              <p className="text-lg text-neutral-600 mb-4">
                Building Intuition from First Principles
              </p>

              {/* Tab 1: Sinusoidal PE */}
              <TabContent tabId="sinusoidal">
                <SinusoidalPEContent />
              </TabContent>

              {/* Tab 2: RoPE */}
              <TabContent tabId="rope">
                <RoPEContent />
              </TabContent>

              <div className="h-32" />
            </ArticleLayout>
          </div>
        </PyodideProvider>
      </TabsProvider>
    </TOCProvider>
  );
}

function SinusoidalPEContent() {
  return (
    <>
      {/* ========== THE PROBLEM ========== */}
      <ArticleSection>
        {/* Hook - the mystery */}
        <InsightBox className="mb-8">
          <p className="mb-3">
            Shuffle the words in "The cat sat on the mat" and a transformer sees{' '}
            <strong>no difference</strong>. It processes tokens in parallel with
            no notion of order. So how do models like GPT know that "cat" comes
            before "sat"?
          </p>
          <p className="font-mono text-neutral-500 mb-2">
            PE<sub>(pos, 2i)</sub> = sin(pos / 10000<sup>2i/d</sup>)
          </p>
          <p>
            This formula. But <em>why</em> sine? Why 10000? Why alternate
            sin/cos? We'll derive this from scratch, and each choice will feel
            inevitable.
          </p>
        </InsightBox>
        <TOCHeading
          id="the-problem"
          level={2}
        >
          The Problem: Transformers Are Blind to Order
        </TOCHeading>
        <Prose>
          <p>
            A transformer's self-attention treats input as a{' '}
            <strong>set</strong>, not a sequence. Unlike RNNs which process
            tokens one by one, transformers see all tokens simultaneously with
            no built-in notion of "first" or "last."
          </p>
          <p>
            This is powerful for parallelization, but creates a fundamental
            problem:
            <em> "The cat sat on the mat"</em> and{' '}
            <em>"mat the on sat cat The"</em>
            produce identical attention patterns.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="toy-attention-original">
            Let's prove this. We'll create three token embeddings and compute
            their attention scores:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>Now shuffle the token order and recompute:</p>
          <InlineCode id="toy-attention-shuffled" />
          <MutedText>
            Identical attention patterns, just permuted. The model genuinely
            cannot distinguish these orderings.
          </MutedText>
        </Prose>
      </ArticleSection>

      {/* Goal framing */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Our goal:</strong> inject position information into
            embeddings so that tokens the same distance apart in the sequence
            are "pushed together" in embedding space. The model can then learn
            to attend based on both content <em>and</em> position.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== FIRST ATTEMPT ========== */}
      <ArticleSection>
        <TOCHeading
          id="first-attempt"
          level={2}
        >
          First Attempt: Just Add Integers
        </TOCHeading>
        <Prose>
          <p>
            The simplest idea: add the position number directly. Position 0 adds
            0, position 1 adds 1, and so on.
          </p>
          <p id="example-tensor">
            Here's a small example — three token embeddings with values around
            [-1, 1]:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="integer-positions">
            Adding positions 0, 1, 2 works fine for short sequences. But what
            about position 9999?
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <InlineCode id="scale-explosion" />
          <MutedText>
            The position signal drowns out the semantics. "Cat" and "dog" at
            position 9999 become indistinguishable.
          </MutedText>
          <p id="normalized-positions" className="mt-4">
            We could normalize to [0, 1], but then "position 5" means different
            things in different length sequences. We need something better.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== WHAT WE NEED ========== */}
      <ArticleSection>
        <TOCHeading
          id="requirements"
          level={2}
        >
          What Do We Actually Need?
        </TOCHeading>
        <Prose>
          <p>Let's think about what a good positional encoding requires:</p>
          <OrderedList>
            <li>
              <strong>Bounded values</strong>: Should not explode for long
              sequences
            </li>
            <li>
              <strong>Unique per position</strong>: Each position must be
              distinguishable
            </li>
            <li>
              <strong>Consistent scale</strong>: Same encoding scheme works for
              any sequence length
            </li>
            <li>
              <strong>Smooth</strong>: Nearby positions should have similar
              encodings
            </li>
            <li>
              <strong>Learnable patterns</strong>: The model should be able to
              learn relative positions
            </li>
          </OrderedList>
        </Prose>
      </ArticleSection>

      {/* ========== ENTER SINE ========== */}
      <ArticleSection>
        <TOCHeading
          id="enter-sine"
          level={2}
        >
          Enter the Sine Function
        </TOCHeading>
        <Prose>
          <p>
            Sine is bounded [-1, 1], smooth, and consistent regardless of
            sequence length. Let's try{' '}
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded">
              sin(position)
            </code>
            :
          </p>
          <p id="sin-encoding-basic">
            Positions 0, 1, 2 get values 0, 0.84, 0.91 — distinct and bounded:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="sin-visualization">
            Promising! But sine has a period of 2π ≈ 6.28. What happens at
            position 6?
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <InlineCode id="sin-periodicity-problem" />
          <MutedText>
            Position 0 and 6 get nearly identical encodings. For sequences
            longer than ~6 tokens, we're back to ambiguity.
          </MutedText>
        </Prose>
      </ArticleSection>

      {/* ========== ADJUSTING FREQUENCY ========== */}
      <ArticleSection>
        <TOCHeading
          id="adjusting-frequency"
          level={2}
        >
          Adjusting the Frequency
        </TOCHeading>
        <Prose>
          <p>
            We can control how fast sine repeats with a frequency multiplier{' '}
            <Math>{'\\omega'}</Math>:
          </p>
          <FormulaBox>{'\\sin(\\omega \\cdot \\text{pos})'}</FormulaBox>
          <p id="frequency-stretch">
            Lower ω = slower oscillation = longer before it repeats. Let's try ω
            = 0.1:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            No more collisions at position 6! But now positions 0 and 1 are
            almost identical:
          </p>
          <InlineCode id="frequency-tradeoff" />
          <MutedText>
            High frequency means good local discrimination but bad global. Low
            frequency is the opposite. We need both.
          </MutedText>
        </Prose>
      </ArticleSection>

      {/* ========== MULTIPLE FREQUENCIES ========== */}
      <ArticleSection>
        <TOCHeading
          id="multiple-frequencies"
          level={2}
        >
          The Key Insight: Multiple Frequencies
        </TOCHeading>
        <Prose>
          <p>
            Think of a clock: the hour hand (slow), minute hand (medium), and
            second hand (fast) together uniquely identify any moment. We can do
            the same with position: use <strong>multiple dimensions</strong>,
            each oscillating at a different frequency.
          </p>
          <p id="two-freq-encoding">
            Two dimensions — one high frequency (ω=1) for local, one low (ω=0.1)
            for global:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="two-freq-applied">
            Now each position has a unique 2D signature. Position 0 ≠ position 6
            because even though the high-frequency component repeats, the
            low-frequency one doesn't:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="two-freq-visualization">
            Plotting both frequencies shows how they complement each other:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SIN + COS ========== */}
      <ArticleSection>
        <TOCHeading
          id="sin-cos"
          level={2}
        >
          Adding Cosine: The Circle Trick
        </TOCHeading>
        <Prose>
          <p>
            There's still a subtle issue: sin(θ) = sin(π - θ). Two different
            positions can have the same sine value. The fix? Add cosine — which
            is 90° out of phase.
          </p>
          <p id="sin-cos-ambiguity">
            When sine values collide, cosine values differ:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="circle-visualization">
            Geometrically, (sin(θ), cos(θ)) traces a circle. Each position is a
            unique point — no collisions possible:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="sin-cos-embedding-viz">
            With sin/cos pairs at multiple frequencies, we have a complete
            encoding scheme:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== THE FORMULA ========== */}
      <ArticleSection>
        <TOCHeading
          id="the-formula"
          level={2}
        >
          The Frequency Formula
        </TOCHeading>
        <Prose>
          <p>
            The original Transformer paper uses a specific formula for
            frequencies:
          </p>
          <FormulaBox label="Frequency Formula">
            {'\\omega_i = \\frac{1}{10000^{2i/d}}'}
          </FormulaBox>
          <p>
            Where{' '}
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded">i</code> is
            the dimension index and{' '}
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded">d</code> is
            the model dimension. This creates a{' '}
            <strong>geometric progression</strong> of wavelengths:
          </p>
          <div className="overflow-x-auto my-3">
            <table className="min-w-full text-sm border border-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Dim (i)</th>
                  <th className="px-3 py-2 text-left border-b">Frequency ω</th>
                  <th className="px-3 py-2 text-left border-b">
                    Wavelength (positions)
                  </th>
                  <th className="px-3 py-2 text-left border-b">Purpose</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr>
                  <td className="px-3 py-1.5 border-b">0</td>
                  <td className="px-3 py-1.5 border-b">1.0</td>
                  <td className="px-3 py-1.5 border-b">~6 positions</td>
                  <td className="px-3 py-1.5 border-b">
                    Fine-grained: adjacent tokens
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 border-b">d/4</td>
                  <td className="px-3 py-1.5 border-b">0.01</td>
                  <td className="px-3 py-1.5 border-b">~600 positions</td>
                  <td className="px-3 py-1.5 border-b">
                    Medium: sentence structure
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5">d/2</td>
                  <td className="px-3 py-1.5">0.0001</td>
                  <td className="px-3 py-1.5">~60,000 positions</td>
                  <td className="px-3 py-1.5">Coarse: document structure</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Why 10000?</strong> This "base" ensures the lowest frequency
            dimension doesn't repeat within ~10,000 positions. It sets the
            effective maximum context length the encoding can handle before
            patterns start repeating.
          </p>
          <p id="frequency-formula">
            Let's compute these frequencies for a small embedding dimension:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="high-low-freq-comparison">
            High frequency dimensions change rapidly (good for nearby
            positions). Low frequency dimensions barely change (but stay unique
            over long distances):
          </p>
        </Prose>
      </ArticleSection>

      {/* Interactive dimension analysis */}
      <ArticleSection>
        <Prose>
          <p>Explore how different dimension pairs behave:</p>
          <PEDimensionAnalysis className="my-6" />
        </Prose>
      </ArticleSection>

      {/* ========== PUTTING IT TOGETHER ========== */}
      <ArticleSection>
        <TOCHeading
          id="full-implementation"
          level={2}
        >
          Putting It All Together
        </TOCHeading>
        <Prose>
          <p>The complete formula from "Attention Is All You Need":</p>
          <FormulaBox label="Sinusoidal Positional Encoding">
            {
              '\\begin{aligned} PE_{(pos, 2i)} &= \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right) \\\\ PE_{(pos, 2i+1)} &= \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right) \\end{aligned}'
            }
          </FormulaBox>
          <p id="pe-function">Here is the complete implementation:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="pe-added-to-embeddings">
            Adding positional encoding to token embeddings:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="same-token-diff-positions">
            The same token at different positions now has different
            representations:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== THE MATRIX ========== */}
      <ArticleSection>
        <TOCHeading
          id="pe-matrix"
          level={2}
        >
          Visualizing the Full Matrix
        </TOCHeading>
        <Prose>
          <p id="pe-matrix-heatmap">
            The positional encoding forms a beautiful pattern. Each row is a
            position, each column is a dimension. Notice the different
            wavelengths across dimensions:
          </p>
        </Prose>
      </ArticleSection>

      {/* Interactive PE Matrix */}
      <ArticleSection>
        <Prose>
          <p>
            Explore the matrix interactively. Adjust sequence length and model
            dimension:
          </p>
          <PEMatrixViz className="my-6" />
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="pe-dimension-analysis">
            Looking at specific dimension pairs to see the frequency
            differences:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== VERIFICATION ========== */}
      <ArticleSection>
        <TOCHeading
          id="verification"
          level={2}
        >
          Verifying Our Requirements
        </TOCHeading>
        <Prose>
          <p>
            Does our encoding satisfy the requirements we set out? Let's check:
          </p>
          <p id="verify-bounded">
            <strong>Bounded:</strong> Values stay in [-1, 1] regardless of
            position:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="verify-unique">
            <strong>Unique:</strong> Each position gets a distinct encoding
            (measuring pairwise distances):
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="verify-smooth">
            <strong>Smooth:</strong> Nearby positions have similar encodings
            (small distance), far positions differ more:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== RELATIVE POSITION ========== */}
      <ArticleSection>
        <TOCHeading
          id="relative-position"
          level={2}
        >
          The Relative Position Property
        </TOCHeading>
        <Prose>
          <p>
            A beautiful property: PE(i) · PE(j) depends mainly on |i - j|, the{' '}
            <strong>relative</strong>
            distance between positions, not the absolute positions themselves.
          </p>
          <p id="dot-product-heatmap">
            Computing dot products between all position pairs:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="relative-distance-proof">
            PE(5) · PE(8) ≈ PE(10) · PE(13) because both pairs have distance 3:
          </p>
        </Prose>
      </ArticleSection>

      {/* Interactive relative position viz */}
      <ArticleSection>
        <Prose>
          <p>Explore how dot product varies with relative distance:</p>
          <RelativePositionViz className="my-6" />
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="dot-vs-distance">
            Plotting dot product as a function of relative distance:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== PYTORCH IMPLEMENTATION ========== */}
      <ArticleSection>
        <TOCHeading
          id="pytorch-impl"
          level={2}
        >
          PyTorch Implementation
        </TOCHeading>
        <Prose>
          <p id="pytorch-implementation">
            A clean PyTorch implementation you can use in your models:
          </p>
        </Prose>
      </ArticleSection>

      {/* Try it yourself */}
      <ArticleSection>
        <Prose>
          <p>Try computing positional encodings yourself:</p>
          <InteractiveCode
            code={`import numpy as np

# Compute PE for position 5, dimension 0 (sin) and 1 (cos)
pos = 5
d_model = 64

# Frequency for first dimension pair
freq = 1 / (10000 ** (0 / d_model))
angle = pos * freq

pe_sin = np.sin(angle)
pe_cos = np.cos(angle)

print(f"Position {pos}:")
print(f"  PE[0] (sin) = {pe_sin:.4f}")
print(f"  PE[1] (cos) = {pe_cos:.4f}")
print(f"  Frequency = {freq:.6f}")`}
            packages={['numpy']}
            className="my-6"
          />
        </Prose>
      </ArticleSection>

      {/* ========== LIMITATIONS ========== */}
      <ArticleSection>
        <TOCHeading
          id="limitations"
          level={2}
        >
          Limitations of Additive PE
        </TOCHeading>
        <Prose>
          <p>
            Sinusoidal PE works well, but has a subtle issue.{' '}
            <strong>What we ideally want</strong> is for attention scores to
            cleanly separate into:
          </p>
          <OrderedList>
            <li>
              <strong>Semantic similarity</strong>: How related are the tokens?
            </li>
            <li>
              <strong>Relative position</strong>: How far apart are they?
            </li>
          </OrderedList>
          <p>
            But when we <em>add</em> positional encodings and compute attention:
          </p>
          <FormulaBox>
            {'\\text{score} = (q + pe_q) \\cdot (k + pe_k)'}
          </FormulaBox>
          <p id="additive-pe-attention">
            Let's see what this expansion actually produces:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>This expands to four terms:</p>
          <InlineCode id="attention-four-terms" />
          <FormulaBox>
            {'q \\cdot k + q \\cdot pe_k + pe_q \\cdot k + pe_q \\cdot pe_k'}
          </FormulaBox>
          <div className="overflow-x-auto my-4">
            <table className="min-w-full text-sm border border-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Term</th>
                  <th className="px-3 py-2 text-left border-b">
                    What it measures
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border-b font-mono">q · k</td>
                  <td className="px-3 py-2 border-b">
                    Pure semantic similarity — how related are these tokens?
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b font-mono">q · pe_j</td>
                  <td className="px-3 py-2 border-b">
                    How much the query content "likes" position j
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b font-mono">pe_i · k</td>
                  <td className="px-3 py-2 border-b">
                    How much position i "likes" the key content
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono">pe_i · pe_j</td>
                  <td className="px-3 py-2">
                    Pure positional relationship (depends on i - j)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The cross terms mix semantic content with position. The model has to
            learn to extract the useful relative position signal from{' '}
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded">
              pe_i · pe_j
            </code>{' '}
            while disentangling it from the content-position interactions.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="concatenation-approach">
            One alternative is concatenation instead of addition:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            But concatenation doubles the dimension, increasing computation:
          </p>
          <InlineCode id="concatenation-cost" />
        </Prose>
      </ArticleSection>

      {/* Transition to RoPE */}
      <ArticleSection>
        <Prose>
          <p>
            We've built up sinusoidal PE piece by piece: bounded values →
            multiple frequencies → sin/cos pairs → the 10000 base. It works! But
            position and content get entangled in attention.
          </p>
          <p>
            Here's a thought: the (sin, cos) pairs we're using... those define a{' '}
            <em>rotation</em>. What if instead of <em>adding</em> position to
            embeddings, we <em>rotated</em> the query and key vectors?
          </p>
        </Prose>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-10 flex justify-center">
        <TabSwitchButton targetTab="rope" label="Continue to RoPE →" />
      </div>
    </>
  );
}

function RoPEContent() {
  return (
    <>
      {/* ========== LEARNED EMBEDDINGS ========== */}
      <ArticleSection>
        <TOCHeading
          id="learned-embeddings"
          level={2}
        >
          Learned Positional Embeddings
        </TOCHeading>
        <Prose>
          <p>
            Before diving into RoPE, let's cover another common approach:
            <strong> learned positional embeddings</strong>, used by GPT-2 and
            BERT.
          </p>
          <p>
            Instead of computing positions with sin/cos, we simply{' '}
            <em>learn</em> them. It's a lookup table: position 0 maps to learned
            vector E_0, position 1 to E_1, etc.
          </p>
        </Prose>
      </ArticleSection>

      {/* GPT-2 Visualization */}
      <ArticleSection>
        <Prose>
          <p>Explore how GPT-2's learned embeddings work:</p>
          <GPT2EmbeddingsViz className="my-6" />
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="learned-embed-class">The implementation is simple:</p>
          <GPT2ImplementationCode />
          <p className="mt-6">
            The downside? <strong>Fixed sequence length</strong>. GPT-2's 1024
            position limit comes from this lookup table size. You cannot process
            sequences longer than you trained on.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== ROTATION INTRO ========== */}
      <ArticleSection>
        <TOCHeading
          id="rotation-intro"
          level={2}
        >
          From Addition to Rotation
        </TOCHeading>
        <Prose>
          <p>
            Both sinusoidal and learned embeddings <em>add</em> position
            information to tokens. But remember the four-term expansion problem?
            What if instead of adding, we <em>rotate</em>?
          </p>
          <p id="circle-rotation-intro">
            Recall that (cos(θ), sin(θ)) traces a circle. This is a rotation by
            angle θ:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== 2D ROTATION ========== */}
      <ArticleSection>
        <TOCHeading
          id="2d-rotation"
          level={2}
        >
          2D Rotation Refresher
        </TOCHeading>
        <Prose>
          <p>
            To understand RoPE, we need to revisit 2D rotation — which is
            exactly what our (sin, cos) pairs represent! A 2D rotation matrix
            rotates a vector by angle <Math>{'\\theta'}</Math>:
          </p>
          <FormulaBox label="2D Rotation Matrix">
            {
              'R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}'
            }
          </FormulaBox>
          <p>
            The key property: <strong>rotation preserves magnitude</strong>. The
            vector's length stays the same — only its direction changes. This
            means we don't distort the semantic information in our embeddings.
          </p>
          <p id="rotation-2d-function">Let's implement 2D rotation:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rotation-visualization">
            Visualizing rotation at different angles. Notice the magnitude is
            preserved:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== MAGIC PROPERTY ========== */}
      <ArticleSection>
        <TOCHeading
          id="magic-property"
          level={2}
        >
          The Magic Property
        </TOCHeading>
        <Prose>
          <p>
            Here is the key insight that makes RoPE work. When we take the dot
            product of two rotated vectors:
          </p>
          <FormulaBox label="The Magic Property">
            {
              'R(\\theta_1)q \\cdot R(\\theta_2)k = q \\cdot R(\\theta_2 - \\theta_1)k'
            }
          </FormulaBox>
          <p>
            The dot product depends only on the <strong>difference</strong> in
            rotation angles!
          </p>

          {/* Math derivation */}
          <InsightBox title="Why does this work?">
            <p className="mb-2">
              Rotation matrices are <strong>orthogonal</strong>, meaning{' '}
              <Math>{'R(\\theta)^T = R(-\\theta)'}</Math>. This gives us:
            </p>
            <div className="font-mono space-y-1 text-neutral-800">
              <p>R(θ₁)q · R(θ₂)k</p>
              <p className="text-neutral-400">
                = qᵀ R(θ₁)ᵀ R(θ₂) k{' '}
                <span className="text-xs ml-2">
                  (dot product as matrix mult)
                </span>
              </p>
              <p className="text-neutral-400">
                = qᵀ R(-θ₁) R(θ₂) k{' '}
                <span className="text-xs ml-2">(orthogonality)</span>
              </p>
              <p className="text-neutral-400">
                = qᵀ R(θ₂ - θ₁) k{' '}
                <span className="text-xs ml-2">(rotations compose)</span>
              </p>
              <p className="text-green-700">= q · R(θ₂ - θ₁) k</p>
            </div>
            <p className="mt-3">
              The absolute angles θ₁ and θ₂ disappear. Only their{' '}
              <em>difference</em> remains.
            </p>
          </InsightBox>

          <p id="magic-property-verify">
            Let's verify this property numerically:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            If we set{' '}
            <Math>
              {'\\theta = \\text{position} \\times \\text{frequency}'}
            </Math>
            , then the dot product depends only on
            <strong> relative position</strong>:
          </p>
          <InlineCode id="position-rotation-demo" />
          <FormulaBox>
            {'R(m\\theta)q \\cdot R(n\\theta)k = q \\cdot R((m-n)\\theta)k'}
          </FormulaBox>
          <p>
            The attention score between positions m and n depends only on (m -
            n). This is exactly what we want!
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== ROPE IMPLEMENTATION ========== */}
      <ArticleSection>
        <TOCHeading
          id="rope-impl"
          level={2}
        >
          RoPE Implementation
        </TOCHeading>
        <Prose>
          <p>
            RoPE applies this insight to high-dimensional vectors. For a
            d-dimensional vector, we split it into d/2 pairs and rotate each
            pair by a position-dependent angle:
          </p>
          <FormulaBox label="RoPE Angle Formula">
            {'\\theta_i = \\frac{pos}{10000^{2i/d}}'}
          </FormulaBox>
          <p>
            The same frequency scheme as sinusoidal PE! But instead of{' '}
            <em>adding</em> sin/cos values, we use them to <em>rotate</em>.
          </p>

          {/* Data flow diagram */}
          <DataFlow
            title="Where rotation happens"
            note={
              <>
                Key difference: Additive PE modifies the embedding{' '}
                <em>before</em> projection. RoPE rotates Q/K <em>after</em>{' '}
                projection. The embedding stays untouched.
              </>
            }
          >
            <DataFlow.Step label="Additive PE">
              x → <span className="text-amber-600">x + PE</span> → W<sub>q</sub>{' '}
              → q
            </DataFlow.Step>
            <DataFlow.Step label="RoPE">
              x → W<sub>q</sub> → q →{' '}
              <span className="text-green-600">rotate(q)</span> → q'
            </DataFlow.Step>
          </DataFlow>

          <p id="rope-apply-function">Here is the apply_rope function:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rope-qk-rotation">
            Let's see the rotation in action — how Q vectors change at different
            positions:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rope-q-visualization">
            Each dimension pair rotates at its own frequency. High-frequency
            pairs spin fast (for local position), low-frequency pairs spin slow
            (for global):
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== COMPARISON ========== */}
      <ArticleSection>
        <TOCHeading
          id="comparison"
          level={2}
        >
          RoPE vs Additive PE
        </TOCHeading>
        <Prose>
          {/* Key intuition quote */}
          <QuoteBox>
            <p>
              <strong>Additive PE:</strong> "Here's some position info. Figure
              out how to use it"
            </p>
            <p>
              <strong>RoPE:</strong> "I'll rotate your vectors so when you dot
              them, relative position naturally falls out"
            </p>
          </QuoteBox>
          <p id="rope-vs-additive">
            Let's compare what happens in attention with both approaches:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rope-relative-position">
            The proof is in the dot product. With RoPE, attention between
            positions m and n depends only on (m - n):
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rope-attention-curve">
            This creates a clean decay pattern — nearby tokens attend strongly,
            distant ones weakly:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Let's compare additive PE vs RoPE head-to-head. First, with
            identical embeddings to isolate just the positional effect:
          </p>
          <p id="rope-comparison-isolated"></p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="full-attention-comparison">
            And now with real (different) embeddings — the full attention
            computation:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== VERIFICATION ========== */}
      <ArticleSection>
        <TOCHeading
          id="rope-verification"
          level={2}
        >
          Verifying RoPE Requirements
        </TOCHeading>
        <Prose>
          <p>RoPE still satisfies all our original requirements:</p>
          <p id="rope-verify-bounded">
            <strong>Bounded:</strong> Rotation preserves magnitude — if ||q|| =
            1, then ||R(θ)q|| = 1:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="rope-verify-unique">
            <strong>Unique:</strong> Each position still gets a distinct
            encoding:
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== PYTORCH CLASS ========== */}
      <ArticleSection>
        <TOCHeading
          id="rope-pytorch"
          level={2}
        >
          PyTorch RoPE Class
        </TOCHeading>
        <Prose>
          <p>
            Here's a production-ready implementation. The key insight: we
            precompute the rotation angles (freqs_cis) once, then apply them to
            Q/K on every forward pass:
          </p>
          <p id="rope-class"></p>
        </Prose>
      </ArticleSection>

      {/* ========== SUMMARY ========== */}
      <ArticleSection>
        <TOCHeading
          id="summary"
          level={2}
        >
          Summary: Why RoPE Won
        </TOCHeading>
        <Prose>
          <div className="overflow-x-auto my-4">
            <table className="min-w-full text-sm border border-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Property</th>
                  <th className="px-3 py-2 text-left border-b">
                    Sinusoidal PE
                  </th>
                  <th className="px-3 py-2 text-left border-b">Learned PE</th>
                  <th className="px-3 py-2 text-left border-b">RoPE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border-b">Relative position</td>
                  <td className="px-3 py-2 border-b">
                    Implicit (needs to be learned)
                  </td>
                  <td className="px-3 py-2 border-b">No</td>
                  <td className="px-3 py-2 border-b text-green-700 font-medium">
                    Direct (built-in)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b">
                    Content/position separation
                  </td>
                  <td className="px-3 py-2 border-b">Mixed (4 terms)</td>
                  <td className="px-3 py-2 border-b">Mixed (4 terms)</td>
                  <td className="px-3 py-2 border-b text-green-700 font-medium">
                    Clean (2 terms)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b">Extrapolation</td>
                  <td className="px-3 py-2 border-b">Moderate</td>
                  <td className="px-3 py-2 border-b">Poor</td>
                  <td className="px-3 py-2 border-b text-green-700 font-medium">
                    Good
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b">Learnable parameters</td>
                  <td className="px-3 py-2 border-b">0</td>
                  <td className="px-3 py-2 border-b">max_len × d</td>
                  <td className="px-3 py-2 border-b">0</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Where applied</td>
                  <td className="px-3 py-2">Embeddings</td>
                  <td className="px-3 py-2">Embeddings</td>
                  <td className="px-3 py-2">Q/K only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            RoPE is now the industry standard, used in LLaMA, Mistral, Qwen, and
            most modern LLMs. The key advantages:
          </p>
          <UnorderedList>
            <li>
              <strong>Clean separation</strong>: Position and content do not mix
              in the dot product
            </li>
            <li>
              <strong>Relative by design</strong>: Attention naturally captures
              relative position
            </li>
            <li>
              <strong>Extrapolation</strong>: Works better on longer sequences
              than trained
            </li>
            <li>
              <strong>No parameters</strong>: Computed deterministically (like
              sinusoidal)
            </li>
          </UnorderedList>
        </Prose>
      </ArticleSection>

      {/* ========== EXTENSIONS ========== */}
      <ArticleSection>
        <TOCHeading
          id="extensions"
          level={2}
        >
          Modern Extensions
        </TOCHeading>
        <Prose className="space-y-2">
          <p>Research continues to improve positional encoding:</p>
          <UnorderedList className="space-y-2">
            <li>
              <strong>ALiBi</strong>: Adds position-based bias to attention
              logits instead of rotating
            </li>
            <li>
              <strong>YaRN</strong>: Improves RoPE extrapolation via
              interpolation for long contexts
            </li>
            <li>
              <strong>NTK-aware scaling</strong>: Better frequency scaling for
              extending context length
            </li>
          </UnorderedList>
          <MutedText>
            The journey from "just add integers" to these sophisticated
            techniques shows how simple intuitions, when properly developed,
            lead to elegant solutions.
          </MutedText>
        </Prose>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-12 flex justify-center">
        <TabSwitchButton targetTab="sinusoidal" label="Back to Sinusoidal PE" />
      </div>
    </>
  );
}
