# Jupyter Notebook Integration

Automatically link Jupyter notebook cells to your articles with a simple directive.

## Quick Start

### 1. In Notebook - Add Directive

```python
# | my-section-id
print("Hello, World!")
```

### 2. In Article - Declare Notebook

```tsx
import { UseNotebook } from '@/contexts/NotebookContext';

export default function MyArticle() {
  return (
    <>
      <UseNotebook path="projects/my-notebook.ipynb" />
      {/* Your article content */}
    </>
  );
}
```

### 3. In Article - Add Matching ID

```tsx
<ArticleSection>
  <p id="my-section-id">Your text here...</p>
</ArticleSection>
```

**Done!** Code automatically appears in the right margin next to your text.

---

## How It Works

```
Notebook Cell:           Article Element:          Result:
# | my-id        ───►    <p id="my-id">     ───►   Code panel appears
print("Hi")              Text here...               automatically!
```

1. **Global Provider** in `app/layout.tsx` manages all notebooks
2. **`<UseNotebook path="..." />`** declares which notebook to use
3. **`ArticleSection`** detects elements with `id` attributes
4. **Matching cells** automatically render as elegant code panels

---

## Complete Example

**Notebook** (`projects/rnn/networks.ipynb`):

```python
# | barely-understand
# Example computation
2 + 2
```

**Article** (`app/stardust/page.tsx`):

```tsx
'use client';

import { UseNotebook } from '@/contexts/NotebookContext';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { ArticleSection } from '@/components/article/ArticleSection';

export default function StardustArticle() {
  return (
    <>
      <UseNotebook path="projects/rnn/networks.ipynb" />
      <ArticleLayout>
        <h1>How Do We Make Stardust Think?</h1>

        <ArticleSection>
          <p id="barely-understand">
            In truth, we barely understand the brain...
          </p>
        </ArticleSection>
      </ArticleLayout>
    </>
  );
}
```

**Result**: When you scroll to the paragraph, the code `2 + 2` with output `4` appears in an elegant panel on the right.

---

## Directive Format

```python
# | targetId [inline] [expanded] [visualization] [code-aside]
```

- `#` - Python comment
- `|` - Directive marker
- `targetId` - Must match an `id` in your article
- `inline` - (optional) Render in article body instead of right margin
- `expanded` - (optional) Start expanded instead of collapsed
- `visualization` - (optional) Show only output (no code), for graphs/plots
- `code-aside` - (optional) With `inline`: output goes inline, code goes to sidebar

**The directive line is automatically removed from displayed code.**

**Examples:**

```python
# | step-1                    # Right margin, collapsed
# | formula inline            # In article body, collapsed
# | implementation expanded   # Right margin, expanded
# | demo inline expanded      # In article body, expanded
# | parabola visualization    # Output only, no code shown
# | plot inline code-aside    # Output inline, code in sidebar
# | chart inline expanded code-aside  # Output inline, code in sidebar (expanded)
```

**Placement Behavior:**

| Directive | Desktop | Mobile |
|-----------|---------|--------|
| `# \| id` | Right margin | Inline collapsed |
| `# \| id inline` | Inline in article | Inline collapsed |
| `# \| id expanded` | Right margin, expanded | Inline expanded |
| `# \| id inline expanded` | Inline, expanded | Inline expanded |
| `# \| id visualization` | Output only (graph/plot) | Output only |
| `# \| id inline code-aside` | Output inline, code in sidebar | Output inline only |
| `# \| id inline expanded code-aside` | Output inline, code in sidebar (expanded) | Output inline only |

### Visualization Mode

Use `visualization` when the cell produces a visual output (graph, plot, diagram) and the code is just implementation detail:

```python
# | attention-heatmap visualization
import matplotlib.pyplot as plt
plt.imshow(attention_matrix, cmap='Blues')
plt.title("Attention Pattern")
plt.show()
```

**Result:** Only the rendered plot appears in the article. No code is shown, no "Output:" label. GitHub link and copy button appear in the corner for readers who want to inspect the code.

**Note:** Matplotlib artifacts like `<Figure size 600x500 with 2 Axes>` are automatically stripped from all cell outputs.

---

## Multiple Cells

**Notebook**:

```python
# | step-1
print("Starting...")

# | step-2
result = 10 + 20
result

# | step-3
print("Finished!")
```

**Article**:

```tsx
<>
  <UseNotebook path="projects/tutorial.ipynb" />

  <ArticleSection>
    <p id="step-1">First, we initialize...</p>
  </ArticleSection>

  <ArticleSection>
    <p id="step-2">Then, we calculate...</p>
  </ArticleSection>

  <ArticleSection>
    <p id="step-3">Finally, we're done!</p>
  </ArticleSection>
</>
```

---

## Multiple Articles

Each article uses one notebook. Different articles can use different notebooks:

```tsx
// Article 1
export default function IntroArticle() {
  return (
    <>
      <UseNotebook path="projects/intro.ipynb" />
      <ArticleSection>
        <p id="intro-cell">...</p>
      </ArticleSection>
    </>
  );
}

// Article 2
export default function AdvancedArticle() {
  return (
    <>
      <UseNotebook path="projects/advanced.ipynb" />
      <ArticleSection>
        <p id="advanced-cell">...</p>
      </ArticleSection>
    </>
  );
}
```

---

## API Reference

### `UseNotebook`

Declares which notebook an article uses. Place at the top of your article component.

```tsx
<UseNotebook
  path="projects/example.ipynb"
  githubUrl="https://github.com/user/repo/blob/main/projects/example.ipynb"
/>
```

**Props:**

- `path`: string - Path to notebook relative to project root
- `githubUrl`: string (optional) - GitHub URL for all code cells (adds "View on GitHub" button)

### `GlobalNotebookProvider`

Already set up in `app/layout.tsx`. Loads notebooks on-demand with caching. You don't need to add this yourself.

### `useNotebookContext()`

Access notebook cells programmatically (advanced usage):

```tsx
import { useNotebookContext } from '@/contexts/NotebookContext';

const { cells, loading, error } = useNotebookContext();
const myCell = cells['my-id'];
```

### `NotebookCell`

Manually render a cell (rarely needed):

```tsx
import { NotebookCell } from '@/components/article/NotebookCell';

<NotebookCell cell={cells['my-id']} loading={loading} error={error} />;
```

### Manual Override

Explicitly provide `rightContent` to override auto-detection:

```tsx
<ArticleSection rightContent={<CustomComponent />}>
  <p id="my-id">Won't auto-load notebook cell</p>
</ArticleSection>
```

---

## Data Types

### `NotebookCell`

```typescript
interface NotebookCell {
  targetId: string;        // ID from directive
  code: string;            // Code without directive line
  language: string;        // e.g., "python", "javascript"
  output?: string;         // Execution output (if cell was run)
  outputImage?: string;    // Base64 image data (PNG/JPEG)
  executionCount?: number; // Execution count from Jupyter
  inline?: boolean;        // Render in article body (not margin)
  expanded?: boolean;      // Start expanded (not collapsed)
  visualization?: boolean; // Show only output (no code), for graphs/plots
  codeAside?: boolean;     // With inline: output inline, code in sidebar
}
```

### `NotebookData`

```typescript
interface NotebookData {
  cells: Record<string, NotebookCell>; // Cells keyed by targetId
  notebookPath: string; // Path to notebook
}
```

---

## Best Practices

✅ **Descriptive IDs**: Use clear IDs like `matrix-multiplication`, not `calc1`  
✅ **Execute Cells**: Run cells in Jupyter to capture outputs  
✅ **Save Notebooks**: Save after making changes  
✅ **One Concept Per Cell**: Keep cells focused  
✅ **Test Matches**: Verify IDs match exactly between notebook and article

---

## Troubleshooting

### Cell Not Appearing?

1. Check directive syntax: `# | targetId`
2. Verify ID matches exactly in article: `<p id="targetId">`
3. Ensure notebook path is correct relative to project root
4. Check browser console for errors
5. Try accessing API directly: `/api/notebooks?path=your/path.ipynb`

### Output Not Showing?

1. Execute the cell in Jupyter
2. Save the notebook after execution
3. Verify output format is supported (text/plain, stream)

### API Errors?

1. Verify notebook file exists at specified path
2. Check path is relative to project root (not frontend/)
3. Restart dev server: `npm run dev`
4. Clear Next.js cache: `rm -rf .next`

### Import Errors?

```tsx
// ✅ Correct
import { UseNotebook } from '@/contexts/NotebookContext';

// ❌ Wrong
import { NotebookProvider } from '@/contexts/NotebookContext'; // Old API
```

---

## Architecture

```
┌──────────────────┐      ┌───────────────────┐      ┌──────────────────┐
│  Jupyter         │      │  Next.js API      │      │  React           │
│  Notebook        │ ───► │  /api/notebooks   │ ───► │  Components      │
│                  │      │                   │      │                  │
│  # | targetId    │      │  Parser extracts  │      │  Auto-renders    │
│  code here       │      │  cells with IDs   │      │  in right panel  │
└──────────────────┘      └───────────────────┘      └──────────────────┘
```

### Components

- **`notebook-parser.ts`** - Parses `.ipynb` JSON format
- **`app/api/notebooks/route.ts`** - API endpoint serving parsed cells
- **`contexts/NotebookContext.tsx`** - React context with global provider
- **`components/article/ArticleSection.tsx`** - Auto-detects IDs and renders cells
- **`components/article/NotebookCell.tsx`** - Renders cells as CodePanels
- **`hooks/useNotebookCells.ts`** - Fetches notebook data from API

### File Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # ✅ Has GlobalNotebookProvider
│   ├── api/notebooks/route.ts        # Serves notebook data
│   └── stardust/page.tsx             # Example article
├── components/article/
│   ├── ArticleSection.tsx            # Auto-detects notebook cells
│   └── NotebookCell.tsx              # Renders cells as CodePanels
├── contexts/
│   └── NotebookContext.tsx           # Global provider + UseNotebook
├── hooks/
│   └── useNotebookCells.ts           # Fetches from API
└── lib/
    └── notebook-parser.ts            # Parses .ipynb files

projects/
└── rnn/
    └── networks.ipynb                # Your notebooks
```

---

## Advanced Usage

### Programmatic Access

```tsx
import { useNotebookContext } from '@/contexts/NotebookContext';

export default function Article() {
  const { cells, loading, error, currentNotebookPath } = useNotebookContext();

  // Access any cell by ID
  const cell = cells['my-id'];

  if (cell) {
    console.log(cell.code, cell.output);
  }

  return <>{/* ... */}</>;
}
```

### Custom Cell Rendering

```tsx
import { useNotebookContext } from '@/contexts/NotebookContext';

export default function Article() {
  const { cells } = useNotebookContext();

  return (
    <>
      <UseNotebook path="projects/notebook.ipynb" />

      {/* Custom rendering */}
      <div className="my-custom-style">
        <pre>{cells['my-id']?.code}</pre>
        <output>{cells['my-id']?.output}</output>
      </div>
    </>
  );
}
```

### Loading States

```tsx
import { useNotebookContext } from '@/contexts/NotebookContext';

export default function Article() {
  const { loading, error } = useNotebookContext();

  if (loading) return <div>Loading notebook...</div>;
  if (error) return <div>Error: {error}</div>;

  return <>{/* ... */}</>;
}
```

---

## Testing

```bash
# Start dev server
cd frontend
npm run dev

# Visit your article
open http://localhost:3000/stardust

# Check API directly
open http://localhost:3000/api/notebooks?path=projects/rnn/networks.ipynb
```

---

## Benefits

✅ **Single Source of Truth** - Edit in notebooks, auto-updates in articles  
✅ **Live Outputs** - Executed outputs appear automatically  
✅ **No Copy-Paste** - Never manually sync code  
✅ **Simple Syntax** - Just `# | id` in notebook, `id="id"` in article  
✅ **Type-Safe** - Full TypeScript support  
✅ **Global Provider** - No wrapper needed, works everywhere  
✅ **Smart Caching** - Notebooks load once and are cached  
✅ **Automatic Detection** - ArticleSection finds and renders cells automatically
