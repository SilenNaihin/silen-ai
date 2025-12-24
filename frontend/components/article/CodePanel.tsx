'use client';

import { FiCopy, FiGithub } from 'react-icons/fi';

interface CodePanelProps {
  code: string;
  language?: string;
  output?: string;
  githubUrl?: string;
  className?: string;
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
 */
export function CodePanel({
  code,
  language = 'python',
  output,
  githubUrl,
  className = '',
}: CodePanelProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleGitHub = () => {
    if (githubUrl) {
      window.open(githubUrl, '_blank');
    }
  };

  const highlightedCode = language === 'python' ? highlightPython(code) : code;

  return (
    <div
      className={`relative border border-neutral-200 rounded-lg overflow-hidden bg-white ${className}`}
    >
      {/* Action buttons in top right */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
          title="Copy code"
        >
          <FiCopy className="w-3.5 h-3.5" />
        </button>
        {githubUrl && (
          <button
            onClick={handleGitHub}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded shadow-sm transition-colors"
            title="View on GitHub"
          >
            <FiGithub className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Code section with padding to avoid button overlap */}
      <div className="p-4 pr-20 font-mono text-sm leading-relaxed">
        <pre className="whitespace-pre-wrap text-neutral-900">
          {highlightedCode}
        </pre>
      </div>

      {/* Output section */}
      {output && (
        <>
          <div className="border-t border-neutral-200" />
          <div className="px-4 py-3 bg-neutral-50">
            <div className="text-xs text-neutral-500 mb-1">Output:</div>
            <pre className="font-mono text-sm text-neutral-900">{output}</pre>
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
