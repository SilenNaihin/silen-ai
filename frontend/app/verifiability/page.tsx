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
  Aside,
  Figure,
} from '@/components/article/Callouts';

export default function VerifiabilityArticle() {
  return (
    <TOCProvider>
      <StickyHeader title="Verifiability in AI" />

      <div className="pt-14">
        <ArticleLayout className="bg-white">
          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4 text-black leading-tight">
            Verifiability in AI Research
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            You can only train on what you can verify. You can only trust what
            you can verify. The rate of AI progress in any domain is
            proportional to how quickly and cheaply you can verify results in
            that domain.
          </p>

          {/* Section 1: The Stakes */}
          <TOCHeading id="the-stakes" level={2} className="mt-8">
            The Stakes
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                AI research has a reproducibility crisis. But reproducibility is
                not the core problem. You can reproduce a flawed result
                perfectly. The real issue is verifiability.
              </p>
              <p>
                Verifiability determines the speed of the improvement loop. When
                an agent generates a hypothesis, writes code, or proposes an
                action, how quickly can we know if it worked? The answer to this
                question predicts almost everything about how fast that domain
                will advance.
              </p>
              <p>
                This explains the uneven progress across AI applications. Code
                generation is ahead of science generation. Game-playing AI
                mastered Go before mastering chemistry. Math reasoning improved
                rapidly once we had Lean. These are not coincidences. They are
                consequences of verification speed.
              </p>
            </Prose>

            <QuoteBox>
              <p>
                The ease of training AI to solve a task is proportional to how
                verifiable the task is.
              </p>
              <p className="text-neutral-500 mt-2">
                — Jason Wei,{' '}
                <a
                  href="https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Asymmetry of Verification
                </a>
              </p>
            </QuoteBox>

            <Prose>
              <p>
                For recursive self-improvement, verifiability is the
                bottleneck. An AI system improving itself needs to know whether
                each modification made things better. If verification takes
                months, improvement takes years. If verification takes
                milliseconds, improvement can be continuous.
              </p>
              <p>
                Understanding verifiability is understanding where AI can
                accelerate and where it will stall.
              </p>
            </Prose>

            <Figure
              src="/articles/verifiability/verification-loop.png"
              alt="The verification loop: Generate, Verify, Learn, Improve"
              caption="The speed of this loop determines the speed of progress"
            />
          </ArticleSection>

          {/* Section 2: Dimensions of Verifiability */}
          <TOCHeading id="dimensions" level={2}>
            The Dimensions of Verifiability
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Verifiability is not a single property. It breaks down into
                several independent dimensions. A claim can be fast to verify
                but uncertain. It can be cheap but hard to reproduce. Each
                dimension matters differently depending on the application.
              </p>
            </Prose>

            <TOCHeading id="dim-speed" level={3}>
              Speed of Verification
            </TOCHeading>
            <Prose>
              <p>
                How long does it take from making a claim to knowing if it is
                true?
              </p>
              <p>
                Speed is the most important dimension for AI training and
                agentic systems. Reinforcement learning needs reward signals. If
                reward takes six months to compute, you cannot do RL. If reward
                takes milliseconds, you can do millions of iterations.
              </p>
              <p>
                Code verification is fast. Run the tests. Did they pass? You
                know in seconds. Clinical trial verification is slow. Enroll
                patients. Wait years. Analyze outcomes. The speed difference is
                not 10x. It is 10,000,000x.
              </p>
              <p>
                This is why AI coding assistants are useful today while AI drug
                discovery remains mostly aspirational. Not because drug
                discovery is harder in some abstract sense. Because the feedback
                loop is slower.
              </p>
            </Prose>

            <Aside title="P vs NP and Verification">
              <p>
                There is a deep connection between verifiability and
                computational complexity. Many interesting problems are in NP:
                hard to solve but easy to verify. Given a solution, you can
                check it quickly even if finding the solution was hard.
              </p>
              <p className="mt-2">
                This asymmetry is good for AI. We can use AI to generate
                candidate solutions and cheap verification to filter them.
                Generate-and-test works when verification is fast.
              </p>
              <p className="mt-2">
                But some problems have expensive verification. PSPACE-hard
                problems can require exponential time just to check a solution.
                For these, even the verify step is intractable. The
                verifiability spectrum roughly maps to computational complexity
                classes.
              </p>
            </Aside>

            <TOCHeading id="dim-cost" level={3}>
              Cost of Verification
            </TOCHeading>
            <Prose>
              <p>Who can afford to verify this claim?</p>
              <p>
                Running a unit test costs nothing. Running a wet lab experiment
                costs thousands. Running a clinical trial costs millions.
                Running a particle physics experiment costs billions.
              </p>
              <p>
                Cost creates gatekeeping. If verification is expensive, only
                well-funded labs can participate. This concentrates research in
                institutions that can afford the verification infrastructure.
                It also means fewer total verification cycles happen.
              </p>
              <p>
                Cost and speed interact. A verification that takes one hour but
                costs $100,000 in compute is different from one that takes one
                hour and costs $1. Both are slow. But the expensive one will
                happen far fewer times.
              </p>
              <p>
                The trend in AI has been to make verification cheaper through
                simulation. Molecular dynamics replaces some wet lab work.
                Physics engines replace some robotics testing. Synthetic data
                replaces some human annotation. Each substitution increases the
                number of verification cycles per dollar.
              </p>
            </Prose>

            <TOCHeading id="dim-certainty" level={3}>
              Certainty of Verification
            </TOCHeading>
            <Prose>
              <p>
                When you verify something, how confident are you in the result?
              </p>
              <p>
                Code execution is deterministic. The test either passes or
                fails. There is no ambiguity. Mathematical proofs in Lean are
                machine-checkable. The proof is valid or it is not.
              </p>
              <p>
                Wet lab experiments are noisy. Biological systems have variance.
                Reagent batches differ. Equipment calibration drifts. Two labs
                running the same protocol get different results. This is not
                fraud. It is the nature of physical measurement.
              </p>
              <p>
                Simulations sit in between. Molecular dynamics is deterministic
                given the same initial conditions. But the simulation
                approximates reality. The force fields are empirical fits. The
                time steps are discrete. The boundary conditions are artificial.
                You can verify perfectly within the simulation while remaining
                uncertain about the physical world.
              </p>
              <p>
                Uncertainty compounds. If each verification step has 90%
                confidence, a chain of 10 steps has only 35% confidence. Long
                inference chains in uncertain domains become unreliable fast.
              </p>
            </Prose>

            <TOCHeading id="dim-meta" level={3}>
              Meta-Verifiability
            </TOCHeading>
            <Prose>
              <p>How do you know your verifier is correct?</p>
              <p>
                This is the turtles-all-the-way-down problem. You use a test
                suite to verify code. But who verifies the test suite? You use a
                benchmark to measure model capability. But who verifies the
                benchmark measures what you think it measures?
              </p>
              <p>
                In materials science, Density Functional Theory is the gold
                standard for predicting material properties. DFT is roughly 95%
                accurate for many calculations. But which 5% is wrong? The
                theory has known failure modes for strongly correlated systems,
                van der Waals interactions, and band gaps. When you use DFT to
                verify a prediction, you inherit these uncertainties.
              </p>
              <p>
                Benchmarks are games. They are defined by rules. You can verify
                performance on the benchmark with perfect certainty. But the
                claim that benchmark performance predicts real-world capability
                is itself unverified. MMLU saturation did not mean models could
                do everything. It meant the benchmark stopped measuring the
                thing we cared about.
              </p>
              <p>
                Meta-verifiability is especially problematic for AI safety
                claims. &quot;This model is aligned&quot; requires a verifier
                for alignment. We do not have one. So we use proxies. RLHF. Red
                teaming. Constitutional AI. Each proxy is itself unverified as a
                measure of alignment.
              </p>
            </Prose>

            <TOCHeading id="dim-reproducibility" level={3}>
              Reproducibility of Verification
            </TOCHeading>
            <Prose>
              <p>If you verify something twice, do you get the same answer?</p>
              <p>
                This is different from certainty. A verification can be highly
                certain in the moment but irreproducible. A wet lab result can
                be clear today but fail to replicate next month because reagents
                degraded.
              </p>
              <p>
                In ML, reproducibility failures come from many sources. Random
                seeds. Hardware differences. Library versions. Hyperparameter
                sensitivity. Floating point non-determinism. Two researchers
                running the &quot;same&quot; code can get different results.
              </p>
              <p>
                Reproducibility matters for science because claims need to be
                independently verifiable. If only you can run your experiment,
                the community cannot build on it. It matters for engineering
                because systems need to behave consistently. A model that passes
                evaluation but fails in production is not reliably verified.
              </p>
              <p>
                The replication crisis in psychology found that only about 40%
                of findings replicated. The number was higher for findings with
                p &lt; 0.005 (74%) versus 0.005 &lt; p &lt; 0.05 (28%). This
                suggests that many &quot;verified&quot; findings were never
                actually verified in a reproducible sense.
              </p>
            </Prose>

            <TOCHeading id="dim-granularity" level={3}>
              Granularity of Verification
            </TOCHeading>
            <Prose>
              <p>Can you verify intermediate steps or only final outcomes?</p>
              <p>
                Process Reward Models verify reasoning step-by-step. Outcome
                Reward Models only verify the final answer. PRMs catch errors
                earlier. They provide more signal per verification. But they are
                harder to build because you need ground truth for intermediate
                steps.
              </p>
              <p>
                In math, you can verify each step of a proof. If the conclusion
                is wrong, you can find where the reasoning broke. In creative
                work, you often can only verify the final output. There is no
                ground truth for intermediate steps of writing a novel.
              </p>
              <p>
                Granularity affects credit assignment. When something fails,
                coarse verification tells you it failed but not why. Fine
                verification localizes the failure. This matters enormously for
                learning. Sparse reward is hard to learn from. Dense reward is
                easier.
              </p>
            </Prose>

            <TOCHeading id="dim-complexity" level={3}>
              Complexity of Verification
            </TOCHeading>
            <Prose>
              <p>How much infrastructure and expertise does verification require?</p>
              <p>
                Running a Python script requires Python. Verifying a Lean proof
                requires Lean. These are simple. Installing them takes minutes.
              </p>
              <p>
                Running a distributed training experiment requires a cluster,
                orchestration software, monitoring, and expertise to debug
                failures. The verification infrastructure is itself complex.
              </p>
              <p>
                Running a biology experiment requires a lab, equipment,
                reagents, protocols, and years of training to execute properly.
                The verification is not just expensive. It is institutionally
                complex.
              </p>
              <p>
                Complexity creates barriers to entry. It means errors in
                verification are harder to catch. It means fewer people can
                verify independently. It creates dependence on specialized
                infrastructure and expertise.
              </p>
            </Prose>

            <TOCHeading id="dim-interpretability" level={3}>
              Interpretability of Verification
            </TOCHeading>
            <Prose>
              <p>
                When verification succeeds or fails, do you understand why?
              </p>
              <p>
                A test passes. Good. But why did it pass? Did it pass because
                the code is correct? Or because the test does not exercise the
                bug? A test fails. Bad. But why did it fail? Is it a real bug or
                a flaky test?
              </p>
              <p>
                Interpretable verification tells you what went right or wrong.
                Uninterpretable verification gives you a binary signal without
                explanation. Loss went down. Good. But did the model learn the
                right thing or find a shortcut?
              </p>
              <p>
                In mechanistic interpretability, we want to understand not just
                that a model behaves correctly but why it behaves correctly. The
                verification is interpretable when we can trace the behavior to
                specific computations. It is uninterpretable when we only know
                the output.
              </p>
            </Prose>

            <TOCHeading id="dim-falsifiability" level={3}>
              Falsifiability of the Claim
            </TOCHeading>
            <Prose>
              <p>Is there any outcome that would disprove the claim?</p>
              <p>
                This is not about the verification itself but about whether the
                claim is even verifiable in principle. &quot;This model is
                aligned&quot; is hard to falsify because alignment is not
                precisely defined. &quot;This model refuses to generate harmful
                content&quot; is falsifiable. Find one example where it does
                not refuse.
              </p>
              <p>
                Unfalsifiable claims are unverifiable by definition. They can
                always be defended against contrary evidence. &quot;The model
                understood the task, it just chose not to demonstrate
                understanding.&quot; This is not science. It is unfalsifiable
                speculation.
              </p>
              <p>
                Good research practice requires falsifiable hypotheses. Before
                running an experiment, you should know what result would
                disprove your hypothesis. If no result would disprove it, you
                are not doing science.
              </p>
            </Prose>

            <TOCHeading id="dim-composability" level={3}>
              Composability of Verification
            </TOCHeading>
            <Prose>
              <p>Do verified components compose to verified systems?</p>
              <p>
                You verify module A works. You verify module B works. Does A + B
                work? Not necessarily. Integration introduces new failure modes.
                Interfaces can mismatch. Timing can diverge. Assumptions can
                conflict.
              </p>
              <p>
                Formal verification aims for composability. If A is proven
                correct and B is proven correct and they satisfy certain
                interface contracts, then A + B is proven correct. This is
                powerful but rare outside formal methods.
              </p>
              <p>
                In ML, composition is especially unreliable. A model trained on
                distribution X works. A model trained on distribution Y works.
                But the combined system operating on X + Y may fail in ways
                neither component fails alone. Distribution shift, compounding
                errors, and emergent behaviors break composition.
              </p>
            </Prose>

            {/* Summary Table */}
            <TOCHeading id="dimensions-summary" level={3}>
              Summary: The Dimensions
            </TOCHeading>
            <ComparisonTable
              headers={['Dimension', 'Question', 'Why It Matters']}
              rows={[
                [
                  'Speed',
                  'How long until you know?',
                  'Gates iteration rate; critical for RL and agents',
                ],
                [
                  'Cost',
                  'How much does it cost?',
                  'Determines who can participate; limits cycles',
                ],
                [
                  'Certainty',
                  'How confident is the result?',
                  'Noisy verification compounds errors',
                ],
                [
                  'Meta-verifiability',
                  'Is the verifier correct?',
                  'Benchmarks can be gamed; proxies can mislead',
                ],
                [
                  'Reproducibility',
                  'Same result twice?',
                  'Science requires independent replication',
                ],
                [
                  'Granularity',
                  'Steps or just outcome?',
                  'Finer signal enables better credit assignment',
                ],
                [
                  'Complexity',
                  'What infrastructure is needed?',
                  'Barriers to entry; harder to catch errors',
                ],
                [
                  'Interpretability',
                  'Do you understand why?',
                  'Binary signals hide important information',
                ],
                [
                  'Falsifiability',
                  'Can it be disproven?',
                  'Unfalsifiable claims are unverifiable',
                ],
                [
                  'Composability',
                  'Do parts compose?',
                  'Systems fail where components do not',
                ],
              ]}
            />

            <Figure
              src="/articles/verifiability/dimensions.png"
              alt="Radar chart showing the 10 dimensions of verifiability"
              caption="The 10 dimensions of verifiability"
            />
          </ArticleSection>

          {/* Section 3: The Verifiability Spectrum */}
          <TOCHeading id="spectrum" level={2}>
            The Verifiability Spectrum
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Different domains sit at different points on the verifiability
                spectrum. This is not arbitrary. It reflects the nature of the
                domain. Physics has reproducible laws. Biology has stochastic
                processes. Social systems have reflexive agents.
              </p>
              <p>
                The history of science tracks the verifiability spectrum.
                Physics advanced first because experiments are reproducible and
                mathematical. Chemistry followed as we developed reliable
                measurement. Biology came later because living systems are
                messier. Psychology and economics remain contested because
                verification is hard and replication rates are low.
              </p>
            </Prose>

            <ComparisonTable
              headers={[
                'Domain',
                'Speed',
                'Cost',
                'Certainty',
                'Reproducibility',
                'Complexity',
                'Historical Progress',
              ]}
              rows={[
                [
                  'Code Runtime',
                  'ms',
                  'Free',
                  '100%',
                  'Perfect',
                  'Low',
                  'Rapid iteration; CI/CD culture',
                ],
                [
                  'Formal Math (Lean)',
                  'ms-sec',
                  'Free',
                  '100%',
                  'Perfect',
                  'Medium',
                  'Accelerating since proof assistants',
                ],
                [
                  'Games (Chess, Go)',
                  'ms',
                  'Free',
                  '100%',
                  'Perfect',
                  'Low',
                  'Solved or superhuman AI',
                ],
                [
                  'Competitive Programming',
                  'sec',
                  'Free',
                  '~100%',
                  'High',
                  'Low',
                  'Standard benchmark; clear metrics',
                ],
                [
                  'ML Benchmarks',
                  'sec-min',
                  'Low',
                  'Varies',
                  'Medium',
                  'Medium',
                  'Saturation, contamination, gaming',
                ],
                [
                  'Unit Tests',
                  'sec-min',
                  'Low',
                  'Partial',
                  'High',
                  'Low',
                  'Industry standard; coverage debates',
                ],
                [
                  'Simulations (DFT, MD)',
                  'hours',
                  'Medium',
                  '~90-95%',
                  'High',
                  'High',
                  'Enabling materials discovery',
                ],
                [
                  'ML Experiments',
                  'hours-days',
                  'High',
                  '~60-80%',
                  'Low',
                  'High',
                  'Reproducibility crisis',
                ],
                [
                  'Computational Biology',
                  'hours-days',
                  'Medium',
                  '~80%',
                  'Medium',
                  'High',
                  'Improving with better tools',
                ],
                [
                  'Wet Lab Biology',
                  'weeks-months',
                  'Very High',
                  '~70%',
                  'Low',
                  'Very High',
                  'Slow but accelerating',
                ],
                [
                  'Physics Experiments',
                  'months-years',
                  'Extreme',
                  '~95%',
                  'High',
                  'Extreme',
                  'Gold standard but slow',
                ],
                [
                  'Clinical Trials',
                  'years',
                  'Millions',
                  '~80%',
                  'Low',
                  'Extreme',
                  'p-hacking; publication bias',
                ],
                [
                  'Social Science',
                  'years',
                  'Varies',
                  '~50%',
                  'Low',
                  'High',
                  'Replication crisis ongoing',
                ],
                [
                  'Economics',
                  'years-decades',
                  'Varies',
                  '~40%',
                  'Very Low',
                  'High',
                  'Ideological fragmentation',
                ],
                [
                  'Creative/Subjective',
                  'N/A',
                  'N/A',
                  'Undefined',
                  'N/A',
                  'N/A',
                  'No ground truth exists',
                ],
              ]}
            />

            <Figure
              src="/articles/verifiability/spectrum.png"
              alt="The verifiability spectrum from high (code, math) to low (social science, creative)"
              caption="The verifiability spectrum across domains"
            />

            <InsightBox title="Historical Parallels">
              <p>
                The verifiability of a field predicts its rate of progress and
                degree of consensus.
              </p>
              <UnorderedList>
                <li>
                  <strong>Physics</strong>: Easy to verify (reproducible
                  experiments, mathematical predictions). Result: rapid
                  progress, high consensus. Newton to Einstein to quantum
                  mechanics in 250 years.
                </li>
                <li>
                  <strong>Medicine</strong>: Hard to verify (RCTs expensive,
                  long timelines). Result: slower, more careful progress. Many
                  treatments used for decades before being proven ineffective.
                </li>
                <li>
                  <strong>Economics</strong>: Very hard to verify (cannot run
                  controlled experiments on economies). Result: ideological
                  fragmentation, persistent disagreement on basic questions.
                </li>
                <li>
                  <strong>Psychology</strong>: Moderate difficulty (can run
                  experiments but replication is hard). Result: replication
                  crisis revealed many foundational findings were false.
                </li>
              </UnorderedList>
              <p className="mt-4">
                AI research is currently between ML Experiments and Benchmarks.
                We can verify benchmark performance easily. But verifying that
                benchmark performance means anything is harder.
              </p>
            </InsightBox>
          </ArticleSection>

          {/* Section 4: Parts of AI Research */}
          <TOCHeading id="ai-research-claims" level={2}>
            Verifiability of AI Research Claims
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                AI research involves many types of claims. Each has different
                verifiability characteristics. Understanding this helps you
                choose what to work on and how to structure experiments.
              </p>
              <p>
                A paper might contain multiple claims with different
                verifiability levels. &quot;Our method achieves state of the art
                on benchmark X&quot; is highly verifiable. &quot;Our method
                represents a step toward AGI&quot; is not verifiable at all.
                Strong papers have strongly verifiable core claims.
              </p>
            </Prose>

            <TOCHeading id="claims-performance" level={3}>
              Performance Claims
            </TOCHeading>
            <ComparisonTable
              headers={[
                'Claim Type',
                'Example',
                'Speed',
                'Certainty',
                'Complexity',
                'Falsifiability',
              ]}
              rows={[
                [
                  'Benchmark SOTA',
                  '"We achieve 95.2% on MMLU"',
                  'Minutes',
                  'High',
                  'Low',
                  'High',
                ],
                [
                  'Efficiency gain',
                  '"2x faster inference"',
                  'Minutes',
                  'High',
                  'Medium',
                  'High',
                ],
                [
                  'Scaling behavior',
                  '"Loss scales as N^(-0.5)"',
                  'Days-weeks',
                  'Medium',
                  'High',
                  'High',
                ],
                [
                  'Transfer performance',
                  '"Pretrained model improves downstream"',
                  'Hours',
                  'Medium',
                  'Medium',
                  'Medium',
                ],
                [
                  'Robustness claim',
                  '"Works across distributions"',
                  'Hours',
                  'Low',
                  'High',
                  'Medium',
                ],
                [
                  'Real-world deployment',
                  '"Works in production"',
                  'Weeks-months',
                  'Low',
                  'Very High',
                  'Low',
                ],
              ]}
            />

            <Prose>
              <p>
                Benchmark claims are easy to verify but may not mean much.
                Real-world deployment claims are meaningful but hard to verify.
                The gap between benchmark and deployment is where many AI
                projects fail.
              </p>
            </Prose>

            <TOCHeading id="claims-method" level={3}>
              Method Claims
            </TOCHeading>
            <ComparisonTable
              headers={[
                'Claim Type',
                'Example',
                'Speed',
                'Certainty',
                'Complexity',
                'Falsifiability',
              ]}
              rows={[
                [
                  'Algorithmic correctness',
                  '"Our optimizer converges"',
                  'Hours',
                  'High',
                  'Low',
                  'High',
                ],
                [
                  'Component contribution',
                  '"Attention helps more than FFN"',
                  'Hours',
                  'Medium',
                  'Medium',
                  'High',
                ],
                [
                  'Ablation result',
                  '"Removing X hurts by Y%"',
                  'Hours',
                  'High',
                  'Medium',
                  'High',
                ],
                [
                  'Hyperparameter sensitivity',
                  '"Robust to learning rate"',
                  'Days',
                  'Medium',
                  'High',
                  'Medium',
                ],
                [
                  'Generality claim',
                  '"Works for any architecture"',
                  'Weeks',
                  'Low',
                  'Very High',
                  'Low',
                ],
                [
                  'Necessity claim',
                  '"X is required for Y"',
                  'Varies',
                  'Low',
                  'High',
                  'Medium',
                ],
              ]}
            />

            <Prose>
              <p>
                Ablation studies are the workhorses of method verification. They
                directly test whether each component contributes. &quot;Our
                method works&quot; is weak. &quot;Removing component A drops
                performance by 15% while removing component B has no
                effect&quot; is strong.
              </p>
            </Prose>

            <TOCHeading id="claims-mechanistic" level={3}>
              Mechanistic Claims
            </TOCHeading>
            <ComparisonTable
              headers={[
                'Claim Type',
                'Example',
                'Speed',
                'Certainty',
                'Complexity',
                'Falsifiability',
              ]}
              rows={[
                [
                  'Feature existence',
                  '"There is a Golden Gate feature"',
                  'Hours',
                  'High',
                  'High',
                  'High',
                ],
                [
                  'Circuit identification',
                  '"This circuit does induction"',
                  'Days',
                  'Medium',
                  'Very High',
                  'Medium',
                ],
                [
                  'Causal claim',
                  '"Feature X causes behavior Y"',
                  'Hours',
                  'Medium',
                  'High',
                  'High',
                ],
                [
                  'Completeness claim',
                  '"We found all important features"',
                  'Weeks',
                  'Low',
                  'Very High',
                  'Low',
                ],
                [
                  'Universality claim',
                  '"All models have this structure"',
                  'Months',
                  'Low',
                  'Extreme',
                  'Medium',
                ],
              ]}
            />

            <Prose>
              <p>
                Mechanistic interpretability claims range from highly verifiable
                (existence proofs) to nearly unverifiable (completeness claims).
                Causal intervention is the gold standard. If you can activate a
                feature and observe the predicted behavior change, you have
                strong evidence.
              </p>
            </Prose>

            <TOCHeading id="claims-emergent" level={3}>
              Emergent Behavior Claims
            </TOCHeading>
            <ComparisonTable
              headers={[
                'Claim Type',
                'Example',
                'Speed',
                'Certainty',
                'Complexity',
                'Falsifiability',
              ]}
              rows={[
                [
                  'Capability emergence',
                  '"Chain-of-thought emerges at scale"',
                  'Weeks',
                  'Medium',
                  'Very High',
                  'Medium',
                ],
                [
                  'Phase transition',
                  '"Grokking occurs after N steps"',
                  'Hours-days',
                  'Medium',
                  'High',
                  'High',
                ],
                [
                  'In-context learning',
                  '"Model learns new tasks in context"',
                  'Minutes',
                  'High',
                  'Medium',
                  'High',
                ],
                [
                  'Reasoning ability',
                  '"Model can reason about X"',
                  'Hours',
                  'Low',
                  'High',
                  'Low',
                ],
                [
                  'Understanding claim',
                  '"Model understands language"',
                  'N/A',
                  'Undefined',
                  'Extreme',
                  'Very Low',
                ],
              ]}
            />

            <Prose>
              <p>
                Emergence claims are tricky. The behavior is observable but the
                explanation is often contested. &quot;The model can do X&quot;
                is verifiable. &quot;The model understands X&quot; is not. Stick
                to behavioral claims when possible.
              </p>
            </Prose>

            <TOCHeading id="claims-safety" level={3}>
              Safety and Alignment Claims
            </TOCHeading>
            <ComparisonTable
              headers={[
                'Claim Type',
                'Example',
                'Speed',
                'Certainty',
                'Complexity',
                'Falsifiability',
              ]}
              rows={[
                [
                  'Refusal behavior',
                  '"Model refuses harmful requests"',
                  'Hours',
                  'Medium',
                  'Medium',
                  'High',
                ],
                [
                  'Jailbreak resistance',
                  '"Robust to adversarial prompts"',
                  'Days',
                  'Low',
                  'High',
                  'Medium',
                ],
                [
                  'Honesty claim',
                  '"Model does not deceive"',
                  'Weeks',
                  'Low',
                  'Very High',
                  'Low',
                ],
                [
                  'Alignment claim',
                  '"Model is aligned with human values"',
                  'N/A',
                  'Very Low',
                  'Extreme',
                  'Very Low',
                ],
                [
                  'Corrigibility',
                  '"Model allows correction"',
                  'Hours',
                  'Low',
                  'High',
                  'Medium',
                ],
                [
                  'No deceptive alignment',
                  '"Model is not faking alignment"',
                  'N/A',
                  'Very Low',
                  'Extreme',
                  'Very Low',
                ],
              ]}
            />

            <Prose>
              <p>
                Safety claims sit at the hard end of the spectrum. We can verify
                specific behaviors (refusal, factuality on benchmarks) but
                struggle to verify general properties (alignment, honesty). This
                is a fundamental challenge for AI safety research.
              </p>
              <p>
                The most verifiable safety work focuses on narrow behavioral
                claims with clear evaluation protocols. The least verifiable
                makes broad claims about model properties.
              </p>
            </Prose>

            <TOCHeading id="claims-parts" level={3}>
              Parts of an ML Experiment
            </TOCHeading>
            <Prose>
              <p>
                A single ML experiment has multiple parts, each with different
                verifiability:
              </p>
            </Prose>
            <ComparisonTable
              headers={[
                'Experiment Part',
                'What You Verify',
                'Speed',
                'Certainty',
                'Common Failures',
              ]}
              rows={[
                [
                  'Data pipeline',
                  'Data loaded correctly',
                  'Minutes',
                  'High',
                  'Silent corruption, leakage',
                ],
                [
                  'Model architecture',
                  'Correct shapes, connections',
                  'Minutes',
                  'High',
                  'Off-by-one, wrong activation',
                ],
                [
                  'Training loop',
                  'Loss decreases, no NaN',
                  'Hours',
                  'High',
                  'Gradient issues, wrong loss',
                ],
                [
                  'Hyperparameters',
                  'Not overfit to eval set',
                  'Days',
                  'Medium',
                  'Overfitting to validation',
                ],
                [
                  'Evaluation protocol',
                  'Measures what you think',
                  'Hours',
                  'Medium',
                  'Metric gaming, wrong split',
                ],
                [
                  'Baseline comparison',
                  'Fair comparison',
                  'Days',
                  'Low',
                  'Weak baselines, unfair tuning',
                ],
                [
                  'Statistical significance',
                  'Not just noise',
                  'Days',
                  'Medium',
                  'Too few seeds, wrong test',
                ],
                [
                  'Causal attribution',
                  'X caused improvement, not Y',
                  'Weeks',
                  'Low',
                  'Confounding, wrong ablation',
                ],
              ]}
            />

            <Prose>
              <p>
                Early parts of the pipeline are more verifiable. Later parts
                require more judgment. The best practice is to verify early
                parts thoroughly so you can focus attention on the harder later
                parts.
              </p>
            </Prose>
          </ArticleSection>

          {/* Section 5: Making Things More Verifiable */}
          <TOCHeading id="how-to-verify" level={2}>
            How to Make AI Research More Verifiable
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Verifiability is not fixed. You can make your research more
                verifiable through deliberate practice. This increases the
                credibility of your claims and the speed of your iteration.
              </p>
            </Prose>

            <TOCHeading id="verify-formal" level={3}>
              Formalize What You Can
            </TOCHeading>
            <Prose>
              <p>
                <strong>Do math in Lean.</strong> If you have theoretical
                claims, formalize them in a proof assistant. This eliminates an
                entire class of errors. No hand-waving. No subtle mistakes in
                derivations. Either the proof checks or it does not.
              </p>
              <p>
                This is hard. Most ML researchers do not know Lean. The tooling
                is immature. But the payoff is high. A Lean proof is machine-
                verified forever. A paper proof might have errors discovered
                years later.
              </p>
              <p>
                Start small. Formalize one lemma. Then another. Build intuition
                for what can be formalized. Even partial formalization is
                valuable.
              </p>
            </Prose>

            <TOCHeading id="verify-environment" level={3}>
              Lock Your Environment
            </TOCHeading>
            <Prose>
              <p>
                <strong>Exact reproducibility requires exact environments.</strong>{' '}
                Use Docker or Nix. Pin all dependencies to specific versions.
                Hash your environment and include the hash in your paper.
              </p>
              <p>
                Record everything:
              </p>
            </Prose>
            <UnorderedList>
              <li>Python version, library versions, CUDA version</li>
              <li>Hardware specifications (GPU model, memory)</li>
              <li>Random seeds for all sources of randomness</li>
              <li>Exact command lines used</li>
              <li>Git commit hashes for all code</li>
            </UnorderedList>
            <Prose>
              <p>
                Ideally, anyone should be able to run one command and reproduce
                your exact results. In practice, this is hard. But getting
                closer to this ideal makes your work more verifiable.
              </p>
            </Prose>

            <TOCHeading id="verify-preregister" level={3}>
              Pre-register Hypotheses
            </TOCHeading>
            <Prose>
              <p>
                <strong>Commit to hypotheses before running experiments.</strong>{' '}
                Write down what you expect to find. Specify what result would
                confirm and what would disconfirm your hypothesis.
              </p>
              <p>
                This prevents HARKing (Hypothesizing After Results Known). It is
                easy to find patterns in any dataset. It is hard to predict
                patterns before seeing the data. Pre-registration forces honest
                hypothesis testing.
              </p>
              <p>
                Pre-registration does not prevent exploratory research. You can
                still explore. But you should clearly distinguish pre-registered
                confirmatory analysis from post-hoc exploratory analysis.
              </p>
            </Prose>

            <TOCHeading id="verify-seeds" level={3}>
              Run Multiple Seeds and Report Variance
            </TOCHeading>
            <Prose>
              <p>
                <strong>One run is not enough.</strong> Random initialization
                matters. Data ordering matters. Dropout masks matter. A result
                that holds across one seed might not hold across ten.
              </p>
              <p>
                Report mean and standard deviation across at least 3-5 seeds.
                More is better. If your result does not hold across seeds, it is
                probably noise.
              </p>
              <p>
                Use appropriate statistical tests. Do not just eyeball whether
                means are different. Compute confidence intervals. Report effect
                sizes. p &lt; 0.05 is not a magic threshold. Results at p &lt;
                0.001 replicate far more often.
              </p>
            </Prose>

            <TOCHeading id="verify-baselines" level={3}>
              Strengthen Your Baselines
            </TOCHeading>
            <Prose>
              <p>
                <strong>Beat strong baselines, not weak ones.</strong> There is
                a natural temptation to use weak baselines. They make your
                method look better. Resist this.
              </p>
              <p>
                Put real effort into tuning baselines. Use the same
                hyperparameter budget for baselines as for your method. Report
                results from papers that specialize in those baselines, not just
                your own implementations.
              </p>
              <p>
                A 2% improvement over a properly tuned baseline is worth more
                than a 20% improvement over a poorly tuned one.
              </p>
            </Prose>

            <TOCHeading id="verify-ablations" level={3}>
              Design Informative Ablations
            </TOCHeading>
            <Prose>
              <p>
                <strong>Ablations should distinguish between hypotheses.</strong>{' '}
                Do not just show that removing components hurts. Show which
                components matter and why.
              </p>
              <p>
                Think like a scientist. What are the competing explanations for
                your result? Design ablations that would give different results
                under different explanations. The goal is Bayesian evidence, not
                just positive results.
              </p>
              <p>
                Report negative results. If you tried something and it did not
                work, say so. This helps others avoid dead ends.
              </p>
            </Prose>

            <TOCHeading id="verify-process" level={3}>
              Add Process Verification
            </TOCHeading>
            <Prose>
              <p>
                <strong>Verify intermediate steps, not just final outcomes.</strong>{' '}
                Check that your data pipeline produces expected outputs. Check
                that gradients flow where you expect. Check that activations are
                in reasonable ranges.
              </p>
              <p>
                Add assertions and sanity checks throughout your code. Log
                intermediate values. Visualize training dynamics. The earlier
                you catch a problem, the less time you waste.
              </p>
              <p>
                Unit tests for ML code are underused. Test that your model can
                overfit a small batch. Test that outputs have expected shapes.
                Test edge cases in your data processing.
              </p>
            </Prose>

            <TOCHeading id="verify-redteam" level={3}>
              Red Team Your Own Work
            </TOCHeading>
            <Prose>
              <p>
                <strong>Try to break your results before publishing.</strong>{' '}
                Assume you made a mistake. Where is it? Assume there is a flaw
                in your evidence. What is it?
              </p>
              <p>
                Get others to red team too. Fresh eyes catch things you miss.
                Experienced researchers have seen failure modes you have not.
              </p>
              <p>
                When readers find flaws you did not address, your paper loses
                credibility. When readers find flaws you did address, your paper
                gains credibility.
              </p>
            </Prose>

            <Aside title="Goodhart&apos;s Law in Verification">
              <p>
                &quot;When a measure becomes a target, it ceases to be a good
                measure.&quot;
              </p>
              <p className="mt-2">
                This applies to all verification. Benchmarks get gamed.
                Metrics get optimized at the expense of what they measure. Test
                suites become the target rather than code quality.
              </p>
              <p className="mt-2">
                The solution is not to avoid measurement. It is to:
              </p>
              <UnorderedList>
                <li>Use multiple diverse metrics</li>
                <li>Rotate benchmarks to prevent overfitting</li>
                <li>Distinguish between optimizing for a metric and reporting it</li>
                <li>Be suspicious of results that improve metrics without improving the underlying thing</li>
              </UnorderedList>
              <p className="mt-2">
                If your method achieves SOTA on a benchmark but fails simple
                sanity checks, the benchmark is wrong, not your sanity checks.
              </p>
            </Aside>

            <TOCHeading id="verify-triangulate" level={3}>
              Triangulate with Multiple Methods
            </TOCHeading>
            <Prose>
              <p>
                <strong>Different verification methods catch different errors.</strong>{' '}
                If you verify a claim with three independent methods and all
                agree, you have much stronger evidence than one method repeated
                three times.
              </p>
              <p>
                For interpretability claims: probe classifiers, causal
                interventions, and ablations might all support the same
                conclusion. Each has different failure modes. Agreement across
                methods is strong evidence.
              </p>
              <p>
                For performance claims: different benchmarks, different
                evaluation protocols, different datasets. If your method only
                works on one benchmark, be suspicious.
              </p>
            </Prose>

            <TOCHeading id="verify-publish-code" level={3}>
              Publish Code, Data, and Logs
            </TOCHeading>
            <Prose>
              <p>
                <strong>Transparency enables verification.</strong> Release your
                code. Release your data when possible. Release your training
                logs and checkpoints.
              </p>
              <p>
                Make it easy to run. Write a clear README. Provide a Docker
                container or Colab notebook. The harder it is to reproduce your
                work, the fewer people will try, and the less verified your
                claims remain.
              </p>
              <p>
                This also helps you. Public code gets scrutinized. Bugs get
                found. Improvements get suggested. The community helps verify
                your work.
              </p>
            </Prose>
          </ArticleSection>

          {/* Section 6: The Verification Market */}
          <TOCHeading id="verification-market" level={2}>
            The Verification Market
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Verification is not free. Someone has to do it. Someone has to
                pay for it. The structure of who verifies and who pays shapes
                what gets verified and how.
              </p>
            </Prose>

            <TOCHeading id="market-academics" level={3}>
              Academic Benchmarks
            </TOCHeading>
            <Prose>
              <p>
                Academics create benchmarks for recognition and career
                advancement. A benchmark paper that becomes widely used
                generates citations and influence. This creates good incentives
                to create useful benchmarks.
              </p>
              <p>
                But there are problems. Benchmark creation is not as rewarded as
                benchmark beating. Maintaining and updating benchmarks is
                thankless. Once a benchmark saturates, there is no incentive to
                retire it.
              </p>
              <p>
                The result is benchmark accumulation. Old benchmarks persist
                even when they no longer measure anything useful. New benchmarks
                get created but the old ones do not go away. The community ends
                up with dozens of benchmarks, unclear about which matter.
              </p>
            </Prose>

            <TOCHeading id="market-companies" level={3}>
              Company Evaluations
            </TOCHeading>
            <Prose>
              <p>
                AI companies have internal evaluation suites. These are often
                more relevant than academic benchmarks because they measure
                production use cases. But they are proprietary.
              </p>
              <p>
                This creates an information asymmetry. Companies know how their
                models perform on realistic tasks. The public only sees academic
                benchmarks. Marketing emphasizes favorable comparisons.
              </p>
              <p>
                Some companies release evaluations (HELM, Holistic Evaluation of
                Language Models). This is valuable but incomplete. Companies
                have no incentive to release evaluations where they perform
                poorly.
              </p>
            </Prose>

            <TOCHeading id="market-rlvr" level={3}>
              RLVR Data Providers
            </TOCHeading>
            <Prose>
              <p>
                Reinforcement Learning from Verifiable Rewards requires
                verifiable tasks. Companies are building datasets of verifiable
                tasks: code problems, math problems, logic puzzles.
              </p>
              <p>
                The incentive is straightforward. Verifiable training data is
                valuable. Hyperscalers buy it. Companies like Scale AI provide
                it. The quality of the verifier determines the quality of the
                training signal.
              </p>
              <p>
                This market is growing. As RLVR becomes more important,
                verifiable data becomes more valuable. Expect more investment in
                creating verifiers for currently unverifiable domains.
              </p>
            </Prose>

            <TOCHeading id="market-data-types" level={3}>
              Types of Valuable Verification Data
            </TOCHeading>
            <ComparisonTable
              headers={['Data Type', 'Verifier', 'Value Driver', 'Providers']}
              rows={[
                [
                  'Code + tests',
                  'Test execution',
                  'Correctness signal for code models',
                  'GitHub, coding platforms',
                ],
                [
                  'Math + proofs',
                  'Proof assistants',
                  'Formal reasoning signal',
                  'Lean community, competition math',
                ],
                [
                  'Science + simulations',
                  'Domain-specific simulators',
                  'Scientific reasoning signal',
                  'Research labs, compute providers',
                ],
                [
                  'Games + outcomes',
                  'Game rules',
                  'Strategic reasoning signal',
                  'Game companies, RL researchers',
                ],
                [
                  'Human preferences',
                  'Human annotation',
                  'Alignment signal',
                  'Annotation companies, crowdwork',
                ],
                [
                  'Safety red-teaming',
                  'Human + automated evaluation',
                  'Safety signal',
                  'Safety teams, external auditors',
                ],
              ]}
            />

            <Prose>
              <p>
                The highest value data is both verifiable and relevant to
                important tasks. Code with tests is highly verifiable and highly
                relevant. Human preferences are highly relevant but weakly
                verifiable. The intersection of verifiable and relevant is
                where the most valuable training data lives.
              </p>
            </Prose>

            <TOCHeading id="market-third-party" level={3}>
              Third-Party Verification
            </TOCHeading>
            <Prose>
              <p>
                As AI capabilities grow, third-party verification becomes more
                important. Regulatory requirements, safety standards, and public
                trust all depend on independent verification.
              </p>
              <p>
                This creates demand for verification infrastructure: standard
                benchmarks, auditing protocols, certification processes. The
                verification market will likely grow substantially as AI becomes
                more consequential.
              </p>
              <p>
                But third-party verification has its own challenges.
                Verifiers can be captured. Standards can become performative.
                Certification can create false confidence. The meta-verification
                problem applies here too.
              </p>
            </Prose>
          </ArticleSection>

          {/* Section 7: The Meta-Bottleneck */}
          <TOCHeading id="meta-bottleneck" level={2}>
            The Verifiability Bottleneck
          </TOCHeading>
          <ArticleSection>
            <Prose>
              <p>
                Verifiability is the meta-bottleneck of AI research. It
                constrains everything else.
              </p>
              <p>
                Want to train on scientific reasoning? Need to verify scientific
                claims. Want to align models with human values? Need to verify
                alignment. Want to trust AI systems with important decisions?
                Need to verify they make good decisions.
              </p>
              <p>
                Progress in AI capabilities has outpaced progress in
                verification. We can build systems that generate plausible
                scientific hypotheses, but we cannot verify them quickly enough
                to train on them. We can build systems that seem aligned, but we
                cannot verify they are not deceiving us.
              </p>
              <p>
                The highest leverage work in AI may be work that expands
                verification. New verifiable domains enable new training
                regimes. Better verifiers enable better models. Faster
                verification enables faster iteration.
              </p>
            </Prose>

            <InsightBox title="Before You Start a Project">
              <p>
                Ask: &quot;How will I know if this worked?&quot;
              </p>
              <p className="mt-2">
                If the answer is vague, you are in a low-verifiability regime.
                This does not mean you should not do the project. But it means
                you should expect slower progress and more contested results.
              </p>
              <p className="mt-2">
                Consider:
              </p>
              <UnorderedList>
                <li>Can I find or build a better verifier?</li>
                <li>Can I reformulate the problem into a more verifiable form?</li>
                <li>Can I start with a verifiable subproblem?</li>
                <li>Am I prepared for the uncertainty inherent in low-verifiability research?</li>
              </UnorderedList>
            </InsightBox>

            <Prose>
              <p>
                The domains where AI will have the most impact in the next few
                years are predictable. Look at the verifiability spectrum. Code,
                math, games, simulations. These are where AI is advancing
                fastest because these are where verification is fastest.
              </p>
              <p>
                The domains where AI will struggle are also predictable. Safety
                claims, alignment, real-world deployment, long-horizon effects.
                These are where verification is slow, uncertain, and expensive.
              </p>
              <p>
                If you want to accelerate AI, work on verification. Make new
                domains verifiable. Make verification faster, cheaper, more
                certain. The speed of AI progress is bounded by the speed of
                verification.
              </p>
            </Prose>

            <Figure
              src="/articles/verifiability/meta-bottleneck.png"
              alt="Verifiability as the bottleneck constraining AI capabilities"
              caption="Verifiability is the meta-bottleneck"
            />
          </ArticleSection>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <MutedText>
              This article draws from the{' '}
              <a href="/research-tastes">5 Research Tastes</a> essay which
              frames verifiability as one of five key bottlenecks for AI
              progress. If you have thoughts or corrections, reach out on{' '}
              <a
                href="https://twitter.com/silennai"
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
