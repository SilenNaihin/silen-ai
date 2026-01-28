'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Prose container for article text content.
 * Provides consistent spacing, line height, and text color.
 *
 * @example
 * <Prose>
 *   <p>First paragraph with proper spacing.</p>
 *   <p>Second paragraph automatically spaced.</p>
 * </Prose>
 */
interface ProseProps {
  children: ReactNode;
  className?: string;
}

export function Prose({ children, className = '' }: ProseProps) {
  return (
    <div
      className={`leading-relaxed space-y-3 mb-1 text-neutral-900 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Insight box for key takeaways or explanations.
 * Full border, neutral background.
 *
 * @example
 * <InsightBox title="Why does this work?">
 *   Rotation matrices are orthogonal, so they preserve dot products.
 * </InsightBox>
 */
interface InsightBoxProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function InsightBox({
  children,
  title,
  className = '',
}: InsightBoxProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4 text-neutral-700 ${className}`}
    >
      {title && <p className="font-medium text-neutral-800 mb-2">{title}</p>}
      {children}
    </div>
  );
}

/**
 * Quote box for comparisons, quotes, or side notes.
 * Left border accent style.
 *
 * @example
 * <QuoteBox>
 *   <p><strong>Additive PE:</strong> "Here's position info"</p>
 *   <p><strong>RoPE:</strong> "I'll rotate so relative position falls out"</p>
 * </QuoteBox>
 */
interface QuoteBoxProps {
  children: ReactNode;
  className?: string;
}

export function QuoteBox({ children, className = '' }: QuoteBoxProps) {
  return (
    <div
      className={`bg-neutral-50 border-l-4 border-neutral-300 pl-4 py-3 my-4 ${className}`}
    >
      <div className="text-neutral-700 space-y-2">{children}</div>
    </div>
  );
}

/**
 * Data flow diagram for showing pipelines or transformations.
 * Monospace font with structured layout.
 *
 * @example
 * <DataFlow title="Where rotation happens">
 *   <DataFlow.Step label="Additive">x → x + PE → Wq → q</DataFlow.Step>
 *   <DataFlow.Step label="RoPE">x → Wq → q → rotate(q) → q'</DataFlow.Step>
 * </DataFlow>
 */
interface DataFlowProps {
  children: ReactNode;
  title?: string;
  note?: ReactNode;
  className?: string;
}

interface DataFlowStepProps {
  children: ReactNode;
  label?: string;
}

export function DataFlow({
  children,
  title,
  note,
  className = '',
}: DataFlowProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4 font-mono ${className}`}
    >
      {title && (
        <p className="text-neutral-500 text-sm mb-2 font-sans">{title}</p>
      )}
      <div className="space-y-2">{children}</div>
      {note && (
        <p className="text-neutral-500 text-sm mt-3 font-sans">{note}</p>
      )}
    </div>
  );
}

DataFlow.Step = function DataFlowStep({ children, label }: DataFlowStepProps) {
  return (
    <p>
      {label && <span className="text-neutral-400">{label}: </span>}
      {children}
    </p>
  );
};

/**
 * Styled comparison table with consistent formatting.
 *
 * @example
 * <ComparisonTable
 *   headers={['Property', 'Sinusoidal', 'RoPE']}
 *   rows={[
 *     ['Relative position', 'Implicit', { value: 'Direct', highlight: true }],
 *     ['Where applied', 'Before projection', 'After projection'],
 *   ]}
 * />
 */
interface TableCell {
  value: string;
  highlight?: boolean;
  html?: boolean;
}

interface ComparisonTableProps {
  headers: string[];
  rows: (string | TableCell)[][];
  className?: string;
}

export function ComparisonTable({
  headers,
  rows,
  className = '',
}: ComparisonTableProps) {
  const renderCell = (cell: string | TableCell) => {
    if (typeof cell === 'string') {
      // Auto-detect HTML links
      if (cell.includes('<a ')) {
        return (
          <span
            className="[&_a]:underline [&_a]:text-neutral-600 [&_a:hover]:text-black"
            dangerouslySetInnerHTML={{ __html: cell }}
          />
        );
      }
      return cell;
    }
    if (cell.html) {
      return (
        <span
          className={cell.highlight ? 'text-green-700 font-medium' : ''}
          dangerouslySetInnerHTML={{ __html: cell.value }}
        />
      );
    }
    return (
      <span className={cell.highlight ? 'text-green-700 font-medium' : ''}>
        {cell.value}
      </span>
    );
  };

  return (
    <div className={`my-6 overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-neutral-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-neutral-700">
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Ordered list with consistent styling.
 */
interface OrderedListProps {
  children: ReactNode;
  className?: string;
}

export function OrderedList({ children, className = '' }: OrderedListProps) {
  return (
    <ol
      className={`list-decimal list-outside space-y-1 ml-6 mb-2 ${className}`}
    >
      {children}
    </ol>
  );
}

/**
 * Unordered list with consistent styling.
 */
interface UnorderedListProps {
  children: ReactNode;
  className?: string;
}

export function UnorderedList({
  children,
  className = '',
}: UnorderedListProps) {
  return (
    <ul className={`list-disc list-outside space-y-1 ml-6 my-2 ${className}`}>
      {children}
    </ul>
  );
}

/**
 * Muted text for secondary information, asides, or closing thoughts.
 * Renders as italic, muted color text.
 *
 * @example
 * <MutedText>
 *   This journey from simple intuitions to elegant solutions shows
 *   how careful reasoning leads to robust designs.
 * </MutedText>
 */
interface MutedTextProps {
  children: ReactNode;
  className?: string;
}

export function MutedText({ children, className = '' }: MutedTextProps) {
  return (
    <p className={`text-neutral-600 italic mt-2 ${className}`}>{children}</p>
  );
}

/**
 * Aside box for tangential thoughts, references, or philosophical notes.
 * On desktop (xl+): Appears in the right margin alongside the content.
 * On mobile (<xl): Appears inline as a styled callout.
 *
 * Must be used within an ArticleSection with `position: relative`.
 *
 * @example
 * <Aside title="The Chinese Room">
 *   Understanding language seems to require a robust world model,
 *   but consider Searle's Chinese Room experiment...
 * </Aside>
 */
interface AsideProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Aside({ children, title, className = '' }: AsideProps) {
  return (
    <>
      {/* Desktop: Right margin positioning */}
      <div
        className={`hidden xl:block absolute left-full ml-4 w-72 2xl:ml-8 2xl:w-88 ${className}`}
        style={{ top: 'auto' }}
      >
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm text-neutral-600">
          {title && (
            <p className="font-medium text-neutral-700 mb-2 text-xs uppercase tracking-wide">
              {title}
            </p>
          )}
          <div className="space-y-2">{children}</div>
        </div>
      </div>

      {/* Mobile: Inline callout */}
      <div
        className={`xl:hidden bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4 text-sm text-neutral-600 ${className}`}
      >
        {title && (
          <p className="font-medium text-neutral-700 mb-2 text-xs uppercase tracking-wide">
            {title}
          </p>
        )}
        <div className="space-y-2">{children}</div>
      </div>
    </>
  );
}

/**
 * Lightbox modal for viewing images at full size.
 * Follows common lightbox patterns (click outside to close, Escape key, dark overlay).
 */
interface LightboxProps {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
  isOpen: boolean;
  onClose: () => void;
}

function Lightbox({ src, alt, caption, href, isOpen, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image container */}
          <motion.figure
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {caption && (
              <figcaption className="mt-3 text-sm text-white/70 text-center">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white underline"
                  >
                    {caption}
                  </a>
                ) : (
                  caption
                )}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Figure with image and caption.
 * Caption can include a link (e.g., to source).
 * Side images are clickable and open in a lightbox modal.
 *
 * @example
 * <Figure
 *   src="/images/diagram.png"
 *   alt="Architecture diagram"
 *   caption="System architecture overview"
 *   href="https://source.com"
 * />
 */
interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
  /**
   * On desktop (xl+): render in the right margin (like `Aside`).
   * On mobile (<xl): render inline (default behavior).
   * Side images are clickable and open in a lightbox modal.
   *
   * Must be used within an `ArticleSection` (position: relative) for correct positioning.
   */
  side?: boolean;
  className?: string;
}

export function Figure({
  src,
  alt,
  caption,
  href,
  side = false,
  className = '',
}: FigureProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const content = (
    <>
      <img
        src={src}
        alt={alt}
        className="rounded-lg border border-neutral-200 w-full"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-500 text-center">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-700 underline"
            >
              {caption}
            </a>
          ) : (
            caption
          )}
        </figcaption>
      )}
    </>
  );

  if (!side) {
    return <figure className={`mt-4 mb-2 ${className}`}>{content}</figure>;
  }

  const clickableImage = (
    <button
      onClick={() => setLightboxOpen(true)}
      className="block w-full text-left cursor-zoom-in group"
      aria-label={`View ${alt} in full size`}
    >
      <img
        src={src}
        alt={alt}
        className="rounded-lg border border-neutral-200 w-full transition-all group-hover:border-neutral-400 group-hover:shadow-md"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-500 text-center">
          {href ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                window.open(href, '_blank', 'noopener,noreferrer');
              }}
              className="hover:text-neutral-700 underline cursor-pointer"
            >
              {caption}
            </span>
          ) : (
            caption
          )}
        </figcaption>
      )}
    </button>
  );

  return (
    <>
      {/* Desktop: Right margin positioning (like `Aside`) */}
      <figure
        className={`hidden xl:block absolute left-full ml-4 w-72 2xl:ml-8 2xl:w-88 my-6 ${className}`}
        style={{ top: 'auto' }}
      >
        {clickableImage}
      </figure>

      {/* Mobile: Inline figure */}
      <figure className={`xl:hidden my-6 ${className}`}>{clickableImage}</figure>

      {/* Lightbox modal */}
      <Lightbox
        src={src}
        alt={alt}
        caption={caption}
        href={href}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

/**
 * Inline code styling for commands, file names, etc.
 * Orange accent style for visibility.
 *
 * @example
 * <Code>/ultrathink</Code>
 * <Code>settings.json</Code>
 */
interface CodeProps {
  children: ReactNode;
  className?: string;
}

export function Code({ children, className = '' }: CodeProps) {
  return (
    <code
      className={`text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-sm font-mono ${className}`}
    >
      {children}
    </code>
  );
}

/**
 * Code block with copy button and horizontal scroll.
 */
interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative my-4 ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 bg-white/80 hover:bg-white border border-neutral-200 rounded transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 pt-10 overflow-x-auto text-sm font-mono text-neutral-800 whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}
