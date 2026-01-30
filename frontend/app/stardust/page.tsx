'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { AnimationSequence } from '@/components/animation/AnimationSequence';
import { ParticlesAnimation } from '@/components/stardust/ParticlesAnimation';
import { WorldModelAnimation } from '@/components/stardust/WorldModelAnimation';
import { ParabolaAnimation } from '@/components/stardust/ParabolaAnimation';
import { PerceptronAnimation } from '@/components/stardust/PerceptronAnimation';
import { TokenizationAnimation } from '@/components/stardust/TokenizationAnimation';
import { TrainingLoopAnimation } from '@/components/stardust/TrainingLoopAnimation';
import { UseNotebook } from '@/contexts/NotebookContext';
import { TOCProvider } from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import {
  TabsProvider,
  TabButtons,
  TabContent,
} from '@/components/navigation/Tabs';

import { ShapeRecognitionAnimation } from '@/components/stardust/ShapeRecognitionAnimation';
import { EmbeddingAnimation } from '@/components/stardust/EmbeddingAnimation';
import { CrossEntropyAnimation } from '@/components/stardust/CrossEntropyAnimation';
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
import { StardustToSiliconAnimation } from '@/components/stardust/StardustToSiliconAnimation';
import { SequentialBottleneckAnimation } from '@/components/stardust/SequentialBottleneckAnimation';

import { FoundationsContent } from './FoundationsContent';
import { TrainingContent } from './TrainingContent';
import { ArchitecturesContent } from './ArchitecturesContent';

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
        {/* Foundations and Training use networks.ipynb */}
        <TabContent tabId="foundations">
          <UseNotebook
            path="projects/rnn/networks.ipynb"
            githubUrl={NOTEBOOK_GITHUB_URL}
          />
        </TabContent>
        <TabContent tabId="training">
          <UseNotebook
            path="projects/rnn/networks.ipynb"
            githubUrl={NOTEBOOK_GITHUB_URL}
          />
        </TabContent>
        {/* Architectures uses rnn.ipynb - defined in ArchitecturesContent */}

        <StickyHeader
          title="How did we make stardust think?"
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
                      // Simple recurrence - extend through predictions section
                      {
                        render: (p) => <SimpleRecurrenceAnimation progress={p} />,
                        startElementId: 'sequence-intro',
                        milestones: [
                          { elementId: 'simple-recurrence', progress: 0.15 },
                          { elementId: 'simple-rnn-cell', progress: 0.3 },
                          { elementId: 'weight-sharing', progress: 0.5 },
                          { elementId: 'predictions-every-step', progress: 0.7 },
                          { elementId: 'output-projection', progress: 0.85 },
                        ],
                        overlap: 0.1,
                      },
                      // Unrolled view - extend through section
                      {
                        render: (p) => <UnrolledRNNAnimation progress={p} />,
                        startElementId: 'unrolling',
                        milestones: [
                          { elementId: 'unroll-viz', progress: 0.5 },
                        ],
                        overlap: 0.1,
                      },
                      // BPTT - fixed IDs, extend coverage
                      {
                        render: (p) => <BPTTAnimation progress={p} />,
                        startElementId: 'bptt',
                        milestones: [
                          { elementId: 'bptt-impl', progress: 0.4 },
                          { elementId: 'tbptt', progress: 0.75 },
                        ],
                        overlap: 0.1,
                      },
                      // Vanishing gradients - fixed IDs
                      {
                        render: (p) => <VanishingGradientAnimation progress={p} />,
                        startElementId: 'rnn-problems',
                        milestones: [
                          { elementId: 'vanishing-demo', progress: 0.25 },
                          { elementId: 'exponential-decay', progress: 0.5 },
                          { elementId: 'exploding-gradients', progress: 0.75 },
                        ],
                        overlap: 0.1,
                      },
                      // Context loss demo - add milestones, extend to patches section
                      {
                        render: (p) => <ContextLossAnimation progress={p} />,
                        startElementId: 'long-term-context-demo',
                        milestones: [
                          { elementId: 'compare-gradient-flow', progress: 0.4 },
                          { elementId: 'patches-not-solutions', progress: 0.7 },
                          { elementId: 'dropout-rnn', progress: 0.9 },
                        ],
                        overlap: 0.1,
                      },
                      // LSTM build-up - fixed IDs
                      {
                        render: (p) => <LSTMProgressiveAnimation progress={p} />,
                        startElementId: 'building-lstm',
                        milestones: [
                          { elementId: 'lstm-impl', progress: 0.15 },
                          { elementId: 'forget-gate', progress: 0.3 },
                          { elementId: 'input-gate', progress: 0.45 },
                          { elementId: 'output-gate', progress: 0.6 },
                          { elementId: 'visualize-gates', progress: 0.8 },
                        ],
                        overlap: 0.1,
                      },
                      // Activation functions - extend through optimizations
                      {
                        render: (p) => <ActivationFunctionsAnimation progress={p} />,
                        startElementId: 'activation-functions',
                        milestones: [
                          { elementId: 'activation-comparison', progress: 0.25 },
                          { elementId: 'lstm-optimizations', progress: 0.5 },
                          { elementId: 'char-lm', progress: 0.75 },
                          { elementId: 'bidirectional-rnns', progress: 0.9 },
                        ],
                        overlap: 0.1,
                      },
                      // Sequential bottleneck - transformer teaser, extend coverage
                      {
                        render: (p) => <SequentialBottleneckAnimation progress={p} />,
                        startElementId: 'problems-remaining',
                        milestones: [
                          { elementId: 'sequential-processing', progress: 0.25 },
                          { elementId: 'fixed-context-window', progress: 0.5 },
                          { elementId: 'whats-next', progress: 0.75 },
                        ],
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
              How did we make stardust think?
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              From carbon atoms forged in dying stars to neurons firing in your
              skull to silicon learning to see. The improbable chain that led to
              artificial intelligence. A first principles and historical journey
              through neural foundations, backpropagation, and recurrence.
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
