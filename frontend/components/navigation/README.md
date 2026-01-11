# Navigation Components

Reusable navigation components for articles.

## Components

### Tabs
Tabbed content system with context-based state management. **Syncs with URL query params** so refreshing maintains the current tab.

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

**URL Sync**: By default, switching tabs updates the URL (e.g., `?tab=advanced`). This means:
- Refreshing the page maintains the current tab
- Users can share links to specific tabs
- Browser back/forward navigation works with tabs

To disable URL sync:
```tsx
<TabsProvider tabs={tabs} queryParam={false}>
```

To use a custom query param name:
```tsx
<TabsProvider tabs={tabs} queryParam="section">
{/* URL will be ?section=advanced */}
```

**Variants**: `default`, `minimal`, `pills`

### Organizing Large Tab Content

For articles with large tab content, keep each tab as a separate component:

```tsx
// app/my-article/page.tsx
import { FoundationsContent } from './FoundationsContent';
import { TrainingContent } from './TrainingContent';

export default function MyArticle() {
  return (
    <TabsProvider tabs={TABS}>
      <ArticleLayout leftContent={...}>
        <TabContent tabId="foundations">
          <FoundationsContent />
        </TabContent>
        <TabContent tabId="training">
          <TrainingContent />
        </TabContent>
      </ArticleLayout>
    </TabsProvider>
  );
}

// app/my-article/FoundationsContent.tsx
export function FoundationsContent() {
  return (
    <>
      <ArticleSection>...</ArticleSection>
      <ArticleSection>...</ArticleSection>
    </>
  );
}
```

This keeps individual files manageable while maintaining the article structure.

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
