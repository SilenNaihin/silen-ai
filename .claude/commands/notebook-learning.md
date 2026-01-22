# Notebook Learning

Build intuition on a topic through an interactive Jupyter notebook lesson.

**Usage:** `/notebook-learning` then specify:
- **Notebook:** `@{notebook}.ipynb` (existing or new)
- **Topic:** The concept to teach
- **Source:** Either paste an excerpt from a research paper, or a link to docs, or a paper itself, or just mention a topic and the scope you'd like it to cover

## Instructions

In the specified notebook, help the user build intuition on the topic. Make the concepts **intuitively obvious** by building from first principles.

### Lesson Format

Create a lesson format notebook: start from basic intuitions and build up to complete functions. Do NOT work with big functions. Rather, single cells should build up to a more complete solution. For example, start with intuitions behind each of the different principles.

### Pedagogical Approach

#### Start with the "Why"
Introduce the concept and why it matters. For example, if teaching einops, show the most valuable version of an einops call in a real world situation and explain what value it's providing at a high level. Then from there start with the very basic intuition.

#### Build Intuition Indirectly
The basic intuition doesn't need to be directly linked to the topic obviously. For example if demonstrating nonlinearity and UAT:
1. Start with a parabola visualization
2. Random noise on the parabola visualization
3. Show MSE on the random noise we generated from the parabola
4. Give sliders for adjusting a parabola a b c and seeing how it changes
5. But in practice we don't know it's a parabola so try doing this with a line
6. Line sucks at approximating a parabola, and if we add other lines to it we just get another line with different slope
7. Show a relu
8. Explain nonlinearity in several intuitive and unexpected ways from first principles because it's an important topic
9. Show how with two relus we can reduce the loss greatly
10. With multiple relus goes down further
11. Introduce the UAT
12. Address questions that arise from this (for example, why do we train deep neural nets if one layer deep network is enough to approximate it theoretically)
13. Other cool intuitions behind the UAT

#### Problem-Based Learning
An intuitive way to often present concepts is problem based. For example when trying to understand RMSNorm (industry standard in LLMs):
1. First talk about what problems we have with nns
2. Initialization attempts to fix
3. BatchNorm introduced to normalize std and mean across batches
4. LayerNorm being batch invariant and works for autoregressive better
5. RMSNorm
6. Pre-norm and other norm concepts outside of exactly what was asked for (more intuitions or things that will help understand the main concept, not random subjects)
7. etc.

This is just an example of how an article can build up — do not overindex on this example. Oftentimes it can even be relevant to mention the SOTA or experimental approaches for the concept briefly (for the above example it would be DeepNorm).

#### Math Derivations
If there are any cool math intuitions or valuable derivations, include those and break them down to the log rules level. For example:
- With RoPE encoding, show the breakdown for `q^T * R(theta2-theta1) * k`
- For log_softmax, show how it's just adding a constant term to all logits

### Cell Design

Use markdown cells to explain things in words or show math breakdowns or intuitive summaries. But for any buildup of intuition, always create cells with adequate comments and print statements where useful. Simulations, interactive elements, and visualizations are always super helpful.

#### Bias Toward Single-Line Cells
Especially when focusing on an intuition, bias towards cells with a single line of code that can be executed and shown (so sometimes we don't even need print statements). Add markdown in between those. For certain things like visualizations or markdown, don't be afraid to be longer and just add comments. Because that's a different kind of intuition. Balance this since you're an expert teacher.

#### Realistic Toy Examples
For any toy examples, take the extra step to make them more realistic. Simple example: if working with embeddings, instead of just saying "here are our embeddings [[0.5 1][2 -1]]" it would be so much more valuable throughout the article to refer to something more real like:

```python
# these are 3 fake embeddings representing the words "The cat on"
embs = torch.randn(3, 2)
print(embs)
```

Don't be afraid to make cells that small or even a single line. We don't need to have many lines of code in each cell.

#### Reuse Variables
Throughout the notebook, reuse variables where possible.

### Practice Problems

For some sections create a cell that's unfinished with a test problem. Use `test_` for all the variables within it so it doesn't interfere with the main variables in the notebook. Include:
a) Some scaffolding with a `# fill in code here`
b) Some assert statement or comment about how you know if you got it right

### Building Intuitions Beyond Code

Remember that building intuitions isn't always about just showing code and explaining things purely related to the concept. For example if learning about Boltzmann networks, it would be valuable to build up to the energy minimization function not just through markdown but running code cells and visualizations that are not obviously related to the thing we're learning about.

### Shortcuts

Mention shortcuts after learning the topic. For example, using `F.cross_entropy` instead of having to rebuild the function from scratch every time.

### Adjacent Concepts

Regarding mentioning things from similar fields that the reader may not know about (but it isn't worth diving into because it's too different), provide intuitions and a why, and mention what to search to learn more about it.

### Tie to Fundamentals

It helps to build intuition when you can tie in with a fundamental concept from somewhere else that they probably already know. For example for math related concepts, tie into normal distributions, complex numbers, rref, unit circle, and the pythagorean theorem.

### Assume Beginner Skepticism

Assume that a beginner will question everything you show. So the "why" down to first principles needs to be intuitive. Not just the what.

### Technical Requirements

#### Imports and Setup
Use `utils.set_seed(42)` at the top with imports to set the seed for the entire notebook (covers numpy, pytorch, etc.). Don't use set seed outside of this one call.

#### PyTorch over NumPy
If relevant, use torch over numpy whenever possible.

#### No Positional Markers
Assume we may want to make edits to the notebook in the future, so don't add any positional markers like "Part x" titles.

#### Export Cells
Add `# | export` comments to the top of cells that would be valuable to export into their own library file (for example a sampler Class for training a transformer that puts together all the necessary code).

### Images and External Resources

Search the web to enhance your information and find valuable links and/or images.

If there are any images that would be valuable to put somewhere (such as from the paper or from elsewhere on the internet, like an architecture diagram), add a markdown cell requesting the image URL to be pasted there.

### Splitting Notebooks

Feel free to suggest splitting the notebook into multiple notebooks if:
- The concept is too dense
- A prerequisite topic is both dense enough and different enough from the topic at hand to warrant another notebook

Base this on what you sense the user's current knowledge level is (or if a) explicitly asked, b) you offer it as an option and they say yes).

## Before Writing

1. **Repeat back your high-level plan** for what content will be in this notebook.

2. **Ask diagnostic questions** to tease out what the user's current knowledge level is in this topic (and some super basic tests to respond back with).
