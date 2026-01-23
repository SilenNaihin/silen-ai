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
import { SimpleRNNInteractive } from '@/components/stardust/SimpleRNNInteractive';
import { GradientFlowInteractive } from '@/components/stardust/GradientFlowInteractive';
import { LSTMBuildupInteractive } from '@/components/stardust/LSTMBuildupInteractive';

export function ArchitecturesContent() {
  return (
    <>
      {/* ========== SECTION 1: THE SEQUENCE PROBLEM ========== */}
      <ArticleSection>
        <TOCHeading id="the-sequence-problem" level={2}>
          The Sequence Problem
        </TOCHeading>
        <Prose>
          <p id="sequence-intro">
            &quot;The dog bit the man&quot; and &quot;The man bit the dog.&quot;
            Same words. Opposite meanings. You know instantly which is news and
            which is routine. But feed both sentences to our feedforward network
            and it sees identical inputs. Word order? Invisible.
          </p>
          <p>
            It gets worse. &quot;The trophy didn&apos;t fit in the suitcase
            because it was too big.&quot; What was too big? You know it&apos;s
            the trophy. But the network processes &quot;it&quot; with no memory
            of what came before. Every word is an island.
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
            a running state that updates with each word.
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
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="output-projection">
            At each timestep, we project the hidden state to a probability
            distribution over the vocabulary:
          </p>
        </Prose>
        <FormulaBox label="Output and Loss at Each Step">
          {'y_t = \\text{softmax}(W_{hy} \\cdot h_t + b_y) \\quad\\quad L_t = -\\log y_t[\\text{target}]'}
        </FormulaBox>
        <Prose>
          <p>
            The total loss is the sum of losses at every position:{' '}
            <Math>{'L = \\sum_t L_t'}</Math>. This is key: we get a gradient
            signal at every timestep, not just at the end. More signal means
            faster learning.
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

      {/* ========== SECTION 7: PATCHES THAT DON'T SOLVE MEMORY ========== */}
      <ArticleSection>
        <TOCHeading id="patches-not-solutions" level={2}>
          Patches That Don&apos;t Solve Memory
        </TOCHeading>
        <Prose>
          <p id="weight-decay-rnn">
            Before we look at a real solution, let&apos;s address two common
            attempts that help but don&apos;t fix the fundamental problem.
          </p>
          <p>
            <strong>Gradient clipping</strong> prevents exploding gradients by
            capping the norm. <strong>Weight decay</strong> keeps weights from
            growing too large. Both are standard practice. But neither addresses
            vanishing gradients.
          </p>
          <p id="dropout-rnn">
            <strong>Dropout</strong> helps with overfitting, but standard
            dropout breaks RNNs. Applying different masks at each timestep
            destroys temporal coherence. The fix is{' '}
            <strong>variational dropout</strong>: use the same mask across all
            timesteps.
          </p>
        </Prose>
        <Prose>
          <p>
            These techniques are useful. They&apos;re standard in production
            RNNs. But they&apos;re band-aids. The fundamental problem remains:
            information still decays exponentially over long sequences. We need
            a new architecture.
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
          <p id="gates-need-activations">
            But how do we control this conveyor belt? We need <em>gates</em>.
            Gates should output values between 0 and 1 (0 = block everything, 1
            = let everything through). That means <strong>sigmoid</strong>.
            Values being gated can be positive or negative, so we bound them
            with <strong>tanh</strong> (outputs [-1, 1]).
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="forget-gate">
            The <strong>forget gate</strong> decides what information to throw
            away. It looks at the previous hidden state and current input, then
            outputs a number between 0 and 1 for each position in the cell
            state. 0 means &quot;forget this completely,&quot; 1 means
            &quot;keep this entirely.&quot;
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
        <InsightBox title="A Simpler Alternative: The GRU">
          <p className="mb-2">
            The <strong>Gated Recurrent Unit</strong> (Cho et al., 2014)
            simplifies the LSTM. It combines the forget and input gates into a
            single &quot;update gate&quot; and merges the cell state with the
            hidden state.
          </p>
          <p className="text-sm text-neutral-600">
            Fewer parameters, often similar performance. GRUs are popular when
            speed matters and sequences are not extremely long.
          </p>
        </InsightBox>
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

      {/* ========== SECTION 11: BIDIRECTIONAL RNNs ========== */}
      <ArticleSection>
        <TOCHeading id="bidirectional-rnns" level={2}>
          Seeing the Future: Bidirectional RNNs
        </TOCHeading>
        <Prose>
          <p id="future-context-problem">
            &quot;The bank by the river was steep.&quot; When you read
            &quot;bank&quot;, you don&apos;t yet know if it means a financial
            institution or a riverbank. But by the time you reach
            &quot;river&quot;, the ambiguity resolves. The future context
            disambiguates the past.
          </p>
          <p>
            Standard RNNs only see the past. At each timestep, the hidden state
            encodes everything before, nothing after. This limits tasks like
            named entity recognition, where the category of a word often depends
            on what comes next.
          </p>
        </Prose>
      </ArticleSection>

      <ArticleSection>
        <Prose>
          <p id="bidirectional-solution">
            The solution: run two RNNs. One goes forward through the sequence,
            one goes backward. At each timestep, concatenate both hidden states.
            Now each position has context from both directions.
          </p>
        </Prose>
        <FormulaBox label="Bidirectional Hidden State">
          {'h_t = [\\overrightarrow{h_t} ; \\overleftarrow{h_t}]'}
        </FormulaBox>
        <Prose>
          <p>
            The cost: you need the entire sequence before producing any output.
            No streaming. No real-time generation. But for tasks where you have
            the full input upfront (classification, translation, question
            answering), bidirectional models are often stronger.
          </p>
        </Prose>
        <InsightBox title="ELMo (2018)">
          <p>
            Peters et al.&apos;s ELMo used deep bidirectional LSTMs to create
            contextualized word embeddings. The same word got different
            representations depending on its sentence context. This was a major
            step toward modern language understanding.
          </p>
        </InsightBox>
      </ArticleSection>

      {/* ========== SECTION 12: PROBLEMS REMAINING ========== */}
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
