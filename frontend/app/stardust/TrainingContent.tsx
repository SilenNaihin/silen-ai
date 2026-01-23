'use client';

import { ArticleSection } from '@/components/article/ArticleSection';
import { TOCHeading } from '@/components/navigation/TableOfContents';
import { TabSwitchButton } from '@/components/navigation/Tabs';
import {
  Prose,
  InsightBox,
  QuoteBox,
  UnorderedList,
} from '@/components/article/Callouts';
import { InlineCode } from '@/components/article/InlineCode';
import { Math, FormulaBox } from '@/components/article/Math';
import { TrainingInteractive } from '@/components/stardust/TrainingInteractive';
import { CrossEntropyInteractive } from '@/components/stardust/CrossEntropyInteractive';
import { ChainRuleInteractive } from '@/components/stardust/ChainRuleInteractive';

export function TrainingContent() {
  return (
    <>
      {/* ========== SECTION 6: TEACHING SAND TO THINK ========== */}
      <ArticleSection>
        <TOCHeading id="teaching-sand" level={2}>
          Teaching Sand to Think
        </TOCHeading>
        <Prose>
          <p>
            We&apos;ve built all the pieces. Now let&apos;s put them together
            and watch a neural network learn.
          </p>
          <p>
            Below is an interactive visualization of the full training loop. You
            can input text, watch it get tokenized, see data flow through the
            network, and run predictions.
          </p>
          <p>
            The task: <strong>sentiment classification</strong>. Given a
            sentence, predict whether it expresses positive or negative
            sentiment.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="perceptron-pytorch">
            For reference, here&apos;s the equivalent PyTorch implementation of
            this network. The interactive visualization implements the exact
            same forward pass and backpropagation, just in JavaScript.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TrainingInteractive />
      </ArticleSection>

      <ArticleSection>
        <InsightBox title="Why Doesn't It Work Better?">
          <p className="mb-2">
            You might notice our tiny network struggles. It often classifies
            everything the same way, or flips unpredictably. This isn&apos;t a
            bug, it&apos;s a feature of being <em>tiny</em>.
          </p>
          <p className="mb-2">
            Language is hard. Even &quot;simple&quot; sentiment analysis
            requires understanding context, sarcasm, negation (&quot;not
            bad&quot; is positive!), and countless word relationships. Our
            2-dimensional embeddings and 3 hidden neurons simply don&apos;t have
            the capacity to capture this complexity.
          </p>
          <p className="text-sm text-neutral-600 bg-neutral-100 rounded px-2 py-1.5">
            <strong>Try it:</strong> Test individual words like{' '}
            <code className="bg-white px-1 rounded">awful</code> or{' '}
            <code className="bg-white px-1 rounded">love</code>. The network
            handles those better since they appeared directly in training data.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== OVERFITTING ========== */}
      <ArticleSection>
        <TOCHeading id="overfitting" level={3}>
          Overfitting and Regularization
        </TOCHeading>
        <Prose>
          <p>
            <strong>Overfitting</strong> is when your network memorizes the
            training data instead of learning general patterns. It performs
            great on training examples but fails on new data.
          </p>
          <p>
            Think of it like a student who memorizes every answer in a practice
            test without understanding the underlying concepts. They ace the
            practice test but fail the real exam because the questions are
            slightly different.
          </p>
          <p id="overfitting-curves">
            The clearest sign of overfitting: training loss keeps decreasing
            while validation loss starts increasing. The network is getting
            better at the training set while getting worse at everything else.
            Watch the animation to see this divergence in action.
          </p>
        </Prose>
        <InlineCode id="overfitting-demo" expanded={true} />
        <Prose>
          <p>
            The code above simulates this phenomenon. Notice how the gap between
            training and validation loss grows over time. The network is
            &quot;cheating&quot; by memorizing rather than learning.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="dropout" level={4}>
          Dropout: Random Resilience
        </TOCHeading>
        <Prose>
          <p id="dropout-demo">
            The most elegant solution to overfitting is surprisingly simple:
            during training, randomly &quot;turn off&quot; neurons by setting
            their outputs to zero. This is called <strong>dropout</strong>.
          </p>
          <p>
            Why does randomly breaking your network make it better? Because it
            prevents <em>co-adaptation</em>. Without dropout, neurons can become
            overly dependent on specific other neurons. With dropout, each
            neuron must learn to be useful on its own, because it never knows
            which other neurons will be present.
          </p>
        </Prose>
        <InlineCode id="dropout-demo" expanded={true} />
        <Prose>
          <p>
            A typical dropout rate is 0.5 for hidden layers, meaning half the
            neurons are randomly disabled on each training step. At test time,
            all neurons are active but their outputs are scaled down to
            compensate.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="regularization-techniques" level={4}>
          Other Regularization Techniques
        </TOCHeading>
        <Prose>
          <p>
            Dropout is powerful, but it&apos;s not the only tool. Here are other
            techniques that help prevent overfitting:
          </p>
          <div id="regularization-list">
            <UnorderedList>
              <li>
                <strong>Weight decay (L2 regularization)</strong>: Add a penalty
                term to the loss that grows with the square of the weights. This
                encourages smaller weights and simpler models.
              </li>
              <li>
                <strong>Early stopping</strong>: Monitor validation loss during
                training and stop when it stops improving. Simple but effective.
              </li>
              <li>
                <strong>Data augmentation</strong>: Create variations of your
                training examples (rotate images, add noise, paraphrase text) to
                increase effective dataset size.
              </li>
              <li>
                <strong>Batch normalization</strong>: Normalize activations
                within each layer. Originally designed for training stability,
                but also has regularization effects.
              </li>
            </UnorderedList>
          </div>
          <p>
            In practice, modern networks use multiple techniques together.
            Large language models typically combine dropout, weight decay, and
            careful learning rate scheduling.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== HYPERPARAMETERS ========== */}
      <ArticleSection>
        <TOCHeading id="hyperparameters" level={3}>
          Hyperparameters
        </TOCHeading>
        <Prose>
          <p>
            Some numbers in our system are <em>learned</em> (weights, biases,
            embeddings). Others are <em>chosen</em> by us before training
            begins. These are <strong>hyperparameters</strong>. They control
            <em>how</em> learning happens, not <em>what</em> is learned.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="learning-rate" level={4}>
          Learning Rate: The Most Important Hyperparameter
        </TOCHeading>
        <Prose>
          <p>
            The learning rate controls how big a step we take during gradient
            descent. Get it wrong and nothing works.
          </p>
          <p>
            <strong>Too high:</strong> The network overshoots the minimum,
            bouncing chaotically or even diverging to infinity. Loss increases
            instead of decreasing.
          </p>
          <p>
            <strong>Too low:</strong> The network inches toward the minimum so
            slowly that training takes forever, or it gets stuck in local
            minima before reaching a good solution.
          </p>
          <p>
            <strong>Just right:</strong> The network descends smoothly into a
            good minimum. Watch the animation to see how different learning
            rates affect convergence.
          </p>
        </Prose>
        <InlineCode id="learning-rate-demo" expanded={true} />
        <Prose>
          <p>
            In practice, we often use <strong>learning rate schedules</strong>
            that change the rate during training. Start high to make fast
            progress, then decay to fine-tune. Common schedules include cosine
            annealing, step decay, and warmup-then-decay.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="batch-size" level={4}>
          Batch Size: Speed vs Stability
        </TOCHeading>
        <Prose>
          <p>
            Batch size controls how many examples we process before updating
            weights. It affects both computation and learning dynamics.
          </p>
          <p>
            <strong>Small batches (8-32):</strong> Noisy gradients act as
            regularization, potentially finding better minima. But
            computationally inefficient since GPUs are underutilized.
          </p>
          <p>
            <strong>Large batches (256-8192):</strong> Stable gradients and
            efficient GPU usage. But can converge to sharp, poorly-generalizing
            minima without careful tuning.
          </p>
          <p>
            The sweet spot depends on your dataset, model, and hardware. Most
            practitioners start with 32 or 64 and adjust based on GPU memory
            and convergence behavior.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="architecture-capacity" level={4}>
          Architecture Capacity
        </TOCHeading>
        <Prose>
          <p>
            The number of layers and neurons determines your network&apos;s
            <strong> capacity</strong>, its ability to represent complex
            functions.
          </p>
          <p>
            <strong>Too small:</strong> The network can&apos;t capture the
            patterns in your data. This is <em>underfitting</em>.
          </p>
          <p>
            <strong>Too large:</strong> The network has enough capacity to
            memorize every training example. Without proper regularization, it
            will overfit.
          </p>
          <p>
            Modern wisdom: err on the side of larger networks with strong
            regularization (dropout, weight decay). It&apos;s easier to
            regularize a powerful model than to add capacity to a weak one.
          </p>
          <p>
            The number of epochs determines how long we train. Too few and we
            underfit. Too many and we overfit. Use validation loss to know when
            to stop.
          </p>
        </Prose>
        <InsightBox title="Hyperparameter Search">
          <p>
            Finding good hyperparameters is part science, part art. Common
            approaches:
          </p>
          <UnorderedList className="mt-2">
            <li>
              <strong>Grid search:</strong> Try all combinations of a predefined
              set of values
            </li>
            <li>
              <strong>Random search:</strong> Sample randomly from ranges, often
              more efficient than grid search
            </li>
            <li>
              <strong>Bayesian optimization:</strong> Use past results to
              intelligently choose what to try next
            </li>
          </UnorderedList>
        </InsightBox>
      </ArticleSection>

      {/* ========== CONVERGENCE ========== */}
      <ArticleSection>
        <TOCHeading id="convergence" level={3}>
          Convergence
        </TOCHeading>
        <Prose>
          <p id="convergence-normal">
            Training is done when the network <strong>converges</strong>: when
            the loss stops decreasing meaningfully. This doesn&apos;t mean we
            found the global minimum, just a point where the gradient is small
            enough that we stop moving.
          </p>
          <p>
            Watch the animation to see normal convergence: loss drops rapidly at
            first, then gradually levels off as the network settles into a
            minimum. The curve looks like an exponential decay, steep then flat.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="loss-landscape" level={4}>
          The Loss Landscape
        </TOCHeading>
        <Prose>
          <p id="convergence-landscape">
            Real loss landscapes are not smooth bowls. They&apos;re rugged
            terrain with hills, valleys, saddle points, and plateaus. The
            animation shows this complexity: your starting point matters, and
            different paths lead to different solutions.
          </p>
          <p>
            <strong>Local minima:</strong> Low points that aren&apos;t the
            lowest. Early stopping or bad initialization can trap you here.
          </p>
          <p>
            <strong>Saddle points:</strong> Points that look like minima in some
            directions but are actually maxima in others. In high dimensions,
            these are more common than true local minima.
          </p>
          <p>
            <strong>Plateaus:</strong> Flat regions where gradients are tiny.
            Progress slows to a crawl, though you haven&apos;t converged.
          </p>
          <p>
            Modern optimizers like Adam help navigate this landscape by adapting
            learning rates per-parameter and using momentum to escape saddle
            points.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="grokking" level={4}>
          Grokking: Sudden Understanding
        </TOCHeading>
        <Prose>
          <p>
            Here&apos;s something strange: sometimes a network appears to
            converge after 50 epochs, loss goes flat for thousands more, and
            then <em>suddenly</em> validation accuracy jumps from random chance
            to near-perfect.
          </p>
          <p>
            This phenomenon is called <strong>grokking</strong>. The network
            seems stuck on the training set, memorizing without generalizing.
            But internally, it&apos;s slowly restructuring its representations.
            Then something clicks.
          </p>
        </Prose>
        <InlineCode id="grokking-demo" expanded={true} />
        <Prose>
          <p>
            The code above demonstrates grokking on modular arithmetic. The
            network memorizes the training examples quickly, but true
            understanding, the ability to generalize, emerges much later.
          </p>
          <p>
            Grokking is still not fully understood. It seems related to the
            network finding simpler, more generalizable representations. Weight
            decay appears to help trigger it by penalizing the complex
            memorization solution.
          </p>
        </Prose>
        <InsightBox title="What Does Grokking Tell Us?">
          <p>
            Grokking suggests that &quot;converged&quot; isn&apos;t always
            final. Given enough time and the right regularization, networks can
            break through apparent plateaus.
          </p>
          <p className="mt-2">
            It&apos;s a reminder that we don&apos;t fully understand what
            happens inside these systems during training. The transition from
            memorization to generalization might be more sudden and dramatic
            than we thought.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== THE THREE PILLARS ========== */}
      <ArticleSection>
        <TOCHeading id="ingredients" level={2}>
          The Ingredients of Intelligence
        </TOCHeading>
        <Prose>
          <p>
            What separates our toy network from GPT-4? Three things:{' '}
            <strong>data</strong>, <strong>size</strong>, and{' '}
            <strong>compute</strong>. These are the raw materials of modern AI,
            and understanding them helps explain why some models work and others
            don&apos;t.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="data" level={3}>
          Data: Quality and Quantity
        </TOCHeading>
        <Prose>
          <p>
            Neural networks learn from examples. More examples means more
            patterns to extract. But quantity alone isn&apos;t enough, quality
            matters enormously.
          </p>
        </Prose>

        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-bold mb-2">Our Toy Dataset</div>
            <div className="font-mono text-xs space-y-1 text-neutral-600">
              <div>&quot;I love this movie&quot; → Positive</div>
              <div>&quot;This is terrible&quot; → Negative</div>
              <div>&quot;Really great film&quot; → Positive</div>
              <div>&quot;So bad and boring&quot; → Negative</div>
              <div className="text-neutral-400">... 8 total examples</div>
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              Simple patterns, limited vocabulary, no edge cases
            </div>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm font-bold mb-2">Real Training Data</div>
            <div className="font-mono text-xs space-y-1 text-neutral-600">
              <div>&quot;Not bad, actually quite good&quot; → Pos</div>
              <div>&quot;I wanted to love it but...&quot; → Neg</div>
              <div>&quot;Meh. It was fine I guess&quot; → Neutral</div>
              <div>&quot;🔥🔥🔥 absolute banger&quot; → Pos</div>
              <div className="text-neutral-400">... millions of examples</div>
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              Nuance, sarcasm, slang, emoji, edge cases
            </div>
          </div>
        </div>

        <Prose>
          <p>
            GPT-3 was trained on roughly <strong>500 billion tokens</strong>,
            that&apos;s about 375 billion words, or the equivalent of reading
            1.5 million novels. This scale is why it can handle sarcasm,
            context, and nuance that our tiny network cannot.
          </p>
          <p>
            Data quality matters too. Training on random internet text teaches
            different things than training on curated textbooks. Garbage in,
            garbage out. Modern models are trained on carefully filtered and
            weighted mixtures of data sources.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="size" level={3}>
          Size: Width and Depth
        </TOCHeading>
        <Prose>
          <p>
            A network&apos;s &quot;size&quot; is measured in{' '}
            <strong>parameters</strong>: all the weights and biases that can be
            adjusted during training. More parameters means more capacity to
            learn complex patterns.
          </p>
        </Prose>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300">
                <th className="text-left py-2 pr-4">Model</th>
                <th className="text-right py-2 px-4">Parameters</th>
                <th className="text-right py-2 pl-4">Relative Size</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-neutral-200">
                <td className="py-2 pr-4">Our toy network</td>
                <td className="text-right py-2 px-4">~80</td>
                <td className="text-right py-2 pl-4">1×</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 pr-4">BERT-base</td>
                <td className="text-right py-2 px-4">110M</td>
                <td className="text-right py-2 pl-4">1,375,000×</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 pr-4">GPT-3</td>
                <td className="text-right py-2 px-4">175B</td>
                <td className="text-right py-2 pl-4">2,187,500,000×</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 pr-4">GPT-4 (estimated)</td>
                <td className="text-right py-2 px-4">~1.8T</td>
                <td className="text-right py-2 pl-4">~22,500,000,000×</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Prose>
          <p>
            Size comes from two dimensions: <strong>width</strong> (neurons per
            layer) and <strong>depth</strong> (number of layers). Our network
            has 3 hidden neurons and 2 layers. GPT-3 has 12,288 neurons per
            layer and 96 layers.
          </p>
          <p>
            Depth matters especially. Each layer can learn increasingly abstract
            representations. Early layers might learn &quot;this word is a
            noun,&quot; middle layers learn &quot;this phrase expresses
            doubt,&quot; and late layers learn &quot;this review is
            sarcastically negative.&quot;
          </p>
        </Prose>

        <div className="my-6 flex gap-4 items-end justify-center">
          <div className="text-center">
            <div className="flex flex-col gap-1 items-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-1">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 rounded-full bg-neutral-400"
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-xs text-neutral-500 mt-2">Our network</div>
            <div className="text-xs font-mono text-neutral-400">
              2 layers × 3 wide
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col gap-1 items-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-1">
                  {[...Array(8)].map((_, j) => (
                    <div
                      key={j}
                      className="w-2 h-2 rounded-full bg-neutral-400"
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-xs text-neutral-500 mt-2">Small model</div>
            <div className="text-xs font-mono text-neutral-400">
              4 layers × 8 wide
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col gap-0.5 items-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-0.5">
                  {[...Array(16)].map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-xs text-neutral-500 mt-2">Larger model</div>
            <div className="text-xs font-mono text-neutral-400">
              8 layers × 16 wide
            </div>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="compute" level={3}>
          Compute: The Cost of Learning
        </TOCHeading>
        <Prose>
          <p>
            Training requires computation. Every forward pass, every gradient,
            every weight update costs CPU or GPU cycles. The total compute
            needed scales with both data size and model size.
          </p>
          <p>
            A rough formula: <strong>Compute ≈ 6 × Parameters × Tokens</strong>.
            GPT-3&apos;s training required approximately 3.14 × 10²³
            floating-point operations, that&apos;s running our toy
            network&apos;s training loop about 10¹⁹ times.
          </p>
        </Prose>

        <div className="my-6 bg-neutral-900 text-neutral-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <div className="text-neutral-500 mb-2">
            # Rough training compute estimates
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-neutral-400">Our toy: </span>
              <span className="text-green-400">~0.001 seconds</span> on a laptop
            </div>
            <div>
              <span className="text-neutral-400">BERT: </span>
              <span className="text-yellow-400">~4 days</span> on 16 TPUs
            </div>
            <div>
              <span className="text-neutral-400">GPT-3: </span>
              <span className="text-orange-400">~34 days</span> on 10,000 GPUs
            </div>
            <div>
              <span className="text-neutral-400">GPT-4: </span>
              <span className="text-red-400">~100 days</span> on 25,000 GPUs
              (estimated)
            </div>
          </div>
          <div className="text-neutral-500 mt-3">
            # Cost scales roughly as O(params × data × epochs)
          </div>
        </div>

        <Prose>
          <p>
            This compute cost is why AI research is concentrated at well-funded
            labs. Training GPT-4 is estimated to cost $50-100 million in compute
            alone. Our toy network costs a fraction of a cent.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <QuoteBox>
          <p>
            <strong>The bitter lesson</strong>: Simple methods that scale with
            compute ultimately outperform clever methods that don&apos;t. , Rich
            Sutton
          </p>
        </QuoteBox>
        <Prose>
          <p>
            This insight, from AI pioneer Rich Sutton, captures why modern AI
            looks the way it does. Given enough data and compute, simple
            architectures like transformers learn to solve problems that once
            required hand-crafted rules.
          </p>
          <p>
            Our tiny network isn&apos;t broken, it&apos;s just tiny. The same
            architecture, scaled up with more data and compute, is what powers
            the language models you use every day.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== CROSS-ENTROPY DEEP DIVE ========== */}
      <ArticleSection>
        <TOCHeading id="cross-entropy" level={3}>
          Understanding Cross-Entropy
        </TOCHeading>
        <Prose>
          <p>
            Cross-entropy is one of the most important concepts in machine
            learning. It&apos;s worth spending time to truly understand it, not
            just memorize the formula. Once you grasp it, you&apos;ll see it
            everywhere: classification, language models, decision trees,
            information theory.
          </p>
          <p>Let&apos;s build up to it from first principles.</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            <strong>The Problem:</strong> Our network outputs probabilities. For
            sentiment classification, it might output [0.9, 0.1] meaning
            &quot;90% confident this is positive, 10% confident this is
            negative.&quot;
          </p>
          <p>
            We need a single number that tells us how &quot;wrong&quot; this
            prediction is. And crucially, this number needs to be{' '}
            <em>differentiable</em>
            so gradient descent can work.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <h4 className="font-semibold text-base mt-4 mb-2">
            Intuition: Surprise and Information
          </h4>
          <p>
            Imagine you&apos;re at a weather station. The forecaster says
            there&apos;s a 99% chance of sun tomorrow. The next day, it&apos;s
            sunny. Are you surprised? Not really, it was expected.
          </p>
          <p>
            Now imagine the forecaster says 1% chance of sun, and it&apos;s
            sunny anyway. You&apos;re <em>very</em> surprised. The forecaster
            was confidently wrong.
          </p>
          <p id="cross-entropy-surprise">
            Cross-entropy captures this intuition mathematically. It measures
            how &quot;surprised&quot; we are when we see the true outcome, given
            our predicted probabilities.
          </p>
        </Prose>
        <FormulaBox label="Surprise (Information Content)">
          {'\\text{surprise} = -\\log(p)'}
        </FormulaBox>
        <Prose>
          <p>
            When <Math>{'p = 1'}</Math> (we were certain), surprise is 0. When{' '}
            <Math>{'p \\to 0'}</Math> (we thought it was impossible), surprise
            approaches infinity.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <h4 className="font-semibold text-base mt-4 mb-2">
            The Derivation: Maximum Likelihood
          </h4>
          <p id="cross-entropy-derivation">
            Here&apos;s where it gets beautiful. Cross-entropy isn&apos;t
            arbitrary, it falls out naturally from asking: &quot;What parameters
            make our training data most probable?&quot;
          </p>
          <p>
            Suppose we have <Math>N</Math> training examples. For each example
            <Math>i</Math>, our network outputs probability <Math>{'p_i'}</Math>{' '}
            for the correct class. The probability of seeing all our training
            data, assuming independence, is:
          </p>
        </Prose>
        <FormulaBox label="Likelihood">{'L = \\prod_{i=1}^{N} p_i'}</FormulaBox>
        <Prose>
          <p>
            We want to <em>maximize</em> this likelihood. But products are
            numerically unstable and hard to differentiate. Taking the log turns
            the product into a sum:
          </p>
        </Prose>
        <FormulaBox label="Log-Likelihood">
          {'\\log L = \\sum_{i=1}^{N} \\log(p_i)'}
        </FormulaBox>
        <Prose>
          <p>
            Maximizing log-likelihood is equivalent to <em>minimizing</em> its
            negative. Divide by <Math>N</Math> to get the average, and we have
            cross-entropy:
          </p>
        </Prose>
        <FormulaBox label="Cross-Entropy Loss">
          {'\\mathcal{L} = -\\frac{1}{N}\\sum_{i=1}^{N} \\log(p_i)'}
        </FormulaBox>
        <Prose>
          <p>For a single example, this simplifies to:</p>
        </Prose>
        <FormulaBox label="Single Example">
          {'\\mathcal{L} = -\\log(p_{\\text{correct}})'}
        </FormulaBox>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <h4 className="font-semibold text-base mt-4 mb-2">
            Why the Negative Log?
          </h4>
          <p id="cross-entropy-demo">
            The <Math>{'-\\log'}</Math> function has exactly the properties we
            want:
          </p>
          <UnorderedList>
            <li>
              When <Math>{'p = 1'}</Math> (perfect prediction): loss = 0
            </li>
            <li>
              When <Math>{'p = 0.5'}</Math> (uncertain): loss = 0.69
            </li>
            <li>
              When <Math>{'p \\to 0'}</Math> (confidently wrong): loss → ∞
            </li>
          </UnorderedList>
          <p>
            The steepness near zero is crucial: it heavily penalizes confident
            wrong predictions, pushing the network to be cautious.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <h4 className="font-semibold text-base mt-4 mb-2">
            The Gradient: Why It Works So Well
          </h4>
          <p id="cross-entropy-gradient">
            The magic of cross-entropy becomes clear when we compute its
            gradient. For a network outputting probabilities via softmax, the
            gradient has a beautifully simple form:
          </p>
        </Prose>
        <FormulaBox label="Gradient">
          {'\\frac{\\partial \\mathcal{L}}{\\partial z_i} = p_i - y_i'}
        </FormulaBox>
        <Prose>
          <p>
            Where <Math>{'z_i'}</Math> is the pre-softmax logit,{' '}
            <Math>{'p_i'}</Math> is the predicted probability, and{' '}
            <Math>{'y_i'}</Math> is the true label (1 for correct class, 0
            otherwise).
          </p>
          <p>
            This means the gradient is simply: <em>predicted minus actual</em>.
            If we predict 0.9 for the correct class (where true = 1), the
            gradient is 0.9 - 1 = -0.1. If we predict 0.1 for the correct class,
            the gradient is 0.1 - 1 = -0.9, a much stronger push to improve.
          </p>
        </Prose>
        <InsightBox title="Why This Matters">
          <p>
            Many loss functions have vanishing gradients, when predictions are
            far off, the gradient is tiny and learning stalls. Cross-entropy
            with softmax avoids this: the worse your prediction, the stronger
            the gradient signal. This is one reason deep learning works.
          </p>
        </InsightBox>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <h4 className="font-semibold text-base mt-4 mb-2">
            Putting It All Together
          </h4>
          <p id="cross-entropy-code">
            Cross-entropy loss unifies several perspectives:
          </p>
          <UnorderedList>
            <li>
              <strong>Information theory:</strong> Average surprise when seeing
              true labels given our predictions
            </li>
            <li>
              <strong>Statistics:</strong> Negative log-likelihood of the data
              under our model
            </li>
            <li>
              <strong>Optimization:</strong> A smooth, well-behaved function
              with strong gradients
            </li>
            <li>
              <strong>Geometry:</strong> Distance between two probability
              distributions
            </li>
          </UnorderedList>
          <p>
            When you train a neural network for classification, you&apos;re
            finding the parameters that make your training data least
            surprising.
          </p>
          <p>
            Try adjusting the predicted distribution below to see how
            cross-entropy measures the distance between distributions:
          </p>
        </Prose>
        <CrossEntropyInteractive />
      </ArticleSection>

      {/* ========== THE MATH OF TRAINING ========== */}
      <ArticleSection>
        <TOCHeading id="math-of-training" level={2}>
          The Math of Training
        </TOCHeading>
        <Prose>
          <p>
            We&apos;ve talked about training conceptually: forward pass, loss,
            gradients, update. But what&apos;s actually happening inside the
            computer? It all comes down to one operation:{' '}
            <strong>matrix multiplication</strong>.
          </p>
          <p>
            This might seem like a detour, but understanding matrix operations
            is <em>essential</em> for working with modern architectures.
            Transformers operate on tensors with shape{' '}
            <code>(batch, seq_len, heads, head_dim)</code>, and debugging shape
            mismatches is one of the most common struggles when implementing
            them. The intuitions we build here will serve you well.
          </p>
          <p>
            Watch the animation on the left as we trace through each operation.
            Code examples appear in the sidebar on the right.
          </p>
        </Prose>
      </ArticleSection>

      {/* Embedding Lookup */}
      <ArticleSection>
        <TOCHeading id="embedding-lookup" level={3}>
          Embedding Lookup: Selecting Rows
        </TOCHeading>
        <Prose>
          <p>
            The animation shows how embedding lookup works. When we convert a
            token ID to an embedding, we&apos;re just selecting a row from a
            matrix. If &quot;cat&quot; has ID 1, we grab row 1 from our
            embedding matrix E.
          </p>
          <p id="embedding-lookup-code">
            This is mathematically equivalent to multiplying by a one-hot
            vector, but in practice we just index directly:
          </p>
        </Prose>
        <FormulaBox label="Embedding Lookup">
          {
            '\\text{embedding} = \\text{one\\_hot}(\\text{id}) \\cdot E = E[\\text{id}]'
          }
        </FormulaBox>
        <Prose>
          <p>
            The one-hot vector has a 1 at position 1 and 0s everywhere else.
            Multiplying it by E extracts exactly row 1. Watch the animation
            highlight the selected row, this is all that embedding lookup
            does.
          </p>
        </Prose>
      </ArticleSection>

      {/* Dot Product */}
      <ArticleSection>
        <TOCHeading id="dot-product-intuition" level={3}>
          The Dot Product: Measuring Similarity
        </TOCHeading>
        <Prose>
          <p>
            Before we can understand matrix multiplication, we need the{' '}
            <strong>dot product</strong>. It&apos;s the foundation of everything
            in neural networks.
          </p>
          <p>
            The animation shows two vectors. As you scroll, vector b rotates to
            align with vector a. Watch how the dot product value changes:
          </p>
        </Prose>
        <FormulaBox label="Dot Product">
          {'a \\cdot b = \\sum_i a_i \\cdot b_i = |a||b|\\cos(\\theta)'}
        </FormulaBox>
        <Prose>
          <p id="dot-product-demo">
            When two vectors point the same direction, their dot product is
            large and positive. When perpendicular, it&apos;s zero. When
            opposite, it&apos;s large and negative.
          </p>
        </Prose>
        <InsightBox title="Why This Matters for Embeddings">
          <p>
            This is why embeddings work. Words with similar meanings get similar
            vectors. &quot;Cat&quot; and &quot;dog&quot; point roughly the same
            direction (both animals), so their dot product is high.
            &quot;Cat&quot; and &quot;democracy&quot; point different
            directions, so their dot product is low.
          </p>
          <p className="mt-2">
            When we multiply embeddings by weight matrices, we&apos;re asking:
            &quot;How much does this input align with each learned
            pattern?&quot;
          </p>
        </InsightBox>
      </ArticleSection>

      {/* Matrix Multiplication */}
      <ArticleSection>
        <TOCHeading id="matmul-intuition" level={3}>
          Matrix Multiplication: Many Dot Products
        </TOCHeading>
        <Prose>
          <p>
            Here&apos;s the key insight: matrix multiplication is just many dot
            products computed in parallel. Watch the animation as each row of W
            computes a dot product with input vector x:
          </p>
        </Prose>
        <FormulaBox label="Matrix-Vector Product">
          {'(Wx)_i = W_{i,:} \\cdot x = \\sum_j W_{ij} x_j'}
        </FormulaBox>
        <Prose>
          <p>
            Each row of W is a &quot;pattern detector.&quot; The dot product
            asks: how much does input x match this pattern? The output is a
            vector of pattern-match scores, computed row by row.
          </p>
          <p id="einops-matmul">
            The einops notation in the sidebar makes this explicit. It reads:
            &quot;For each hidden dimension, sum over the input dimension.&quot;
            This is exactly what parallel dot products do.
          </p>
        </Prose>
        <InsightBox title="Broadcasting">
          <p>
            When shapes don&apos;t quite match, NumPy and PyTorch use{' '}
            <strong>broadcasting</strong>: they automatically expand dimensions
            to make operations work. For example, adding a bias vector{' '}
            <code>[b₁, b₂, b₃]</code> to every row of a matrix &quot;broadcasts&quot;
            the vector across rows. This is how we add a single bias to every example
            in a batch.
          </p>
          <p className="mt-2">
            Broadcasting is powerful but can cause subtle bugs. When you get
            unexpected shapes, check if broadcasting silently changed your
            tensors.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* The Forward Pass */}
      <ArticleSection>
        <TOCHeading id="forward-pass-math" level={3}>
          The Forward Pass: A Concrete Example
        </TOCHeading>
        <Prose>
          <p>
            Let&apos;s trace through a complete forward pass with real numbers.
            We&apos;ll classify the word &quot;cat&quot; as positive or
            negative sentiment. To keep things visible, we&apos;ll use tiny
            dimensions: 4D embeddings and 3 hidden neurons.
          </p>
          <p id="forward-pass-full">
            Watch the animation as data flows through: embedding → hidden →
            output → softmax.
          </p>
        </Prose>
      </ArticleSection>

      {/* Step 1: Embedding */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Step 1: Embedding Lookup</strong>
          </p>
          <p>
            The word &quot;cat&quot; has token ID 1. We grab row 1 from our
            embedding matrix:
          </p>
        </Prose>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># E is our 5×4 embedding matrix</div>
          <div>x = E[1]</div>
          <div className="text-neutral-600 mt-2">
            x = [<span className="text-green-700">0.8</span>,{' '}
            <span className="text-green-700">-0.2</span>,{' '}
            <span className="text-green-700">0.5</span>,{' '}
            <span className="text-green-700">0.1</span>]
          </div>
          <div className="text-neutral-400 mt-1"># shape: (4,) — one 4D vector</div>
        </div>
        <Prose>
          <p>
            That&apos;s it. The embedding for &quot;cat&quot; is now a 4-dimensional
            vector. These numbers were learned during training to capture
            something meaningful about &quot;cat-ness.&quot;
          </p>
        </Prose>
      </ArticleSection>

      {/* Step 2: Hidden Layer */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Step 2: Hidden Layer</strong>
          </p>
          <p>
            Now we transform this embedding through our hidden layer. This is
            where matrix multiplication happens:
          </p>
        </Prose>
        <FormulaBox>{'h = \\text{ReLU}(W_1 x + b_1)'}</FormulaBox>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># W₁ is 3×4, transforms 4D → 3D</div>
          <div className="mb-3">
            <div>W₁ @ x = [0.5, -0.3, 0.2, 0.1] · [0.8, -0.2, 0.5, 0.1]  → <span className="text-blue-700">0.57</span></div>
            <div className="text-neutral-400 text-xs ml-8">= 0.5×0.8 + (-0.3)×(-0.2) + 0.2×0.5 + 0.1×0.1</div>
            <div>{'        '}[0.1, 0.4, -0.2, 0.3] · [0.8, -0.2, 0.5, 0.1]  → <span className="text-blue-700">-0.07</span></div>
            <div>{'        '}[-0.2, 0.1, 0.6, -0.1] · [0.8, -0.2, 0.5, 0.1]  → <span className="text-blue-700">0.11</span></div>
          </div>
          <div className="text-neutral-500 mb-2"># Add bias b₁ = [0.1, 0.1, 0.1]</div>
          <div>pre_relu = [0.67, 0.03, 0.21]</div>
          <div className="text-neutral-500 mt-3 mb-2"># ReLU: keep positives, zero negatives</div>
          <div>h = [<span className="text-green-700">0.67</span>, <span className="text-green-700">0.03</span>, <span className="text-green-700">0.21</span>]</div>
          <div className="text-neutral-400 mt-1"># shape: (3,) — three &quot;features&quot;</div>
        </div>
        <Prose>
          <p>
            Each hidden neuron computes a dot product with the input, asking
            &quot;how much does this embedding match my learned pattern?&quot;
            The ReLU zeros out negative responses.
          </p>
        </Prose>
      </ArticleSection>

      {/* Step 3: Output Layer */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Step 3: Output Layer (Logits)</strong>
          </p>
          <p>
            Another matrix multiply produces raw scores for each class:
          </p>
        </Prose>
        <FormulaBox>{'z = W_2 h + b_2'}</FormulaBox>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># W₂ is 2×3, transforms 3D → 2D (pos/neg)</div>
          <div className="mb-2">
            <div>W₂ @ h = [0.8, -0.5, 0.3] · [0.67, 0.03, 0.21]  → <span className="text-blue-700">0.58</span></div>
            <div>{'        '}[-0.6, 0.7, -0.2] · [0.67, 0.03, 0.21]  → <span className="text-blue-700">-0.42</span></div>
          </div>
          <div className="text-neutral-500 mb-2"># Add bias b₂ = [0.0, 0.0]</div>
          <div>z = [<span className="text-green-700">0.58</span>, <span className="text-red-700">-0.42</span>]</div>
          <div className="text-neutral-400 mt-1"># &quot;logits&quot; — raw scores, not yet probabilities</div>
        </div>
        <Prose>
          <p>
            The positive class got score 0.58, negative got -0.42. Higher is
            better, so the network is leaning positive. But these aren&apos;t
            probabilities yet.
          </p>
        </Prose>
      </ArticleSection>

      {/* Step 4: Softmax */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Step 4: Softmax → Probabilities</strong>
          </p>
          <p>
            Softmax converts logits to probabilities that sum to 1:
          </p>
        </Prose>
        <FormulaBox>
          {'p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}'}
        </FormulaBox>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># Exponentiate</div>
          <div>exp(z) = [exp(0.58), exp(-0.42)] = [1.79, 0.66]</div>
          <div className="text-neutral-500 mt-3 mb-2"># Normalize to sum to 1</div>
          <div>sum = 1.79 + 0.66 = 2.45</div>
          <div className="mt-2">p = [1.79/2.45, 0.66/2.45]</div>
          <div className="mt-1">p = [<span className="text-green-700 font-bold">0.73</span>, <span className="text-red-700">0.27</span>]</div>
          <div className="text-neutral-400 mt-2"># 73% positive, 27% negative</div>
        </div>
        <Prose>
          <p>
            Our network predicts &quot;cat&quot; has 73% positive sentiment.
            That&apos;s the complete forward pass: token ID → embedding →
            hidden features → logits → probabilities.
          </p>
        </Prose>
      </ArticleSection>

      {/* Loss Computation */}
      <ArticleSection>
        <TOCHeading id="loss-computation" level={3}>
          Computing the Loss
        </TOCHeading>
        <Prose>
          <p>
            The animation now shows prediction vs target. The forward pass gave
            us probabilities. Now we measure how wrong we are. If the true label
            is &quot;positive&quot; (class 0) and we predicted 70% positive:
          </p>
        </Prose>
        <FormulaBox label="Cross-Entropy Loss">
          {
            '\\mathcal{L} = -\\log(p_{\\text{true}}) = -\\log(0.7) \\approx 0.36'
          }
        </FormulaBox>
        <Prose>
          <p>
            A loss of 0.36 isn&apos;t terrible. If we&apos;d predicted 10%
            positive, the loss would be{' '}
            <Math>{'-\\log(0.1) \\approx 2.3'}</Math>, much worse. The loss
            grows as we become more confidently wrong.
          </p>
        </Prose>
      </ArticleSection>

      {/* Backpropagation */}
      <ArticleSection>
        <TOCHeading id="backprop-math" level={3}>
          Backpropagation: Gradients Flow Backward
        </TOCHeading>
        <Prose>
          <p>
            Now comes the crucial question: how do we update the weights to reduce
            the loss? We need to know how much each weight contributed to the error.
            This requires the <strong>chain rule</strong> from calculus.
          </p>
        </Prose>
      </ArticleSection>

      {/* Chain Rule Explanation */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>The Chain Rule</strong>
          </p>
          <p>
            Imagine a chain of operations: <Math>{'x \\to h \\to y \\to L'}</Math>.
            If we want to know how <Math>{'x'}</Math> affects <Math>{'L'}</Math>,
            we multiply the effects along the chain:
          </p>
        </Prose>
        <FormulaBox label="Chain Rule">
          {
            '\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h} \\cdot \\frac{\\partial h}{\\partial x}'
          }
        </FormulaBox>
        <Prose>
          <p>
            Each term is a <strong>local gradient</strong> that we compute at that
            step. The beauty is we only need to know how each operation affects
            its immediate output. Then we multiply them all together.
          </p>
        </Prose>
      </ArticleSection>

      {/* Concrete backprop example */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Following a Gradient Backward</strong>
          </p>
          <p>
            Let&apos;s trace through our &quot;cat&quot; example. The network predicted
            73% positive but the true label was 100% positive (class 0). The loss was:
          </p>
        </Prose>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># Loss: how wrong were we?</div>
          <div>L = -log(0.73) = <span className="text-red-600 font-bold">0.31</span></div>
          <div className="text-neutral-500 mt-4 mb-2"># Step 1: Gradient at output (softmax + cross-entropy)</div>
          <div>∂L/∂z = p - y = [0.73, 0.27] - [1, 0] = [<span className="text-red-600">-0.27</span>, <span className="text-red-600">0.27</span>]</div>
          <div className="text-neutral-400 text-xs mt-1">
            # Remarkably simple! The gradient is just (predicted - actual)
          </div>
        </div>
        <Prose>
          <p>
            Now we propagate this gradient backward through each layer:
          </p>
        </Prose>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-sm my-4">
          <div className="text-neutral-500 mb-2"># Step 2: Through output layer (W₂)</div>
          <div>∂L/∂h = W₂ᵀ @ (∂L/∂z)</div>
          <div className="mt-1">{'       '} = W₂ᵀ @ [-0.27, 0.27]</div>
          <div className="text-neutral-400 text-xs mt-1 mb-3">
            # Each hidden neuron gets credit proportional to its weight
          </div>

          <div className="text-neutral-500 mb-2"># Step 3: Through ReLU</div>
          <div>∂L/∂pre_h = ∂L/∂h × (h &gt; 0 ? 1 : 0)</div>
          <div className="text-neutral-400 text-xs mt-1 mb-3">
            # ReLU gradient: 1 if active, 0 if not (gradient dies!)
          </div>

          <div className="text-neutral-500 mb-2"># Step 4: Through hidden layer (W₁)</div>
          <div>∂L/∂W₁ = ∂L/∂pre_h ⊗ x</div>
          <div className="text-neutral-400 text-xs mt-1">
            # Outer product: each weight&apos;s gradient = input × error signal
          </div>
        </div>
        <InsightBox title="Why Gradients Get Multiplied">
          <p>
            Notice the pattern: at each step, we <strong>multiply</strong> by the
            local gradient. If any gradient is very small (like a saturated
            sigmoid: ~0.01), the product shrinks rapidly. After 10 layers:
          </p>
          <p className="font-mono text-sm mt-2 text-center">
            0.01 × 0.01 × ... × 0.01 = 0.01¹⁰ = <span className="text-red-600">0.0000000001</span>
          </p>
          <p className="mt-2">
            This is the <strong>vanishing gradient problem</strong>. It&apos;s why
            deep networks were hard to train before modern techniques like ReLU,
            skip connections, and careful initialization.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* Interactive Chain Rule */}
      <ArticleSection>
        <Prose>
          <p>
            <strong>Try It: Interactive Chain Rule</strong>
          </p>
          <p>
            Adjust the input and weight below to see how gradients flow backward.
            Watch how changing early values affects the entire chain.
          </p>
        </Prose>
        <div className="my-6">
          <ChainRuleInteractive />
        </div>
      </ArticleSection>


      {/* The Update */}
      <ArticleSection>
        <TOCHeading id="weight-update" level={3}>
          The Update: Where Learning Happens
        </TOCHeading>
        <Prose>
          <p>
            Finally, we nudge each weight in the direction that reduces loss:
          </p>
        </Prose>
        <FormulaBox label="Gradient Descent Update">
          {
            'W_{\\text{new}} = W_{\\text{old}} - \\eta \\cdot \\frac{\\partial \\mathcal{L}}{\\partial W}'
          }
        </FormulaBox>
        <Prose>
          <p>
            The learning rate <Math>{'\\eta'}</Math> controls how big a step we
            take. Too big and we overshoot. Too small and we&apos;re slow.
            Repeat this process millions of times.
          </p>
        </Prose>
      </ArticleSection>

      {/* Full Picture */}
      <ArticleSection>
        <TOCHeading id="full-picture" level={3}>
          The Full Picture
        </TOCHeading>
        <Prose>
          <p id="training-loop-code">
            This is all of deep learning. Forward pass (matrix multiplies), loss
            computation, backward pass (chain rule), weight update (gradient
            descent). The complete training loop is just 4 lines of PyTorch.
          </p>
        </Prose>
        <InsightBox title="What's Actually Being Learned">
          <p>When we train, we&apos;re adjusting three things:</p>
          <UnorderedList className="mt-2">
            <li>
              <strong>Embeddings (E)</strong>: Which words should cluster
              together? &quot;Great&quot; and &quot;excellent&quot; should have
              similar vectors.
            </li>
            <li>
              <strong>Hidden weights (W₁)</strong>: What patterns in the input
              matter? Maybe &quot;positive adjective + noun&quot; is a useful
              pattern.
            </li>
            <li>
              <strong>Output weights (W₂)</strong>: How do those patterns map to
              sentiment? Pattern A suggests positive, pattern B suggests
              negative.
            </li>
          </UnorderedList>
          <p className="mt-3">
            The network discovers these patterns automatically. We never tell it
            what &quot;positive&quot; means. We just show it examples and let
            gradient descent find weights that minimize prediction error.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* Why This Matters */}
      <ArticleSection>
        <TOCHeading id="why-shapes-matter" level={3}>
          Why This Matters: Transformer Dimensions
        </TOCHeading>
        <Prose>
          <p id="transformer-shapes">
            Understanding these matrix operations becomes critical when working
            with transformers. A transformer&apos;s attention mechanism operates
            on tensors with shape <code>(batch, n_heads, seq_len, head_dim)</code>
            . That&apos;s four dimensions!
          </p>
          <p>
            When you see errors like &quot;mat1 and mat2 shapes cannot be
            multiplied&quot;, the intuitions from this section help you debug.
            Each dimension has meaning: batch lets us process multiple sequences
            in parallel, n_heads splits attention into independent subspaces,
            seq_len is how many tokens, and head_dim is the features per
            attention head.
          </p>
          <p>
            GPT-2 Small uses 12 heads with 64 dimensions each. GPT-3 uses 96
            heads with 128 dimensions. The math is identical to what we covered.
            It&apos;s just more dimensions.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== CONCLUSION ========== */}
      <ArticleSection>
        <TOCHeading id="conclusion" level={2}>
          From Stardust to Silicon
        </TOCHeading>
        <Prose>
          <p id="stardust-conclusion">
            We started with a question: how do we make sand think?
          </p>
          <p>
            The answer, it turns out, is to copy the process that made{' '}
            <em>us</em> think. Build a system that makes predictions. Compare
            those predictions to reality. Use the error to update internal
            parameters. Repeat, billions of times.
          </p>
          <p>
            The brain does this through neurons, synapses, and electrochemical
            signals shaped by billions of years of evolution.
          </p>
          <p>
            We do it through matrix multiplication, loss functions, and gradient
            descent, running on sand we&apos;ve tricked into doing math.
          </p>
          <p>
            The result is systems that can classify sentiment, recognize images,
            and generate text. They&apos;re not intelligent in the way we are.
            But they&apos;re getting better at predicting the world, which, by
            our working definition, means they&apos;re getting better at
            thinking.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <InsightBox title="What's Next">
          <p>
            We&apos;ve covered the foundations: how neural networks learn, how
            we encode language, and the mechanics of training. But our simple
            network is just that, simple.
          </p>
          <p className="mt-2">
            In the next section, we&apos;ll explore the architectures that
            transformed AI: recurrent networks, the vanishing gradient problem,
            LSTMs, and finally the attention mechanism that powers today&apos;s
            language models.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-10 flex justify-center">
        <TabSwitchButton targetTab="foundations" label="Back to Foundations" />
      </div>
    </>
  );
}
