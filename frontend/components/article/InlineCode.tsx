'use client';

import { useNotebookContext } from '@/contexts/NotebookContext';
import { NotebookCell } from './NotebookCell';

interface InlineCodeProps {
  /** The cell ID to display */
  id: string;
  /** Override expanded state (defaults to cell.expanded from notebook) */
  expanded?: boolean;
  /** Number of preview lines when collapsed */
  previewLines?: number;
  className?: string;
}

/**
 * Inline code cell component that can be placed anywhere in article content.
 * Use this when you need precise control over where code appears.
 *
 * Usage in MDX:
 * <InlineCode id="pe-function" />
 *
 * The cell ID must match a directive in the notebook: # | pe-function inline
 */
export function InlineCode({
  id,
  expanded,
  previewLines = 3,
  className = '',
}: InlineCodeProps) {
  const { cells, loading, error } = useNotebookContext();

  const cell = cells[id];

  if (!cell) {
    // Don't render anything if cell not found (avoids layout shift during loading)
    if (loading) return null;

    // In development, show a warning
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`p-4 border border-amber-300 bg-amber-50 rounded-lg text-sm text-amber-800 ${className}`}>
          Cell not found: <code>{id}</code>
        </div>
      );
    }
    return null;
  }

  // Determine if expanded - prop overrides cell setting
  const defaultCollapsed = expanded !== undefined ? !expanded : !cell.expanded;

  return (
    <div className={`my-6 ${className}`}>
      <NotebookCell
        cell={cell}
        loading={loading}
        error={error}
        collapsible={true}
        defaultCollapsed={defaultCollapsed}
        previewLines={previewLines}
      />
    </div>
  );
}
