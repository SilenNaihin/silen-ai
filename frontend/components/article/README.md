# Article Components

This directory contains reusable components for creating elegant, scroll-linked articles with rich visual content.

## Components

### `ArticleLayout`

The main layout wrapper for articles. Provides:

- Fixed-width centered content area
- Optional left sidebar for scroll-synced animations
- Responsive design with proper spacing
- Automatic scroll progress tracking

**Usage:**

```tsx
<ArticleLayout
  leftContent={(scrollProgress) => (
    <YourAnimation scrollProgress={scrollProgress} />
  )}
  className="bg-white"
>
  {/* Your article content */}
</ArticleLayout>
```

**Props:**

- `children`: ReactNode - The main article content
- `leftContent`: (progress: number) => ReactNode - Optional animation component that receives scroll progress (0-1)
- `className`: string - Optional additional classes

### `ArticleSection`

A section wrapper for article content with optional right-side panels.

**Usage:**

```tsx
<ArticleSection rightContent={<CodePanel code="..." />}>
  <p>Your section content...</p>
</ArticleSection>
```

**Props:**

- `children`: ReactNode - The section's text content
- `rightContent`: ReactNode - Optional content for right margin (e.g., code panels, diagrams)
- `className`: string - Optional additional classes

### `CodePanel` & `NotebookCell`

Elegant code display panels with automatic copy functionality.

**Manual Usage (CodePanel):**

```tsx
<CodePanel
  code="2 + 2"
  language="python"
  output="4"
  githubUrl="https://github.com/username/repo"
/>
```

**Automatic Usage (NotebookCell):**

Most of the time, you don't need to use `CodePanel` directly. Instead, use the notebook integration system which automatically renders cells from Jupyter notebooks:

```tsx
import { UseNotebook } from '@/contexts/NotebookContext';

<>
  <UseNotebook path="projects/notebook.ipynb" />
  <ArticleSection>
    <p id="my-cell">Text here...</p> {/* Code appears automatically! */}
  </ArticleSection>
</>;
```

See **[Notebook Integration Guide](../../lib/NOTEBOOK_CODE.md)** for complete documentation.

### `InlineCode`

For precise control over code cell placement, use `InlineCode`:

```tsx
import { InlineCode } from '@/components/article/InlineCode';

<ArticleSection>
  <p>Here's how the function works:</p>
  <InlineCode id="my-function" />  {/* Renders cell exactly here */}
  <p>And here's what happens next...</p>
</ArticleSection>
```

**Props:**

- `id`: string - Cell ID from notebook directive
- `expanded`: boolean (optional) - Override expanded state
- `previewLines`: number (optional) - Lines to show when collapsed (default: 3)

**When to use:**

| Scenario | Use |
|----------|-----|
| Code next to specific paragraph | `<p id="cell-id">` + ArticleSection |
| Code at exact position in flow | `<InlineCode id="cell-id" />` |
| Override notebook's inline/expanded | `<InlineCode id="cell-id" expanded />` |

### Visualization Cells

For cells where the output (graph, plot) is the content and code is just implementation detail:

```python
# In notebook:
# | attention-plot visualization
plt.imshow(attention_matrix)
plt.show()
```

**Result:** Only the rendered plot appears. No code shown, no "Output:" label. GitHub link and copy button in corner for code access.

See **[Notebook Integration Guide](../../lib/NOTEBOOK_CODE.md)** for complete directive documentation.

## Layout Structure

The article system uses a three-column layout:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Left Animation]    [Main Content]      [Right Panels]         │
│                                                                   │
│   (sticky, 384px)    (max 640px)         (sticky, 384px)        │
│                                                                   │
│   - Scroll-synced    - Article text      - Code panels           │
│   - Animations       - Headings          - Diagrams              │
│   - Visualizations   - Paragraphs        - Side notes            │
└─────────────────────────────────────────────────────────────────┘
```

## Styling Guidelines

- Use white backgrounds with black text for elegance
- Minimal use of color - only for emphasis when necessary
- Clean borders and subtle shadows
- Generous spacing between sections
- Responsive design that gracefully degrades on smaller screens

## Best Practices

1. **Content First**: Structure your content in logical sections
2. **Progressive Enhancement**: Ensure content is readable even if animations don't load
3. **Performance**: Keep animations lightweight and canvas-based
4. **Accessibility**: Maintain good contrast ratios and semantic HTML
5. **Scroll Progress**: Use scroll progress to tell a visual story that complements the text
