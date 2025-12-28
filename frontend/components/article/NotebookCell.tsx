'use client';

import { CodePanel, CodeActionButton } from './CodePanel';
import { NotebookCell as NotebookCellType } from '@/lib/notebook-parser';

interface NotebookCellProps {
  cell?: NotebookCellType;
  loading?: boolean;
  error?: string | null;
  onCopy?: (code: string) => void;
  onViewNotebook?: (cell: NotebookCellType) => void;
  className?: string;
}

/**
 * Component to render a Jupyter notebook cell as a CodePanel
 * Automatically handles loading and error states
 */
export function NotebookCell({
  cell,
  loading,
  error,
  onCopy,
  onViewNotebook,
  className = '',
}: NotebookCellProps) {
  // Loading state
  if (loading) {
    return (
      <div className={`border border-neutral-200 rounded-lg p-4 bg-neutral-50 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`border border-red-200 rounded-lg p-4 bg-red-50 ${className}`}>
        <div className="text-sm text-red-600">
          <p className="font-semibold">Failed to load notebook cell</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Cell not found
  if (!cell) {
    return (
      <div className={`border border-neutral-200 rounded-lg p-4 bg-neutral-50 ${className}`}>
        <div className="text-sm text-neutral-500">
          No notebook cell found for this section
        </div>
      </div>
    );
  }

  // Render cell
  const handleCopy = () => {
    if (onCopy) {
      onCopy(cell.code);
    } else {
      navigator.clipboard.writeText(cell.code);
    }
  };

  const handleViewNotebook = () => {
    if (onViewNotebook) {
      onViewNotebook(cell);
    }
  };

  return (
    <CodePanel
      code={cell.code}
      language={cell.language}
      output={cell.output}
      actions={
        <>
          <CodeActionButton onClick={handleCopy}>Copy</CodeActionButton>
          {onViewNotebook && (
            <CodeActionButton onClick={handleViewNotebook}>
              Notebook
            </CodeActionButton>
          )}
        </>
      }
      className={className}
    />
  );
}

