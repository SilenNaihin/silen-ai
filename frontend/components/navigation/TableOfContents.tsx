'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCContextValue {
  items: TOCItem[];
  activeId: string | null;
  registerHeading: (id: string, text: string, level: number) => void;
  unregisterHeading: (id: string) => void;
  setActiveId: (id: string | null) => void;
}

const TOCContext = createContext<TOCContextValue | null>(null);

export function useTOCContext() {
  const context = useContext(TOCContext);
  if (!context) {
    throw new Error('useTOCContext must be used within a TOCProvider');
  }
  return context;
}

interface TOCProviderProps {
  children: ReactNode;
}

/**
 * Provider for Table of Contents state.
 * Tracks registered headings and the currently visible section.
 */
export function TOCProvider({ children }: TOCProviderProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemsRef = useRef<Map<string, TOCItem>>(new Map());

  const registerHeading = useCallback((id: string, text: string, level: number) => {
    // Only include levels 1-3 in the TOC (exclude 4, 5, 6)
    if (level <= 3) {
      itemsRef.current.set(id, { id, text, level });
      setItems(Array.from(itemsRef.current.values()));
    }
  }, []);

  const unregisterHeading = useCallback((id: string) => {
    itemsRef.current.delete(id);
    setItems(Array.from(itemsRef.current.values()));
  }, []);

  // Track which heading is currently visible
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <TOCContext.Provider
      value={{ items, activeId, registerHeading, unregisterHeading, setActiveId }}
    >
      {children}
    </TOCContext.Provider>
  );
}

interface TOCHeadingProps {
  id: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Explicit text to show in TOC. Use when children contain React elements like Math. */
  tocText?: string;
}

// Default styles for each heading level
// More space above (to separate from previous section) than below (to group with content)
const defaultHeadingStyles: Record<number, string> = {
  1: 'text-3xl font-bold mt-8 mb-4 text-black',
  2: 'text-2xl font-bold mt-6 mb-2 text-black',
  3: 'text-xl font-semibold mt-5 mb-2 text-black',
  4: 'text-lg font-semibold mt-4 mb-1 text-black',
  5: 'text-base font-medium mt-3 mb-1 text-black',
  6: 'text-sm font-medium mt-3 mb-1 text-black',
};

/**
 * A heading that auto-registers itself with the TOC.
 * Use this instead of raw h1-h6 elements to have them appear in the TOC.
 *
 * Default styles are applied based on level, but can be overridden with className.
 */
export function TOCHeading({
  id,
  level = 2,
  children,
  className,
  as,
  tocText,
}: TOCHeadingProps) {
  const { registerHeading, unregisterHeading } = useTOCContext();
  const Tag = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
  // Use explicit tocText if provided, otherwise try to extract from string children
  const text = tocText ?? (typeof children === 'string' ? children : '');

  // Use provided className or fall back to default for this level
  const headingClassName = className ?? defaultHeadingStyles[level] ?? '';

  useEffect(() => {
    registerHeading(id, text, level);
    return () => unregisterHeading(id);
  }, [id, text, level, registerHeading, unregisterHeading]);

  return (
    <Tag
      id={id}
      className={headingClassName}
      style={{ scrollMarginTop: '72px' }}
    >
      {children}
    </Tag>
  );
}

interface TOCDropdownProps {
  className?: string;
}

/**
 * Dropdown menu showing all TOC items.
 * Shows on hover and allows jumping to sections.
 */
export function TOCDropdown({ className = '' }: TOCDropdownProps) {
  const { items, activeId } = useTOCContext();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="max-w-[200px] truncate">
          {activeItem?.text || 'Contents'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  item.id === activeId
                    ? 'bg-neutral-100 text-black font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                }`}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 16}px` }}
              >
                {item.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook to get the current section title
 */
export function useCurrentSection(): string | null {
  const { items, activeId } = useTOCContext();
  const activeItem = items.find((item) => item.id === activeId);
  return activeItem?.text || null;
}

/**
 * Hook to get all TOC items
 */
export function useTOCItems(): TOCItem[] {
  const { items } = useTOCContext();
  return items;
}

/**
 * Inline Table of Contents block with configurable columns.
 * Place at the start of an article for quick navigation.
 *
 * @example
 * <TableOfContentsBlock columns={2} />
 * <TableOfContentsBlock columns={3} title="Contents" />
 */
interface TableOfContentsBlockProps {
  columns?: 1 | 2 | 3 | 4;
  title?: string;
  className?: string;
  /** Only show headings of these levels (default: [2, 3]) */
  levels?: number[];
}

export function TableOfContentsBlock({
  columns = 2,
  title,
  className = '',
  levels = [2, 3],
}: TableOfContentsBlockProps) {
  const { items, activeId } = useTOCContext();

  const filteredItems = items.filter((item) => levels.includes(item.level));

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (filteredItems.length === 0) {
    return null;
  }

  const columnClass = {
    1: 'columns-1',
    2: 'columns-1 sm:columns-2',
    3: 'columns-1 sm:columns-2 lg:columns-3',
    4: 'columns-1 sm:columns-2 lg:columns-4',
  }[columns];

  return (
    <nav className={`my-6 ${className}`}>
      {title && (
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          {title}
        </h2>
      )}
      <ul className={`${columnClass} gap-x-8`}>
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className="break-inside-avoid mb-1.5"
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left text-sm hover:text-black transition-colors ${
                item.level === 2
                  ? 'font-medium text-neutral-700'
                  : 'text-neutral-500 pl-3'
              } ${activeId === item.id ? 'text-black' : ''}`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
