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

### `CodePanel`

Elegant code display panel with automatic copy functionality and optional GitHub link.

**Usage:**

```tsx
<CodePanel
  code="2 + 2"
  language="python"
  output="4"
  githubUrl="https://github.com/username/repo"
/>
```

**Props:**

- `code`: string - The code to display (automatically copied when clicking Copy button)
- `language`: string - Programming language (for syntax highlighting context)
- `output`: string - Optional output to display below code
- `githubUrl`: string - Optional GitHub URL (shows GitHub button if provided)
- `className`: string - Optional additional classes

**Features:**

- **Automatic Copy**: Copy button automatically copies the code to clipboard
- **GitHub Link**: GitHub button (optional) opens the URL in a new tab
- **Smart Layout**: Buttons positioned in top-right corner with padding to avoid text overlap
- **Clean Design**: Small, subtle buttons that don't distract from content

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
