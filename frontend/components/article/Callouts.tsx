'use client';

import { ReactNode } from 'react';

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
    <div className={`leading-relaxed space-y-3 text-neutral-900 ${className}`}>
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
      return cell;
    }
    return (
      <span className={cell.highlight ? 'text-green-700 font-medium' : ''}>
        {cell.value}
      </span>
    );
  };

  return (
    <div className={`my-4 overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm border border-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-3 py-2 text-left border-b font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 border-b">
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
    <ol className={`list-decimal list-outside space-y-1 ml-6 ${className}`}>
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
    <ul className={`list-disc list-outside space-y-1 ml-6 ${className}`}>
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
        className={`hidden xl:block absolute left-full ml-8 w-[22rem] ${className}`}
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
 * Figure with image and caption.
 * Caption can include a link (e.g., to source).
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
  className?: string;
}

export function Figure({ src, alt, caption, href, className = '' }: FigureProps) {
  return (
    <figure className={`my-6 ${className}`}>
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
    </figure>
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
