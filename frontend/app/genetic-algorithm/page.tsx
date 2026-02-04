'use client';

import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';
import {
  TOCProvider,
  TOCHeading,
  TableOfContentsBlock,
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
  Code,
  CodeBlock,
} from '@/components/article/Callouts';
import { Math, FormulaBox } from '@/components/article/Math';
import { CodePanel } from '@/components/article/CodePanel';

// GitHub repo base URL for commit links
const GITHUB_REPO = 'https://github.com/SilenNaihin/genetic-algorithm'; // [TO VERIFY: repo URL]
const commit = (hash: string) => `${GITHUB_REPO}/commit/${hash}`;

export default function GeneticAlgorithmArticle() {
  return (
    <TOCProvider>
      <StickyHeader title="I spent 2 weeks playing god using genetic algorithms. Here are my learnings." />

      <div className="pt-14">
        <ArticleLayout className="bg-white">
          {/* ============================================ */}
          {/* TITLE & HOOK */}
          {/* ============================================ */}
          <h1 className="text-4xl font-bold mb-4 text-black leading-tight">
            I spent 2 weeks playing god using genetic algorithms. Here are my learnings.
          </h1>

          <p className="text-lg text-neutral-600 mb-8">
            I spent two weeks building an evolution simulator where my
            creatures learned to &quot;walk&quot; toward food. I ran millions of generations across 597 genetic lineages to create the optimal species. This is a journal of that
            process: implementing the papers, fixing bugs, counterintuitive walls I ran into, and working with Claude Code.
          </p>
          <TableOfContentsBlock columns={3} />

          <Figure
            src="/articles/genetic-algorithm/best-creature.gif"
            alt="Evolved creature collecting pellets"
            caption="The end result. The best creature at this generation seems to have evolved a pouncing mechanic with it's 'grabbing arm'."
          />

          <ArticleSection>
            <Prose>
              <p>
                There was a video I saw{" "}
                <a
                  href="https://www.youtube.com/watch?v=LMQoLtBJcl8&list=PLrUdxfaFpuuK0rj55Rhc187Tn9vvxck7t&index=17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                   9 years ago on YouTube from Carkh
                </a>{' '}
                from showing simple creatures evolving to
                pick up pellets. For the longest time I&apos;ve wanted to create my own version but it was never a priority. 
              </p>
              <p>
                Until I nerd sniped myself. While writing my{' '}&quot;
                <a
                  href="https://blog.silennai.com/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  I was a top 0.01% Cursor user. Here&apos;s why I switched to Claude Code 2.0
                </a>
                &quot; article I wanted to show off what Claude Code could do and thought this was one of the coolest things I could one shot, grab a gif, and move on.
              </p>

              <p>281 commits later, with the computational application of Darwin's consecrated knowledge running through my cortical connections, I have a working evolution simulator. </p>
              <p>
                I used Claude Code to help me build this. I'll be honest about where that
                helped and where it didn't. 
                </p>
              
              <p>
                All code is at{' '}
                <a
                  href="https://github.com/SilenNaihin/genetic-algorithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  github.com/SilenNaihin/genetic-algorithm
                </a>
                .
              </p>
            </Prose>
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: OUR CREATURES */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="our-creatures"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              Our creatures
            </TOCHeading>

            <Prose>
            <p>Evolution was able to create the most complex collections of matter in the universe (ourselves).</p>
              <p>Nature doesn't have access to backpropagation or even local learning rules as in the brain. It has to use population level rules that comply with the laws of physics.</p>
              <p>Genetic algorithms simulate this Darwinian process: measure how well a organism does in an environment, murder them in cold blood if they aren't performing well, and the rest reproduce with a chance of mutation. Repeat. </p>
              <p>
                Our creatures are made of nodes (spheres) connected by muscles
                (springs).
              </p>
              <Figure
              src="/articles/genetic-algorithm/creature-setup.png"
              alt="A single creature"
            />
              <p>Nodes have friction and size:</p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/node-properties.png"
              alt="Node properties panel"
            />

            <Prose>
              <p>
                Muscles have a rest length (natural length), stiffness (how hard
                it pulls), and damping (how quickly it settles):
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/muscle-basic.png"
              alt="Basic muscle properties"
              caption="Muscle configuration: rest length, stiffness, and damping"
            />

            <Prose>
              <p>
                The muscle pulls toward its rest length using Hooke's law with
                damping:
              </p>
            </Prose>

            <FormulaBox label="Spring Force (Hooke's Law + Damping)">
              {`\\vec{F} = -k(|\\vec{\\Delta x}| - L_0)\\hat{d} - c(\\vec{v}_{rel} \\cdot \\hat{d})\\hat{d}`}
            </FormulaBox>

            <Prose>
              <p>
                Where <Math>{`k`}</Math> is stiffness, <Math>{`c`}</Math> is
                damping, <Math>{`L_0`}</Math> is rest length,{' '}
                <Math>{`\\vec{{\\Delta x}}`}</Math> is the current length, and{' '}
                <Math>{`\\hat{{d}}`}</Math> is the direction between nodes.
              </p>
              <p>
                Super simple right? Well unfortunately the constraints of reality aren't baked into a physics sim by default. To give you a taste:
              </p>
            </Prose>

            <UnorderedList>
              <li>
                Muscles could initially contract to zero length or extend infinitely. That's not how muscles work. I had to clamp contraction
                to a percentage of rest length. 
              </li>
              <li>
                My damping was initially too low and as a result muscles would oscillate wildly and fail to settle whenever the creature touched the
                ground. Even without any locomotion mechanisms (without any muscles contracting). Increased damping from 0.5 to
                3.0 (
                <a
                  href={commit('b043a97')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  b043a97
                </a>
                ).
              </li>
            </UnorderedList>
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: FITNESS FUNCTION */}
          {/* ============================================ */}
          <ArticleSection
            rightContent={
              <Figure
                src="/articles/genetic-algorithm/fitness-config.png"
                alt="Fitness configuration panel"
                caption="Fitness configuration in the UI"
              />
            }
          >
            <TOCHeading
              id="fitness"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              The fitness function
            </TOCHeading>

            <Prose>
              <p>
                This is how we calculate how well a creature performed. The fitness function defines what "good" means.
              </p>
            </Prose>

            <FormulaBox label="Fitness">
              {`F = 100 \\cdot P_{collected} + P_{progress} + D_{travel} - E_{cost} - R_{penalty}`}
            </FormulaBox>

            <Prose>
              <p>
                Alright, 
                <Code>Claude please look at my codebase and make a list of the different components of the fitness function we ended up with. Make no mistakes.</Code> (it made mistakes and it would have been quicker for me to write this out):
              </p>
            </Prose>
            <OrderedList>
              <li>
                <strong>Pellet collection</strong>: 100 points per pellet. When
                you collect, your progress converts to collection points (not
                added on top).
              </li>
              <li>
                <strong>Progress toward current pellet</strong>: 0-80 points
                based on how much closer you got. Measured from the{' '}
                <em>edge</em> of the creature, not the center.
              </li>
              <li>
                <strong>Distance traveled</strong>: 0-20 points, capped. Ground
                distance in the XY plane only (not vertical movement).
              </li>
              <li>
                <strong>Efficiency penalty</strong>: Penalizes excessive muscle
                activation (encourages efficient movement).
              </li>
              <li>
                <strong>Regression penalty</strong>: Penalizes moving away from
                the pellet (only after first collection).
              </li>
            </OrderedList>

            <Prose>
              <p>
                Getting the fitness function right was 10x more difficult than getting Claude to understand the nuance of our current fitness function.
              </p>
            </Prose>

            <InsightBox title="Progress banking bug">
              <p>
                When a creature collected a pellet, their fitness would{' '}
                 drop to 20 instead of keeping the 100 points. Progress was being reset to 0, and a pellet was just adding 20.
              </p>
              <p className="mt-2">
                "Claude pls what was not clear we want to bank progress at 100 points when we collect a pellet" (
                <a
                  href={commit('0f7f946')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  0f7f946
                </a>
                ).
              </p>
            </InsightBox>

            <InsightBox title="Progress baseline position">
              <p>
                Progress was being calculated from where the creature spawned,
                not from where it was when it picked up the last pellet. "Claude pls
                reset the baseline position after each collection"
              </p>
            </InsightBox>

            <InsightBox title="Center vs edge calculation">
              <p>
                I was measuring distance from creature center to pellet center.
                But creatures have different sizes. A large creature could
                "reach" a pellet while its center was still far away. Had to
                calculate from the edge of the creature instead.
              </p>
              <p className="mt-2">
                The edge calculation itself was tricky: I needed a stable
                radius from the genome (rest state), not the current physics
                state. Otherwise the radius oscillates with muscle animation
                and fitness swings wildly (
                <a
                  href={commit('3bde5ec')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  3bde5ec
                </a>
                ).
              </p>
            </InsightBox>

            <InsightBox title="Uncapped distance reward">
              <p>
                I added the 20 points bonus for distance traveled to give the creature a gradient to maximize while it hasn't learned to move in a direction yet.
              </p>
              <p className="mt-2">Claude decided to interpret this as making the reward absolute to "encourage more movement". Below is the result for the kind of creatures we evolved. Sad to think so many locomotive creatures were exterminated because their environment was so hostile.</p>
            </InsightBox>

            <Figure
              src="/articles/genetic-algorithm/distance-uncapped.gif"
              alt="Creature moving erratically with uncapped distance"
            />
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: ATTEMPT 1 - BRAINLESS OSCILLATION */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="attempt-1"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              Part 1: Brainless oscillation
            </TOCHeading>

            <Prose>
              <p>
                For my first attempt to get the creatures to optimize towards this fitness function was to give the muscles evolvable oscillation
                parameters: amplitude (range of contraction), frequency
                (oscillation speed), and phase offset (timing in the cycle).
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/muscle-properties.png"
              alt="Muscle oscillation properties"
            />

            <Prose>
              <p>
                Instead of pulling toward a fixed rest length, muscles now pull
                toward an oscillating target:
              </p>
            </Prose>

            <FormulaBox label="Target Length">
              {`L(t) = L_0 \\cdot \\left(1 - A \\cdot \\sin(2\\pi f t + \\phi)\\right)`}
            </FormulaBox>

            <Prose>
              <p>
                Where <Math>{`A`}</Math> is amplitude, <Math>{`f`}</Math> is
                frequency, and <Math>{`\\phi`}</Math> is phase offset. The
                spring force now pulls toward <Math>{`L(t)`}</Math> instead of{' '}
                <Math>{`L_0`}</Math>:
              </p>
            </Prose>

            <FormulaBox label="Spring Force with Oscillation">
              {`\\vec{F} = -k(|\\vec{\\Delta x}| - L(t))\\hat{d} - c(\\vec{v}_{rel} \\cdot \\hat{d})\\hat{d}`}
            </FormulaBox>

            <Figure
              src="/articles/genetic-algorithm/oscillating-creature.gif"
              alt="Creature with oscillating muscles"
              caption="Node color = friction (cyan = slippery, orange = grippy). Muscle thickness = stiffness. Muscle color = frequency (blue = slow, red = fast)."
            />

            <Prose>
              <p>
                First we catapult the bottom 50% (roughly) of creatures out of the gene pool based on fitness.
              </p>
              <p>
                Then survivors reproduce, either through direct cloning or crossover ;) with another survivor, always followed by mutation.
              </p>
              <p>
                Finally, we simulate the new generation and measure their fitness. Repeat.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/step-through-loop.gif"
              alt="Evolution loop: simulate, select, reproduce"
              caption="This process happens every generation: simulate all creatures, kill the worst, reproduce the best."
            />

            <Prose>
              <p>
                At this point our creatures are brainless oscillators.
                
              </p>
              <p>Naturally, several problems emerged.</p>

              <p>
                Sometimes the simulation would just explode. Creatures would
                fly off to infinity. I had to add checks to disqualify creatures
                with invalid or NaN fitness values. I say this plainly, but there were many things that were causing this. For example: (
                <a
                  href={commit('6715202')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  6715202
                </a>
                ).
              </p>


              <p>
                Pellets were spawning too close to the creature. A creature
                could collect multiple pellets without moving much at all,
                just by being in the right spot when the next pellet appeared.
              </p>
              </Prose>

            <Figure
              src="/articles/genetic-algorithm/pellet-spawning-bug.gif"
              alt="Pellet spawning too close to creature"
            />

            <Prose>
              <p>
                The fix: spawn pellets at least 5 units away from the
                creature&apos;s edge (not center), in the semicircle opposite to
                the creature&apos;s current direction of motion. This forces
                the creature to actually travel to collect each pellet.
              </p>
              <p>
             Our best creatures with pure oscillation mechanics evolved to spaz out in a radius and occasionally bump into
                pellets. Which is pretty much all we could hope for without any ability to respond to the environment.
              </p>
            
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/spazzing-circle.gif"
              alt="Creature spazzing in a circle"
              caption="Creatures winning by vibrating in circles, not walking"
            />

            <p>So let's upgrade the genotype. Time to IQ max.</p>
            
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: NEURAL NETWORKS */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="neural-networks"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              Part 2: Adding brains
            </TOCHeading>

            <Prose>
              <p>
                Each creature gets a small feedforward network: sensory inputs
                → hidden layer → muscle outputs. The network outputs one value
                per muscle in <Math>{`[-1, 1]`}</Math>, which directly controls
                muscle length: <Math>{`L(t) = L_0 \\cdot (1 - y_m)`}</Math>.
                Output of +1 means fully contracted, -1 means fully extended.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/neural-control.png"
              alt="Neural network controlling muscle contraction"
              caption="Example config: 8 inputs → 20 hidden neurons → 6 muscle outputs. Output labels show which nodes each muscle connects (e.g., '1-5' = muscle between node 1 and node 5). Green = contracting, orange = extending."
            />

            <ComparisonTable
              headers={['Input Type', 'Input Count', 'What it tells the creature']}
              rows={[
                ['Pellet direction', '3', 'Where is the food? (unit vector, x, y, z)'],
                ['Velocity direction', '3', 'Which way am I moving? (x, y, z)'],
                ['Distance to pellet', '1', 'How far is the food?'],
                ['Time encoding', '0-2', 'What time is it in the simulation? (ex. oscillates between -1 and 1 every 2 sec)'],
                ['Muscle strain', '0-15', 'How stretched is each muscle? (x, y, z for each muscle)'],
                ['Node velocities', '0-24', 'How fast is each body part moving? (x, y, z for each node)'],
                ['Ground contact', '0-8', 'Which parts are touching the ground? (0 or 1 for each node)'],
              ]}
            />

            <Prose>
              <p>
                The basic version uses 7 inputs (pellet direction, velocity, distance).
                The full version can include proprioception (muscle strain, node
                velocities, ground contact) for up to 54 inputs total. Hidden layer size is configurable (8-32 neurons typical).
              </p>
              <p>
                Now there is no base oscillation anymore. The network has full control over
                when and how each muscle contracts.
              </p>
              <p>And the creatures failed to learn anything. Even their spazzing was ineffective.</p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/adding-nn.gif"
              alt="Creatures with neural networks performing poorly"
            />

            <Prose>
              <p>I decided to take matters into my own hands. I asked Claude something like <Code>
                what is wrong with our creatures? make no mistakes or else a random child across the world will lose their favorite stuffed animal
              </Code></p>
              
            </Prose>

            <Prose>
              <p>
                The conversation that followed made me realize I can't delegate everything to Claude without understanding the codebase myself.
              </p>
            </Prose>

            <Prose>
              <p>
                Basically, a lot had gotten lost in the details. Some examples:
              </p>
            </Prose>

            <OrderedList>
              <li>
                We were using Xavier initialization, which clusters weights near zero. For GA, you want more variance so the initial population explores different behaviors, not all starting with near-silent outputs.
              </li>
              <li>
                Any non zero output activated
                muscles. An output of 0.01 still causes 1% contraction which means the
                network can never produce true silence. I added a dead zone to the output neurons.
              </li>
              <li>
               NN outputs were updating every physics step. At 60 FPS,
                muscles get new target lengths 60 times per second. Small input
                changes cause rapid output oscillation, making creatures jitter
                chaotically. Fixed by caching outputs for 4 physics steps (
                <a
                  href={commit('6c94e32')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  6c94e32
                </a>
                ) and adding exponential smoothing (
                <a
                  href={commit('e97d3ef')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  e97d3ef
                </a>
                ).
              </li>
            </OrderedList>

            <Prose>
              <p>
                After diving into the details and fixing things I saw improvement for the first time for more than 20 generations.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/160-generations.png"
              alt="160+ generations of improvement"
            />

            {/* <Figure
              src="/articles/genetic-algorithm/brain-evolution-comparison.png"
              alt="Brain evolution comparison: Gen 1 vs Gen 99"
              caption="Gen 1 weights (blue) clustered around 0. After 99 generations (red), weights spread out as evolution finds useful values. Green connections strengthened, red weakened."
            /> */}

            <TOCHeading
              id="mutation-types"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Mutation strategies
            </TOCHeading>

            <Prose>
              <p>
                There are many reproduction strategies
              </p>
            </Prose>
            <ComparisonTable
              headers={['Crossover Type', 'What it does', 'Trade-off']}
              rows={[
                [
                  'Uniform',
                  'Each weight randomly from parent A or B',
                  'Maximum mixing, can destroy coordinated weights',
                ],
                [
                  'Interpolation',
                  'Weighted average between parents',
                  'Smoother blending, less exploration',
                ],
                [
                  'Single-point',
                  'All weights before point from A, after from B',
                  'Preserves local structure, less mixing',
                ],
              ]}
            />

            

            <p>and mutations strategies </p>
            <ComparisonTable
              headers={['Mutation Type', 'What it does', 'When it helps']}
              rows={[
                [
                  'Weight perturbation',
                  'Add Gaussian noise to existing weights',
                  'Fine tuning an already good solution',
                ],
                [
                  'Weight replacement',
                  'Replace weight with new random value',
                  'Escaping local optima, exploring new regions',
                ],
                [
                  'Body mutation',
                  'Modify node and muscle parameters',
                  'Evolving morphology alongside behavior',
                ],
                [
                  'Structural (NEAT), more on this later',
                  'Add/remove neurons and connections',
                  'Finding simpler or more complex architectures',
                ],
              ]}
            />
            
            <Prose>
              <p>that I experimented with.</p>
              <p>
                For weight mutations, magnitude matters a lot (
                <a
                  href={commit('9324dec')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  9324dec
                </a>
                ). Weight perturbation adds Gaussian noise with standard
                deviation σ to each weight. But when you do this across many
                weights, the total displacement in weight space scales with the
                square root of dimensions:
              </p>
            </Prose>

            <FormulaBox label="Expected Displacement">
              {`\\mathbb{E}[\\|\\Delta w\\|] = \\sigma \\sqrt{n}`}
            </FormulaBox>

            <Prose>
              <p>
                Think of the neural network as a single point in
                high dimensional space, where each weight is one coordinate. A
                network with 200 weights is a point in{' '}
                <Math>{`\\mathbb{R}^{200}`}</Math>. When you mutate, you move
                from one point to another. The "distance" is just the L2 norm
                between old and new weight vectors.
              </p>
              <Aside title="High-dimensional noise explodes in norm">
              σ isn't just a per-weight tweak. In high dimensions, it defines
              how far the entire network jumps as a function. Even tiny
              per-weight noise becomes a huge functional move once you aggregate
              across hundreds of dimensions.
            </Aside>
              <p>
                In a ~200 dimensional network: σ=0.3 gives{' '}
                <Math>{`0.3 \\times \\sqrt{200} \\approx 4.2`}</Math>. Since
                individual weights are typically magnitude ~1, moving 4.2 units
                means many weights changed by ~30%. You've left the local basin
                and the network's behavior is mostly destroyed. That's a random
                restart, not optimization. σ=0.05 gives{' '}
                <Math>{`0.05 \\times \\sqrt{200} \\approx 0.7`}</Math>. Small
                coordinated nudges across many weights. The network function is
                mostly preserved. You're still on the same fitness ridge and can
                hill-climb.
              </p>
            </Prose>

            

            <Prose>
              <p>
                Our later neural architecture search confirmed this: aggressive
                body mutation with conservative weight mutation worked best.
                Focus evolution on morphology, let weights fine-tune.
              </p>
            </Prose>

            <TOCHeading
              id="what-creatures-learned"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              What creatures actually learned
            </TOCHeading>

            <Prose>
              <p>
                I expected creatures to evolve walking gaits: rhythmic,
                coordinated movements like animals. They didn't. I built an{' '}
                <a
                  href="https://github.com/SilenNaihin/genetic-algorithm/blob/main/backend/notebooks/activation_investigation.ipynb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  activation analysis notebook
                </a>{' '}
                to understand what was actually happening (with the help of Claude Code of course).
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/activation-outputs.png"
              alt="Neural network outputs over time"
              caption="NN outputs for each muscle over a 20 second simulation. Most outputs hover near zero (inactive). Compare to a walking gait which would show regular oscillation."
            />
            <Prose>
              <p>
                The dominant oscillation frequency was 0.17 Hz, much slower than typical locomotion gaits. Creatures evolved aperiodic, exploratory movements that happen to reach pellets. They didn't walk, they strategically flailed.
              </p>
              <p className="mt-2">
                The best performing creatures had a mean output of -0.12, with most outputs hovering near zero (in the deadzone). The failing creatures had mean positive outputs and more chaotic activation patterns.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/pellet-direction.png"
              alt="Input signals over time"
              caption="Sensory inputs during a 20-second simulation. Top: pellet direction (x,y,z). Middle: velocity direction. Bottom: distance to pellet. "
            />
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: DIVERSITY */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="diversity"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              The diversity collapse
            </TOCHeading>

            <Prose>
              <p>
                After a few successful runs, I noticed a pattern. Runs would
                improve for up to 50 generations, then plateau. Looking at the
                population, everyone had converged to the same strategy. The top
                50% survive, they're all similar, they breed, offspring are even
                more similar. Eventually everyone is a minor variation of the
                same local optimum.
              </p>
              <p>
                This is a known problem. I started reading about diversity
                maintenance: fitness sharing, tournament selection, and how the famous NEAT paper does it.
              </p>
            </Prose>

            <TOCHeading
              id="selection-strategies"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Selection strategies
            </TOCHeading>

            <Prose>
              <p>
                I experimented with three selection methods:
              </p>
            </Prose>

            <ComparisonTable
              headers={['Method', 'How it works', 'Trade-off']}
              rows={[
                [
                  'Truncation',
                  'Kill bottom 50%, clone survivors',
                  'Simple but aggressive. Fast convergence, loses diversity quickly.',
                ],
                [
                  'Rank',
                  'Selection probability proportional to rank, not raw fitness',
                  'Gentler pressure. Creature at rank 2 isn\'t 10x more likely to survive than rank 10.',
                ],
                [
                  'Tournament',
                  'Pick k random creatures, best one survives',
                  'Stochastic. Weaker creatures in weak groups can survive, preserving diversity.',
                ],
              ]}
            />

            <Prose>
             
              <p>
                Tournament selection (
                <a
                  href={commit('d3e7a8c')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  d3e7a8c
                </a>
                ) adds randomness. Pick k=3 creatures at random, keep the best.
                A mediocre creature in a group of three bad ones survives. This
                lets "stepping stone" genomes persist, ones that aren't great
                now but might lead somewhere good.
              </p>
              <p>In Theory.</p>
            <p>After our neural architecture search, I realized that rank and tournament selection didn't help at all. Go figure.</p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/selection-comparison.png"
              alt="Comparison of selection methods"
              caption="Different selection methods produce different fitness distributions. From NAS analysis."
            />


            <TOCHeading
              id="fitness-sharing"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Fitness sharing
            </TOCHeading>

            <Prose>
              <p>
                If two creatures are similar, they split their fitness. This
                penalizes crowded regions of the search space. The intuition:
                imagine 10 creatures all clustered around the same local optimum.
                Without fitness sharing, they'd all survive and breed, making the
                population even more homogeneous. With fitness sharing, they divide
                the reward among themselves, so one novel creature exploring
                elsewhere might actually have higher effective fitness.
              </p>
              <p>
                The formula (Goldberg & Richardson, 1987):
              </p>
            </Prose>

            <FormulaBox label="Fitness Sharing">
              {`f'_i = \\frac{f_i}{1 + \\sum_{j \\neq i} sh(d_{ij})}`}
            </FormulaBox>

            <Prose>
              <p>
                Each creature's fitness gets divided by a "niche count": how many
                similar creatures exist. The <Math>{`sh(d)`}</Math> function
                determines how much two creatures "share" based on their distance:
              </p>
            </Prose>

            <FormulaBox label="Sharing Function">
              {`sh(d) = \\begin{cases} 1 - \\left(\\frac{d}{\\sigma_{share}}\\right)^\\alpha & \\text{if } d < \\sigma_{share} \\\\ 0 & \\text{otherwise} \\end{cases}`}
            </FormulaBox>

            <Prose>
              <p>
                The key parameter is <Math>{`\\sigma_{share}`}</Math>, the{' '}
                <strong>sharing radius</strong>. It defines "how different is
                different enough." If two creatures have distance{' '}
                <Math>{`d < \\sigma_{share}`}</Math>, they're considered similar
                and share fitness. If <Math>{`d \\geq \\sigma_{share}`}</Math>,
                they're far enough apart to not affect each other.
              </p>
              <p>
                When <Math>{`d = 0`}</Math> (identical creatures),{' '}
                <Math>{`sh(0) = 1`}</Math>, meaning full sharing. As distance
                increases toward <Math>{`\\sigma_{share}`}</Math>, sharing
                decreases linearly (when <Math>{`\\alpha = 1`}</Math>). At the
                boundary and beyond, <Math>{`sh(d) = 0`}</Math>, no sharing.
              </p>
              <p>
                For neural networks, I
                computed the RMS (root mean squared) Euclidean distance across all
                weight matrices. By flattening both networks' weights into vectors,
                computing the element-wise differences, squaring them, averaging, and then
                taking the square root. This gives a single number representing how
                different two brains are.
              </p>
            </Prose>

            <CodePanel
              side
              collapsible
              collapsedLabel="neural_genome_distance()"
              code={`def neural_genome_distance(genome1, genome2) -> float:
    ng1 = genome1.get('neuralGenome')
    ng2 = genome2.get('neuralGenome')

    total_squared_diff = 0.0
    total_weights = 0

    # Compare all weight matrices
    for key in ['weights_ih', 'weights_ho', 'biases_h', 'biases_o']:
        w1 = _flatten(ng1.get(key, []))
        w2 = _flatten(ng2.get(key, []))

        min_len = min(len(w1), len(w2))
        for i in range(min_len):
            diff = w1[i] - w2[i]
            total_squared_diff += diff * diff
            total_weights += 1

        # Penalize size mismatch (topology difference)
        size_diff = abs(len(w1) - len(w2))
        total_squared_diff += size_diff * 4.0  # max diff squared
        total_weights += size_diff

    # Root mean squared distance
    return math.sqrt(total_squared_diff / total_weights)`}
            />

            <Prose>
              <p>This didn't really help, but I didn't spend enough time debugging to find out why.</p>
              <p>Instead I decided to implement a paper in which these things had already been solved and work. NEAT (NeuroEvolution of Augmenting Topologies).</p>
            </Prose>

            
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: NEAT */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="neat"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              Part 3: NEAT
            </TOCHeading>

            <Prose>
              <p>
                               
                NEAT asks 'are we limiting evolution by fixing the
                network structure?' 
                </p>
                <p>Every creature had the same architecture: 7
                inputs, one hidden layer, N outputs. But some tasks may need more hidden neurons. And some connections could be useless.
                </p>
                <p>
                Why am I still hand designing the topology of the network like a troglodyte instead of
                letting evolution figure it out? I should be evolution maxxing.
              </p>
              <p>NEAT can mutate everything about the network topology:</p>

              <ComparisonTable
              headers={['Mutation', 'What it does', 'Effect']}
              rows={[
                [
                  'Add connection',
                  'Creates a new connection between two unconnected nodes',
                  'Increases network connectivity',
                ],
                [
                  'Add node',
                  'Splits an existing connection by inserting a node in the middle',
                  'Increases network depth/complexity',
                ],
                [
                  'Mutate weight',
                  'Perturb (90%) or replace (10%) connection weight',
                  'Fine-tunes or escapes local optima',
                ],
                [
                  'Enable connection',
                  'Re-enables a disabled connection',
                  'Can reactivate old genes',
                ],
                [
                  'Disable connection',
                  'Disables an existing connection',
                  'Prunes connections without deleting them',
                ],
              ]}
            />
            <p>From these mutations, networks can start with 0 connections and hidden nodes and grow to be as complex as needed.</p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/neat-preview.gif"
              alt="NEAT network evolution preview"
              caption="It's pretty NEAT"
            />

            <Prose>
              <p>
                These mutations mean every creature can have a different network
                structure.</p>
                <p> But that creates a problem: how do you do crossover
                between two networks with different topologies?
              </p>
            </Prose>

            <TOCHeading
              id="neat-crossover"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Crossover with variable topology
            </TOCHeading>

            <Prose>
              <p>
                NEAT's solution: every time a new connection or node is added
                anywhere in the population, it gets a globally unique ID called
                an <strong>innovation number</strong>. This lets you align genes
                from two parents by their historical origin, not their position
                in the genome.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/innovation-numbers.jpg"
              alt="Innovation numbers diagram showing how genes are tracked"
            />

            <Prose>
              <p>
                Innovation numbers solve crossover alignment. When two parents
                have genes with the same innovation number, those genes came from
                the same ancestral mutation. They're homologous. 
                </p>
                <p>Genes that
                don't match are either <strong>disjoint</strong> (in the middle)
                or <strong>excess</strong> (at the end). The offspring inherits
                matching genes from either parent randomly, plus all disjoint/excess
                genes from the fitter parent.
              </p>
            </Prose>

            <TOCHeading
              id="neat-speciation"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Speciation
            </TOCHeading>

            <Prose>
              <p>
                NEAT uses these same concepts (matching, disjoint, excess genes)
                to measure how different two genomes are. 
                </p>
                <p>
                Instead of following our neanderthal truncation rules where the bottom 50% of creatures are vaporized into context, we can use speciation to protect new structures.
                </p>
                <p>
               This is useful for a mutation that adds
                a node that hurts fitness initially. With speciation, it
                competes only against similar genomes, giving it time to optimize.
              </p>
                <p>
                NEAT introduces a compatibility distance that determines whether two
                creatures belong to the same species:
              </p>
            </Prose>

            <FormulaBox label="Compatibility Distance">
              {`\\delta = \\frac{c_1 E + c_2 D}{N} + c_3 \\bar{W}`}
            </FormulaBox>

            <Prose>
              <p>
                Think of δ as "genome distance". A single number measuring how
                different two creatures are. More mismatched genes (E, D) and
                bigger weight differences (W̄) means higher distance.
              </p>
              <p>
                You pick a threshold δ_t. If two creatures have δ = 2.3 and your
                threshold is δ_t = 3.0, they're in the same species (2.3 &lt; 3.0).
                If creature two δ = 4.1, they're different species (4.1 &gt; 3.0).
              </p>
              <p>
                To assign species I iterate through creatures in order and compare
                each creature to existing species representatives. If δ &lt; δ_t,
                the creature joins that species. If no match, we start a new species with this
                creature as the representative. </p>
              <p>Species are rebuilt from scratch
                each generation with the first creature assigned becoming the
                representative. This is simple, and we end up with however many species clusters
                naturally form in genome space.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/speciation-diagram.jpeg"
              alt="Speciation clusters in genome space"
            />

            <Prose>
              <p>
                If this still feels confusing,{' '}
                <a
                  href="https://www.youtube.com/watch?v=VMQOa4-rVxE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  this video
                </a>{' '}
                is what I watched to get a base-level understanding of NEAT.
              </p>
              <p>
                To add more complexity, I had to solve the problem that standard NEAT assumes fixed input/output counts.
              </p>
              <p>
                Our creatures can mutate their bodies by adding or removing muscles ie output nodes. So creatures can have different output counts. 
                </p><p>
                I added a term: <Math>{`c_4 |O_1 - O_2|`}</Math>, where <Math>O</Math> is the number of output neurons (one per muscle). 
              </p>
              <Aside>
                This output count penalty is a pragmatic fix. A more principled approach would bind actuators to structure, as in <a href="https://www.karlsims.com/papers/siggraph94.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Karl Sims' tree-structured genomes</a>, where body parts and controllers are inherited together. <a href="https://doi.org/10.1162/artl.2009.15.2.15202" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">HyperNEAT</a> achieves a related effect by generating connections as a function of geometry, sidestepping explicit output alignment entirely. Future work!
              </Aside>
              <p>When a muscle is added, I create a new output neuron with sparse random connections. When removed, I delete that output neuron and its connections.</p>

              

              <p>
                Why? Imagine two creatures with identical hidden layers, same connections, same weights. Standard NEAT would say δ = 0, they're twins. But one has 3 muscles and the other has 5. They're solving completely different control problems, so they should be in different species. The output count term ensures this.
              </p>
              
              <p>
                In speciation, each species runs its own selection proportionally. With a 50% survival rate, a species of 10 keeps 5, a species of 50 keeps 25. There's no cap on species size. The compatibility threshold controls how many species form, and selection is proportional within each.
              </p>
            </Prose>

            <TOCHeading
              id="neat-bugs"
              level={4}
              className="text-xl font-bold mb-2 mt-6"
            >
              Bugs everywhere
            </TOCHeading>

            <Aside>
              Canonical NEAT actually allows recurrent connections; cycles, self-loops, arbitrary directed graphs. I disabled recurrence for simpler debugging and because I didn't think memory was necessary for this task. A future direction would be to test with recurrence enabled.
            </Aside>

            <ComparisonTable
              headers={['Bug', 'What happened', 'Commit']}
              rows={[
                [
                  'Cycles forming',
                  'Network execution hangs or loops forever',
                  'e28f706',
                ],
                [
                  'Invalid crossover',
                  'Output neurons used as connection sources',
                  '9b5ff50',
                ],
                [
                  'Wrong output removed',
                  'Deleting muscle removed wrong neuron',
                  '9a28945',
                ],
                [
                  'Hidden nodes at wrong depth',
                  'Hidden neurons overlapping inputs in visualizer',
                  'c93b8b1',
                ],
                [
                  'Clones not mutating',
                  '50% of population frozen (not evolving)',
                  '849cb4e',
                ],
                [
                  'Rates 10x too low',
                  'Using 5%/3% instead of NEAT standard 50%/20%',
                  '43e02d3',
                ],
              ]}
            />
            <Prose>
              <p>Etc.</p>
              <p>
                Most of these bugs came from letting Claude have it's way without providing specific enough instructions.
              </p>
              <p className="mt-2">
                If you're curious for specifics, read the{' '}
                <a
                  href="https://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  original paper
                </a>{' '}
                which has more specifics. For example, an input bias node. Crazy.
              </p>
              
              <p><strong>So how do we perform?</strong> Empirically good.</p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/performance-demo.gif"
              alt="NEAT creatures collecting pellets"
            />

            <Prose><p>NEAT created the most "creature like" behaviors I could get. The two above are clearly able to walk and have a solid sense of direction.</p>
            <p>But objectively bad.</p>
            <p>I couldn't get NEAT runs to pick up more than 2 pellets, and the average rarely crossed 10 points per creature. </p>
            <p>Time to pull out the BIG GUNS.</p></Prose>
          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: NAS */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="nas"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              Neural architecture search
            </TOCHeading>

            <Prose>
              <p>
              At this point I had 20+ hyperparameters and no idea which ones mattered. Mutation rates, crossover rates, network topology settings, speciation thresholds were all being hand tuned by my god given intuition. 
              </p><p>Neural Architecture Search (NAS) is supposed to automates my flawed intuition into raw confidence intervals by running hundreds of trials with different parameter combinations, seeing what actually works.

              </p>
              <p>
                I used{' '}
                <a
                  href="https://optuna.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Optuna
                </a>
                {' '}for Bayesian optimization (
                <a
                  href={commit('8807da4')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  8807da4
                </a>
                ). I tested three hardware configurations:
              </p>
            </Prose>
            <Aside title="If you're a compute nerd, this is for you">
              GPU was slower mainly due to granularity, not raw compute. I was evaluating trials one-at-a-time on a single GPU, which meant lots of tiny kernels and frequent CPU-GPU transfers (physics/control loop ping-pong). Transfer latency added ~0.8ms per step, so total runtime was ~14 min vs ~11 min on CPU.
              <br />
              <br />
              A GPU only beats a CPU when three conditions hold simultaneously: (1) you can batch hundreds+ of creatures per step, (2) the entire inner loop stays on GPU (state, physics, NN, reward - no ping-pong), and (3) kernel launch overhead gets amortized by large batches. My workload violated all three: sequential rollouts, physics on CPU with NN on GPU, and tiny per-step compute that overhead dominated.
              <br />
              <br />
              Evolutionary algorithms are often CPU-native anyway. CPUs excel at irregular control flow, branching, and many independent long-running tasks. GPUs excel at dense math with regular structure. Most NEAT implementations run on CPU; GPU evo papers almost always massively batch environments or learn policies rather than rollouts. With larger populations (1000+) and a GPU-resident simulation loop, GPU could win. At current population sizes with sequential rollouts, CPUs were the right tool.
              <br />
              <br />
              CPU parallelization initially failed for two reasons. Optuna/joblib sometimes degraded to near-sequential scheduling for long trials, so throughput was far below expected. Separately, PyTorch oversubscribed cores: each worker process spawned ~64 OpenMP/MKL threads, so multiple workers fought over the same 128 cores, causing heavy context switching (48,000/sec). Fix: <Code>OMP_NUM_THREADS=1</Code> (and similar thread limits) inside each worker before importing PyTorch.
            </Aside>
            <ComparisonTable
              headers={['Hardware', 'Configuration', 'Result']}
              rows={[
                ['M3 Max (local)', '12 cores, sequential', '~11 min/trial, reliable'],
                ['T4 GPU (Azure)', 'CUDA, batched physics', 'Slower than CPU'],
                ['Azure D128as_v7', '128 vCPUs, parallel', 'Failed initially'],
              ]}
            />

            

            

            <Prose>
              <p>
                Final runs used a CLI I built for the search.
              </p>
            </Prose>

            <CodePanel
            collapsible
            defaultCollapsed
              code={`# NEAT search on M3 Max (local) - 100 trials × 3 seeds
python cli.py search neat-full \\
  --mode neat \\
  --trials 100 \\
  --generations 150 \\
  --seeds 3 \\
  --population-size 200 \\
  --stagnation-limit 50

# NEAT search on Azure VM - 200 trials × 1 seed (parallel workers)
python cli.py search-pool neat-full-200 \\
  --mode neat \\
  --trials 200 \\
  --generations 200 \\
  --seeds 1 \\
  --population-size 300 \\
  --n-workers 3

# Pure NN search on Azure VM - 200 trials × 1 seed
python cli.py search-pool pure-full-200 \\
  --mode pure \\
  --trials 200 \\
  --generations 200 \\
  --seeds 1 \\
  --population-size 300 \\
  --n-workers 3`}
              language="bash"
            />

            <Prose>
              <p className='mt-2'>
                The local NEAT run used 3 seeds per trial for variance estimation (each configuration tested with seeds 42, 123, 456). The VM runs used 1 seed per trial to maximize trial throughput, which means we're more susceptible to lucky seeds (as the reproduction results later show).
              </p>
            </Prose>

            <ComparisonTable
              headers={['Mode', 'Best Fitness', 'Trials', 'Seeds', 'Time']}
              rows={[
                [
                  { value: 'Pure NN (VM)', highlight: true },
                  { value: '798.6', highlight: true },
                  '200',
                  '1',
                  '~12 hrs',
                ],
                ['NEAT (VM)', '~400', '137', '1', '~13 hrs'],
                ['NEAT (local)', '441.2', '100', '3', '~48 hrs'],
              ]}
            />

            <Prose>
            
              <p>
                Pure neural networks nearly doubled NEAT's performance on this
                task. The simple fixed topology beat variable topology. I didn't
                expect this (more on this later).
              </p>
              <p>
                I tried to reproduce the top results by running the best configurations again while capturing the full activations and physics frames. 13 reproduction runs (3 Pure, 10 NEAT) using the exact parameters from the top NAS trials:
              </p>
            </Prose>

            <CodePanel
              code={`# Reproduction run - load params from NAS trial, run in frontend
python cli.py reproduce neat-full 68 \\
  --generations 200 \\
  --population-size 200

# This loads trial_68.json params and runs the full evolution
# in the web UI, storing results to PostgreSQL for analysis`}
              language="bash"
              collapsedLabel="reproduce command"
            />

            <ComparisonTable
              headers={['Trial', 'NAS Best', 'NAS Avg', 'Repro Best', 'Repro Avg']}
              rows={[
                ['Pure #42 (top best)', '798.6', '81.9', '420.7', '58.9'],
                ['Pure #178 (top avg)', '587.5', '118.3', '129.6', '24.2'],
                ['NEAT #68 (top best)', '441.2', '27.1', '312.9', '32.6'],
                ['NEAT #96 (top avg)', '218.2', '41.7', '—', '—'],
                ['NEAT #57', '439.5', '27.6', '609.5', '34.2'],
              ]}
            />

            <Prose>
              <p>
                NEAT #57 actually exceeded its NAS result (609.5 vs 439), a lucky seed. But Pure #42 and NEAT #68 fell far short. Pure #178's reproduction was especially disappointing - from 118.3 average down to 24.2. Across all 13 reproduction runs, the best performers were:
              </p>
            </Prose>

            <ComparisonTable
              headers={['Metric', '1st', '2nd', '3rd']}
              rows={[
                ['Best fitness', 'NEAT #57 (609.5)', 'Pure #165 (330.5)', 'NEAT #94 (313.8)'],
                ['Best average', 'NEAT #106 (45.0)', 'Pure #165 (44.3)', 'Pure #43 (36.4)'],
              ]}
            />

            <Prose>
              <p>
                Genetic algorithms are stochastic. The same hyperparameters with different random seeds produce wildly different results. The NAS found configurations that <em>can</em> achieve high fitness, not configurations that <em>reliably</em> achieve it.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/seed_variance_chart.png"
              alt="Bar chart showing same hyperparameters producing wildly different fitness results across seeds and reproduction attempts"
              caption="Same config, different seeds: Trial #57's reproduction attempt (610) exceeded its NAS results, while #68's dropped from 441 to 313. The purple bars show reproduction attempts months later."
            />

            <Prose>
              <p>
                The best creatures collected 8
                pellets, but the population mean hovered around 0.3 pellets. Most
                creatures just flailed in place or crawled in the wrong direction.
                </p>
                <p>
                I had a SINGLE run where the average creature was able to pick up
                a single pellet. And it didn't reproduce.
                </p>
                <p>
                The winners were outliers, not the norm. Best fitness varies wildly
                with luck, but average fitness <em>never exceeded 100</em> (one pellet)
                across all 100 NAS trials.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/best_vs_avg_chart.png"
              alt="Scatter plot showing best creature fitness vs population average, with average never exceeding 100"
              caption="Best vs average fitness across 100 NAS trials. The blue dots (best creature) vary from 100-440, but the green dots (population average) never break 42. The red line marks 1 pellet (fitness=100)."
            />

            <Prose>
              <p>More counterintuitive results:</p>
              <UnorderedList>
                <li>
                  <strong>Pure NN beat NEAT by nearly 2x.</strong> Fixed topology outperformed variable topology. Why? Hard to say. Could be compute constraints (NEAT needs more generations to converge). Could be my speciation tuning (threshold too tight or too loose). Could be that topology search is wasted effort when a fixed 7 to 8 to N network is already expressive enough for pellet chasing. The NEAT paper's benchmarks (XOR, pole balancing) are topology sensitive problems where minimal structure matters. Pellet collection might just not be one of those. Or I have bugs. Honestly unclear.
                </li>
                <li>
                  <strong>Crossover hurts in this search (r = -0.47, p{'<'}0.001).</strong> The
                  strongest single correlation. Best trials all had{' '}
                  <Code>use_crossover: False</Code>. Mutation-only won. Caveat: this could be confounded with other hyperparameters. The standard explanation is that crossover destroys coordinated weight patterns. Parent A learned one strategy, parent B learned another, and mixing them scrambles both.
                </li>
                <li>
                  <strong>Time encoding hurts peak fitness (ANOVA F=6.3, p=0.002).</strong>{' '}
                  Mode 'none': mean 333.8. Mode 'sin': mean 249.3. The network figures out timing on its own. But there's a tradeoff: <Code>time_encoding=sin</Code> produced better population learning (19% ratio) but lower peak (213 best), while <Code>time_encoding=none</Code> produced extreme elite dominance (4-7% ratio) but higher peak (441 best). If I wanted whole population learning, I'd use sin encoding and accept lower peak performance.
                </li>
                <li>
                  <strong>Proprioception hurts (p=0.12, trending).</strong> More
                  inputs = higher dimensional search space = harder to optimize.
                </li>
                <li>
                  <strong>Full initial connectivity dominates (p=0.011).</strong>{' '}
                  All top 5 trials used <Code>initial_connectivity: full</Code>.
                  Mean 331.0 vs 272-296 for others.
                </li>
              </UnorderedList>
              <p>
                More raw analysis in the{' '}
                <a
                  href="https://github.com/SilenNaihin/genetic-algorithm/blob/main/nas/nas_postmortem.ipynb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  NAS postmortem notebook
                </a>
                .
              </p>
            </Prose>
            


            
          </ArticleSection>
          {/* ============================================ */}
          {/* SECTION: WHY GA ISN'T SOTA */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="why-ga"
              level={4}
              className="text-2xl font-bold mb-2"
            >
              Why genetic algorithms aren't state of the art and this project has little utility
            </TOCHeading>

            <Prose>
              <p>
                For supervised learning with a differentiable loss function,
                gradient descent is provably more sample-efficient than
                evolution. Backprop solves MNIST in minutes with 99%+ accuracy.
                Deep GA would need 1000s of workers and hours to match. This is
                worth stating clearly: genetic algorithms are not SOTA for tasks
                where gradients exist.
              </p>
              <p>
                So when should you use them?
              </p>
            </Prose>

            <ComparisonTable
              headers={['Method', 'When to use']}
              rows={[
                [
                  'Gradient descent',
                  'Differentiable loss, supervised learning, sample efficiency matters',
                ],
                [
                  'GA / Evolution strategies',
                  'Non-differentiable fitness, black-box optimization, massive parallelism available',
                ],
                [
                  'NEAT',
                  'Small networks where topology matters, want to see structure emerge',
                ],
              ]}
            />

            <Prose>
              <p>
                Evolution Lab uses GA because the fitness function is effectively a black box. Physics simulation involves discontinuities (contacts, friction regimes), long rollouts, and chaotic dynamics where small parameter changes lead to large outcome differences. Even with simulator internals, differentiating through thousands of unstable timesteps would yield noisy, high-variance gradients. Evolution is simpler and more robust for this regime.
              </p>
              <p>
                Uber AI's{' '}
                <a
                  href="https://arxiv.org/abs/1712.06567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Deep Neuroevolution paper
                </a>{' '}
                (2017) showed GAs can train networks with millions of parameters. They matched DQN and A3C on Atari in wall-clock time, despite using far more environment samples. The trick: GA is embarrassingly parallel across rollouts (each genome evaluation is independent, no replay buffers or gradient sync), so 1000 workers can compensate for low sample efficiency. Note that Atari doesn't have clean gradients either: DQN uses noisy, bootstrapped estimates, not true reward gradients. GA was competing with noisy RL, not backprop.
              </p>
              <p>
                The real tradeoff is sample-efficient but complex (RL) vs compute-hungry but simple (GA). DQN extracts learning signal from every timestep and assigns credit to individual actions. GA only sees episode-level return and treats the policy as an indivisible blob. For most control problems, RL wins asymptotically. But for black-box, structure-evolving problems like Evolution Lab, GA trades sample efficiency for robustness and simplicity.
              </p>
            </Prose>

          </ArticleSection>

          {/* ============================================ */}
          {/* SECTION: LEARNINGS */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="learnings"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              What I learned
            </TOCHeading>

            <TOCHeading
              id="confounding-variables"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Confounding variables are a pain
            </TOCHeading>

            <Prose>
              <p>
                So many things that should work in theory don't work in practice,
                and I didn't have time to explore everything. Fitness sharing,
                speciation, NEAT, different selection strategies... the literature
                says these help, but I couldn't get consistent improvements. Maybe
                my implementations were buggy. Maybe the hyperparameters were wrong.
                Maybe the task is just different enough that the standard advice
                doesn't apply.
              </p>
            </Prose>

            <TOCHeading
              id="theory-matters"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Theoretical details matter
            </TOCHeading>

            <Prose>
              <p>
                Claude Code is great at writing code. It's not great at telling
                you when you're implementing an algorithm wrong. The NEAT bugs
                (wrong mutation rates, wrong crossover alignment, etc) all came from not reading the paper carefully enough.
              </p>
              <p>
                The best workflow: understand the theory first, then use Claude
                to implement it. Not the other way around.
              </p>
            </Prose>



            <TOCHeading
              id="integration-testing"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Integration testing is gold
            </TOCHeading>

            <Prose>
            <p>
                One tool that helped was <a
                  href="https://gist.github.com/SilenNaihin/ead2b10f83dcc17b9e087c8f8684da88"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >my{' '}
                
                  <Code>/integration-stress-test</Code>
                
                command</a>{' '} I built for Claude. When I would find a bug, Claude would first reproduce it via a test before attempting a fix. 
                </p><p>This makes the entire codebase much more reliable. AI is not good at writing unit tests because it just tests the functionality it wrote with the same cognition as the code it wrote. So it'll often create tests with the same bugs it introduced.
              </p>
            </Prose>

            <TOCHeading
              id="constraints"
              level={3}
              className="text-xl font-bold mb-2 mt-6"
            >
              Your environment is your constraint
            </TOCHeading>

            <Prose>
              <p>
                Instead of hoping evolution learns smooth movement, make smooth movement the only option. This mirrors real biology: joints have limits, tendons only stretch so far. Evolution operates within constraints, it doesn't learn them. The fitness landscape is shaped as much by what's physically impossible as by what's rewarded.
              </p>
              <p>
                Every time I added a physics constraint, creatures got better. Zero-length muscles led to vibration; add minimum lengths and they started walking. Per-frame output updates caused jitter; add smoothing and they moved deliberately. Each constraint removed a failure mode from the search space. The tradeoff is you might eliminate novel solutions (no catapult mechanics if muscles can't overextend), but removing degenerate solutions is usually worth it.
              </p>
            </Prose>
          </ArticleSection>
          

          {/* ============================================ */}
          {/* SECTION: CLOSING */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="whats-next"
              level={2}
              className="text-2xl font-bold mb-2"
            >
              What's next
            </TOCHeading>

            <Prose>
              <p>
                There's still a lot I don't understand. Why does crossover hurt?
                Why does proprioception hurt when it should help? 
              </p>
              <p >A great next goal would be to find a configuration that consistently generates populations of creatures that can pick up at least 1 pellet within 150 generations.</p>
<p> I have more
                experiments I want to try: energy systems (metabolic cost for muscle
                activation), multi-layer hidden networks, better NEAT crossover
                alignment by matching muscle innovation IDs, recurrent connections (memory), <a href="https://doi.org/10.1162/artl.2009.15.2.15202" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">HyperNEAT</a> (indirect encoding via CPPNs), <a href="https://doi.org/10.1162/EVCO_a_00025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">novelty search</a>, coevolution, interspecies mating, actually figuring out why crossover hurts, and gaining more statistical significance on the best runs.</p>
                <p >I could keep pushing, but to be frank I need to free up the few hours a day I was spending on this to work on my other projects.</p>
                <p>Maybe someone else will <a href="https://github.com/SilenNaihin/genetic-algorithm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">pick up where I left off and make something great (it's open source)</a>.</p>
              <p>
                For now, the creatures walk. And exhibit creature like behvaiors. That's something.
              </p>
            </Prose>

            <Figure
              src="/articles/genetic-algorithm/best-creature.gif"
              alt="Best evolved creature"
              caption="The smoothest looking graph and one of the better runs we were able to reproduce."
            />

            <Prose>
              <p>
                Two weeks of staring at blobs. I learned more about genetic
                algorithms by building this than I would have just reading the papers. Though
                reading the papers first would have helped a lot.
              </p>
            </Prose>

            <MutedText>
              Code is on{' '}
              <a
                href="https://github.com/SilenNaihin/genetic-algorithm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
              . I'm <a href="https://twitter.com/silennai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@silennai</a> on Twitter and my website is <a href="https://silennai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">silennai.com</a>.
            </MutedText>
          </ArticleSection>

          

          {/* ============================================ */}
          {/* REFERENCES */}
          {/* ============================================ */}
          <ArticleSection>
            <TOCHeading
              id="references"
              level={4}
              className="text-2xl font-bold mb-2"
            >
              References
            </TOCHeading>

            <Prose>
              <OrderedList>
                <li>
                  Stanley, K.O., & Miikkulainen, R. (2002). Evolving Neural
                  Networks through Augmenting Topologies.{' '}
                  <em>Evolutionary Computation</em>, 10(2), 99-127.{' '}
                  <a
                    href="https://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    PDF
                  </a>
                </li>
                <li>
                  Such, F.P., et al. (2017). Deep Neuroevolution: Genetic
                  Algorithms Are a Competitive Alternative for Training Deep
                  Neural Networks for Reinforcement Learning.{' '}
                  <em>Uber AI Labs</em>.{' '}
                  <a
                    href="https://arxiv.org/abs/1712.06567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    arXiv
                  </a>
                </li>
                <li>
                  Stanley, K.O., D'Ambrosio, D.B., & Gauci, J. (2009). A
                  Hypercube-Based Encoding for Evolving Large-Scale Neural
                  Networks.{' '}
                  <a
                    href="https://doi.org/10.1162/artl.2009.15.2.15202"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    DOI
                  </a>
                </li>
                <li>
                  Lehman, J., & Stanley, K.O. (2011). Abandoning Objectives:
                  Evolution Through the Search for Novelty Alone.{' '}
                  <em>Evolutionary Computation</em>, 19(2), 189-223.{' '}
                  <a
                    href="https://doi.org/10.1162/EVCO_a_00025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    DOI
                  </a>
                </li>
                <li>
                  Sims, K. (1994). Evolving Virtual Creatures.{' '}
                  <em>SIGGRAPH '94</em>.{' '}
                  <a
                    href="https://www.karlsims.com/papers/siggraph94.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    PDF
                  </a>
                </li>
                <li>
                  Goldberg, D.E., & Richardson, J. (1987). Genetic algorithms
                  with sharing for multimodal function optimization.{' '}
                  <em>Genetic Algorithms and their Applications</em>.
                </li>
                <li>
                  Akiba, T., et al. (2019). Optuna: A Next-generation
                  Hyperparameter Optimization Framework.{' '}
                  <em>KDD '19</em>.{' '}
                  <a
                    href="https://arxiv.org/abs/1907.10902"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    arXiv
                  </a>
                </li>
              </OrderedList>
            </Prose>

            <Prose>
              <p className="mt-4">
                <strong>Resources:</strong>
              </p>
              <UnorderedList>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=LMQoLtBJcl8&list=PLrUdxfaFpuuK0rj55Rhc187Tn9vvxck7t&index=17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Carkh's Evolution Simulator
                  </a>{' '}
                  (inspiration)
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=qv6UVOQ0F44"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    MarI/O
                  </a>{' '}
                  (NEAT playing Super Mario)
                </li>
                <li>
                  <a
                    href="https://neat-python.readthedocs.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    NEAT-Python
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/SilenNaihin/genetic-algorithm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Evolution Lab
                  </a>{' '}
                  (this project)
                </li>
              </UnorderedList>
            </Prose>
          </ArticleSection>

          <div className="h-32" />
        </ArticleLayout>
      </div>
    </TOCProvider>
  );
}
