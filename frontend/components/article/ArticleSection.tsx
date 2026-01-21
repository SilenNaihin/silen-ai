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

  // Detect IDs in children (skip headings which are for TOC navigation)
  useEffect(() => {
    if (!contentRef.current) return;

    // Find paragraph or div element with ID (skip headings which are for TOC)
    const elementWithId = contentRef.current.querySelector(
      'p[id], div[id], span[id]'
    );
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
  const isCodeAside = cell?.codeAside === true;

  // code-aside: output inline, code in sidebar
  // Regular inline: both code and output inline
  // Default: code and output in sidebar
  const hasRightContent = rightContent || (cell && (!isInline || isCodeAside));

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

    // For code-aside: show only code in sidebar (no output)
    // For regular cells: show full cell
    if (cell && (!isInline || isCodeAside)) {
      // For code-aside on mobile, we hide the sidebar code since output is inline
      // Users can still access code via the inline output's "View Code" or GitHub link
      if (isCodeAside && isMobile) {
        return null;
      }

      if (isMobile) {
        // Mobile: uncontrolled, starts collapsed
        // Note: mobile sidebar cells still get sidebar={true} for hover effects
        return (
          <NotebookCell
            cell={cell}
            loading={loading}
            error={error}
            collapsible={true}
            defaultCollapsed={mobileCollapsed}
            previewLines={3}
            codeOnly={isCodeAside}
            sidebar={true}
          />
        );
      }

      // Desktop: controlled by scroll position
      // For code-aside, expanded flag controls the sidebar instead of inline
      const shouldStartExpanded = isCodeAside && cell.expanded;
      return (
        <NotebookCell
          cell={cell}
          loading={loading}
          error={error}
          collapsible={true}
          collapsed={shouldStartExpanded ? false : desktopCollapsed}
          onCollapsedChange={setDesktopCollapsed}
          previewLines={3}
          codeOnly={isCodeAside}
          sidebar={true}
        />
      );
    }

    return null;
  };

  // Reduce margin when cell is inline (flows better with content)
  const marginClass = isInline ? 'mb-2' : 'mb-6';

  return (
    <div className={`relative ${marginClass} ${className}`}>
      {/* Main text content */}
      <div ref={contentRef} className="prose prose-base max-w-none">
        {children}
      </div>

      {/* Inline code cell - renders in article body on all screen sizes */}
      {/* For code-aside: only show output inline, code goes to sidebar */}
      {isInline && cell && (
        <div className="mt-3 relative">
          <NotebookCell
            cell={cell}
            loading={loading}
            error={error}
            collapsible={!isCodeAside}
            defaultCollapsed={isCodeAside ? false : !cell.expanded}
            previewLines={3}
            outputOnly={isCodeAside}
          />
          {/* Dashed connector line from output to sidebar code (desktop only, code-aside only) */}
          {isCodeAside && (
            <div
              className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-full w-4 2xl:w-8 h-px border-t border-dashed border-neutral-300 pointer-events-none"
            />
          )}
        </div>
      )}

      {/* Desktop: Right panel - absolutely positioned in right margin */}
      {/* hover:z-50 brings panel to front when hovered, preventing overlap issues */}
      {hasRightContent && (
        <div
          ref={rightPanelRef}
          className="hidden xl:block absolute left-full ml-4 2xl:ml-8 top-0 w-80 2xl:w-[26rem] z-10 hover:z-50 transition-[z-index] duration-0"
        >
          {renderRightContent(false)}
        </div>
      )}

      {/* Mobile: Inline code below content, collapsed by default */}
      {hasRightContent && (
        <div className="xl:hidden mt-4">{renderRightContent(true)}</div>
      )}
    </div>
  );
}
