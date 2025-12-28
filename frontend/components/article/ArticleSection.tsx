'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNotebookContext } from '@/contexts/NotebookContext';
import { NotebookCell } from './NotebookCell';

interface ArticleSectionProps {
  children: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

/**
 * Article section with optional right-side content (e.g., code panels)
 * Automatically detects notebook cells for elements with IDs
 */
export function ArticleSection({ children, rightContent, className = '' }: ArticleSectionProps) {
  const { cells, loading, error } = useNotebookContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [detectedId, setDetectedId] = useState<string | null>(null);

  // Detect IDs in children
  useEffect(() => {
    if (!contentRef.current) return;

    // Find any element with an ID attribute
    const elementWithId = contentRef.current.querySelector('[id]');
    if (elementWithId) {
      setDetectedId(elementWithId.id);
    }
  }, [children]);

  // Determine what to show in right panel
  let rightPanelContent = rightContent;
  
  // If no explicit rightContent, check for notebook cell matching detected ID
  if (!rightPanelContent && detectedId && cells[detectedId]) {
    rightPanelContent = (
      <NotebookCell 
        cell={cells[detectedId]} 
        loading={loading} 
        error={error}
      />
    );
  }

  return (
    <div className={`relative mb-16 ${className}`}>
      {/* Main text content */}
      <div ref={contentRef} className="prose prose-lg max-w-none">
        {children}
      </div>

      {/* Right panel - absolutely positioned in right margin */}
      {rightPanelContent && (
        <div className="hidden xl:block absolute left-full ml-8 top-0 w-[26rem]">
          {rightPanelContent}
        </div>
      )}
    </div>
  );
}
