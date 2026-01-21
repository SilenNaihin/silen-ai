'use client';

import { CodePanel } from './CodePanel';
import { NotebookCell as NotebookCellType } from '@/lib/notebook-parser';
import { useNotebookContext } from '@/contexts/NotebookContext';

interface NotebookCellProps {
  cell?: NotebookCellType;
  loading?: boolean;
  error?: string | null;
  className?: string;
  /** Enable collapsible behavior */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Start in collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show first N lines when collapsed (for preview mode) */
  previewLines?: number;
  /** Override GitHub URL (defaults to context value) */
  githubUrl?: string;
  /** Show only code (no output) - for code-aside sidebar */
  codeOnly?: boolean;
  /** Show only output (no code) - for code-aside inline */
  outputOnly?: boolean;
}

/**
 * Component to render a Jupyter notebook cell as a CodePanel
 * Automatically handles loading and error states
 *
 * Supports collapsible mode for mobile layouts
 */
export function NotebookCell({
  cell,
  loading,
  error,
  className = '',
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  previewLines = 0,
  githubUrl: githubUrlProp,
  codeOnly = false,
  outputOnly = false,
}: NotebookCellProps) {
  const { githubUrl: contextGithubUrl } = useNotebookContext();
  const githubUrl = githubUrlProp ?? contextGithubUrl;
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

  // Cell not found - return null instead of placeholder
  if (!cell) {
    return null;
  }

  return (
    <CodePanel
      code={cell.code}
      language={cell.language}
      output={cell.output}
      outputImage={cell.outputImage}
      className={className}
      collapsible={collapsible}
      collapsed={collapsed}
      defaultCollapsed={defaultCollapsed}
      onCollapsedChange={onCollapsedChange}
      previewLines={previewLines}
      githubUrl={githubUrl ?? undefined}
      visualization={cell.visualization}
      codeOnly={codeOnly}
      outputOnly={outputOnly}
    />
  );
}

