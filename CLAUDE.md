# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal AI/ML learning repository with two main parts:

1. **frontend/** - Next.js interactive article platform for educational content
2. **projects/** - Jupyter notebooks (nbdev-managed) for ML experiments
3. **silen_lib/** - Python library extracted from notebooks via nbdev

## Commands

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm test             # Jest tests
npm run test:watch   # Watch mode
```

### Python/Notebooks
```bash
# Uses nbdev - notebooks in projects/ export to silen_lib/
pip install -e ".[dev]"    # Install with dev deps (torch, einops, matplotlib)
nbdev_export               # Export notebooks to silen_lib/
nbdev_test                 # Run notebook tests
```

## Architecture

### Article System

Articles combine Next.js pages with Jupyter notebooks for interactive technical content:

```
Article Page (app/[article]/page.tsx)
    ├── UseNotebook → loads .ipynb from projects/
    ├── ArticleLayout → scroll-synced left panel + main content
    │   └── leftContent={(scrollProgress) => AnimationSequence}
    ├── ArticleSection → auto-links code cells by element ID
    └── TOCHeading → generates table of contents
```

**Key pattern:** Notebook cells are linked to article sections via directives:
```python
# | cell-id                    # Sidebar code panel
# | cell-id inline expanded    # Inline in article, starts expanded
# | cell-id visualization      # Output only, no code shown
```

Article content references cells by ID: `<p id="cell-id">This explanation...</p>`

### Animation System

Scroll-synced animations in the left sticky panel:

```tsx
<AnimationSequence
  scrollProgress={scrollProgress}
  animations={[
    { render: (p) => <MyAnim progress={p} />, startElementId: 'section-id' },
    { render: (p) => <OtherAnim progress={p} />, startElementId: 'next-section',
      milestones: [{ elementId: 'sub-point', progress: 0.5 }] }
  ]}
/>
```

- Always use `startElementId` (never duration-based timing)
- `milestones` for multi-phase animations tied to content
- Mobile: animations render inline via portals when `mobileInline: true`

### Documentation

**Read before writing articles:**
- `frontend/ARTICLE_STYLE_GUIDE.md` - Comprehensive style guide (planning workflow, visual design, anti-patterns)
- `frontend/ARTICLE_SYSTEM.md` - Technical overview of article architecture
- `frontend/ARTICLE_REVIEW_PROMPT.md` - Checklist for reviewing articles

**Component documentation:**
- `frontend/components/article/README.md` - ArticleLayout, ArticleSection, NotebookCell
- `frontend/components/animation/README.md` - AnimationSequence, scroll sync
- `frontend/components/navigation/README.md` - Tabs, TOC, StickyHeader
- `frontend/components/interactive/README.md` - Pyodide, in-browser Python
- `frontend/lib/NOTEBOOK_CODE.md` - Notebook directive syntax and cell linking

### Key Source Files

- `frontend/components/animation/AnimationSequence.tsx` - Scroll animation orchestrator
- `frontend/contexts/NotebookContext.tsx` - Notebook state management
- `frontend/lib/notebook-parser.ts` - .ipynb parser with directive extraction

## Style Conventions

### Frontend
- Black and white design; add color only when distinguishing elements that can't be separated otherwise
- Use `Prose` wrapper for article text, callout components from `@/components/article/Callouts`
- Animations should reinforce content, not distract; BlankAnimation when no animation fits

### Python/Notebooks
- PyTorch preferred over NumPy for ML code
- Notebooks use nbdev directives (`# | export` for library code)
- `# | notest` flag to skip cells during testing

## Git Commit Rules

Keep commits atomic—only commit files you touched, listing each path explicitly:

```bash
# Tracked files
git commit -m "<scoped message>" -- path/to/file1 path/to/file2

# New files
git add "path/to/file1" "path/to/file2" && git commit -m "<message>"
```

**Quote paths with special characters** (brackets, parentheses):
```bash
git add "src/app/[slug]/page.tsx"
git commit -m "message" -- "src/app/[candidate]/page.tsx"
```

**Never run destructive commands** (`git reset --hard`, `rm` on tracked files, `git restore` to older commits) unless explicitly instructed.

For non-interactive rebases: `export GIT_EDITOR=: && export GIT_SEQUENCE_EDITOR=:`
