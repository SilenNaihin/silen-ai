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
import { PyodideProvider, InteractiveCode } from '@/components/interactive/PyodideRunner';

// Visualization and article components
import { GPT2EmbeddingsViz, GPT2ImplementationCode } from '@/components/positional-encoding/GPT2EmbeddingsViz';
import { PEMatrixViz, PEDimensionAnalysis, RelativePositionViz } from '@/components/positional-encoding/PEMatrixViz';
import { Math, FormulaBox } from '@/components/article/Math';
import {
  PermutationProblemAnimation,
  IntegerExplosionAnimation,
  SingleSineAnimation,
  MultiFrequencyAnimation,
  CircleTracerAnimation,
  BlankAnimation,
  SummaryAnimation,
  LearnedEmbeddingsAnimation,
  RotationAnimation,
  RoPEInsightAnimation,
  RoPEDimensionPairsAnimation,
  RoPEClosingAnimation,
} from '@/components/positional-encoding/PEAnimations';
import { TabSwitchButton } from '@/components/navigation/Tabs';

const TABS = [
  { id: 'sinusoidal', label: 'Sinusoidal PE' },
  { id: 'rope', label: 'RoPE' },
];

export default function PositionalEncodingArticle() {
  return (
    <TOCProvider>
      <TabsProvider tabs={TABS} defaultTab="sinusoidal">
        <PyodideProvider packages={['numpy']} autoLoad>
          <UseNotebook path="projects/transformer/positional_emb.ipynb" />

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
                          render: (p) => <PermutationProblemAnimation progress={p} />,
                          duration: 1.5,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <IntegerExplosionAnimation progress={p} />,
                          duration: 1,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <SingleSineAnimation progress={p} />,
                          duration: 1.5,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <MultiFrequencyAnimation progress={p} />,
                          duration: 1.5,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <CircleTracerAnimation progress={p} />,
                          duration: 2,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <BlankAnimation progress={p} />,
                          duration: 2,
                          overlap: 0.1,
                        },
                        {
                          render: (p) => <SummaryAnimation progress={p} />,
                          duration: 2,
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
                          render: (p) => <LearnedEmbeddingsAnimation progress={p} />,
                          duration: 1.5,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <RotationAnimation progress={p} />,
                          duration: 2,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <RoPEInsightAnimation progress={p} />,
                          duration: 2,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <RoPEDimensionPairsAnimation progress={p} />,
                          duration: 2,
                          overlap: 0.15,
                        },
                        {
                          render: (p) => <RoPEClosingAnimation progress={p} />,
                          duration: 2,
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
              <h1 className="text-5xl font-bold mb-6 text-black">
                Positional Embeddings
              </h1>
              <p className="text-xl text-neutral-600 mb-16">
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

              <div className="h-64" />
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
        <TOCHeading id="the-problem" level={2} className="text-3xl font-bold mb-6 text-black">
          The Problem: Transformers Are Blind to Order
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            A transformer's self-attention treats input as a <strong>set</strong>, not a sequence.
            Unlike RNNs which process tokens one by one, transformers see all tokens simultaneously
            with no built-in notion of "first" or "last."
          </p>
          <p>
            This is powerful for parallelization, but creates a fundamental problem:
            <em> "The cat sat on the mat"</em> and <em>"mat the on sat cat The"</em>
            produce identical attention patterns.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="toy-attention-original">
            Let's see this concretely. Here we create three tokens with random embeddings
            and compute attention scores (just the dot product matrix):
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="toy-attention-shuffled">
            Now shuffle the order and recompute. The attention matrix is identical,
            just with rows/columns permuted:
          </p>
          <p className="text-neutral-600 italic">
            The model cannot tell these orderings apart. It is equivariant to token order.
          </p>
        </div>
      </ArticleSection>

      {/* ========== FIRST ATTEMPT ========== */}
      <ArticleSection>
        <TOCHeading id="first-attempt" level={2} className="text-3xl font-bold mb-6 text-black">
          First Attempt: Just Add Integers
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            The simplest idea: add the position number directly to each embedding dimension.
            Position 0 gets 0 added, position 1 gets 1, position 9999 gets 9999.
          </p>
          <p id="example-tensor">
            Let's start with a small example tensor representing three tokens:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="integer-positions">
            Adding integer positions to these embeddings:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="scale-explosion">
            But watch what happens with longer sequences. At position 9999, the position
            signal completely <strong>drowns out</strong> the semantic embedding:
          </p>
          <p className="text-neutral-600 italic">
            The word "cat" at position 9999 looks nearly identical to "dog" at position 9999.
            We have lost the meaning to encode the position.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="normalized-positions">
            One fix: normalize positions to [0, 1]. But this creates its own problems:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Different sequence lengths get different position values for the same relative position</li>
            <li>The scale becomes dependent on max_len, which we may not know at training time</li>
          </ul>
        </div>
      </ArticleSection>

      {/* ========== WHAT WE NEED ========== */}
      <ArticleSection>
        <TOCHeading id="requirements" level={2} className="text-3xl font-bold mb-6 text-black">
          What Do We Actually Need?
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Let's think about what a good positional encoding requires:</p>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li><strong>Bounded values</strong>: Should not explode for long sequences</li>
            <li><strong>Unique per position</strong>: Each position must be distinguishable</li>
            <li><strong>Consistent scale</strong>: Same encoding scheme works for any sequence length</li>
            <li><strong>Smooth</strong>: Nearby positions should have similar encodings</li>
            <li><strong>Learnable patterns</strong>: The model should be able to learn relative positions</li>
          </ol>
        </div>
      </ArticleSection>

      {/* ========== ENTER SINE ========== */}
      <ArticleSection>
        <TOCHeading id="enter-sine" level={2} className="text-3xl font-bold mb-6 text-black">
          Enter the Sine Function
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Sine is bounded between -1 and 1, smooth, and periodic. What if we use
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded mx-1">sin(position)</code>
            as our positional encoding?
          </p>
          <p id="sin-encoding-basic">
            For our three tokens "The", "cat", "sat" at positions 0, 1, 2:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="sin-visualization">
            Visualizing how sine shifts our embeddings:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="sin-periodicity-problem">
            But there is a critical flaw. Sine repeats every 2π ≈ 6.28 positions:
          </p>
          <p className="text-neutral-600 italic">
            Position 0 and position 6 get nearly identical encodings. With sequences longer
            than 6 tokens, the model cannot distinguish between positions that differ by multiples of 2π.
          </p>
        </div>
      </ArticleSection>

      {/* ========== ADJUSTING FREQUENCY ========== */}
      <ArticleSection>
        <TOCHeading id="adjusting-frequency" level={2} className="text-3xl font-bold mb-6 text-black">
          Adjusting the Frequency
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            We can stretch or compress the sine wave by multiplying position by a frequency term <Math>{"\\omega"}</Math>:
          </p>
          <FormulaBox>{"\\sin(\\omega \\cdot \\text{pos})"}</FormulaBox>
          <p id="frequency-stretch">
            A lower frequency (ω = 0.1) stretches the wave, so it repeats less often:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="frequency-tradeoff">
            But there is a tradeoff. With low frequency, <strong>nearby</strong> positions
            become hard to distinguish:
          </p>
          <p className="text-neutral-600 italic">
            High frequency: good for local discrimination, bad for global.
            Low frequency: good for global, bad for local. We need both.
          </p>
        </div>
      </ArticleSection>

      {/* ========== MULTIPLE FREQUENCIES ========== */}
      <ArticleSection>
        <TOCHeading id="multiple-frequencies" level={2} className="text-3xl font-bold mb-6 text-black">
          The Key Insight: Multiple Frequencies
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            What if instead of using a single frequency, we use <strong>multiple dimensions</strong>,
            each with a different frequency? Think of how we tell time: an hour hand, minute hand,
            and second hand, each moving at different rates. Together they uniquely identify any moment.
          </p>
          <p id="two-freq-encoding">
            Let's encode each position with TWO dimensions using different frequencies:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="two-freq-applied">
            Applying this to actual embeddings:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="two-freq-visualization">
            Visualizing both frequencies together:
          </p>
        </div>
      </ArticleSection>

      {/* ========== SIN + COS ========== */}
      <ArticleSection>
        <TOCHeading id="sin-cos" level={2} className="text-3xl font-bold mb-6 text-black">
          Adding Cosine: The Circle Trick
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            There is another trick: for each frequency, we can use <strong>both sine and cosine</strong>.
            Why? Because sine alone can still be ambiguous. sin(θ) = sin(π - θ), so positions
            θ and π - θ have the same sine value.
          </p>
          <p id="sin-cos-ambiguity">
            Adding cosine resolves this ambiguity:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="circle-visualization">
            The pair (sin(θ), cos(θ)) traces a circle as position increases.
            Each position is a unique point on this circle:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="sin-cos-embedding-viz">
            Applying sin/cos pairs to our embeddings:
          </p>
        </div>
      </ArticleSection>

      {/* ========== THE FORMULA ========== */}
      <ArticleSection>
        <TOCHeading id="the-formula" level={2} className="text-3xl font-bold mb-6 text-black">
          The Frequency Formula
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            The original Transformer paper uses a specific formula for frequencies:
          </p>
          <FormulaBox label="Frequency Formula">
            {"\\omega_i = \\frac{1}{10000^{2i/d}}"}
          </FormulaBox>
          <p>
            Where <code className="bg-neutral-100 px-1.5 py-0.5 rounded">i</code> is the dimension
            index and <code className="bg-neutral-100 px-1.5 py-0.5 rounded">d</code> is the
            model dimension. This creates a geometric progression of wavelengths from 2π to 10000·2π.
          </p>
          <p id="frequency-formula">
            Let's compute these frequencies for a small embedding dimension:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="high-low-freq-comparison">
            High frequency dimensions change rapidly (good for nearby positions).
            Low frequency dimensions barely change (but stay unique over long distances):
          </p>
        </div>
      </ArticleSection>

      {/* Interactive dimension analysis */}
      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Explore how different dimension pairs behave:</p>
          <PEDimensionAnalysis className="my-6" />
        </div>
      </ArticleSection>

      {/* ========== PUTTING IT TOGETHER ========== */}
      <ArticleSection>
        <TOCHeading id="full-implementation" level={2} className="text-3xl font-bold mb-6 text-black">
          Putting It All Together
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>The complete formula from "Attention Is All You Need":</p>
          <FormulaBox label="Sinusoidal Positional Encoding">
            {"\\begin{aligned} PE_{(pos, 2i)} &= \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right) \\\\ PE_{(pos, 2i+1)} &= \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right) \\end{aligned}"}
          </FormulaBox>
          <p id="pe-function">
            Here is the complete implementation:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="pe-added-to-embeddings">
            Adding positional encoding to token embeddings:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="same-token-diff-positions">
            The same token at different positions now has different representations:
          </p>
        </div>
      </ArticleSection>

      {/* ========== THE MATRIX ========== */}
      <ArticleSection>
        <TOCHeading id="pe-matrix" level={2} className="text-3xl font-bold mb-6 text-black">
          Visualizing the Full Matrix
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="pe-matrix-heatmap">
            The positional encoding forms a beautiful pattern. Each row is a position,
            each column is a dimension. Notice the different wavelengths across dimensions:
          </p>
        </div>
      </ArticleSection>

      {/* Interactive PE Matrix */}
      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Explore the matrix interactively. Adjust sequence length and model dimension:</p>
          <PEMatrixViz className="my-6" />
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="pe-dimension-analysis">
            Looking at specific dimension pairs to see the frequency differences:
          </p>
        </div>
      </ArticleSection>

      {/* ========== VERIFICATION ========== */}
      <ArticleSection>
        <TOCHeading id="verification" level={2} className="text-3xl font-bold mb-6 text-black">
          Verifying Our Requirements
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="verify-bounded">
            Let's verify our encoding satisfies the requirements. First, bounded values:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="verify-unique">
            Second, unique encodings for each position:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="verify-smooth">
            Third, smoothness (nearby positions have similar encodings):
          </p>
        </div>
      </ArticleSection>

      {/* ========== RELATIVE POSITION ========== */}
      <ArticleSection>
        <TOCHeading id="relative-position" level={2} className="text-3xl font-bold mb-6 text-black">
          The Relative Position Property
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            A beautiful property: PE(i) · PE(j) depends mainly on |i - j|, the <strong>relative</strong>
            distance between positions, not the absolute positions themselves.
          </p>
          <p id="dot-product-heatmap">
            Computing dot products between all position pairs:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="relative-distance-proof">
            PE(5) · PE(8) ≈ PE(10) · PE(13) because both pairs have distance 3:
          </p>
        </div>
      </ArticleSection>

      {/* Interactive relative position viz */}
      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Explore how dot product varies with relative distance:</p>
          <RelativePositionViz className="my-6" />
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="dot-vs-distance">
            Plotting dot product as a function of relative distance:
          </p>
        </div>
      </ArticleSection>

      {/* ========== PYTORCH IMPLEMENTATION ========== */}
      <ArticleSection>
        <TOCHeading id="pytorch-impl" level={2} className="text-3xl font-bold mb-6 text-black">
          PyTorch Implementation
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="pytorch-implementation">
            A clean PyTorch implementation you can use in your models:
          </p>
        </div>
      </ArticleSection>

      {/* Try it yourself */}
      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
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
        </div>
      </ArticleSection>

      {/* ========== LIMITATIONS ========== */}
      <ArticleSection>
        <TOCHeading id="limitations" level={2} className="text-3xl font-bold mb-6 text-black">
          Limitations of Additive PE
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Adding positional encodings to embeddings works well, but has a subtle issue.
            When computing attention scores:
          </p>
          <FormulaBox>
            {"\\text{score} = (q + pe_q) \\cdot (k + pe_k)"}
          </FormulaBox>
          <p id="additive-pe-attention">
            Let's see what this looks like with actual values:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="attention-four-terms">
            This expands to four terms:
          </p>
          <FormulaBox>
            {"q \\cdot k + q \\cdot pe_k + pe_q \\cdot k + pe_q \\cdot pe_k"}
          </FormulaBox>
          <p>
            The cross terms <code className="bg-neutral-100 px-1.5 py-0.5 rounded">q·pe_k</code> and
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded ml-1">pe_q·k</code> mix semantic
            content with position in potentially undesirable ways.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="concatenation-approach">
            One alternative is concatenation instead of addition:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="concatenation-cost">
            But concatenation doubles the dimension, increasing computation:
          </p>
          <p className="text-neutral-600 italic mt-4">
            This leads us to RoPE, which solves this elegantly through rotation.
          </p>
        </div>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-16 flex justify-center">
        <TabSwitchButton
          targetTab="rope"
          label="Continue to RoPE"
        />
      </div>
    </>
  );
}

function RoPEContent() {
  return (
    <>
      {/* ========== LEARNED EMBEDDINGS ========== */}
      <ArticleSection>
        <TOCHeading id="learned-embeddings" level={2} className="text-3xl font-bold mb-6 text-black">
          Learned Positional Embeddings
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Before diving into RoPE, let's cover another common approach:
            <strong> learned positional embeddings</strong>, used by GPT-2 and BERT.
          </p>
          <p>
            Instead of computing positions with sin/cos, we simply <em>learn</em> them.
            It's a lookup table: position 0 maps to learned vector E_0, position 1 to E_1, etc.
          </p>
        </div>
      </ArticleSection>

      {/* GPT-2 Visualization */}
      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Explore how GPT-2's learned embeddings work:</p>
          <GPT2EmbeddingsViz className="my-6" />
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="learned-embed-class">
            The implementation is simple:
          </p>
          <GPT2ImplementationCode />
          <p className="mt-6">
            The downside? <strong>Fixed sequence length</strong>. GPT-2's 1024 position limit
            comes from this lookup table size. You cannot process sequences longer than you trained on.
          </p>
        </div>
      </ArticleSection>

      {/* ========== ROTATION INTRO ========== */}
      <ArticleSection>
        <TOCHeading id="rotation-intro" level={2} className="text-3xl font-bold mb-6 text-black">
          From Addition to Rotation
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Both sinusoidal and learned embeddings <em>add</em> position information to tokens.
            But remember the four-term expansion problem? What if instead of adding, we <em>rotate</em>?
          </p>
          <p id="circle-rotation-intro">
            Recall that (cos(θ), sin(θ)) traces a circle. This is a rotation by angle θ:
          </p>
        </div>
      </ArticleSection>

      {/* ========== 2D ROTATION ========== */}
      <ArticleSection>
        <TOCHeading id="2d-rotation" level={2} className="text-3xl font-bold mb-6 text-black">
          2D Rotation Refresher
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>A 2D rotation matrix rotates a vector by angle <Math>{"\\theta"}</Math>:</p>
          <FormulaBox label="2D Rotation Matrix">
            {"R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}"}
          </FormulaBox>
          <p id="rotation-2d-function">
            Let's implement 2D rotation:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rotation-visualization">
            Visualizing rotation at different angles. Notice the magnitude is preserved:
          </p>
        </div>
      </ArticleSection>

      {/* ========== MAGIC PROPERTY ========== */}
      <ArticleSection>
        <TOCHeading id="magic-property" level={2} className="text-3xl font-bold mb-6 text-black">
          The Magic Property
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            Here is the key insight that makes RoPE work. When we take the dot product of two
            vectors rotated by different angles:
          </p>
          <FormulaBox label="The Magic Property">
            {"R(\\theta_1)q \\cdot R(\\theta_2)k = q \\cdot R(\\theta_2 - \\theta_1)k"}
          </FormulaBox>
          <p>
            The dot product depends only on the <strong>difference</strong> in rotation angles,
            not the absolute angles!
          </p>
          <p id="magic-property-verify">
            Let's verify this property:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="position-rotation-demo">
            If we set <Math>{"\\theta = \\text{position} \\times \\text{frequency}"}</Math>, then the dot product depends only on
            <strong> relative position</strong>:
          </p>
          <FormulaBox>
            {"R(m\\theta)q \\cdot R(n\\theta)k = q \\cdot R((m-n)\\theta)k"}
          </FormulaBox>
          <p>
            The attention score between positions m and n depends only on (m - n).
            This is exactly what we want!
          </p>
        </div>
      </ArticleSection>

      {/* ========== ROPE IMPLEMENTATION ========== */}
      <ArticleSection>
        <TOCHeading id="rope-impl" level={2} className="text-3xl font-bold mb-6 text-black">
          RoPE Implementation
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>
            RoPE applies this insight to high-dimensional vectors. For a d-dimensional vector,
            we split it into d/2 pairs and rotate each pair by a position-dependent angle:
          </p>
          <FormulaBox label="RoPE Angle Formula">
            {"\\theta_i = \\frac{pos}{10000^{2i/d}}"}
          </FormulaBox>
          <p>
            The same frequency scheme as sinusoidal PE! But instead of <em>adding</em>
            sin/cos, we use them to <em>rotate</em>.
          </p>
          <p id="rope-apply-function">
            Here is the apply_rope function:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-qk-rotation">
            RoPE is applied to Q and K vectors after projection, not to embeddings directly:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-q-visualization">
            Visualizing how RoPE rotates Q vectors:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-freq-pairs">
            Each dimension pair rotates at a different frequency:
          </p>
        </div>
      </ArticleSection>

      {/* ========== COMPARISON ========== */}
      <ArticleSection>
        <TOCHeading id="comparison" level={2} className="text-3xl font-bold mb-6 text-black">
          RoPE vs Additive PE
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-vs-additive">
            Let's compare what happens in attention with both approaches:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-relative-position">
            With RoPE, the dot product naturally encodes relative position:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-attention-curve">
            How attention score varies with relative position using RoPE:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-comparison-isolated">
            Comparing attention patterns with identical embeddings (isolating the positional effect):
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="full-attention-comparison">
            Full attention computation comparison:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-rotation-viz">
            Visualizing the rotation angles and their effect:
          </p>
        </div>
      </ArticleSection>

      {/* ========== VERIFICATION ========== */}
      <ArticleSection>
        <TOCHeading id="rope-verification" level={2} className="text-3xl font-bold mb-6 text-black">
          Verifying RoPE Requirements
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-verify-bounded">
            RoPE still satisfies our requirements. First, bounded values via magnitude preservation:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-verify-unique">
            Second, unique encodings per position:
          </p>
        </div>
      </ArticleSection>

      {/* ========== PYTORCH CLASS ========== */}
      <ArticleSection>
        <TOCHeading id="rope-pytorch" level={2} className="text-3xl font-bold mb-6 text-black">
          PyTorch RoPE Class
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-pytorch">
            Production-ready PyTorch implementation:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p id="rope-class">
            The full RoPE module:
          </p>
        </div>
      </ArticleSection>

      {/* ========== SUMMARY ========== */}
      <ArticleSection>
        <TOCHeading id="summary" level={2} className="text-3xl font-bold mb-6 text-black">
          Summary: Why RoPE Won
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>RoPE has several advantages over additive encodings:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Clean separation</strong>: Position and content do not mix in the dot product</li>
            <li><strong>Relative by design</strong>: Attention naturally captures relative position</li>
            <li><strong>Extrapolation</strong>: Works better on longer sequences than trained</li>
            <li><strong>No parameters</strong>: Computed deterministically (like sinusoidal)</li>
          </ul>
          <p className="mt-6">
            RoPE is now the industry standard, used in LLaMA, Mistral, Qwen, and most modern LLMs.
          </p>
        </div>
      </ArticleSection>

      {/* ========== EXTENSIONS ========== */}
      <ArticleSection>
        <TOCHeading id="extensions" level={2} className="text-3xl font-bold mb-6 text-black">
          Modern Extensions
        </TOCHeading>
        <div className="text-lg leading-relaxed space-y-6 text-neutral-900">
          <p>Research continues to improve positional encoding:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>ALiBi</strong>: Adds position-based bias to attention logits instead of rotating</li>
            <li><strong>YaRN</strong>: Improves RoPE extrapolation via interpolation for long contexts</li>
            <li><strong>NTK-aware scaling</strong>: Better frequency scaling for extending context length</li>
          </ul>
          <p className="mt-6 text-neutral-600 italic">
            The journey from "just add integers" to these sophisticated techniques shows how
            simple intuitions, when properly developed, lead to elegant solutions.
          </p>
        </div>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-16 flex justify-center">
        <TabSwitchButton
          targetTab="sinusoidal"
          label="Review Sinusoidal PE"
        />
      </div>
    </>
  );
}
