'use client';

import { ArticleSection } from '@/components/article/ArticleSection';
import { TOCHeading } from '@/components/navigation/TableOfContents';
import { TabSwitchButton } from '@/components/navigation/Tabs';
import {
  Prose,
  InsightBox,
  QuoteBox,
  MutedText,
  UnorderedList,
  Aside,
} from '@/components/article/Callouts';
import { Math, FormulaBox } from '@/components/article/Math';
import { TokenizationInteractive } from '@/components/stardust/TokenizationInteractive';
import { NumericalizationInteractive } from '@/components/stardust/NumericalizationInteractive';
import { EmbeddingInteractive } from '@/components/stardust/EmbeddingInteractive';

export function FoundationsContent() {
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
