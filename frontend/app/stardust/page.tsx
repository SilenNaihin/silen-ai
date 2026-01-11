'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import { ParticlesAnimation } from '@/components/stardust/ParticlesAnimation';
import { WorldModelAnimation } from '@/components/stardust/WorldModelAnimation';
import { ParabolaAnimation } from '@/components/stardust/ParabolaAnimation';
import { PerceptronAnimation } from '@/components/stardust/PerceptronAnimation';
import { TokenizationAnimation } from '@/components/stardust/TokenizationAnimation';
import { TrainingLoopAnimation } from '@/components/stardust/TrainingLoopAnimation';
import { UseNotebook } from '@/contexts/NotebookContext';
import {
  TOCProvider,
  TOCHeading,
} from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import {
  TabsProvider,
  TabButtons,
  TabContent,
  TabSwitchButton,
} from '@/components/navigation/Tabs';
import {
  Prose,
  InsightBox,
  QuoteBox,
  MutedText,
  UnorderedList,
  Aside,
} from '@/components/article/Callouts';
import { InlineCode } from '@/components/article/InlineCode';
import { Math, FormulaBox } from '@/components/article/Math';

import { ShapeRecognitionAnimation } from '@/components/stardust/ShapeRecognitionAnimation';
import { TrainingInteractive } from '@/components/stardust/TrainingInteractive';
import { TokenizationInteractive } from '@/components/stardust/TokenizationInteractive';
import { NumericalizationInteractive } from '@/components/stardust/NumericalizationInteractive';
import { EmbeddingInteractive } from '@/components/stardust/EmbeddingInteractive';
import { EmbeddingAnimation } from '@/components/stardust/EmbeddingAnimation';
import { CrossEntropyAnimation } from '@/components/stardust/CrossEntropyAnimation';
import { CrossEntropyInteractive } from '@/components/stardust/CrossEntropyInteractive';
import { MatrixMathAnimation } from '@/components/stardust/MatrixMathAnimation';
import { OverfittingAnimation } from '@/components/stardust/OverfittingAnimation';
import { HyperparametersAnimation } from '@/components/stardust/HyperparametersAnimation';
import { SimpleRecurrenceAnimation } from '@/components/stardust/SimpleRecurrenceAnimation';
import { UnrolledRNNAnimation } from '@/components/stardust/UnrolledRNNAnimation';
import { BPTTAnimation } from '@/components/stardust/BPTTAnimation';
import { VanishingGradientAnimation } from '@/components/stardust/VanishingGradientAnimation';
import { LSTMProgressiveAnimation } from '@/components/stardust/LSTMProgressiveAnimation';
import { ActivationFunctionsAnimation } from '@/components/stardust/ActivationFunctionsAnimation';
import { ContextLossAnimation } from '@/components/stardust/ContextLossAnimation';
import { SimpleRNNInteractive } from '@/components/stardust/SimpleRNNInteractive';
import { LSTMBuildupInteractive } from '@/components/stardust/LSTMBuildupInteractive';
import { GradientFlowInteractive } from '@/components/stardust/GradientFlowInteractive';
import { ChainRuleInteractive } from '@/components/stardust/ChainRuleInteractive';
import { StardustToSiliconAnimation } from '@/components/stardust/StardustToSiliconAnimation';

const TABS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'training', label: 'Training' },
  { id: 'architectures', label: 'Architectures' },
];

const NOTEBOOK_GITHUB_URL =
  'https://github.com/SilenNaihin/silen-ai/blob/main/projects/rnn/networks.ipynb';

export default function StardustArticle() {
  return (
    <TOCProvider>
      <TabsProvider tabs={TABS} defaultTab="foundations">
        <UseNotebook
          path="projects/rnn/networks.ipynb"
          githubUrl={NOTEBOOK_GITHUB_URL}
        />

        <StickyHeader
          title="How Do We Make Stardust Think?"
          tabs={<TabButtons variant="minimal" />}
        />

        <div className="pt-14">
          <ArticleLayout
            leftContent={(scrollProgress) => (
              <>
                {/* Tab 1: Foundations animations */}
                <TabContent tabId="foundations">
                  <AnimationSequence
                    scrollProgress={scrollProgress}
                    animations={[
                      // Intro: Particles forming
                      {
                        render: (p) => (
                          <ParticlesAnimation progress={p} startOffset={0.15} />
                        ),
                        startElementId: 'intro',
                        overlap: 0.15,
                      },
                      // Section 1: World model / abstract thinking visualization
                      {
                        render: (p) => <WorldModelAnimation progress={p} />,
                        startElementId: 'what-is-thinking',
                        overlap: 0.15,
                      },
                      // Section 2: Shape recognition learning
                      {
                        render: (p) => (
                          <ShapeRecognitionAnimation progress={p} />
                        ),
                        startElementId: 'how-brain-does-it',
                        milestones: [
                          { elementId: 'brain-prediction', progress: 0.3 },
                          { elementId: 'brain-error', progress: 0.5 },
                          { elementId: 'brain-learning', progress: 0.7 },
                          { elementId: 'brain-correct', progress: 0.9 },
                        ],
                        overlap: 0.1,
                      },
                      // Section 3: Parabola/gradient descent visualization
                      {
                        render: (p) => <ParabolaAnimation progress={p} />,
                        startElementId: 'how-we-rebuild',
                        milestones: [
                          { elementId: 'parabola-setup', progress: 0.15 },
                          { elementId: 'parabola-noisy', progress: 0.3 },
                          { elementId: 'loss-initial', progress: 0.45 },
                          { elementId: 'gradient-step', progress: 0.65 },
                          { elementId: 'training-loop', progress: 0.85 },
                        ],
                        overlap: 0.1,
                      },
                      // Section 4: Perceptron/building block visualization
                      {
                        render: (p) => <PerceptronAnimation progress={p} />,
                        startElementId: 'simplest-building-block',
                        milestones: [
                          { elementId: 'perceptron-code', progress: 0.6 },
                          { elementId: 'simple-network', progress: 0.85 },
                        ],
                        overlap: 0.1,
                      },
                      // Section 5: Tokenization visualization
                      {
                        render: (p) => <TokenizationAnimation progress={p} />,
                        startElementId: 'language-to-numbers',
                        milestones: [
                          { elementId: 'tokenization', progress: 0.4 },
                          { elementId: 'numericalization', progress: 0.8 },
                        ],
                        overlap: 0.1,
                      },
                      // Section 5b: Embeddings training visualization
                      {
                        render: (p) => <EmbeddingAnimation progress={p} />,
                        startElementId: 'embeddings',
                        overlap: 0.15,
                      },
                    ]}
                  />
                </TabContent>

                {/* Tab 2: Training animations */}
                <TabContent tabId="training">
                  <AnimationSequence
                    scrollProgress={scrollProgress}
                    animations={[
                      // Training loop visualization
                      {
                        render: (p) => <TrainingLoopAnimation progress={p} />,
                        startElementId: 'teaching-sand',
                        overlap: 0.1,
                      },
                      // Overfitting and regularization
                      {
                        render: (p) => <OverfittingAnimation progress={p} />,
                        startElementId: 'overfitting',
                        milestones: [
                          { elementId: 'overfitting-curves', progress: 0.2 },
                          { elementId: 'dropout', progress: 0.5 },
                          { elementId: 'dropout-demo', progress: 0.7 },
                          { elementId: 'regularization-techniques', progress: 1.0 },
                        ],
                        overlap: 0.1,
                      },
                      // Hyperparameters
                      {
                        render: (p) => <HyperparametersAnimation progress={p} />,
                        startElementId: 'hyperparameters',
                        milestones: [
                          { elementId: 'learning-rate', progress: 0.15 },
                          { elementId: 'batch-size', progress: 0.45 },
                          { elementId: 'architecture-capacity', progress: 0.75 },
                        ],
                        overlap: 0.1,
                      },
                      // Cross-entropy deep dive
                      {
                        render: (p) => <CrossEntropyAnimation progress={p} />,
                        startElementId: 'cross-entropy',
                        milestones: [
                          {
                            elementId: 'cross-entropy-surprise',
                            progress: 0.2,
                          },
                          { elementId: 'cross-entropy-demo', progress: 0.5 },
                          {
                            elementId: 'cross-entropy-gradient',
                            progress: 0.75,
                          },
                          { elementId: 'cross-entropy-code', progress: 0.9 },
                        ],
                        overlap: 0.1,
                      },
                      // Math of Training section - matrix math visualizations
                      {
                        render: (p) => <MatrixMathAnimation progress={p} />,
                        startElementId: 'math-of-training',
                        milestones: [
                          {
                            elementId: 'dot-product-intuition',
                            progress: 0.15,
                          },
                          { elementId: 'matmul-intuition', progress: 0.3 },
                          { elementId: 'forward-pass-math', progress: 0.45 },
                          { elementId: 'loss-computation', progress: 0.7 },
                          { elementId: 'backprop-math', progress: 0.85 },
                        ],
                        overlap: 0.1,
                      },
                      // Closing animation - From Stardust to Silicon
                      {
                        render: (p) => <StardustToSiliconAnimation progress={p} />,
                        startElementId: 'stardust-conclusion',
                      },
                    ]}
                  />
                </TabContent>

                {/* Tab 3: Architectures animations */}
                <TabContent tabId="architectures">
                  <AnimationSequence
                    scrollProgress={scrollProgress}
                    animations={[
                      // Simple recurrence
                      {
                        render: (p) => <SimpleRecurrenceAnimation progress={p} />,
                        startElementId: 'the-sequence-problem',
                        milestones: [
                          { elementId: 'simplest-rnn', progress: 0.3 },
                          { elementId: 'weight-sharing', progress: 0.7 },
                        ],
                        overlap: 0.1,
                      },
                      // Unrolled view
                      {
                        render: (p) => <UnrolledRNNAnimation progress={p} />,
                        startElementId: 'unrolling',
                        overlap: 0.1,
                      },
                      // BPTT
                      {
                        render: (p) => <BPTTAnimation progress={p} />,
                        startElementId: 'bptt',
                        milestones: [
                          { elementId: 'full-bptt', progress: 0.35 },
                          { elementId: 'tbptt', progress: 0.7 },
                        ],
                        overlap: 0.1,
                      },
                      // Vanishing gradients
                      {
                        render: (p) => <VanishingGradientAnimation progress={p} />,
                        startElementId: 'rnn-problems',
                        milestones: [
                          { elementId: 'vanishing-gradients', progress: 0.4 },
                          { elementId: 'exploding-gradients', progress: 0.7 },
                        ],
                        overlap: 0.1,
                      },
                      // Context loss demo
                      {
                        render: (p) => <ContextLossAnimation progress={p} />,
                        startElementId: 'long-term-context-demo',
                        overlap: 0.1,
                      },
                      // LSTM build-up
                      {
                        render: (p) => <LSTMProgressiveAnimation progress={p} />,
                        startElementId: 'building-lstm',
                        milestones: [
                          { elementId: 'the-cell-state', progress: 0.15 },
                          { elementId: 'forget-gate', progress: 0.3 },
                          { elementId: 'input-gate', progress: 0.45 },
                          { elementId: 'output-gate', progress: 0.6 },
                          { elementId: 'lstm-complete', progress: 0.8 },
                        ],
                        overlap: 0.1,
                      },
                      // Activation functions
                      {
                        render: (p) => <ActivationFunctionsAnimation progress={p} />,
                        startElementId: 'activation-functions',
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
              How Do We Make Stardust Think?
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              From neurons to neural networks
            </p>

            {/* Tab 1: Foundations */}
            <TabContent tabId="foundations">
              <FoundationsContent />
            </TabContent>

            {/* Tab 2: Training */}
            <TabContent tabId="training">
              <TrainingContent />
            </TabContent>

            {/* Tab 3: Architectures */}
            <TabContent tabId="architectures">
              <ArchitecturesContent />
            </TabContent>

            <div className="h-32" />
          </ArticleLayout>
        </div>
      </TabsProvider>
    </TOCProvider>
  );
}

function FoundationsContent() {
  return (
    <>
      {/* ========== INTRO ========== */}
      <ArticleSection>
        <Prose>
          <p id="intro">
            Our brain does it through something like energy minimization given
            billions of years of data by leveraging the laws of physics and
            chemistry.
          </p>
          <p>Humanity has done its best to reverse engineer this process.</p>
          <p>
            It started from understanding the fundamental building block of the
            brain, <strong>the neuron</strong>, when Golgi figured out staining.
            Others built on this work and we discovered that our brain is an
            incredibly complex mess of <strong>100 billion neurons</strong> and
            a <strong>quadrillion connections</strong> between these neurons
            called synapses.
          </p>
          <p>
            And that the biggest part of our brain, the cerebrum, is broadly the
            same building block copied over and over again with the simple
            functions of inhibition or excitation through action potential.
          </p>
          <MutedText>Broadly.</MutedText>
          <p>
            In truth, we barely understand it (but we do understand much more
            than my simplified description that I wrote for the intro).
          </p>
          <p>
            We do know it has a remarkably efficient ability to map the data
            distribution of reality.
          </p>
          <p className="text-xl font-semibold">So how do we make sand think?</p>
          <p className="text-2xl font-bold">
            We copy other stardust that can think.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 1: WHAT IS THINKING? ========== */}
      <ArticleSection>
        <TOCHeading id="what-is-thinking" level={2}>
          What is Thinking?
        </TOCHeading>
        <Prose>
          <p>
            We won&apos;t get philosophical here. For the purposes of this
            article, <em>thinking</em> will mean something narrower,
            operational, and useful.
          </p>
          <p>
            Across neuroscience and modern AI, there is growing convergence on a
            simple idea:
          </p>
        </Prose>
        <QuoteBox>
          <p>
            Thinking is the construction and use of internal models that capture
            the structure of the world.
          </p>
        </QuoteBox>
        <Prose>
          <p>
            Different researchers emphasize different aspects of this process,
            but the core remains the same.
          </p>
          <UnorderedList>
            <li>
              <strong>Yoshua Bengio</strong> frames intelligence as the ability
              to <strong>learn abstractions</strong>. These are representations
              that compress experience while preserving the underlying causal
              and compositional structure of reality. Thinking, in this view, is
              the manipulation of these abstract world models to reason,
              generalize, and act.
            </li>
            <li>
              <strong>Jeff Hawkins</strong> approaches the problem from
              neuroscience. His central claim is that the brain is fundamentally
              a <strong>prediction machine</strong>. The better a system can
              predict what will happen next (across time, space, and modality),
              the more intelligent it appears.
            </li>
            <li>
              <strong>Karl Friston</strong> frames thinking as{' '}
              <strong>inference under uncertainty</strong>. In his view,
              biological intelligence emerges from systems that minimize
              prediction error (or &quot;free energy&quot;) by continuously
              updating an internal generative model of the world. Thinking,
              then, is the process of reducing surprise by bringing internal
              models into alignment with reality.
            </li>
          </UnorderedList>
          <p>
            These perspectives are not in conflict. Prediction <em>requires</em>{' '}
            a model of the world, and good models are those that capture its
            true structure.
          </p>
          <p>
            So for the rest of this article, we will use the following working
            definition:
          </p>
        </Prose>
        <QuoteBox>
          <p className="font-semibold">
            Thinking is understanding the world well enough to predict it, and
            to imagine how it could be otherwise.
          </p>
        </QuoteBox>
        <Prose>
          <p>
            That definition is deliberately minimal. It avoids consciousness,
            qualia, or meaning, and instead focuses on what can be implemented,
            measured, and scaled.
          </p>
          <p>
            The rest of this article is about how we approximate this process in
            silicon.
          </p>
        </Prose>
        <InsightBox title="Energy Minimization">
          <p>
            There&apos;s a deep connection here to physics. Intelligent systems
            seem to find minimum energy configurations: stable points where
            predictions match reality. In thermodynamic terms, learning can be
            viewed as a process that maximizes entropy over time while
            maintaining internal structure. The second law of thermodynamics may
            be more fundamental to intelligence than we realize.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 2: HOW DOES OUR BRAIN DO IT? ========== */}
      <ArticleSection>
        <TOCHeading id="how-brain-does-it" level={2}>
          How Does Our Brain Do It?
        </TOCHeading>
        <Prose>
          <p>
            The brain&apos;s fundamental unit of computation is the{' '}
            <strong>neuron</strong>. Each neuron receives signals from thousands
            of other neurons through connections called{' '}
            <strong>synapses</strong>. When enough excitatory signals
            accumulate, the neuron &quot;fires&quot; and sends an electrical
            pulse called an <strong>action potential</strong> down its axon to
            connected neurons.
          </p>
          <p>
            Some connections are <strong>excitatory</strong> (they encourage
            firing), others are <strong>inhibitory</strong> (they suppress it).
            The strength of each connection determines how much influence one
            neuron has over another.
          </p>
          <p id="brain-prediction">
            Modern neuroscience increasingly views the brain as a{' '}
            <strong>prediction machine</strong>. Your brain isn&apos;t passively
            receiving sensory data. It&apos;s constantly generating predictions
            about what it expects to perceive, then comparing those predictions
            against actual input.
          </p>
          <p>
            Let&apos;s trace through a concrete example. Watch the animation as
            you read.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p className="font-semibold">You see a shape.</p>
          <p>
            Light reflects off the object and enters your eye. Your retina
            converts these photons into electrical signals that travel through
            the optic nerve to your visual cortex.
          </p>
          <p id="brain-error">
            Here&apos;s where it gets interesting. Before the signal fully
            propagates, your brain has already made a{' '}
            <strong>prediction</strong> about what it&apos;s seeing based on
            context, prior experience, and partial information.
          </p>
          <p>
            Let&apos;s say your brain predicts &quot;square&quot; but the shape
            is actually a circle. This mismatch generates a{' '}
            <strong>prediction error</strong>.
          </p>
          <p id="brain-learning">
            The error signal propagates backward through the network. This is
            the key moment: synaptic connections that contributed to the wrong
            prediction get weakened, while connections that could have led to
            the correct answer get strengthened.
          </p>
          <p>
            This is <strong>learning</strong>. Through mechanisms like long-term
            potentiation (LTP) and long-term depression (LTD), the physical
            structure of synapses changes based on prediction errors.
          </p>
          <p id="brain-correct">
            The next time you see the same shape, the updated connections
            produce the correct prediction: &quot;circle.&quot; The prediction
            matches reality. No error signal. The pattern is reinforced.
          </p>
        </Prose>
        <InsightBox title="The Core Loop">
          <p>
            <strong>Predict → Compare → Error → Update → Repeat</strong>
          </p>
          <p className="mt-2">
            This cycle runs continuously, billions of times per second, across
            billions of neurons. It&apos;s how the brain builds and refines its
            internal model of the world.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 3: HOW DO WE REBUILD THIS? ========== */}
      <ArticleSection>
        <TOCHeading id="how-we-rebuild" level={2}>
          How Do We Rebuild This?
        </TOCHeading>
        <Prose>
          <p>
            Let&apos;s start from something incredibly simple. Forget images,
            forget language. Let&apos;s predict a parabola.
          </p>
          <p>
            Our &quot;universe&quot; follows a simple rule:{' '}
            <Math>{'y = ax^2 + bx + c'}</Math>. A human living in this universe
            would just need to learn three numbers (<Math>a</Math>,{' '}
            <Math>b</Math>, and <Math>c</Math>) to have a complete model of
            their world.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="parabola-setup">
            Here&apos;s the ground truth, the &quot;laws of physics&quot; in our
            toy universe:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="parabola-noisy">
            But of course, a being in this universe doesn&apos;t get to see the
            clean equation. They observe noisy samples:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Now the prediction problem becomes clear: given only these noisy
            observations, can we figure out the underlying rule?
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="measuring-wrong" level={3}>
          Measuring &quot;Wrong&quot;
        </TOCHeading>
        <Prose>
          <p>
            Before we can improve, we need to know how wrong we are. Let&apos;s
            start with a guess: <Math>{'a=0.5, b=0, c=0'}</Math>.
          </p>
          <p id="loss-initial">
            How bad is this guess? We can measure it by looking at how far off
            each prediction is from the actual data:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            The <strong>loss function</strong> quantifies our wrongness. A
            simple choice is the <strong>Mean Absolute Error (MAE)</strong>: add
            up all the ways we were wrong, then average.
          </p>
        </Prose>
        <FormulaBox label="Mean Absolute Error">
          {'\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|'}
        </FormulaBox>
        <Prose>
          <p>
            Our goal is now clear: find values of <Math>a</Math>, <Math>b</Math>
            , and <Math>c</Math> that minimize this loss.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="manual-search" level={3}>
          The Tedious Way
        </TOCHeading>
        <Prose>
          <p>
            One approach: try different values for <Math>a</Math> and see if the
            loss goes down. Then do the same for <Math>b</Math>. Then{' '}
            <Math>c</Math>.
          </p>
          <p id="manual-adjust">Let&apos;s try it:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            This is tedious. And there&apos;s a deeper problem: the parameters
            are
            <strong> interdependent</strong>. Improving <Math>a</Math> changes
            how
            <Math>b</Math> should be adjusted. They&apos;re all tangled
            together.
          </p>
          <p id="loss-curve-a">
            Let&apos;s visualize what the loss looks like as we vary just{' '}
            <Math>a</Math>:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="loss-curve-b">
            And for <Math>b</Math>:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="loss-surface">
            When we consider two parameters at once, we get a{' '}
            <strong>loss surface</strong>:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            See that valley? That&apos;s where the optimal parameters live. We
            need to find our way there.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="gradient-descent" level={3}>
          Derivatives to the Rescue
        </TOCHeading>
        <Prose>
          <p>
            Here&apos;s the key insight: the <strong>derivative</strong> tells
            us not just whether to go up or down, but <em>how fast</em> the loss
            is changing in each direction.
          </p>
          <p>
            The <strong>gradient</strong> is just the vector of partial
            derivatives, one for each parameter. It points &quot;uphill&quot;
            toward increasing loss.
          </p>
          <p>
            So if we want to <em>decrease</em> loss, we go in the opposite
            direction:
          </p>
        </Prose>
        <FormulaBox label="Gradient Descent Update">
          {
            '\\theta_{\\text{new}} = \\theta_{\\text{old}} - \\eta \\cdot \\nabla_{\\theta} \\mathcal{L}'
          }
        </FormulaBox>
        <Prose>
          <p>
            Where <Math>\eta</Math> is the <strong>learning rate</strong>, which
            controls how big a step we take. Too big and we overshoot. Too small
            and we&apos;re slow.
          </p>
          <p id="gradient-step">Let&apos;s see one gradient descent step:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="training-loop">
            Now we can run the full loop. Watch the curve converge:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Computers are <em>really fast</em> at this. What takes us minutes to
            think through, a GPU can do billions of times per second.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="unknown-form" level={3}>
          What If We Don&apos;t Know the Form?
        </TOCHeading>
        <Prose>
          <p>
            We cheated. We knew the universe was a parabola, so we looked for
            <Math>a</Math>, <Math>b</Math>, <Math>c</Math>. What if we
            didn&apos;t know the functional form at all?
          </p>
          <p>
            Maybe we could approximate any curve by adding up simple functions.
            Lines are simple. What if we add a bunch of lines together?
          </p>
          <p id="linear-combo">Let&apos;s try:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Hmm. Adding lines gives us... another line. Linear functions are
            <strong> commutative</strong>. Their sum is always linear, no matter
            how many you add.
          </p>
          <p>We need to break linearity.</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="nonlinearity" level={3}>
          Breaking Linearity
        </TOCHeading>
        <Prose>
          <p>
            Enter the <strong>ReLU</strong> (Rectified Linear Unit): the
            simplest possible nonlinearity.
          </p>
        </Prose>
        <FormulaBox label="ReLU">{'\\text{ReLU}(x) = \\max(0, x)'}</FormulaBox>
        <Prose>
          <p id="relu-viz">
            It&apos;s just &quot;if negative, make it zero.&quot; That&apos;s
            it.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="relu-combo">
            Now let&apos;s add our lines again, but with ReLU applied to each:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            The sum is no longer a line! By adding &quot;bent&quot; lines
            together, we can approximate curves.
          </p>
          <p id="uat-demo">
            Add more bent lines, and we can approximate <em>any</em> continuous
            function arbitrarily well:
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            This is the <strong>Universal Approximation Theorem</strong>. With
            enough ReLU&apos;d linear functions, we can approximate any
            continuous function to arbitrary precision.
          </p>
        </Prose>
        <InsightBox title="Terminology Mapping">
          <p>Now we can map our intuitions to standard ML jargon:</p>
          <UnorderedList className="mt-2">
            <li>
              <Math>{'\\max(0, x)'}</Math> = ReLU ={' '}
              <strong>activation function</strong>
            </li>
            <li>
              MAE = <strong>loss function</strong> (what we optimize)
            </li>
            <li>
              <Math>a, b, c</Math> = <strong>parameters</strong> /{' '}
              <strong>weights</strong>
            </li>
            <li>
              The things we&apos;re predicting = <strong>features</strong>
            </li>
          </UnorderedList>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 4: THE SIMPLEST BUILDING BLOCK ========== */}
      <ArticleSection>
        <TOCHeading id="simplest-building-block" level={2}>
          The Simplest Building Block
        </TOCHeading>
        <Prose>
          <p>
            Let&apos;s put it all together to create the simplest unit of
            &quot;artificial thinking&quot;: the <strong>perceptron</strong>.
          </p>
          <p>
            A perceptron takes inputs, multiplies each by a weight, adds them
            up, adds a bias, and passes the result through an activation
            function:
          </p>
        </Prose>
        <FormulaBox label="Perceptron">
          {'y = \\sigma(\\mathbf{w} \\cdot \\mathbf{x} + b)'}
        </FormulaBox>
        <Prose>
          <p>Compare this to a biological neuron:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <QuoteBox>
            <p>
              <strong>Brain:</strong>
            </p>
            <UnorderedList>
              <li>Signals arrive from connected neurons</li>
              <li>Synaptic strengths determine influence</li>
              <li>If total exceeds threshold → fire</li>
              <li>Error signaled via prediction mismatch</li>
              <li>Synapses strengthen or weaken (LTP/LTD)</li>
            </UnorderedList>
            <p className="mt-3">
              <strong>Silicon:</strong>
            </p>
            <UnorderedList>
              <li>Inputs arrive as numbers</li>
              <li>Weights determine influence</li>
              <li>Sum + bias → activation function</li>
              <li>Error computed via loss function</li>
              <li>Weights updated via gradient descent</li>
            </UnorderedList>
          </QuoteBox>
          <p>
            The silicon version is cruder but more explicit. We can see exactly
            what&apos;s happening, measure it, and optimize it.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="perceptron-code">Here&apos;s a single perceptron in code:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Stack multiple perceptrons together and you get a{' '}
            <strong>layer</strong>. Stack layers and you get a{' '}
            <strong>neural network</strong>.
          </p>
          <p id="simple-network">A simple 2-layer network:</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            As Andrej Karpathy puts it, we&apos;ve created (in the latent space
            of intelligence) something closer to spirits than animals. These
            systems learn, but they don&apos;t learn like we do. They optimize,
            but they don&apos;t understand. They predict, but they don&apos;t
            know.
          </p>
          <MutedText>
            Or do they? That&apos;s a question for another article.
          </MutedText>
        </Prose>
      </ArticleSection>

      {/* ========== THE TRAINING LOOP ========== */}
      <ArticleSection>
        <TOCHeading id="the-loop" level={2}>
          The Training Loop
        </TOCHeading>
        <Aside title="The Chinese Room">
          <p>
            Understanding language seems to require a robust world model. But
            consider Searle&apos;s Chinese Room: a person who doesn&apos;t speak
            Chinese sits in a room with rulebooks. They receive Chinese
            characters, follow rules to produce responses, and appear fluent
            without understanding a word.
          </p>
          <p>
            Are our neural networks doing something similar? They manipulate
            symbols according to learned patterns. Whether this constitutes
            &quot;understanding&quot; remains one of AI&apos;s deepest
            questions.
          </p>
        </Aside>
        <Prose>
          <p>
            Every modern neural network, from GPT-4 to AlphaFold, follows the
            same fundamental loop:
          </p>
        </Prose>
        <QuoteBox>
          <p>
            <strong>1. Initialize</strong> - Start with random weights
          </p>
          <p>
            <strong>2. Forward pass</strong> - Push data through the network
          </p>
          <p>
            <strong>3. Compute loss</strong> - Measure how wrong we are
          </p>
          <p>
            <strong>4. Backward pass</strong> - Calculate gradients
          </p>
          <p>
            <strong>5. Update weights</strong> - Take a step downhill
          </p>
          <p>
            <strong>6. Repeat</strong> - Until loss stops decreasing
          </p>
        </QuoteBox>
        <Prose>
          <p>
            This is the same predict-compare-update loop we saw in the brain,
            just made explicit and computable.
          </p>
          <p>
            But there&apos;s a problem. We want our network to process{' '}
            <em>language</em> so it can &quot;think&quot; about text. Our
            parabola example used simple numbers as input. Language is
            different: it&apos;s symbolic, discrete, and our perceptrons only
            understand continuous numerical values.
          </p>
          <p>
            How do we encode language so it can flow through this training loop
            with the network architecture we&apos;ve established?
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 5: TURNING LANGUAGE INTO NUMBERS ========== */}
      <ArticleSection>
        <TOCHeading id="language-to-numbers" level={2}>
          Turning Language into Numbers
        </TOCHeading>
        <Prose>
          <p>
            Our eyes turn photons into neural activation. Our ears turn pressure
            waves into neural activation. Our perceptron needs numbers.
          </p>
          <p>So how do we turn language into numbers?</p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="tokenization" level={3}>
          Tokenization
        </TOCHeading>
        <Prose>
          <p>
            First, we break text into pieces called <strong>tokens</strong>.
            These could be words, characters, or something in between.
          </p>
          <p>
            Modern systems use <strong>subword tokenization</strong>, a middle
            ground that handles common words as single tokens while breaking
            rare words into familiar pieces.
          </p>
          <p>Try it yourself:</p>
        </Prose>
        <TokenizationInteractive />
      </ArticleSection>

      <ArticleSection>
        <InsightBox title="Byte Pair Encoding (BPE)">
          <p>
            The most common tokenization algorithm is BPE. It starts with
            individual characters, then iteratively merges the most frequent
            pair into a new token. Repeat until you have the desired vocabulary
            size.
          </p>
          <p className="mt-2 text-xs">
            &quot;low&quot; + &quot;er&quot; → &quot;lower&quot; becomes a
            single token if it appears often enough.
          </p>
        </InsightBox>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="numericalization" level={3}>
          Numericalization
        </TOCHeading>
        <Prose>
          <p>
            Once we have tokens, we assign each one an ID: just an index in our
            vocabulary.
          </p>
          <p>Try converting tokens to numbers:</p>
        </Prose>
        <NumericalizationInteractive />
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Now we have numbers. But there&apos;s a problem: these IDs are
            arbitrary. &quot;cat&quot; being ID 1 and &quot;dog&quot; being ID 2
            doesn&apos;t tell the network that cats and dogs are similar (both
            animals) while &quot;happy&quot; is something different (an
            emotion).
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="embeddings" level={3}>
          Embeddings
        </TOCHeading>
        <Prose>
          <p>
            The solution: instead of feeding raw IDs, we look up each ID in a
            learned <strong>embedding matrix</strong>. Each row is a vector of
            continuous numbers representing that word.
          </p>
          <p>
            With just 2 dimensions, we can imagine what each dimension might
            encode:
          </p>
          <UnorderedList>
            <li>Dimension 0: &quot;How animal-like is this word?&quot;</li>
            <li>Dimension 1: &quot;How positive is this word?&quot;</li>
          </UnorderedList>
          <p id="embedding-demo">
            &quot;cat&quot; and &quot;dog&quot; cluster together (both animals).
            &quot;happy&quot; and &quot;sad&quot; are far apart on the sentiment
            axis:
          </p>
        </Prose>
        <EmbeddingInteractive />
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p>
            Real embeddings use hundreds of dimensions. The features become
            abstract and hard to name, but the principle remains: similar words
            end up near each other in this high-dimensional space.
          </p>
          <p>
            These embeddings are <em>learned</em> through the same gradient
            descent process we saw earlier. The network starts with random
            vectors and adjusts them during training, gradually discovering
            which words should cluster together.
          </p>
        </Prose>
        <InsightBox title="Learned, Not Programmed">
          <p>
            Nobody tells the network that &quot;cat&quot; and &quot;dog&quot;
            should be similar. It discovers this by seeing them used in similar
            contexts. Just like our brains learn features through experience
            rather than explicit programming, neural networks learn their own
            representations through training.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            The 2D features above (&quot;animal-ness&quot;,
            &quot;sentiment&quot;) are just for illustration. Real embeddings
            have hundreds of dimensions encoding features we can&apos;t easily
            name.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== BEFORE WE CAN TRAIN ========== */}
      <ArticleSection>
        <TOCHeading id="before-training" level={2}>
          Before We Can Train
        </TOCHeading>
        <Prose>
          <p>
            We have our network architecture, we know how to encode language,
            and we understand the training loop. Before we can actually train,
            there are a few more concepts we need to understand. This is where
            machine learning gets its jargon.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="data-preparation" level={3}>
          Data Preparation
        </TOCHeading>
        <Prose>
          <p id="batch-demo">
            In practice, we do not train on one example at a time. We use{' '}
            <strong>batches</strong>: groups of examples processed together.
          </p>
          <p>
            Why batch? Two reasons. First, efficiency. GPUs are designed for
            parallel computation. Processing 32 examples at once is barely
            slower than processing 1. Second, stability. Gradients computed from
            a single example can be noisy. Averaging over a batch gives a more
            reliable signal.
          </p>
          <p id="data-splits">We also split our data into three sets:</p>
          <UnorderedList>
            <li>
              <strong>Training set</strong>: What the network learns from.
              Gradients are computed on this data.
            </li>
            <li>
              <strong>Validation set</strong>: Used to tune hyperparameters and
              check for overfitting. The network never trains on this.
            </li>
            <li>
              <strong>Test set</strong>: The final exam. Touched only once, at
              the very end, to get an unbiased performance estimate.
            </li>
          </UnorderedList>
          <p>
            This separation prevents a subtle trap: if we tune our model to
            perform well on the same data we test on, we might just be
            memorizing rather than learning.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="loss-and-accuracy" level={3}>
          Loss vs Accuracy
        </TOCHeading>
        <Prose>
          <p>
            There are two ways to measure how well our network is doing, and
            they serve different purposes.
          </p>
          <p>
            <strong>Accuracy</strong> is what we actually care about: the
            percentage of examples classified correctly. If we predict
            &quot;positive&quot; for 85 out of 100 positive reviews, our
            accuracy is 85%.
          </p>
          <p>
            <strong>Loss</strong> is what we optimize. It&apos;s a
            differentiable proxy that tells us not just <em>whether</em> we were
            wrong, but
            <em> how confident</em> we were in our wrong answer.
          </p>
        </Prose>
        <InsightBox title="Why Not Just Optimize Accuracy?">
          <p>
            Accuracy is not differentiable. An example is either correct or
            incorrect, there&apos;s no gradient to follow. Loss provides a
            smooth landscape where gradient descent can work.
          </p>
        </InsightBox>
        <Prose>
          <p id="loss-vs-accuracy">
            During training, we track both metrics. Loss tells us how well the
            optimizer is working, while accuracy tells us how well the model is
            actually performing on the task we care about.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <TOCHeading id="epochs" level={3}>
          Training Over Time
        </TOCHeading>
        <Prose>
          <p>
            One pass through the entire training set is called an{' '}
            <strong>epoch</strong>. Training typically involves many epochs.
            Early on, loss drops rapidly as the network learns the basic
            patterns. Later, improvements become smaller.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== TRANSITION TO TRAINING TAB ========== */}
      <ArticleSection>
        <InsightBox title="The Foundation Is Set">
          <p>
            We now have all the pieces: networks that can learn, language
            converted to numbers, and a training process to tie it all together.
            The core loop is simple: predict, compare, update, repeat.
          </p>
          <p className="mt-2">
            In the next section, we&apos;ll put these pieces together and watch
            a neural network learn. You&apos;ll train a sentiment classifier
            yourself and see exactly how data, compute, and scale determine what
            these systems can do.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-10 flex justify-center">
        <TabSwitchButton targetTab="training" label="Continue to Training" />
      </div>
    </>
  );
}

function TrainingContent() {
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

function ArchitecturesContent() {
  return (
    <>
      {/* ========== SECTION 1: THE SEQUENCE PROBLEM ========== */}
      <ArticleSection>
        <TOCHeading id="the-sequence-problem" level={2}>
          The Sequence Problem
        </TOCHeading>
        <Prose>
          <p id="sequence-intro">
            The networks we&apos;ve built so far have a fundamental limitation:
            they process inputs as isolated snapshots. Feed in &quot;The cat sat
            on the mat&quot; and each word is processed independently, with no
            notion that &quot;cat&quot; comes before &quot;sat&quot;.
          </p>
          <p>
            But language is inherently sequential. The meaning of &quot;bank&quot;
            depends on whether we&apos;re talking about rivers or money. The word
            &quot;it&quot; refers back to something mentioned earlier. To truly
            understand language, we need networks that remember.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Aside title="Michael Jordan (1986)">
          <p>
            The idea of recurrence in neural networks dates back to Michael
            Jordan&apos;s &quot;Serial Order: A Parallel Distributed Processing
            Approach&quot; which introduced networks that could process sequences
            by feeding outputs back as inputs.
          </p>
        </Aside>
        <Prose>
          <p>
            Think about how you read this sentence. You don&apos;t process each
            word in isolation. You carry forward context: who the subject is,
            what action is happening, what might come next. Your brain maintains
            a running &quot;state&quot; that updates with each word.
          </p>
          <p>
            Can we give neural networks the same ability?
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 2: SIMPLE RECURRENCE ========== */}
      <ArticleSection>
        <TOCHeading id="simple-recurrence" level={2}>
          Simple Recurrence
        </TOCHeading>
        <Prose>
          <p id="simplest-rnn">
            The simplest solution is beautifully elegant: give the network a
            &quot;hidden state&quot; that persists across time steps. At each step,
            the network takes two inputs: the current word AND its previous hidden
            state.
          </p>
        </Prose>
        <FormulaBox label="The RNN Equation">
          {'h_t = \\tanh(W_{xh} \\cdot x_t + W_{hh} \\cdot h_{t-1} + b)'}
        </FormulaBox>
        <Prose>
          <p>
            That&apos;s it. The hidden state <Math>{'h_t'}</Math> is computed from
            the current input <Math>{'x_t'}</Math> plus the previous hidden state{' '}
            <Math>{'h_{t-1}'}</Math>. The tanh squashes everything to [-1, 1] to
            keep values bounded.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Aside title="Jeffrey Elman (1990)">
          <p>
            Jeffrey Elman&apos;s paper &quot;Finding Structure in Time&quot;
            introduced the simple recurrent network (now called the Elman
            network) and showed it could learn grammatical structure from raw
            text. This was foundational work for modern NLP.
          </p>
        </Aside>
        <Prose>
          <p id="weight-sharing">
            The crucial insight is <strong>weight sharing</strong>. The same
            weight matrices <Math>{'W_{xh}'}</Math> and <Math>{'W_{hh}'}</Math>{' '}
            are used at every time step. The network learns one set of weights
            that works for all positions in the sequence.
          </p>
          <p>
            This is powerful: whether we&apos;re at position 1 or position 1000,
            we use the same transformation. The network learns a general
            &quot;how to update my state given new input&quot; rule rather than
            position-specific rules.
          </p>
        </Prose>
        <InsightBox title="Why Weight Sharing Matters">
          <p className="mb-2">
            Weight sharing gives RNNs two superpowers:
          </p>
          <UnorderedList>
            <li>
              <strong>Efficiency:</strong> The number of parameters doesn&apos;t
              grow with sequence length
            </li>
            <li>
              <strong>Generalization:</strong> Patterns learned at one position
              transfer to all positions
            </li>
          </UnorderedList>
        </InsightBox>
        <Prose>
          <p>
            Try it yourself. The interactive below lets you step through how an
            RNN processes a sequence character by character, updating its hidden
            state at each step.
          </p>
        </Prose>
        <div className="my-8 p-6 bg-neutral-50 rounded-lg">
          <SimpleRNNInteractive />
        </div>
      </ArticleSection>

      {/* ========== SECTION 3: PREDICTIONS AT EVERY STEP ========== */}
      <ArticleSection>
        <TOCHeading id="predictions-every-step" level={2}>
          Predictions at Every Step
        </TOCHeading>
        <Prose>
          <p id="language-modeling">
            Here&apos;s a clever trick: instead of waiting until the end of a
            sequence to make a prediction, we can predict at every time step.
            Given &quot;The cat sat&quot;, predict the next word after
            &quot;The&quot;, then after &quot;The cat&quot;, then after
            &quot;The cat sat&quot;.
          </p>
          <p id="more-signal-per-batch">
            This is called <strong>language modeling</strong>, and it&apos;s
            incredibly data-efficient. From one sentence of N words, we get N-1
            training examples. The network learns to predict what comes next at
            every position.
          </p>
        </Prose>
        <InsightBox title="Self-Supervised Learning">
          <p>
            Language modeling is &quot;self-supervised&quot; because the labels
            come from the data itself. No human annotation needed. Just take any
            text and use word t+1 as the label for position t. This is how
            models like GPT are trained on trillions of tokens.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 4: UNROLLING THE NETWORK ========== */}
      <ArticleSection>
        <TOCHeading id="unrolling" level={2}>
          Unrolling the Network
        </TOCHeading>
        <Prose>
          <p id="unrolled-view">
            To understand how RNNs really work, it helps to &quot;unroll&quot;
            them across time. The compact diagram with a self-loop becomes a
            chain of identical cells, one for each time step.
          </p>
          <p id="sequence-length-flexibility">
            When unrolled, we see that an RNN is really a very deep feedforward
            network where the depth equals the sequence length. Process 100
            tokens? That&apos;s 100 layers deep. The same weights are used at
            each layer.
          </p>
        </Prose>
        <InsightBox title="Depth Without Parameters">
          <p>
            An unrolled RNN processing 1000 tokens is 1000 layers deep, but only
            has as many parameters as a single layer. This is both a strength
            (efficiency) and a weakness (we&apos;ll see why soon).
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 5: BACKPROPAGATION THROUGH TIME ========== */}
      <ArticleSection>
        <TOCHeading id="bptt" level={2}>
          Backpropagation Through Time
        </TOCHeading>
        <Aside title="Ilya Sutskever (2011)">
          <p>
            &quot;Generating Text with Recurrent Neural Networks&quot; by Ilya
            Sutskever and Geoffrey Hinton showed that RNNs could generate
            surprisingly coherent text character by character. This work
            foreshadowed the text generation capabilities we see in modern LLMs.
          </p>
        </Aside>
        <Prose>
          <p id="full-bptt">
            How do we train an unrolled network? The same way we train any
            network: backpropagation. But now gradients must flow backward
            through time. At each timestep, we compute a loss, and gradients
            propagate all the way back to the first hidden state.
          </p>
        </Prose>
        <FormulaBox label="BPTT Gradient">
          {
            '\\frac{\\partial L}{\\partial W} = \\sum_{t=1}^{T} \\frac{\\partial L_t}{\\partial W} = \\sum_{t} \\frac{\\partial L_t}{\\partial h_t} \\prod_{k=1}^{t} \\frac{\\partial h_k}{\\partial h_{k-1}}'
          }
        </FormulaBox>
        <Prose>
          <p>
            This is called <strong>Backpropagation Through Time</strong> (BPTT).
            The key insight is that product of partial derivatives. Each step
            back multiplies another term.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="tbptt">
            Full BPTT is memory-intensive: we must store all hidden states to
            compute gradients. For long sequences, this becomes prohibitive.
          </p>
          <p>
            The practical solution is <strong>Truncated BPTT</strong>: instead
            of backpropagating through the entire sequence, we only go back k
            steps. This trades some long-range gradient flow for tractable
            memory usage.
          </p>
        </Prose>
        <InsightBox title="Prof. Tom Yeh's Spreadsheet">
          <p className="mb-2">
            If you want to visualize and go step by step, a spreadsheet is a
            great way to learn BPTT. Check out{' '}
            <a
              href="https://x.com/ProfTomYeh/status/1990110954043113760"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Prof. Tom Yeh&apos;s visualization
            </a>{' '}
            for an interactive walkthrough.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 6: RNN PROBLEMS ========== */}
      <ArticleSection>
        <TOCHeading id="rnn-problems" level={2}>
          The Problem with RNNs
        </TOCHeading>
        <Prose>
          <p id="vanishing-gradients">
            Here&apos;s where that product of partial derivatives becomes a
            problem. Each <Math>{'\\partial h_k / \\partial h_{k-1}'}</Math> is
            typically less than 1. Multiply many numbers less than 1 together
            and you get... something very close to zero.
          </p>
          <p>
            This is the <strong>vanishing gradient problem</strong>. By the time
            gradients reach the early timesteps, they&apos;ve shrunk to nearly
            nothing. The network can&apos;t learn long-range dependencies
            because the gradient signal disappears.
          </p>
        </Prose>
        <FormulaBox label="Exponential Decay">
          {'\\prod_{k=1}^{100} 0.9 = 0.9^{100} \\approx 0.00003'}
        </FormulaBox>
      </ArticleSection>

      <ArticleSection>
        <Aside title="Sentiment Neuron (2017)">
          <p>
            OpenAI&apos;s &quot;Learning to Generate Reviews and Discovering
            Sentiment&quot; found that training an LSTM on Amazon reviews
            produced a single neuron that tracked sentiment. This emergent
            feature showed that even simple architectures could learn
            surprisingly rich representations.
          </p>
        </Aside>
        <Prose>
          <p id="exploding-gradients">
            The opposite problem also exists: <strong>exploding gradients</strong>.
            If the partial derivatives are greater than 1, the product grows
            exponentially. Gradients become enormous, weights update wildly, and
            training crashes with NaN values.
          </p>
          <p>
            The solution to exploding gradients is simple:{' '}
            <strong>gradient clipping</strong>. If the gradient norm exceeds a
            threshold, we scale it down. This prevents catastrophic updates
            while preserving gradient direction.
          </p>
        </Prose>
        <InsightBox title="Gradient Clipping">
          <p>
            <code className="bg-neutral-100 px-1 rounded">
              if ||g|| &gt; max_norm: g = g × (max_norm / ||g||)
            </code>
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            This is standard practice in RNN training. PyTorch provides{' '}
            <code className="bg-neutral-100 px-0.5 rounded">
              torch.nn.utils.clip_grad_norm_()
            </code>
          </p>
        </InsightBox>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="long-term-context-demo">
            What does this mean in practice? Imagine processing a long document.
            Information from the first paragraph must travel through hundreds of
            timesteps to influence predictions near the end. With vanishing
            gradients, this information fades away.
          </p>
        </Prose>
        <div className="my-8 p-6 bg-neutral-50 rounded-lg">
          <GradientFlowInteractive />
        </div>
        <Prose>
          <p>
            The interactive above shows how information degrades in an RNN vs
            LSTM as sequence length increases. Slide the sequence length to see
            how quickly RNNs lose context.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 7: REGULARIZATION REVISITED ========== */}
      <ArticleSection>
        <TOCHeading id="regularization-rnn" level={2}>
          Regularization Revisited
        </TOCHeading>
        <Prose>
          <p id="weight-decay-rnn">
            Remember weight decay and dropout from the Training tab? They apply
            here too. Weight decay prevents weights from growing too large,
            which helps with both exploding gradients and overfitting.
          </p>
          <p id="dropout-rnn">
            But standard dropout has a problem in RNNs: applying different
            dropout masks at each timestep destroys the temporal structure.
            The hidden state becomes noisy garbage.
          </p>
        </Prose>
        <InsightBox title="Variational Dropout">
          <p className="mb-2">
            The solution is <strong>variational dropout</strong>: use the{' '}
            <em>same</em> dropout mask across all timesteps. This preserves
            temporal coherence while still regularizing.
          </p>
          <p className="text-sm text-neutral-600">
            We drop the same neurons at t=1, t=2, t=3... rather than randomly
            choosing different neurons each time.
          </p>
        </InsightBox>
        <Prose>
          <p>
            These techniques help, but they don&apos;t solve the fundamental
            problem: vanishing gradients still prevent learning long-range
            dependencies. We need a better architecture.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 8: BUILDING THE LSTM ========== */}
      <ArticleSection>
        <TOCHeading id="building-lstm" level={2}>
          Building the LSTM
        </TOCHeading>
        <Aside title="LSTM Paper (1997)">
          <p>
            Hochreiter and Schmidhuber introduced the LSTM in &quot;Long
            Short-Term Memory.&quot; The key insight was adding a{' '}
            <em>cell state</em> that allows information to flow unchanged across
            many timesteps, solving the vanishing gradient problem.
          </p>
        </Aside>
        <Prose>
          <p id="the-cell-state">
            The LSTM&apos;s key innovation is the <strong>cell state</strong>: a
            separate pathway that runs through the entire sequence. Think of it
            as a conveyor belt. Information can flow along it unchanged, or be
            modified at specific points.
          </p>
          <p>
            This solves vanishing gradients because gradients can flow directly
            through the cell state without being repeatedly multiplied by small
            numbers.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="forget-gate">
            But we need control. The <strong>forget gate</strong> decides what
            information to throw away. It looks at the previous hidden state and
            current input, then outputs a number between 0 and 1 for each
            position in the cell state. 0 means &quot;forget this completely,&quot;
            1 means &quot;keep this entirely.&quot;
          </p>
        </Prose>
        <FormulaBox label="Forget Gate">
          {'f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)'}
        </FormulaBox>
      </ArticleSection>

      <ArticleSection>
        <Aside title="Seq2Seq (2014)">
          <p>
            Sutskever, Vinyals, and Le&apos;s &quot;Sequence to Sequence Learning
            with Neural Networks&quot; showed that encoder-decoder LSTMs could
            translate entire sentences. This architecture became the foundation
            for neural machine translation.
          </p>
        </Aside>
        <Prose>
          <p id="input-gate">
            The <strong>input gate</strong> decides what new information to add.
            It has two parts: a sigmoid that decides which values to update, and
            a tanh that creates candidate values. The two are multiplied
            together.
          </p>
        </Prose>
        <FormulaBox label="Input Gate">
          {'i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)'}
        </FormulaBox>
        <FormulaBox label="Candidate Values">
          {'\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)'}
        </FormulaBox>
        <Prose>
          <p>
            The cell state is then updated: forget some old information, add
            some new information.
          </p>
        </Prose>
        <FormulaBox label="Cell State Update">
          {'C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t'}
        </FormulaBox>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="output-gate">
            Finally, the <strong>output gate</strong> decides what to output
            based on the cell state. It filters the cell state through a tanh
            (to bound values to [-1, 1]) and multiplies by a sigmoid to control
            what gets exposed.
          </p>
        </Prose>
        <FormulaBox label="Output Gate">
          {'o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)'}
        </FormulaBox>
        <FormulaBox label="Hidden State">
          {'h_t = o_t \\odot \\tanh(C_t)'}
        </FormulaBox>
        <Prose>
          <p id="lstm-complete">
            And that&apos;s the complete LSTM! Three gates (forget, input,
            output) controlling the flow of information through a cell state
            that acts as long-term memory.
          </p>
        </Prose>
        <InsightBox title="Why This Works">
          <p>
            The cell state <Math>{'C_t'}</Math> can remain almost unchanged for
            many timesteps if the forget gate stays near 1 and the input gate
            stays near 0. Gradients flow through this pathway without vanishing.
          </p>
        </InsightBox>
        <Prose>
          <p>
            Experiment with the LSTM below. Toggle each gate on and off to see
            how they affect the cell state and output. Notice how the forget
            gate controls memory retention and the input gate controls new
            information.
          </p>
        </Prose>
        <div className="my-8 p-6 bg-neutral-50 rounded-lg">
          <LSTMBuildupInteractive />
        </div>
      </ArticleSection>

      {/* ========== SECTION 9: ACTIVATION FUNCTIONS ========== */}
      <ArticleSection>
        <TOCHeading id="activation-functions" level={2}>
          A Note on Activation Functions
        </TOCHeading>
        <Prose>
          <p>
            You might wonder why LSTMs use different activation functions in
            different places. It&apos;s not arbitrary.
          </p>
          <p>
            <strong>Sigmoid</strong> outputs values in [0, 1]. This is perfect
            for gates: 0 means &quot;block everything,&quot; 1 means &quot;let
            everything through.&quot; It acts as a soft switch.
          </p>
          <p>
            <strong>Tanh</strong> outputs values in [-1, 1]. This is used for
            the candidate values and output because cell states can be positive
            or negative. It&apos;s also zero-centered, which helps with
            optimization.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 10: LSTM OPTIMIZATIONS ========== */}
      <ArticleSection>
        <TOCHeading id="lstm-optimizations" level={2}>
          Making LSTMs Better
        </TOCHeading>
        <Aside title="ULMFiT (2018)">
          <p>
            Howard and Ruder&apos;s &quot;Universal Language Model Fine-tuning
            for Text Classification&quot; showed that pretraining an LSTM on
            large text corpora and then fine-tuning on specific tasks worked
            remarkably well. This &quot;pretrain then fine-tune&quot; paradigm
            became central to modern NLP.
          </p>
        </Aside>
        <Prose>
          <p id="he-initialization">
            Several techniques make LSTMs train better. <strong>He
            initialization</strong> sets initial weights so activations don&apos;t
            explode or vanish in early training.
          </p>
          <p id="temporal-activation-regularization">
            <strong>Temporal Activation Regularization (TAR)</strong> penalizes
            large changes in hidden states between timesteps. This encourages
            smooth, stable dynamics.
          </p>
          <p id="awd-lstm">
            The <strong>AWD-LSTM</strong> combines many tricks: weight dropout
            (dropping weights rather than activations), embedding dropout,
            weight tying (sharing embedding and output weights), and more.
          </p>
        </Prose>
        <InsightBox title="Try It Yourself">
          <p>
            Hugging Face provides pretrained AWD-LSTM models. Check out{' '}
            <code className="bg-neutral-100 px-1 rounded">
              salesforce/awd-lstm-lm
            </code>{' '}
            for a state-of-the-art language model you can experiment with.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 11: PROBLEMS REMAINING ========== */}
      <ArticleSection>
        <TOCHeading id="problems-remaining" level={2}>
          What&apos;s Still Missing
        </TOCHeading>
        <Aside title="Augmented RNNs">
          <p>
            For visualizations of attention mechanisms and other RNN
            enhancements, see{' '}
            <a
              href="https://distill.pub/2016/augmented-rnns/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Distill&apos;s &quot;Attention and Augmented Recurrent Neural
              Networks&quot;
            </a>
          </p>
        </Aside>
        <Prose>
          <p id="sequential-processing">
            LSTMs solved vanishing gradients, but they still have fundamental
            limitations. <strong>Sequential processing</strong> means we
            can&apos;t parallelize across timesteps. Processing a 1000-token
            sequence requires 1000 sequential steps.
          </p>
          <p id="fixed-context-window">
            And while cell states help with long-range dependencies, there&apos;s
            still a practical limit. Very long documents remain challenging
            because information must flow through many gates.
          </p>
        </Prose>
      </ArticleSection>

      {/* ========== SECTION 12: TEASER ========== */}
      <ArticleSection>
        <TOCHeading id="whats-next" level={2}>
          What Comes Next
        </TOCHeading>
        <Prose>
          <p>
            We&apos;ve built RNNs from first principles, understood why they
            struggle, and engineered LSTMs to fix the most critical problems.
            These architectures dominated NLP for years. They powered sentiment
            analysis, machine translation, speech recognition.
          </p>
          <p>
            But they have fundamental limitations. Processing must be
            sequential. Context windows are still limited. Very long documents
            remain challenging.
          </p>
        </Prose>
        <QuoteBox>
          <p className="italic">
            &quot;The next paradigm didn&apos;t come breaking down the door. It
            came as a seemingly boring paper from a small team, with a
            deliberately understated title:{' '}
            <strong>&apos;Attention Is All You Need.&apos;</strong>&quot;
          </p>
        </QuoteBox>
        <Prose>
          <p>
            That paper would obsolete everything we just learned. Not because
            RNNs were wrong, but because attention found a better way.
          </p>
        </Prose>
        <MutedText>
          For a comprehensive history of deep learning, see{' '}
          <a
            href="https://people.idsia.ch/~juergen/deep-learning-history.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            J&uuml;rgen Schmidhuber&apos;s timeline
          </a>
          .
        </MutedText>
      </ArticleSection>

      {/* Tab switch button */}
      <div className="mt-16 flex justify-center">
        <TabSwitchButton targetTab="training" label="Back to Training" />
      </div>
    </>
  );
}
