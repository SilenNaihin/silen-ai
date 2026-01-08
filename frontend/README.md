# Interactive Article Platform

A Next.js platform for creating interactive, notebook-driven educational articles with scroll-synced animations.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/positional-encoding` to see the example article.

## Documentation

- **[Article System Guide](ARTICLE_SYSTEM.md)**: Complete guide to the article system
- **[Notebook Integration](lib/NOTEBOOK_CODE.md)**: How to link Jupyter notebooks to articles
- **[Article Components](components/article/README.md)**: Core article components
- **[Animation System](components/animation/README.md)**: Scroll-synced animations
- **[Navigation Components](components/navigation/README.md)**: Tabs, TOC, sticky header
- **[Interactive Components](components/interactive/README.md)**: In-browser Python execution

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Key Features

- Notebook cell integration via directives
- Scroll-synced left panel animations
- Tabbed article content
- Auto-tracking table of contents
- Responsive code display (desktop margin / mobile inline collapsed)
- In-browser Python via Pyodide

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Recharts
- Jest + React Testing Library
