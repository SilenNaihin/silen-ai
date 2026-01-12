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

### `Aside`

Aside boxes for tangential thoughts, philosophical notes, or references. On desktop, they appear in the right margin. On mobile, they render inline.

**Usage:**

```tsx
import { Aside } from '@/components/article/Callouts';

<ArticleSection>
  <Aside title="The Chinese Room">
    <p>Understanding language seems to require a robust world model...</p>
  </Aside>
  <Prose>
    <p>Your main article content...</p>
  </Prose>
</ArticleSection>
```

**Props:**

- `children`: ReactNode - The aside content
- `title`: string (optional) - Small uppercase title for the aside
- `className`: string - Optional additional classes

**Behavior:**
- Desktop (xl+): Floats in the right margin at the same vertical position
- Mobile (<xl): Renders inline as a styled callout box

### Callout Components

All imported from `@/components/article/Callouts`:

#### `Prose`
Container for article text. Provides consistent spacing and line height.
```tsx
<Prose>
  <p>First paragraph.</p>
  <p>Second paragraph with automatic spacing.</p>
</Prose>
```

#### `MutedText`
Italic, muted text for secondary information or asides.
```tsx
<MutedText>This is a side note or closing thought.</MutedText>
```

#### `Code`
Inline code styling (orange accent) for commands, file names, variables.
```tsx
<Code>/ultrathink</Code>
<Code>settings.json</Code>
<Code>CLAUDE.md</Code>
```

#### `InsightBox`
Key takeaways or explanations. Full border, neutral background.
```tsx
<InsightBox title="Why does this work?">
  Explanation text here.
</InsightBox>
```

#### `QuoteBox`
Quotes or comparisons. Left border accent style.
```tsx
<QuoteBox>
  <p>"Quote text here."</p>
  <p className="text-neutral-500 mt-2">— Attribution</p>
</QuoteBox>
```

#### `UnorderedList` / `OrderedList`
Lists with proper alignment (text wraps under first line, not bullet).
```tsx
<UnorderedList>
  <li><strong>Item:</strong> Description here.</li>
  <li>Another item.</li>
</UnorderedList>
```

#### `Figure`
Image with optional caption and link.
```tsx
<Figure
  src="/images/diagram.png"
  alt="Architecture diagram"
  caption="System architecture overview"
  href="https://source.com"
/>
```

For external images (e.g., XKCD):
```tsx
<Figure
  src="https://imgs.xkcd.com/comics/automation.png"
  alt="XKCD: Automation"
  caption="XKCD #1319: Automation"
  href="https://xkcd.com/1319/"
/>
```

#### `ComparisonTable`
Styled table with optional cell highlighting.
```tsx
<ComparisonTable
  headers={['Feature', 'Tool A', 'Tool B']}
  rows={[
    ['Speed', 'Fast', { value: 'Faster', highlight: true }],
    ['Cost', '$10', '$20'],
  ]}
/>
```

#### `DataFlow`
Pipeline or transformation diagrams with monospace font.
```tsx
<DataFlow title="Processing pipeline">
  <DataFlow.Step label="Input">raw data → parse</DataFlow.Step>
  <DataFlow.Step label="Output">→ formatted result</DataFlow.Step>
</DataFlow>
```

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
│   - Visualizations   - Paragraphs        - Asides                │
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
