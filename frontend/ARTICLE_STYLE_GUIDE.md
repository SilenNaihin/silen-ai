# Interactive Article Style Guide

A comprehensive guide for creating world-class interactive articles from Jupyter notebooks. This captures patterns learned through extensive iteration — follow it to avoid common pitfalls and achieve quality in one shot.

**Important:** This guide is for a **planning dialogue**, not direct generation. The workflow is:

1. Discuss the topic and visualization approach
2. Plan the notebook structure together
3. Review and iterate on the plan
4. Only then implement the article

---

## 0. Planning Phase: Before Any Implementation

### Starting the Dialogue

When given a topic, first establish:

```
1. What should become intuitively obvious by the end?
2. What's the reader's assumed starting knowledge?
3. What type of visualization approach fits best?
```

### Three Visualization Approaches

**A) Single Evolving Animation** (like AI 2027)

- One animation that transforms throughout the entire article
- Best for: Timeline-based topics, cumulative building blocks, one system growing in complexity
- Example: Compute scaling curve getting steeper as capabilities increase

**B) Multiple Section Animations** (like our positional encoding article)

- Different animations for different sections
- Best for: Deeply technical topics with distinct concepts that each benefit from visualization
- Example: Permutation problem → sine waves → circle tracing → matrix heatmap

**C) Project Visualization + Writeup**

- Interactive demo as main attraction, article as companion
- Best for: Systems that benefit from hands-on exploration
- Example: Hopfield network visualization showing energy minimization, with explanatory writeup below

### Plan Output Format

Before implementation, produce a plan covering:

- Which visualization approach and why
- Section-by-section breakdown with:
  - Key concept to convey
  - Animation/visualization idea
  - Code cells needed
  - Interactive elements (if any)
- Transitions between sections
- Tab structure (if multi-part)

---

## 1. Philosophy & Goals

### Core Principle

**Build intuition, don't just show code.** The reader should feel each design choice is _inevitable_ by the end — not arbitrary.

### The "Why" Down to First Principles

Assume a beginner will question everything. Not just "what does this do" but "why would anyone think to do this?"

```
❌ "We use sine because it's bounded"
✅ "We need bounded values. What functions are bounded? Sine is bounded [-1,1],
   smooth, and — crucially — we already know it from the unit circle..."
```

### Tie to Fundamental Concepts

Connect new ideas to things readers already know:

- Normal distributions
- Complex numbers / unit circle
- Pythagorean theorem
- RREF / linear algebra basics

```
Example: "The (sin θ, cos θ) pair traces a circle — you've seen this since
trigonometry. RoPE just applies this rotation to embedding dimensions."
```

### Every Element Must Earn Its Place

Before adding anything (code cell, animation, visualization), ask:

- What question does this answer?
- What would the reader be confused about without it?
- Does it advance understanding or just fill space?

### The "Inevitable" Test

A great technical article makes the reader think: "Of course it works that way — how else would you do it?" Each step should feel like the natural next question after the previous answer.

---

## 2. Article Structure

### The Hook (First 3 Sentences)

**Pose the problem viscerally.** Don't start with definitions or history.

```
❌ Bad: "Positional encoding is a technique used in transformers to..."
✅ Good: "Shuffle the words in 'The cat sat on the mat' and a transformer
         sees no difference. It processes tokens in parallel with no notion
         of order. So how do models like GPT know that 'cat' comes before 'sat'?"
```

The hook should:

1. Create tension or mystery
2. Make the reader feel the problem
3. Promise resolution ("We'll derive this from scratch")

### Progressive Revelation

Structure content as a journey of discovery:

```
1. THE PROBLEM     → Make them feel it (with code proof)
2. NAIVE ATTEMPT   → Try the obvious thing, show why it fails
3. INSIGHT         → "What if we...?"
4. SOLUTION        → Build it piece by piece
5. VERIFICATION    → Prove it works
6. LIMITATIONS     → Acknowledge tradeoffs (sets up next section)
```

### Problem-Based Teaching

Present concepts as solutions to problems, not facts to memorize:

```
Example flow for RMSNorm:
1. Problems with training deep networks → why we need normalization
2. BatchNorm introduced → normalizes across batches
3. But BatchNorm fails for autoregressive → why?
4. LayerNorm → batch-invariant alternative
5. But LayerNorm is slow → why?
6. RMSNorm → removes mean centering, just rescales
7. Pre-norm vs post-norm → where to place it
8. Brief mention of SOTA (DeepNorm) → what's next
```

Each step answers "what problem does this solve?" not just "what is this?"

### Mention SOTA and Experimental Approaches

After covering the core concept, briefly mention:

- Current state-of-the-art variations
- Experimental approaches in recent papers
- What to search to learn more

```
"RoPE is now standard, but research continues: ALiBi adds position bias
to attention logits, YaRN improves extrapolation via interpolation.
Search 'context length extension' for the latest."
```

### Tab Structure

For multi-part topics, use tabs to separate major approaches:

- Each tab should be self-contained but build on shared foundations
- End Tab 1 with a transition that motivates Tab 2
- Don't repeat basic concepts across tabs

### Section Transitions

At major boundaries, briefly summarize and tease:

```tsx
// End of Sinusoidal PE section
<p>
  We've built up sinusoidal PE piece by piece: bounded values → multiple
  frequencies → sin/cos pairs → the 10000 base. It works! But position
  and content get entangled in attention.
</p>
<p>
  Here's a thought: the (sin, cos) pairs we're using... those define a
  <em>rotation</em>. What if instead of adding, we rotated?
</p>
```

---

## 3. Notebook Design Principles

### Realistic Examples, Not Abstract Tensors

Don't use meaningless numbers. Ground examples in something concrete:

```python
# ❌ Bad: Abstract and forgettable
embeddings = torch.tensor([[0.5, 1.0], [2.0, -1.0]])

# ✅ Good: Concrete and memorable
# Three fake embeddings representing "The cat sat"
words = ["The", "cat", "sat"]
embeddings = torch.randn(3, 4)
print(f"'{words[0]}' embedding: {embeddings[0]}")
```

### Single-Line Cells Are OK

Don't feel obligated to bundle code. One line that demonstrates one thing is often clearer:

```python
# Cell 1: Show the shape
embeddings.shape

# Cell 2: Show the values
embeddings

# Cell 3: Show the mean
embeddings.mean(dim=1)
```

### Build Up to Complete Functions

Start with intuitions, not complete solutions:

```python
# Cell 1: What's a single sine encoding?
np.sin(position)

# Cell 2: What about with frequency?
np.sin(position * frequency)

# Cell 3: Multiple frequencies?
np.sin(position * frequencies)  # frequencies is a vector

# Cell 4: Add cosine
pe = np.stack([np.sin(pos * freq), np.cos(pos * freq)])

# Cell 5: The complete function
def positional_encoding(seq_len, d_model):
    ...
```

### Math Derivations to First Principles

Break down math to the level of log rules and trig identities:

```
For log_softmax, show:
log(softmax(x)) = log(exp(x_i) / Σexp(x_j))
                = log(exp(x_i)) - log(Σexp(x_j))
                = x_i - log(Σexp(x_j))
                = x_i - logsumexp(x)

"Adding a constant to all logits doesn't change the result because..."
```

### Intuitions From Unexpected Places

Building intuition doesn't mean staying narrowly on-topic:

```
Example for understanding nonlinearity + UAT:
1. Visualize a parabola
2. Add random noise to it
3. Try to fit with a line → fails
4. Multiple lines still just make a line
5. Introduce ReLU → can approximate curves
6. Two ReLUs → much better
7. Many ReLUs → arbitrarily good
8. This is the Universal Approximation Theorem
```

The parabola example isn't "about" neural networks, but builds the right intuition.

### Use PyTorch Over NumPy

When relevant, prefer torch for consistency with ML codebases:

```python
# Prefer this
import torch
x = torch.randn(3, 4)

# Over this (unless numpy-specific)
import numpy as np
x = np.random.randn(3, 4)
```

### Include Practice Problems

Add scaffolded exercises within Pyodide (a clear use case for Pyodide) with clear success criteria:

```python
# Exercise: Implement the frequency formula
# The frequency for dimension i should be: 1 / (10000 ^ (2i/d))

def compute_frequencies(d_model):
    # Fill in your code here
    test_freqs = None
    return test_freqs

# Test your implementation
test_result = compute_frequencies(8)
assert test_result[0] == 1.0, "First frequency should be 1.0"
assert len(test_result) == 4, "Should have d_model/2 frequencies"
print("All tests passed!")
```

### Export Comments for Reusable Code

Mark cells that should be extractable to a library:

```python
# | export
class RotaryPositionalEmbedding(nn.Module):
    """Production-ready RoPE implementation."""
    ...
```

---

## 4. Content Flow & Narrative

### The "Why Before What" Rule

**Every code cell needs justification.** Before showing code, explain:

- What question we're answering
- What we expect to see (or what might go wrong)

```
❌ Bad:  "Here's the implementation:"
         [code cell]

✅ Good: "Adding positions 0, 1, 2 works fine for short sequences.
         But what about position 9999?"
         [code cell showing scale explosion]
         "The position signal drowns out the semantics."
```

### Connective Tissue Patterns

Use these transitions between code cells:

| Pattern           | Example                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| Question → Answer | "What happens at position 6?" → [code]                                     |
| Claim → Proof     | "The dot product depends only on relative position." → [code verification] |
| Problem → Reveal  | "But there's a subtle issue..." → [code showing issue]                     |
| Before → After    | "Let's see what this looks like with actual values:" → [code]              |

### Avoid Fragmented Sections

**Never have an ArticleSection with just one line of text.**

```
❌ Bad (5 disconnected sections):
   "With RoPE, the dot product naturally encodes relative position:"
   [code]
   "How attention varies with relative position:"
   [code]
   "Comparing attention patterns:"
   [code]

✅ Good (connected narrative):
   "The proof is in the dot product. With RoPE, attention between
   positions m and n depends only on (m - n):"
   [code]
   "This creates a clean decay pattern — nearby tokens attend strongly,
   distant ones weakly:"
   [code]
   "Let's compare additive PE vs RoPE head-to-head. First with identical
   embeddings to isolate just the positional effect:"
   [code]
```

### When Repetition is OK vs. Trim

**OK to repeat:**

- Key formulas at point of use
- Brief reminders of earlier concepts when building on them
- Summary lists that synthesize (not just restate)

**Trim when:**

- You just explained something in the previous section
- A "journey summary" repeats the detailed explanation above it
- Two code cells show essentially the same thing

### Writing Style

**Avoid em dashes.** Rewrite sentences instead:

```
❌ "RoPE rotates vectors — this preserves the dot product."
✅ "RoPE rotates vectors. This preserves the dot product."
✅ "RoPE rotates vectors, which preserves the dot product."
```

**Minimize colons.** Often a period works better:

```
❌ "Here's the key insight: rotation preserves dot products."
✅ "The key insight is that rotation preserves dot products."
✅ "Rotation preserves dot products. That's the key insight."
```

Colons are fine for introducing code blocks or lists, but avoid them mid-sentence for emphasis.

---

## 5. Code Cell Integration

### Notebook Directive Syntax

In your Jupyter notebook, mark cells with directives:

```python
# | cell-id                    # Sidebar (default), collapsed
# | cell-id inline             # In article body, collapsed
# | cell-id expanded           # Sidebar, starts expanded
# | cell-id inline expanded    # In body, starts expanded
```

### Placement Decision Tree

```
Is this code central to understanding the current point?
├─ YES → inline (reader shouldn't have to look away)
│   └─ Is it short (<10 lines)?
│       ├─ YES → inline expanded
│       └─ NO  → inline collapsed with preview
└─ NO → sidebar
    └─ Is this a "try it yourself" or reference implementation?
        ├─ YES → sidebar, collapsed
        └─ NO  → consider if it's needed at all
```

### InlineCode for Precise Placement

When ArticleSection auto-detection isn't enough:

```tsx
<ArticleSection>
  <p>Here's how the function works:</p>
  <InlineCode id="my-function" /> {/* Renders exactly here */}
  <p>And here's what happens when we apply it:</p>
  <InlineCode id="my-function-applied" />
</ArticleSection>
```

### Grouping Related Cells

If two cells are tightly coupled (e.g., "define function" then "apply function"), keep them close with minimal text between:

```tsx
<p id="define-pe-function">The complete implementation:</p>;
{
  /* Cell appears in sidebar or inline based on directive */
}

<p id="apply-pe-function">Applying it to our embeddings:</p>;
{
  /* Second cell follows naturally */
}
```

### GitHub URL Configuration

Set once per article, applies to all cells:

```tsx
const NOTEBOOK_GITHUB_URL =
  'https://github.com/user/repo/blob/main/path/to/notebook.ipynb';

<UseNotebook path="path/to/notebook.ipynb" githubUrl={NOTEBOOK_GITHUB_URL} />;
```

---

## 6. Animation System

### Golden Rule: Element-Based Triggers

**Never use duration-based timing.** It will drift from content as the article changes.

```tsx
// ❌ BAD: Duration-based (will desync)
animations={[
  { render: (p) => <IntroAnim progress={p} />, duration: 1.5 },
  { render: (p) => <SummaryAnim progress={p} />, duration: 2 },
]}

// ✅ GOOD: Element-based (always synced)
animations={[
  { render: (p) => <IntroAnim progress={p} />, startElementId: 'intro' },
  { render: (p) => <SummaryAnim progress={p} />, startElementId: 'summary' },
]}
```

### Matching Animations to Sections

Each animation should correspond to a TOCHeading or major section:

```tsx
// In your article
<TOCHeading id="the-problem">The Problem</TOCHeading>
<TOCHeading id="first-attempt">First Attempt</TOCHeading>
<TOCHeading id="the-solution">The Solution</TOCHeading>

// In AnimationSequence
animations={[
  { render: (p) => <ProblemAnim />, startElementId: 'the-problem' },
  { render: (p) => <FailureAnim />, startElementId: 'first-attempt' },
  { render: (p) => <SolutionAnim />, startElementId: 'the-solution' },
]}
```

### Animation Design Principles

1. **Reinforce, don't distract** — Animation should visualize what the text explains
2. **Progressive reveal** — Use progress (0→1) to build up complexity
3. **Readable text** — Minimum 14px font in animations
4. **Appropriate speed** — Slow enough to follow, fast enough not to bore

### BlankAnimation for Spacing

When content-heavy sections need no animation, use BlankAnimation:

```tsx
{
  render: (p) => <BlankAnimation progress={p} />,
  startElementId: 'dense-math-section',
}
```

---

## 7. Interactive Elements

There are three distinct types of visual/interactive elements. Choose based on purpose:

| Type | Location | Control | Best For |
|------|----------|---------|----------|
| **Scroll Animation** | Sticky panel (right side) | Scroll progress | Reinforcing narrative, showing evolution |
| **Inline Interactive Viz** | In article body | User interaction | Exploration, "what if" scenarios |
| **Pyodide Code** | In article body | User edits code | Practice, verification, experimentation |

### Scroll Animations vs Inline Visualizations

**Scroll animations** (Section 6) are passive — the reader scrolls and watches. Use for:
- Visualizing the concept being explained in adjacent text
- Showing progression/evolution as the reader advances
- Creating a cinematic, guided experience

**Inline interactive visualizations** are active — the reader explores. Use for:
- "What happens if I change X?" explorations
- Comparing multiple configurations
- Building intuition through direct manipulation

```
Example: Positional Encoding

Scroll animation: Circle tracing sin/cos as reader scrolls through explanation
Inline interactive: Slider to change position and see PE values update live
```

### Decision Tree: Which to Use?

```
Does the reader need to SEE something while reading adjacent text?
├─ YES → Scroll animation (appears in sticky panel alongside text)
│
└─ NO → Does the reader need to EXPLORE or EXPERIMENT?
    ├─ YES → Is it about tweaking values/parameters?
    │   ├─ YES → Inline interactive viz (React component with controls)
    │   └─ NO (code experimentation) → Pyodide InteractiveCode
    │
    └─ NO → Static image or no visualization needed
```

### Inline Interactive Visualization Design

When building custom interactive components:

```tsx
// Component with clear affordances
<PEMatrixViz
  className="my-6"
  defaultPosition={5}      // Sensible defaults
  showControls={true}      // Make interactivity obvious
/>

// Introduce with context explaining WHAT to explore
<p>
  Drag the position slider to see how the encoding changes.
  Notice how lower dimensions (left) change faster than higher ones (right).
</p>
<PEExplorer className="my-6" />
```

**Design principles for inline interactives:**
1. **Obvious affordances** — User should immediately see what's interactive
2. **Sensible defaults** — Start in a state that demonstrates the key insight
3. **Guided exploration** — Tell the reader what to look for
4. **Fast feedback** — Updates should be instantaneous

### Pyodide Interactive Code

For "try it yourself" code blocks with editable Python:

```tsx
<PyodideProvider packages={['numpy', 'matplotlib']} autoLoad>
  {/* Article content */}
</PyodideProvider>
```

**Placement:** After explanations, not before:

```tsx
<ArticleSection>
  <p>The frequency formula gives us wavelengths from 6 to 60,000 positions.</p>
  <p>Try computing positional encodings yourself:</p>
  <InteractiveCode
    code={`import numpy as np
# Compute PE for position 5...`}
    packages={['numpy']}
  />
</ArticleSection>
```

**Good uses for Pyodide:**
- Practice problems with test assertions
- Verifying claims the reader might be skeptical of
- Experimenting with real computations

**Overkill for Pyodide:**
- Simple value tweaking (use inline viz with slider instead)
- Visualizations (Pyodide matplotlib is slow — use React)
- Code that requires complex setup/context

### Combining Multiple Types

A single section might use all three:

```tsx
{/* Scroll animation shows rotation concept in sticky panel */}
<TOCHeading id="rotation">The Rotation</TOCHeading>

<ArticleSection>
  <p>RoPE rotates query and key vectors by position-dependent angles...</p>

  {/* Inline interactive lets reader explore different positions */}
  <p>Drag to see how rotation angle changes with position:</p>
  <RotationExplorer className="my-6" />

  {/* Pyodide for hands-on computation */}
  <p>Verify the rotation matrix yourself:</p>
  <InteractiveCode code={`# Compute R(θ) for position 5...`} />
</ArticleSection>
```

---

## 8. Visual Design

### Prose Density

**Don't be too sparse.** Each ArticleSection should have enough substance to justify its existence.

```
❌ Too sparse:
   <ArticleSection>
     <p>Here's the result:</p>
   </ArticleSection>

✅ Good density:
   <ArticleSection>
     <p>
       The dot product depends only on the <strong>difference</strong> in
       rotation angles! This follows from rotation matrices being orthogonal.
     </p>
     <p id="verify-property">Let's verify numerically:</p>
   </ArticleSection>
```

### Tables for Comparisons

Use tables when comparing multiple items across multiple dimensions:

```tsx
<table className="min-w-full text-sm border border-neutral-200">
  <thead className="bg-neutral-50">
    <tr>
      <th className="px-3 py-2 text-left border-b">Property</th>
      <th className="px-3 py-2 text-left border-b">Sinusoidal</th>
      <th className="px-3 py-2 text-left border-b">RoPE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="px-3 py-2 border-b">Relative position</td>
      <td className="px-3 py-2 border-b">Implicit</td>
      <td className="px-3 py-2 border-b text-green-700">Direct</td>
    </tr>
  </tbody>
</table>
```

### FormulaBox for Key Equations

Highlight important formulas with labels:

```tsx
<FormulaBox label="The Magic Property">
  {'R(\\theta_1)q \\cdot R(\\theta_2)k = q \\cdot R(\\theta_2 - \\theta_1)k'}
</FormulaBox>
```

### Prose Container

Use `Prose` for all article text content. It provides consistent spacing, line height, and text color:

```tsx
import { Prose } from '@/components/article/Callouts';

<ArticleSection>
  <Prose>
    <p>First paragraph with proper spacing.</p>
    <p>Second paragraph automatically spaced.</p>
  </Prose>
</ArticleSection>
```

Override spacing when needed:

```tsx
<Prose className="space-y-2">  {/* Tighter spacing */}
  <p>Compact content here.</p>
</Prose>
```

### Callout Components

Use the callout components from `@/components/article/Callouts`:

```tsx
import { Prose, InsightBox, QuoteBox, DataFlow } from '@/components/article/Callouts';
```

**InsightBox** for key takeaways and derivations:

```tsx
<InsightBox title="Why does this work?">
  <p className="mb-2">
    Rotation matrices are <strong>orthogonal</strong>, meaning R(θ)ᵀ = R(-θ).
  </p>
  <p>This means the dot product only depends on the angle difference.</p>
</InsightBox>
```

**QuoteBox** for comparisons or quotes (left border accent):

```tsx
<QuoteBox>
  <p>
    <strong>Additive PE:</strong> "Here's position info. Figure it out"
  </p>
  <p>
    <strong>RoPE:</strong> "I'll rotate so relative position falls out naturally"
  </p>
</QuoteBox>
```

**DataFlow** for showing pipelines or transformations:

```tsx
<DataFlow
  title="Where rotation happens"
  note={<>Key difference: Additive modifies <em>before</em>, RoPE <em>after</em>.</>}
>
  <DataFlow.Step label="Additive PE">
    x → <span className="text-amber-600">x + PE</span> → Wq → q
  </DataFlow.Step>
  <DataFlow.Step label="RoPE">
    x → Wq → q → <span className="text-green-600">rotate(q)</span> → q'
  </DataFlow.Step>
</DataFlow>
```

### Lists and Typography

**OrderedList** and **UnorderedList** for consistent list styling:

```tsx
import { OrderedList, UnorderedList, MutedText } from '@/components/article/Callouts';

<OrderedList>
  <li><strong>First item</strong>: Description here</li>
  <li><strong>Second item</strong>: More details</li>
</OrderedList>

<UnorderedList>
  <li>Bullet point one</li>
  <li>Bullet point two</li>
</UnorderedList>
```

**MutedText** for secondary information, asides, or closing thoughts:

```tsx
<MutedText>
  The journey from simple intuitions to elegant solutions shows
  how careful reasoning leads to robust designs.
</MutedText>
```

### TOCHeading Default Styles

TOCHeading now has sensible defaults based on level. No className needed:

```tsx
// Level 2 heading (default): text-2xl font-bold mb-2 text-black
<TOCHeading id="my-section" level={2}>
  Section Title
</TOCHeading>

// Override only if needed
<TOCHeading id="custom" level={2} className="text-xl font-medium mb-4">
  Custom Styling
</TOCHeading>
```

Default styles by level:
- Level 1: `text-3xl font-bold mb-4 text-black`
- Level 2: `text-2xl font-bold mb-2 text-black`
- Level 3: `text-xl font-semibold mb-2 text-black`
- Level 4+: Progressively smaller

---

## 9. Common Anti-Patterns

### Duration-Based Animation Timing

**Problem:** Animations drift from content as article length changes.
**Solution:** Always use `startElementId` tied to section headers.

### Code Cell Dumps Without Context

**Problem:** Reader doesn't know why they're looking at code.
**Solution:** Always precede with question/motivation, follow with interpretation.

### Boring/Generic Hooks

**Problem:** "In this article, we will explore..." loses readers immediately.
**Solution:** Start with tension, mystery, or a provocative claim.

### Duplicate Explanations

**Problem:** Same concept explained twice in adjacent sections.
**Solution:** Explain once, reference briefly if needed later.

### Over-Fragmented ArticleSections

**Problem:** Many sections with 1-2 lines each feels choppy.
**Solution:** Combine related points; each section should have substance.

### Missing "Why" for Code Cells

**Problem:** Code appears without motivation.
**Solution:** Every `id="cell-name"` paragraph should answer "why show this?"

### Verification Without Setup

**Problem:** "Let's verify:" without saying what we're verifying.
**Solution:** State the claim, then verify: "Does our encoding stay bounded? Let's check:"

---

## 10. Checklist: Before Publishing

### Content Flow

- [ ] Hook poses problem viscerally in first 3 sentences
- [ ] Each code cell has narrative context (why are we showing this?)
- [ ] No orphaned single-line ArticleSections
- [ ] Transitions between major sections summarize and tease
- [ ] No duplicate explanations in adjacent sections

### Code Cells

- [ ] All notebook directives use correct syntax (`# | id [inline] [expanded]`)
- [ ] Inline vs sidebar placement is intentional
- [ ] githubUrl is set for the article
- [ ] Interactive code blocks have appropriate packages

### Animations

- [ ] All animations use `startElementId`, not duration
- [ ] Animation IDs match actual element IDs in article
- [ ] Animations reinforce (not distract from) content
- [ ] Text in animations is readable (≥14px)

### Visual Polish

- [ ] All text content wrapped in Prose (no inline className for spacing)
- [ ] Lists use OrderedList/UnorderedList (no inline className)
- [ ] TOCHeadings use default styles (no className unless overriding)
- [ ] Muted/italic text uses MutedText component
- [ ] Key formulas use FormulaBox with labels
- [ ] Comparisons use tables or QuoteBox
- [ ] Key insights use InsightBox
- [ ] Data pipelines use DataFlow

### Final Read-Through

- [ ] Read article top-to-bottom checking for jarring transitions
- [ ] Verify all interactive elements work
- [ ] Check animations trigger at correct scroll positions
- [ ] Confirm mobile layout is acceptable

---

## Quick Reference: Component Patterns

```tsx
// Notebook integration
<UseNotebook path="path/to/notebook.ipynb" githubUrl={GITHUB_URL} />

// Code cell by ID (auto-placed in sidebar)
<p id="my-cell-id">Explanation of what this code does:</p>

// Code cell inline (precise placement)
<InlineCode id="my-cell-id" expanded={true} />

// Animation sequence
<AnimationSequence
  scrollProgress={scrollProgress}
  animations={[
    { render: (p) => <MyAnim progress={p} />, startElementId: 'section-id' },
  ]}
/>

// Section with TOC entry
<TOCHeading id="section-id" level={2} className="text-2xl font-bold mb-2">
  Section Title
</TOCHeading>

// Interactive Python
<InteractiveCode code={`print("hello")`} packages={['numpy']} />

// Math formula
<FormulaBox label="Optional Label">{'\\LaTeX here'}</FormulaBox>
<Math>{'inline \\LaTeX'}</Math>

// Prose container (use for all article text)
<Prose>
  <p>Content with consistent spacing and styling.</p>
</Prose>

// Callout components
<InsightBox title="Optional Title">Content here</InsightBox>
<QuoteBox>Comparison or quote content</QuoteBox>
<DataFlow title="Pipeline" note={<>Optional note</>}>
  <DataFlow.Step label="Step 1">x → y</DataFlow.Step>
</DataFlow>

// Lists and typography
<OrderedList><li>Numbered item</li></OrderedList>
<UnorderedList><li>Bullet item</li></UnorderedList>
<MutedText>Secondary, italic text</MutedText>

// TOCHeading (no className needed, defaults applied)
<TOCHeading id="section" level={2}>Title</TOCHeading>
```

---

_This guide distills patterns from extensive iteration. Follow it to achieve quality in one shot rather than discovering these lessons the hard way._
