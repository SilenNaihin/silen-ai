# Article Review Prompt

Paste this prompt after completing an article draft to get comprehensive feedback.

---

## The Prompt

```
Do a comprehensive review of this article. Go through the page.tsx and the notebook markdown cells. Return a numbered list of specific suggestions, prioritized by impact.

For each suggestion, provide:
- Location (section/line or element ID)
- Issue identified
- Proposed fix

### Pass 1: Content & Intuition

- Is the hook compelling? Does it pose the problem viscerally in the first 3 sentences, or does it read like a textbook intro?
- Does each major section answer "why would anyone think to do this?" — not just "what is this?"
- Is every code cell justified? Check for "why before what" — does the prose before each cell explain what question we're answering or what we expect to see?
- Review the notebook markdown cells — is there context there that's missing from the article, or vice versa?
- Does the article follow progressive revelation (problem → naive attempt → insight → solution → verification → limitations)?
- Are transitions between sections smooth? Do they summarize what we learned and tease what's next?

### Pass 2: Redundancy & Confusion

- Any duplicate explanations in adjacent sections? (Same concept explained twice)
- Fragmented ArticleSections? (Single-line orphans that should be combined)
- Code cells showing essentially the same thing? (Merge or differentiate)
- Journey summaries that just repeat the detailed explanation above them? (Trim or synthesize)
- Vague transitions like "Let's look at..." without saying why?
- Any section where a reader would think "wait, why are we looking at this?"

### Pass 3: Animations & Visuals

- Do all animations use `startElementId` (not duration-based timing)?
- Do animation transitions align with content sections? (Animation should change when topic changes)
- Are visualizations reinforcing the text or distracting from it?
- Is text in animations readable (≥14px)?
- Any mobile layout concerns?

### Pass 4: Micro-Optimizations

- Filler words or phrases that can be cut ("In order to", "It is important to note that")
- Weak transitions that could be stronger
- Inconsistent terminology (same concept called different things)
- Claims that should be verified with code but aren't
- Missing FormulaBox for key equations
- Missing callout boxes for key insights
- Comparisons that would work better as tables

Return suggestions in this format:

**Critical (affects understanding):**
1. [Location] Issue → Fix

**Important (affects flow):**
1. [Location] Issue → Fix

**Polish (nice-to-have):**
1. [Location] Issue → Fix
```

---

## Follow-up Prompts

After implementing suggestions, use these for additional passes:

### Quick Redundancy Check
```
One more pass: is there anything redundant or confusing? Look for micro-optimizations — tighten prose, strengthen transitions, check animation timing.
```

### Final Read-Through
```
Do a final read-through of the article top-to-bottom. Flag any jarring transitions, unclear explanations, or places where the narrative loses momentum.
```

### Notebook Alignment Check
```
Compare the article page.tsx with the notebook markdown cells. Are we missing any important context from the notebook? Is there duplicate explanation that should only live in one place?
```

---

## When to Use

1. **After first draft** — Use the full prompt above
2. **After major revisions** — Use the quick redundancy check
3. **Before publishing** — Use the final read-through
4. **If notebook was updated separately** — Use the notebook alignment check
