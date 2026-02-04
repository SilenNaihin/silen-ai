'use client';

import { useState } from 'react';
import { FiCopy, FiGithub, FiCode, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface CodePanelProps {
  code: string;
  language?: string;
  output?: string;
  outputImage?: string;
  githubUrl?: string;
  className?: string;
  /** Enable collapsible behavior */
  collapsible?: boolean;
  /** Controlled collapsed state (overrides internal state) */
  collapsed?: boolean;
  /** Start in collapsed state (only applies when collapsible is true and collapsed is not controlled) */
  defaultCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Label shown in collapsed bar */
  collapsedLabel?: string;
  /** Show first N lines in collapsed preview mode */
  previewLines?: number;
  /** Visualization mode: show only output (no code), for graphs/plots where code is implementation detail */
  visualization?: boolean;
  /** Show only code (no output) - used for code-aside sidebar */
  codeOnly?: boolean;
  /** Show only output (no code) - used for code-aside inline */
  outputOnly?: boolean;
  /** Enable hover effects (only for sidebar cells, not inline) */
  sidebar?: boolean;
  /**
   * Position in right margin on desktop (xl+), inline on mobile.
   * Must be used within an ArticleSection for correct positioning.
   */
  side?: boolean;
}

/**
 * Simple Python syntax highlighter
 */
function highlightPython(code: string): React.ReactNode {
  const keywords =
    /\b(def|class|if|else|elif|for|while|return|import|from|as|with|try|except|finally|raise|pass|break|continue|yield|lambda|True|False|None|and|or|not|in|is)\b/g;
  const strings = /(["'`])((?:\\.|(?!\1).)*?)\1/g;
  const comments = /(#.*$)/gm;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  const parts: Array<{ text: string; type: string; index: number }> = [];

  // Collect all matches with their positions
  let match;

  // Comments
  while ((match = comments.exec(code)) !== null) {
    parts.push({ text: match[0], type: 'comment', index: match.index });
  }

  // Strings
  while ((match = strings.exec(code)) !== null) {
    parts.push({ text: match[0], type: 'string', index: match.index });
  }

  // Keywords
  while ((match = keywords.exec(code)) !== null) {
    parts.push({ text: match[0], type: 'keyword', index: match.index });
  }

  // Numbers
  while ((match = numbers.exec(code)) !== null) {
    parts.push({ text: match[0], type: 'number', index: match.index });
  }

  // Functions
  while ((match = functions.exec(code)) !== null) {
    parts.push({ text: match[0], type: 'function', index: match.index });
  }

  // Sort by index to process in order
  parts.sort((a, b) => a.index - b.index);

  // Build highlighted output
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  parts.forEach((part, i) => {
    // Check if this part overlaps with previous (e.g., keyword inside string)
    const overlaps = parts
      .slice(0, i)
      .some(
        (prev) =>
          prev.index <= part.index && prev.index + prev.text.length > part.index
      );

    if (!overlaps) {
      // Add text before this part
      if (part.index > lastIndex) {
        elements.push(code.slice(lastIndex, part.index));
      }

      // Add highlighted part
      const className =
        part.type === 'keyword'
          ? 'text-purple-600 font-semibold'
          : part.type === 'string'
          ? 'text-green-600'
          : part.type === 'comment'
          ? 'text-neutral-400 italic'
          : part.type === 'number'
          ? 'text-blue-600'
          : part.type === 'function'
          ? 'text-amber-600'
          : '';

      elements.push(
        <span key={i} className={className}>
          {part.text}
        </span>
      );

      lastIndex = part.index + part.text.length;
    }
  });

  // Add remaining text
  if (lastIndex < code.length) {
    elements.push(code.slice(lastIndex));
  }

  return elements.length > 0 ? elements : code;
}

/**
 * Elegant code panel for displaying code snippets with optional output
 * Automatically handles copying code and linking to GitHub
 * Supports collapsible mode for mobile or space-constrained layouts
 */
export function CodePanel({
  code,
  language = 'python',
  output,
  outputImage,
  githubUrl,
  className = '',
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedLabel = 'View Code',
  previewLines = 0,
  visualization = false,
  codeOnly = false,
  outputOnly = false,
  sidebar = false,
  side = false,
}: CodePanelProps) {
  // Hover classes only for sidebar cells
  const hoverClasses = sidebar ? 'hover:shadow-lg hover:border-neutral-300 transition-shadow' : '';
  const [internalCollapsed, setInternalCollapsed] = useState(collapsible && defaultCollapsed);

  // Helper to wrap content in side positioning
  const wrapWithSide = (content: React.ReactNode) => {
    if (!side) return content;
    return (
      <>
        {/* Desktop: Right margin positioning */}
        <div
          className="hidden xl:block absolute left-full ml-4 w-72 2xl:ml-8 2xl:w-88 my-4"
          style={{ top: 'auto' }}
        >
          {content}
        </div>
        {/* Mobile: Inline */}
        <div className="xl:hidden my-4">{content}</div>
      </>
    );
  };

  // Support both controlled and uncontrolled modes
  const isControlled = collapsed !== undefined;
  const isCollapsed = isControlled ? collapsed : internalCollapsed;

  const setIsCollapsed = (value: boolean) => {
    if (!isControlled) {
      setInternalCollapsed(value);
    }
    onCollapsedChange?.(value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleGitHub = () => {
    // Default to main repo if no specific URL provided
    const url = githubUrl || 'https://github.com/silen-z/silen-ai';
    window.open(url, '_blank');
  };

  const highlightedCode = language === 'python' ? highlightPython(code) : code;
  const codeLines = code.split('\n');
  const hasMoreLines = previewLines > 0 && codeLines.length > previewLines;
  const previewCode = previewLines > 0 ? codeLines.slice(0, previewLines).join('\n') : code;
  const highlightedPreview = language === 'python' ? highlightPython(previewCode) : previewCode;

  // Visualization mode: show only output (no code), for graphs/plots
  if (visualization) {
    // Must have some output to show
    if (!outputImage && !output) {
      return null;
    }

    return wrapWithSide(
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {/* Action buttons in top right corner */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <button
            onClick={handleCopy}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 bg-white/80 hover:bg-white border border-neutral-200 rounded shadow-sm transition-colors"
            title="Copy code"
          >
            <FiCopy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleGitHub}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 bg-white/80 hover:bg-white border border-neutral-200 rounded shadow-sm transition-colors"
            title="View on GitHub"
          >
            <FiGithub className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Output only - no "Output:" label */}
        <div className="bg-white">
          {outputImage && (
            <img
              src={outputImage}
              alt="Visualization"
              className="max-w-full h-auto"
            />
          )}
          {output && !outputImage && (
            <pre className="font-mono text-sm text-neutral-900 whitespace-pre-wrap p-4">{output}</pre>
          )}
        </div>
      </div>
    );
  }

  // Output only mode (for code-aside inline): show output with minimal chrome
  if (outputOnly) {
    if (!outputImage && !output) {
      return null;
    }

    return wrapWithSide(
      <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}>
        {outputImage && (
          <img
            src={outputImage}
            alt="Output"
            className="max-w-full h-auto"
          />
        )}
        {output && !outputImage && (
          <div className="p-3 bg-neutral-50">
            <pre className="font-mono text-sm text-neutral-800 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    );
  }

  // Collapsed view: show preview lines if specified, otherwise just a bar
  if (collapsible && isCollapsed) {
    // Preview mode: show first N lines collapsed
    if (previewLines > 0) {
      return wrapWithSide(
        <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${hoverClasses} ${className}`}>
          {/* Code preview with action buttons */}
          <div className="relative">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button
                onClick={handleCopy}
                className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
                title="Copy code"
              >
                <FiCopy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleGitHub}
                className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
                title="View on GitHub"
              >
                <FiGithub className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 pr-20 font-mono text-sm leading-relaxed">
              <pre className="whitespace-pre-wrap text-neutral-900">
                {highlightedPreview}
              </pre>
              {hasMoreLines && (
                <div className="text-neutral-400 mt-1">...</div>
              )}
            </div>
          </div>

          {/* Expand button - right under the code */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-t border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-neutral-600 text-sm"
          >
            <span>Show full code</span>
            <FiChevronDown className="w-4 h-4" />
          </button>

          {/* Output/Image if present - shown below expand button, skip when codeOnly */}
          {!codeOnly && (output || outputImage) && (
            <>
              <div className="border-t border-neutral-200" />
              <div className="px-4 py-3 bg-neutral-50">
                {outputImage && (
                  <img
                    src={outputImage}
                    alt="Output"
                    className="max-w-full h-auto rounded mb-2"
                  />
                )}
                {output && (
                  <>
                    <div className="text-xs text-neutral-500 mb-1">Output:</div>
                    <pre className="font-mono text-sm text-neutral-900 whitespace-pre-wrap">{output}</pre>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    // Simple collapsed bar
    const barHoverClass = sidebar ? 'hover:bg-neutral-50' : '';
    return wrapWithSide(
      <button
        onClick={() => setIsCollapsed(false)}
        className={`w-full flex items-center justify-between px-4 py-3 border border-neutral-200 rounded-lg bg-white transition-colors ${barHoverClass} ${className}`}
      >
        <div className="flex items-center gap-2 text-neutral-600">
          <FiCode className="w-4 h-4" />
          <span className="text-sm font-medium">{collapsedLabel}</span>
        </div>
        <FiChevronDown className="w-4 h-4 text-neutral-400" />
      </button>
    );
  }

  return wrapWithSide(
    <div
      className={`relative border border-neutral-200 rounded-lg overflow-hidden bg-white ${hoverClasses} ${className}`}
    >
      {/* Action buttons in top right */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
            title="Collapse"
          >
            <FiChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={handleCopy}
          className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
          title="Copy code"
        >
          <FiCopy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleGitHub}
          className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
          title="View on GitHub"
        >
          <FiGithub className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Code section with padding to avoid button overlap */}
      <AnimatePresence initial={false}>
        <motion.div
          initial={collapsible ? { height: 0, opacity: 0 } : false}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 pr-20 font-mono text-sm leading-relaxed"
        >
          <pre className="whitespace-pre-wrap text-neutral-900">
            {highlightedCode}
          </pre>
        </motion.div>
      </AnimatePresence>

      {/* Output section - skip when codeOnly */}
      {!codeOnly && (output || outputImage) && (
        <>
          <div className="border-t border-neutral-200" />
          <div className="px-4 py-3 bg-neutral-50">
            {outputImage && (
              <img
                src={outputImage}
                alt="Output"
                className="max-w-full h-auto rounded mb-2"
              />
            )}
            {output && (
              <>
                <div className="text-xs text-neutral-500 mb-1">Output:</div>
                <pre className="font-mono text-sm text-neutral-900 whitespace-pre-wrap">{output}</pre>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Deprecated: kept for backwards compatibility
export function CodeActionButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
