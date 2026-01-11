'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import {
  TOCProvider,
  TOCHeading,
} from '@/components/navigation/TableOfContents';
import { StickyHeader } from '@/components/navigation/StickyHeader';
import {
  Prose,
  InsightBox,
  QuoteBox,
  OrderedList,
  UnorderedList,
  MutedText,
  ComparisonTable,
} from '@/components/article/Callouts';

export default function ResearchTastesArticle() {
  return (
    <TOCProvider>
      <StickyHeader title="5 Research Tastes" />

      <div className="pt-14">
        <ArticleLayout className="bg-white">
          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4 text-black leading-tight">
            5 Research Tastes for the Last Days of the Anthropocene
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            If AGI arrives in 2-3 years, what should you work on today? These
            are the 5 bottlenecks I believe matter most for recursive
            improvement, and the experiments that could move them forward.
          </p>

          {/* Attribution */}
          <MutedText>
            Inspired by{' '}
            <a
              href="https://x.com/jaschasd/status/1972360405885637021"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jascha Sohl-Dickstein&apos;s talk
            </a>{' '}
            on advice for young investigators in the first and last days of the
            Anthropocene.
          </MutedText>

          {/* Section 1: The Framing */}
          <TOCHeading id="the-framing" level={2} className="mt-8">
            The Framing
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Within just a few years, it is likely that we will create AI
                systems that outperform the best humans on all intellectual
                tasks. If you take this seriously, it should change how you
                think about research.
              </p>
              <p>
                The central insight from Jascha&apos;s talk is this: we are
                still early in the AI exponential. Compute has the potential to
                be 10,000x larger in 5 years. Looking back, our state today will
                be visually indistinguishable from zero on a linear-axis compute
                plot.{' '}
                <strong>
                  Small interventions early in exponential growth have huge
                  consequences.
                </strong>
              </p>
              <p>
                This means the leverage on your work is enormous. You should be
                intentional and thoughtful about the projects and jobs you
                choose. The question isn&apos;t just &quot;what is
                interesting?&quot; but &quot;what will still matter after AGI,
                and what can I uniquely contribute now?&quot;
              </p>
            </Prose>

            <InsightBox title="The Bitter Lesson, Inverted">
              <p>
                Richard Sutton&apos;s{' '}
                <a
                  href="http://www.incompleteideas.net/IncIdeas/BitterLesson.html"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bitter Lesson
                </a>{' '}
                observes that general methods leveraging computation ultimately
                win. The positive takeaway: if you work on projects that become
                more effective as compute and intelligence scale, your results
                will be higher impact than you anticipate. The negative: you
                really, really don&apos;t want to work on projects that will be
                solved anyway with scale.
              </p>
            </InsightBox>

            <Prose>
              <p>
                I&apos;ve been thinking about what research directions matter
                most for the next 2-3 years. My mandate is expanding the
                epistemic frontier to increase humanity&apos;s slope toward
                longtermism. This means focusing on problems that shift the
                trajectory post-AGI, not just induce transient near-term
                changes.
              </p>
              <p>
                I&apos;ve landed on 5 bottlenecks that I believe are the most
                important to solve. They&apos;re deeply interconnected.
                Verifiability gates what you can train on. OOD generation
                determines whether AI can discover genuinely new knowledge.
                Interpretability reveals what&apos;s working and what&apos;s
                broken. Architectures determine what&apos;s even possible.
                Continual learning asks whether we need persistent agents at
                all.
              </p>
              <p>
                These aren&apos;t the only important problems, but they&apos;re
                the ones where I see the most leverage and the clearest path to
                experiments that could matter.
              </p>
            </Prose>
          </ArticleSection>

          {/* Section 2: The 5 Bottlenecks Overview */}
          <TOCHeading id="five-bottlenecks" level={2}>
            The 5 Bottlenecks
          </TOCHeading>
          <ArticleSection>
            <ComparisonTable
              headers={['Bottleneck', 'Core Question']}
              rows={[
                [
                  'Verifiability',
                  'How do we know when AI outputs are correct?',
                ],
                [
                  'OOD Generation',
                  'Can models generate genuinely novel knowledge?',
                ],
                [
                  'Interpretability',
                  'Can we understand what models are computing?',
                ],
                [
                  'Alternate Architectures',
                  'What inductive biases are we missing?',
                ],
                [
                  'Continual Learning',
                  'Do we even need persistent agents?',
                ],
              ]}
            />

            <Prose>
              <p>
                For each bottleneck, I&apos;ll cover: why it matters for
                recursive improvement, the current frontier problems, SOTA
                directions with prior work, and falsifiable experiments that
                could move things forward.
              </p>
            </Prose>
          </ArticleSection>

          {/* Bottleneck 1: Verifiability */}
          <TOCHeading id="verifiability" level={2}>
            1. Verifiability
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Why it matters:</strong> &quot;You can only RL on what
                you can verify.&quot; But this extends far beyond training.
                Verifiability is the fundamental bottleneck for recursive
                improvement and agentic systems generally. When an agent is
                recursively improving or generating knowledge, how quickly can
                we verify the output is correct? The speed and reliability of
                verification determines the speed of the improvement loop.
              </p>
            </Prose>

            <InsightBox title="The Verifier&apos;s Rule">
              <p>
                Jason Wei articulated this principle in his{' '}
                <a
                  href="https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blog post on verification asymmetry
                </a>
                : &quot;The ease of training AI to solve a task is proportional
                to how verifiable the task is.&quot; This explains why AI
                progress has been rapid in some domains while stagnating in
                others.
              </p>
            </InsightBox>

            <TOCHeading id="verify-spectrum" level={3}>
              The Verifiability Spectrum
            </TOCHeading>

            <ComparisonTable
              headers={['Domain', 'Verifiability', 'Key Property']}
              rows={[
                [
                  'Code Runtime',
                  'Highest',
                  'Deterministic execution; binary pass/fail',
                ],
                [
                  'Mathematics',
                  'Very High',
                  'Formal proofs are machine-checkable',
                ],
                ['Games', 'High', 'Rules define win/loss conditions exactly'],
                [
                  'Scientific Claims',
                  'Medium-Low',
                  'Requires experiments; long feedback loops; noisy',
                ],
                [
                  'Creative/Subjective',
                  'Lowest',
                  'No objective ground truth; requires human judgment',
                ],
              ]}
            />

            <Prose>
              <p>
                <a
                  href="https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AlphaEvolve
                </a>{' '}
                (DeepMind, 2025) is the clearest example of maximally verifiable
                work. It discovers algorithms for optimization problems where
                verification is just running the code and measuring
                performance. This tight verification loop enabled it to discover
                algorithms now deployed in Google data centers.
              </p>
              <p>
                But even within science, there&apos;s a spectrum. Some things
                are more verifiable than others. In materials science,{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Density_functional_theory"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Density Functional Theory (DFT)
                </a>{' '}
                is ~95% accurate for many properties but has known failure modes
                for strongly correlated systems and van der Waals interactions.
                This makes it useful but not perfectly verifiable. The frontier
                of verifiability in science tends to be highly domain-specific,
                limited by physical world constraints.
              </p>
            </Prose>

            <TOCHeading id="verify-frontier" level={3}>
              Current Frontier Problems
            </TOCHeading>

            <UnorderedList>
              <li>
                <strong>The Human Annotation Bottleneck:</strong>{' '}
                OpenAI&apos;s{' '}
                <a
                  href="https://arxiv.org/abs/2305.20050"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PRM800K
                </a>{' '}
                required 800,000 step-level human feedback annotations to train
                process reward models. This doesn&apos;t scale.
              </li>
              <li>
                <strong>Verification Latency:</strong> Scientific hypotheses can
                take months/years to verify experimentally. How do you RL on
                rewards that take 6 months to compute?
              </li>
              <li>
                <strong>Soft Verification:</strong> Most real-world tasks
                (writing, strategy, design) lack clean verification signals.
                Constitutional AI uses AI feedback as a proxy, but introduces
                new failure modes.
              </li>
            </UnorderedList>

            <TOCHeading id="verify-more-verifiable" level={3}>
              Making Things More Verifiable
            </TOCHeading>

            <Prose>
              <p>
                There are systematic ways to increase verifiability in different
                domains:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Hardware to Software:</strong> Turn physical experiments
                into simulations. Molecular dynamics simulations let you test
                hypotheses in hours instead of months in a wet lab. The
                sim-to-real gap is a known issue, but it&apos;s often good
                enough to filter out bad ideas.
              </li>
              <li>
                <strong>Continuous to Discrete:</strong> Turn fuzzy evaluations
                into binary pass/fail. Instead of &quot;how good is this
                code?&quot; ask &quot;does it pass these specific tests?&quot;
              </li>
              <li>
                <strong>Outcome to Process:</strong> Verify intermediate steps,
                not just final answers. Process reward models verify reasoning
                chains, catching errors earlier.
              </li>
              <li>
                <strong>Expert to Automated:</strong> Formalize expert judgment
                into executable rules. Lean theorem proving turns mathematical
                intuition into machine-checkable proofs.
              </li>
              <li>
                <strong>Slow to Fast Proxies:</strong> Find quick-to-compute
                properties that correlate with slow-to-verify outcomes. In drug
                discovery, binding affinity predictions take seconds; clinical
                trials take years.
              </li>
            </UnorderedList>

            <TOCHeading id="verify-sota" level={3}>
              SOTA Directions
            </TOCHeading>

            <Prose>
              <p>
                <strong>RLVR (Reinforcement Learning from Verifiable Rewards):</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2501.12948"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DeepSeek-R1
                </a>{' '}
                demonstrated that reasoning abilities can be incentivized
                through pure RL, &quot;obviating the need for human-labeled
                reasoning trajectories.&quot; Self-verification and reflection
                emerge naturally through RL on verifiable tasks.
              </p>
              <p>
                <strong>Prior work:</strong>{' '}
                <a
                  href="https://allenai.org/blog/tulu-3-technical"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tulu 3
                </a>{' '}
                (Allen AI, 2024) was the first major open release to formally
                name RLVR as a distinct methodology.{' '}
                <a
                  href="https://arxiv.org/abs/2402.03300"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DeepSeekMath
                </a>{' '}
                introduced GRPO optimization achieving 51.7% on MATH benchmark.
              </p>
              <p>
                <strong>Formal Verification:</strong>{' '}
                <a
                  href="https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AlphaProof
                </a>{' '}
                (DeepMind, 2024) combines Gemini with AlphaZero RL, translating
                natural language math to Lean formal proofs. &quot;Each proof
                found and verified is used to reinforce the language
                model.&quot; Achieved silver medal at IMO 2024.
              </p>
              <p>
                <strong>Prior work:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2210.12283"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Draft, Sketch, and Prove
                </a>{' '}
                (2022) pioneered LLMs producing informal proofs mapped to Lean
                sketches.{' '}
                <a
                  href="https://leanprover-community.github.io/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mathlib
                </a>{' '}
                has grown more than an order of magnitude since 2020.
              </p>
              <p>
                <strong>Process Reward Models:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2312.08935"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Math-Shepherd
                </a>{' '}
                achieves automatic process-wise supervision without human
                annotation.{' '}
                <a
                  href="https://arxiv.org/abs/2406.06592"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OmegaPRM
                </a>{' '}
                uses MCTS for error detection. Gemini Pro improved from 51% to
                69.4% on MATH500 without human intervention.
              </p>
            </Prose>

            <TOCHeading id="verify-experiments" level={3}>
              Falsifiable Experiments
            </TOCHeading>

            <OrderedList>
              <li>
                <strong>Verification Oracle Characterization:</strong> What
                properties of a verification oracle enable RL improvement? Build
                verification environments with controllable properties (latency,
                noise, partial feedback) and measure learning curves.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2408.03314"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Test-time compute scaling
                </a>{' '}
                showed verification-guided inference can outperform 14x larger
                models.
              </li>
              <li>
                <strong>Domain-Specific Verifiers:</strong> Build verifiers for
                currently unverifiable domains. Can we create a DFT-based
                verifier for materials hypotheses that&apos;s accurate enough
                for RL?
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://www.nature.com/articles/s41586-023-06735-9"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GNoME
                </a>{' '}
                (DeepMind, 2023) used DFT as a verifier to discover 2.2 million
                new crystals.
              </li>
              <li>
                <strong>Weak-to-Strong Verification:</strong> Can weak verifiers
                supervise strong models? Test whether models trained with
                imperfect verification can exceed the verifier&apos;s
                capabilities.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://openai.com/index/weak-to-strong-generalization/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenAI&apos;s weak-to-strong generalization
                </a>{' '}
                (2023) showed promising early results.
              </li>
            </OrderedList>

            <TOCHeading id="verify-project" level={3}>
              Project: Intrinsic Self-Improvement Benchmark
            </TOCHeading>
            <Prose>
              <p>
                I&apos;m working on a benchmark that measures the intrinsic
                ability for models to self-improve. The goal is to create a
                verifiable environment where we can plot scaling laws for
                self-improvement, like a Chinchilla curve but for recursive
                capability gain.
              </p>
              <p>Key questions:</p>
            </Prose>
            <UnorderedList>
              <li>
                What features predict a model&apos;s ability to improve itself?
              </li>
              <li>
                Is there a threshold beyond which self-improvement becomes
                super-linear?
              </li>
              <li>
                Can we measure the &quot;improvement efficiency&quot; of
                different architectures?
              </li>
            </UnorderedList>

            <Prose>
              <p>
                <strong>Personal note:</strong> Verifiability is probably the
                most important bottleneck, but through personal research
                probably not the one where I can have the most unique impact.
                I&apos;m working on the{' '}
                <a
                  href="https://www.genesismission.ai/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Genesis Mission
                </a>{' '}
                to help make verification in science happen at a larger scale.
              </p>
            </Prose>
          </ArticleSection>

          {/* Bottleneck 2: OOD Generation */}
          <TOCHeading id="ood-generation" level={2}>
            2. Out-of-Distribution Generation
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Why it matters:</strong> OOD generation asks whether AI
                systems can produce outputs that are genuinely novel, not just
                recombinations of training examples. This is the core capability
                for AI-driven scientific discovery. If models can only
                interpolate within their training distribution, they cannot
                discover new knowledge. The ceiling on AI impact becomes the
                ceiling of human knowledge.
              </p>
            </Prose>

            <QuoteBox>
              <p>
                The limiting factor for AI scientific discovery may not be
                generation capability, but verification capability.{' '}
                <a
                  href="https://deepmind.google/discover/blog/funsearch-making-new-discoveries-in-mathematical-sciences-using-large-language-models/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FunSearch
                </a>{' '}
                works because code can be executed; scientific hypotheses are
                harder because experiments are expensive.
              </p>
            </QuoteBox>

            <TOCHeading id="ood-ways-of-thinking" level={3}>
              Ways of Thinking: Zeroth vs First Order
            </TOCHeading>

            <Prose>
              <p>
                There&apos;s an interesting distinction in how novel discoveries
                happen. Bryan Johnson wrote about{' '}
                <a
                  href="https://medium.com/future-literacy/zeroth-principles-thinking-9376d0b7e7f5"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  zeroth principles thinking
                </a>
                , analogous to the invention of the number zero itself. Some
                discoveries are genuinely new conceptual primitives that
                can&apos;t be derived from existing knowledge.
              </p>
              <p>
                But many breakthroughs are what we might call &quot;first order
                thinking&quot;—novel combinations of existing concepts. When
                Einstein developed special relativity, he imagined himself as a
                beam of light and asked what he would observe. This wasn&apos;t
                a new conceptual primitive; it was a creative recombination of
                existing physics through an unusual perspective.
              </p>
              <p>
                This distinction matters for AI. Current models might be capable
                of first-order discoveries—novel recombinations within the
                training manifold—even if zeroth-order discoveries remain out of
                reach. And maybe &quot;model collapse&quot; isn&apos;t
                catastrophic if the high-dimensional space of first-order
                combinations is large enough to be practically inexhaustible.
              </p>
            </Prose>

            <TOCHeading id="ood-galapagos" level={3}>
              The Galapagos Analogy
            </TOCHeading>

            <Prose>
              <p>
                Evolution on the Galapagos Islands produced remarkable
                adaptations not through directed design but through variation,
                selection, and isolation. The finches didn&apos;t &quot;know&quot;
                they were optimizing beak shapes; the environment selected for
                fitness and variation produced novelty.
              </p>
              <p>
                This suggests a paradigm for OOD generation: instead of asking
                models to directly generate novel ideas, create environments
                where variation is high, selection pressure is strong and
                verifiable, and iteration is fast. The novelty emerges from the
                process, not from any single generation step.
              </p>
              <p>
                <a
                  href="https://deepmind.google/discover/blog/funsearch-making-new-discoveries-in-mathematical-sciences-using-large-language-models/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FunSearch
                </a>{' '}
                (DeepMind, Nature 2024) embodies this. LLM proposes code
                variations, automated evaluator verifies, evolutionary selection
                improves. Key discovery: achieved the largest increase in cap
                set sizes in 20 years. The outputs are readable, interpretable
                programs—not black-box solutions.
              </p>
            </Prose>

            <TOCHeading id="ood-frontier" level={3}>
              Current Frontier Problems
            </TOCHeading>

            <UnorderedList>
              <li>
                <strong>The Faith and Fate Finding:</strong> Transformers
                &quot;solve compositional tasks by reducing multi-step
                compositional reasoning into linearized subgraph matching&quot;
                (
                <a
                  href="https://arxiv.org/abs/2305.18654"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  arXiv:2305.18654
                </a>
                ). They pattern-match against familiar problem structures rather
                than building systematic reasoning.
              </li>
              <li>
                <strong>Pretraining Data Coverage:</strong> Research shows
                transformer in-context learning abilities may be &quot;more
                closely tied to the coverage of their pretraining data mixtures
                than inductive biases.&quot; Performance depends on what models
                have seen, not learned structural principles.
              </li>
              <li>
                <strong>The Diversity Deficit:</strong> LLM systems consistently
                show &quot;lack of diversity in generation&quot; as a key
                limitation. Standard training objectives reward high-probability
                outputs, not diverse outputs.
              </li>
            </UnorderedList>

            <TOCHeading id="ood-sota" level={3}>
              SOTA Directions
            </TOCHeading>

            <Prose>
              <p>
                <strong>Test-Time Compute Scaling:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2408.03314"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Recent work
                </a>{' '}
                shows &quot;test-time compute can be used to outperform a 14x
                larger model.&quot; The paradigm shift from &quot;bigger
                models&quot; to &quot;more inference compute&quot; opens
                possibilities for exploration.
              </p>
              <p>
                <strong>Prior work:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2407.21787"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Large Language Monkeys
                </a>{' '}
                showed coverage scales log-linearly with sample count. On
                SWE-bench Lite, performance jumped from 15.9% with one sample to
                56% with 250 samples.
              </p>
              <p>
                <strong>Can LLMs Generate Novel Research Ideas?</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2409.04109"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stanford researchers
                </a>{' '}
                (2024) had 100+ NLP experts blind-review LLM-generated and
                human-generated research ideas. Key finding: LLM ideas were
                judged more novel (p &lt; 0.05) but slightly weaker on
                feasibility. This novelty-feasibility tradeoff is fundamental.
              </p>
              <p>
                <strong>AI Scientists:</strong>{' '}
                <a
                  href="https://sakana.ai/ai-scientist/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The AI Scientist
                </a>{' '}
                (Sakana AI, 2024) automates the full research lifecycle for ~$15
                per paper.{' '}
                <a
                  href="https://www.kosmos.ai/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kosmos
                </a>{' '}
                (2025) runs 12-hour cycles of parallel data analysis, literature
                search, and hypothesis generation—independent scientists
                verified 79.4% of statements in Kosmos reports as accurate.
              </p>
              <p>
                <strong>Different Inductive Biases:</strong> What if models with
                different architectures think in fundamentally different ways?
                Text diffusion models generate holistically rather than
                left-to-right. Could an ensemble of architecturally diverse
                models produce more diverse hypotheses? This is underexplored.
              </p>
            </Prose>

            <TOCHeading id="ood-experiments" level={3}>
              Falsifiable Experiments
            </TOCHeading>

            <OrderedList>
              <li>
                <strong>Diversity-Promoting Generation:</strong> Implement
                quality-diversity algorithms (from RL novelty search literature)
                for LLM generation. Hypothesis: explicit diversity pressure
                increases the rate of genuinely novel outputs without
                sacrificing quality.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2309.16797"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Promptbreeder
                </a>{' '}
                (2023) showed self-referential prompt evolution can improve
                diversity.{' '}
                <a
                  href="https://arxiv.org/abs/2206.08896"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Evolution through Large Models
                </a>{' '}
                demonstrated LLMs can adapt to domains &quot;never seen in
                pre-training&quot; when combined with evolutionary approaches.
              </li>
              <li>
                <strong>Concept Recombination:</strong> Can we induce
                first-order discoveries by combining wildly different concepts?
                Test whether prompting models to adopt unusual perspectives
                (like Einstein&apos;s light beam thought experiment) produces
                more novel outputs than standard prompting.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2406.07394"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MCTSr
                </a>{' '}
                integrates MCTS with LLMs for mathematical reasoning, enabling
                smaller models to match GPT-4 on Olympiad problems.
              </li>
              <li>
                <strong>Architectural Diversity Ensemble:</strong> Do
                architecturally diverse models (autoregressive, diffusion, SSM)
                produce more diverse hypotheses than ensembles of the same
                architecture? Test on a novel hypothesis generation task.
                <br />
                <em>Prior work:</em> Limited work on this; most ensembles use
                same-architecture models with different seeds.
              </li>
            </OrderedList>

            <TOCHeading id="ood-project" level={3}>
              Project: Research Paper Generator
            </TOCHeading>
            <Prose>
              <p>
                One project I&apos;m exploring is a research agent that can
                generate plausible research papers, combining:
              </p>
            </Prose>
            <UnorderedList>
              <li>
                Literature retrieval (pull similar papers, papers by author,
                papers by topic)
              </li>
              <li>Hypothesis generation with novelty verification</li>
              <li>
                Galapagos-style evolution of hypotheses with fitness based on
                coherence and novelty
              </li>
            </UnorderedList>
            <Prose>
              <p>
                The goal isn&apos;t to replace human researchers but to
                accelerate the hypothesis generation phase of science. If we can
                generate 100 plausible hypotheses where a human would think of
                5, and filter them to the 3 most promising, that&apos;s
                leverage.
              </p>
              <p>
                <strong>Personal note:</strong> OOD generation is probably where
                I can have the most interesting personal impact. It&apos;s the
                least explored of the five bottlenecks and connects directly to
                my interest in AI for science. We&apos;ll see—these are my
                current thoughts.
              </p>
            </Prose>
          </ArticleSection>

          {/* Bottleneck 3: Interpretability */}
          <TOCHeading id="interpretability" level={2}>
            3. Interpretability
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Why it matters:</strong> Mechanistic interpretability is
                the science of reverse-engineering neural networks to understand{' '}
                <em>how</em> they compute. This isn&apos;t just valuable for
                safety—it&apos;s essential for understanding where things go
                wrong and how to fix them. When a model fails, interpretability
                tells you <em>why</em> it failed and <em>where</em> to
                intervene. Without it, debugging is black-box trial and error.
              </p>
            </Prose>

            <QuoteBox>
              <p>
                Interestingly, many discoveries we&apos;ve made about the brain
                have come through exploring how architectures we discover
                through math, physics, and trial and error actually work. When
                an architecture succeeds, it probably means it&apos;s exploiting
                some valuable computational principle that might also exist in
                biological systems.
              </p>
            </QuoteBox>

            <TOCHeading id="interp-frontier" level={3}>
              Current Frontier Problems
            </TOCHeading>

            <Prose>
              <p>
                <strong>What we understand:</strong> Superposition (models
                represent more concepts than neurons using almost-orthogonal
                directions), polysemanticity (individual neurons fire for
                multiple unrelated concepts), circuits (models implement
                computations through identifiable subnetworks), and induction
                heads (a discrete phase transition where models acquire
                in-context learning).
              </p>
              <p>
                <strong>What we don&apos;t understand:</strong>
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>The Superposition Problem:</strong> We lack reliable
                methods to fully decompose superposition. Current sparse
                autoencoder approaches recover some features but miss others,
                and we cannot verify completeness.
              </li>
              <li>
                <strong>Compositional Computation:</strong> How features combine
                to produce complex reasoning remains opaque. We can identify
                individual features but struggle to understand their
                interactions at scale.
              </li>
              <li>
                <strong>Emergence:</strong> We cannot predict when or why
                specific capabilities emerge during training. Phase transitions
                are observed post-hoc, not anticipated.
              </li>
            </UnorderedList>

            <TOCHeading id="interp-sota" level={3}>
              SOTA Directions
            </TOCHeading>

            <Prose>
              <p>
                <strong>Sparse Autoencoders (SAEs):</strong> The breakthrough
                methodology. SAEs decompose model activations into overcomplete,
                sparse dictionaries of interpretable features.{' '}
                <a
                  href="https://transformer-circuits.pub/2024/scaling-monosemanticity/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scaling Monosemanticity
                </a>{' '}
                (Anthropic, May 2024) applied SAEs to Claude 3 Sonnet, extracting
                millions of features including safety-relevant ones.
              </p>
              <p>
                <strong>Prior work:</strong>{' '}
                <a
                  href="https://transformer-circuits.pub/2023/monosemantic-features/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Towards Monosemanticity
                </a>{' '}
                (October 2023) demonstrated the approach on a one-layer
                transformer.{' '}
                <a
                  href="https://openai.com/index/extracting-concepts-from-gpt-4/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenAI trained a 16 million latent autoencoder
                </a>{' '}
                on GPT-4 activations using 40 billion tokens.
              </p>
              <p>
                <strong>Circuit Tracing:</strong>{' '}
                <a
                  href="https://www.anthropic.com/research/tracing-thoughts-language-model"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tracing the Thoughts of a Large Language Model
                </a>{' '}
                (Anthropic, March 2025) revealed: multilingual conceptual space
                (Claude thinks in abstract concepts before translation),
                lookahead planning (for poetry, Claude plans rhymes multiple
                words ahead), parallel arithmetic, and hallucination mechanism
                (a &quot;known entities&quot; circuit must inhibit default
                refusal).
              </p>
              <p>
                <strong>Golden Gate Claude:</strong> Anthropic amplified the
                &quot;Golden Gate Bridge&quot; feature in Claude 3 Sonnet,
                causing obsessive references. This proved we can identify
                specific concept representations and surgically modify behavior
                without fine-tuning.
              </p>
              <p>
                <strong>Automated Circuit Discovery:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2304.14997"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ACDC
                </a>{' '}
                (NeurIPS 2023 Spotlight) automates circuit analysis,
                successfully rediscovering 5/5 component types in GPT-2&apos;s
                Greater-Than circuit.{' '}
                <a
                  href="https://arxiv.org/abs/2403.19647"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sparse Feature Circuits
                </a>{' '}
                (ICLR 2025) introduced unsupervised discovery at scale.
              </p>
            </Prose>

            <TOCHeading id="interp-experiments" level={3}>
              Falsifiable Experiments
            </TOCHeading>

            <OrderedList>
              <li>
                <strong>SAE Completeness Verification:</strong> Design tests
                that could falsify the hypothesis that SAEs capture all
                important features. If we can find behaviors not explained by
                SAE features, we know the decomposition is incomplete.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2406.04093"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SAE evaluation work
                </a>{' '}
                has begun establishing metrics but completeness remains open.
              </li>
              <li>
                <strong>Cross-Architecture Interpretability:</strong> Do the
                same features appear in different architectures (transformer vs.
                Mamba) trained on the same data? This would reveal which
                features are task-dependent vs. architecture-dependent.
                <br />
                <em>Prior work:</em> Limited; most interpretability work focuses
                on transformers. This is a clear gap.
              </li>
              <li>
                <strong>Failure Mode Prediction:</strong> Can interpretability
                predict model failures before they manifest in outputs? Test
                whether internal feature activations can detect hallucinations
                or reasoning errors earlier than output-based methods.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://www.anthropic.com/research/probes-catch-sleeper-agents"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Anthropic&apos;s Persona Vectors
                </a>{' '}
                (August 2025) showed personality traits can be monitored and
                potentially vaccinated against.
              </li>
            </OrderedList>

            <InsightBox title="Key Papers">
              <UnorderedList>
                <li>
                  <a
                    href="https://transformer-circuits.pub/2022/toy_model/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Toy Models of Superposition
                  </a>{' '}
                  (September 2022)
                </li>
                <li>
                  <a
                    href="https://transformer-circuits.pub/2024/scaling-monosemanticity/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Scaling Monosemanticity
                  </a>{' '}
                  (May 2024)
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/research/tracing-thoughts-language-model"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Circuit Tracing
                  </a>{' '}
                  (March 2025)
                </li>
                <li>
                  <a
                    href="https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Induction Heads
                  </a>{' '}
                  (March 2022)
                </li>
              </UnorderedList>
            </InsightBox>
          </ArticleSection>

          {/* Bottleneck 4: Alternate Architectures */}
          <TOCHeading id="alternate-architectures" level={2}>
            4. Alternate Architectures
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Why it matters:</strong> Different architectures embed
                different inductive biases—the assumptions baked into the
                architecture about what patterns matter. Transformers assume
                that any token can attend to any other token with equal ease.
                This is powerful but expensive. SSMs assume information should
                be compressed into a fixed-size state. This is efficient but
                lossy. The question is: what inductive biases are we missing,
                and what would we gain by finding them?
              </p>
            </Prose>

            <TOCHeading id="arch-inductive-bias" level={3}>
              What is an Inductive Bias?
            </TOCHeading>

            <Prose>
              <p>
                An inductive bias is a prior assumption that constrains what a
                model can easily learn. Convolutional neural networks have a
                translation invariance bias—they assume the same pattern matters
                regardless of where it appears in an image. This makes them
                sample-efficient for vision but inappropriate for tasks where
                position matters.
              </p>
              <p>
                Different architectures optimize for different things:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Scaling:</strong> How does performance grow with compute,
                parameters, and data? Can we be more compute-efficient?
              </li>
              <li>
                <strong>Inductive Bias:</strong> What assumptions about the task
                are built in? Sequence, hierarchy, compositionality, memory?
              </li>
              <li>
                <strong>Hardware Fit:</strong> Does the architecture match
                modern accelerator designs? Attention is memory-bound; linear
                operations are compute-bound.
              </li>
              <li>
                <strong>Interpretability:</strong> Can we understand what the
                model is doing? Some architectures are more naturally
                interpretable.
              </li>
            </UnorderedList>

            <TOCHeading id="arch-outside-box" level={3}>
              Thinking Outside the Box
            </TOCHeading>

            <Prose>
              <p>
                Some researchers argue the current paradigm is fundamentally
                limited.{' '}
                <a
                  href="https://www.youtube.com/watch?v=pd0JmT6rYcI"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rich Sutton
                </a>{' '}
                has argued that current methods lack the ability to discover new
                knowledge structures.{' '}
                <a
                  href="https://openreview.net/pdf?id=BZ5a1r-kVsf"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Yann LeCun
                </a>{' '}
                advocates for world models and energy-based approaches, arguing
                autoregressive prediction is insufficient for real
                understanding.
              </p>
              <p>
                These critiques suggest there may be old research directions—ideas
                that didn&apos;t work at small scale—that deserve revisiting
                with modern compute. What if some 1990s neural architecture
                paper was ahead of its time? This is exciting to me as an area
                to explore.
              </p>
            </Prose>

            <TOCHeading id="arch-frontier" level={3}>
              Current Frontier Problems
            </TOCHeading>

            <UnorderedList>
              <li>
                <strong>Quadratic Attention:</strong> At 128K tokens, attention
                requires ~256GB memory. At 1M+ tokens, it&apos;s infeasible.
                Long-context applications are blocked.
              </li>
              <li>
                <strong>Representational Collapse:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2406.04267"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Recent work
                </a>{' '}
                shows decoder-only transformers produce &quot;arbitrarily
                similar final-layer representations for distinct input
                sequences.&quot;
              </li>
              <li>
                <strong>Missing Inductive Biases:</strong> Transformers lack
                explicit biases for temporal structure, compositionality, memory
                compression, and recurrence.
              </li>
            </UnorderedList>

            <TOCHeading id="arch-sota" level={3}>
              SOTA Directions
            </TOCHeading>

            <Prose>
              <p>
                <strong>Mamba:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2312.00752"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gu &amp; Dao (December 2023)
                </a>{' '}
                introduced Selective State Space Models. 5x higher inference
                throughput than transformers. Linear O(n) scaling. Mamba-3B
                outperforms transformers of the same size.
              </p>
              <p>
                <strong>Hybrids:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2403.19887"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jamba
                </a>{' '}
                (AI21 Labs, March 2024) interleaves transformer and Mamba layers
                + MoE. Fits in single 80GB GPU with 256K token context.{' '}
                <a
                  href="https://arxiv.org/abs/2501.00663"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Titans
                </a>{' '}
                (Google, January 2025) scales to 2M+ token contexts with neural
                long-term memory.
              </p>
              <p>
                <strong>SSM Limitations:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2402.01032"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  arXiv:2402.01032
                </a>{' '}
                proves &quot;state space models are limited compared to
                transformers on tasks that require copying from input
                context.&quot; The fixed-size latent state creates an inherent
                bottleneck for precise recall.
              </p>
            </Prose>

            <TOCHeading id="arch-when" level={3}>
              When Different Architectures Win
            </TOCHeading>

            <ComparisonTable
              headers={['Task', 'Winner', 'Reason']}
              rows={[
                ['Very long sequences (100K+)', 'Mamba/SSMs', 'Linear scaling'],
                ['Genomics/DNA', 'Mamba', 'Million-token contexts native'],
                [
                  'In-context learning',
                  'Transformers',
                  'Perfect recall from KV cache',
                ],
                [
                  'Associative recall/copying',
                  'Transformers',
                  'Explicit attention patterns',
                ],
                ['Streaming/real-time', 'Mamba/RWKV', 'O(1) inference per token'],
                [
                  'Long + precise recall',
                  'Hybrids (Jamba)',
                  'Best of both worlds',
                ],
              ]}
            />

            <TOCHeading id="arch-experiments" level={3}>
              Falsifiable Experiments
            </TOCHeading>

            <OrderedList>
              <li>
                <strong>Old Architecture Revival:</strong> Take a promising
                1990s-2000s architecture (Hopfield networks, liquid state
                machines, echo state networks) and train it at modern scale. Do
                any show surprising capabilities?
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2008.02217"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Modern Hopfield Networks
                </a>{' '}
                (2020) showed unexpected connections to attention.
              </li>
              <li>
                <strong>Inductive Bias Ablation:</strong> Systematically vary
                inductive biases (recurrence depth, attention locality, state
                size) and measure impact on different task categories. Build a
                taxonomy of which biases help which tasks.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2402.19427"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Griffin
                </a>{' '}
                (DeepMind, 2024) showed gated linear recurrences match Llama-2
                with 6x fewer tokens.
              </li>
              <li>
                <strong>Hybrid Architecture Search:</strong> What is the optimal
                ratio of attention to SSM layers for different task types?
                Automate the search over hybrid configurations.
                <br />
                <em>Prior work:</em> Jamba provides initial manual guidance but
                systematic search is lacking.
              </li>
            </OrderedList>

            <InsightBox title="Key Papers">
              <UnorderedList>
                <li>
                  <a
                    href="https://arxiv.org/abs/2312.00752"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mamba
                  </a>{' '}
                  - Gu &amp; Dao (December 2023)
                </li>
                <li>
                  <a
                    href="https://arxiv.org/abs/2403.19887"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Jamba
                  </a>{' '}
                  - AI21 Labs (March 2024)
                </li>
                <li>
                  <a
                    href="https://arxiv.org/abs/2402.19427"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Griffin
                  </a>{' '}
                  - DeepMind (February 2024)
                </li>
                <li>
                  <a
                    href="https://arxiv.org/abs/2501.00663"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Titans
                  </a>{' '}
                  - Google (January 2025)
                </li>
              </UnorderedList>
            </InsightBox>
          </ArticleSection>

          {/* Bottleneck 5: Continual Learning */}
          <TOCHeading id="continual-learning" level={2}>
            5. Continual Learning
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                <strong>Why it matters (and why I&apos;m not sure it does):</strong>{' '}
                There&apos;s a theory that we lose a tremendous amount by not
                having continuously running agents. Graham Bell spent three days
                doing nothing but thinking before his breakthroughs. Newton
                famously worked on problems for years, holding them in mind
                continuously. The autoregressive paradigm discards all
                activations between completions—you start fresh each time.
              </p>
              <p>
                But I&apos;m not convinced continual learning is strictly
                necessary. Part of the exploration is whether we even need it.
                Maybe agentic harnesses with good memory systems are sufficient.
                Maybe the right prompt engineering recreates the relevant
                context. The question is open.
              </p>
            </Prose>

            <TOCHeading id="cl-poetic" level={3}>
              The Poetic ARC-AGI Result
            </TOCHeading>

            <Prose>
              <p>
                One piece of evidence for the importance of sustained
                cognition:{' '}
                <a
                  href="https://arcprize.org/blog/oai-o3-pub-breakthrough"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MindsAI&apos;s Poetic approach
                </a>{' '}
                achieved remarkable scores on ARC-AGI with a small team
                competing against giants. Their approach emphasized test-time
                compute and iterative refinement—something closer to
                &quot;thinking continuously&quot; than single-shot generation.
              </p>
              <p>
                This doesn&apos;t prove continual learning is necessary, but it
                suggests that extended, focused computation on a single problem
                matters. Whether that requires architectural changes or just
                better scaffolding is the question.
              </p>
            </Prose>

            <TOCHeading id="cl-frontier" level={3}>
              Current Frontier Problems
            </TOCHeading>

            <UnorderedList>
              <li>
                <strong>Stability-Plasticity Dilemma:</strong> Retaining old
                knowledge while acquiring new knowledge. Not binary but a
                spectrum that must be dynamically managed.
              </li>
              <li>
                <strong>Safety Alignment Forgetting:</strong> Medical and
                safety-critical fine-tuning frequently induces catastrophic
                forgetting of safety alignment (
                <a
                  href="https://arxiv.org/abs/2601.04199"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zhao et al., 2025
                </a>
                ).
              </li>
              <li>
                <strong>The Agentic Alternative:</strong> Do we need continual
                learning in the weights, or can we achieve the same effect with
                persistent memory systems and good scaffolding?
              </li>
            </UnorderedList>

            <TOCHeading id="cl-sota" level={3}>
              SOTA Directions
            </TOCHeading>

            <Prose>
              <p>
                <strong>Parameter-Efficient Methods:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2405.09673"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Biderman et al. (TMLR 2024)
                </a>{' '}
                found &quot;LoRA learns less and forgets less.&quot; The rank
                constraint is both limitation and anti-forgetting mechanism.
              </p>
              <p>
                <strong>Task Arithmetic:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2212.04089"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ilharco et al. (ICLR 2023)
                </a>{' '}
                showed model behavior can be edited by arithmetic on
                weight-space vectors. &quot;The only approach that reliably
                yields performance gains on LLMs.&quot;
              </p>
              <p>
                <strong>Episodic Memory:</strong>{' '}
                <a
                  href="https://arxiv.org/abs/2601.03192"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MemRL
                </a>{' '}
                (Zhang et al., 2025) uses non-parametric RL on episodic memory
                to enable agent self-evolution while avoiding catastrophic
                forgetting.
              </p>
              <p>
                <strong>Agentic Approaches:</strong> Systems like{' '}
                <a
                  href="https://github.com/princeton-nlp/SWE-agent"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SWE-agent
                </a>{' '}
                and{' '}
                <a
                  href="https://www.cognition.ai/blog/introducing-devin"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Devin
                </a>{' '}
                achieve sustained work through scaffolding rather than weight
                updates. They maintain context through external memory, not
                internal learning.
              </p>
            </Prose>

            <TOCHeading id="cl-experiments" level={3}>
              Falsifiable Experiments
            </TOCHeading>

            <OrderedList>
              <li>
                <strong>Scaffolding vs. Weights:</strong> Compare agentic
                systems with external memory against systems with continual
                weight updates on tasks requiring sustained cognition. Which
                approach wins, and when?
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2304.03442"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Generative Agents
                </a>{' '}
                (Stanford, 2023) showed external memory enables complex
                sustained behavior.
              </li>
              <li>
                <strong>Activation Persistence:</strong> What if we could
                maintain activations across completions? Design experiments to
                test whether persistent hidden states improve multi-turn
                reasoning.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2501.00663"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Titans
                </a>
                &apos; neural memory is a step in this direction.
              </li>
              <li>
                <strong>Safety Alignment Preservation:</strong> Can we fine-tune
                for new capabilities while provably preserving safety behaviors?
                Test orthogonal subspace methods.
                <br />
                <em>Prior work:</em>{' '}
                <a
                  href="https://arxiv.org/abs/2310.02304"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  STOP
                </a>{' '}
                showed self-improvement without weight changes, sidestepping the
                problem.
              </li>
            </OrderedList>

            <InsightBox title="Key Papers">
              <UnorderedList>
                <li>
                  <a
                    href="https://arxiv.org/abs/2405.09673"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LoRA Learns Less and Forgets Less
                  </a>{' '}
                  (TMLR 2024)
                </li>
                <li>
                  <a
                    href="https://arxiv.org/abs/2212.04089"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Task Arithmetic
                  </a>{' '}
                  (ICLR 2023)
                </li>
                <li>
                  <a
                    href="https://arxiv.org/abs/2402.01364"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continual Learning for LLMs Survey
                  </a>{' '}
                  (Wu et al., 2024)
                </li>
              </UnorderedList>
            </InsightBox>
          </ArticleSection>

          {/* Section: Synthesis */}
          <TOCHeading id="synthesis" level={2}>
            Synthesis: How These Connect
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                These five bottlenecks are deeply interconnected. Progress on
                any one creates leverage for the others:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                <strong>Verifiability gates everything.</strong> You can only
                train on what you can verify. OOD generation needs verification
                to filter novel outputs. Interpretability provides a form of
                verification (understanding = predictability).
              </li>
              <li>
                <strong>OOD generation is the goal.</strong> Recursive
                improvement that only recombines existing knowledge has a
                ceiling. True acceleration requires generating knowledge beyond
                the training distribution.
              </li>
              <li>
                <strong>
                  Interpretability tells you what&apos;s working.
                </strong>{' '}
                When OOD generation fails, interpretability explains why. When
                continual learning causes forgetting, interpretability shows
                where.
              </li>
              <li>
                <strong>Architectures determine what&apos;s possible.</strong>{' '}
                Different inductive biases may be better suited to different
                parts of this problem. The right architecture might make
                continual learning trivial.
              </li>
              <li>
                <strong>Continual learning might not be necessary.</strong> Or
                it might be the key to sustained cognition. The question is
                open.
              </li>
            </UnorderedList>

            <InsightBox title="My Current Bet">
              <p>
                <strong>Verifiability</strong> is probably the most important
                bottleneck. If we can extend reliable verification to more
                domains, we unlock RLVR for those domains, which accelerates
                capability development. But through personal research,
                it&apos;s not where I can have the most unique impact—I&apos;m
                working on that through the Genesis Mission at larger scale.
              </p>
              <p className="mt-2">
                <strong>OOD generation</strong> is where I think I can have the
                most interesting personal impact. It&apos;s the least explored
                of the five and connects directly to my interest in AI for
                science. We&apos;ll see—these are my current thoughts.
              </p>
            </InsightBox>
          </ArticleSection>

          {/* Section: My Goals */}
          <TOCHeading id="goals" level={2}>
            My Goals for 2026
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Given this framing, here&apos;s what I&apos;m trying to achieve:
              </p>
            </Prose>

            <OrderedList>
              <li>
                <strong>
                  Prove something is worth scaling up with compute.
                </strong>{' '}
                I want one result where, if I explained it to a senior
                researcher, they&apos;d pause. Not necessarily a breakthrough,
                but something that demonstrates a promising direction that
                deserves more resources.
              </li>
              <li>
                <strong>Demonstrate a novel capability.</strong> Build something
                where, if 100x the compute were thrown at it, it would yield
                incredible results. The prototype doesn&apos;t need to be
                incredible; it needs to be scalable.
              </li>
              <li>
                <strong>Know where to continue exploring for value.</strong>{' '}
                Through articles, experiments, and public logs of what I&apos;m
                learning, develop clearer intuitions about where the highest
                leverage work is. Add value to the field&apos;s understanding,
                not just my own.
              </li>
            </OrderedList>

            <Prose>
              <p>
                The timeline is aggressive. I want to move from exploration to
                exploitation this year, but I&apos;m not setting a hard date.
                The goal is building taste, intuition, and the foundations for
                whatever bet I make next.
              </p>
            </Prose>

            <MutedText>
              I&apos;ll be linking to experiment logs and updates as I work
              through these problems. The goal is to think in public, not just
              announce results.
            </MutedText>
          </ArticleSection>

          {/* Section: Call to Action */}
          <TOCHeading id="call-to-action" level={2}>
            What Should You Work On?
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Jascha&apos;s talk offers a rubric for evaluating research
                projects that I find useful:
              </p>
            </Prose>

            <OrderedList>
              <li>
                <strong>Impact:</strong> If this project works flawlessly, how
                large is the potential benefit? Evaluate the expected outcome
                projected onto your value axis.
              </li>
              <li>
                <strong>Bitter Lesson Robustness:</strong> Will your research be
                robust to increased scale of compute and intelligence? Things
                that are robust: developing foundational datasets, algorithms
                that interact superlinearly with scale, work that sets the
                questions future research asks.
              </li>
              <li>
                <strong>Opportunity Cost:</strong> How much time will this take
                that won&apos;t be useful if the project fails? Find ways to
                de-risk toy versions of ideas as quickly as possible.
              </li>
              <li>
                <strong>Comparative Advantage:</strong> Why are you, in
                particular, suited to this project? Access to data, compute,
                skills, collaborators, or a clever idea no one else has.
              </li>
              <li>
                <strong>Redundancy:</strong> How many other people are trying to
                solve this in the same way? If everyone agrees you&apos;re
                working on a very important problem, someone else will do it.
                Get on the wave before it&apos;s crashing.
              </li>
            </OrderedList>

            <QuoteBox>
              <p>
                The ideal thing to work on is something where you can clearly
                explain why it is a good idea, but when you explain it to other
                people they look at you funny and have trouble getting it. This
                is the strongest signal of future project success.
              </p>
              <p className="text-neutral-500 mt-2">— Jascha Sohl-Dickstein</p>
            </QuoteBox>

            <Prose>
              <p>
                The next few years are a good time, possibly the last time, to
                go all in. The potential impact of your work is unlikely to ever
                be larger. Choose wisely.
              </p>
            </Prose>
          </ArticleSection>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <MutedText>
              This article reflects my current thinking as of January 2025.
              These are hypotheses, not conclusions. If you&apos;re working on
              any of these problems, I&apos;d love to talk. Reach out on{' '}
              <a
                href="https://twitter.com/silennai"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              .
            </MutedText>
          </div>

          {/* Spacing */}
          <div className="h-32" />
        </ArticleLayout>
      </div>
    </TOCProvider>
  );
}
