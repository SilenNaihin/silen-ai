# Comprehensive Plan: Verifiability Article Improvements

## 1. AI Verification Loop
**Current**: Generate → Verify → Learn → Improve → (loop)
**Target**: Propose → Verify → Improve → (back to Propose)

**Tasks**:
- [ ] Update text in "The Stakes" section to reflect new loop
- [ ] Update figure caption
- [ ] Generate new `verification-loop-v2.png` with simplified 3-step cycle
- [ ] Place v2 image below existing for comparison

---

## 2. Knowledge Hierarchy Image (Reverse Pyramid)
**Current**: Pyramid with interpolation at bottom, zeroth-order at top
**Target**: REVERSE pyramid (widest at top, narrowest at bottom) with 0th-order knowledge at the BOTTOM

**Rationale**: 0th-order discoveries are the rarest, foundational primitives that everything else builds upon. The reverse pyramid visually shows that interpolation (top, widest) is most common, while zeroth-order breakthroughs (bottom, narrowest) are rare but foundational.

**Tasks**:
- [ ] Generate new `knowledge-hierarchy-v2.png` as inverted pyramid
- [ ] Keep the vibe (gradient from blue to gold, clean minimalist)
- [ ] Place v2 below existing for comparison

---

## 3. Model Collapse Image
**Current**: Shows distribution narrowing but could be clearer
**Target**: Better illustration of the collapse process

**Ideas for improvement**:
- Show as a funnel/cone narrowing over iterations
- Or: series of sample grids where diversity visibly decreases
- Or: tree diagram where branches die off
- Keep scientific visualization aesthetic

**Tasks**:
- [ ] Generate new `model-collapse-v2.png` with improved illustration
- [ ] Place v2 below existing for comparison

---

## 4. OOD Approaches Table - Combine Duplicates
**Current rows**:
1. Different post-training biases
2. Different architectures ← DUPLICATE
3. Researcher prompting
4. RSA
5. Galapagos evolution
6. Architectural ensembles ← DUPLICATE
7. Sampling strategies

**Target**: Combine rows 2 & 6 into single row about architectural diversity

**New table (6 rows)**:
1. Different post-training biases
2. **Architectural diversity** (combines transformers, Hyena, Mamba, energy-based, diffusion + ensembles)
3. Researcher prompting
4. RSA
5. Galapagos evolution
6. Sampling strategies

**Tasks**:
- [ ] Edit table in page.tsx to combine rows
- [ ] Generate new `ood-approaches-v2.png` with 6 branches (not 7)
- [ ] Keep the vibe (mind map style, icons, blue/gray)
- [ ] Place v2 below existing for comparison

---

## 5. Verifiability Dimensions - Non-Radar Chart
**Current**: `dimensions.png` is a radar/spider chart
**Target**: Different visualization for the 10 dimensions

**Alternative visualization ideas**:
- Vertical stack/ladder showing dimensions
- Circular arrangement (not radar) with icons
- Matrix/grid layout
- Timeline-style horizontal layout
- Periodic table style grid

**Tasks**:
- [ ] Generate new `dimensions-v2.png` as non-radar visualization
- [ ] Place v2 below existing for comparison

---

## 6. AI Research Claims Image + Missing Claim Type
**Current**: `claim-types.png` shows 5 types but misses nuance

**Review claim types in article**:
1. Performance Claims
2. Method Claims
3. Mechanistic Claims
4. Emergent Behavior Claims
5. Safety and Alignment Claims

**Missing claim type to add**: **Theoretical Claims** (bounds, proofs, convergence guarantees)
- These sit between Performance and Method claims in verifiability
- Example: "Our optimizer provably converges in O(n) steps"
- High verifiability if formalized (Lean), medium otherwise

**Tasks**:
- [ ] Add "Theoretical Claims" section to article with table
- [ ] Generate new `claim-types-v2.png` with 6 claim types, better nuance
- [ ] Show gradient of verifiability more clearly
- [ ] Place v2 below existing for comparison

---

## 7. Vertical Images → Side Images
**Check which images are taller than wide**:
- Need to identify vertical images
- Convert to `side={true}` prop

**Tasks**:
- [ ] Check dimensions of all generated images
- [ ] For any vertical images, add `side={true}` prop
- [ ] Ensure proper placement in ArticleSection

---

## 8. Knowledge Generation Lenses Table - Full Expansion
**Current**: Simplified table with 6 columns
**Target**: Full depth matching consilience repo

**New columns needed** (from source):
- Lens (Formalized Title)
- Core Question (1 sentence)
- Canonical Examples (Mechanism ← Idea Source) - MULTIPLE per lens
- Topics / Directions to Explore
- Verification Method (keep)
- Speed (keep)
- Certainty (keep)

**All 13 lenses with full detail**:
1. Cognitive Substrate (Brain)
2. Probabilistic Inference
3. Physical Principles
4. Computational Efficiency
5. Compute Regimes & Scaling
6. Philosophical Foundations
7. Biological Optimization (Evolution)
8. Algorithmic Framing (CS Theory)
9. Training Stability & Control
10. Representational Capacity
11. Data as First-Class Object
12. Strategic Interaction (Game Theory)
13. Meta-Learning & Automation
14. Hardware-Aware Design

**Tasks**:
- [ ] Expand table to include canonical examples column
- [ ] Add "Topics to Explore" column
- [ ] Add `fullWidth` prop to ComparisonTable
- [ ] Generate new `knowledge-lenses-v2.png` with enhanced context
- [ ] Place v2 below existing for comparison

---

## 9. Verification Data Table & Image
**Current issues**:
- Image is just a graph (not creative)
- Table groups physical labs, teleoperation, and simulations together

**Split "Science + simulations" into 3 rows**:
1. **Physical lab data** - Wet labs, particle physics, biology experiments
2. **Teleoperation data** - Robotics, real-world manipulation, embodied AI
3. **Simulation data** - Physics engines, molecular dynamics, synthetic environments

**New image concept**:
- NOT a bar graph
- Could be: flow diagram showing data sources → verifiers → training
- Or: ecosystem map showing interconnected data types
- Or: pipeline visualization
- Or: value chain diagram

**Tasks**:
- [ ] Split table row into 3 separate rows
- [ ] Generate new `verifiable-data-v2.png` with creative visualization
- [ ] Place v2 below existing for comparison

---

## Execution Order

### Phase 1: Content Updates (no image generation)
1. Update verification loop text (Propose → Verify → Improve)
2. Combine OOD table rows (architectures + ensembles)
3. Add Theoretical Claims section
4. Expand Knowledge Lenses table with full detail + fullWidth
5. Split verification data table into 3 rows

### Phase 2: Image Generation
6. Generate all v2 images:
   - verification-loop-v2.png
   - knowledge-hierarchy-v2.png (reverse pyramid)
   - model-collapse-v2.png
   - ood-approaches-v2.png (6 branches)
   - dimensions-v2.png (non-radar)
   - claim-types-v2.png (6 types with nuance)
   - knowledge-lenses-v2.png (enhanced)
   - verifiable-data-v2.png (creative, not graph)

### Phase 3: Integration
7. Add all v2 images below existing images for comparison
8. Check image dimensions and apply `side={true}` to vertical ones
9. Commit changes

---

## Image Prompts to Add to Script

```python
"verification-loop-v2": """
A simple circular flow diagram with 3 steps:
Propose → Verify → Improve → (back to Propose)

Style: Clean minimalist, white background, arrows connecting steps.
Blue and gray color scheme. Professional diagram style.
""",

"knowledge-hierarchy-v2": """
An INVERTED pyramid (widest at TOP, narrowest at BOTTOM) showing levels of knowledge:
TOP (widest): "Interpolation" - filling gaps, most common
MIDDLE: "First-order combinations" - novel recombinations
BOTTOM (narrowest): "Zeroth-order discoveries" - rare foundational primitives (zero, complex numbers)

The narrow bottom represents rarity and foundational importance.
Style: Clean minimalist, white background. Gradient from blue (top) to gold (bottom).
""",

"model-collapse-v2": """
A visualization of model collapse showing decreasing diversity:
Either a funnel/cone narrowing from left to right across generations,
Or a grid of samples where each generation shows less variety,
Or a tree where branches progressively die off.

Labels: Generation 0 (diverse) → Generation N (collapsed)
Style: Clean scientific visualization, white background, blue/gray scheme.
""",

"ood-approaches-v2": """
A mind map with 6 branches (not 7):
Center: "OOD Generation"
Branches:
1. Post-training diversity
2. Architectural diversity (transformers, SSMs, diffusion, ensembles)
3. Researcher prompting
4. RSA aggregation
5. Galapagos evolution
6. Sampling strategies

Style: Clean node-and-edge diagram, white background. Each branch has icon.
""",

"dimensions-v2": """
A NON-RADAR visualization of 10 verifiability dimensions:
Speed, Cost, Certainty, Meta-verifiability, Reproducibility,
Granularity, Complexity, Interpretability, Falsifiability, Composability

Could be: vertical ladder, periodic table grid, circular arrangement with icons,
or horizontal timeline. NOT a spider/radar chart.

Style: Clean infographic, white background, modern typography.
""",

"claim-types-v2": """
6 types of AI research claims arranged by verifiability (gradient green to red):
1. Performance Claims (benchmarks) - most verifiable
2. Theoretical Claims (proofs, bounds) - highly verifiable if formal
3. Method Claims (ablations) - verifiable
4. Mechanistic Claims (interpretability) - medium
5. Emergent Claims (capabilities) - hard
6. Safety Claims (alignment) - hardest to verify

Show nuance: each type has sub-variations. Not just boxes.
Style: Clean infographic showing spectrum, white background.
""",

"knowledge-lenses-v2": """
A comprehensive visualization of 13+ research lenses for AI/ML:
Arranged by verifiability from high (green) to low (red).

Include: Computational Efficiency, Algorithmic Framing, Training Stability,
Hardware-Aware, Compute Regimes, Representational Capacity, Data as First-Class,
Probabilistic Inference, Strategic Interaction, Physical Principles,
Meta-Learning, Cognitive Substrate, Biological Optimization, Philosophical Foundations

Each lens shows: icon, core question snippet, verifiability indicator.
Style: Grid or wheel layout, professional academic aesthetic.
""",

"verifiable-data-v2": """
A creative visualization (NOT a bar graph) showing types of verification data:
- Code + tests
- Math + proofs
- Physical lab experiments
- Teleoperation / robotics
- Simulations
- Games + outcomes
- Human preferences
- Safety red-teaming

Show as: ecosystem map, flow diagram, value chain, or interconnected network.
Indicate verifier type and value for each.
Style: Modern infographic, white background, colorful but professional.
"""
```
