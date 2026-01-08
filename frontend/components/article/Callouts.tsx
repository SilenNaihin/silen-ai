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

export function InsightBox({ children, title, className = '' }: InsightBoxProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4 text-sm text-neutral-600 ${className}`}
    >
      {title && (
        <p className="font-medium text-neutral-700 mb-2">{title}</p>
      )}
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
      className={`bg-neutral-50 border-l-4 border-neutral-300 pl-4 py-2 my-4 ${className}`}
    >
      <div className="text-sm text-neutral-700 space-y-1">{children}</div>
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

export function DataFlow({ children, title, note, className = '' }: DataFlowProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4 font-mono text-sm ${className}`}
    >
      {title && (
        <p className="text-neutral-500 text-xs mb-2 font-sans">{title}</p>
      )}
      <div className="space-y-2">{children}</div>
      {note && (
        <p className="text-neutral-500 text-xs mt-3 font-sans">{note}</p>
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
    <ol className={`list-decimal list-inside space-y-1 ml-4 ${className}`}>
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

export function UnorderedList({ children, className = '' }: UnorderedListProps) {
  return (
    <ul className={`list-disc list-inside space-y-1 ml-4 ${className}`}>
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
    <p className={`text-neutral-600 italic ${className}`}>{children}</p>
  );
}
