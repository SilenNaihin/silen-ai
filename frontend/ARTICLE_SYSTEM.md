# Article System

A flexible system for creating interactive, notebook-driven articles with scroll-synced animations.

## Quick Start

```tsx
// app/my-article/page.tsx
import { ArticleLayout, ArticleSection } from '@/components/article';
import { UseNotebook } from '@/contexts/NotebookContext';

export default function MyArticle() {
  return (
    <>
      <UseNotebook path="projects/my-notebook.ipynb" />
      <ArticleLayout>
        <h1>My Article</h1>
        <ArticleSection>
          <p id="cell-1">Content linked to notebook cell...</p>
        </ArticleSection>
      </ArticleLayout>
    </>
  );
}
```

## Architecture

```
frontend/
├── components/
│   ├── article/          # Core article components
│   │   ├── ArticleLayout.tsx    # Main layout with left/right panels
│   │   ├── ArticleSection.tsx   # Section with auto-linked code
│   │   ├── CodePanel.tsx        # Code display with collapsible
│   │   └── NotebookCell.tsx     # Notebook cell renderer
│   │
│   ├── animation/        # Scroll-synced animations
│   │   ├── AnimationCanvas.tsx  # Canvas wrapper
│   │   ├── AnimationSequence.tsx # Multi-animation orchestrator
│   │   └── useScrollProgress.tsx # Scroll tracking hook
│   │
│   ├── navigation/       # Navigation components
│   │   ├── Tabs.tsx             # Tabbed content
│   │   ├── TableOfContents.tsx  # Auto-tracking TOC
│   │   └── StickyHeader.tsx     # Sticky nav header
│   │
│   └── interactive/      # Interactive elements
│       └── PyodideRunner.tsx    # In-browser Python
│
├── contexts/
│   └── NotebookContext.tsx      # Notebook state management
│
├── lib/
│   └── notebook-parser.ts       # .ipynb parser
│
└── app/
    └── api/notebooks/route.ts   # Notebook API endpoint
```

## Component Documentation

- [Article Components](components/article/README.md)
- [Animation System](components/animation/README.md)
- [Navigation Components](components/navigation/README.md)
- [Interactive Components](components/interactive/README.md)
- [Notebook Integration](lib/NOTEBOOK_CODE.md)

## Key Features

### Notebook Integration
Link Jupyter notebook cells to article sections automatically:

```python
# In notebook: # | my-section
print("Hello")
```

```tsx
// In article
<p id="my-section">Text here...</p>
// Code appears automatically!
```

### Responsive Code Display
- **Desktop**: Code panels in right margin
- **Mobile**: Collapsible inline code below content

### Tabbed Content
```tsx
<TabsProvider tabs={[{id: 'a', label: 'Tab A'}, {id: 'b', label: 'Tab B'}]}>
  <TabButtons />
  <TabContent tabId="a">Content A</TabContent>
  <TabContent tabId="b">Content B</TabContent>
</TabsProvider>
```

### Scroll Animations
```tsx
<ArticleLayout
  leftContent={(progress) => <MyAnimation progress={progress} />}
>
  {/* content */}
</ArticleLayout>
```

### Interactive Python
```tsx
<PyodideProvider packages={['numpy']}>
  <InteractiveCode code="print(2+2)" />
</PyodideProvider>
```

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Tests are located alongside components in `__tests__/` folders or as `.test.tsx` files.

## Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000/positional-encoding` to see the example article.
