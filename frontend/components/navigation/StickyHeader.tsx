'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TOCDropdown } from './TableOfContents';

interface StickyHeaderProps {
  title: string;
  tabs?: ReactNode;
  threshold?: number;
  className?: string;
}

/**
 * Sticky header with tabs and TOC always visible.
 * Title animates up to join them after scrolling past threshold.
 */
export function StickyHeader({
  title,
  tabs,
  threshold = 200,
  className = '',
}: StickyHeaderProps) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTitle(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 ${className}`}
    >
      <div className="max-w-[1600px] mx-auto px-8 h-14 flex items-center justify-between">
        {/* Left: Back button + Title (animates in after scroll) */}
        <div className="w-[300px] flex items-center gap-3">
          <a
            href="https://silennai.com/blog"
            className="text-neutral-400 hover:text-black transition-colors"
            aria-label="Back to Silen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
          <motion.div
            initial={false}
            animate={{
              opacity: showTitle ? 1 : 0,
              x: showTitle ? 0 : -20,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="font-semibold text-black truncate"
          >
            {title}
          </motion.div>
        </div>

        {/* Center: Tabs (always visible) */}
        {tabs && (
          <div className="absolute left-1/2 -translate-x-1/2">
            {tabs}
          </div>
        )}

        {/* Right: Current Section + TOC (always visible) */}
        <div className="w-[300px] flex justify-end">
          <TOCDropdown />
        </div>
      </div>
    </header>
  );
}

interface ScrollThresholdDetectorProps {
  threshold?: number;
  children: (isPastThreshold: boolean) => ReactNode;
}

/**
 * Utility component that detects when scroll passes a threshold.
 * Useful for conditionally rendering content based on scroll position.
 */
export function ScrollThresholdDetector({
  threshold = 200,
  children,
}: ScrollThresholdDetectorProps) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return <>{children(isPastThreshold)}</>;
}
