# Navigation Components

Reusable navigation components for articles.

## Components

### Tabs
Tabbed content system with context-based state management.

```tsx
import { TabsProvider, TabButtons, TabContent } from '@/components/navigation';

const tabs = [
  { id: 'intro', label: 'Introduction' },
  { id: 'advanced', label: 'Advanced' },
];

<TabsProvider tabs={tabs} defaultTab="intro">
  <TabButtons variant="minimal" />
  <TabContent tabId="intro">Intro content</TabContent>
  <TabContent tabId="advanced">Advanced content</TabContent>
</TabsProvider>
```

**Variants**: `default`, `minimal`, `pills`

### TableOfContents
Auto-tracking table of contents with heading registration.

```tsx
import { TOCProvider, TOCHeading, TOCDropdown } from '@/components/navigation';

<TOCProvider>
  <TOCDropdown />
  <TOCHeading id="section-1" level={2}>Section 1</TOCHeading>
</TOCProvider>
```

### StickyHeader
Sticky header that appears after scrolling past threshold.

```tsx
import { StickyHeader } from '@/components/navigation';

<StickyHeader
  title="Article Title"
  tabs={<TabButtons variant="minimal" />}
  threshold={200}
/>
```

## Hooks

- `useTabsContext()`: Access tab state
- `useIsTabActive(tabId)`: Check if tab is active
- `useTOCContext()`: Access TOC state
- `useCurrentSection()`: Get current section title
