'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

/**
 * Renders LaTeX math expressions using KaTeX.
 *
 * @param children - LaTeX expression string
 * @param display - If true, renders as block (centered), otherwise inline
 * @param className - Additional CSS classes
 *
 * @example
 * // Inline math
 * <Math>E = mc^2</Math>
 *
 * // Block/display math
 * <Math display>
 *   PE(pos, 2i) = \sin\left(\frac{pos}{10000^{2i/d}}\right)
 * </Math>
 */
export function Math({ children, display = false, className = '' }: MathProps) {
  if (display) {
    return (
      <div className={`my-6 ${className}`}>
        <BlockMath math={children} />
      </div>
    );
  }

  return <InlineMath math={children} />;
}

/**
 * Convenience component for block/display math
 */
export function MathBlock({ children, className = '' }: Omit<MathProps, 'display'>) {
  return <Math display className={className}>{children}</Math>;
}

/**
 * Formula box with optional label for important equations
 */
interface FormulaBoxProps {
  children: string;
  label?: string;
  className?: string;
}

export function FormulaBox({ children, label, className = '' }: FormulaBoxProps) {
  return (
    <div className={`bg-neutral-50 border border-neutral-200 rounded-lg p-6 my-6 ${className}`}>
      {label && (
        <div className="text-sm text-neutral-500 mb-2 font-medium">{label}</div>
      )}
      <div className="text-center">
        <BlockMath math={children} />
      </div>
    </div>
  );
}
