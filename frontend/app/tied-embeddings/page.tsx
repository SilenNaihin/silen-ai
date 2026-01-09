'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import { UseNotebook } from '@/contexts/NotebookContext';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import {
  TOCProvider,
  TOCHeading,
} from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import { InlineCode } from '@/components/article/InlineCode';
import { Math, FormulaBox } from '@/components/article/Math';

// Animation components
import {
  TokenFlowAnimation,
  DirectPathAnimation,
  LanguageFlowAnimation,
  SymmetryProblemAnimation,
  SGDCantFixAnimation,
  UntiedSolutionAnimation,
  MLPWorkaroundAnimation,
} from '@/components/tied-embeddings/TiedEmbeddingsAnimations';

// Interactive components
import {
  ParameterCalculator,
  SymmetryExplorer,
  EmbeddingVsLogitBox,
} from '@/components/tied-embeddings/TiedEmbeddingsInteractive';

const NOTEBOOK_GITHUB_URL =
  'https://github.com/SilenNaihin/silen-ai/blob/main/projects/general/tied_embeddings.ipynb';

export default function TiedEmbeddingsArticle() {
  return (
    <TOCProvider>
      <UseNotebook
        path="projects/general/tied_embeddings.ipynb"
        githubUrl={NOTEBOOK_GITHUB_URL}
      />

      <StickyHeader title="Tied Embeddings" />

      <div className="pt-14">
        <ArticleLayout
          leftContent={(scrollProgress) => (
            <AnimationSequence
              scrollProgress={scrollProgress}
              animations={[
                {
                  render: (p) => <TokenFlowAnimation progress={p} />,
                  startElementId: 'two-matrices',
                  overlap: 0.15,
                },
                {
                  render: (p) => <DirectPathAnimation progress={p} />,
                  startElementId: 'direct-path',
                  overlap: 0.15,
                },
                {
                  render: (p) => <LanguageFlowAnimation progress={p} />,
                  startElementId: 'bigrams',
                  overlap: 0.15,
                },
                {
                  render: (p) => <SymmetryProblemAnimation progress={p} />,
                  startElementId: 'symmetry-problem',
                  overlap: 0.15,
                },
                {
                  render: (p) => <SGDCantFixAnimation progress={p} />,
                  startElementId: 'sgd-limitation',
                  overlap: 0.15,
                },
                {
                  render: (p) => <UntiedSolutionAnimation progress={p} />,
                  startElementId: 'untied-solution',
                  overlap: 0.15,
                },
                {
                  render: (p) => <MLPWorkaroundAnimation progress={p} />,
                  startElementId: 'mlp-workaround',
                  overlap: 0.1,
                },
              ]}
            />
          )}
          className="bg-white"
        >
          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-2 text-black">
            Tied Embeddings
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Why Sharing Weights Isn't Always Principled
          </p>

          <TiedEmbeddingsContent />

          <div className="h-32" />
        </ArticleLayout>
      </div>
    </TOCProvider>
  );
}

function TiedEmbeddingsContent() {
  return (
    <>
      {/* ========== HOOK / INTRO ========== */}
      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            In deep learning, we constantly trade compute for accuracy.
            Quantization sacrifices precision for speed. Distillation trades
            model size for latency. Weight sharing reduces parameters at the
            cost of expressivity.
          </p>
          <p>
            <strong>Tied embeddings</strong> are one such trade: using the same
            weight matrix for both input embeddings and output predictions. It
            saves roughly 200M parameters for a typical LLM. For smaller models,
            this works surprisingly well.
          </p>
          <p>
            But there's a fundamental mathematical reason why tied embeddings
            can't capture something as basic as "New York" being common while
            "York New" is rare. This isn't a training issue or a matter of more
            data. It's linear algebra.
          </p>
        </div>
      </ArticleSection>

      {/* ========== THE TWO MATRICES ========== */}
      <ArticleSection>
        <TOCHeading
          id="two-matrices"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          The Two Matrices
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>Transformers have two matrices that deal with tokens:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Embedding matrix</strong> <Math>{'W_E'}</Math>: converts
              tokens to vectors (input)
            </li>
            <li>
              <strong>Unembedding matrix</strong> <Math>{'W_U'}</Math>: converts
              residual stream to logits (output)
            </li>
          </ul>
          <p>
            With <strong>tied embeddings</strong>, we use the same weights:{' '}
            <Math>{'W_U = W_E^T'}</Math>. This seems elegant. Fewer parameters,
            shared structure, and a nice symmetry between input and output.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="setup-vocab">
            Let's make this concrete with a tiny vocabulary:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="one-hot-vectors">
            Tokens are represented as one-hot vectors, where a single 1
            indicates which token we're referring to:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="embedding-matrix">
            The embedding matrix <Math>{'W_E'}</Math> has shape (vocab_size,
            embedding_dim). Each row is the learned embedding for one token:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="get-embedding">
            To get a token's embedding, we multiply its one-hot vector by{' '}
            <Math>{'W_E'}</Math>. This just selects the corresponding row:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="unembedding">
            At the output, the unembedding matrix converts a residual stream
            vector to logits. With tied embeddings, this is{' '}
            <Math>{'W_E^T'}</Math>:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="compute-logits">
            Each logit is the dot product of the residual with a token's
            embedding. Higher dot product means the model thinks that token is
            more likely:
          </p>
        </div>
      </ArticleSection>

      {/* ========== THE DIRECT PATH ========== */}
      <ArticleSection>
        <TOCHeading
          id="direct-path"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          The Direct Path
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            In a transformer, information flows through attention and MLP
            layers. But because of <strong>residual connections</strong>,
            there's always a direct linear path from input to output:
          </p>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-sm my-3">
            token (one-hot) → W_E → [residual stream] → W_U → logits
          </div>
          <p>
            Even in a deep model, this path exists. If we ignore all the
            attention/MLP layers, the model computes:
          </p>
          <FormulaBox>
            {'\\text{logits} = \\text{one\\_hot} \\cdot W_E \\cdot W_U'}
          </FormulaBox>
          {/* Transformer diagram */}
          <figure className="my-6">
            <img
              src="/images/high-level-transformer.png"
              alt="High-level diagram of a transformer showing the direct path from input embeddings through residual stream to output logits"
              className="w-full max-w-lg mx-auto rounded-lg border border-neutral-200"
            />
            <figcaption className="text-center text-sm text-neutral-500 mt-2">
              High-level transformer architecture showing the direct path
            </figcaption>
          </figure>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="direct-path-matrix">
            The matrix <Math>{'W_E \\cdot W_U'}</Math> is a vocab_size ×
            vocab_size matrix. Entry [i, j] tells us: given input token i,
            what's the logit for output token j?
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="direct-path-meaning">
            Let's interpret what this matrix means for our vocabulary:
          </p>
        </div>
      </ArticleSection>

      {/* ========== BIGRAMS ========== */}
      <ArticleSection>
        <TOCHeading
          id="bigrams"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          What Should This Path Learn?
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            If a model had <strong>no attention or MLP layers</strong>, the only
            thing it could learn is: "Given the current token, what's the most
            likely next token?"
          </p>
          <p>
            This is exactly <strong>bigram statistics</strong>: conditional
            probabilities P(next_token | current_token). A bigram is any two
            consecutive tokens in text.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="bigram-matrix">
            For our vocabulary, realistic bigram probabilities look like this:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="bigram-asymmetry">
            Notice the critical observation:{' '}
            <strong>bigrams are asymmetric</strong>. The order matters:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="bigram-visualization">
            Visualizing this asymmetry. Notice how the matrix is NOT symmetric
            across the diagonal:
          </p>
        </div>
      </ArticleSection>

      {/* ========== THE SYMMETRY PROBLEM ========== */}
      <ArticleSection>
        <TOCHeading
          id="symmetry-problem"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          The Problem: Forced Symmetry
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            Here's the critical issue. With tied embeddings,{' '}
            <Math>{'W_U = W_E^T'}</Math>, so the direct path matrix becomes:
          </p>
          <FormulaBox>{'W_E \\cdot W_U = W_E \\cdot W_E^T'}</FormulaBox>
          <p>
            And <Math>{'W_E \\cdot W_E^T'}</Math> is{' '}
            <strong>always symmetric</strong>. Let's see why.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="tied-result">
            Computing <Math>{'W_E \\cdot W_E^T'}</Math> with our embedding
            matrix:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="symmetry-check">
            Let's verify: is <Math>{'W_E \\cdot W_E^T'}</Math> symmetric?
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="tied-visualization">
            Visualizing the tied result. Notice the symmetry across the
            diagonal:
          </p>
        </div>
      </ArticleSection>

      {/* ========== WHY SYMMETRIC ========== */}
      <ArticleSection>
        <TOCHeading
          id="why-symmetric"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
          tocText="Why is W_E·W_E^T Always Symmetric?"
        >
          Why is <Math>{'W_E \\cdot W_E^T'}</Math> Always Symmetric?
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            This follows from basic linear algebra. The (i, j) entry of{' '}
            <Math>{'W_E \\cdot W_E^T'}</Math> is:
          </p>
          <FormulaBox>
            {
              '(W_E \\cdot W_E^T)_{ij} = \\text{row}_i(W_E) \\cdot \\text{row}_j(W_E) = \\text{embedding}_i \\cdot \\text{embedding}_j'
            }
          </FormulaBox>
          <p>
            And dot products are commutative:{' '}
            <Math>{'a \\cdot b = b \\cdot a'}</Math>. Therefore:
          </p>
          <FormulaBox>
            {'(W_E \\cdot W_E^T)_{ij} = (W_E \\cdot W_E^T)_{ji}'}
          </FormulaBox>
          <p>
            <strong>
              No matter what values <Math>{'W_E'}</Math> has,{' '}
              <Math>{'W_E \\cdot W_E^T'}</Math> is always symmetric.
            </strong>
          </p>
        </div>
      </ArticleSection>

      {/* Aside: What embeddings encode */}
      <ArticleSection>
        <EmbeddingVsLogitBox className="my-4" />
      </ArticleSection>

      {/* ========== SGD CANT FIX ========== */}
      <ArticleSection>
        <TOCHeading
          id="sgd-limitation"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          Why SGD Can't Fix This
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            You might wonder: "SGD is powerful. Can't it find embeddings such
            that <Math>{'W_E \\cdot W_E^T'}</Math> approximates the bigram
            probabilities?"
          </p>
          <p>
            The answer is <strong>no</strong>. This isn't an optimization issue
            or a matter of training longer. The constraint is mathematical:
          </p>
          <div className="bg-neutral-100 border border-neutral-300 rounded-lg p-3 my-3">
            <p className="text-neutral-800 text-sm">
              <strong>The set of symmetric matrices is a subspace.</strong> No
              matter how SGD adjusts <Math>{'W_E'}</Math>, the product{' '}
              <Math>{'W_E \\cdot W_E^T'}</Math> will always land in this
              subspace. It can never reach an asymmetric target.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="random-matrices">
            Let's verify with random matrices. Every single one produces a
            symmetric result:
          </p>
        </div>
      </ArticleSection>

      {/* Interactive symmetry explorer */}
      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            Try it yourself. No matter what values you enter, the result is
            symmetric:
          </p>
          <SymmetryExplorer className="my-4" />
        </div>
      </ArticleSection>

      {/* ========== UNTIED SOLUTION ========== */}
      <ArticleSection>
        <TOCHeading
          id="untied-solution"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          What About Untied Embeddings?
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            With <strong>untied embeddings</strong>, <Math>{'W_U'}</Math> is a
            separate learnable matrix. Now the direct path is:
          </p>
          <FormulaBox>{'W_E \\cdot W_U'}</FormulaBox>
          <p>
            where <Math>{'W_E'}</Math> and <Math>{'W_U'}</Math> are independent.
            This product can be <strong>any matrix</strong>, including
            asymmetric ones.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="untied-matrix">
            With untied embeddings, we can solve for a <Math>{'W_U'}</Math> that
            approximates the bigram probabilities:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="untied-result">
            The untied result can now represent asymmetric relationships:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="can-represent-asymmetric">
            The key comparison. Can we represent "New→York ≠ York→New"?
          </p>
        </div>
      </ArticleSection>

      {/* ========== MLP WORKAROUND ========== */}
      <ArticleSection>
        <TOCHeading
          id="mlp-workaround"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          How Small Models Cope
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            If tied embeddings have this limitation, why do smaller models still
            use them?
          </p>
          <p>
            The answer: <strong>MLP₀ can break the symmetry</strong>. Instead of
            the direct path being just <Math>{'W_E \\cdot W_E^T'}</Math>, it
            becomes:
          </p>
          <FormulaBox>
            {'W_E \\rightarrow \\text{MLP}_0 \\rightarrow W_E^T'}
          </FormulaBox>
          <p>
            MLP₀ learns a transformation M, making the effective path{' '}
            <Math>{'W_E \\cdot M \\cdot W_E^T'}</Math>, which CAN be asymmetric.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="mlp-breaks-symmetry">
            Let's see how adding an MLP transformation breaks the symmetry:
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="param-comparison">
            But this workaround has a cost. MLP capacity that could be used for
            reasoning or knowledge is instead spent "undoing" the embedding
            constraint:
          </p>
        </div>
      </ArticleSection>

      {/* Parameter calculator */}
      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>Explore the parameter savings from tied embeddings:</p>
          <ParameterCalculator className="my-4" />
        </div>
      </ArticleSection>

      {/* ========== SUMMARY ========== */}
      <ArticleSection>
        <TOCHeading
          id="summary"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          When to Tie, When Not to Tie
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <div className="overflow-x-auto my-4">
            <table className="min-w-full text-sm border border-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Aspect</th>
                  <th className="px-3 py-2 text-left border-b">Tied</th>
                  <th className="px-3 py-2 text-left border-b">Untied</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border-b">Direct path matrix</td>
                  <td className="px-3 py-2 border-b font-mono text-xs">
                    W_E @ W_E^T (symmetric)
                  </td>
                  <td className="px-3 py-2 border-b font-mono text-xs">
                    W_E @ W_U (any matrix)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b">Can represent bigrams?</td>
                  <td className="px-3 py-2 border-b text-neutral-500">
                    Not directly
                  </td>
                  <td className="px-3 py-2 border-b text-neutral-900 font-medium">
                    Yes
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border-b">Parameters</td>
                  <td className="px-3 py-2 border-b text-neutral-900 font-medium">
                    Fewer (shared)
                  </td>
                  <td className="px-3 py-2 border-b text-neutral-500">
                    More (separate)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Memory</td>
                  <td className="px-3 py-2 text-neutral-900 font-medium">
                    Less
                  </td>
                  <td className="px-3 py-2 text-neutral-500">More</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <h3 className="font-semibold text-lg">When Tied Embeddings Work</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Small models</strong> (&lt;8B parameters): MLP₀ can
              compensate
            </li>
            <li>
              <strong>Training efficiency</strong>: Fewer parameters = faster
              training
            </li>
            <li>
              <strong>Memory constrained</strong>: Sharing weights reduces
              footprint
            </li>
          </ul>

          <h3 className="font-semibold text-lg mt-4">
            When to Use Untied Embeddings
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Large models</strong>: The direct path becomes more
              important
            </li>
            <li>
              <strong>Maximum performance</strong>: Untied gives more
              expressivity
            </li>
            <li>
              <strong>SOTA models</strong>: Most large LLMs (GPT-4, Claude,
              etc.) use untied
            </li>
          </ul>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4">
            <h4 className="font-semibold mb-2">The Bottom Line</h4>
            <p className="text-sm text-neutral-700">
              Tied embeddings are a <strong>practical tradeoff</strong>, not a
              principled design choice. They work because small models don't
              rely heavily on the direct path, and MLP₀ can partially
              compensate. But mathematically, tying embeddings forces the direct
              path to be symmetric when language is fundamentally asymmetric.
            </p>
          </div>
        </div>
      </ArticleSection>
    </>
  );
}
