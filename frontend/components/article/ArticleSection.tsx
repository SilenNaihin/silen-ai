'use client';

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { useNotebookContext } from '@/contexts/NotebookContext';
import { NotebookCell } from './NotebookCell';

interface ArticleSectionProps {
  children: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  /** Override mobile collapsed state for code cells */
  mobileCollapsed?: boolean;
}

/**
 * Article section with optional right-side content (e.g., code panels)
 * Automatically detects notebook cells for elements with IDs
 *
 * Desktop (xl+): Code appears in right margin at same Y position, auto-expands when in view
 * Mobile (<xl): Code appears inline below content, collapsed by default
 *
 * For cells marked as inline, they render in the article body on all screen sizes
 */
export function ArticleSection({
  children,
  rightContent,
  className = '',
  mobileCollapsed = true,
}: ArticleSectionProps) {
  const { cells, loading, error } = useNotebookContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);

  // Detect IDs in children
  useEffect(() => {
    if (!contentRef.current) return;

    // Find any element with an ID attribute
    const elementWithId = contentRef.current.querySelector('[id]');
    if (elementWithId) {
      setDetectedId(elementWithId.id);
    }
  }, [children]);

  // Intersection observer for auto-expand on scroll into view
  useEffect(() => {
    if (!rightPanelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        rootMargin: '-100px 0px -100px 0px', // Trigger when center of viewport
        threshold: 0.1,
      }
    );

    observer.observe(rightPanelRef.current);
    return () => observer.disconnect();
  }, []);

  // Get the cell if it exists
  const cell = detectedId ? cells[detectedId] : null;
  const isInline = cell?.inline === true;

  // Determine what to show in right panel (non-inline cells)
  const hasRightContent = !isInline && (rightContent || cell);

  // Desktop sidebar collapse state - controlled to respond to scroll
  const [desktopCollapsed, setDesktopCollapsed] = useState(true);

  // Update desktop collapse when scrolling into/out of view
  useEffect(() => {
    setDesktopCollapsed(!isInView);
  }, [isInView]);

  // Render right panel content with appropriate props
  const renderRightContent = (isMobile: boolean) => {
    if (rightContent) {
      return rightContent;
    }

    if (cell && !isInline) {
      if (isMobile) {
        // Mobile: uncontrolled, starts collapsed
        return (
          <NotebookCell
            cell={cell}
            loading={loading}
            error={error}
            collapsible={true}
            defaultCollapsed={mobileCollapsed}
            previewLines={3}
          />
        );
      }

      // Desktop: controlled by scroll position
      return (
        <NotebookCell
          cell={cell}
          loading={loading}
          error={error}
          collapsible={true}
          collapsed={desktopCollapsed}
          onCollapsedChange={setDesktopCollapsed}
          previewLines={3}
        />
      );
    }

    return null;
  };

  return (
    <div className={`relative mb-16 ${className}`}>
      {/* Main text content */}
      <div ref={contentRef} className="prose prose-lg max-w-none">
        {children}
      </div>

      {/* Inline code cell - renders in article body on all screen sizes */}
      {isInline && cell && (
        <div className="mt-6">
          <NotebookCell
            cell={cell}
            loading={loading}
            error={error}
            collapsible={true}
            defaultCollapsed={!cell.expanded}
            previewLines={3}
          />
        </div>
      )}

      {/* Desktop: Right panel - absolutely positioned in right margin */}
      {hasRightContent && (
        <div
          ref={rightPanelRef}
          className="hidden xl:block absolute left-full ml-8 top-0 w-[26rem]"
        >
          {renderRightContent(false)}
        </div>
      )}

      {/* Mobile: Inline code below content, collapsed by default */}
      {hasRightContent && (
        <div className="xl:hidden mt-6">
          {renderRightContent(true)}
        </div>
      )}
    </div>
  );
}
