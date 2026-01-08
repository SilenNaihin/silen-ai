# Positional Encoding Components

Article-specific visualizations for positional encoding concepts.

## Animations

### SinusoidalPEAnimation
Scroll-synced animation showing sinusoidal PE concepts.

```tsx
<SinusoidalPEAnimation progress={0.5} startOffset={0} />
```

**Phases**:
1. Floating tokens (permutation problem)
2. Single sine wave (periodicity issue)
3. Multiple frequencies (solution)
4. Circle tracer (sin/cos relationship)

### RoPEAnimation
Scroll-synced animation showing RoPE concepts.

```tsx
<RoPEAnimation progress={0.5} />
```

**Phases**:
1. 2D vector rotation
2. Query/Key rotation
3. Relative position property

## Visualizations

### GPT2EmbeddingsViz
Interactive visualization of learned positional embeddings.

```tsx
<GPT2EmbeddingsViz className="my-4" />
```

**Views**:
- Lookup table diagram
- Heatmap of embedding matrix

### GPT2ImplementationCode
Code snippet showing GPT-2 position embedding implementation.

```tsx
<GPT2ImplementationCode />
```
