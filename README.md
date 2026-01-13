# silen-ai

Personal AI/ML learning repository combining interactive educational articles with Jupyter notebook experiments.

**Live site:** [silennai.com/blog](https://silennai.com/blog)

## What's Here

### Interactive Articles

Deep-dive technical articles with scroll-synced animations, interactive visualizations, and in-browser Python execution:

- **Positional Embeddings** — First-principles derivation from integer positions → sine waves → RoPE, with 15+ custom animations
- **Tied Embeddings** — Mathematical analysis proving why weight sharing creates fundamental limitations

Each article pairs with Jupyter notebooks for reproducible learning.

### Notebooks

ML experiments organized by topic in `projects/`:

| Domain | Topics |
|--------|--------|
| **Transformer** | Positional encoding, attention, normalization |
| **RNN** | Recurrent architectures and variants |
| **General ML** | Optimizers, einops patterns, collaborative filtering |
| **Energy Models** | Boltzmann machines |
| **Alternatives** | Mamba, diffusion models |

Notebooks use [nbdev](https://nbdev.fast.ai/) — code exports to `silen_lib/` as a reusable Python library.

### Animation System

50+ custom canvas-based animations that sync to scroll position. The system uses element-based triggers (not timing) so animations stay anchored to their explanations. Examples:

- Frequency progression visualizations
- Rotation matrix demonstrations
- Dot product heatmaps
- Gradient flow animations

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind, Framer Motion, Three.js, KaTeX, Pyodide

**Notebooks:** PyTorch, nbdev, einops, transformer_lens

## Local Development

```bash
# Frontend
cd frontend && npm install && npm run dev

# Python
pip install -e ".[dev]"
nbdev_export  # notebooks → silen_lib
```

## Structure

```
frontend/          # Next.js article platform
projects/          # Jupyter notebooks by topic
silen_lib/         # Python library (nbdev-exported)
```
