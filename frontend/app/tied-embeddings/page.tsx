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
  IntroAnimation,
  TwoMatricesAnimation,
  BigramDirectionalityAnimation,
  SymmetryConstraintAnimation,
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

      <StickyHeader title="The pragmatic tradeoff of tied embeddings" />

      <div className="pt-14">
        <ArticleLayout
          leftContent={(scrollProgress) => (
            <AnimationSequence
              scrollProgress={scrollProgress}
              animations={[
                {
                  render: (p) => <IntroAnimation progress={p} />,
                  startElementId: 'article-start',
                  overlap: 0.15,
                },
                {
                  render: (p) => <TwoMatricesAnimation progress={p} />,
                  startElementId: 'two-matrices',
                  overlap: 0.1,
                },
                {
                  image: {
                    src: '/images/high-level-transformer.png',
                    alt: 'High-level diagram of a transformer showing the direct path from input embeddings through residual stream to output logits',
                    caption:
                      'High-level transformer architecture showing the direct path',
                  },
                  startElementId: 'direct-path',
                  overlap: 0.15,
                },
                {
                  render: (p) => <BigramDirectionalityAnimation progress={p} />,
                  startElementId: 'bigrams',
                  overlap: 0.15,
                },
                {
                  render: (p) => <SymmetryConstraintAnimation progress={p} />,
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
          <h1 id="article-start" className="text-4xl font-bold mb-2 text-black">
            The pragmatic tradeoff of tied embeddings
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            In deep learning, we commonly trade compute for accuracy.
            Quantization sacrifices precision for speed. Distillation trades
            model size for latency. Weight sharing reduces parameters at the
            cost of expressivity.
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
            Tied embeddings are one such tradeoff. Introduced by "Using the Output Embedding to Improve Language Models" [1], it comes from a simple observation: &quot;we
            have a 617 million parameter embedding matrix<sup>*</sup> on both sides of our
            nn. why not just make them the same matrix?&quot; <sup>*</sup>(in GPT 3)
          </p>
          <p>
            In other words: since the embedding matrix encodes semantic meaning
            in words, it serves roughly the same purpose for both input and
            output predictions. 
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
          Two sides of the same coin
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>Transformers have two matrices that deal with tokens, an</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>embedding matrix</strong> <Math>{'W_E'}</Math>: converts
              tokens to vectors (input), and an
            </li>
            <li>
              <strong>unembedding matrix</strong> <Math>{'W_U'}</Math>: converts
              residual stream to logits (output).
            </li>
          </ul>
          <p>
            With tied embeddings, we use the same weights:{' '}
            <Math>{'W_U = W_E^T'}</Math>. It the ML brain because it appears to be an elegant way to reduce parameters and add symmetry.
          </p>
          <p id="setup-vocab">
            Let's make this concrete with a toy example vocabulary:
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
            embedding_dim). Each row is the learned embedding for one token (these are made up):
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
          The residual stream
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            In a transformer, information flows through attention and MLP
            layers. But <strong>residual connections</strong> mean that there's
            always a direct linear path from input to output:
          </p>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-sm my-3">
            token (one-hot) → W_E → [residual stream] → W_U → logits
          </div>
          <p>
            Even in a deep model, this path exists. If we ignore all the
            attention/MLP layers, the model is simply computing:
          </p>
          <FormulaBox>
            {'\\text{logits} = \\text{one\\_hot} \\cdot W_E \\cdot W_U'}
          </FormulaBox>
        </div>
      </ArticleSection>

      {/* <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="direct-path-meaning">
            Let's interpret what this matrix means for our vocabulary:
          </p>
        </div>
      </ArticleSection> */}

      {/* ========== BIGRAMS ========== */}
      <ArticleSection>
        <TOCHeading
          id="bigrams"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          What the residual stream learns
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="direct-path-matrix">
            The matrix <Math>{'W_E \\cdot W_U'}</Math> is a vocab_size ×
            vocab_size matrix. Entry [i, j] tells us: given input token i,
            what's the logit for output token j?
          </p>
          <p>
            "Given the current token, what's the most likely next
            token?"
          </p>
          <p>
            This is called <strong>bigram statistics</strong>. It's the
            conditional probabilities{' '}
            <Math>
              {'P(\\text{next\\_token} \\mid \\text{current\\_token})'}
            </Math>
            . A bigram is any two consecutive tokens in text.
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
          The problem: forced symmetry
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            Here's the critical issue. With tied embeddings,{' '}
            <Math>{'W_U = W_E^T'}</Math>, so the direct path matrix becomes:
          </p>
          <FormulaBox>{'W_E \\cdot W_U = W_E \\cdot W_E^T'}</FormulaBox>
          <p id="tied-result">
            And <Math>{'W_E \\cdot W_E^T'}</Math> is{' '}
            <strong>always symmetric</strong>. Let's see why.
          </p>
        </div>
      </ArticleSection>

      <ArticleSection>
        <div id="tied-visualization" className="leading-relaxed space-y-3 text-neutral-900">
          
        </div>
      </ArticleSection>

      {/* ========== WHY SYMMETRIC ========== */}
      <ArticleSection>
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
      {/* <ArticleSection>
        <TOCHeading
          id="sgd-limitation"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          Why SGD can't fix this
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
      </ArticleSection> */}

      {/* <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p id="random-matrices">
            Let's verify with random matrices. Every single one produces a
            symmetric result:
          </p>
        </div>
      </ArticleSection> */}

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
          Untied embeddings don't suffer from this?
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>
            With <strong>untied embeddings</strong>, <Math>{'W_U'}</Math> is a
            separate learnable matrix. Now the direct path is
          </p>
          <FormulaBox>{'W_E \\cdot W_U'}</FormulaBox>
          <p>
            where <Math>{'W_E'}</Math> and <Math>{'W_U'}</Math> are independent.
            This product can be <strong>any matrix</strong>, including
            asymmetric ones.
          </p>
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
          But bro. It's not just the residual stream
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>This is true.</p>
          <p>
            Smaller models still use them because their lesser expressivity
            means that the nonlinearity added through attention and MLP layers
            allows them to not bump against the asymmetry constraint.
          </p>
          <p>
            Or by directly adding a direct MLP layer before the residual stream
            which can break the symmetry:
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

      {/* Parameter calculator */}
      <ArticleSection>
        <div className="leading-relaxed space-y-3 text-neutral-900">
          <p>Explore the parameter savings from tied embeddings:</p>
          <ParameterCalculator className="my-4" />
        </div>
        <p>
          Remember, the entirety of GPT-3 is ~175 billion parameters. 617
          million embeddings parameters is a drop in the bucket if it means more
          expressivity.
        </p>
      </ArticleSection>

      {/* ========== SUMMARY ========== */}
      <ArticleSection>
        <TOCHeading
          id="summary"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          To tie or not to tie
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
          <p>
            Tied embeddings are a practical tradeoff, not a principled design
            choice. They save parameters and memory, which matters for smaller
            models where early layers can compensate for the symmetry
            constraint. But for large models chasing maximum performance, the
            math is clear: language is asymmetric, and untied embeddings can
            represent that.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Tied</strong>: GPT-2, Gemma, original Transformer
            </li>
            <li>
              <strong>Untied</strong>: LLaMA 1/2/3, Mistral
            </li>
            <li>
              <strong>Unknown</strong>: GPT-3/4, Claude (not publicly disclosed)
            </li>
          </ul>
        </div>
      </ArticleSection>

      {/* ========== REFERENCES ========== */}
      <ArticleSection>
        <TOCHeading
          id="references"
          level={2}
          className="text-2xl font-bold mb-2 text-black"
        >
          References
        </TOCHeading>
        <div className="leading-relaxed space-y-3 text-neutral-700 text-sm">
          <p>
            [1] Press, O., & Wolf, L. (2017). "Using the Output Embedding to
            Improve Language Models." <em>EACL 2017</em>.{' '}
            <a
              href="https://arxiv.org/abs/1608.05859"
              className="text-neutral-900 underline hover:text-neutral-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              arXiv:1608.05859
            </a>
            <br />
            <span className="text-neutral-500">
              Introduced tied embeddings, showing parameter reduction with
              minimal performance loss.
            </span>
          </p>
          <p>
            [2] Inan, H., Khosravi, K., & Socher, R. (2017). "Tying Word Vectors
            and Word Classifiers: A Loss Framework for Language Modeling."{' '}
            <em>ICLR 2017</em>.{' '}
            <a
              href="https://arxiv.org/abs/1611.01462"
              className="text-neutral-900 underline hover:text-neutral-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              arXiv:1611.01462
            </a>
            <br />
            <span className="text-neutral-500">
              Concurrent work providing theoretical justification for weight
              tying.
            </span>
          </p>
          <p>
            [3] Vaswani, A., et al. (2017). "Attention Is All You Need."{' '}
            <em>NeurIPS 2017</em>.{' '}
            <a
              href="https://arxiv.org/abs/1706.03762"
              className="text-neutral-900 underline hover:text-neutral-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              arXiv:1706.03762
            </a>
            <br />
            <span className="text-neutral-500">
              Original Transformer used tied embeddings between input, output,
              and pre-softmax layers.
            </span>
          </p>
          <p>
            [4] Yang, Z., Dai, Z., Salakhutdinov, R., & Cohen, W. (2018).
            "Breaking the Softmax Bottleneck: A High-Rank RNN Language Model."{' '}
            <em>ICLR 2018</em>.{' '}
            <a
              href="https://arxiv.org/abs/1711.03953"
              className="text-neutral-900 underline hover:text-neutral-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              arXiv:1711.03953
            </a>
            <br />
            <span className="text-neutral-500">
              Shows expressiveness limits from low-rank embeddings—relevant to
              why untying helps.
            </span>
          </p>
          <p>
            [5] Geva, M., Schuster, R., Berant, J., & Levy, O. (2021).
            "Transformer Feed-Forward Layers Are Key-Value Memories."{' '}
            <em>EMNLP 2021</em>.{' '}
            <a
              href="https://arxiv.org/abs/2012.14913"
              className="text-neutral-900 underline hover:text-neutral-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              arXiv:2012.14913
            </a>
            <br />
            <span className="text-neutral-500">
              Shows early layers capture surface patterns, suggesting how models
              compensate for tied embeddings.
            </span>
          </p>
        </div>
      </ArticleSection>
    </>
  );
}
